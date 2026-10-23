import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'brand/logo-uniao.png', 'brand/simbolo-cruz-uniao-verde.png', 'icons/*.png'],
      manifest: {
        name: 'União Serviços Médicos',
        short_name: 'União Médica',
        description: 'Capacitações em atendimento pré-hospitalar (APH), primeiros socorros e suporte básico de vida.',
        theme_color: '#047857',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'brand/simbolo-cruz-uniao-verde.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
          {
            src: 'brand/simbolo-cruz-uniao-verde.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
          {
            src: 'brand/simbolo-cruz-uniao-verde.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Standalone patient pages must not be replaced by the SPA navigation fallback.
        navigateFallbackDenylist: [/\/simulador\/personagens\/.*\.html(?:$|\?)/],
        // Full-resolution patient photos are cached on demand, after the first visit.
        globIgnores: ['**/simulador/personagens/**/*.png'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    watch: {
      // Evita EBUSY ao monitorar arquivos pesados/bloqueados fora do código-fonte
      ignored: ['**/apostilas/**', '**/dist/**'],
    },
  },
});
