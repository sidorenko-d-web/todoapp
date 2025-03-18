export const getCompanyLogo = (companyName: string): string => {
  return `https://storage.yandexcloud.net/miniapp-v2-dev/Logo=${encodeURIComponent(companyName)}.svg`;
  return `https://miniapp.apusher.com/export/Logo=${encodeURIComponent(companyName)}.svg`;
};
