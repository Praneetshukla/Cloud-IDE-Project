import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import workspaceReducer from './slices/workspaceSlice';
import projectReducer from './slices/projectSlice';
import fileSystemReducer from './slices/fileSystemSlice';
import terminalReducer from './slices/terminalSlice';
import gitReducer from './slices/gitSlice';
import aiReducer from './slices/aiSlice';
import settingsReducer from './slices/settingsSlice';

/**
 * Redux Toolkit store.
 * Slices are added as features are built across phases.
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    ui: uiReducer,
    workspace: workspaceReducer,
    project: projectReducer,
    fileSystem: fileSystemReducer,
    terminal: terminalReducer,
    git: gitReducer,
    ai: aiReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});

export default store;
