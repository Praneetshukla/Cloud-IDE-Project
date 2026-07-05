import React from 'react';

// Generates a subtle static noise/star SVG pattern
const createStarfield = (density = 100, color = '255,255,255', size = 1.5) => {
  let stars = '';
  for (let i = 0; i < density; i++) {
    const x = Math.floor(Math.random() * 800);
    const y = Math.floor(Math.random() * 800);
    const opacity = Math.random() * 0.8 + 0.2;
    const r = Math.random() * size + 0.2;
    stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(${color},${opacity})" />`;
  }
  const svgString = `<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">${stars}</svg>`;
  return `url("data:image/svg+xml;base64,${btoa(svgString)}")`;
};

export const PlanetaryBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden bg-[#020509]">
      
      {/* ─── Deep Nebula Gas (Aurora) ─── */}
      <div className="absolute inset-0 opacity-80 mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-aurora-1 blur-[120px] animate-float-particle"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-aurora-2 blur-[100px] animate-float-particle animation-delay-500"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-aurora-3 blur-[120px] animate-float-particle animation-delay-700"></div>
      </div>

      {/* ─── Parallax Starfields ─── */}
      <div className="absolute inset-0 opacity-60">
        {/* Distant small stars (slow drift) */}
        <div 
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow"
          style={{ 
            backgroundImage: createStarfield(600, '255,255,255', 0.8),
            backgroundSize: '800px 800px',
            animationDuration: '300s'
          }}
        />
        {/* Midground medium stars (medium drift) */}
        <div 
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow"
          style={{ 
            backgroundImage: createStarfield(200, '167,139,250', 1.5),
            backgroundSize: '600px 600px',
            animationDuration: '200s',
            animationDirection: 'reverse'
          }}
        />
        {/* Foreground large stars (fast drift) */}
        <div 
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin-slow"
          style={{ 
            backgroundImage: createStarfield(50, '96,165,250', 2.5),
            backgroundSize: '400px 400px',
            animationDuration: '100s'
          }}
        />
      </div>

      {/* ─── Shooting Stars ─── */}
      <div className="absolute top-[10%] left-[10%] w-[100px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_white] rotate-45 animate-shooting-star" style={{ animationDelay: '1s', animationDuration: '8s' }} />
      <div className="absolute top-[30%] left-[-10%] w-[150px] h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#67e8f9] rotate-45 animate-shooting-star" style={{ animationDelay: '4s', animationDuration: '6s' }} />
      <div className="absolute top-[60%] left-[-20%] w-[200px] h-[2px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_15px_#e879f9] rotate-45 animate-shooting-star" style={{ animationDelay: '7s', animationDuration: '10s' }} />
      <div className="absolute top-[-10%] left-[40%] w-[120px] h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_10px_#818cf8] rotate-45 animate-shooting-star" style={{ animationDelay: '11s', animationDuration: '7s' }} />

    </div>
  );
};
