import { Layout, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';
import { Logo } from '../ui/Logo';

export const Sidebar = () => {
  const currentView = useStore(s => s.currentView);
  const { accentColor } = useAppViewModel();
  
  const menuItems = [
    { icon: Layout, label: 'My Workspaces', view: 'home' },
    { icon: FileText, label: 'Docs', view: 'docs' },
    { icon: Settings, label: 'Settings', view: 'settings' },
  ];

  return (
    <motion.div
      initial={{ x: -20, y: '-50%', opacity: 0 }}
      animate={{ x: 0, y: '-50%', opacity: 1 }}
      style={{
        position: 'fixed', left: '24px', top: '50%',
        zIndex: 100, display: 'flex', flexDirection: 'column', gap: '20px',
        background: '#171717',
        padding: '24px 12px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        alignItems: 'center'
      }}
    >
      <div style={{ marginBottom: '12px', paddingBottom: '20px', borderBottom: '1px solid #262626' }}>
        <Logo size={24} />
      </div>
      {menuItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (item.view === 'home' || item.view === 'activity' || item.view === 'docs' || item.view === 'settings') {
                useStore.setState({ currentView: item.view as any });
              }
            }}
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: isActive ? `${accentColor}1a` : 'transparent',
              border: 'none', color: isActive ? accentColor : '#737373',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.2s, background 0.2s'
            }}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
          </motion.button>
        );
      })}
    </motion.div>
  );
};
