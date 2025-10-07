// Specifying the URL for GitHub Pages deployment
const pagesUrl = '/self-pilot-app/'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vite-pwa/nuxt',
  ],

  pwa: {
    base: pagesUrl,
    manifest: {
      name: 'Self Pilot',
      short_name: 'Self Pilot',
      start_url: pagesUrl,
      display: 'standalone',
      theme_color: '#020618',
      background_color: 'black',
      icons: [
        { src: `icon-192x192.png`, sizes: '192x192', type: 'image/png' },
        { src: `icon-512x512.png`, sizes: '512x512', type: 'image/png' },
      ],
    },
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: undefined, // To stop non-precached-urls errors
    },
  },

  ssr: false,

  devtools: {
    enabled: true,
  },

  app: { baseURL: pagesUrl },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-10-06', // Compatibility date for Nitro presets

  nitro: { preset: 'static' },

  supabase: {
    redirect: false, // Custom middleware will handle auth redirects
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
  },
})
