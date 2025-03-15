export const svgHeadersString = '?response-content-type=image%2Fsvg%2Bxml';

export const itemStoreString = (image_url: string) =>
  image_url.replace('https://', 'https://storage.yandexcloud.net/') + svgHeadersString;
