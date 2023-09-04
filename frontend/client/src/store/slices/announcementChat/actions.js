import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { toast } from 'react-toastify';
const BASE_URL = 'https://backend.zizle.de/api';

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
};

// User Registration API
export const fetchChat = createAsyncThunk(
  'chatAnnouncement/createChat',
  async (id, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await axios.get(`${BASE_URL}/chats/get-messages/?sender=${user.id}&receiver=${id}`, getHeaders()
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchChatusers = createAsyncThunk(
  'chatAnnouncement/fetchChatusers',
  async (chat, { rejectWithValue }) => {
    const token =localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'));

    const config = {
      params:{
        userId:user?.id
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const data = await axios.get(`${BASE_URL}/chats/getClientChatUsers`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
