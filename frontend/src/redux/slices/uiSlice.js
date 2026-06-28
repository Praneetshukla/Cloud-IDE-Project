import { createSlice } from '@reduxjs/toolkit';

/**
 * UI slice — manages global UI state like dark mode, sidebar, notifications.
 */

const getInitialDarkMode = () => {
  const saved = localStorage.getItem('orbit_darkMode');
  if (saved !== null) return JSON.parse(saved);
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initialState = {
  darkMode: getInitialDarkMode(),
  sidebarOpen: true,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('orbit_darkMode', JSON.stringify(state.darkMode));

      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('orbit_darkMode', JSON.stringify(action.payload));

      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  toggleMobileMenu,
  closeMobileMenu,
} = uiSlice.actions;

export default uiSlice.reducer;
