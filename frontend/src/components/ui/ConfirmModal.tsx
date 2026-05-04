import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';
import { Button } from './Button';

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  onConfirm, 
  onCancel,
  title = "Clear workspace?",
  message = "This will permanently remove all nodes and edges from this workspace. This action cannot be undone.",
  confirmText = "Clear Everything"
}) => {
  const { accentColor } = useAppViewModel();
  
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#171717',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '32px',
          padding: '40px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', gap: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div style={{
            width: '56px', height: '56px', flexShrink: 0,
            borderRadius: '16px',
            background: `${accentColor}1a`,
            border: `1px solid ${accentColor}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={24} color={accentColor} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#EBEBEB', margin: '0 0 10px 0' }}>{title}</h2>
            <p style={{ fontSize: '15px', color: '#737373', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Button 
            variant="outline"
            size="flex"
            onClick={onCancel}
            style={{ borderRadius: '14px' }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            size="flex"
            onClick={onConfirm}
            style={{ flex: 2, borderRadius: '14px', background: `linear-gradient(135deg, ${accentColor} 0%, #ff8272 100%)` }}
          >
            {confirmText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
