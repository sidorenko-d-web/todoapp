import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthTokensResponseDTO } from '../api';

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthTokensResponseDTO>) => {
      state.accessToken = action.payload.access_token;

      localStorage.setItem('access_token', action.payload.access_token);
    },
    signOut: state => {
      state.accessToken = null;
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;