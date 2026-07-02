import React from 'react';

export const OrbitButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`h-[46px] px-4 rounded-lg font-semibold text-input flex items-center justify-center transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-focus-ring ${
        variant === 'primary' 
          ? 'bg-accent text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_12px_rgba(60,111,219,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] hover:brightness-[1.02] active:scale-[0.98] active:shadow-none' 
          : 'bg-white/[0.02] text-text-primary border border-border shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-white/[0.06] hover:border-white/15 active:scale-[0.98]'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
