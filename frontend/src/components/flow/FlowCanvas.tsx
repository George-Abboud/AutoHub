import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useReactFlow,
} from '@xyflow/react';
import type { Node } from '@xyflow/react';
import { Minimize } from 'lucide-react';
import { useStore } from '../../store';
import { LogNode } from '../../nodes/LogNode';
import { ColorNode } from '../../nodes/ColorNode';
import { StartNode } from '../../nodes/StartNode';
import ColorEdge from '../../ColorEdge';
import { ExecutionPanel } from '../../ExecutionPanel';
import { FlowHeader } from '../layout/FlowHeader';
import { FlowPalette } from './FlowPalette';
import { useFlowViewModel } from '../../viewmodels/useFlowViewModel';
import { useSettingsViewModel } from '../../viewmodels/useSettingsViewModel';
import { useWorkspaceViewModel } from '../../viewmodels/useWorkspaceViewModel';

const nodeTypes = {
  logNode: LogNode,
  colorNode: ColorNode,
  startNode: StartNode,
};

const edgeTypes = {
  colorEdge: ColorEdge,
};

interface FlowCanvasProps {
  onRequestClear: () => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({ onRequestClear }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, isLocked, isZenMode, toggleZenMode } = useFlowViewModel();
  const { accentColor, gridStyle, edgeType, edgePattern, snapToGrid } = useSettingsViewModel();
  const { activeWorkspaceId } = useWorkspaceViewModel();
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const activeWs = useStore(s => s.workspaces).find(ws => ws.id === activeWorkspaceId);

  const addNodeAtPos = useCallback((type: string, position: { x: number; y: number }) => {
    if (isLocked) return;
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id, type, position,
      data: type === 'colorNode' ? { color: accentColor } : { text: 'New log message' },
    };
    useStore.setState({
      workspaces: useStore.getState().workspaces.map(ws => 
        ws.id === activeWorkspaceId ? { ...ws, nodes: [...ws.nodes, newNode] } : ws
      )
    });
  }, [activeWorkspaceId, isLocked, accentColor]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isLocked) return;
    const nodeType = e.dataTransfer.getData('application/vibeflow-node');
    if (!nodeType || !reactFlowWrapper.current) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = screenToFlowPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    addNodeAtPos(nodeType, position);
  }, [screenToFlowPosition, addNodeAtPos, isLocked]);

  if (!activeWs) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#171717', overflow: 'hidden', position: 'relative', color: '#EBEBEB', fontFamily: '"Inter", sans-serif' }}>
      {!isZenMode && <FlowPalette onAddNode={addNodeAtPos} />}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {!isZenMode && <FlowHeader workspaceName={activeWs.name} onRequestClear={onRequestClear} />}

        <main ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} 
            onDrop={onDrop} 
            onDragOver={(e) => e.preventDefault()}
            nodeTypes={nodeTypes} edgeTypes={edgeTypes}
            fitView snapToGrid={snapToGrid} snapGrid={gridStyle === 'lines' ? [60, 60] : [20, 20]}
            nodesDraggable={!isLocked}
            nodesConnectable={!isLocked}
            panOnDrag={true}
            style={{ width: '100%', height: '100%' }}
            defaultEdgeOptions={{ 
              type: 'colorEdge', 
              style: { strokeWidth: 3 },
              data: { type: edgeType }
            }}
            connectionLineType={edgeType === 'bezier' ? 'default' : (edgeType as any)}
            connectionLineStyle={{ 
              stroke: accentColor, 
              strokeWidth: 3,
              strokeDasharray: edgePattern === 'dashed' ? '5,5' : 'none'
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              variant={gridStyle === 'none' ? undefined : (gridStyle as any)} 
              color={gridStyle === 'none' ? 'transparent' : (gridStyle === 'lines' ? '#1c1c1c' : '#404040')} 
              gap={gridStyle === 'lines' ? 60 : 20} 
              size={gridStyle === 'lines' ? 1 : 1} 
            />
          </ReactFlow>
          
          <ExecutionPanel />

          {/* Floating Exit Zen Mode Button */}
          {isZenMode && (
            <button
              onClick={toggleZenMode}
              title="Exit Zen Mode"
              style={{
                position: 'absolute', top: '24px', right: '24px', zIndex: 100,
                background: '#171717', border: '1px solid #262626', color: '#737373',
                width: '40px', height: '40px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = accentColor; e.currentTarget.style.borderColor = accentColor; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#737373'; e.currentTarget.style.borderColor = '#262626'; }}
            >
              <Minimize size={20} />
            </button>
          )}
        </main>
      </div>
    </div>
  );
};
