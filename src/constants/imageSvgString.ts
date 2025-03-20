import { buildLink } from './buildMode';

export const svgHeadersString = '?response-content-type=image%2Fsvg%2Bxml';

export const itemStoreString = (image_url: string) => buildLink()?.svgLink(image_url) + svgHeadersString;
