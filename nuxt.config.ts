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
    manifest: {
      name: 'Self Pilot',
      short_name: 'Self Pilot',
      start_url: pagesUrl,
      display: 'standalone',
      theme_color: '#1976d2',
      background_color: 'black',
      icons: [
        { src: `${pagesUrl}icon-192x192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${pagesUrl}icon-512x512.png`, sizes: '512x512', type: 'image/png' },
      ],
    },
    registerType: 'autoUpdate',
    workbox: {
      // Not using ATM
    },
  },

  ssr: false,

  devtools: {
    enabled: true,
  },

  app: { baseURL: pagesUrl },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      },
    },
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
  },

  compatibilityDate: '2024-07-11',

  nitro: { preset: 'static' },

  supabase: {
    redirect: true, // To login page if not signed in
  },
})
