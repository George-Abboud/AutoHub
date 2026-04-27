import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Logo } from './components/ui/Logo';
import { 
  BookOpen, Rocket, Layers, 
  Cpu, Play, Zap, CheckCircle2
} from 'lucide-react';
import { useAppViewModel } from './viewmodels/useAppViewModel';

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const { accentColor } = useAppViewModel();

  const sections = [
    { id: 'intro', title: 'Philosophy', icon: BookOpen },
    { id: 'getting-started', title: 'Quick Start', icon: Rocket },
    { id: 'nodes', title: 'Node Architecture', icon: Layers },
    { id: 'execution', title: 'Trace Engine', icon: Cpu },
  ];

  return (
    <div style={{ 
      height: '100vh',
      background: '#171717', 
      color: '#EBEBEB',
      position: 'relative',
      fontFamily: '"Inter", sans-serif',
      scrollbarGutter: 'stable',
      overflowY: 'scroll',
    }}>
      <Sidebar />

      <div style={{ 
        maxWidth: '1400px', margin: '0 auto', 
        display: 'grid', gridTemplateColumns: '320px 1fr',
        padding: '60px 40px 60px 120px',
        gap: '80px'
      }}>
        {/* Docs Navigation */}
        <aside style={{ position: 'sticky', top: '60px', height: 'fit-content' }}>
          <div style={{ marginBottom: '24px' }}>
            <Logo size={32} showText />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 18px', borderRadius: '12px',
                    background: isActive ? `${accentColor}14` : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? `${accentColor}26` : 'transparent',
                    color: isActive ? accentColor : '#8A8A8A',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px'
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Docs Content */}
        <main style={{ maxWidth: '850px', paddingBottom: '100px', minHeight: '600px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeSection === 'intro' && (
                <section>
                  <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Intelligence, <span style={{ color: accentColor }}>Visualized.</span>
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#A3A3A3', marginBottom: '48px', fontWeight: 400 }}>
                    AutoHub is a high-fidelity visual automation engine designed for complex logical orchestrations. 
                    We bridge the gap between abstract code and visual intuition, providing a unified workspace 
                    for architects to design, simulate, and deploy mission-critical workflows.
                  </p>
                  
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px',
                    marginBottom: '48px'
                  }}>
                    <div style={{ background: '#1c1c1c', border: '1px solid #262626', borderRadius: '20px', padding: '24px' }}>
                      <div style={{ width: '40px', height: '40px', background: `${accentColor}1a`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <Zap size={20} color={accentColor} />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Infinite Scalability</h3>
                      <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Built on a reactive state engine optimized for hundreds of concurrent nodes without performance degradation.</p>
                    </div>
                    <div style={{ background: '#1c1c1c', border: '1px solid #262626', borderRadius: '20px', padding: '24px' }}>
                      <div style={{ width: '40px', height: '40px', background: `${accentColor}1a`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <CheckCircle2 size={20} color={accentColor} />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Surgical Precision</h3>
                      <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Granular control over data propagation and state management with real-time visual tracing for every node.</p>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'execution' && (
                <section>
                  <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em' }}>Visual Trace Engine</h1>
                  <p style={{ fontSize: '17px', color: '#A3A3A3', lineHeight: '1.7', marginBottom: '40px' }}>
                    The **Visual Trace Engine** is the heartbeat of AutoHub. It turns abstract logic into a live, moving map. Instead of guessing if your automation is working, you can actually watch the data travel through your workflow in real-time.
                  </p>

                  <div style={{ 
                    background: '#111', border: '1px solid #262626', 
                    borderRadius: '24px', padding: '48px', position: 'relative',
                    overflow: 'hidden', minHeight: '280px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', position: 'relative', zIndex: 2, width: '100%', justifyContent: 'center' }}>
                      
                      {/* Node 1: Completed */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '64px', height: '64px', background: '#171717', 
                          border: `2px solid ${accentColor}`, borderRadius: '16px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 0 20px ${accentColor}1a`
                        }}>
                          <CheckCircle2 size={20} color={accentColor} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#525252', fontWeight: 700, textTransform: 'uppercase' }}>Success</span>
                      </div>

                      {/* Line 1 */}
                      <div style={{ width: '80px', height: '2px', background: `linear-gradient(90deg, ${accentColor}, #404040)`, margin: '0 -2px', marginTop: '-22px' }} />

                      {/* Node 2: Active */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 3 }}>
                        <div style={{ 
                          width: '72px', height: '72px', background: '#171717', 
                          border: `2px solid ${accentColor}`, borderRadius: '20px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 0 30px ${accentColor}33`,
                          transform: 'scale(1.1)'
                        }}>
                          <Play size={24} color={accentColor} fill={accentColor} />
                        </div>
                        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 800, textTransform: 'uppercase' }}>Processing</span>
                      </div>

                      {/* Line 2 */}
                      <div style={{ width: '80px', height: '2px', background: '#262626', margin: '0 -2px', marginTop: '-22px' }} />

                      {/* Node 3: Pending */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '64px', height: '64px', background: '#171717', 
                          border: '2px solid #262626', borderRadius: '16px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Zap size={20} color="#404040" />
                        </div>
                        <span style={{ fontSize: '10px', color: '#404040', fontWeight: 700, textTransform: 'uppercase' }}>Pending</span>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '24px', color: '#404040', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em' }}>
                      STATE VISUALIZATION MODEL
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid #262626' }}>
                      <h4 style={{ color: '#EBEBEB', marginBottom: '8px', fontWeight: 700 }}>Real-time Pulses</h4>
                      <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Watch \"energy pulses\" move along your connections. It shows you exactly which path the data is taking right now.</p>
                    </div>
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid #262626' }}>
                      <h4 style={{ color: '#EBEBEB', marginBottom: '8px', fontWeight: 700 }}>Instant Debugging</h4>
                      <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>If something stops, you'll see exactly which node it got stuck on, making it easy to fix logical errors.</p>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'getting-started' && (
                <section>
                  <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.02em' }}>Quick Start Guide</h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { title: 'Initialize Workspace', desc: 'Every project starts as a clean slate. Create a workspace from your dashboard to begin your orchestration.' },
                      { title: 'Visual Composition', desc: 'Drag nodes from the surgical-grade palette onto the grid. Use the smart-snap system for perfect alignment.' },
                      { title: 'Logical Connection', desc: 'Establish data paths by drawing edges. AutoHub will automatically calculate flow types and propagation speeds.' },
                      { title: 'Live Execution', desc: 'Hit the run command to see your logic come to life with real-time visual feedback and deep-trace logs.' },
                    ].map((item, i) => (
                      <div key={item.title} style={{ display: 'flex', gap: '24px', padding: '24px', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '20px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: '#262626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', fontWeight: 900, color: '#A3A3A3' }}>
                          0{i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>{item.title}</h3>
                          <p style={{ color: '#737373', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'nodes' && (
                <section>
                  <h1 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em' }}>Node Library</h1>
                  <p style={{ color: '#A3A3A3', fontSize: '17px', lineHeight: 1.6, marginBottom: '40px' }}>
                    The AutoHub ecosystem consists of specialized nodes designed for atomic logical operations. 
                    Each node is isolated and follows a strict input/output protocol.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {[
                      { name: 'Root Trigger', type: 'SYSTEM', desc: 'The authoritative entry point for workflow initiation.' },
                      { name: 'Color Processor', type: 'LOGIC', desc: 'High-performance hex-to-rgb transformation and mixing engine.' },
                      { name: 'Debugger / Log', type: 'UTILITY', desc: 'Real-time output terminal for variable monitoring and inspection.' },
                      { name: 'Logic Gate', type: 'CONTROL', desc: 'Deterministic branching based on dynamic input conditions.' },
                    ].map((node) => (
                      <div key={node.name} style={{ background: '#1c1c1c', padding: '28px', borderRadius: '24px', border: '1px solid #262626', transition: 'transform 0.2s', cursor: 'default' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <h4 style={{ margin: 0, fontWeight: 800, fontSize: '16px' }}>{node.name}</h4>
                          <span style={{ fontSize: '9px', background: `${accentColor}1a`, color: accentColor, padding: '3px 10px', borderRadius: '100px', fontWeight: 900, letterSpacing: '0.05em' }}>{node.type}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#737373', lineHeight: '1.6' }}>{node.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
