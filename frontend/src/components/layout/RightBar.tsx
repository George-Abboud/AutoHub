import { Bot, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';

export const RightBar = () => {
  const isAIChatbotOpen = useStore(s => s.isAIChatbotOpen);
  const toggleAIChatbot = useStore(s => s.toggleAIChatbot);
  const accentColor = useStore(s => s.accentColor);

  return (
    <div
      style={{
        width: '60px',
        height: '100%',
        background: '#171717',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        gap: '16px',
        zIndex: 100,
        flexShrink: 0
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.05)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => toggleAIChatbot()}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: isAIChatbotOpen ? `${accentColor}1a` : 'transparent',
          border: 'none',
          color: isAIChatbotOpen ? accentColor : '#737373',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s, background 0.2s'
        }}
        title="AI Assistant"
      >
        <Bot size={22} strokeWidth={isAIChatbotOpen ? 2.5 : 2} />
      </motion.button>
    </div>
  );
};
