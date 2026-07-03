import React from 'react';

export const OrbitIllustration = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none ${className}`}>
      <svg 
        viewBox="0 0 800 800" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white opacity-[0.03]"
      >
        {/* Architectural Grid */}
        <path d="M100 0 V800 M250 0 V800 M550 0 V800 M700 0 V800" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
        <path d="M0 100 H800 M0 250 H800 M0 550 H800 M0 700 H800" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
        
        {/* Thin Orbital Rings */}
        <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="290" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" />
        
        {/* Nodes */}
        <circle cx="100" cy="400" r="3" fill="currentColor" />
        <circle cx="700" cy="400" r="3" fill="currentColor" />
        <circle cx="400" cy="100" r="3" fill="currentColor" />
        <circle cx="400" cy="700" r="3" fill="currentColor" />
        
        {/* Diagonal architectural lines */}
        <path d="M100 100 L700 700" stroke="currentColor" strokeWidth="0.5" />
        <path d="M100 700 L700 100" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
};
