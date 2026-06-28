import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode } from '../redux/slices/uiSlice';

/**
 * Custom hook for dark mode management.
 * Syncs with localStorage, system preferences, and DOM class.
 */
const useDarkMode = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const saved = localStorage.getItem('orbit_darkMode');
      if (saved === null) {
        dispatch(setDarkMode(e.matches));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return darkMode;
};

export default useDarkMode;
