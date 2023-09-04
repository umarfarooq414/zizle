import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

const config = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2MGI5YTUwLTgxYTUtNGYzZi04MTg4LTExZWFiZmU0MjA3NCIsImVtYWlsIjoiYWRtaW5AZGVtby5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2Nzg5NjIxODUsImV4cCI6MTcxMDQ5ODE4NX0.1bDOOmUDQMBPOb8v6Xfz5DEVGz5qMLHJRO3Joc2PqKs`
  }
};

// User Registration API
export const resigterFakeUserAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/fake/createFake`, payload, config);

      toast.success('Fake Customer successfully registered!', {
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
