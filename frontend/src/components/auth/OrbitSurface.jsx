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
      className={`w-full max-w-[390px] md:max-w-[424px] xl:max-w-[500px] xl:min-w-[440px] bg-[#050512]/80 rounded-[24px] border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-[32px] z-content relative overflow-hidden transition-all duration-500 hover:border-indigo-400/50 hover:shadow-[0_0_50px_rgba(99,102,241,0.3)] ${className}`}
    >
      {/* Corner Border Enhancements */}
      <div 
        className="absolute inset-0 rounded-[24px] border border-indigo-300 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(120px circle at top left, black, transparent), radial-gradient(120px circle at top right, black, transparent), radial-gradient(120px circle at bottom left, black, transparent), radial-gradient(120px circle at bottom right, black, transparent)',
          WebkitMaskImage: 'radial-gradient(120px circle at top left, black, transparent), radial-gradient(120px circle at top right, black, transparent), radial-gradient(120px circle at bottom left, black, transparent), radial-gradient(120px circle at bottom right, black, transparent)',
          WebkitMaskComposite: 'add',
          maskComposite: 'add',
          boxShadow: '0 0 20px rgba(129,140,248,0.8), inset 0 0 20px rgba(129,140,248,0.8)'
        }}
      ></div>

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
