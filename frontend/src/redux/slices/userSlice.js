import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user.service';
import { getErrorMessage } from '../../utils/helpers';

/**
 * User slice — manages user profile state and async thunks.
 */

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userService.getProfile();
      return data.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await userService.updateProfile(formData);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await userService.changePassword(formData);
      return data.message;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const { data } = await userService.uploadAvatar(file);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  'user/deleteAvatar',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userService.deleteAvatar();
      return data.data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStats = createAsyncThunk(
  'user/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userService.getStats();
      return data.data.stats;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  profile: null,
  stats: null,
  isLoading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.message = 'Profile updated successfully.';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.message = 'Avatar uploaded successfully.';
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.message = 'Avatar removed.';
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearUserMessage } = userSlice.actions;
export default userSlice.reducer;
