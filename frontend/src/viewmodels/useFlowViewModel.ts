import { useStore } from '../store';

/**
 * ViewModel for the React Flow canvas, node interactions, and locking mechanisms.
 */
export const useFlowViewModel = () => {
  const activeWorkspaceId = useStore(s => s.activeWorkspaceId);
  const workspaces = useStore(s => s.workspaces);
  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

  const nodes = activeWorkspace?.nodes || [];
  const edges = activeWorkspace?.edges || [];

  const onNodesChange = useStore(s => s.onNodesChange);
  const onEdgesChange = useStore(s => s.onEdgesChange);
  const onConnect = useStore(s => s.onConnect);
  const updateNodeData = useStore(s => s.updateNodeData);
  const deleteNode = useStore(s => s.deleteNode);

  const isLocked = useStore(s => s.isLocked);
  const toggleLock = useStore(s => s.toggleLock);
  const isZenMode = useStore(s => s.isZenMode);
  const toggleZenMode = useStore(s => s.toggleZenMode);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeData,
    deleteNode,
    isLocked,
    toggleLock,
    isZenMode,
    toggleZenMode
  };
};
