import { createSlice } from '@reduxjs/toolkit';
import {
  fetchChat,
  fetchChatusers
} from './actions';

export const chatSlice = createSlice({
  name: 'announcementChat',
  initialState: {
    isLoading: false,
    user: {},
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    accessToken: {},
    userList: {},
    count: false,
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    clearLoading: (state) => {
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = { ...action.payload };
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = {};
    },
  },
  extraReducers: {
    // createChat
    [fetchChat.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchChat.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.count = true;
    },
    [fetchChat.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // fetchChatusers
    [fetchChatusers.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchChatusers.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.count = true;
    },
    [fetchChatusers.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
  },
});

export const { setLoading, clearLoading, setUser, clearUser } = chatSlice.actions;

export default chatSlice.reducer;
