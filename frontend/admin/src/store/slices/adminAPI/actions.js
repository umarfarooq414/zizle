import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
};

export const adminCustomerListAction = createAsyncThunk(
  'adminApi/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/users`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//sendSpamMessages Api
export const sendSpamMessagesAction = createAsyncThunk(
  'adminApi/sendSpamMessages',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/send-spam-messages`,
        payload,
        getHeaders(),
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// schedule message
export const scheduleMessage = createAsyncThunk(
  'adminApi/scheduleMessage',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/schedule-message`, payload, getHeaders());
      toast.success('Message Delivered', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error('Something went wrong', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

// send spam message
export const sendSpamMessages = createAsyncThunk(
  'adminApi/scheduleMessage',
  async (payload, { rejectWithValue }) => {
    const formData = new FormData();

    formData.append('fakeUserId', payload.fakeUserId);
    formData.append('customerUserIds', payload.customerUserIds);
    formData.append('message', payload.message);
    formData.append('image', payload.file);

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/spam-messages`, formData, getHeaders());
      toast.success('Messaage Sent!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // return rejectWithValue(error.message);
    }
  },
);

// get schedule message
export const getScheduleMessage = createAsyncThunk(
  'adminApi/scheduleMessage',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/schedule-message`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// get schedule message
export const deleteScheduleMessage = createAsyncThunk(
  'adminApi/deleteScheduleMessage',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/auth/schedule-message/${payload}`,
        getHeaders(),
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// get schedule message
export const getAdminStats = createAsyncThunk(
  'adminApi/stats',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/stats`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// get all contact support
export const getAllQueries = createAsyncThunk(
  'auth/queries',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(`${BASE_URL}/auth/queries`, getHeaders());
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getCustomers = createAsyncThunk(
  'userAuth/customersList',
  async (payload, { rejectWithValue }) => {
    console.log(payload, 'payload');
    try {
      let url = `${BASE_URL}/customer?`;

      if (payload.page) {
        url += `page=${payload.page}&`;
      }
      if (payload.pageSize) {
        url += `pageSize=${payload.pageSize}&`;
      }
      if (payload.startAge) {
        url += `startAge=${payload.startAge}&`;
      }
      if (payload.endAge) {
        url += `endAge=${payload.endAge}&`;
      }
      if (payload.gender) {
        url += `gender=${payload.gender}&`;
      }
      if (payload.nickname) {
        url += `nickname=${payload.nickname}&`;
      }
      if (payload.postalCode) {
        url += `postalCode=${payload.postalCode}&`;
      }
      if (payload.time) {
        url += `time=${payload.time}&`;
      }
      if (payload.schedule) {
        url += `schedule=${payload.schedule}&`;
      }
      if (payload.online) {
        url += `online=${payload.online}&`;
      }
      if (payload.newUser) {
        url += `newUser=${payload.newUser}&`;
      }
      if (payload.fsk) {
        url += `fsk=${payload.fsk}&`;
      }

      return await axios.get(url, getHeaders());
    } catch (error) {
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

// getAllActionTypes

export const getAllActionTypesAction = createAsyncThunk(
  'adminApi/getAllAction',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(`${BASE_URL}/coins`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
// updateActionTypesCost

export const updateActionTypeCostAction = createAsyncThunk(
  'adminApi/updateActionTypeCost',
  async (payload, { rejectWithValue }) => {
    try {
      const actionTypeCosts = payload.actionTypeCosts;
      const data = await axios.put(`${BASE_URL}/coins/set-cost`, { actionTypeCosts }, getHeaders());
      toast.success('Successfully updated!', {
        position: toast.POSITION.TOP_RIGHT,
      });

      return data;
    } catch (error) {
      toast.error('Spmething went wrong!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

//customerListAction
export const customerListAction = createAsyncThunk(
  'userAuth/customerList',
  async (payload, { rejectWithValue }) => {
    try {
      let url = `${BASE_URL}/customer?`;
      if (payload.newUsers) {
        url += `newUsers=${payload.newUsers}&`;
      }
      if (payload.online) {
        url += `online=${payload.online}&`;
      }
      if (payload.page) {
        url += `page=${payload.page}&`;
      }
      if (payload.pageSize) {
        url += `pageSize=${payload.pageSize}&`;
      }
      if (payload.fsk) {
        url += `fsk=${payload.fsk}&`;
      }
      if (payload.startAge) {
        url += `startAge=${payload.startAge}&`;
      }
      if (payload.endAge) {
        url += `endAge=${payload.endAge}&`;
      }
      if (payload.gender) {
        url += `gender=${payload.gender}&`;
      }
      if (payload.distanceInKms) {
        url += `distanceInKms=${payload.distanceInKms}&`;
      }
      if (payload.nickname) {
        url += `nickname=${payload.nickname}&`;
      }
      if (payload.postalCode) {
        url += `postalCode=${payload.postalCode}&`;
      }

      if (payload.newUsers) {
        return await axios.get(url, getHeaders());
      }
      if (payload.online) {
        return await axios.get(url, getHeaders());
      }
      if (payload.fsk) {
        return await axios.get(url, getHeaders());
      }
      if (
        payload.endAge > 18 ||
        payload.gender !== '' ||
        payload.distanceInKms > 0 ||
        payload.nickname !== '' ||
        payload.postalCode !== ''
      ) {
        return await axios.get(url, getHeaders());
      }

      return await axios.get(url, getHeaders());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
