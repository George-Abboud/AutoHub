import { useEffect, useRef, useState, useMemo } from 'react';
import type { TraceEntry } from './types';
import { Terminal, PenLine, ChevronDown, CheckCircle2, Trash2, Play, Zap, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionViewModel } from './viewmodels/useExecutionViewModel';
import { useAppViewModel } from './viewmodels/useAppViewModel';

export const ExecutionPanel = () => {
  const { liveTrace, isRunning, clearLogs } = useExecutionViewModel();
  const { accentColor } = useAppViewModel();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [liveTrace, isMinimized]);

  useEffect(() => {
    if (isRunning) setTimeout(() => setIsMinimized(false), 0);
  }, [isRunning]);

  // --- Helper Logic ---
  const getTraceIcon = (type: string) => {
    switch (type) {
      case 'startNode': return <Zap size={10} color={accentColor} fill={accentColor} />;
      case 'colorNode': return <Palette size={10} color={accentColor} />;
      case 'logNode': return <PenLine size={10} color={accentColor} />;
      default: return <CheckCircle2 size={10} color={accentColor} />;
    }
  };


  // Group traces into batches for parallel visualization
  const groupedTraces = useMemo(() => {
    const groups: (TraceEntry | TraceEntry[])[] = [];
    liveTrace.forEach(trace => {
      if (trace.type === 'divider') {
        groups.push(trace);
      } else {
        const lastGroup = groups[groups.length - 1];
        if (
          lastGroup && 
          Array.isArray(lastGroup) && 
          trace.batchId && 
          lastGroup[0].batchId === trace.batchId
        ) {
          lastGroup.push(trace);
        } else {
          groups.push([trace]);
        }
      }
    });
    return groups;
  }, [liveTrace]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ 
        opacity: 1, y: 0, scale: 1,
        width: isMinimized ? 56 : 340,
        height: isMinimized ? 56 : 320,
        borderRadius: isMinimized ? 12 : 16,
      }}
      whileHover={isMinimized ? { 
        borderColor: accentColor,
        boxShadow: `0 8px 32px ${accentColor}33`,
        scale: 1.05
      } : {}}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      style={{
        position: 'absolute', bottom: '24px', right: '24px',
        background: 'rgba(23, 23, 23, 0.9)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        zIndex: 100, overflow: 'hidden', color: '#EBEBEB',
        cursor: isMinimized ? 'pointer' : 'default'
      }}
      onClick={() => isMinimized && setIsMinimized(false)}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div key="minimized" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Terminal size={20} color={accentColor} />
            {isRunning && <div style={{ position: 'absolute', top: '14px', right: '14px', width: '8px', height: '8px', background: accentColor, borderRadius: '50%', border: '2px solid #171717' }} className="animate-pulse" />}
          </motion.div>
        ) : (
          <motion.div key="maximized" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '6px', background: `${accentColor}1a`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Terminal size={14} color={accentColor} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.02em', color: '#EBEBEB' }}>Execution panel</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <motion.button 
                  whileHover={{ scale: 1.1, background: `${accentColor}1a` }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); clearLogs(); }} 
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: accentColor, 
                    cursor: 'pointer', 
                    padding: '6px', 
                    borderRadius: '6px', 
                    transition: 'color 0.2s',
                    opacity: 1
                  }}
                >
                  <Trash2 size={14} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} 
                  style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                >
                  <ChevronDown size={14} />
                </motion.button>
              </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', scrollbarWidth: 'none' }}>
              {liveTrace.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '12px' }}>
                  <svg width="120" height="56" viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.rect animate={{ stroke: ["#404040", accentColor, "#404040"], fill: ["rgba(64,64,64,0.06)", `${accentColor}26`, "rgba(64,64,64,0.06)"], strokeWidth: [1.5, 2, 1.5] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.4] }} x="2" y="18" width="28" height="20" rx="5" stroke="#404040" strokeWidth="1.5" fill="rgba(64,64,64,0.06)" />
                    <motion.circle animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.4] }} cx="11" cy="28" r="3" fill={accentColor} />
                    <motion.line animate={{ stroke: ["#404040", accentColor, "#404040"], strokeDashoffset: [0, -10] }} transition={{ duration: 4, repeat: Infinity, times: [0.2, 0.5, 0.7], strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" } }} x1="30" y1="28" x2="44" y2="28" stroke="#404040" strokeWidth="1.5" strokeDasharray="3 2" />
                    <motion.polygon animate={{ fill: ["#404040", accentColor, "#404040"] }} transition={{ duration: 4, repeat: Infinity, times: [0.2, 0.5, 0.7] }} points="44,24 50,28 44,32" fill="#404040" opacity="0.5" />
                    <motion.rect animate={{ stroke: ["#404040", accentColor, "#404040"], fill: ["rgba(64,64,64,0.08)", `${accentColor}1a`, "rgba(64,64,64,0.08)"] }} transition={{ duration: 4, repeat: Infinity, times: [0.4, 0.7, 0.9] }} x="50" y="18" width="20" height="20" rx="5" stroke="#404040" strokeWidth="1.5" fill="rgba(64,64,64,0.08)" />
                    <motion.line animate={{ stroke: ["#404040", accentColor, "#404040"], strokeDashoffset: [0, -10] }} transition={{ duration: 4, repeat: Infinity, times: [0.6, 0.9, 1], strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" } }} x1="70" y1="28" x2="84" y2="28" stroke="#404040" strokeWidth="1.5" strokeDasharray="3 2" />
                    <motion.polygon animate={{ fill: ["#404040", accentColor, "#404040"] }} transition={{ duration: 4, repeat: Infinity, times: [0.6, 0.9, 1] }} points="84,24 90,28 84,32" fill="#404040" opacity="0.3" />
                    <motion.rect animate={{ stroke: ["#404040", accentColor, "#404040"], fill: ["rgba(64,64,64,0.08)", `${accentColor}1a`, "rgba(64,64,64,0.08)"] }} transition={{ duration: 4, repeat: Infinity, times: [0.8, 1, 1] }} x="90" y="18" width="28" height="20" rx="5" stroke="#404040" strokeWidth="1.5" fill="rgba(64,64,64,0.08)" />
                  </svg>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#737373', margin: 0 }}>Ready to execute</p>
                    <p style={{ fontSize: '9.5px', color: '#404040', margin: '4px 0 0', fontWeight: 500 }}>Press Execute on the trigger node</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {groupedTraces.map((group) => {
                    if (!Array.isArray(group)) {
                      return (
                        <div key={group.id} style={{ margin: '24px 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '4px 10px', background: `${accentColor}1a`, border: `1px solid ${accentColor}33`, borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Play size={10} color={accentColor} fill={accentColor} />
                              <span style={{ fontSize: '9px', fontWeight: 800, color: accentColor, letterSpacing: '0.05em' }}>RUN STARTED</span>
                            </div>
                            <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${accentColor}33 0%, rgba(255,255,255,0.05) 100%)` }} />
                            <span style={{ fontSize: '9px', fontWeight: 600, color: '#404040', fontFamily: 'monospace' }}>{group.timestamp}</span>
                          </div>
                        </div>
                      );
                    }

                    const isParallel = group.length > 1;
                    return (
                      <div key={group[0].id} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px', 
                        marginBottom: '20px',
                        position: 'relative',
                        background: isParallel ? 'rgba(242, 87, 43, 0.02)' : 'transparent',
                        padding: isParallel ? '16px 12px' : '0',
                        borderRadius: isParallel ? '12px' : '0',
                        border: isParallel ? '1px solid rgba(242, 87, 43, 0.05)' : 'none'
                      }}>
                        {isParallel && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingLeft: '4px' }}>
                            <div style={{ padding: '4px', background: `${accentColor}1a`, borderRadius: '4px' }}>
                              <Zap size={10} color={accentColor} />
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 900, color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Parallel execution</span>
                            <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${accentColor}33 0%, transparent 100%)` }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                          {isParallel && (
                            <div style={{ 
                              position: 'absolute', 
                              left: '10px', 
                              top: '10px', 
                              bottom: '10px', 
                              width: '2px', 
                              background: accentColor,
                              boxShadow: `0 0 10px ${accentColor}4d`,
                              borderRadius: '2px',
                              opacity: 0.8
                            }} />
                          )}
                          {group.map((trace) => {
                            const isSystem = trace.type === 'system';
                            return (
                              <motion.div 
                                key={trace.id} 
                                  initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                style={{ 
                                  display: 'flex', 
                                  gap: '14px', 
                                  paddingLeft: isParallel ? '24px' : '0',
                                  background: isSystem 
                                    ? (trace.message.includes('Cycle Complete') ? 'rgba(74, 222, 128, 0.08)' : 'rgba(115, 115, 115, 0.08)') 
                                    : 'transparent',
                                  padding: isSystem ? '10px 14px' : undefined,
                                  borderRadius: isSystem ? '10px' : undefined,
                                  border: isSystem 
                                    ? (trace.message.includes('Cycle Complete') ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid rgba(115, 115, 115, 0.2)') 
                                    : undefined,
                                  margin: isSystem ? '8px 0' : undefined,
                                  position: 'relative'
                                }}
                              >
                                {isParallel && (
                                  <div style={{
                                    position: 'absolute',
                                    left: '-14px',
                                    top: '10px',
                                    width: '12px',
                                    height: '2px',
                                    background: accentColor,
                                    opacity: 0.6,
                                    borderRadius: '1px'
                                  }} />
                                )}
                                {!isSystem && (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                  <div style={{ width: '22px', height: '22px', background: `${accentColor}1f`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${accentColor}40`, flexShrink: 0, zIndex: 2 }}>
                                      {getTraceIcon(trace.type)}
                                    </div>
                                  </div>
                                )}
                                <div style={{ flex: 1, paddingBottom: '2px' }}>
                                  {!isSystem && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#404040', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{trace.type.replace('Node', '')}</span>
                                    </div>
                                  )}
                                  <div style={{ 
                                    color: isSystem 
                                      ? (trace.message.includes('Cycle Complete') ? '#4ade80' : '#737373') 
                                      : (trace.colorData || '#EBEBEB'), 
                                    fontSize: isSystem ? '12px' : '11.5px', 
                                    lineHeight: '1.4', 
                                    fontWeight: isSystem ? 800 : 600,
                                    letterSpacing: isSystem ? '0.02em' : 'normal'
                                  }}>
                                    {isSystem && (
                                      trace.message.includes('Stopped') 
                                        ? <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '13px', height: '13px', borderRadius: '50%', border: '1.2px solid currentColor', marginRight: '8px', marginBottom: '-2px' }}>
                                            <div style={{ width: '5px', height: '5px', background: 'currentColor', borderRadius: '0.5px' }} />
                                          </div>
                                        : <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '8px', marginBottom: '-2px' }} />
                                    )}
                                    {trace.message}
                                  </div>
                                  {trace.colorData && trace.type === 'colorNode' && (
                                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
                                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: trace.colorData, boxShadow: `0 0 10px ${trace.colorData}88` }} />
                                      <span style={{ fontSize: '9px', color: '#A3A3A3', fontFamily: 'monospace', fontWeight: 600 }}>{trace.colorData.toUpperCase()}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Status */}
            <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid #262626', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isRunning ? accentColor : '#737373' }} className={isRunning ? "animate-pulse" : ""} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: isRunning ? accentColor : '#737373' }}>
                  {isRunning ? 'EXECUTING FLOW' : 'IDLE'}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#404040' }}>v1.0.4-spectrum</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


