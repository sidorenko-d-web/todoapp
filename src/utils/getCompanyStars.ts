import { starsThresholds } from "../constants";

export function getCompanyStars(integrationsCount: number) {
    if (integrationsCount === starsThresholds.thirdStar) {
        return 3;
    }
    if (integrationsCount === starsThresholds.secondStar) {
        return 2;
    }
    if (integrationsCount === starsThresholds.firstStar) {
        return 1;
    }
    return 0;
}