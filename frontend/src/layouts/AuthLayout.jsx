import Logo from '../components/common/Logo';


/**
 * AuthLayout — Centered layout for auth pages with cosmic background.
 * Matches the DashboardLayout aesthetic.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col overflow-hidden relative z-0">
      {/* Cinematic Grain Overlay */}
      <div className="bg-grain"></div>
      
      {/* ─── Architectural Lighting & Background Mesh ─── */}
      <div className="absolute inset-0 z-background pointer-events-none overflow-hidden">
        {/* 4-Point Nebula (Teal & Magenta palette) */}
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] rounded-full bg-cyan-600 opacity-[0.06] blur-[130px] animate-drift-left"></div>
        <div className="absolute bottom-[-25%] right-[-15%] w-[80%] h-[80%] rounded-full bg-fuchsia-600 opacity-[0.05] blur-[130px] animate-drift-right"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500 opacity-[0.04] blur-[120px] animate-drift-left"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600 opacity-[0.03] blur-[120px] animate-drift-right"></div>

        {/* Glowing Gas Giant Planetary Ring */}
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full border border-cyan-500/10 bg-gradient-to-bl from-cyan-500/5 via-fuchsia-500/3 to-transparent blur-[60px] animate-pulse-node"></div>

        {/* Floating cosmic dust particles */}
        <div className="absolute top-[25%] left-[20%] w-[3px] h-[3px] rounded-full bg-white opacity-20 shadow-[0_0_6px_white]"></div>
        <div className="absolute top-[65%] left-[15%] w-[2px] h-[2px] rounded-full bg-white opacity-10 shadow-[0_0_4px_white]"></div>
        <div className="absolute top-[45%] right-[25%] w-[4px] h-[4px] rounded-full bg-white opacity-20 shadow-[0_0_8px_white]"></div>

        {/* Subtle scrolling mesh background */}
        <div 
          className="absolute inset-0 opacity-[0.02] animate-grid-pan"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: `48px 48px`
          }}
        ></div>
      </div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between p-6 w-full max-w-7xl mx-auto">
        <Logo size="md" />

      </div>

      {/* Centered Form Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
