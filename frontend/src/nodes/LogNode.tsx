import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PenLine } from 'lucide-react';
import { NodeDeleteButton } from '../components/ui/NodeDeleteButton';
import { useFlowViewModel } from '../viewmodels/useFlowViewModel';
import { useExecutionViewModel } from '../viewmodels/useExecutionViewModel';
import { useAppViewModel } from '../viewmodels/useAppViewModel';

export const LogNode = memo(({ id, data, selected }: { id: string; data: Record<string, unknown> | null; selected?: boolean }) => {
  const { updateNodeData, isLocked } = useFlowViewModel();
  const { runningNodeIds } = useExecutionViewModel();
  const { accentColor } = useAppViewModel();
  const isRunning = runningNodeIds.includes(id);
  const [isHovered, setIsHovered] = React.useState(false);

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    updateNodeData(id, { text: evt.target.value });
  };

  const showHover = isHovered && !isLocked;

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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isRunning ? 'scale(1.02)' : showHover ? 'scale(1.05)' : 'scale(1)',
        position: 'relative',
        overflow: 'visible',
        cursor: isLocked ? 'default' : 'grab'
      }}
    >
      <Handle type="target" position={Position.Left} />
      
      {/* Delete Button */}
      {(selected || isHovered) && !isLocked && <NodeDeleteButton nodeId={id} />}
      
      {/* Node Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #262626',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: `${accentColor}08`,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <div style={{
          width: '24px', height: '24px',
          background: `${accentColor}1a`,
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <PenLine size={14} color={accentColor} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#EBEBEB' }}>Log Output</span>
      </div>

      {/* Node Body */}
      <div style={{ padding: '16px' }}>
        <input
          type="text"
          value={(data?.text as string) || ''}
          onChange={onChange}
          className="nodrag"
          placeholder="Type something..."
          disabled={isLocked}
          style={{
            width: '100%',
            background: '#171717',
            border: '1px solid #262626',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '12px',
            color: isLocked ? '#525252' : '#EBEBEB',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            cursor: isLocked ? 'not-allowed' : 'text',
            opacity: isLocked ? 0.6 : 1
          }}
          onFocus={e => { if (!isLocked) (e.currentTarget as HTMLElement).style.borderColor = accentColor; }}
          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#262626'; }}
        />
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
});
