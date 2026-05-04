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

import type { LogEntry, TraceEntry, Workspace, UserProfile } from './types';
import { getSourceColor, mixColors } from './utils/colors';
import type { User } from '@supabase/supabase-js';

export type AppState = {
  // Auth & Profile
  user: User | null;
  profile: UserProfile | null;

  // Navigation
  currentView: 'home' | 'editor' | 'docs' | 'settings' | 'profile';
  
  // Customization
  accentColor: string;
  gridStyle: 'dots' | 'lines' | 'none';
  edgeType: 'bezier' | 'step' | 'straight';
  snapToGrid: boolean;
  edgePattern: 'solid' | 'dashed';

  // Data
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  
  // Runtime (per workspace)
  logs: LogEntry[];
  liveTrace: TraceEntry[];
  isSidebarOpen: boolean;
  isRunning: boolean;
  isLocked: boolean;
  isZenMode: boolean;
  runningNodeIds: string[];
  activeEdges: string[];
  executionTime: number;

  // Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  updateEdgeStyles: () => void;
  deleteNode: (id: string) => void;
  toggleSidebar: (open?: boolean) => void;
  toggleLock: () => void;
  toggleZenMode: () => void;

  runWorkflow: () => Promise<void>;
  stopWorkflow: () => void;
  clearLogs: () => void;
  
  // Workspace Actions
  createWorkspace: (name: string) => void;
  deleteWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  selectWorkspace: (id: string) => void;
  goHome: () => void;
  resetStore: () => void;
  
  // Auth Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
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
      executionTime: 0,

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
      },

      toggleSidebar: (open?: boolean) => set({ isSidebarOpen: open !== undefined ? open : !get().isSidebarOpen }),
      toggleLock: () => set({ isLocked: !get().isLocked }),
      toggleZenMode: () => set({ isZenMode: !get().isZenMode }),
      clearLogs: () => {
        const { activeWorkspaceId, workspaces } = get();
        set({ 
          liveTrace: [], 
          logs: [],
          workspaces: workspaces.map(w => w.id === activeWorkspaceId ? { ...w, history: [] } : w)
        });
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
      },

      // Auth & Profile
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),

      // Workspace Management
      createWorkspace: (name: string) => {
        const newWs: Workspace = {
          id: `ws-${Date.now()}`,
          name: name || 'Untitled Automation',
          nodes: initialNodes,
          edges: [],
          history: [],
          createdAt: new Date().toLocaleDateString()
        };
        set(state => ({
          workspaces: [newWs, ...state.workspaces],
          activeWorkspaceId: newWs.id,
          currentView: 'editor',
          liveTrace: [],
          isRunning: false,
        }));
      },

      deleteWorkspace: (id: string) => {
        set(state => ({
          workspaces: state.workspaces.filter(ws => ws.id !== id),
          activeWorkspaceId: state.activeWorkspaceId === id ? null : state.activeWorkspaceId,
          currentView: state.activeWorkspaceId === id ? 'home' : state.currentView
        }));
      },

      renameWorkspace: (id: string, name: string) => {
        set(state => ({
          workspaces: state.workspaces.map(ws =>
            ws.id === id ? { ...ws, name } : ws
          )
        }));
      },

      selectWorkspace: (id: string) => {
        const ws = get().workspaces.find(w => w.id === id);
        // Restore latest history as liveTrace if available
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
        }
      },
}));
