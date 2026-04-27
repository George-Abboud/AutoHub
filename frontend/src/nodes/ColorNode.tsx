import { useState, memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Palette, Check, Settings2, Grid } from 'lucide-react';
import { NodeDeleteButton } from '../components/ui/NodeDeleteButton';
import { hexToRgb, rgbToHex, rgbToHsl } from '../utils/colors';
import { useFlowViewModel } from '../viewmodels/useFlowViewModel';
import { useExecutionViewModel } from '../viewmodels/useExecutionViewModel';
import { useAppViewModel } from '../viewmodels/useAppViewModel';

const presets = [
  '#f2572b', // Vibrant Orange
  '#22c55e', // Vibrant Green
  '#3b82f6', // Vibrant Blue
  '#eab308', // Vibrant Yellow
  '#a855f7', // Vibrant Purple
  '#ec4899', // Vibrant Pink
];


export const ColorNode = memo(({ id, data, selected }: { id: string; data: Record<string, unknown> | null; selected?: boolean }) => {
  const { updateNodeData, isLocked } = useFlowViewModel();
  const { runningNodeIds } = useExecutionViewModel();
  const { accentColor } = useAppViewModel();
  const isRunning = runningNodeIds.includes(id);

  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  const [isHovered, setIsHovered] = useState(false);

  const currentColor = (typeof data?.color === 'string' ? data.color : undefined) || accentColor;
  const lastCustomColor = typeof data?.lastCustomColor === 'string' ? data.lastCustomColor : null;
  const rgb = hexToRgb(currentColor) ?? { r: 255, g: 255, b: 255 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const onColorSelect = (color: string, isCustom = false) => {
    if (isLocked) return;
    const updates: Record<string, unknown> = { color };
    if (isCustom) {
      updates.lastCustomColor = color;
    }
    updateNodeData(id, updates);
  };

  const showHover = isHovered && !isLocked;

  // Determine colors to show in presets grid
  const displayColors = lastCustomColor && !presets.includes(lastCustomColor) 
    ? [...presets, lastCustomColor] 
    : presets;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#171717',
        border: isRunning ? `2px solid ${accentColor}` : (selected || showHover) ? `1px solid ${accentColor}` : '1px solid #262626',
        borderRadius: '16px',
        width: '240px',
        boxShadow: isRunning ? `0 0 20px ${accentColor}4d` : (selected || showHover) ? `0 8px 32px ${accentColor}26` : '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isRunning ? 'scale(1.02)' : showHover ? 'scale(1.05)' : 'scale(1)',
        position: 'relative',
        cursor: isLocked ? 'default' : 'grab'
      }}
    >
      <Handle type="target" position={Position.Left} />

      {/* Delete Button */}
      {(selected || isHovered) && !isLocked && <NodeDeleteButton nodeId={id} />}

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #262626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `${accentColor}08`,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px',
            background: `${accentColor}1a`,
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Palette size={14} color={accentColor} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#EBEBEB' }}>Color Node</span>
        </div>

        {/* Tab Switcher */}
        {!isLocked && (
          <div style={{ display: 'flex', background: '#171717', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => setMode('presets')}
              style={{
                padding: '6px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                background: mode === 'presets' ? '#262626' : 'transparent',
                color: mode === 'presets' ? accentColor : '#737373',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setMode('custom')}
              style={{
                padding: '6px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                background: mode === 'custom' ? '#262626' : 'transparent',
                color: mode === 'custom' ? accentColor : '#737373',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Settings2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        {mode === 'presets' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', opacity: isLocked ? 0.6 : 1 }}>
            {displayColors.map((c) => (
              <div
                key={c}
                onClick={() => onColorSelect(c)}
                style={{
                  height: '32px',
                  background: c,
                  borderRadius: '8px',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: currentColor === c ? '2px solid white' : '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: currentColor === c ? `0 0 15px ${c}88` : 'none',
                  transform: (currentColor === c && !isLocked) ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {currentColor === c && <Check size={14} color="white" />}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: isLocked ? 0.6 : 1 }}>
            {/* Color Preview & Native Picker */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '8px', background: currentColor,
                border: '2px solid #262626', position: 'relative', overflow: 'hidden'
              }}>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => onColorSelect(e.target.value, true)}
                  disabled={isLocked}
                  style={{ position: 'absolute', top: -10, left: -10, width: 80, height: 80, cursor: isLocked ? 'not-allowed' : 'pointer', opacity: 0 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', color: '#737373', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Hex Code</label>
                <input
                  type="text"
                  value={currentColor.toUpperCase()}
                  onChange={(e) => onColorSelect(e.target.value, true)}
                  disabled={isLocked}
                  style={{
                    width: '100%', background: '#171717', border: '1px solid #262626', borderRadius: '4px',
                    padding: '6px 8px', color: isLocked ? '#525252' : '#EBEBEB', fontSize: '12px', fontFamily: 'monospace',
                    cursor: isLocked ? 'not-allowed' : 'text'
                  }}
                />
              </div>
            </div>

            {/* RGB Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '9px', color: '#404040', display: 'block', marginBottom: '2px' }}>R</label>
                <input type="number" value={rgb.r} disabled={isLocked} onChange={(e) => onColorSelect(rgbToHex(Number(e.target.value), rgb.g, rgb.b), true)} style={{ width: '100%', background: '#171717', border: '1px solid #262626', borderRadius: '4px', padding: '4px', color: isLocked ? '#525252' : '#EBEBEB', fontSize: '11px', cursor: isLocked ? 'not-allowed' : 'text' }} />
              </div>
              <div>
                <label style={{ fontSize: '9px', color: '#404040', display: 'block', marginBottom: '2px' }}>G</label>
                <input type="number" value={rgb.g} disabled={isLocked} onChange={(e) => onColorSelect(rgbToHex(rgb.r, Number(e.target.value), rgb.b), true)} style={{ width: '100%', background: '#171717', border: '1px solid #262626', borderRadius: '4px', padding: '4px', color: isLocked ? '#525252' : '#EBEBEB', fontSize: '11px', cursor: isLocked ? 'not-allowed' : 'text' }} />
              </div>
              <div>
                <label style={{ fontSize: '9px', color: '#404040', display: 'block', marginBottom: '2px' }}>B</label>
                <input type="number" value={rgb.b} disabled={isLocked} onChange={(e) => onColorSelect(rgbToHex(rgb.r, rgb.g, Number(e.target.value)), true)} style={{ width: '100%', background: '#171717', border: '1px solid #262626', borderRadius: '4px', padding: '4px', color: isLocked ? '#525252' : '#EBEBEB', fontSize: '11px', cursor: isLocked ? 'not-allowed' : 'text' }} />
              </div>
            </div>

            {/* HSL Info (Read-only for aesthetic) */}
            <div style={{ fontSize: '10px', color: '#404040', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#171717', borderRadius: '4px' }}>
              <span>H: {hsl.h}°</span>
              <span>S: {hsl.s}%</span>
              <span>L: {hsl.l}%</span>
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
});
