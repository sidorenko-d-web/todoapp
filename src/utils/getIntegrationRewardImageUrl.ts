import { buildLink } from '../constants/buildMode';

export const getIntegrationRewardImageUrl = (companyName: string, level: number): string => {
  return `${buildLink()?.itemBaseUrl}${encodeURIComponent(companyName)}-${level}.svg`;
};
