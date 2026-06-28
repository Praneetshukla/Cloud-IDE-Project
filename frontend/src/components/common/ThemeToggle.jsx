import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { HiSun, HiMoon } from 'react-icons/hi';

/**
 * Dark/Light mode toggle button with smooth icon transition.
 */
const ThemeToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      className={`relative p-2 rounded-lg transition-all duration-300 cursor-pointer
        hover:bg-[var(--color-bg-tertiary)]
        text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
        ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      <div className="relative w-5 h-5">
        <HiSun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            darkMode
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100 text-amber-500'
          }`}
        />
        <HiMoon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            darkMode
              ? 'opacity-100 rotate-0 scale-100 text-indigo-400'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
