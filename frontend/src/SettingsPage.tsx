import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { useSettingsViewModel } from './viewmodels/useSettingsViewModel';
import { 
  Monitor, Palette, 
  Grid3X3, Check, Bot, Zap, Key, Info
} from 'lucide-react';
import { useAppViewModel } from './viewmodels/useAppViewModel';

export const SettingsPage = () => {
  const { accentColor, gridStyle, edgeType, snapToGrid, edgePattern, apiKeys, updateSetting, updateApiKeys } = useSettingsViewModel();
  const { profile } = useAppViewModel();
  
  const [activeTab, setActiveTab] = useState('canvas');

  const tabs = [
    { id: 'canvas', title: 'Canvas', icon: Monitor },
    { id: 'lines', title: 'Lines', icon: Grid3X3 },
    { id: 'theme', title: 'Theme', icon: Palette },
    { id: 'ai', title: 'AI & Models', icon: Bot },
  ];
  const accentColors = [
    { name: 'Spectrum Orange', hex: '#f2572b' },
    { name: 'Vibrant Blue',   hex: '#3b82f6' },
    { name: 'Vibrant Green',  hex: '#22c55e' },
    { name: 'Vibrant Purple', hex: '#a855f7' },
    { name: 'Vibrant Pink',   hex: '#ec4899' },
    { name: 'Vibrant Red',    hex: '#ef4444' },
  ];

  const isColorActive = (hex: string) =>
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
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
                    fontSize: '14px',
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
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
                        {accentColors.map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => updateSetting('accentColor', c.hex as any)}
                            style={{
                              padding: '24px 16px', borderRadius: '16px', border: '1px solid',
                              borderColor: isColorActive(c.hex) ? c.hex : '#262626',
                              background: '#1c1c1c', cursor: 'pointer', position: 'relative',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ 
                              width: '36px', height: '36px', background: c.hex, borderRadius: '50%', 
                            boxShadow: isColorActive(c.hex) ? `0 0 20px ${c.hex}66` : 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {isColorActive(c.hex) && <Check size={18} color="white" strokeWidth={3} />}
                            </div>
                            <span style={{ fontSize: '11px', color: isColorActive(c.hex) ? '#EBEBEB' : '#737373', fontWeight: 700 }}>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Usage Info */}
                    <section style={{ 
                      padding: '24px', borderRadius: '20px', 
                      background: 'rgba(255,255,255,0.03)', border: '1px solid #262626' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', borderRadius: '12px', background: `${accentColor}1a` }}>
                          <Zap size={20} color={accentColor} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Official Assistant Usage</h3>
                          <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Requests resets every 24 hours.</p>
                        </div>
                      </div>
                      
                      {profile && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                            <span>Daily Limit</span>
                            <span style={{ color: profile.ai_requests_count >= profile.ai_daily_limit ? '#ef4444' : '#EBEBEB' }}>
                              {profile.ai_requests_count} / {profile.ai_daily_limit}
                            </span>
                          </div>
                          <div style={{ height: '8px', background: '#262626', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (profile.ai_requests_count / profile.ai_daily_limit) * 100)}%` }}
                              style={{ height: '100%', background: accentColor }}
                            />
                          </div>
                        </div>
                      )}
                    </section>

                    {/* BYOK Section */}
                    <section>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Key size={20} color={accentColor} />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Bring Your Own Key (BYOK)</h3>
                      </div>
                      <p style={{ fontSize: '14px', color: '#737373', marginBottom: '24px', lineHeight: '1.6' }}>
                        Add your own API keys to bypass daily limits and use advanced models. Your keys are stored securely and used only for your requests.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <ApiKeyInput 
                          label="Google Gemini API Key"
                          placeholder="Paste your Gemini API key here..."
                          value={apiKeys.gemini || ''}
                          onChange={(v: string) => updateApiKeys({ ...apiKeys, gemini: v })}
                          accentColor={accentColor}
                          icon="https://www.gstatic.com/lamda/images/favicon_v1_600x600.png"
                        />
                        <ApiKeyInput 
                          label="OpenAI API Key"
                          placeholder="sk-..."
                          value={apiKeys.openai || ''}
                          onChange={(v: string) => updateApiKeys({ ...apiKeys, openai: v })}
                          accentColor={accentColor}
                          icon="https://openai.com/favicon.ico"
                        />
                      </div>
                    </section>

                    <div style={{ 
                      padding: '16px', borderRadius: '12px', background: '#1c1c1c', 
                      border: '1px solid #262626', display: 'flex', gap: '12px' 
                    }}>
                      <Info size={18} color="#737373" style={{ flexShrink: 0 }} />
                      <p style={{ fontSize: '12px', color: '#737373', margin: 0, lineHeight: '1.5' }}>
                        When a custom key is provided, AutoHub will automatically switch to using that provider for your AI Assistant. You can clear the field to revert to the official assistant.
                      </p>
                    </div>
                  </div>
                )}



              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>


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
const ApiKeyInput = ({ label, placeholder, value, onChange, accentColor, icon }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, accentColor: string, icon?: string }) => {
  const [show, setShow] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && <img src={icon} style={{ width: '16px', height: '16px', borderRadius: '4px' }} alt="" />}
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#A3A3A3' }}>{label}</label>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type={show ? 'text' : 'password'}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%', background: '#111111', border: '1px solid #262626',
              borderRadius: '12px', padding: '12px 16px', color: 'white',
              fontSize: '14px', outline: 'none', transition: 'all 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = accentColor}
            onBlur={e => e.target.style.borderColor = '#262626'}
          />
          <button 
            onClick={() => setShow(!show)}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', color: '#525252', cursor: 'pointer',
              fontSize: '11px', fontWeight: 700
            }}
          >
            {show ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        <button
          onClick={() => onChange(tempValue)}
          disabled={tempValue === value}
          style={{
            padding: '0 20px', borderRadius: '12px', background: tempValue === value ? '#262626' : accentColor,
            color: 'white', border: 'none', cursor: tempValue === value ? 'default' : 'pointer',
            fontSize: '13px', fontWeight: 700, transition: 'all 0.2s',
            opacity: tempValue === value ? 0.5 : 1
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
