import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Trash2, Loader, Bot, User, Sparkles } from 'lucide-react';
import { useAgentViewModel } from '../../viewmodels/useAgentViewModel';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

export const ChatWidget = () => {
  const { accentColor } = useAppViewModel();
  const { messages, isThinking, sendMessage, clearMessages } = useAgentViewModel();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'absolute', bottom: '24px', right: '24px', zIndex: 200,
              width: '56px', height: '56px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 32px ${accentColor}40`,
            }}
          >
            <Sparkles size={24} color="white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', bottom: '24px', right: '24px', zIndex: 200,
              width: '400px', height: '520px',
              background: 'rgba(23, 23, 23, 0.85)', backdropFilter: 'blur(24px)',
              border: '1px solid #262626', borderRadius: '24px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #262626',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px',
                  background: `${accentColor}1a`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={20} color={accentColor} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#EBEBEB' }}>AutoHub Agent</div>
                  <div style={{ fontSize: '11px', color: '#737373' }}>
                    {isThinking ? 'Thinking...' : 'Online'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={clearMessages}
                  title="Clear chat"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#737373', padding: '6px', borderRadius: '8px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#737373'}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#737373', padding: '6px', borderRadius: '8px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EBEBEB'}
                  onMouseLeave={e => e.currentTarget.style.color = '#737373'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px 20px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex', gap: '10px',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: msg.role === 'user' ? `${accentColor}1a` : '#262626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {msg.role === 'user'
                      ? <User size={14} color={accentColor} />
                      : <Bot size={14} color={msg.role === 'system' ? '#737373' : accentColor} />}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '75%', padding: '10px 14px', borderRadius: '14px',
                    fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap',
                    background: msg.role === 'user' ? accentColor : '#1c1c1c',
                    color: msg.role === 'user' ? 'white' : '#EBEBEB',
                    border: msg.role === 'user' ? 'none' : '1px solid #262626',
                  }}>
                    {msg.content}
                    {msg.action && (
                      <div style={{
                        marginTop: '8px', paddingTop: '8px',
                        borderTop: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.2)' : '#262626'}`,
                        fontSize: '11px', color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#737373',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        <Sparkles size={10} /> Action: {msg.action.type}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Thinking Indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: '#262626', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Loader size={14} color={accentColor} />
                    </motion.div>
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '14px',
                    background: '#1c1c1c', border: '1px solid #262626',
                    fontSize: '13px', color: '#737373',
                  }}>
                    Thinking...
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{
              padding: '12px 16px', borderTop: '1px solid #262626',
              display: 'flex', gap: '10px', alignItems: 'center',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isThinking}
                style={{
                  flex: 1, background: '#1c1c1c', border: '1px solid #262626',
                  borderRadius: '12px', padding: '12px 16px',
                  color: 'white', fontSize: '13px', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: '"Inter", sans-serif',
                }}
                onFocus={e => e.target.style.borderColor = accentColor}
                onBlur={e => e.target.style.borderColor = '#262626'}
              />
              <button
                onClick={handleSend}
                disabled={isThinking || !input.trim()}
                style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: input.trim() ? accentColor : '#262626',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', opacity: input.trim() ? 1 : 0.5,
                }}
              >
                <Send size={16} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
