import { buildLink } from '../constants/buildMode';

export const getCompanyLogo = (companyName: string): string => {
  return `${buildLink()?.itemBaseUrl}Logo=${encodeURIComponent(companyName)}.svg`;
};
