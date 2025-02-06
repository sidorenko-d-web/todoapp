import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isGuideShown } from "../../utils";
import { GUIDE_ITEMS } from "../../constants";

interface GuideState {
  getCoinsGuideShown: boolean;
  getShopStatsGlowing: boolean;
  buyItemButtonGlowing: boolean;
}

const initialState: GuideState = {
  getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
  getShopStatsGlowing: !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN),
  buyItemButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) 
    && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)
};

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    setGetCoinsGuideShown: (state, action: PayloadAction<boolean>) => {
      state.getCoinsGuideShown = action.payload;
    },
    setShopStatsGlowing: (state, action: PayloadAction<boolean>) => {
      state.getShopStatsGlowing = action.payload;
    },
    setBuyItemButtonGlowing: (state, action: PayloadAction<boolean>) => {
      state.buyItemButtonGlowing = action.payload;
    }
  },
});

export const { setGetCoinsGuideShown, setShopStatsGlowing, setBuyItemButtonGlowing } = guideSlice.actions;
export default guideSlice.reducer;
