// nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: {
    enabled: true,
    vscode: {
      // Autorise toutes les IPs pour le VFS
      allowedIPs: ['127.0.0.1']
    }
  },
  // 1. DÉCLARATION DES MODULES
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@sidebase/nuxt-auth',
    'nuxt-security',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/test-utils',
  ],
  
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: { 
      apiBase: process.env.API_BASE_URL || 'https://localhost:7028'
    }
  },

  // 2. CONFIGURATION DE L'AUTHENTIFICATION
  auth: {
    // On utilise le proxy Nitro, donc le baseURL doit être un chemin relatif.
    baseURL: process.env.API_BASE_URL + '/api/auth',
    provider: {
      type: 'local', // Stratégie "locale" pour une authentification par identifiants. [2]
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/createuser', method: 'post' },
        getSession: { path: '/me', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/token', // ou '/accessToken' selon votre réponse
        type: 'Bearer' // Type de token standard
      },
      pages: {
        login: '/connexion'
      }
    },
    globalAppMiddleware: true, // Active le middleware d'authentification sur toutes les pages
    // ✅ options pour les cookies
    session: {
      enableRefreshOnWindowFocus: true, // rafraîchit la session si expirée
      cookie: {
        secure: process.env.NODE_ENV === 'production', // https obligatoire en prod
        sameSite: 'lax', // protection CSRF basique
        httpOnly: true,  // ⚡ empêche l’accès JS (XSS)
        maxAge: 60 * 60 * 24 * 7 // 7 jours
      }
    }
  },

  // 3. CONFIGURATION DU PROXY NITRO (essentiel pour le développement)
  nitro: {
    devProxy: {
      "/api": {
        target: "https://localhost:7028", // Cible la racine de votre API .NET
        changeOrigin: true,
      }
    }
  },
  
  // 4. CONFIGURATION DE LA SÉCURITÉ (CORRIGÉE )
  security: {
    // On active la protection CSRF globalement.
    csrf: true, 
    // Les autres en-têtes de sécurité sont bons.
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    }
  },

  // 5. RÈGLES DE ROUTE (pour gérer les exceptions de sécurité)
  routeRules: {
    // On dit à nuxt-security de ne PAS appliquer la protection CSRF sur les appels API.
    // C'est la bonne façon de gérer les exceptions.
    '/api/**': {
      security: {
        csrf: false,
        corsHandler: { // On peut aussi désactiver le CORS de Nuxt pour ces routes
          origin: '*',
          methods: '*'
        }
      }
    }
  },

  // 6. CONFIGURATIONS UI ET I18N
  ui: {
    icons: ['heroicons', 'logos', 'circle-flags']
  },
  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'zh', iso: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'it', iso: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'pt', iso: 'pt-PT', name: 'Português', file: 'pt.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    vueI18n: './i18n.config.ts'
  }
})
