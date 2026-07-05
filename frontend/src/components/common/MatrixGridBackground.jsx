import React, { useEffect, useRef } from 'react';

export const MatrixGridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Grid configuration
    const gridSize = 40;
    let offset = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)'; // Very faint cyan grid
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offset % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      offset += 0.5; // Scroll speed
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden bg-[#020509]">
      {/* ─── Glowing Neon Orbs ─── */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] rounded-full bg-cyan-600 opacity-[0.08] blur-[130px] animate-drift-left"></div>
        <div className="absolute bottom-[-25%] right-[-15%] w-[80%] h-[80%] rounded-full bg-fuchsia-600 opacity-[0.06] blur-[130px] animate-drift-right"></div>
        <div className="absolute bottom-[-45%] left-[20%] w-[900px] h-[900px] rounded-full border border-cyan-500/10 bg-gradient-to-tr from-cyan-500/5 via-fuchsia-500/3 to-transparent blur-[80px] animate-pulse-node"></div>
      </div>
      
      {/* ─── Scrolling Perspective Grid ─── */}
      <div className="absolute inset-0 w-full h-full" style={{ perspective: '1000px' }}>
        <div className="w-full h-full origin-bottom" style={{ transform: 'rotateX(60deg) scale(2)', transformStyle: 'preserve-3d' }}>
           <canvas
            ref={canvasRef}
            className="block w-full h-full opacity-60"
          />
        </div>
      </div>
      
      {/* ─── Gradient Fade Overlay ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020509] via-transparent to-[#020509] pointer-events-none z-10" />
    </div>
  );
};
