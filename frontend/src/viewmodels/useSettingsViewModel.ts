import { useStore, type AppState } from '../store';
import { supabase } from '../lib/supabaseClient';

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

  const apiKeys = useStore(s => s.settings?.api_keys || {});

  const updateSetting = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    useStore.setState({ [key]: value } as Pick<AppState, K>);
    const state = useStore.getState();
    if (key === 'accentColor' || key === 'gridStyle' || key === 'isZenMode') {
      state.syncSettings();
    }
  };

  const updateApiKeys = async (keys: Record<string, string>) => {
    const state = useStore.getState();
    const user = state.user;
    if (!user) return;

    const newSettings = { ...state.settings!, api_keys: keys };
    useStore.setState({ settings: newSettings });
    
    await supabase.from('user_settings').upsert({
      user_id: user.id,
      api_keys: keys,
      updated_at: new Date().toISOString()
    });
  };

  return {
    accentColor,
    gridStyle,
    edgeType,
    snapToGrid,
    edgePattern,
    apiKeys,
    resetStore,
    updateSetting,
    updateApiKeys
  };
};
