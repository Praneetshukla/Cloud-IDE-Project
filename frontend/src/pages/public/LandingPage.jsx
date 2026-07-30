import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import { MagneticCard } from '../../components/common/MagneticCard';
import { NeuralBackground } from '../../components/auth/NeuralBackground';
import { OrbitIllustration } from '../../components/auth/OrbitIllustration';

const LandingPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-bg-base text-text-primary selection:bg-accent/30 overflow-hidden font-sans">
      
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <NeuralBackground />
        {/* Glow overlay */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-accent/15 blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-content flex flex-col min-h-screen max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header / Navbar */}
        <header className="w-full flex items-center justify-between py-8 animate-fade-in-up">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center mt-12 lg:mt-24 mb-32">
          
          <div className="relative w-full flex justify-center mb-8 pointer-events-none">
             <div className="absolute inset-0 flex items-center justify-center scale-150 opacity-40">
                <OrbitIllustration />
             </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-8 animate-fade-in-up animation-delay-100 max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 drop-shadow-lg">
            Build software <br className="hidden md:block"/> without friction.
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-2xl mb-12 animate-fade-in-up animation-delay-200">
            Orbit is a next-generation cloud IDE built for speed, collaboration, and limitless possibilities. Write, run, and scale from anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-300">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="px-8 py-4 text-base shadow-[0_0_40px_-10px_var(--color-accent)] hover:shadow-[0_0_60px_-10px_var(--color-accent)] transition-shadow">
                Start Coding for Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-base">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-500">
            
            <MagneticCard className="p-8 flex flex-col items-start bg-bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Blazing Fast</h3>
              <p className="text-text-secondary text-sm leading-relaxed text-left">
                Instant environments, zero setup required. Your workspace is ready the moment you log in.
              </p>
            </MagneticCard>
            
            <MagneticCard className="p-8 flex flex-col items-start bg-bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Collaborative</h3>
              <p className="text-text-secondary text-sm leading-relaxed text-left">
                Real-time collaboration that just works. Code together, debug together, ship together.
              </p>
            </MagneticCard>
            
            <MagneticCard className="p-8 flex flex-col items-start bg-bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Enterprise Ready</h3>
              <p className="text-text-secondary text-sm leading-relaxed text-left">
                Security and scale at every layer. Built on resilient cloud infrastructure you can trust.
              </p>
            </MagneticCard>
            
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 border-t border-border/40 flex items-center justify-between mt-auto">
          <p className="text-xs text-text-tertiary">
            © 2026 Orbit Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Terms</a>
          </div>
        </footer>
        
      </div>
    </div>
  );
};

export default LandingPage;
