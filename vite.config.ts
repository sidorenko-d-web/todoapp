import { fileURLToPath, URL } from 'url';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    createSvgIconsPlugin({
      iconDirs: [
        path.resolve(process.cwd(), 'src/platform/assets/icons'),
        path.resolve(process.cwd(), 'src/assets/icons'),
      ],
      symbolId: 'icon-[dir]-[name]',
    }),
    svgr(),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: '@components',
        replacement: fileURLToPath(new URL('./src/components', import.meta.url)),
      },
      {
        find: '@assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
      {
        find: '@style',
        replacement: fileURLToPath(new URL('./src/assets/style', import.meta.url)),
      },
      {
        find: '@icons',
        replacement: fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
      },
      {
        find: '@translate',
        replacement: fileURLToPath(new URL('./translate', import.meta.url)),
      },
    ],
  },
  // server: { //prodDev
  //   allowedHosts: true,
  //   proxy: {
  //     '/api/miniapp-v2-prod': {
  //       target: 'https://miniapp.apusher.com',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api\/miniapp-v2-prod/, ''),
  //     },
  //   },
  // },
   server: { //testDev
    allowedHosts: true,
    proxy: {
      '/api/miniapp-v2-dev': {
        target: 'https://storage.yandexcloud.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/miniapp-v2-dev/, ''),
      },
    },
  },
});
