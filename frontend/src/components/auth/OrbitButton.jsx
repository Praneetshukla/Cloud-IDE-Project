import React from 'react';

export const OrbitButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`relative h-[46px] px-4 rounded-lg font-semibold text-[15px] flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020509] focus-visible:ring-indigo-400 overflow-hidden ${
        variant === 'primary' 
          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_4px_15px_rgba(139,92,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_4px_25px_rgba(236,72,153,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-[0.97] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] group' 
          : 'bg-white/[0.03] text-text-primary border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-white/[0.08] hover:border-white/[0.15] active:scale-[0.97]'
      } ${className}`}
      {...props}
    >
      {/* Sweeping Shine Effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay">
          <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg] group-hover:animate-shine animation-delay-200" />
        </div>
      )}

      {children}
      {variant === 'primary' && (
        <svg className="absolute right-4 w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-normal z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      )}
    </button>
  );
};
