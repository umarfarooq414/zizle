import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

// User Registration API
export const resigterUserAction = createAsyncThunk(
  'userAuth/registerUser',
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/registerUser`, user);

      toast.success('Congratulation! You are successfully registered!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error('Error! You have enter wrong information', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

// Moderator Registration API
export const resigterAdminModAction = createAsyncThunk(
  'userAuth/registerAdminMod',
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/registerAdminMod`, user);

      toast.success('Congratulation! You are successfully Moderator registered!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error('Error! You have enter wrong information', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

// Fetch User Data API Unverified
export const userLoginAction = createAsyncThunk(
  'userAuth/login',
  async (user, { rejectWithValue }) => {
    try {
      const userLogin = await axios.post(`${BASE_URL}/auth/login`, user);
      return userLogin;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error);
    }
  },
);

// Fetch User List Data API
const accessToken = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
};
export const userListAction = createAsyncThunk(
  'userAuth/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const userList = await axios.get(`${BASE_URL}/auth/users`, config);
      return userList;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//List Fake User
export const fakeUserListAction = createAsyncThunk(
  'userAuth/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const userList = await axios.get(`${BASE_URL}/fake`, config);
      return userList;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update access user to Moderator
export const updateAccessAction = createAsyncThunk(
  'userAuth/updateAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const updateAccess = await axios.put(`${BASE_URL}/auth/update-access`, payload, config);
      return updateAccess;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Admin Ban the Moderator
export const adminBanModAction = createAsyncThunk(
  '/userAuth/blockMod',
  async (payload, { rejectWithValue }) => {
    try {
      const blockMod = await axios.put(`${BASE_URL}/auth/block-mod`, payload, config);
      return blockMod;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Admin Edit the access of Moderator
export const adminEditAccessModAction = createAsyncThunk(
  '/userAuth/updateModAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const updateModAccess = await axios.put(`${BASE_URL}/auth/update-access`, payload, config);
      return updateModAccess;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
//Update Fake User
export const fakeEditAccessAction = createAsyncThunk(
  '/userAuth/updateFakeAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const updateModAccess = await axios.put(
        `${BASE_URL}/fake/updateFake/${payload.id}`,
        payload,
        config,
      );
      return updateModAccess;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//Delete Fake
export const fakeDeleteAccessAction = createAsyncThunk(
  '/userAuth/deleteFakeAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const deleteFake = await axios.delete(`${BASE_URL}/fake/deleteFake/${payload.id}`, config);
      toast.success('Fake Customer Deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return deleteFake;
    } catch (error) {
      toast.error('Fake Customer Delete Unsuccessfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

export const fetchEmojis = createAsyncThunk(
  'chatAnnouncement/getEmojis',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(`${BASE_URL}/auth/get-emojis`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
