import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  acceleration: number;
}

const initialState: InitialState = {
  acceleration: 0,
};

const integrationAccelerationSlice = createSlice({
  name: 'integrationAccelerationSlice',
  initialState,
  reducers: {
    setAcceleration(state, action: PayloadAction<number>) {
      state.acceleration = action.payload;
    },
    incrementAcceleration(state) {
      state.acceleration += 1;
    },
  },
});

export const { setAcceleration, incrementAcceleration } = integrationAccelerationSlice.actions;
export default integrationAccelerationSlice.reducer;