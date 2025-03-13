export const getIntegrationRewardImageUrl = (companyName: string, level: number): string => {
  return `https://miniapp.apusher.com/export/${encodeURIComponent(companyName)}-${level}.svg`;
};
