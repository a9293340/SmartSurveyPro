module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    // Prettier 整合 - 只在非 Nuxt 項目中啟用
    'prettier/prettier': 'off', // 關閉全局 prettier 規則，在 overrides 中具體設定

    // TypeScript 相關 - 參考 Microsoft 和 Google 的標準
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn', // 允許使用但給出警告
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': false,
      },
    ],

    // 代碼品質 - 適度嚴格
    'no-console': ['warn', { allow: ['warn', 'error'] }], // 允許 warn 和 error
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'warn',
    'arrow-spacing': 'error',

    // 最佳實踐
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'multi-line'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'warn',
    'no-useless-call': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-return': 'warn',

    // 代碼風格 - 讓 Prettier 處理大部分
    'object-shorthand': 'warn',
    'prefer-template': 'warn',
    'quote-props': ['warn', 'as-needed'],

    // 錯誤處理
    'no-empty': ['error', { allowEmptyCatch: true }],
    'handle-callback-err': 'warn',

    // 效能相關
    'no-loop-func': 'warn',
    'no-new-object': 'warn',
    'no-new-wrappers': 'error',

    // 安全性
    'no-new-func': 'error',
    'no-implied-eval': 'error',

    // Promise 相關
    'no-async-promise-executor': 'error',
    'no-promise-executor-return': 'warn',
    'prefer-promise-reject-errors': 'warn',

    // 關閉與 Prettier 衝突的規則
    'comma-dangle': 'off',
    'semi': 'off',
  },
  overrides: [
    // Nuxt3 項目特殊配置
    {
      files: ['apps/web/**/*.{js,ts,vue}'],
      env: {
        browser: true,
        node: true,
      },
      globals: {
        // Nuxt3 auto-imports
        defineNuxtConfig: 'readonly',
        defineEventHandler: 'readonly',
        useHead: 'readonly',
        useSeoMeta: 'readonly',
        navigateTo: 'readonly',
        $fetch: 'readonly',
        useRuntimeConfig: 'readonly',
        useNuxtApp: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useState: 'readonly',
        useCookie: 'readonly',
        useRequestHeaders: 'readonly',
        useRequestURL: 'readonly',
        // Vue 3 auto-imports
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        nextTick: 'readonly',
      },
      rules: {
        'require-await': 'off', // Nuxt3 事件處理器可能不需要 await
        'comma-dangle': 'off', // 讓 Prettier 處理
        'semi': 'off', // 讓 Prettier 處理
        '@typescript-eslint/no-unused-vars': 'off', // 開發階段暫時關閉
      },
    },
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'warn',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'warn',
        'vue/singleline-html-element-content-newline': 'off', // 允許單行內容
        'comma-dangle': 'off', // 讓 Prettier 處理
        'semi': 'off', // 讓 Prettier 處理
      },
    },
    {
      files: ['*.config.{js,ts}', '*.setup.{js,ts}'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/__tests__/**', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.output',
    '.nuxt',
    'coverage',
    '*.min.js',
  ],
};