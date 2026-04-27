import React from 'react';
import { motion } from 'framer-motion';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

interface HeaderButtonProps {
  icon: React.ElementType;
  onClick: () => void;
  title: string;
  danger?: boolean;
  active?: boolean;
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({ icon: Icon, onClick, title, danger, active }) => {
  const { accentColor } = useAppViewModel();
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05, 
        background: active ? `${accentColor}33` : (danger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)'),
        borderColor: active ? accentColor : (danger ? '#ef4444' : 'rgba(255,255,255,0.3)')
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      style={{
        background: active ? `${accentColor}1a` : 'transparent',
        border: '1px solid',
        borderColor: active ? accentColor : 'rgba(255,255,255,0.08)',
        borderRadius: '8px',
        width: '36px', height: '36px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s ease',
        color: active ? accentColor : (danger ? '#ef4444' : '#737373'),
      }}
    >
      <Icon size={18} />
    </motion.button>
  );
};
