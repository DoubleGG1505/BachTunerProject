import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import stringsReducer from './slices/stringsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    strings:stringsReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;