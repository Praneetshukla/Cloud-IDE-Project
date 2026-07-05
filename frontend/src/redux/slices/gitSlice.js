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
  async ({ projectId, message, filesData }, { rejectWithValue }) => {
    try {
      const { data } = await gitService.createCommit(projectId, message, filesData);
      return data.data.repository;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const revertCommit = createAsyncThunk(
  'git/revertCommit',
  async ({ projectId, commitId }, { rejectWithValue }) => {
    try {
      const { data } = await gitService.revertCommit(projectId, commitId);
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
  activeDiff: null,
};

const gitSlice = createSlice({
  name: 'git',
  initialState,
  reducers: {
    clearGitError: (state) => {
      state.error = null;
    },
    setActiveDiff: (state, action) => {
      state.activeDiff = action.payload;
    },
    clearActiveDiff: (state) => {
      state.activeDiff = null;
    },
    resetGit: (state) => {
      state.repository = null;
      state.isLoading = false;
      state.isCommitting = false;
      state.error = null;
      state.activeDiff = null;
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
      })
      .addCase(revertCommit.pending, (state) => {
        state.isCommitting = true;
        state.error = null;
      })
      .addCase(revertCommit.fulfilled, (state, action) => {
        state.isCommitting = false;
        state.repository = action.payload;
      })
      .addCase(revertCommit.rejected, (state, action) => {
        state.isCommitting = false;
        state.error = action.payload;
      });
  }
});

export const { clearGitError, resetGit, setActiveDiff, clearActiveDiff } = gitSlice.actions;
export default gitSlice.reducer;
