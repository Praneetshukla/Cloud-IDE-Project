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

export const toggleProjectFavorite = createAsyncThunk(
  'project/toggleFavorite',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await projectService.toggleFavorite(projectId);
      return data.data.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTrashedProjects = createAsyncThunk(
  'project/fetchTrashedProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await projectService.getTrashedProjects();
      return data.data.projects;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const restoreProject = createAsyncThunk(
  'project/restoreProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await projectService.restoreProject(projectId);
      return data.data.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const hardDeleteProject = createAsyncThunk(
  'project/hardDeleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectService.hardDeleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  projects: [],
  recentProjects: [],
  trashedProjects: [],
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
      })
      // Toggle Favorite
      .addCase(toggleProjectFavorite.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        const pIndex = state.projects.findIndex(p => p._id === updatedProject._id);
        if (pIndex !== -1) {
          state.projects[pIndex] = updatedProject;
        }
        const rpIndex = state.recentProjects.findIndex(p => p._id === updatedProject._id);
        if (rpIndex !== -1) {
          state.recentProjects[rpIndex] = updatedProject;
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        const deletedId = action.payload;
        // Project was soft-deleted, so we remove from active lists
        state.projects = state.projects.filter(p => p._id !== deletedId);
        state.recentProjects = state.recentProjects.filter(p => p._id !== deletedId);
      })
      // Fetch Trashed
      .addCase(fetchTrashedProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTrashedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trashedProjects = action.payload;
      })
      .addCase(fetchTrashedProjects.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Restore Project
      .addCase(restoreProject.fulfilled, (state, action) => {
        const restoredProject = action.payload;
        state.trashedProjects = state.trashedProjects.filter(p => p._id !== restoredProject._id);
        state.projects.unshift(restoredProject);
        state.recentProjects = [restoredProject, ...state.recentProjects].slice(0, 6);
      })
      // Hard Delete
      .addCase(hardDeleteProject.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.trashedProjects = state.trashedProjects.filter(p => p._id !== deletedId);
      });
  }
});

export const { clearProjectError } = projectSlice.actions;

export default projectSlice.reducer;
