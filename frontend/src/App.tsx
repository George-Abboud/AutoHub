import { useCallback, useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from './store';
import { motion, AnimatePresence } from 'framer-motion';
import { HomePage } from './HomePage';
import { DocsPage } from './DocsPage';
import { SettingsPage } from './SettingsPage';
import { FlowCanvas } from './components/flow/FlowCanvas';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { hexToRgb } from './utils/colors';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { supabase } from './lib/supabaseClient';
import { ProfilePage } from './ProfilePage';
import { useProfileViewModel } from './viewmodels/useProfileViewModel';
import { ProfileSetupModal } from './components/ui/ProfileSetupModal';

/**
 * Syncs the CSS custom properties (--accent-color, --accent-color-rgb)
 * with the Zustand accentColor state so that index.css overrides update live.
 */
const ThemeSync = () => {
  const accentColor = useStore(s => s.accentColor);

  useEffect(() => {
    const rgb = hexToRgb(accentColor);
    if (rgb) {
      document.documentElement.style.setProperty('--accent-color', accentColor);
      document.documentElement.style.setProperty(
        '--accent-color-rgb',
        `${rgb.r}, ${rgb.g}, ${rgb.b}`
      );
    }
  }, [accentColor]);

  return null;
};

/** Initial node placed in every new workspace canvas. */
const INITIAL_START_NODE = {
  id: 'start-1',
  type: 'startNode',
  position: { x: 100, y: 150 },
  data: {},
  deletable: false,
} as const;

function App() {
  const currentView = useStore(s => s.currentView);
  const activeWorkspaceId = useStore(s => s.activeWorkspaceId);
  const workspaces = useStore(s => s.workspaces);
  const setUser = useStore(s => s.setUser);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  useKeyboardShortcuts();

  const { user, profile, isLoading: isProfileLoading } = useProfileViewModel();


  const handleClearConfirm = useCallback(() => {
    if (!activeWorkspaceId) return;
    useStore.setState({
      workspaces: workspaces.map(ws =>
        ws.id === activeWorkspaceId
          ? { ...ws, nodes: [INITIAL_START_NODE], edges: [] }
          : ws
      ),
    });
    setShowClearConfirm(false);
  }, [activeWorkspaceId, workspaces]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#171717', fontFamily: '"Inter", sans-serif' }}>
      <ThemeSync />
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomePage />
          </motion.div>
        )}

        {currentView === 'docs' && (
          <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DocsPage />
          </motion.div>
        )}

        {currentView === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SettingsPage />
          </motion.div>
        )}

        {currentView === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfilePage />
          </motion.div>
        )}

        {currentView === 'editor' && (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReactFlowProvider>
              <FlowCanvas onRequestClear={() => setShowClearConfirm(true)} />
              <AnimatePresence>
                {showClearConfirm && (
                  <ConfirmModal
                    onConfirm={handleClearConfirm}
                    onCancel={() => setShowClearConfirm(false)}
                  />
                )}
              </AnimatePresence>
            </ReactFlowProvider>
          </motion.div>
        )}
      </AnimatePresence>

      {user && !profile?.full_name && !isProfileLoading && (
        <ProfileSetupModal />
      )}
    </div>
  );
}

export default App;
