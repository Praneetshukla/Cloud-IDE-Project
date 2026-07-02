import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineCode
} from 'react-icons/hi';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { cn } from '../../utils/helpers';
import Logo from './Logo';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const navItems = [
    { icon: HiOutlineHome, label: 'Dashboard', path: '/dashboard', exact: true },
    { icon: HiOutlineViewGrid, label: 'Workspaces', path: '/dashboard#workspaces', hash: '#workspaces' },
    { icon: HiOutlineCollection, label: 'Projects', path: '/dashboard#projects', hash: '#projects' },
  ];

  const bottomItems = [
    { icon: HiOutlineCog, label: 'Settings', path: '/profile' },
  ];

  const renderNavItems = (items) => {
    return items.map((item) => {
      const isActive = item.hash 
        ? location.pathname === '/dashboard' && location.hash === item.hash
        : item.exact
          ? location.pathname === item.path && !location.hash
          : location.pathname.startsWith(item.path);
      return (
        <Link
          key={item.label}
          to={item.path}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer border',
            isActive
              ? 'bg-cyan-500/10 text-cyan-400 font-medium border-cyan-500/20 shadow-[0_0_15px_rgba(8,145,178,0.05)]'
              : 'text-[var(--color-text-secondary)] hover:bg-white/[0.02] hover:text-[var(--color-text-primary)] border-transparent'
          )}
          title={!sidebarOpen ? item.label : undefined}
        >
          {/* Glowing Vertical Lightbar */}
          {isActive && (
            <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          )}
          <item.icon
            className={cn(
              'h-5 w-5 flex-shrink-0 transition-colors',
              isActive ? 'text-cyan-400' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]'
            )}
          />
          {sidebarOpen && (
            <span className="truncate opacity-100 transition-opacity duration-200">
              {item.label}
            </span>
          )}
        </Link>
      );
    });
  };

  return (
    <aside
      style={{ width: sidebarOpen ? '256px' : '80px' }}
      className={cn(
        'hidden lg:flex flex-col border-r border-white/5 bg-surface/40 backdrop-blur-2xl transition-all duration-300 relative z-30'
      )}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/5">
        {sidebarOpen ? (
          <Logo size="sm" />
        ) : (
          <div className="w-full flex justify-center">
            <Logo size="sm" showText={false} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 flex flex-col">
        {renderNavItems(navItems)}
        
        <div className="mt-auto pt-4 space-y-1">
          {renderNavItems(bottomItems)}
        </div>
      </div>

      <div className="p-3 border-t border-white/5 flex justify-center">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors w-full flex justify-center cursor-pointer"
        >
          {sidebarOpen ? (
            <HiOutlineChevronDoubleLeft className="h-5 w-5" />
          ) : (
            <HiOutlineChevronDoubleRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
