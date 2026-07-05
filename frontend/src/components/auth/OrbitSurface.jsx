import React, { useRef, useState } from 'react';

export const OrbitSurface = ({ children, className = '' }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`w-full max-w-[390px] md:max-w-[424px] xl:max-w-[500px] xl:min-w-[440px] bg-[#020509]/80 rounded-[24px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-[32px] z-content relative overflow-hidden transition-all duration-500 hover:border-white/[0.12] ${className}`}
    >
      {/* High-tech glowing top laser accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/80 to-transparent opacity-80"></div>
      
      {/* Mouse Spotlight Glare */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[24px] transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(167, 139, 250, 0.08), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
