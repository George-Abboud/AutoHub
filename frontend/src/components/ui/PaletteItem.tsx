import React from 'react';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

interface PaletteItemProps {
  label: string;
  nodeType: string;
  icon: React.ReactNode;
  onAdd: () => void;
}

export const PaletteItem: React.FC<PaletteItemProps> = ({ label, nodeType, icon, onAdd }) => {
  const [hovered, setHovered] = React.useState(false);
  const { accentColor: accent } = useAppViewModel();

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/vibeflow-node', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '12px',
        border: `1px solid ${hovered ? accent : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? `${accent}11` : 'rgba(255,255,255,0.02)',
        cursor: 'grab',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
      }}
    >
      <div style={{
        width: '24px', height: '24px',
        borderRadius: '6px',
        background: `${accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <span style={{ fontSize: '11px', fontWeight: 800, color: hovered ? '#EBEBEB' : '#A3A3A3' }}>
        {label}
      </span>
    </div>
  );
};
