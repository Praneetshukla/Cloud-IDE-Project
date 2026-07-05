import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiLogout, HiCog, HiUser, HiOutlineSearch } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import Logo from '../components/common/Logo';

import Avatar from '../components/common/Avatar';
import Sidebar from '../components/common/Sidebar';
import { toggleMobileMenu } from '../redux/slices/uiSlice';
import { cn } from '../utils/helpers';
import { MatrixGridBackground } from '../components/common/MatrixGridBackground';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);

  // Simple local state for search input for now
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex overflow-hidden relative z-0">
      {/* Cinematic Grain Overlay */}
      <div className="bg-grain"></div>
      
      {/* ─── Cybernetic Grid Background ─── */}
      <MatrixGridBackground />
      
      {/* ─── Desktop Sidebar ───────────────────────────────────── */}
      <Sidebar />

      {/* ─── Mobile Sidebar Overlay ────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => dispatch(toggleMobileMenu())}
          />
          <div className="relative w-64 max-w-sm flex-1 flex flex-col bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] animate-fade-in-up">
            <div className="h-14 flex items-center px-4 border-b border-[var(--color-border)]">
              <Logo size="sm" />
              <button 
                className="ml-auto p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg cursor-pointer"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            {/* Mobile nav items would go here (reuse Sidebar items) */}
            <div className="flex-1 p-4 space-y-2">
               <button onClick={() => { navigate('/dashboard'); dispatch(toggleMobileMenu()); }} className="w-full text-left p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]">Dashboard</button>
               <button onClick={() => { navigate('/profile'); dispatch(toggleMobileMenu()); }} className="w-full text-left p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]">Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content Area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ─── Navbar ──────────────────────────────────────────── */}
        <nav className="sticky top-0 z-40 h-14 border-b border-white/5 bg-surface/30 backdrop-blur-xl flex-shrink-0">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            
            {/* Left: Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] cursor-pointer text-[var(--color-text-secondary)]"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                <HiMenu className="h-5 w-5" />
              </button>

              <form onSubmit={handleSearch} className="hidden sm:flex max-w-md w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects, files, workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-1.5 border border-white/5 rounded-lg leading-5 bg-background/50 hover:bg-white/[0.01] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-accent/80 focus:ring-4 focus:ring-accent/15 sm:text-sm transition-all duration-200"
                />
              </form>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-3">


              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer border border-transparent hover:border-[var(--color-border)]"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-[var(--color-text-primary)] max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-xl animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                        >
                          <HiUser className="h-4 w-4" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                        >
                          <HiCog className="h-4 w-4" />
                          Settings
                        </button>
                      </div>
                      <div className="border-t border-[var(--color-border)] py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <HiLogout className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ─── Page Content ──────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
