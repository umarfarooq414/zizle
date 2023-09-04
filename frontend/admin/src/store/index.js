import { configureStore } from '@reduxjs/toolkit';
import userAuthReducer from './slices/userAuth/userAuthSlice';
import fakeUser from "./slices/fakeUser/userFakeSlice";
import customerAPI from "./slices/customerAPI/CustomerAPISlice"
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import adminReducer from './slices/adminAPI/adminApiSlice';
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})


export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    fakeUser: fakeUser,
    customerApi: customerAPI,
    middleware: customizedMiddleware,
    adminApi: adminReducer,
  },
});

export default store;
