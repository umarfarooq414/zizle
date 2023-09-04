import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASE_URL = 'https://backend.zizle.de/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
const accessToken = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
};

//moderator crud api's
export const createModeratorAction = createAsyncThunk(
  'userAuth/createModerator',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/mod`, payload, getHeaders());

      toast.success('Moderator Created Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      console.log('>> error', error.response.data.message);

      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      error.response.data.message.map((errorMessage) => {
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
      return rejectWithValue(error.message);
    }
  },
);

export const getModeratorsAction = createAsyncThunk(
  'userAuth/getModerators',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/mods`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const blockModChat = createAsyncThunk(
  'userAuth/blockModChat',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/chats/block-chat`, payload, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getFakeUsersConversation = createAsyncThunk(
  'moderatorApi/getModChatUsers',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/chats/getModChatUsers?modId=${payload}`,
        getHeaders(),
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchChat = createAsyncThunk(
  'chatAnnouncement/createChat',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(
        `${BASE_URL}/chats/get-messages/?sender=${payload.senderId}&receiver=${payload.receiverId}`,
        getHeaders(),
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteModeratorAction = createAsyncThunk(
  'userAuth/deleteModerator',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/auth/mod/${payload?.id}`, getHeaders());
      if (data?.message === 'User Deleted successfully') {
        toast.success('Moderator Deleted Successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return data;
      }
    } catch (error) {
      toast.error('Error! Moderator Could not be deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

export const editModeratorAction = createAsyncThunk(
  'userAuth/editModerator',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/auth/mod/${payload?.id}`,
        payload,
        getHeaders(),
      );
      toast.success('Moderator Updated Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error('Error! Moderator Could not be updated!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

export const chatModeratorAction = createAsyncThunk(
  'userAuth/editModerator',
  async (payload, { rejectWithValue }) => {
    try {
      var {
        data: { chats: recieved },
      } = await axios.get(
        `${BASE_URL}/auth/stats-user-messages?modId=${payload.modId}&duration=${payload.duration}`,
        getHeaders(),
      );
      var {
        data: { chats: send },
      } = await axios.get(
        `${BASE_URL}/auth/stats-user-replies?modId=${payload.modId}&duration=${payload.duration}`,
        getHeaders(),
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

export const onlineModeratorAction = createAsyncThunk(
  'userAuth/editModerator',
  async (payload, { rejectWithValue }) => {
    try {
      var { data } = await axios.get(`${BASE_URL}/auth/online-stats`, getHeaders());

      return data;
    } catch (error) {
      toast.error('Error! Information could not be fetched!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

//bonus code api's
export const createBonusCodeAction = createAsyncThunk(
  'userAuth/createBonusCode',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/bonus-code`, payload, getHeaders());

      toast.success('Bonus Code Created Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

export const getBonusCodesAction = createAsyncThunk(
  'userAuth/getBonusCodes',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/bonus-codes`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteBonusCodesAction = createAsyncThunk(
  'userAuth/deleteBonusCode',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/auth/bonus-code/${payload?.id}`,
        getHeaders(),
      );
      if (data?.message === 'Bonus Code Deleted Successfully') {
        toast.success('Bonus Code Deleted Successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return data;
      }
    } catch (error) {
      toast.error('Error! Bonus Code Could not be deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

export const editBonusCodesAction = createAsyncThunk(
  'userAuth/editBonusCode',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/auth/bonus-code/${payload?.id}`,
        payload,
        getHeaders(),
      );
      toast.success('Bonus Code Updated Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error('Error! Bonus Code Could not be updated!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);
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
      console.log(error, 'errorrrr');
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error);
    }
  },
);

// Fetch User List Data API
export const userListAction = createAsyncThunk(
  'userAuth/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const userList = await axios.get(`${BASE_URL}/auth/users`, getHeaders());
      return userList.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const blockModeratorAction = createAsyncThunk(
  'userAuth/blockModerator',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/auth/block-mod`, payload, getHeaders());
      toast.success('Moderator Blocked Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error('Error! Moderator Could not be blocked!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

// Verify User API
export const verifyUserAction = createAsyncThunk(
  'userAuth/verifyUser',
  async (payload, { rejectWithValue }) => {
    try {
      const verifyUser = await axios.post(
        `${BASE_URL}/auth/verify-profile/${payload}`,
        {},
        getHeaders(),
      );
      toast.success('User Verified successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return verifyUser.data;
    } catch (error) {
      toast.error('Unable to verify!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

//List Fake User
export const fakeUserListAction = createAsyncThunk(
  'userAuth/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const userList = await axios.get(`${BASE_URL}/fake`, getHeaders());
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
      const updateAccess = await axios.put(`${BASE_URL}/auth/update-access`, payload, getHeaders());
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
      const blockMod = await axios.put(`${BASE_URL}/auth/block-mod`, payload, getHeaders());
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
      const updateModAccess = await axios.put(
        `${BASE_URL}/auth/update-access`,
        payload,
        getHeaders(),
      );
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
      const formData = new FormData();
      if (payload.avatar) formData.append('avatar', payload.avatar);
      if (payload.userName) formData.append('userName', payload.userName);
      if (payload.email) formData.append('email', payload.email);
      if (payload.selfGender) formData.append('selfGender', payload.selfGender);
      if (payload.interestedGender) formData.append('interestedGender', payload.interestedGender);
      if (payload.life) formData.append('life', payload.life);
      if (payload.smoker) formData.append('smoker', payload.smoker);
      if (payload.relationshipStatus)
        formData.append('relationshipStatus', payload.relationshipStatus);
      if (payload.children) formData.append('children', payload.children);
      if (payload.dob) formData.append('dob', payload.dob);
      if (payload.postalCode) formData.append('postalCode', payload.postalCode);
      if (payload.mobileNumber) formData.append('mobileNumber', payload.mobileNumber);
      if (payload.profileText) formData.append('profileText', payload.profileText);
      if (payload?.photos?.length > 0) {
        payload?.photos?.forEach((file) => {
          formData.append('photos', file);
        });
      }
      const updateModAccess = await axios.put(
        `${BASE_URL}/fake/updateFake/${payload.id}`,
        formData,
        getHeaders(),
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
      const deleteFake = await axios.delete(
        `${BASE_URL}/fake/deleteFake/${payload.id}`,
        getHeaders(),
      );
      toast.success('Fake Customer Deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return deleteFake;
    } catch (error) {
      toast.error('Fake Customer Could not be deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

//Subscription User
export const subscriptionsUserListAction = createAsyncThunk(
  'userAuth/userList',
  async (payload, { rejectWithValue }) => {
    try {
      const subsList = await axios.get(`${BASE_URL}/subscriptions`, getHeaders());
      return subsList;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//Update Subscription User
export const subscriptionEditAccessAction = createAsyncThunk(
  '/subsAuth/updateSubsAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const updateSubsAccess = await axios.put(
        `${BASE_URL}/subscriptions/updateSubscription/${payload.id}`,
        payload,
        getHeaders(),
      );
      return updateSubsAccess;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//Delete Subscription
export const subsDeleteAccessAction = createAsyncThunk(
  '/userAuth/deleteSubsAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const deleteSubs = await axios.delete(
        `${BASE_URL}/subscriptions/deleteSubscription/${payload.id}`,
        getHeaders(),
      );
      toast.success('Subs Customer Deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return deleteSubs;
    } catch (error) {
      toast.error('Subscription could not be deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error.message);
    }
  },
);

// ADD gifts
export const resigterGiftAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('actionType', payload.actionType);
      formData.append('cost', payload.cost);
      formData.append('imageUrl', payload.imageUrl);

      const data = await axios.post(`${BASE_URL}/coins/create-gift`, formData, getHeaders());
      toast.success('Congratulation! You successfully registered Gift!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return rejectWithValue(error);
    }
  },
);

//all gifts
export const getrGiftAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/coins/gifts`, getHeaders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//update gifts
export const updaterGiftAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('actionType', payload.actionType);
      formData.append('cost', payload.cost);
      formData.append('imageUrl', payload.imageUrl);

      const data = await axios.put(
        `${BASE_URL}/coins/update-gift/${payload.id}`,
        formData,
        getHeaders(),
      );
      toast.success('Successfully Gift Updated!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

//delete gifts
export const deleteGiftAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.delete(`${BASE_URL}/coins/gift/${payload.id}`, getHeaders());
      toast.success('Successfully Gift Deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data;
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

// create categories
export const createCategories = createAsyncThunk(
  'gallery/createCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/gallery/createCategory`, payload, getHeaders());
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// delete categories
export const deleteCategories = createAsyncThunk(
  'gallery/deleteCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.delete(
        `${BASE_URL}/gallery/deleteCategory/${payload}`,
        getHeaders(),
      );
      toast.success('Successfully Category Deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// sort categories
export const sortCategories = createAsyncThunk(
  'gallery/sortCategories',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/gallery/sortCategories`, payload, getHeaders());
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// add images to category
export const addImagesToCategory = createAsyncThunk(
  'gallery/addImagesToCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('categoryId', payload.categoryId);
      formData.append('image', payload.image);
      const data = await axios.post(
        `${BASE_URL}/gallery/addImagesToCategory`,
        formData,
        getHeaders(),
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// get All images
export const getAllCategoriesImages = createAsyncThunk(
  'gallery/getAllCategoriesImages',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.get(`${BASE_URL}/gallery/getAllCategoriesImages`, getHeaders());
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

// delete image
export const deleteImage = createAsyncThunk(
  'gallery/deleteImage',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.delete(`${BASE_URL}/gallery/deleteImage/${payload}`, getHeaders());
      toast.success('Successfully Image Deleted!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
//dynamic-fakes
export const createDynamicFakesAction = createAsyncThunk(
  'userFakeAuth/registerFakeUser',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await axios.post(`${BASE_URL}/fake/dynamic-fakes`, payload, getHeaders());
      toast.success('Fakes Successfully ' + result.statusText + '!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// delete image
export const updateQuery = createAsyncThunk(
  'auth/update-query',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axios.put(`${BASE_URL}/auth/update-query`, payload, getHeaders());
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
