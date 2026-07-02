import React from 'react';

export const OrbitSurface = ({ children, className = '' }) => {
  return (
    <div 
      className={`w-full max-w-[390px] md:max-w-[424px] xl:max-w-[500px] xl:min-w-[440px] bg-surface/80 rounded-xl border border-white/10 shadow-hologram backdrop-blur-xl z-content relative overflow-hidden ${className}`}
    >
      {/* High-tech glowing top laser accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 animate-pulse"></div>
      {children}
    </div>
  );
};
