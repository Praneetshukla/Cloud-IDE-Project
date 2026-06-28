import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import terminalService from '../../services/terminal.service';

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred';
};

export const executeFile = createAsyncThunk(
  'terminal/executeFile',
  async ({ projectId, fileId }, { rejectWithValue }) => {
    try {
      const { data } = await terminalService.executeFile(projectId, fileId);
      return data.data.session;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  isOpen: false,
  isExecuting: false,
  logs: [], // Array of log objects { text: string, type: 'info' | 'error' | 'output' }
  error: null,
};

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    toggleTerminal: (state) => {
      state.isOpen = !state.isOpen;
    },
    openTerminal: (state) => {
      state.isOpen = true;
    },
    closeTerminal: (state) => {
      state.isOpen = false;
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    addLog: (state, action) => {
      state.logs.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeFile.pending, (state) => {
        state.isExecuting = true;
        state.error = null;
        state.isOpen = true; // Auto open terminal on run
      })
      .addCase(executeFile.fulfilled, (state, action) => {
        state.isExecuting = false;
        const session = action.payload;
        
        state.logs.push({
          text: `\r\n> Executed ${session.command} (${session.executionTimeMs}ms)`,
          type: session.status === 'success' ? 'info' : 'error'
        });

        if (session.output) {
          // Replace newlines with \r\n for xterm.js
          const formattedOutput = session.output.replace(/\n/g, '\r\n');
          state.logs.push({
            text: formattedOutput,
            type: session.status === 'success' ? 'output' : 'error'
          });
        }
      })
      .addCase(executeFile.rejected, (state, action) => {
        state.isExecuting = false;
        state.error = action.payload;
        state.logs.push({
          text: `\r\n[SYSTEM ERROR] ${action.payload}`,
          type: 'error'
        });
      });
  }
});

export const { toggleTerminal, openTerminal, closeTerminal, clearLogs, addLog } = terminalSlice.actions;
export default terminalSlice.reducer;
