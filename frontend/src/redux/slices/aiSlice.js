import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/ai.service';

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred';
};

export const fetchChatHistory = createAsyncThunk(
  'ai/fetchChatHistory',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await aiService.getChatHistory(projectId);
      return data.data.chat;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async ({ projectId, message }, { rejectWithValue }) => {
    try {
      const { data } = await aiService.sendMessage(projectId, message);
      return data.data.chat;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  chat: null,
  isLoading: false,
  isTyping: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiError: (state) => {
      state.error = null;
    },
    resetAi: (state) => {
      state.chat = null;
      state.isLoading = false;
      state.isTyping = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chat = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.chat = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload;
      });
  }
});

export const { clearAiError, resetAi } = aiSlice.actions;
export default aiSlice.reducer;
