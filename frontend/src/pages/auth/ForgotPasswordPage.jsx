import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { OrbitIllustration } from '../../components/auth/OrbitIllustration';

const ForgotPasswordPage = () => {
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
      <div className="hidden lg:block lg:w-[42%] relative border-r border-border">
        
        {/* Glowing vertical divider overlay */}
        <div className="absolute top-0 right-[-1px] w-[1px] h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent"></div>
        
        {/* Brand Illustration fixed to the Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
           <OrbitIllustration className="w-[120%] h-[120%] translate-x-[-15%]" />
        </div>

        <div className="absolute inset-0 p-48 flex flex-col justify-between z-content">
          
          {/* Top: Logo */}
          <div className="flex items-center gap-12">
            <div className="w-24 h-24 rounded-[6px] bg-accent flex items-center justify-center">
              <svg className="w-16 h-16 text-white" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="2" fill="currentColor" />
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="11.8" cy="4.2" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-subtitle font-semibold tracking-tight">Orbit</span>
          </div>
          
          {/* Middle: Hero Typography */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-[48px] font-semibold text-text-primary leading-tight tracking-tight mb-16 max-w-[480px]">
              The future <br className="hidden lg:block" />of development <br className="hidden lg:block" />is in Orbit.
            </h1>
            <p className="text-base lg:text-[17px] text-text-secondary font-medium mb-40 max-w-[320px] leading-normal">
              Orbit is a next-generation cloud IDE built for speed, collaboration, and limitless possibilities.
            </p>

            <div className="flex flex-col gap-32">
              <div className="flex items-start gap-12">
                <svg className="w-16 h-16 text-accent flex-shrink-0 mt-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="2" fill="currentColor" className="animate-pulse" />
                  <ellipse cx="8" cy="8" rx="6" ry="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" transform="rotate(-30 8 8)" />
                </svg>
                <div className="flex flex-col gap-4">
                  <span className="text-[14px] font-medium text-text-primary">Blazing Fast</span>
                  <span className="text-[13px] text-text-secondary">Instant environments, zero setup.</span>
                </div>
              </div>

              <div className="flex items-start gap-12">
                <svg className="w-16 h-16 text-accent flex-shrink-0 mt-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="2" fill="currentColor" className="animate-pulse" />
                  <ellipse cx="8" cy="8" rx="6" ry="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" transform="rotate(-30 8 8)" />
                </svg>
                <div className="flex flex-col gap-4">
                  <span className="text-[14px] font-medium text-text-primary">Built to Collaborate</span>
                  <span className="text-[13px] text-text-secondary">Real-time collaboration that just works.</span>
                </div>
              </div>

              <div className="flex items-start gap-12">
                <svg className="w-16 h-16 text-accent flex-shrink-0 mt-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="2" fill="currentColor" className="animate-pulse" />
                  <ellipse cx="8" cy="8" rx="6" ry="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" transform="rotate(-30 8 8)" />
                </svg>
                <div className="flex flex-col gap-4">
                  <span className="text-[14px] font-medium text-text-primary">Enterprise Ready</span>
                  <span className="text-[13px] text-text-secondary">Security and scale at every layer.</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom: Footer Microcopy */}
          <div className="text-[13px] text-text-secondary font-medium">
            © 2026 Orbit Inc.
          </div>
        </div>
      </div>

      {/* 58% Stage (Authentication Space) */}
      <div className="w-full lg:w-[58%] relative flex items-center justify-center lg:justify-start p-16 sm:p-24 md:p-40 lg:pl-64 lg:pr-32 xl:pl-80 xl:pr-48 z-content">
        <ForgotPasswordForm />
      </div>
      
    </div>
  );
};

export default ForgotPasswordPage;
