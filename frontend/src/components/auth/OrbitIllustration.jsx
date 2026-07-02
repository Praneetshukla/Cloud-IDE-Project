import React from 'react';

/**
 * OrbitIllustration
 * A highly subtle, architectural SVG illustration representing the brand.
 * 2-3 orbital paths, 1 node, minimal opacity. 
 * Must remain completely subordinate to the interface.
 */
export const OrbitIllustration = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none opacity-[0.1] ${className}`} aria-hidden="true">
      <svg 
        viewBox="0 0 800 800" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Core Star Node (Pulsing) */}
        <circle 
          cx="400" 
          cy="400" 
          r="8" 
          className="origin-center fill-accent animate-pulse-node"
        />
        <circle 
          cx="400" 
          cy="400" 
          r="16" 
          className="origin-center stroke-accent/20 animate-pulse-node"
          strokeWidth="1"
        />

        {/* Orbital Path 1 (Dashed - Rotating Slow) */}
        <circle 
          cx="400" 
          cy="400" 
          r="260" 
          stroke="white" 
          strokeWidth="1" 
          strokeDasharray="4 12"
          strokeOpacity="0.4"
          className="origin-center animate-orbit-slow"
        />
        
        {/* Tilted System (Rotating Medium) */}
        <g className="origin-center animate-orbit-medium">
          {/* Orbital Path 2 */}
          <ellipse 
            cx="400" 
            cy="400" 
            rx="360" 
            ry="140" 
            stroke="white" 
            strokeWidth="1" 
            strokeOpacity="0.3"
            transform="rotate(-25 400 400)"
          />

          {/* Node on Path 2 */}
          <circle 
            cx="42" 
            cy="400" 
            r="4" 
            fill="white" 
            className="fill-accent filter drop-shadow-[0_0_6px_var(--color-accent)]"
            transform="rotate(-25 400 400)"
          />
        </g>

        {/* Outer Orbital Boundary (Static) */}
        <circle 
          cx="400" 
          cy="400" 
          r="395" 
          stroke="url(#subtle-gradient)" 
          strokeWidth="1" 
          strokeOpacity="0.2"
        />

        <defs>
          <linearGradient id="subtle-gradient" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.4" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
