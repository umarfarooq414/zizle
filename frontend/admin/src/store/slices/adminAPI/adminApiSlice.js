import { createSlice } from '@reduxjs/toolkit';
import {
  adminCustomerListAction, updateActionTypeCostAction, emptyStateAction, sendSpamMessagesAction, getAllActionTypesAction, createNotesAction, getCustomerNoteAction, getFakeUserNoteAction, updateNoteAction, getAllNotesAction, deleteNoteAction
} from './actions';

export const adminApiSlice = createSlice({
  name: 'adminApi',
  initialState: {
    isLoading: false,
    user: {},
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    accessToken: {},
    userList: [],
    fakeUserNote: {},
    customerNote: {},
    noteList: {},
    fakeUserBulkIds: [],
    realCustomerBulkIds: [],
    allActionTypes: []
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
    setFakeUserBulkId: (state, action) => {
      const user = action.payload;
      const index = state.fakeUserBulkIds.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        state.fakeUserBulkIds = state.fakeUserBulkIds.filter((u) => u.id !== user.id);
      } else {
        state.fakeUserBulkIds = [...state.fakeUserBulkIds, user];
      }
    },

    setRealCustomerBulkId: (state, action) => {
      const user = action.payload;
      const index = state.realCustomerBulkIds.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        state.realCustomerBulkIds = state.realCustomerBulkIds.filter((u) => u.id !== user.id);
      } else {
        state.realCustomerBulkIds = [...state.realCustomerBulkIds, user];
      }
    },

    emptyState: (state) => {
      state.fakeUserBulkIds = [];
      state.realCustomerBulkIds = [];
    },
  },
  extraReducers: {

    // adminCustomerListAction list data
    [adminCustomerListAction.pending]: (state) => {
      state.isLoading = true;
    },
    [adminCustomerListAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.userList = action.payload;
    },
    [adminCustomerListAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },

    // sendSpamMessagesAction
    [sendSpamMessagesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [sendSpamMessagesAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      // state.successMessage = action.payload;
    },
    [sendSpamMessagesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // emptyStateAction
    [emptyStateAction.pending]: (state) => {
      state.isLoading = true;
    },
    [emptyStateAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.fakeUserBulkIds = action.payload;
      state.realCustomerBulkIds = action.payload;
    },
    [emptyStateAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // getAllActionTypes

    [getAllActionTypesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllActionTypesAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.allActionTypes = action.payload;
    },
    [getAllActionTypesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // updateActionTypeCost

    [updateActionTypeCostAction.pending]: (state) => {
      state.isLoading = true;
    },
    [updateActionTypeCostAction.fulfilled]: (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    },
    [updateActionTypeCostAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
  },
});

export const { setLoading, clearLoading, setUser, clearUser, setFakeUserBulkId, setRealCustomerBulkId, emptyState } = adminApiSlice.actions;

export default adminApiSlice.reducer;
