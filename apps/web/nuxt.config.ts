// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 模組配置
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/icon'],

  // Nuxt Icon 配置
  icon: {
    serverBundle: {
      collections: ['heroicons'], // 明確指定使用的圖示集合
      remote: false, // 禁用遠程圖示獲取，只使用本地預載的圖示
    },
    // 增加客戶端配置
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true,
    // 加入 monorepo 路徑映射
    tsConfig: {
      compilerOptions: {
        paths: {
          '@smartsurvey/shared': ['../../packages/shared/dist/index.d.ts'],
          '@smartsurvey/shared/*': ['../../packages/shared/dist/*'],
          '@smartsurvey/shared/server': ['../../packages/shared/dist/server.d.ts'],
        },
      },
    },
  },

  // CSS 配置
  css: ['@/assets/css/main.css'],

  // 運行時配置
  runtimeConfig: {
    // 私有配置（僅伺服器端可用）
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret',
    mongodbUri: process.env.MONGODB_URI || '',
    mongodbDbName: process.env.MONGODB_DB_NAME || 'smartsurvey-dev',
    redisUrl: process.env.REDIS_URL || '',
    bcryptRounds: process.env.BCRYPT_ROUNDS || '10',

    // 公開配置（客戶端和伺服器端都可用）
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: process.env.APP_NAME || 'SmartSurvey Pro',
      appVersion: '0.0.1',
    },
  },

  // Nitro 伺服器配置
  nitro: {
    experimental: {
      wasm: true,
    },
  },

  // Vite 配置
  vite: {
    optimizeDeps: {
      include: ['@smartsurvey/shared'],
    },
  },

  // 應用配置
  app: {
    head: {
      title: 'SmartSurvey Pro - 智能問卷建構平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '企業級智能問卷建構與分析平台' },
      ],
    },
  },
});
