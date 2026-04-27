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
        <path
          d="M20 4L34 11V29L20 36L6 29V11L20 4Z"
          fill={`${themeColor}1a`}
          stroke={themeColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 12V28M13 20H27"
          stroke={themeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="12" r="2.5" fill="#EBEBEB" />
        <circle cx="20" cy="28" r="2.5" fill="#EBEBEB" />
        <circle cx="13" cy="20" r="2.5" fill="#EBEBEB" />
        <circle cx="27" cy="20" r="2.5" fill="#EBEBEB" />
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
