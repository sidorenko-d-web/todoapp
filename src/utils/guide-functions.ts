import { GUIDE_ITEMS } from "../constants";

export const isGuideShown = (guideId: string) => {
    return localStorage.getItem(guideId) === '1';
}

export const setGuideShown = (guideId: string) => {
    localStorage.setItem(guideId, '1');
}

export const isIntegrationCreationButtonGlowing = () => {
    return (isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)
        && !isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN))
        || (isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN));
}

export const setSubscriptionPurchased = () => {
    localStorage.setItem(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT, '1');
}

export const getSubscriptionPurchased = () => {
    return localStorage.getItem(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT) === '1';
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