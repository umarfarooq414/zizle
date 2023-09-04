import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
};

export const customerGeneralAction = createAsyncThunk(
  'customerAPI/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const { relationshipStatus, children, smoker, life } = payload;
      const data = {
        relationshipStatus,
        children,
        smoker,
        life,
      };
      const customerGeneral = await axios.put(
        `${BASE_URL}/customer/updateProfile/${payload.id}`,
        data,
        getHeaders(),
      );
      return customerGeneral;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
