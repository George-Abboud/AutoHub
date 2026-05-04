import React from 'react';
import { motion } from 'framer-motion';
import { useReactFlow } from '@xyflow/react';
import { ArrowLeft, Plus, Minus, Maximize, Trash2, Lock, Unlock, Cloud } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { useFlowViewModel } from '../../viewmodels/useFlowViewModel';
import { useWorkspaceViewModel } from '../../viewmodels/useWorkspaceViewModel';
import { HeaderButton } from '../ui/HeaderButton';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface FlowHeaderProps {
  workspaceName: string;
  onRequestClear: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({ workspaceName, onRequestClear }) => {
  const { isLocked, toggleLock, toggleZenMode } = useFlowViewModel();
  const { goHome } = useWorkspaceViewModel();
  const { zoomIn, zoomOut } = useReactFlow();
  const isSyncing = useStore(s => s.isSyncing);
  const accentColor = useStore(s => s.accentColor);

  return (
    <header style={{
      height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', background: '#171717', borderBottom: '1px solid #262626',
      flexShrink: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.05)' }}
          onClick={goHome}
          style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        <div style={{ width: '1px', height: '24px', background: '#262626' }} />
        <Logo size={24} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#EBEBEB' }}>{workspaceName}</span>
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ display: 'flex', alignItems: 'center' }}
                title="Syncing to cloud..."
              >
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>
                  <Cloud size={14} color={accentColor} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <HeaderButton icon={Plus} onClick={() => zoomIn()} title="Zoom In" />
          <HeaderButton icon={Minus} onClick={() => zoomOut()} title="Zoom Out" />
          <HeaderButton icon={Maximize} onClick={toggleZenMode} title="Enter Zen Mode" />
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
          <HeaderButton 
            icon={isLocked ? Lock : Unlock} 
            onClick={toggleLock} 
            title={isLocked ? "Unlock Workspace" : "Lock Workspace"} 
            active={isLocked}
          />
        </div>

        <div style={{ width: '1px', height: '24px', background: '#262626' }} />

        <Button
          variant="subtle"
          onClick={onRequestClear}
          disabled={isLocked}
          icon={<Trash2 size={14} />}
        >
          Clear
        </Button>
      </div>
    </header>
  );
};
