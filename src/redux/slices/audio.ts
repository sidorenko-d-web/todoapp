import { createSlice } from '@reduxjs/toolkit';

interface initialState {
  volume: number;
  track: 1 | 2 | 3;
}

const initialState: initialState = {
  volume: 0.1,
  track: 1,
};

const audioSlice = createSlice({
  name: 'audioSlice',
  initialState,
  reducers: {
    setVolume(state, action) {
      state.volume = action.payload;
    },
    setTrack(state, action) {
      state.track = action.payload;
    },
  },
});

export const selectVolume = (state: { audioSlice: initialState }) =>
  state.audioSlice.volume;
export const selectTrack = (state: { audioSlice: initialState }) =>
  state.audioSlice.track;

export const { setVolume, setTrack } = audioSlice.actions;
export const audioReducer = audioSlice.reducer;
