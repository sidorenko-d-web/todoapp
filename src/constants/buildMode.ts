import { buildMode } from './config';

const proxy = {
  proxy_TestDev: (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev'),
  proxy_Test: (url: string) => url,
  proxy_ProdDev: (url: string) => url.replace('https://miniapp.apusher.com', '/api/miniapp-v2-prod'),
  proxy_Production: (url: string) => {
    if (url.startsWith('https://storage.yandexcloud.net/')) {
      return url.replace('https://storage.yandexcloud.net/', 'https://');
    }
    return url;
  },
};



const links = {
  svgItem_TestDev: (imageUrl: string) => proxy.proxy_TestDev(imageUrl),
  svgItem_Test: (imageUrl: string) => imageUrl,
  svgItem_ProdDev: (imageUrl: string) => imageUrl!.replace('https://miniapp.apusher.com', '/api/miniapp-v2-prod'),
  svgItem_Production: (imageUrl: string) => imageUrl,

  itemsBaseUrl_TestDev: 'https://storage.yandexcloud.net/miniapp-v2-dev/',
  itemsBaseUrl_Test: 'https://storage.yandexcloud.net/miniapp-v2-dev/',
  itemsBaseUrl_ProdDev: 'https://miniapp.apusher.com/export/',
  itemsBaseUrl_Production: 'https://miniapp.apusher.com/export/',

  // url.replace('https://', 'https://storage.yandexcloud.net/') mb it would be need

  svgShop_TestDev: (url: string) => url,
  svgShop_Test: (url: string) => url,
  svgShop_ProdDev: (url: string) => url,
  svgShop_Production: (url: string) => url,

  baseUrl_TestDev: 'https://bbajd7fltqec6462cm1j.containers.yandexcloud.net/',
  baseUrl_Test: 'https://bbajd7fltqec6462cm1j.containers.yandexcloud.net/',
  baseUrl_ProdDev: 'https://bbaa2o77ubs6r4cta1l2.containers.yandexcloud.net/',
  baseUrl_Production: 'https://bbaa2o77ubs6r4cta1l2.containers.yandexcloud.net/',
};
export function buildLink() {
  if (buildMode === 'production') {
    return {
      proxy: proxy.proxy_Production,
      itemBaseUrl: links.itemsBaseUrl_Production,
      svgLink: links.svgItem_Production,
      svgShop: links.svgShop_Production,
      baseUrl: links.baseUrl_Production,
    };
  } else if (buildMode === 'prodDev') {
    return {
      proxy: proxy.proxy_ProdDev,
      itemBaseUrl: links.itemsBaseUrl_ProdDev,
      svgLink: links.svgItem_ProdDev,
      svgShop: links.svgShop_ProdDev,
      baseUrl: links.baseUrl_ProdDev,
    };
  } else if (buildMode === 'test') {
    return {
      proxy: proxy.proxy_Test,
      itemBaseUrl: links.itemsBaseUrl_Test,
      svgLink: links.svgItem_Test,
      svgShop: links.svgShop_Test,
      baseUrl: links.baseUrl_Test,
    };
  }
  return {
    proxy: proxy.proxy_TestDev,
    itemBaseUrl: links.itemsBaseUrl_TestDev,
    svgLink: links.svgItem_TestDev,
    svgShop: links.svgShop_TestDev,
    baseUrl: links.baseUrl_TestDev,
  };
}

