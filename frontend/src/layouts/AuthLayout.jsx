import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';

/**
 * AuthLayout — split-screen layout for auth pages.
 * Left: branding panel with animated background.
 * Right: form content.
 * Stacks vertically on mobile.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg-primary)]">
      {/* ─── Left Panel — Branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800" />

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-32 right-16 w-56 h-56 bg-indigo-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-40 h-40 bg-pink-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo size="md" className="text-white" />

          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Code anywhere.
              <br />
              <span className="text-indigo-200">Build anything.</span>
            </h2>
            <p className="text-lg text-indigo-100/80 leading-relaxed">
              A cloud-powered IDE with real-time collaboration, integrated terminal,
              Git workflows, and AI assistance — all in your browser.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['Monaco Editor', 'Live Terminal', 'Git Integration', 'AI Assistant', 'Docker Runtime'].map(
                (feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-100 bg-white/10
                      backdrop-blur-sm rounded-full border border-white/10"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-indigo-200/60">
            <div className="flex -space-x-2">
              {['bg-indigo-400', 'bg-purple-400', 'bg-pink-400', 'bg-cyan-400'].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${color} border-2 border-indigo-700 flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                )
              )}
            </div>
            <span>Join 10,000+ developers building in the cloud</span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel — Form ────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="lg:ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
