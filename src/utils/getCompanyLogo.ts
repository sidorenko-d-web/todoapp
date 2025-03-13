export const getCompanyLogo = (companyName: string): string => {
  return `https://miniapp-v2-prod.website.yandexcloud.net/Logo=${encodeURIComponent(
    companyName,
  )}.svg`;
};
