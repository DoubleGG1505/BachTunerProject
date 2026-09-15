import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  name: string;
  lastName: string;
  email: string;
  bio: string;
}

interface UserState {
  data: UserData | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  data: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ name: string; lastName: string; email: string }>) => {
      state.data = { 
        name: action.payload.name, 
        lastName:action.payload.lastName,
        email: action.payload.email, 
        bio: 'Soy un violinista en BachTuner :D' 
      };
      state.isLoggedIn = true;
      console.log(' [Redux] Sesion iniciada. Datos guardados en estado: ', state.data);
    },
    updateProfile: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      console.log('[Redux] Perfil actualizado correctamente: ', state.data);
    },
    logoutUser: (state) => {
      state.data = null;
      state.isLoggedIn = false;
      console.log('[Redux] Sesion Cerrada. Estado limpiado.');
    },
  },
});

export const { loginUser, updateProfile, logoutUser } = userSlice.actions;
export default userSlice.reducer;