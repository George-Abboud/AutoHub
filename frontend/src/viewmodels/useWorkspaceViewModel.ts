import { useStore } from '../store';

/**
 * ViewModel for workspace lifecycle and management.
 */
export const useWorkspaceViewModel = () => {
  const workspaces = useStore(s => s.workspaces);
  const activeWorkspaceId = useStore(s => s.activeWorkspaceId);
  const createWorkspace = useStore(s => s.createWorkspace);
  const deleteWorkspace = useStore(s => s.deleteWorkspace);
  const selectWorkspace = useStore(s => s.selectWorkspace);
  const renameWorkspace = useStore(s => s.renameWorkspace);
  const goHome = useStore(s => s.goHome);

  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId) || null;

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    createWorkspace,
    deleteWorkspace,
    renameWorkspace,
    selectWorkspace,
    goHome
  };
};
