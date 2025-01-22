import { createSlice } from '@reduxjs/toolkit';

import { caseTransform } from '../../utils';

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = caseTransform(action.payload, 'camel');

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    signOut: state => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;