import { useStore } from '../store';

/**
 * ViewModel for global application state and visual identity.
 */
export const useAppViewModel = () => {
  const currentView = useStore(s => s.currentView);
  const accentColor = useStore(s => s.accentColor);
  const isSidebarOpen = useStore(s => s.isSidebarOpen);
  const toggleSidebar = useStore(s => s.toggleSidebar);

  return {
    currentView,
    accentColor,
    isSidebarOpen,
    toggleSidebar
  };
};
