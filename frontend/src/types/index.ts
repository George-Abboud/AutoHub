import type { Node, Edge } from '@xyflow/react';

export type LogEntry = {
  id: string;
  nodeId: string;
  message: string;
  color: string;
  timestamp: string;
};

export type TraceEntry = {
  id: string;
  type: string;
  nodeId: string;
  message: string;
  colorData?: string;
  timestamp: string;
  batchId?: string;
};

export type ExecutionRun = {
  id: string;
  timestamp: string;
  traces: TraceEntry[];
};

export type Workspace = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  history: ExecutionRun[];
  createdAt: string;
};

export interface UserProfile {
  id: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}
