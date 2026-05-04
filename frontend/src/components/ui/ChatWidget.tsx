import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Trash2, Loader, Bot, User, Sparkles } from 'lucide-react';
import { useAgentViewModel } from '../../viewmodels/useAgentViewModel';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

export const ChatWidget = () => {
  const { accentColor, profile, settings } = useAppViewModel();
  const { messages, isThinking, error, sendMessage, clearMessages } = useAgentViewModel();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasCustomKey = settings?.api_keys?.gemini || settings?.api_keys?.openai;
  const remaining = profile ? Math.max(0, profile.ai_daily_limit - profile.ai_requests_count) : 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Centered) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 100, opacity: 0, x: '-50%' }}
            style={{
              position: 'absolute', bottom: '24px', left: '50%', zIndex: 200,
            }}
          >
            <motion.button
              whileHover={{ y: -5, boxShadow: `0 12px 40px ${accentColor}60` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              style={{
                padding: '12px 24px', borderRadius: '16px',
                background: 'rgba(23, 23, 23, 0.8)', backdropFilter: 'blur(20px)',
                border: `1px solid ${accentColor}40`, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                color: '#EBEBEB', fontSize: '14px', fontWeight: 600,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <Sparkles size={18} color={accentColor} />
              Ask AI Assistant
              {!hasCustomKey && (
                <span style={{ fontSize: '10px', background: `${accentColor}33`, padding: '2px 6px', borderRadius: '6px', color: accentColor }}>
                  {remaining} left
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel (Centered Bottom) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: '-50%', scale: 0.98 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 40, x: '-50%', scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute', bottom: '24px', left: '50%', zIndex: 200,
              width: '600px', maxHeight: '500px',
              background: 'rgba(23, 23, 23, 0.85)', backdropFilter: 'blur(24px)',
              border: '1px solid #262626', borderRadius: '28px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header (Slimmer) */}
            <div style={{
              padding: '12px 20px', borderBottom: '1px solid #262626',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={16} color={accentColor} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#EBEBEB', letterSpacing: '0.02em' }}>
                  {hasCustomKey ? 'CUSTOM AI MODEL' : 'AUTOHUB AGENT'}
                </span>
                {!hasCustomKey && profile && (
                  <span style={{ fontSize: '10px', color: '#737373', marginLeft: '8px' }}>
                    Usage: {profile.ai_requests_count}/{profile.ai_daily_limit} today
                  </span>
                )}
                {isThinking && (
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor }} 
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={clearMessages}
                  title="Clear chat"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#525252', padding: '6px', borderRadius: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#525252'}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#525252', padding: '6px', borderRadius: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EBEBEB'}
                  onMouseLeave={e => e.currentTarget.style.color = '#525252'}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '16px',
              maxHeight: '350px', scrollbarWidth: 'none',
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', gap: '12px',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0,
                    background: msg.role === 'user' ? `${accentColor}22` : '#262626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '2px'
                  }}>
                    {msg.role === 'user'
                      ? <User size={12} color={accentColor} />
                      : <Bot size={12} color={msg.role === 'system' ? '#737373' : accentColor} />}
                  </div>

                  <div style={{
                    maxWidth: '80%', padding: '12px 16px', borderRadius: '18px',
                    fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                    background: msg.role === 'user' ? `${accentColor}` : '#1c1c1c',
                    color: msg.role === 'user' ? 'white' : '#D4D4D4',
                    border: msg.role === 'user' ? 'none' : '1px solid #262626',
                    boxShadow: msg.role === 'user' ? `0 4px 15px ${accentColor}30` : 'none',
                  }}>
                    {msg.content}
                    {msg.action && (
                      <div style={{
                        marginTop: '10px', paddingTop: '10px',
                        borderTop: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.15)' : '#262626'}`,
                        fontSize: '11px', color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : '#737373',
                        display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600
                      }}>
                        <Sparkles size={11} /> ACTION EXECUTED: {msg.action.type.toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center', padding: '10px' }}>
                  {error}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section (Bar Style) */}
            <div style={{
              padding: '16px 20px', background: 'rgba(0,0,0,0.2)',
              display: 'flex', gap: '12px', alignItems: 'center',
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command (e.g., 'add color node')..."
                  disabled={isThinking}
                  style={{
                    width: '100%', background: '#111111', border: '1px solid #262626',
                    borderRadius: '14px', padding: '14px 18px',
                    color: 'white', fontSize: '14px', outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: '"Inter", sans-serif',
                  }}
                  onFocus={e => e.target.style.borderColor = accentColor}
                  onBlur={e => e.target.style.borderColor = '#262626'}
                />
                {isThinking && (
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Loader size={16} color={accentColor} />
                    </motion.div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={isThinking || !input.trim()}
                style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: input.trim() ? accentColor : '#1c1c1c',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                  opacity: input.trim() ? 1 : 0.4,
                  boxShadow: input.trim() ? `0 8px 20px ${accentColor}40` : 'none',
                }}
              >
                <Send size={18} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
;
