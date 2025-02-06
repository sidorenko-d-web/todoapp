import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isGuideShown } from "../../utils";
import { GUIDE_ITEMS } from "../../constants";

interface GuideState {
  getCoinsGuideShown: boolean;
  getShopStatsGlowing: boolean;
}

const initialState: GuideState = {
  getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
  getShopStatsGlowing: !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)
};

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    setGetCoinsGuideShown: (state, action: PayloadAction<boolean>) => {
      console.log('coinst redux');
      state.getCoinsGuideShown = action.payload;
    },
    setShopStatsGlowing: (state, action: PayloadAction<boolean>) => {
      console.log('stats redux');
      state.getShopStatsGlowing = action.payload;
    }
  },
});

export const { setGetCoinsGuideShown, setShopStatsGlowing } = guideSlice.actions;
export default guideSlice.reducer;
