// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  debug: true,

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@sidebase/nuxt-auth', // Ajout du module d'authentification. [2]
    '@nuxtjs/i18n',       // Ajout du module i18n. [4]
    'nuxt-security'        // Ajout du module de sécurité. [11]
  ],

  // Configuration de la sécurité
  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'upgrade-insecure-requests': true
      }
    },
    rateLimiter: { // Protection contre les attaques DDoS/Brute-force. [11]
      tokensPerInterval: 150,
      interval: 'hour'
    },
    xssValidator: {}, // Protection contre les attaques XSS. [11]
    corsHandler: {
      origin: process.env.API_BASE_URL, // Autoriser les requêtes depuis votre API
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    //csrf: true, // Protection CSRF. [11]
    csrf: {
      // Exclure toutes les routes qui commencent par /api/
      // C'est la ligne la plus importante à ajouter/modifier.
      // Elle indique à nuxt-security de ne pas vérifier le token CSRF
      // pour les requêtes destinées à votre backend.
      allowedMethods: ['POST', 'PUT', 'DELETE'], // Gardez les méthodes à protéger
      routes: ['/api/**'] // Exclure les routes de l'API
    },

    // Configuration spécifique à la route pour la sécurité
    routeRules: {
      // Pour toutes les routes commençant par /api/, désactivez la sécurité CSRF
    '/api/**': {
      security: {
        csrf: false
      }
    }
  }
  },

  // Configuration de l'authentification
  auth: {
    baseURL: 'https://localhost:7028/api/auth',
    provider: {
      type: 'local', // Stratégie "locale" pour une authentification par identifiants. [2]
      endpoints: {
        signIn: { path: '/users/login', method: 'post' },
        signOut: { path: '/users/logout', method: 'post' },
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
    globalAppMiddleware: true // Active le middleware d'authentification sur toutes les pages
  },

  // Configuration de l'internationalisation (i18n )
  i18n: {
    locales: [ // Liste des langues. [4, 12]
      { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'zh', iso: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'it', iso: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'pt', iso: 'pt-PT', name: 'Português', file: 'pt.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'sus', iso: 'sus-GN', name: 'Soussou', file: 'sus.json' },
      { code: 'ff', iso: 'ff-GN', name: 'Peul', file: 'ff.json' },
      { code: 'man', iso: 'man-GN', name: 'Malinké', file: 'man.json' }
    ],
    lazy: true, // Chargement différé des traductions pour de meilleures performances. [14]
    langDir: 'locales', // Dossier contenant les fichiers de traduction
    defaultLocale: 'fr', // Langue par défaut
    strategy: 'prefix_except_default', // Stratégie de routage pour les langues
    vueI18n: './i18n.config.ts' // Fichier de configuration pour Vue I18n
  },

  // Configuration pour les requêtes API
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://localhost:7028' // URL de base de votre API
    }
  }/*,
  nitro: {
    devProxy: {
    // Le préfixe des routes à intercepter
      "/api": {
        // L'URL de destination (votre API .NET )
        target: "https://localhost:7028", // Assurez-vous que c'est la bonne URL/port
        // Nécessaire pour les requêtes POST, PUT, etc.
        changeOrigin: true,
      }
    }
  }*/
} )
