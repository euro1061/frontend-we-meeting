// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", '@nuxtjs/google-fonts', 'nuxt-icon'],
  css: [
    '@/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },
  googleFonts: {
    families: {
      Kanit: [100, 200, 300, 400, 500, 600, 700],
    },
    display: 'swap',
    prefetch: false,
    preconnect: false,
    preload: false,
    download: true,
    base64: false,
  },
  devtools: { enabled: true },
  compatibilityDate: "2024-08-31",
  devServer: {
    port: 5000,
  },
  router: {
    options: {
      strict: false
    }
  },
  routeRules: {
    '/**': { ssr: false }
  },
  app: {
    head: {
      title: 'WeMeeting - ระบบจองห้องประชุม',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})