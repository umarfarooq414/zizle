import { createSlice } from '@reduxjs/toolkit';
import {
  resigterUserAction,
  resigterAdminModAction,
  userLoginAction,
  userListAction,
  updateAccessAction,
  adminBanModAction,
  adminEditAccessModAction
} from './actions';

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    isLoading: false,
    user: {},
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    accessToken: {},
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
    // register user
    [resigterUserAction.pending]: (state) => {
      state.isLoading = true;
    },
    [resigterUserAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [resigterUserAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Register admin and moderator
    [resigterAdminModAction.pending]: (state) => {
      state.isLoading = true;
    },
    [resigterAdminModAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [resigterAdminModAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // User Login action
    [userLoginAction.pending]: (state) => {
      state.isLoading = true;
    },
    [userLoginAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.accessToken = state.payload;
      state.successMessage = payload;
      state.isAuthenticated = true;
    },
    [userLoginAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // User List
    [userListAction.pending]: (state) => {
      state.isLoading = true;
    },
    [userListAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload;
    },
    [userListAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Update access moderator
    [updateAccessAction.pending]: (state) => {
      state.isLoading = true;
    },
    [updateAccessAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload;
    },
    [updateAccessAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Admin Ban the Moderator
    [adminBanModAction.pending]: (state) => {
      state.isLoading = true;
    },
    [adminBanModAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload
    },
    [adminBanModAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Admin Edit the access of Moderator
    [adminEditAccessModAction.pending]: (state) => {
      state.isLoading = true;
    },
    [adminEditAccessModAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload
    },
    [adminEditAccessModAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    
  },
});

export const { setLoading, clearLoading, setUser, clearUser } = userAuthSlice.actions;

export default userAuthSlice.reducer;
