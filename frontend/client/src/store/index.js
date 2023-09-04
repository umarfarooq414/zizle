import { configureStore } from '@reduxjs/toolkit';
// import setupAxios from './setupAxios/setupAxios';
import userAuthReducer from './slices/userAuth/userAuthSlice';
import announcementChatSlice from "./slices/announcementChat/announcementChatSlice"
import socialResponce from "./slices/socialResponce/responceAuthSlice"
import customerAPISlice from './slices/customerAPI/CustomerAPISlice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})

export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    announcement: announcementChatSlice,
    respState: socialResponce,
    customerAPI: customerAPISlice,

    // authToken: setupAxios,
  },
  middleware: customizedMiddleware

});

export default store;
