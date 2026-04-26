import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

export type LogEntry = {
  id: string;
  text: string;
  color: string;
  timestamp: string;
};

export type AppState = {
  nodes: Node[];
  edges: Edge[];
  logs: LogEntry[];
  isSidebarOpen: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, data: any) => void;
  toggleSidebar: (open?: boolean) => void;
  runWorkflow: () => void;
  clearLogs: () => void;
};

const initialNodes: Node[] = [
  {
    id: 'log-1',
    type: 'logNode',
    position: { x: 400, y: 200 },
    data: { text: 'Hello Automation Workspace!' },
  },
  {
    id: 'color-1',
    type: 'colorNode',
    position: { x: 100, y: 200 },
    data: { color: '#ef4444' }, // default red
  },
];

const initialEdges: Edge[] = [];

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  logs: [],
  isSidebarOpen: false,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true }, get().edges),
    });
  },
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
  toggleSidebar: (open?: boolean) => {
    set({ isSidebarOpen: open !== undefined ? open : !get().isSidebarOpen });
  },
  clearLogs: () => {
    set({ logs: [] });
  },
  runWorkflow: () => {
    const { nodes, edges } = get();
    const newLogs: LogEntry[] = [];

    // Find all Log nodes
    const logNodes = nodes.filter((n) => n.type === 'logNode');

    logNodes.forEach((logNode) => {
      // Find incoming edges to this log node
      const incomingEdges = edges.filter((e) => e.target === logNode.id);
      
      let textColor = '#ffffff'; // default color
      
      // If there's an incoming connection from a color node, use its color
      if (incomingEdges.length > 0) {
        const sourceNodeId = incomingEdges[0].source;
        const sourceNode = nodes.find((n) => n.id === sourceNodeId);
        
        if (sourceNode && sourceNode.type === 'colorNode') {
          textColor = sourceNode.data.color as string;
        }
      }

      newLogs.push({
        id: crypto.randomUUID(),
        text: (logNode.data.text as string) || 'Empty Log',
        color: textColor,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    set({ logs: newLogs, isSidebarOpen: true });
  },
}));
