import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vfsService from '../../services/vfs.service';

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred';
};

// Async Thunks
export const fetchProjectTree = createAsyncThunk(
  'fileSystem/fetchProjectTree',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await vfsService.getProjectTree(projectId);
      return data.data; // { folders: [], files: [] }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createFolder = createAsyncThunk(
  'fileSystem/createFolder',
  async (folderData, { rejectWithValue }) => {
    try {
      const { data } = await vfsService.createFolder(folderData);
      return data.data.folder;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateFolder = createAsyncThunk(
  'fileSystem/updateFolder',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await vfsService.updateFolder(id, data);
      return res.data.data.folder;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteFolder = createAsyncThunk(
  'fileSystem/deleteFolder',
  async (id, { rejectWithValue }) => {
    try {
      await vfsService.deleteFolder(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createFile = createAsyncThunk(
  'fileSystem/createFile',
  async (fileData, { rejectWithValue }) => {
    try {
      const { data } = await vfsService.createFile(fileData);
      return data.data.file;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const uploadFiles = createAsyncThunk(
  'fileSystem/uploadFiles',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await vfsService.createBatchFiles(payload);
      // Refetch the tree so new folders and files appear instantly
      await dispatch(fetchProjectTree(payload.project));
      return data.data.files;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateFile = createAsyncThunk(
  'fileSystem/updateFile',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await vfsService.updateFile(id, data);
      return res.data.data.file;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteFile = createAsyncThunk(
  'fileSystem/deleteFile',
  async (id, { rejectWithValue }) => {
    try {
      await vfsService.deleteFile(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFileContent = createAsyncThunk(
  'fileSystem/fetchFileContent',
  async (id, { rejectWithValue, getState }) => {
    try {
      // If we already have the content in state, don't fetch again
      const { fileContents } = getState().fileSystem;
      if (fileContents[id] !== undefined) {
        return { id, content: fileContents[id] };
      }

      const { data } = await vfsService.getFile(id);
      return { id, content: data.data.file.content };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  folders: [],
  files: [],
  openFiles: [], // Array of file objects [{ _id, name, language }]
  activeFileId: null,
  fileContents: {}, // Mapping of id -> content string
  isLoading: false,
  error: null,
};

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    clearFileSystemError: (state) => {
      state.error = null;
    },
    resetFileSystem: (state) => {
      state.folders = [];
      state.files = [];
      state.openFiles = [];
      state.activeFileId = null;
      state.fileContents = {};
      state.isLoading = false;
      state.error = null;
    },
    openFile: (state, action) => {
      const file = action.payload;
      // If not already open, add to openFiles
      if (!state.openFiles.find(f => f._id === file._id)) {
        state.openFiles.push(file);
      }
      state.activeFileId = file._id;
    },
    closeFile: (state, action) => {
      const fileId = action.payload;
      state.openFiles = state.openFiles.filter(f => f._id !== fileId);
      
      // If we closed the active file, switch to another open file if any exist
      if (state.activeFileId === fileId) {
        state.activeFileId = state.openFiles.length > 0 ? state.openFiles[state.openFiles.length - 1]._id : null;
      }
      
      // Optional: clear content from cache to free memory, but keeping it is fine for a lite IDE
      // delete state.fileContents[fileId];
    },
    setActiveFile: (state, action) => {
      state.activeFileId = action.payload;
    },
    updateFileContentLocal: (state, action) => {
      const { id, content } = action.payload;
      state.fileContents[id] = content;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tree
      .addCase(fetchProjectTree.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectTree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload.folders;
        state.files = action.payload.files;
      })
      .addCase(fetchProjectTree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch File Content
      .addCase(fetchFileContent.fulfilled, (state, action) => {
        state.fileContents[action.payload.id] = action.payload.content;
      })
      // Create Folder
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folders.push(action.payload);
      })
      // Update Folder
      .addCase(updateFolder.fulfilled, (state, action) => {
        const index = state.folders.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
      })
      // Delete Folder
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(f => f._id !== action.payload);
        
        const getChildFolders = (parentId, foldersList) => {
          let children = foldersList.filter(f => f.parent === parentId).map(f => f._id);
          for (let childId of children) {
            children = [...children, ...getChildFolders(childId, foldersList)];
          }
          return children;
        };
        const allDeletedFolders = [action.payload, ...getChildFolders(action.payload, state.folders)];
        
        state.folders = state.folders.filter(f => !allDeletedFolders.includes(f._id));
        
        // Find files that are deleted
        const deletedFiles = state.files.filter(f => allDeletedFolders.includes(f.folder)).map(f => f._id);
        state.files = state.files.filter(f => !allDeletedFolders.includes(f.folder));
        
        // Remove deleted files from open tabs
        state.openFiles = state.openFiles.filter(f => !deletedFiles.includes(f._id));
        if (deletedFiles.includes(state.activeFileId)) {
          state.activeFileId = state.openFiles.length > 0 ? state.openFiles[0]._id : null;
        }
      })
      // Create File
      .addCase(createFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
      })
      // Update File
      .addCase(updateFile.fulfilled, (state, action) => {
        const index = state.files.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
        
        // Update openFiles name/language if it was renamed
        const openIndex = state.openFiles.findIndex(f => f._id === action.payload._id);
        if (openIndex !== -1) {
          state.openFiles[openIndex] = { ...state.openFiles[openIndex], name: action.payload.name, language: action.payload.language };
        }
      })
      // Delete File
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(f => f._id !== action.payload);
        state.openFiles = state.openFiles.filter(f => f._id !== action.payload);
        if (state.activeFileId === action.payload) {
          state.activeFileId = state.openFiles.length > 0 ? state.openFiles[0]._id : null;
        }
      });
  }
});

export const { clearFileSystemError, resetFileSystem, openFile, closeFile, setActiveFile, updateFileContentLocal } = fileSystemSlice.actions;
export default fileSystemSlice.reducer;
