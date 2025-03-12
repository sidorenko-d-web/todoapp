import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAnimationSceneLoaded: false,
};

const mainSlice = createSlice({
  name: 'mainSlice',
  initialState,
  reducers: {
    setAnimationSceneLoaded(state, action) {
      state.isAnimationSceneLoaded = action.payload;
    },
  },
});

export const { setAnimationSceneLoaded } = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
