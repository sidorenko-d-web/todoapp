export const getCompanyLogo = (companyName: string): string => {
  return `https://miniapp.apusher.com/export/Logo=${encodeURIComponent(
    companyName,
  )}.svg`;
};
