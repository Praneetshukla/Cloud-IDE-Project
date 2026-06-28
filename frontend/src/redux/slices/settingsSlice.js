import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingsService from '../../services/settings.service';

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await settingsService.getSettings();
      return data.data.settings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const { data } = await settingsService.updateSettings(settingsData);
      return data.data.settings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const initialState = {
  preferences: {
    theme: 'vs-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on'
  },
  isSettingsModalOpen: false,
  isLoading: false,
  isSaving: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSettingsModal: (state) => {
      state.isSettingsModalOpen = !state.isSettingsModalOpen;
    },
    closeSettingsModal: (state) => {
      state.isSettingsModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.preferences = action.payload;
        }
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSettings.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isSaving = false;
        state.preferences = action.payload;
        state.isSettingsModalOpen = false; // Close modal on successful save
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });
  }
});

export const { toggleSettingsModal, closeSettingsModal } = settingsSlice.actions;
export default settingsSlice.reducer;
