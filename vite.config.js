import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Allow Monaco editor bundle (~7MB) to be cached
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      manifest: {
        name: 'CodeInsight — Visual DSA Platform',
        short_name: 'CodeInsight',
        description: 'Interactive visual DSA learning & algorithm optimization platform',
        theme_color: '#0F1217',
        background_color: '#0F1217',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgcng9IjM4IiBmaWxsPSIjMEYxMjE3Ii8+PHRleHQgeD0iOTYiIHk9IjEyMCIgZm9udC1zaXplPSI5NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pycPC90ZXh0Pjwvc3ZnPg==',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      devOptions: {
        enabled: false, // disable in dev to avoid service worker interference
      },
    }),
  ],
})
