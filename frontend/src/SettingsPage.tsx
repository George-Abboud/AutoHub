import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { useSettingsViewModel } from './viewmodels/useSettingsViewModel';
import { type AppState } from './store';
import { 
  Monitor, Palette, 
  Grid3X3, Check,
  ShieldAlert, RotateCcw
} from 'lucide-react';

export const SettingsPage = () => {
  const { accentColor, gridStyle, edgeType, snapToGrid, edgePattern, resetStore, updateSetting } = useSettingsViewModel();
  
  const [activeTab, setActiveTab] = useState('canvas');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tabs = [
    { id: 'canvas', title: 'Canvas', icon: Monitor },
    { id: 'lines', title: 'Lines', icon: Grid3X3 },
    { id: 'theme', title: 'Theme', icon: Palette },
    { id: 'system', title: 'System', icon: ShieldAlert },
  ];
  const colors = [
    { name: 'Spectrum Orange', hex: '#f2572b' },
    { name: 'Vibrant Blue',   hex: '#3b82f6' },
    { name: 'Vibrant Green',  hex: '#22c55e' },
    { name: 'Vibrant Purple', hex: '#a855f7' },
    { name: 'Vibrant Pink',   hex: '#ec4899' },
    { name: 'Vibrant Red',    hex: '#ef4444' },
  ];

  const isActive = (hex: string) =>
    accentColor.toLowerCase() === hex.toLowerCase();

  return (
    <div style={{ 
      height: '100vh',
      overflowY: 'auto',
      background: '#171717', 
      color: '#EBEBEB',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <Sidebar />

      <div style={{ 
        maxWidth: '1200px', margin: '0 auto', 
        padding: '80px 40px 80px 120px'
      }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0' }}>
            System <span style={{ color: accentColor }}>Settings</span>
          </h1>
          <p style={{ color: '#737373', margin: 0, fontSize: '15px' }}>
            Customize your workspace environment and editor behavior.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '60px' }}>
          {/* Tabs */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px', borderRadius: '14px',
                    background: isActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isActive ? accentColor : '#737373',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <Icon size={18} />
                  {tab.title}
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <main style={{ minHeight: '500px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'canvas' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <SettingItem 
                      title="Snap to Grid" 
                      desc="Force nodes to align with grid intersections for a perfectly organized layout."
                      control={
                        <Toggle 
                          active={snapToGrid} 
                          onToggle={() => updateSetting('snapToGrid', !snapToGrid)} 
                          accentColor={accentColor}
                        />
                      }
                    />
                    <SettingItem 
                      title="Grid Visualization" 
                      desc="Choose the pattern for the background grid system."
                      control={
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['dots', 'lines', 'none'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => updateSetting('gridStyle', t)}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #262626',
                                background: gridStyle === t ? 'rgba(255,255,255,0.05)' : '#1c1c1c',
                                color: gridStyle === t ? accentColor : '#A3A3A3',
                                cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize'
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      }
                    />
                  </div>
                )}

                {activeTab === 'lines' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <SettingItem 
                      title="Connection Line Style" 
                      desc="Choose the visual path logic for node connections."
                      control={
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['step', 'bezier', 'straight'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => updateSetting('edgeType', t)}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #262626',
                                background: edgeType === t ? 'rgba(255,255,255,0.05)' : '#1c1c1c',
                                color: edgeType === t ? accentColor : '#A3A3A3',
                                cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize'
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      }
                    />
                    <SettingItem 
                      title="Connection Line Pattern" 
                      desc="Switch between solid and dashed connection lines."
                      control={
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['solid', 'dashed'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => updateSetting('edgePattern', t)}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #262626',
                                background: edgePattern === t ? 'rgba(255,255,255,0.05)' : '#1c1c1c',
                                color: edgePattern === t ? accentColor : '#A3A3A3',
                                cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize'
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      }
                    />
                  </div>
                )}

                {activeTab === 'theme' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Accent Color</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        {colors.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => updateSetting('accentColor', c.hex as AppState['accentColor'])}
                            style={{
                              padding: '24px 16px', borderRadius: '16px', border: '1px solid',
                              borderColor: isActive(c.hex) ? c.hex : '#262626',
                              background: '#1c1c1c', cursor: 'pointer', position: 'relative',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ 
                              width: '36px', height: '36px', background: c.hex, borderRadius: '50%', 
                            boxShadow: isActive(c.hex) ? `0 0 20px ${c.hex}66` : 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {isActive(c.hex) && <Check size={18} color="white" strokeWidth={3} />}
                            </div>
                            <span style={{ fontSize: '11px', color: isActive(c.hex) ? '#EBEBEB' : '#737373', fontWeight: 700 }}>{c.name}</span>
                          </button>
                        ))}
                      </div>

                    </section>
                  </div>
                )}

                {activeTab === 'system' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ 
                      padding: '32px', background: 'rgba(239, 68, 68, 0.05)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '24px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShieldAlert size={20} color="#ef4444" />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ef4444' }}>Danger Zone</h3>
                      </div>
                      <p style={{ color: '#A3A3A3', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px' }}>
                        Clearing all data will permanently delete all workspaces, execution logs, and reset all your preferences to default. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        style={{
                          padding: '12px 24px', background: '#ef4444', color: 'white',
                          border: 'none', borderRadius: '12px', fontWeight: 700,
                          cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        Clear All Data
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                background: '#171717', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '440px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)', textAlign: 'center'
              }}
            >
              <div style={{ 
                width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.1)', 
                borderRadius: '20px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 24px auto' 
              }}>
                <RotateCcw size={32} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Reset AutoHub?</h2>
              <p style={{ color: '#737373', lineHeight: 1.6, marginBottom: '32px' }}>
                You are about to factory reset the entire platform. Every workspace and setting will be lost forever.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, padding: '14px', background: '#262626', color: '#A3A3A3',
                    border: 'none', borderRadius: '14px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => resetStore()}
                  style={{
                    flex: 1, padding: '14px', background: '#ef4444', color: 'white',
                    border: 'none', borderRadius: '14px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)'
                  }}
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingItem = ({ title, desc, control }: { title: string, desc: string, control: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '32px', borderBottom: '1px solid #262626' }}>
    <div style={{ maxWidth: '400px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#737373', margin: 0, lineHeight: '1.5' }}>{desc}</p>
    </div>
    {control}
  </div>
);

const Toggle = ({ active, onToggle, accentColor, disabled }: { active: boolean, onToggle: () => void, accentColor: string, disabled?: boolean }) => (
  <button 
    onClick={onToggle}
    disabled={disabled}
    style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: active ? accentColor : '#262626',
      position: 'relative', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1, transition: 'all 0.2s'
    }}
  >
    <motion.div 
      animate={{ x: active ? 22 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        width: '20px', height: '20px', background: 'white', 
        borderRadius: '50%', position: 'absolute', top: '2px', left: 0
      }}
    />
  </button>
);
