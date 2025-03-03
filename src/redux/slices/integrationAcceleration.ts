import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  acceleration: number;
  integrationCreating: boolean;
}

const initialState: InitialState = {
  acceleration: 0,
  integrationCreating: false
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
    setIntegrationCreating(state, action: PayloadAction<boolean>) {
      state.integrationCreating = action.payload;
    }
  },
});

export const { setAcceleration, incrementAcceleration, setIntegrationCreating } = integrationAccelerationSlice.actions;
export default integrationAccelerationSlice.reducer;