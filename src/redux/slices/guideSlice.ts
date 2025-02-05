import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuideState {
  getCoinsGuideShown: boolean;
}

const initialState: GuideState = {
  getCoinsGuideShown: false,
};

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    setGetCoinsGuideShown: (state, action: PayloadAction<boolean>) => {
      state.getCoinsGuideShown = action.payload;
    },
  },
});

export const { setGetCoinsGuideShown } = guideSlice.actions;
export default guideSlice.reducer;
