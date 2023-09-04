import { createSlice } from '@reduxjs/toolkit';
import {
  resigterFakeUserAction,
} from './actions';

export const userFakeSlice = createSlice({
  name: 'userFake',
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

    [resigterFakeUserAction.pending]: (state) => {
      state.isLoading = true;
    },
    [resigterFakeUserAction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = payload;
    },
    [resigterFakeUserAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

  },
});

export const { setLoading, clearLoading, setUser, clearUser } = userFakeSlice.actions;

export default userFakeSlice.reducer;
