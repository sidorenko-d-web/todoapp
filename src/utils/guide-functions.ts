import { GUIDE_ITEMS } from "../constants";

export const isGuideShown = (guideId: string) => {
    return sessionStorage.getItem(guideId) === '1';
}

export const setGuideShown = (guideId: string) => {
    sessionStorage.setItem(guideId, '1');
}

export const isIntegrationCreationButtonGlowing = () => {
    return (isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)
        && !isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN))
        || (isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN));
}

export const setSubscriptionPurchased = () => {
    sessionStorage.setItem(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT, '1');
}

export const getSubscriptionPurchased = () => {
    return sessionStorage.getItem(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT) === '1';
}


export const integrationCreatingModalLightningsGlowing = () => {
    return (
        !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
        && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
        && !isGuideShown(GUIDE_ITEMS.mainPage.MAIN_PAGE_GUIDE_FINISHED)
    );
}

export const integrationCreatingModalTabsGlowing = () => {
    return (
        isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)
        && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
    );
}

export const integrationCreatingModalButtonGlowing = () => {
    return (
        isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)
        && isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
        && !isGuideShown(GUIDE_ITEMS.mainPage.MAIN_PAGE_GUIDE_FINISHED)
    );
}


export const getCurrentFooterItem = () => {
  if(!isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)) {
    return 2;
  }

  if(isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) 
    && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
    return 0;
  }

  if(isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) 
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN)) {
    return 1;
  }

  return -1;
}