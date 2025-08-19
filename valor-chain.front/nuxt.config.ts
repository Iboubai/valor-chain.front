// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [    
    // https://go.nuxtjs.dev/axios
    //'@nuxtjs/axios',
    // https://go.nuxtjs.dev/i18n
    '@nuxtjs/i18n',
    // https://auth.nuxtjs.org/
    //'@nuxtjs/auth-next',
    '@workmate/nuxt-auth',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*axios: {
    // Base URL pour vos requêtes API. Sera surchargée par les variables d'environnement.
    baseURL: process.env.API_URL || 'http://localhost:8000/api',
  },
  auth: {
    strategies: {
    local: {
      token: {
        property: 'access_token',
        global: true,
        required: true,
        type: 'Bearer'
      },
      user: {
        property: 'user',
        autoFetch: true
      },
      endpoints: {
        login: { url: '/auth/login', method: 'post' },
        logout: { url: '/auth/logout', method: 'post' },
        user: { url: '/auth/user', method: 'get' }
      }
    }
    }
    },
    // Configuration du module dotenv
    dotenv: {
      path: './',
      filename: '.env'
    },*/
})