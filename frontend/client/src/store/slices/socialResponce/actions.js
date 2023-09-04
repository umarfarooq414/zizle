import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = 'https://backend.zizle.de/api';

// User Registration API
export const socialAppRes = createAsyncThunk(
  'responceAuthSlice/socialAppRes',
  async (appRes, { rejectWithValue }) => {
    try {
      const result = await axios.post(`${BASE_URL}/auth/social-join`, appRes);
      return result.data;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  },
);
// User googleAndFacebookResp API
export const googleAndFacebookResp = createAsyncThunk(
  'responceAuthSlice/googleAndFacebookResp',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await payload;
      return result;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  },
);
