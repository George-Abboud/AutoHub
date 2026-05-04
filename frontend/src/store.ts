import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Connection,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import type { User } from '@supabase/supabase-js';

import { supabase } from './lib/supabaseClient';
import type { LogEntry, TraceEntry, Workspace, UserProfile, UserSettings } from './types';
import { getSourceColor, mixColors } from './utils/colors';

export type AppState = {
  // Auth & Profile
  user: User | null;
  profile: UserProfile | null;
  settings: UserSettings | null;

  // Navigation
  currentView: 'home' | 'editor' | 'docs' | 'settings' | 'profile';
  
  // Data (Now loaded from 'workflows' table)
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  
  // Customization (Now part of 'user_settings' table)
  accentColor: string;
  gridStyle: 'dots' | 'lines' | 'none';
  edgeType: 'bezier' | 'step' | 'straight';
  snapToGrid: boolean;
  edgePattern: 'solid' | 'dashed';

  // Runtime
  logs: LogEntry[];
  liveTrace: TraceEntry[];
  isSidebarOpen: boolean;
  isAIChatbotOpen: boolean;
  isRunning: boolean;
  isLocked: boolean;
  isZenMode: boolean;
  runningNodeIds: string[];
  activeEdges: string[];
  executionTime: number;
  isGlobalLoading: boolean;

  // Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  updateEdgeStyles: () => void;
  deleteNode: (id: string) => void;
  toggleSidebar: (open?: boolean) => void;
  toggleAIChatbot: (open?: boolean) => void;
  toggleLock: () => void;
  setApiKey: (provider: string, key: string) => Promise<void>;
  toggleZenMode: () => void;
  setGlobalLoading: (val: boolean) => void;

  runWorkflow: () => Promise<void>;
  stopWorkflow: () => void;
  clearLogs: () => void;
  
  // Workspace Actions
  createWorkspace: (name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  renameWorkspace: (id: string, name: string) => Promise<void>;
  selectWorkspace: (id: string) => void;
  goHome: () => void;
  resetStore: () => void;
  
  // Auth & Sync Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  loadInitialData: () => Promise<void>;
  syncWorkspace: (wsId: string) => Promise<void>;
  syncSettings: () => Promise<void>;
  
  // Chat Actions
  loadChatMessages: () => Promise<any[]>;
  saveChatMessage: (msg: ChatMessage) => Promise<void>;
};

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 100, y: 150 },
    data: {},
    deletable: false,
  },
];

