export const getOS = (): string | null => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (iosPlatforms.includes(platform)) {
    return 'ios';
  } else if (/Android/.test(userAgent)) {
    return 'android';
  }
  return null
};