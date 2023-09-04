import { createSlice } from '@reduxjs/toolkit';
import {
  socialAppRes, googleAndFacebookResp
} from './actions';

export const responceAuthSlice = createSlice({
  name: 'responceAuth',
  initialState: {
    profileObj: {},
    isLoading: false,
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
    // socialAppRes
    [socialAppRes.pending]: (state) => {
      state.isLoading = true;
    },
    [socialAppRes.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload;
    },
    [socialAppRes.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    [googleAndFacebookResp.pending]: (state) => {
      state.isLoading = true;
    },
    [googleAndFacebookResp.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.profileObj = payload;
    },
    [googleAndFacebookResp.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },


  },

});

export const { setLoading, clearLoading, setUser, clearUser } = responceAuthSlice.actions;

export default responceAuthSlice.reducer;
