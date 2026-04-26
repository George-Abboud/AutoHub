import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';
import { Palette } from 'lucide-react';

const COLORS = [
  { name: 'Crimson',   value: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
  { name: 'Orange',    value: '#f97316', glow: 'rgba(249,115,22,0.5)' },
  { name: 'Amber',     value: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  { name: 'Emerald',   value: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  { name: 'Sky',       value: '#38bdf8', glow: 'rgba(56,189,248,0.5)' },
  { name: 'Indigo',    value: '#818cf8', glow: 'rgba(129,140,248,0.5)' },
  { name: 'Fuchsia',   value: '#e879f9', glow: 'rgba(232,121,249,0.5)' },
  { name: 'Rose',      value: '#fb7185', glow: 'rgba(251,113,133,0.5)' },
  { name: 'White',     value: '#f8fafc', glow: 'rgba(248,250,252,0.5)' },
];

export const ColorNode = ({ id, data }: { id: string; data: { color?: string } }) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const selected = data.color || '#818cf8';
  const selectedInfo = COLORS.find(c => c.value === selected);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(40,15,60,0.95) 100%)',
        border: '1px solid rgba(232,121,249,0.35)',
        borderRadius: '16px',
        width: '230px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(232,121,249,0.2) 0%, rgba(232,121,249,0.05) 100%)',
          borderBottom: '1px solid rgba(232,121,249,0.25)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div style={{
          background: 'rgba(232,121,249,0.2)',
          borderRadius: '8px',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(232,121,249,0.3)',
        }}>
          <Palette size={14} color="#e879f9" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fae8ff', letterSpacing: '0.02em' }}>
          Color Picker
        </span>
        <div style={{
          marginLeft: 'auto',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#e879f9',
          boxShadow: '0 0 6px #e879f9',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: '14px' }}>
        {/* Preview */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px',
          padding: '8px 12px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: selected,
            boxShadow: `0 0 12px ${selectedInfo?.glow || selected}`,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
            {selectedInfo?.name || 'Custom'}
          </span>
        </div>

        {/* Color Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {COLORS.map((c) => (
            <button
              key={c.value}
              className="nodrag"
              onClick={() => updateNodeData(id, { color: c.value })}
              title={c.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: c.value,
                border: data.color === c.value
                  ? `2.5px solid white`
                  : '2px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: data.color === c.value
                  ? `0 0 14px ${c.glow}`
                  : 'none',
                transform: data.color === c.value ? 'scale(1.2)' : 'scale(1)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'; }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = data.color === c.value ? 'scale(1.2)' : 'scale(1)';
              }}
            />
          ))}
        </div>
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#e879f9', right: -6, borderColor: 'rgba(232,121,249,0.6)' }}
      />
    </div>
  );
};
