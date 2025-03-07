import { createSlice } from '@reduxjs/toolkit';

interface initialState {
  isNeedToPlayHappy: boolean;
  isWorking: boolean;
}

const initialState: initialState = {
  isNeedToPlayHappy: false,
  isWorking: false,
};

const animationStateSlice = createSlice({
  name: 'animationStateSlice',
  initialState,
  reducers: {
    setNeedToPlayHappy(state, action) {
      state.isNeedToPlayHappy = action.payload;
    },
    setIsWorking(state, action) {
      state.isWorking = action.payload;
    },
  },
});

export const selectIsNeedToPlayHappy = (state: { animationStateSlice: initialState }) =>
  state.animationStateSlice.isNeedToPlayHappy;
export const selectIsWorking = (state: { animationStateSlice: initialState }) => state.animationStateSlice.isWorking;

export const { setIsWorking, setNeedToPlayHappy } = animationStateSlice.actions;
export const animationStateReducer = animationStateSlice.reducer;
