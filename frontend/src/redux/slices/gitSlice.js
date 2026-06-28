import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gitService from '../../services/git.service';

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred';
};

export const fetchRepository = createAsyncThunk(
  'git/fetchRepository',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await gitService.getRepository(projectId);
      return data.data.repository;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createCommit = createAsyncThunk(
  'git/createCommit',
  async ({ projectId, message }, { rejectWithValue }) => {
    try {
      const { data } = await gitService.createCommit(projectId, message);
      return data.data.repository;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  repository: null,
  isLoading: false,
  isCommitting: false,
  error: null,
};

const gitSlice = createSlice({
  name: 'git',
  initialState,
  reducers: {
    clearGitError: (state) => {
      state.error = null;
    },
    resetGit: (state) => {
      state.repository = null;
      state.isLoading = false;
      state.isCommitting = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepository.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepository.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repository = action.payload;
      })
      .addCase(fetchRepository.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCommit.pending, (state) => {
        state.isCommitting = true;
        state.error = null;
      })
      .addCase(createCommit.fulfilled, (state, action) => {
        state.isCommitting = false;
        state.repository = action.payload;
      })
      .addCase(createCommit.rejected, (state, action) => {
        state.isCommitting = false;
        state.error = action.payload;
      });
  }
});

export const { clearGitError, resetGit } = gitSlice.actions;
export default gitSlice.reducer;
