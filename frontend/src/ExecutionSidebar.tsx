import React, { useEffect, useRef } from 'react';
import { useStore } from './store';
import { X, Terminal, ChevronRight, Zap, CheckCircle } from 'lucide-react';

export const ExecutionSidebar = () => {
  const { isSidebarOpen, toggleSidebar, logs, clearLogs } = useStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSidebarOpen) {
      setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [logs, isSidebarOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => toggleSidebar(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '400px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(9,11,26,0.97) 0%, rgba(6,10,20,0.99) 100%)',
        borderLeft: '1px solid rgba(99,102,241,0.3)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
          background: 'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(16,185,129,0.15)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              boxShadow: '0 0 16px rgba(16,185,129,0.2)',
            }}>
              <Terminal size={18} color="#10b981" />
            </div>
            <div>
              <h2 style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 700 }}>Execution Logs</h2>
              <p style={{ color: '#475569', fontSize: '11px', marginTop: '1px' }}>{logs.length} node(s) evaluated</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={clearLogs} style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '11px',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            >
              Clear
            </button>
            <button onClick={() => toggleSidebar(false)} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              cursor: 'pointer',
              color: '#94a3b8',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {logs.length > 0 && (
          <div style={{
            margin: '12px 16px 0',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle size={14} color="#10b981" />
            <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 500 }}>Workflow executed successfully</span>
          </div>
        )}

        {/* Logs */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {logs.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: '12px', color: '#334155',
            }}>
              <div style={{
                width: '64px', height: '64px',
                background: 'rgba(99,102,241,0.05)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(99,102,241,0.1)',
              }}>
                <Zap size={28} color="#1e293b" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>No logs yet</p>
              <p style={{ fontSize: '12px', color: '#1e293b', textAlign: 'center', maxWidth: '180px', lineHeight: '1.5' }}>
                Add nodes, connect them, then click Run
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(15,23,42,0.8)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '12px',
                    padding: '14px',
                    animation: `slideIn 0.3s ease ${index * 0.08}s both`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ChevronRight size={12} color="#4f46e5" />
                      <span style={{ fontSize: '10px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Log Node #{index + 1}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#334155', fontFamily: 'monospace' }}>{log.timestamp}</span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: log.color,
                      textShadow: `0 0 20px ${log.color}80`,
                      paddingLeft: '18px',
                      borderLeft: `3px solid ${log.color}60`,
                    }}
                  >
                    &gt; {log.text || 'Empty Log'}
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(99,102,241,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontSize: '11px', color: '#334155', fontFamily: 'monospace' }}>Client-side execution engine · No backend required</span>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};
