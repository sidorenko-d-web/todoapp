export const getCompanyLogo = (companyName: string): string => {
  return `https://storage.yandexcloud.net/miniapp-v2-prod/Logo=${encodeURIComponent(
    companyName,
  )}.svg`;
};
