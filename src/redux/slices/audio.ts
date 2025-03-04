import { createSlice } from '@reduxjs/toolkit';

interface initialState {
  volume: number;
  buttonVolume: number;
  track: 1 | 2 | 3;
}

const initialState: initialState = {
  volume: 0.0105,
  track: 1,
  buttonVolume: 2.1,
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
    setButtonVolume(state, action) {
      state.buttonVolume = action.payload;
    },
  },
});

export const selectVolume = (state: { audioSlice: initialState }) =>
  state.audioSlice.volume;
export const selectTrack = (state: { audioSlice: initialState }) =>
  state.audioSlice.track;
export const selectButtonVolume = (state: { audioSlice: initialState }) =>
  state.audioSlice.track;

export const { setVolume, setTrack, setButtonVolume } = audioSlice.actions;
export const audioReducer = audioSlice.reducer;
