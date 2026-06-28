import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/project.service';
import { getErrorMessage } from '../../utils/helpers';

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await projectService.getProjects(params);
      return data.data.projects;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchRecentProjects = createAsyncThunk(
  'project/fetchRecentProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await projectService.getRecentProjects();
      return data.data.projects;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const { data } = await projectService.createProject(projectData);
      return data.data.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  projects: [],
  recentProjects: [],
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Recent Projects
      .addCase(fetchRecentProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentProjects = action.payload;
      })
      .addCase(fetchRecentProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
        state.recentProjects = [action.payload, ...state.recentProjects].slice(0, 6);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProjectError } = projectSlice.actions;

export default projectSlice.reducer;
