import SignupForm from '../../components/auth/SignupForm';
import { OrbitIllustration } from '../../components/auth/OrbitIllustration';

const SignupPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-transparent text-text-primary selection:bg-accent/30 flex overflow-hidden z-0 animate-fade-in">
      
      {/* ─── Architectural Lighting & Background Mesh ─── */}
      <div className="absolute inset-0 z-background pointer-events-none overflow-hidden">
        {/* 4-Point Nebula (Teal & Magenta palette) */}
        {/* Glow 1: Top-Left (Drifting Blue) */}
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] rounded-full bg-cyan-600 opacity-[0.08] blur-[130px] animate-drift-left"></div>
        {/* Glow 2: Bottom-Right (Drifting Violet) */}
        <div className="absolute bottom-[-25%] right-[-15%] w-[80%] h-[80%] rounded-full bg-fuchsia-600 opacity-[0.06] blur-[130px] animate-drift-right"></div>
        {/* Glow 3: Top-Right (Drifting Teal) */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500 opacity-[0.04] blur-[120px] animate-drift-left"></div>
        {/* Glow 4: Bottom-Left (Drifting Purple) */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600 opacity-[0.04] blur-[120px] animate-drift-right"></div>

        {/* Expanding Signal Ripples (Centered at Divider) */}
        <div className="absolute top-[50%] left-[42%] w-[800px] h-[800px] rounded-full border border-accent/15 animate-ripple-1"></div>
        <div className="absolute top-[50%] left-[42%] w-[800px] h-[800px] rounded-full border border-violet-500/15 animate-ripple-2"></div>

        {/* Constellation Star-field (At Grid Intersections) */}
        <div className="absolute top-[15%] left-[25%] w-[4px] h-[4px] rounded-full bg-white opacity-40 shadow-[0_0_8px_white]"></div>
        <div className="absolute top-[35%] left-[10%] w-[2px] h-[2px] rounded-full bg-white opacity-30 shadow-[0_0_4px_white]"></div>
        <div className="absolute top-[75%] left-[35%] w-[3px] h-[3px] rounded-full bg-white opacity-20 shadow-[0_0_6px_white]"></div>
        <div className="absolute top-[25%] right-[20%] w-[5px] h-[5px] rounded-full bg-white opacity-50 shadow-[0_0_10px_white]"></div>
        <div className="absolute top-[65%] right-[10%] w-[3px] h-[3px] rounded-full bg-white opacity-30 shadow-[0_0_6px_white]"></div>
        <div className="absolute top-[80%] right-[30%] w-[2px] h-[2px] rounded-full bg-white opacity-20 shadow-[0_0_4px_white]"></div>

        {/* Floating cosmic dust particles */}
        <div className="absolute top-[20%] left-[15%] w-[4px] h-[4px] rounded-full bg-accent/60 animate-particle-1"></div>
        <div className="absolute top-[60%] left-[30%] w-[6px] h-[6px] rounded-full bg-violet-500/50 animate-particle-2"></div>
        <div className="absolute top-[40%] right-[20%] w-[5px] h-[5px] rounded-full bg-blue-400/40 animate-particle-3"></div>

        {/* Subtle scrolling mesh background to break up pure black */}
        <div 
          className="absolute inset-0 opacity-[0.015] animate-grid-pan"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: `48px 48px`
          }}
        ></div>
      </div>

      {/* 42% Canvas (Hero/Brand Space) */}
      <div className="hidden lg:flex lg:w-[45%] relative border-r border-border items-center justify-center">
        
        {/* Glowing vertical divider overlay */}
        <div className="absolute top-0 right-[-1px] w-[1px] h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent"></div>
        
        {/* Brand Illustration fixed to the Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
           <OrbitIllustration className="w-[120%] h-[120%] translate-x-[-10%]" />
        </div>

        <div className="relative w-full max-w-[480px] h-full py-12 px-12 xl:px-0 flex flex-col justify-between z-content">
          
          {/* Top: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-text-primary flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-background" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Orbit</span>
          </div>
          
          {/* Middle: Hero Typography */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-[44px] xl:text-[52px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 leading-tight tracking-tight mb-6">
              The future <br />of development <br />is in Orbit.
            </h1>
            <p className="text-lg text-text-secondary font-medium mb-12 max-w-[360px] leading-relaxed">
              Orbit is a next-generation cloud IDE built for speed, collaboration, and limitless possibilities.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-text-primary">Blazing Fast</span>
                  <span className="text-[14px] text-text-secondary mt-1">Instant environments, zero setup required.</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-text-primary">Built to Collaborate</span>
                  <span className="text-[14px] text-text-secondary mt-1">Real-time collaboration that just works.</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-text-primary">Enterprise Ready</span>
                  <span className="text-[14px] text-text-secondary mt-1">Security and scale at every layer.</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom: Footer Microcopy */}
          <div className="text-[14px] text-text-tertiary font-medium">
            © 2026 Orbit Inc.
          </div>
        </div>
      </div>

      {/* 55% Stage (Authentication Space) */}
      <div className="w-full lg:w-[55%] relative flex items-center justify-center p-6 sm:p-12 z-content">
        <div className="w-full max-w-[440px]">
          <SignupForm />
        </div>
      </div>
      
    </div>
  );
};

export default SignupPage;