export const useStore = create<AppState>()((set, get) => ({
      user: null,
      profile: null,
      settings: null,
      currentView: 'home',
      workspaces: [],
      activeWorkspaceId: null,

      accentColor: '#F2572B',
      gridStyle: 'dots',
      edgeType: 'step',
      snapToGrid: true,
      edgePattern: 'solid',
      
      logs: [],
      liveTrace: [],
      isSidebarOpen: false,
      isAIChatbotOpen: false,
      isRunning: false,
      isLocked: false,
      isZenMode: false,
      runningNodeIds: [],
      activeEdges: [],
      executionTime: 0,
      isGlobalLoading: false,

      onNodesChange: (changes: NodeChange[]) => {
        const { activeWorkspaceId, workspaces } = get();
        if (!activeWorkspaceId) return;

        const updatedWorkspaces = workspaces.map(ws => {
          if (ws.id === activeWorkspaceId) {
            return { ...ws, nodes: applyNodeChanges(changes, ws.nodes) };
          }
          return ws;
        });

        set({ workspaces: updatedWorkspaces });
        get().updateEdgeStyles();
        get().syncWorkspace(activeWorkspaceId);
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        const { activeWorkspaceId, workspaces } = get();
        if (!activeWorkspaceId) return;

        const updatedWorkspaces = workspaces.map(ws => {
          if (ws.id === activeWorkspaceId) {
            return { ...ws, edges: applyEdgeChanges(changes, ws.edges) };
          }
          return ws;
        });

        set({ workspaces: updatedWorkspaces });
        get().updateEdgeStyles();
        get().syncWorkspace(activeWorkspaceId);
      },

      onConnect: (connection: Connection) => {
        const { activeWorkspaceId, workspaces } = get();
        if (!activeWorkspaceId) return;

        const updatedWorkspaces = workspaces.map(ws => {
          if (ws.id === activeWorkspaceId) {
            return {
              ...ws,
              edges: addEdge({ 
                ...connection, 
                type: 'colorEdge', 
                animated: false,
                style: { strokeWidth: 3, stroke: '#404040' } 
              }, ws.edges),
            };
          }
          return ws;
        });

        set({ workspaces: updatedWorkspaces });
        get().updateEdgeStyles();
        get().syncWorkspace(activeWorkspaceId);
      },

      updateNodeData: (nodeId: string, data: Record<string, unknown>) => {
        const { activeWorkspaceId, workspaces } = get();
        if (!activeWorkspaceId) return;

        const updatedWorkspaces = workspaces.map(ws => {
          if (ws.id === activeWorkspaceId) {
            return {
              ...ws,
              nodes: ws.nodes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)
            };
          }
          return ws;
        });

        set({ workspaces: updatedWorkspaces });
        get().updateEdgeStyles();
        get().syncWorkspace(activeWorkspaceId);
      },

      toggleSidebar: (open?: boolean) => set({ isSidebarOpen: open !== undefined ? open : !get().isSidebarOpen }),
      toggleAIChatbot: (open?: boolean) => set({ isAIChatbotOpen: open !== undefined ? open : !get().isAIChatbotOpen }),
      toggleLock: () => set({ isLocked: !get().isLocked }),
      toggleZenMode: () => {
        set({ isZenMode: !get().isZenMode });
        get().syncSettings();
      },
      setGlobalLoading: (val: boolean) => set({ isGlobalLoading: val }),
      clearLogs: () => {
        const { activeWorkspaceId, workspaces } = get();
        set({ 
          liveTrace: [], 
          logs: [],
          workspaces: workspaces.map(w => w.id === activeWorkspaceId ? { ...w, history: [] } : w)
        });
        if (activeWorkspaceId) get().syncWorkspace(activeWorkspaceId);
      },
      resetStore: () => {
        set({
          currentView: 'home',
          workspaces: [],
          activeWorkspaceId: null,
          accentColor: '#F2572B',
          gridStyle: 'dots',
          edgeType: 'step',
          snapToGrid: true,
          edgePattern: 'solid',
          logs: [],
          liveTrace: [],
          isSidebarOpen: false,
          isRunning: false,
          isLocked: false,
          isZenMode: false,
          runningNodeIds: [],
          activeEdges: [],
          executionTime: 0
        });
        window.location.reload();
      },
      stopWorkflow: () => {
        set(state => ({ 
          isRunning: false, 
          runningNodeIds: [], 
          activeEdges: [],
          liveTrace: [...state.liveTrace, {
            id: `stop-${Date.now()}`,
            type: 'system',
            nodeId: 'system',
            message: 'Execution Stopped',
            timestamp: new Date().toLocaleTimeString()
          }]
        }));
        get().updateEdgeStyles();
      },
      deleteNode: (id: string) => {
        const { activeWorkspaceId, workspaces, isLocked } = get();
        if (id === 'start-1' || isLocked || !activeWorkspaceId) return;

        const updatedWorkspaces = workspaces.map(ws => {
          if (ws.id === activeWorkspaceId) {
            return {
              ...ws,
              nodes: ws.nodes.filter(n => n.id !== id),
              edges: ws.edges.filter(e => e.source !== id && e.target !== id)
            };
          }
          return ws;
        });

        set({ workspaces: updatedWorkspaces });
        get().syncWorkspace(activeWorkspaceId);
      },

      // Auth & Data Fetching
      setUser: (user) => {
        set({ user });
        if (user) get().loadInitialData();
      },
      setProfile: (profile) => set({ profile }),
      setSettings: (settings) => {
        if (settings) {
          set({ 
            settings,
            accentColor: settings.accent_color,
            gridStyle: settings.grid_style as any,
            isZenMode: settings.is_zen_mode
          });
        }
      },

      loadInitialData: async () => {
        const user = get().user;
        if (!user) return;

        try {
          // 1. Fetch Profile
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (profile) set({ profile });

          // 2. Fetch Settings
          const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
          if (settings) {
            get().setSettings(settings);
          } else {
            // Create default settings if not exists
            const defaultSettings = {
              user_id: user.id,
              theme_mode: 'dark',
              accent_color: '#F2572B',
              grid_style: 'dots',
              is_zen_mode: false,
              api_keys: {}
            };
            await supabase.from('user_settings').insert(defaultSettings);
            get().setSettings(defaultSettings as UserSettings);
          }

          // 3. Fetch Workflows
          const { data: workflows } = await supabase.from('workflows').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
          if (workflows) {
            const mappedWorkspaces: Workspace[] = workflows.map(w => ({
              id: w.id,
              user_id: w.user_id,
              name: w.name,
              nodes: w.nodes,
              edges: w.edges,
              history: w.history || [],
              createdAt: new Date(w.created_at).toLocaleDateString()
            }));
            set({ workspaces: mappedWorkspaces });
          }
        } catch (err) {
          console.error('Error loading initial data:', err);
        }
      },

      // Sync Logic
      syncWorkspace: async (wsId) => {
        const ws = get().workspaces.find(w => w.id === wsId);
        if (!ws) return;

        try {
          await supabase.from('workflows').upsert({
            id: ws.id,
            user_id: ws.user_id || get().user?.id,
            name: ws.name,
            nodes: ws.nodes,
            edges: ws.edges,
            history: ws.history,
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.error('Sync failed for workspace:', wsId, err);
        }
      },

      loadChatMessages: async () => {
        const user = get().user;
        if (!user) return;
        try {
          const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
          
          if (data) {
            // Map data to ChatMessage type if needed
            // (Assuming Supabase columns match our type)
            return data as any; 
          }
        } catch (err) {
          console.error('Failed to load chat:', err);
        }
        return [];
      },

      saveChatMessage: async (msg) => {
        const user = get().user;
        if (!user) return;
        try {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          });
        } catch (err) {
          console.error('Failed to save message:', err);
        }
      },

      syncSettings: async () => {
        const user = get().user;
        if (!user) return;

        try {
          await supabase.from('user_settings').upsert({
            user_id: user.id,
            accent_color: get().accentColor,
            grid_style: get().gridStyle,
            is_zen_mode: get().isZenMode,
            theme_mode: 'dark', // Fixed for now
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.error('Sync failed for settings:', err);
        }
      },

      setApiKey: async (provider: string, key: string) => {
        const user = get().user;
        const settings = get().settings;
        if (!user || !settings) return;

        const newApiKeys = { ...settings.api_keys, [provider]: key };
        const newSettings = { ...settings, api_keys: newApiKeys };

        set({ settings: newSettings });

        try {
          await supabase.from('user_settings').update({
            api_keys: newApiKeys,
            updated_at: new Date().toISOString()
          }).eq('user_id', user.id);
        } catch (err) {
          console.error('Failed to save API key:', err);
        }
      },

      // Workspace Management
      createWorkspace: async (name: string) => {
        get().setGlobalLoading(true);
        const user = get().user;
        if (!user) { get().setGlobalLoading(false); return; }

        const newWsData = {
          user_id: user.id,
          name: name || 'Untitled Automation',
          nodes: initialNodes,
          edges: [],
          history: []
        };

        const { data, error } = await supabase.from('workflows').insert(newWsData).select().single();
        
        if (error) {
          console.error('Error creating workspace:', error);
          get().setGlobalLoading(false);
          return;
        }

        const newWs: Workspace = {
          id: data.id,
          user_id: data.user_id,
          name: data.name,
          nodes: data.nodes,
          edges: data.edges,
          history: data.history || [],
          createdAt: new Date(data.created_at).toLocaleDateString()
        };

        set(state => ({
          workspaces: [newWs, ...state.workspaces],
          activeWorkspaceId: newWs.id,
          currentView: 'editor',
          liveTrace: [],
          isRunning: false,
        }));
        get().setGlobalLoading(false);
      },

      deleteWorkspace: async (id: string) => {
        get().setGlobalLoading(true);
        const { error } = await supabase.from('workflows').delete().eq('id', id);
        if (error) {
          console.error('Error deleting workspace:', error);
          get().setGlobalLoading(false);
          return;
        }

        set(state => ({
          workspaces: state.workspaces.filter(ws => ws.id !== id),
          activeWorkspaceId: state.activeWorkspaceId === id ? null : state.activeWorkspaceId,
          currentView: state.activeWorkspaceId === id ? 'home' : state.currentView
        }));
        get().setGlobalLoading(false);
      },

      renameWorkspace: async (id: string, name: string) => {
        get().setGlobalLoading(true);
        const { error } = await supabase.from('workflows').update({ name }).eq('id', id);
        if (error) {
          console.error('Error renaming workspace:', error);
          get().setGlobalLoading(false);
          return;
        }

        set(state => ({
          workspaces: state.workspaces.map(ws =>
            ws.id === id ? { ...ws, name } : ws
          )
        }));
        get().setGlobalLoading(false);
      },

      selectWorkspace: (id: string) => {
        const ws = get().workspaces.find(w => w.id === id);
        const lastRun = ws?.history[0];
        set({ 
          activeWorkspaceId: id, 
          currentView: 'editor', 
          liveTrace: lastRun ? lastRun.traces : [], 
          isLocked: false,
          isZenMode: false,
        });
        setTimeout(() => get().updateEdgeStyles(), 50);
      },

      goHome: () => set({ currentView: 'home', activeWorkspaceId: null, isRunning: false, isZenMode: false }),

      updateEdgeStyles: () => {
        const { activeWorkspaceId, workspaces, activeEdges, isRunning } = get();
        if (!activeWorkspaceId) return;
        
        const ws = workspaces.find(w => w.id === activeWorkspaceId);
        if (!ws) return;

        const newEdges = ws.edges.map((edge) => {
          const isActive = activeEdges.includes(edge.id);
          let stroke = '#404040';
          let animated = false;

          if (isRunning && isActive) {
            const sourceColors = getSourceColor(edge.source, ws.nodes, ws.edges);
            stroke = mixColors(sourceColors);
            if (stroke === '#404040') stroke = get().accentColor;
            animated = true;
          }

          return {
            ...edge,
            animated,
            style: { 
              ...edge.style, 
              stroke, 
              strokeWidth: isActive ? 4 : 3,
              transition: 'stroke 0.4s ease, stroke-width 0.4s ease'
            },
          };
        });

        set({
          workspaces: workspaces.map(w => w.id === activeWorkspaceId ? { ...w, edges: newEdges } : w)
        });
      },

      runWorkflow: async () => {
        const { activeWorkspaceId, workspaces } = get();
        if (!activeWorkspaceId) return;
        const ws = workspaces.find(w => w.id === activeWorkspaceId);
        if (!ws) return;

        set(state => ({
          isSidebarOpen: false, 
          isRunning: true, 
          activeEdges: [],
          runningNodeIds: [],
          executionTime: 0,
          liveTrace: [...state.liveTrace, {
            id: `divider-${Date.now()}`,
            type: 'divider',
            nodeId: 'system',
            message: 'New Execution Cycle',
            timestamp: new Date().toLocaleTimeString()
          }]
        }));

        const startTime = Date.now();
        const timerInterval = setInterval(() => {
          set({ executionTime: Date.now() - startTime });
        }, 100);

        try {
          get().updateEdgeStyles();
          let currentNodes = ws.nodes.filter(n => n.type === 'startNode');
          const visitedNodes = new Set<string>();
          
          while (currentNodes.length > 0 && get().isRunning) {
            const batchId = `batch-${Date.now()}-${Math.random()}`;
            set({ runningNodeIds: currentNodes.map(n => n.id) });

            await Promise.all(currentNodes.map(async (node) => {
              let traceMessage = '';
              let traceColor = undefined;

              if (node.type === 'startNode') {
                traceMessage = 'System: Workflow initialized.';
              } else if (node.type === 'colorNode') {
                traceMessage = `Shift: Color -> ${node.data.color || '#none'}`;
                traceColor = node.data.color as string;
              } else if (node.type === 'logNode') {
                const upstreamColors = getSourceColor(node.id, ws.nodes, ws.edges);
                traceMessage = `Output: "${node.data.text || 'null'}"`;
                traceColor = mixColors(upstreamColors);
              }

              set(state => ({
                liveTrace: [...state.liveTrace, {
                  id: Math.random().toString(),
                  type: node.type as string,
                  nodeId: node.id,
                  message: traceMessage,
                  colorData: traceColor,
                  timestamp: new Date().toLocaleTimeString(),
                  batchId 
                }]
              }));
            }));

            await new Promise(r => setTimeout(r, 1200));
            set({ runningNodeIds: [] });

            const nextEdges = ws.edges.filter(e => currentNodes.some(n => n.id === e.source));
            if (nextEdges.length === 0) break;

            set({ activeEdges: nextEdges.map(e => e.id) });
            get().updateEdgeStyles();
            await new Promise(r => setTimeout(r, 800));

            const nextNodeIds = nextEdges.map(e => e.target);
            currentNodes = ws.nodes.filter(n => nextNodeIds.includes(n.id) && !visitedNodes.has(n.id));
            currentNodes.forEach(n => visitedNodes.add(n.id));
          }

          if (get().isRunning) {
            const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
            set(state => ({
              liveTrace: [...state.liveTrace, {
                id: `end-${Date.now()}`,
                type: 'system',
                nodeId: 'system',
                message: `Cycle Complete: ${finalTime}s`,
                timestamp: new Date().toLocaleTimeString()
              }]
            }));
          }

        } finally {
          clearInterval(timerInterval);
          const finalTrace = get().liveTrace;
          set(state => ({ 
            isRunning: false, 
            activeEdges: [], 
            runningNodeIds: [],
            workspaces: state.workspaces.map(w => w.id === activeWorkspaceId ? {
              ...w,
              history: [{ id: `run-${Date.now()}`, timestamp: new Date().toLocaleString(), traces: finalTrace }, ...w.history].slice(0, 5)
            } : w)
          }));
          get().updateEdgeStyles();
          get().syncWorkspace(activeWorkspaceId);
        }
      },
}));
