import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'assets/images/**'],
      manifest: {
        name: 'Dhyey Barbhaya - Portfolio',
        short_name: 'Dhyey MERN',
        description: 'Dhyey Barbhaya - Premium Full Stack MERN Portfolio',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        icons: [
          {
            src: '/assets/images/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/assets/images/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
