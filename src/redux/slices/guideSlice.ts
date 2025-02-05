import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isGuideShown } from "../../utils";
import { GUIDE_ITEMS } from "../../constants";

interface GuideState {
  getCoinsGuideShown: boolean;
}

const initialState: GuideState = {
  getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
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
