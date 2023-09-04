import { createSlice } from '@reduxjs/toolkit';
import {
  modCustomerListAction,getFakeUsersConversation, emptyStateAction, sendBulkVistsAction, createNotesAction, getCustomerNoteAction, getFakeUserNoteAction, updateNoteAction, getAllNotesAction, deleteNoteAction
} from './actions';

export const moderatorApiSlice = createSlice({
  name: 'moderatorApi',
  initialState: {
    isLoading: false,
    user: {},
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    accessToken: {},
    userList: [],
    fakeChatPartners: [],
    unseenFakeIds:[],
    fakeUserNote: {},
    customerNote: {},
    noteList: {},
    fakeUserId:"",
    realCustomerId:"",
    fakeUserBulkIds: [],
    realCustomerBulkIds: []
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
    setFakeCustomerId: (state, action) => {
      state.fakeUserId = action.payload;
    },
    setRealCustomerId: (state, action) => {
      state.realCustomerId = action.payload;
    },
    // setFakeUserBulkId: (state, action) => {
    //   state.fakeUserBulkIds = [...state.fakeUserBulkIds, action.payload];
    // },
    setFakeUserBulkId: (state, action) => {
      const user = action.payload;
      const index = state.fakeUserBulkIds.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        state.fakeUserBulkIds = state.fakeUserBulkIds.filter((u) => u.id !== user.id);
      } else {
        state.fakeUserBulkIds = [...state.fakeUserBulkIds, user];
      }
    },
    // setRealCustomerBulkId: (state, action) => {
    //   state.realCustomerBulkIds = [...state.realCustomerBulkIds, action.payload];
    // },

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
    //list data
    [modCustomerListAction.pending]: (state) => {
      state.isLoading = true;
    },
    [modCustomerListAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.userList = action.payload.usersList;
      state.unseenFakeIds = action.payload.unseenFakeIds
    },
    [modCustomerListAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // fakeChatPartners
    [getFakeUsersConversation.pending]: (state) => {
      state.isLoading = true;
    },
    [getFakeUsersConversation.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.fakeChatPartners = action.payload.fakeChatPartners;
    },
    [getFakeUsersConversation.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // createNotesAction list data
    [createNotesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [createNotesAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      // state.userList = action.payload;
    },
    [createNotesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // getFakeUserNoteAction
    [getFakeUserNoteAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getFakeUserNoteAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.fakeUserNote = action.payload;
    },
    [getFakeUserNoteAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // getCustomerNoteAction

    [getCustomerNoteAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getCustomerNoteAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.customerNote = action.payload;
    },
    [getCustomerNoteAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // getAllNotesAction
    [getAllNotesAction.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllNotesAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.noteList = action.payload;
    },
    [getAllNotesAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // updateNoteAction
    [updateNoteAction.pending]: (state) => {
      state.isLoading = true;
    },
    [updateNoteAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      // state.note = action.payload;
    },
    [updateNoteAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // deleteNoteAction
    [deleteNoteAction.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteNoteAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      // state.note = action.payload;
    },
    [deleteNoteAction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
    // sendBulkVistsAction
    [sendBulkVistsAction.pending]: (state) => {
      state.isLoading = true;
    },
    [sendBulkVistsAction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      // state.successMessage = action.payload;
    },
    [sendBulkVistsAction.rejected]: (state, { payload }) => {
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
  },
});

export const { setLoading, clearLoading, setUser, clearUser, setFakeUserBulkId, setRealCustomerBulkId, emptyState,setFakeCustomerId, setRealCustomerId } = moderatorApiSlice.actions;

export default moderatorApiSlice.reducer;
