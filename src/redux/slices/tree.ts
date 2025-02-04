import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastActiveStage: 0,
};

const treeSlice = createSlice({
  name: 'treeSlice',
  initialState,
  reducers: {
    setLastActiveStage(state, action) {
      state.lastActiveStage = action.payload;
    },
  },
});

export const { setLastActiveStage } = treeSlice.actions;
export const treeReducer = treeSlice.reducer;
