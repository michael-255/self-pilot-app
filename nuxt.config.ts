// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
  ],

  ssr: false,

  devtools: {
    enabled: true,
  },

  app: { baseURL: '/self-pilot-app/' },

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
    redirect: false, // To login page
  },
})
