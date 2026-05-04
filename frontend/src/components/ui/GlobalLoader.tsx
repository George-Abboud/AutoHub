import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useStore } from '../../store';
import { Logo } from './Logo';

export const GlobalLoader = () => {
  const isGlobalLoading = useStore(s => s.isGlobalLoading);
  const accentColor = useStore(s => s.accentColor);

  return (
    <AnimatePresence>
      {isGlobalLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(10, 10, 10, 0.7)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'wait'
          }}
        >
          <div style={{ position: 'relative' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: `3px solid ${accentColor}10`,
                borderTopColor: accentColor,
                boxShadow: `0 0 30px ${accentColor}30`
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Logo size={32} />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '24px', textAlign: 'center' }}
          >
            <h3 style={{ 
              color: '#EBEBEB', 
              fontSize: '18px', 
              fontWeight: 800, 
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em'
            }}>
              Syncing Reality
            </h3>
            <p style={{ 
              color: '#737373', 
              fontSize: '14px', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Loader2 size={14} className="animate-spin" />
              Securing data to your vault...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
