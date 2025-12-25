// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    'nuxt-mongoose',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // App configuration
  app: {
    head: {
      title: 'OGame Vue TS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Conquer the Stars - OGame Clone built with Vue & Nuxt' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }
      ]
    }
  },
  
  // CSS
  css: ['~/assets/css/main.css'],
  
  // Auto-import directories
  imports: {
    dirs: ['stores', 'composables', 'utils', 'lib', 'config', 'locales', 'types']
  },
  
  // Components auto-import
  components: {
    dirs: [
      '~/components/ui',
      '~/components/common',
      '~/components/dialogs',
      '~/components/notifications',
      '~/components/campaign',
      '~/components/npc',
      '~/components'
    ]
  },
  
  // TypeScript
  typescript: {
    strict: true
  },
  
  // Runtime config
  runtimeConfig: {
    // Server-only
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ogame',
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || 'your-super-secret-password-min-32-chars',
    
    // Public (available on client)
    public: {
      appName: 'OGame Vue TS',
      appVersion: '2.0.0'
    }
  },
  
  // Mongoose configuration
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ogame',
    options: {},
    modelsDir: 'models'
  },
  
  // Nitro configuration
  nitro: {
    experimental: {
      asyncContext: true
    }
  }
})