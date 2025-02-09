import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isGuideShown } from "../../utils";
import { GUIDE_ITEMS } from "../../constants";

interface GuideState {
  getCoinsGuideShown: boolean;
  getShopStatsGlowing: boolean;
  buyItemButtonGlowing: boolean;
  createIntegrationButtonGlowing: boolean;
  integrationCreated: boolean;
  accelerateIntegrationGuideClosed: boolean;
  isPublishedModalClosed: boolean;
  integrationReadyForPublishing: boolean;

  createdIntegrationId: string;
}

const initialState: GuideState = {
  getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
  getShopStatsGlowing: !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN),
  buyItemButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) 
    && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE),
  createIntegrationButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
    !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED),
  integrationCreated: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED) 
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN),
  integrationReadyForPublishing: false,
  accelerateIntegrationGuideClosed: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN)
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED),
  isPublishedModalClosed: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED),
  createdIntegrationId: ""
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
    },
    setCreateIntegrationButtonGlowing: (state, action: PayloadAction<boolean>) => {
      state.createIntegrationButtonGlowing = action.payload;
    },
    setIntegrationCreated: (state, action: PayloadAction<boolean>) => {
      state.integrationCreated = action.payload;
    },
    setAccelerateIntegrationGuideClosed: (state, action: PayloadAction<boolean>) => {
      state.accelerateIntegrationGuideClosed = action.payload;
    },
    setIsPublishedModalClosed: (state, action: PayloadAction<boolean>) => {
      state.isPublishedModalClosed = action.payload;
    },
    setIntegrationReadyForPublishing: (state, action: PayloadAction<boolean>) => {
      state.integrationReadyForPublishing = action.payload;
    },
    setCreatedIntegrationId: (state, action: PayloadAction<string>) => {
      state.createdIntegrationId = action.payload;
    },
  },
});

export const { setGetCoinsGuideShown, 
    setShopStatsGlowing, 
    setBuyItemButtonGlowing,
    setCreateIntegrationButtonGlowing, 
    setIntegrationCreated, setAccelerateIntegrationGuideClosed,
    setIsPublishedModalClosed, setIntegrationReadyForPublishing, setCreatedIntegrationId } = guideSlice.actions;
export default guideSlice.reducer;
