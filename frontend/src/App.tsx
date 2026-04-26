import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant, ConnectionLineType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from './store';
import { LogNode } from './nodes/LogNode';
import { ColorNode } from './nodes/ColorNode';
import { ExecutionSidebar } from './ExecutionSidebar';
import { Play, Plus, Trash2, Zap } from 'lucide-react';
import type { Node } from '@xyflow/react';

const nodeTypes = {
  logNode: LogNode,
  colorNode: ColorNode,
};

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, runWorkflow } = useStore();
  const setNodes = useStore(s => s.nodes);

  const addLogNode = useCallback(() => {
    const id = `log-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'logNode',
      position: { x: Math.random() * 300 + 300, y: Math.random() * 200 + 100 },
      data: { text: 'New log message' },
    };
    useStore.setState({ nodes: [...useStore.getState().nodes, newNode] });
  }, []);

  const addColorNode = useCallback(() => {
    const id = `color-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'colorNode',
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 100 },
      data: { color: '#818cf8' },
    };
    useStore.setState({ nodes: [...useStore.getState().nodes, newNode] });
  }, []);

  const clearCanvas = useCallback(() => {
    useStore.setState({ nodes: [], edges: [], logs: [] });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#060a14', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <header style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(6,10,20,0.95)',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0,
        zIndex: 10,
        boxShadow: '0 1px 0 rgba(99,102,241,0.1), 0 4px 20px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
              Automation Workspace
            </h1>
            <p style={{ fontSize: '10px', color: '#475569', marginTop: '1px', fontWeight: 400 }}>
              {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} connection{edges.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Center: Add node buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={addColorNode}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(232,121,249,0.1)',
              border: '1px solid rgba(232,121,249,0.3)',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12px', fontWeight: 600, color: '#e879f9',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,121,249,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,121,249,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <Plus size={14} />
            Color
          </button>

          <button
            onClick={addLogNode}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12px', fontWeight: 600, color: '#818cf8',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <Plus size={14} />
            Log
          </button>

          <button
            onClick={clearCanvas}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px', fontWeight: 600, color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Run button */}
        <button
          id="run-workflow-btn"
          onClick={runWorkflow}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 20px',
            fontSize: '13px', fontWeight: 700, color: 'white',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(16,185,129,0.35), 0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px) scale(1.02)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(16,185,129,0.5), 0 8px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(16,185,129,0.35), 0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          <Play size={14} fill="white" />
          Run Workflow
        </button>
      </header>

      {/* ── Canvas ── */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: '100%', height: '100%' }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            interactionWidth: 25,
            style: { strokeWidth: 3, stroke: '#818cf8' },
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionRadius={40}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(99,102,241,0.2)"
          />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'colorNode') return '#e879f9';
              if (n.type === 'logNode') return '#818cf8';
              return '#334155';
            }}
            maskColor="rgba(6,10,20,0.75)"
            style={{ borderRadius: '12px', border: '1px solid rgba(99,102,241,0.25)' }}
          />

          {/* Gradient definition for edges */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e879f9" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
        </ReactFlow>
      </main>

      <ExecutionSidebar />
    </div>
  );
}

export default App;
