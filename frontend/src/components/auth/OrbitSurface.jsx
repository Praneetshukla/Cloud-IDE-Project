import React from 'react';

export const OrbitSurface = ({ children, className = '' }) => {
  return (
    <div 
      className={`w-full max-w-[390px] md:max-w-[424px] xl:max-w-[500px] xl:min-w-[440px] bg-[#020509]/95 rounded-[24px] border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_80px_rgba(8,145,178,0.05)] backdrop-blur-2xl z-content relative overflow-hidden ${className}`}
    >
      {/* High-tech glowing top laser accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-80"></div>
      {children}
    </div>
  );
};
