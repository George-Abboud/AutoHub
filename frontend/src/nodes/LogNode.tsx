import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';
import { Type } from 'lucide-react';

export const LogNode = ({ id, data }: { id: string; data: { text?: string } }) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(23,37,84,0.95) 100%)',
        border: '1px solid rgba(99,102,241,0.4)',
        borderRadius: '16px',
        width: '260px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}
    >
      {/* Target handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#818cf8', left: -6, borderColor: 'rgba(99,102,241,0.6)' }}
      />

      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)',
          borderBottom: '1px solid rgba(99,102,241,0.3)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div style={{
          background: 'rgba(99,102,241,0.25)',
          borderRadius: '8px',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(99,102,241,0.3)',
        }}>
          <Type size={14} color="#a5b4fc" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0e7ff', letterSpacing: '0.02em' }}>
          Log Output
        </span>
        <div style={{
          marginLeft: 'auto',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#818cf8',
          boxShadow: '0 0 6px #818cf8',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: '14px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Message
        </label>
        <input
          className="nodrag"
          type="text"
          value={data.text || ''}
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
          placeholder="Enter log message..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#e2e8f0',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(99,102,241,0.8)';
            e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(99,102,241,0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <p style={{ marginTop: '8px', fontSize: '11px', color: '#334155', lineHeight: '1.4' }}>
          Connect a Color node → to tint the output text
        </p>
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#818cf8', right: -6, borderColor: 'rgba(99,102,241,0.6)' }}
      />
    </div>
  );
};
