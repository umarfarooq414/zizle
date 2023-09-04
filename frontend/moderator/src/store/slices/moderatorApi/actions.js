import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

const token = localStorage.getItem('token');
//modGetUserList Api

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
};

export const getFakeUsersConversation = createAsyncThunk(
  'moderatorApi/getModChatUsers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'get', //you can set what request you want to be
        url: `${BASE_URL}/chats/getModChatUsers`,
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const modCustomerListAction = createAsyncThunk(
  'moderatorApi/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'get', //you can set what request you want to be
        url: `${BASE_URL}/mod/get-users`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//createNotes Api

export const createNotesAction = createAsyncThunk(
  'moderatorApi/createNotes',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post', //you can set what request you want to be
        url: `${BASE_URL}/notes/createNotes`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.statusText, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return response;
    } catch (error) {
      const messages = error.response.data.message;
      for (let i = 0; i < messages.length; i++) {
        toast.error(messages[i], {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return rejectWithValue(error.message);
    }
  },
);

//getNotes Api

export const getFakeUserNoteAction = createAsyncThunk(
  'moderatorApi/getFakeUserNote',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'get', //you can set what request you want to be
        url: `${BASE_URL}/notes/${payload}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      const messages = error.response.data.message;
      return rejectWithValue(error.message);
    }
  },
);
//getNotes Api

export const getCustomerNoteAction = createAsyncThunk(
  'moderatorApi/getCustomerNote',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'get', //you can set what request you want to be
        url: `${BASE_URL}/notes/${payload}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      const messages = error.response.data.message;
      return rejectWithValue(error.message);
    }
  },
);
//getAllNotes Api

export const getAllNotesAction = createAsyncThunk(
  'moderatorApi/getAllNotes',
  async ({ rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'get', //you can set what request you want to be
        url: `${BASE_URL}/notes`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      const messages = error.response.data.message;
      return rejectWithValue(error.message);
    }
  },
);

//updateNotes Api

export const updateNoteAction = createAsyncThunk(
  'moderatorApi/updateNote',
  async (payload, { rejectWithValue }) => {
    try {
      const { noteId, note, userId } = payload;
      const response = await axios({
        method: 'put', //you can set what request you want to be
        url: `${BASE_URL}/notes/updateNotes/${noteId}`,
        data: { note, userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success('Note updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    } catch (error) {
      const messages = error.response.data.message;
      toast.error(messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

//deleteNote Api

export const deleteNoteAction = createAsyncThunk(
  'moderatorApi/deleteNote',
  async (payload, { rejectWithValue }) => {
    try {
      const { noteId } = payload;
      const response = await axios({
        method: 'delete', //you can set what request you want to be
        url: `${BASE_URL}/notes/deleteNotes/${noteId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success('Note deleted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    } catch (error) {
      const messages = error.response.data.message;
      toast.error(messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

export const fetchChat = createAsyncThunk(
  'chatAnnouncement/createChat',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await axios.get(
        `${BASE_URL}/chats/get-messages/?sender=${payload.senderId}&receiver=${payload.receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.data;
    } catch (error) {
      // const messages = error.response.data.message
      return rejectWithValue(error.message);
    }
  },
);

//sendBulkVists Api

export const sendBulkVistsAction = createAsyncThunk(
  'moderatorApi/sendBulkVists',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/mod/send-bulk-visits`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Visits sent successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return response;
    } catch (error) {
      // const messages = error.response.data.message
      return rejectWithValue(error.message);
    }
  },
);

// Empty state action

export const emptyStateAction = createAsyncThunk(
  'moderatorApi/emptyState',
  async (_, { rejectWithValue }) => {
    try {
      return { fakeUserBulkIds: [], realCustomerBulkIds: [] };
    } catch (error) {
      const messages = error.response.data.message;
      for (let i = 0; i < messages.length; i++) {
        toast.error(messages[i], {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return rejectWithValue(error.message);
    }
  },
);

export const chatModeratorAction = createAsyncThunk(
  'userAuth/editModerator',
  async (payload, { rejectWithValue }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    try {
      var { data: recieved } = await axios.get(
        `${BASE_URL}/auth/single-moderator-messages?duration=${payload.duration}`,
        config,
      );
      var { data: send } = await axios.get(
        `${BASE_URL}/auth/single-moderator-replies?duration=${payload.duration}`,
        config,
      );

      return [recieved, send];
    } catch (error) {
      toast.error('Error! Information could not be fetched!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

// getAllGiftList
export const userGiftListAction = createAsyncThunk(
  'profile/userGiftList',
  async (payload, { rejectWithValue }) => {
    try {
      const giftList = await axios.post(`${BASE_URL}/coins/gifts`);
      return giftList.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//get all categories
export const getAllCategories = createAsyncThunk(
  'gallery/getAllCategories',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(`${BASE_URL}/gallery`, getHeaders());
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// get images by category
export const getImagesByCategory = createAsyncThunk(
  'gallery/getImagesByCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(
        `${BASE_URL}/gallery/getImagesByCategory/${payload}`,
        getHeaders(),
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
