import React from 'react';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

interface LogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, showText = false, color }) => {
  const { accentColor } = useAppViewModel();
  const themeColor = color || accentColor;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor={themeColor} />
            <stop offset="100%" stopColor="#FF8272" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines */}
        <path
          d="M10 20L20 10M10 20L20 30M20 10L30 20M20 30L30 20"
          stroke="url(#logoGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        {/* Nodes */}
        <circle cx="10" cy="20" r="4" fill="#171717" stroke="url(#logoGradient)" strokeWidth="2.5" />
        <circle cx="20" cy="10" r="4" fill="#171717" stroke="url(#logoGradient)" strokeWidth="2.5" />
        <circle cx="20" cy="30" r="4" fill="#171717" stroke="url(#logoGradient)" strokeWidth="2.5" />
        <circle cx="30" cy="20" r="5" fill="url(#logoGradient)" filter="url(#glow)" />
        
        {/* Internal Pulse */}
        <circle cx="30" cy="20" r="2" fill="white" />
      </svg>
      {showText && (
        <span style={{ 
          fontSize: '22px', 
          fontWeight: 900, 
          color: '#EBEBEB',
          letterSpacing: '-0.04em',
          fontFamily: '"Inter", sans-serif'
        }}>
          Auto<span style={{ color: themeColor }}>Hub</span>
        </span>
      )}
    </div>
  );
};
