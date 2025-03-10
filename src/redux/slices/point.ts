import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  points: 0,
};

const pointSlice = createSlice({
  name: 'pointSlice',
  initialState,
  reducers: {
    setPoints(state, action) {
      state.points = ++action.payload;
    },
  },
});

export const { setPoints } = pointSlice.actions;
export const pointsReducer = pointSlice.reducer;
