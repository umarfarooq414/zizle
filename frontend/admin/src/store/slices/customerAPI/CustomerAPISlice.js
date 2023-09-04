import { createSlice } from '@reduxjs/toolkit';
import {customerGeneralAction} from './actions';

export const customerAPISlice = createSlice({
  name: 'customerAPI',
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
  },
});

export const { setLoading, clearLoading, setUser, clearUser } = customerAPISlice.actions;

export default customerAPISlice.reducer;