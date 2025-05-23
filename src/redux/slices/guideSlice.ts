import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isGuideShown } from "../../utils";
import { GUIDE_ITEMS } from "../../constants";

interface GuideState {
  subscribeGuideShown: boolean;
  getCoinsGuideShown: boolean;
  getShopStatsGlowing: boolean;
  buyItemButtonGlowing: boolean;
  createIntegrationButtonGlowing: boolean;
  integrationCreated: boolean;
  accelerateIntegrationGuideClosed: boolean;
  isPublishedModalClosed: boolean;
  integrationReadyForPublishing: boolean;

  itemBought: boolean;

  elevateIntegrationStats: boolean;

  lastIntegrationId: string;

  footerActive: boolean;

  activeFooterItemId: number;

  dimHeader: boolean;
  goToShopBtnGlowing: boolean;

  firstIntegrationCreating: boolean;

  commentGlow: boolean;

  openDaysInARow: boolean;

  itemUpgraded: boolean;

  firstIntegrationReadyToPublish: boolean;

  firstIntegrationId: string,

  showFreezeGuide: boolean,

  refetchAfterPublish: number
}

const initialState: GuideState = {
  subscribeGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN),
  getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
  getShopStatsGlowing: !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN),
  buyItemButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) 
    && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE),
  createIntegrationButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
    !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED),
  itemBought: false,
  integrationCreated: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED) 
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN),
  integrationReadyForPublishing: false,
  accelerateIntegrationGuideClosed: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN)
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED),
  isPublishedModalClosed: false,
  elevateIntegrationStats: !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN),
  lastIntegrationId: "",
  footerActive: isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN),
  activeFooterItemId: 3,

  dimHeader: false,

  goToShopBtnGlowing: false,

  firstIntegrationCreating: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED)
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.FIRST_INTEGRATION_CREATED),

  commentGlow: !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN),

  openDaysInARow: false,

  itemUpgraded: isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.ITEM_UPGRADED),

  firstIntegrationReadyToPublish: localStorage.getItem('FIRST_INTEGRATION_READY_TO_PUBLISH') === '1',

  firstIntegrationId: '',

  showFreezeGuide:
   isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_SECOND_GUIDE_SHOWN) && !isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_THIRD_GUIDE_SHOWN),

  refetchAfterPublish: 0
  };

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    setSubscribeGuideShown: (state, action: PayloadAction<boolean>) => {
      state.subscribeGuideShown = action.payload;
    },
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
    setElevateIntegrationStats: (state, action: PayloadAction<boolean>) => {
      state.elevateIntegrationStats = action.payload;
    },
    setItemBought: (state, action: PayloadAction<boolean>) => {
      state.itemBought = action.payload;
    },
    setLastIntegrationId: (state, action: PayloadAction<string>) => {
      state.lastIntegrationId = action.payload;
    },
    setFooterActive: (state, action: PayloadAction<boolean>) => {
      state.footerActive = action.payload;
    },
    setActiveFooterItemId: (state, action: PayloadAction<number>) => {
      if(state.activeFooterItemId !== -1) {
        state.activeFooterItemId = action.payload;
      }
    },

    setDimHeader: (state, action: PayloadAction<boolean>) => {
      state.dimHeader = action.payload;
    },

    setGoToShopBtnGlowing: (state, action: PayloadAction<boolean>) => {
      state.goToShopBtnGlowing = action.payload;
    },

    setFirstIntegrationCreating: (state, action: PayloadAction<boolean>) => {
      state.firstIntegrationCreating = action.payload;
    },

    setCommentGlow: (state, action: PayloadAction<boolean>) => {
      state.commentGlow = action.payload;
    },

    setOpenDaysInARow: (state, action: PayloadAction<boolean>) => {
      state.openDaysInARow = action.payload;
    },

    setItemUpgraded: (state, action: PayloadAction<boolean>) => {
      state.itemUpgraded = action.payload;
    },

    setFirstIntegrationReadyToPublish: (state, action: PayloadAction<boolean>) => {
      state.firstIntegrationReadyToPublish = action.payload;
    },

    setFirstIntegrationId: (state, action: PayloadAction<string>) => {
      state.firstIntegrationId = action.payload;
    },

    setShowFreezeGuide: (state, action: PayloadAction<boolean>) => {
      state.showFreezeGuide = action.payload;
    },

    setRefetchAfterPublish: (state) => {
      state.refetchAfterPublish += 1;
    },

    resetGuideState: (state) => {
      Object.assign(state, {
        subscribeGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN),
        getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
        getShopStatsGlowing: !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN),
        buyItemButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) 
          && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE),
        createIntegrationButtonGlowing: isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
          !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED),
        itemBought: false,
        integrationCreated: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED) 
          && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN),
        integrationReadyForPublishing: false,
        accelerateIntegrationGuideClosed: isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN)
          && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED),
        isPublishedModalClosed: false,
        elevateIntegrationStats: !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN),
        firstIntegrationCreating: false,
        footerActive: isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN),
        commentGlow: !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN),
        itemUpgraded: isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.ITEM_UPGRADED)
      });
    }
  },
});

export const { setGetCoinsGuideShown, setSubscribeGuideShown,
    setShopStatsGlowing, setRefetchAfterPublish,
    setBuyItemButtonGlowing, setFirstIntegrationId,
    setCreateIntegrationButtonGlowing, setShowFreezeGuide,
    setIntegrationCreated, setAccelerateIntegrationGuideClosed,
    setIsPublishedModalClosed, setIntegrationReadyForPublishing, 
    setElevateIntegrationStats, setItemUpgraded, setFirstIntegrationReadyToPublish,
    setItemBought, setLastIntegrationId, setDimHeader, setGoToShopBtnGlowing, setFirstIntegrationCreating,
    setFooterActive, setActiveFooterItemId, setCommentGlow, resetGuideState, setOpenDaysInARow} = guideSlice.actions;
export default guideSlice.reducer;
