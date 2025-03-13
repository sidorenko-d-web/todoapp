export const getIntegrationRewardImageUrl = (companyName: string, level: number): string => {
  return `https://miniapp-v2-prod.website.yandexcloud.net/${encodeURIComponent(companyName)}-${level}.svg`;
};
