import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt', not 'autoUpdate' — same reasoning as the Piesano's build:
      // a silent worker swap mid-session shouldn't yank cached offline
      // lesson content out from under a family partway through reading it.
      registerType: 'prompt',
      injectRegister: null,
      // injectManifest (not generateSW) — a hand-written src/sw.js is
      // required for real Web Push (`push` / `notificationclick`) and for
      // the offline-lesson runtime cache used by the Library page.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
      },
      manifest: {
        name: 'Blue Manor Academy Companion (preview)',
        short_name: 'BMA Companion',
        description:
          "One-tap Zoom join for live classes and clubs, plus offline lesson access — a companion app preview for Blue Manor Academy's existing platform.",
        theme_color: '#14213d',
        background_color: '#f7f4ec',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
        ],
      },
    }),
  ],
})
