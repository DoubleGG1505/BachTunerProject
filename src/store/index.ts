import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import stringsReducer from './slices/stringsSlice'
import repertoireReducer from './slices/repertoireSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    strings:stringsReducer,
    repertoire:repertoireReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;