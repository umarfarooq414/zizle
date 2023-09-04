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

// User Registration API
export const resigterFakeUserAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append('avatar', payload.avatar);
      formData.append('userName', payload.userName);
      formData.append('creator', payload.creator);
      formData.append('role', payload.role);
      formData.append('selfGender', payload.selfGender);
      formData.append('interestedGender', payload.interestedGender);
      formData.append('relationshipStatus', payload.relationshipStatus);
      formData.append('life', payload.life);
      formData.append('smoker', payload.smoker);
      formData.append('children', payload.children);
      formData.append('mobileNumber', payload.mobileNumber);
      formData.append('dob', payload.dob);
      formData.append('postalCode', payload.postalCode);
      formData.append('email', payload.email);
      formData.append('profileText', payload.profileText);
      if (payload?.photos?.length > 0) {
        payload?.photos?.forEach((file) => {
          formData.append('photos', file);
        });
      }

      const data = await axios.post(`${BASE_URL}/fake/createFake`, formData, getHeaders());

      toast.success('Congratulation! You are successfully registered!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message?.length > 0) {
        error.response.data.message.forEach((message) =>
          toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
          }),
        );
      }

      return rejectWithValue(error.message);
    }
  },
);

//Subscription Registration API
export const resigterSubsUserAction = createAsyncThunk(
  'userSubsAuth/registerrSubsUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.post(
        `${BASE_URL}/subscriptions/createSubscription`,
        payload,
        getHeaders(),
      );

      toast.success('Congratulation! Package are successfully registered!', {
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
