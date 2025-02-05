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
