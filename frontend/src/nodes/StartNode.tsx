import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Square } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useExecutionViewModel } from '../viewmodels/useExecutionViewModel';
import { useFlowViewModel } from '../viewmodels/useFlowViewModel';
import { useAppViewModel } from '../viewmodels/useAppViewModel';
import { useWorkspaceViewModel } from '../viewmodels/useWorkspaceViewModel';

export const StartNode = memo(({ id, selected }: { id: string; selected?: boolean }) => {
  const { runWorkflow, stopWorkflow, isRunning, runningNodeIds } = useExecutionViewModel();
  const { isLocked } = useFlowViewModel();
  const { accentColor } = useAppViewModel();
  const { activeWorkspace } = useWorkspaceViewModel();
  const nodeIsActive = runningNodeIds.includes(id);
  const [isHovered, setIsHovered] = React.useState(false);
  const nodes = activeWorkspace?.nodes || [];
  const edges = activeWorkspace?.edges || [];
  const isTriggerConnected = edges.some(e => e.source === id);
  const canRun = nodes.length > 1 && isTriggerConnected;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canRun && !isRunning) return;
    if (isRunning) {
      stopWorkflow();
    } else {
      runWorkflow();
    }
  };

  const showHover = isHovered && !isLocked;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#171717',
        border: nodeIsActive ? `2px solid ${accentColor}` : (selected || showHover) ? `1px solid ${accentColor}` : '1px solid #262626',
        borderRadius: '16px',
        width: '240px',
        padding: '0', 
        boxShadow: nodeIsActive ? `0 0 20px ${accentColor}4d` : (selected || showHover) ? `0 8px 32px ${accentColor}26` : '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: nodeIsActive ? 'scale(1.02)' : showHover ? 'scale(1.05)' : 'scale(1)',
        position: 'relative',
        overflow: 'visible',
        cursor: isLocked ? 'default' : 'grab'
      }}
    >
      <Handle type="source" position={Position.Right} />
      
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
          <Play size={14} color={accentColor} fill={accentColor} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#EBEBEB' }}>Workflow Trigger</span>
      </div>

      {/* Node Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ margin: 0, fontSize: '11px', color: (isLocked || !canRun) ? '#525252' : '#A3A3A3', lineHeight: '1.5' }}>
          {!canRun && !isRunning ? 'Connect to at least one node to execute.' : 'Manual trigger to start the spectrum flow execution.'}
          {isLocked && <span style={{ display: 'block', color: accentColor, marginTop: '4px', fontSize: '10px', fontWeight: 800 }}>[ Workspace Locked ]</span>}
        </p>
        
        <Button
          variant={isRunning ? 'outline' : (canRun ? 'primary' : 'outline')}
          size="lg"
          onClick={handleAction}
          disabled={!isRunning && (!canRun || isLocked)}
          style={{ 
            width: '100%', 
            // Custom styles to override variants if needed
            ...(isRunning ? {
              borderColor: '#404040',
              color: '#A3A3A3',
              background: 'rgba(255,255,255,0.02)',
              boxShadow: 'none'
            } : !canRun ? {
              opacity: 0.5,
              borderColor: '#262626',
              color: '#525252',
              cursor: 'not-allowed'
            } : {})
          }}
          whileHover={isRunning ? { scale: 1.02, background: 'rgba(255,255,255,0.05)' } : (canRun ? undefined : {})}
          icon={isRunning ? <Square size={16} fill="#A3A3A3" color="#A3A3A3" /> : <Play size={16} fill="white" color="white" />}
        >
          {isRunning ? 'Stop Workflow' : 'Run Workflow'}
        </Button>
      </div>
    </div>
  );
});
