import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'danger' | 'outline' | 'subtle';
  size?: 'md' | 'lg' | 'flex';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, children, style, ...props }, ref) => {
    const { accentColor } = useAppViewModel();
    // base styles
    const baseStyle: any = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: '"Inter", sans-serif',
      transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s',
      ...style,
    };

    // Size variants
    if (size === 'md') {
      baseStyle.padding = '10px 20px';
      baseStyle.borderRadius = '8px';
      baseStyle.fontSize = '12px';
      baseStyle.fontWeight = 700;
    } else if (size === 'lg') {
      baseStyle.padding = '12px 24px';
      baseStyle.borderRadius = '12px';
      baseStyle.fontSize = '14px';
      baseStyle.fontWeight = 700;
      baseStyle.width = style?.width || 'auto';
    } else if (size === 'flex') {
      baseStyle.padding = '12px';
      baseStyle.borderRadius = '12px';
      baseStyle.fontSize = '14px';
      baseStyle.fontWeight = 600;
      baseStyle.flex = style?.flex !== undefined ? style.flex : undefined;
    }

    // Color variants
    let whileHover = props.whileHover || {};
    let whileTap = props.whileTap || { scale: 0.95 };

    if (variant === 'primary') {
      baseStyle.background = accentColor;
      baseStyle.color = 'white';
      baseStyle.boxShadow = `0 4px 15px ${accentColor}33`;
      if (!props.whileHover) whileHover = { scale: 1.05, boxShadow: `0 0 20px ${accentColor}4d` };
    } else if (variant === 'danger') {
      baseStyle.background = '#ef4444';
      baseStyle.color = 'white';
      baseStyle.boxShadow = '0 4px 15px rgba(239,68,68,0.2)';
      if (!props.whileHover) whileHover = { scale: 1.05, boxShadow: '0 0 20px rgba(239,68,68,0.3)' };
    } else if (variant === 'outline') {
      baseStyle.background = 'transparent';
      baseStyle.border = '1px solid rgba(255,255,255,0.1)';
      baseStyle.color = '#A3A3A3';
      if (!props.whileHover) whileHover = { scale: 1.02, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.3)' };
      whileTap = props.whileTap || { scale: 0.98 };
    } else if (variant === 'subtle') {
      baseStyle.background = `${accentColor}1a`;
      baseStyle.border = `1px solid ${accentColor}`;
      baseStyle.color = accentColor;
      if (!props.whileHover) whileHover = { translateY: -1, background: `${accentColor}33`, borderColor: accentColor };
      whileTap = props.whileTap || { translateY: 0, scale: 0.98 };
    }

    return (
      <motion.button
        ref={ref}
        whileHover={whileHover}
        whileTap={whileTap}
        style={baseStyle}
        {...props}
      >
        {icon}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
