import { createSlice } from '@reduxjs/toolkit';

import {
  addToBlockList, gifTransactionAction, addToFavourite, userGiftListAction, blockedUsersListAction, customerGeneralAction, customerSupport, favouriteUsersList, getRandomUser, getUserByIdAction, profileVisitorList, visitedProfile
} from './action';

export const customerAPISlice = createSlice({
  name: 'customerAPI',
  initialState: {
    isLoading: false,
    user: {},
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    accessToken: {},
    gifts: [],
    transactionFailedState: false,
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
    // Customer General user
    [customerGeneralAction.pending]: (state) => {
      state.isLoading = true;
    },
    [customerGeneralAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [customerGeneralAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // getRandomUser
    [getRandomUser.pending]: (state) => {
      state.isLoading = true;
    },
    [getRandomUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.successMessage = action.payload;
    },
    [getRandomUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    // customerSupport
    [customerSupport.pending]: (state) => {
      state.isLoading = true;
    },
    [customerSupport.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.successMessage = action.payload;
    },
    [customerSupport.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    // Customer General user
    [favouriteUsersList.pending]: (state) => {
      state.isLoading = true;
    },
    [favouriteUsersList.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [favouriteUsersList.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Customer General user
    [addToFavourite.pending]: (state) => {
      state.isLoading = true;
    },
    [addToFavourite.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [addToFavourite.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Customer General user
    [profileVisitorList.pending]: (state) => {
      state.isLoading = true;
    },
    [profileVisitorList.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [profileVisitorList.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Customer General user
    [visitedProfile.pending]: (state) => {
      state.isLoading = true;
    },
    [visitedProfile.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [visitedProfile.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // Customer General user
    [addToBlockList.pending]: (state) => {
      state.isLoading = true;
    },
    [addToBlockList.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [addToBlockList.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //blockedUsersList
    [blockedUsersListAction.pending]: (state) => {
      state.isLoading = true;
    },
    [blockedUsersListAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [blockedUsersListAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //getUserByIdAction
    [getUserByIdAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getUserByIdAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
    },
    [getUserByIdAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    //getAllGiftsList
    [userGiftListAction.pending]: (state) => {
      state.isLoading = true;
    },
    [userGiftListAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
      state.gifts = payload; // populate the gifts array with the received data
    },
    [userGiftListAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

    //giftTransaction
    [gifTransactionAction.pending]: (state) => {
      state.isLoading = true;
    },
    [gifTransactionAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.successMessage = payload;
      state.gifts = payload; // populate the gifts array with the received data`
    },
    [gifTransactionAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
      state.transactionFailedState = true;
    },

  },
});

export const { setLoading, clearLoading, setUser, clearUser } = customerAPISlice.actions;

export default customerAPISlice.reducer;
