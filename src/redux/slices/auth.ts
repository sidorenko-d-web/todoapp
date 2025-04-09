import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthTokensResponseDTO } from '../api';

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthTokensResponseDTO>) => {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;

      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
    },
    signOut: state => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;