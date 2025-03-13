export const getIntegrationRewardImageUrl = (companyName: string, level: number): string => {
  return `https://storage.yandexcloud.net/miniapp-v2-prod/${encodeURIComponent(companyName)}-${level}.svg`;
};
