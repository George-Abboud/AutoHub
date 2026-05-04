import { useStore } from '../store';

/**
 * ViewModel for global application state and visual identity.
 */
export const useAppViewModel = () => {
  const currentView = useStore(s => s.currentView);
  const accentColor = useStore(s => s.accentColor);
  const isSidebarOpen = useStore(s => s.isSidebarOpen);
  const toggleSidebar = useStore(s => s.toggleSidebar);
  const profile = useStore(s => s.profile);
  const settings = useStore(s => s.settings);

  return {
    currentView,
    accentColor,
    isSidebarOpen,
    profile,
    settings,
    toggleSidebar
  };
};
