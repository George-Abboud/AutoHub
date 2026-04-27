import { useStore, type AppState } from '../store';

/**
 * ViewModel for system settings, visual configuration, and data persistence.
 */
export const useSettingsViewModel = () => {
  const accentColor = useStore(s => s.accentColor);
  const gridStyle = useStore(s => s.gridStyle);
  const edgeType = useStore(s => s.edgeType);
  const snapToGrid = useStore(s => s.snapToGrid);
  const edgePattern = useStore(s => s.edgePattern);
  const resetStore = useStore(s => s.resetStore);

  const updateSetting = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    useStore.setState({ [key]: value } as Pick<AppState, K>);
  };

  return {
    accentColor,
    gridStyle,
    edgeType,
    snapToGrid,
    edgePattern,
    resetStore,
    updateSetting
  };
};
