import { configureStore } from '@reduxjs/toolkit';
// import setupAxios from './setupAxios/setupAxios';
import userAuthReducer from './slices/userAuth/userAuthSlice';
import moderatorReducer from './slices/moderatorApi/moderatorApiSlice';

export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    moderatorApi: moderatorReducer,
    // authToken: setupAxios,
  },
});

export default store;
