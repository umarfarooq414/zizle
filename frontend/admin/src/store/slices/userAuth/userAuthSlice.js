import { createSlice } from '@reduxjs/toolkit';
import {
  resigterUserAction,
  resigterAdminModAction,
  userLoginAction,
  userListAction,
  updateAccessAction,
  adminBanModAction,
  adminEditAccessModAction,
  subscriptionEditAccessAction,
  verifyUserAction,
  createBonusCodeAction,
  getBonusCodesAction,
  deleteBonusCodesAction,
  editBonusCodesAction,
  editModeratorAction,
  deleteModeratorAction,
  getModeratorsAction,
  createModeratorAction,
  blockModeratorAction,
  createDynamicFakesAction
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
    usersList: [],
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
    //block moderator
    [blockModeratorAction.pending]: (state) => {
      state.isLoading = true;
    },
    [blockModeratorAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [blockModeratorAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },


    //create moderator
    [createModeratorAction.pending]: (state) => {
      state.isLoading = true;
    },
    [createModeratorAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [createModeratorAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //editModeratorAction
    [editModeratorAction.pending]: (state) => {
      state.isLoading = true;
    },
    [editModeratorAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [editModeratorAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //deleteModeratorAction
    [deleteModeratorAction.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteModeratorAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [deleteModeratorAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //getModeratorsAction
    [getModeratorsAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getModeratorsAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [getModeratorsAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

    //update bonus code
    [editBonusCodesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [editBonusCodesAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [editBonusCodesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //delete bonus code
    //get bonus code
    [deleteBonusCodesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteBonusCodesAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [deleteBonusCodesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //get bonus code
    [getBonusCodesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getBonusCodesAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [getBonusCodesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //bonus code create
    [createBonusCodeAction.pending]: (state) => {
      state.isLoading = true;
    },
    [createBonusCodeAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [createBonusCodeAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //register user
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
      state.accessToken = payload.data.access_token;
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
      state.usersList = payload
      // state.successMessage = payload;
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
    // Admin Edit the access of Moderator
    [subscriptionEditAccessAction.pending]: (state) => {
      state.isLoading = true;
    },
    [subscriptionEditAccessAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload
    },
    [subscriptionEditAccessAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Admin verify user

    [verifyUserAction.pending]: (state) => {
      state.isLoading = true;
    },
    [verifyUserAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload
    },
    [verifyUserAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // dynamic-fakes
    [createDynamicFakesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [createDynamicFakesAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload
    },
    [createDynamicFakesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

  },
});

export const { setLoading, clearLoading, setUser, clearUser } = userAuthSlice.actions;

export default userAuthSlice.reducer;
