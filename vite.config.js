import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: '천자문 Memorize',
        short_name: '천자문',
        description: '한석봉 천자문 기반 한자 암기 앱',
        theme_color: '#001529',
        background_color: '#001529',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
});
