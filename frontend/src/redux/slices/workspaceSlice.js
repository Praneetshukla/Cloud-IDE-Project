import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from '../../services/workspace.service';
import { getErrorMessage } from '../../utils/helpers';

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await workspaceService.getWorkspaces();
      return data.data.workspaces;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchWorkspaceById = createAsyncThunk(
  'workspace/fetchWorkspaceById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await workspaceService.getWorkspace(id);
      return data.data.workspace;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async (workspaceData, { rejectWithValue }) => {
    try {
      const { data } = await workspaceService.createWorkspace(workspaceData);
      return data.data.workspace;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspace/updateWorkspace',
  async ({ id, workspaceData }, { rejectWithValue }) => {
    try {
      const { data } = await workspaceService.updateWorkspace(id, workspaceData);
      return data.data.workspace;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  'workspace/deleteWorkspace',
  async (id, { rejectWithValue }) => {
    try {
      await workspaceService.deleteWorkspace(id);
      return id; // Return the id to remove it from state
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    clearWorkspaceError: (state) => {
      state.error = null;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workspaces
      .addCase(fetchWorkspaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Workspace By ID
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWorkspace = action.payload;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Workspace
      .addCase(createWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces.unshift(action.payload);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Workspace
      .addCase(updateWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.workspaces.findIndex(w => w._id === action.payload._id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Workspace
      .addCase(deleteWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = state.workspaces.filter(w => w._id !== action.payload);
        if (state.currentWorkspace?._id === action.payload) {
          state.currentWorkspace = null;
        }
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearWorkspaceError, clearCurrentWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
