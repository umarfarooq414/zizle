import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMzMDc3OWI5LWU0MDAtNGI4Yy05YTJkLTg2OTcwYmYyNTA3ZiIsImVtYWlsIjoidW1hci5jb2RlcnpodW50QGdtYWlsLmNvbSIsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTY3ODg3OTkxMywiZXhwIjoxNzEwNDE1OTEzfQ.NYSGohN0mKFJXm2wPrnuVN18BPE-spYAfFkX5E9yTZ4`,
    },
  };

export const customerGeneralAction = createAsyncThunk(
    'customerAPI/updateProfile',
    async (payload, { rejectWithValue }) => {
      try {
        const {relationshipStatus,children,smoker,life}=payload
        const data={
            relationshipStatus,
            children,
            smoker,
            life,
        }
        const customerGeneral  = await axios.put(`${BASE_URL}/customer/updateProfile/${payload.id}`, data, config);
        return customerGeneral;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
  );