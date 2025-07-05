import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import threadReducer from './features/threadSlice';
import themeReducer from './features/themeSlice';
import { authApi } from './services/auth/auth';
import { profileApi } from './services/auth/profile';
import { threadApi } from './services/api/thread';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    thread: threadReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [threadApi.reducerPath]: threadApi.reducer
  },
  middleware: (gDM) => gDM().concat(authApi.middleware).concat(profileApi.middleware).concat(threadApi.middleware),
});
