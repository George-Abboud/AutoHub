import { useEffect } from 'react';
import { useStore } from '../store';

/**
 * Registers global keyboard shortcuts for the editor view.
 * Only active shortcuts implemented in the store are included.
 *
 * Shortcuts:
 *  - Ctrl + Enter : Run / Stop workflow
 *  - Z            : Toggle Zen Mode
 *  - L            : Toggle Lock
 *  - Escape       : Go Home
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Ignore shortcuts when user is typing
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const state = useStore.getState();
      const { currentView, isRunning, workspaces, activeWorkspaceId } = state;
      const isEditor = currentView === 'editor';

      // Ctrl + Enter → Run or Stop
      if (e.ctrlKey && e.key === 'Enter' && isEditor) {
        e.preventDefault();
        if (isRunning) {
          state.stopWorkflow();
        } else {
          const ws = workspaces.find(w => w.id === activeWorkspaceId);
          const isConnected = ws?.edges.some(edge => edge.source === 'start-1');
          if (isConnected) state.runWorkflow();
        }
      }

      // Z → Toggle Zen Mode
      if (e.key.toLowerCase() === 'z' && !e.ctrlKey && !e.metaKey && isEditor) {
        state.toggleZenMode();
      }

      // L → Toggle Lock
      if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.metaKey && isEditor) {
        state.toggleLock();
      }

      // Escape → Go Home
      if (e.key === 'Escape' && currentView !== 'home') {
        state.goHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);
};
