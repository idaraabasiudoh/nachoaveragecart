import React from 'react';
import { ReactComponent as LogoSVG } from '../assets/logo.svg';

const Logo = ({ size = 'md' }) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  return (
    <div className={`${sizeClasses[size] || sizeClasses.md}`}>
      <LogoSVG className="w-full h-full" />
    </div>
  );
};

export default Logo;
