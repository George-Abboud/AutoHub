import React from 'react';
import { Palette, PenLine } from 'lucide-react';
import { PaletteItem } from '../ui/PaletteItem';
import { useFlowViewModel } from '../../viewmodels/useFlowViewModel';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

interface FlowPaletteProps {
  onAddNode: (type: string, position: { x: number, y: number }) => void;
}

export const FlowPalette: React.FC<FlowPaletteProps> = ({ onAddNode }) => {
  const { isLocked } = useFlowViewModel();
  const { accentColor } = useAppViewModel();

  return (
    <div style={{
      position: 'absolute', left: '24px', top: '76px', zIndex: 30,
      background: 'rgba(23, 23, 23, 0.85)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px',
      padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px',
      boxShadow: '0 24px 60px rgba(0,0,0,0.6)', width: '150px',
      opacity: isLocked ? 0.4 : 1,
      pointerEvents: isLocked ? 'none' : 'all',
      transition: 'all 0.3s ease',
      cursor: isLocked ? 'not-allowed' : 'default'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Nodes</span>
      </div>
      <PaletteItem label="Color" nodeType="colorNode" icon={<Palette size={14} color={accentColor} />} onAdd={() => onAddNode('colorNode', { x: 300, y: 200 })} />
      <PaletteItem label="Log" nodeType="logNode" icon={<PenLine size={14} color={accentColor} />} onAdd={() => onAddNode('logNode', { x: 400, y: 200 })} />
    </div>
  );
};
