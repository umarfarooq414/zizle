import { createSlice } from '@reduxjs/toolkit';
import {
  adminBanModAction,
  adminEditAccessModAction,
  customerListAction,
  forgetPasswordAction,
  resetPasswordAction,
  resigteroauthUserAction,
  resigterAdminModAction,
  resigterUserAction,
  updateAccessAction,
  userListAction,
  userLoginAction,
  fetchEmojis,
  userCoinAction,
} from './actions';

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    isLoading: false,
    usersCoins: 0,
    user: {},
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    accessToken: {},
    userList: {},
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
    [resigterUserAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [resigterUserAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

    // userCoinAction
    [userCoinAction.pending]: (state) => {
      state.isLoading = true;
    },
    [userCoinAction.fulfilled]: (state, {payload}) => {
      state.isLoading = false;
      state.usersCoins = payload.data;
    },
    [userCoinAction.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    // register user
    [resigteroauthUserAction.pending]: (state) => {
      state.isLoading = true;
    },
    [resigteroauthUserAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [resigteroauthUserAction.rejected]: (state, { payload }) => {
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
      state.userList = payload.data;
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
      state.successMessage = payload;
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
      state.successMessage = payload;
    },
    [adminEditAccessModAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // customerListAction list data
    [customerListAction.pending]: (state) => {
      state.isLoading = true;
    },
    [customerListAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.userList = action.payload.data.data;
    },
    [customerListAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // forgetPasswordAction
    [forgetPasswordAction.pending]: (state) => {
      state.isLoading = true;
    },
    [forgetPasswordAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.userList = action.payload.data.data;
    },
    [forgetPasswordAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // resetPasswordAction
    [resetPasswordAction.pending]: (state) => {
      state.isLoading = true;
    },
    [resetPasswordAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      if (action.payload && action.payload.data) {
        state.userList = action.payload.data.data;
      } else {
        state.userList = [];
      }
    },
    [resetPasswordAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

    [fetchEmojis.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchEmojis.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [fetchEmojis.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
  },
});

export const { setLoading, clearLoading, setUser, clearUser } = userAuthSlice.actions;

export default userAuthSlice.reducer;
