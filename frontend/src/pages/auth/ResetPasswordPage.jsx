import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import { OrbitIllustration } from '../../components/auth/OrbitIllustration';
import { NeuralBackground } from '../../components/auth/NeuralBackground';
import Logo from '../../components/common/Logo';

const ResetPasswordPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-transparent text-text-primary selection:bg-accent/30 flex overflow-hidden z-0 animate-fade-in">
      
      {/* ─── Neural Network Background ─── */}
      <NeuralBackground />

      {/* 42% Canvas (Hero/Brand Space) */}
      <div className="hidden lg:flex lg:w-[42%] relative border-r border-border items-center justify-center">
        
        {/* Glowing vertical divider overlay */}
        <div className="absolute top-0 right-[-1px] w-[1px] h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent"></div>
        
        {/* Brand Illustration fixed to the Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
           <OrbitIllustration className="w-[120%] h-[120%] translate-x-[-10%]" />
        </div>

        <div className="relative w-full max-w-[500px] h-full py-12 px-12 xl:px-0 flex flex-col justify-center z-content">
          
          {/* Top: Logo */}
          <div className="mb-12 2xl:mb-[80px]">
            <Logo size="md" />
          </div>
          
          {/* Middle: Hero Typography */}
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl xl:text-[44px] font-bold leading-[1.1] tracking-tight mb-8 2xl:mb-[40px] animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 drop-shadow-sm">
              Build software<br />without<br />friction.
            </h1>
            <p className="text-base text-text-secondary font-medium leading-relaxed max-w-[460px] mb-10 2xl:mb-[48px] animate-fade-in-up animation-delay-100">
              Orbit is a next-generation cloud IDE built for speed, collaboration, and limitless possibilities.
            </p>

            <div className="flex flex-col gap-10">
              <div className="flex gap-5 items-start group hover-lift animate-fade-in-up animation-delay-200">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors duration-fast">
                  <svg className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-text-primary group-hover:text-accent transition-colors duration-fast">Blazing Fast</span>
                  <span className="text-[14px] text-text-secondary mt-1">Instant environments, zero setup required.</span>
                </div>
              </div>
              <div className="flex gap-5 items-start group hover-lift animate-fade-in-up animation-delay-300">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors duration-fast">
                  <svg className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-text-primary group-hover:text-accent transition-colors duration-fast">Built to Collaborate</span>
                  <span className="text-[14px] text-text-secondary mt-1">Real-time collaboration that just works.</span>
                </div>
              </div>
              <div className="flex gap-5 items-start group hover-lift animate-fade-in-up animation-delay-400">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors duration-fast">
                  <svg className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-text-primary group-hover:text-accent transition-colors duration-fast">Enterprise Ready</span>
                  <span className="text-[14px] text-text-secondary mt-1">Security and scale at every layer.</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom: Footer Microcopy */}
          <div className="mt-12 2xl:mt-[64px] text-[13px] text-text-tertiary font-medium animate-fade-in-up animation-delay-500">
            © 2026 Orbit Inc.
          </div>
        </div>
      </div>

      {/* 58% Stage (Authentication Space) */}
      <div className="w-full lg:w-[58%] relative flex items-center justify-center lg:justify-start lg:pl-16 xl:pl-[120px] lg:pr-12 xl:pr-0 p-6 sm:p-12 z-content animate-fade-in-up animation-delay-100">
        <div className="w-full max-w-[400px] hover-glow rounded-[24px] transition-all duration-300">
          <ResetPasswordForm />
        </div>
      </div>
      
    </div>
  );
};

export default ResetPasswordPage;
