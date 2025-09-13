# SmartSurvey Pro - Monorepo 架構規劃文檔

> 📅 文件版本：v1.0  
> 📝 最後更新：2025-01-10  
> 🏗️ 架構模式：Monorepo with Turborepo  
> 📦 包管理器：PNPM

---

## 📊 架構總覽

```
survey-builder/                          # 根目錄
├── apps/                               # 應用層
│   ├── web/                           # 主應用 (Nuxt3)
│   └── admin/                         # 管理後台 (Phase 3+)
├── packages/                           # 共享包層
│   ├── shared/                        # 共享程式碼 (Phase 1)
│   ├── ui/                           # UI 組件庫 (Phase 2)
│   └── core/                         # 核心業務 (Phase 2)
├── services/                           # 微服務層 (Phase 4+)
│   └── admin-api/                    # Go 後端服務
└── [配置文件和文檔]
```

---

## 🗂️ 完整目錄結構

### Phase 1-2 結構（MVP - 第1-4個月）

```bash
survey-builder/
├── apps/
│   └── web/                              # Nuxt3 主應用
│       ├── assets/                       # 靜態資源
│       │   ├── css/
│       │   │   ├── main.css            # 全局樣式
│       │   │   └── transitions.css     # 動畫樣式
│       │   ├── fonts/                  # 自定義字體
│       │   └── images/                 # 圖片資源
│       │
│       ├── components/                   # Vue 組件
│       │   ├── builder/                # 建構器相關組件
│       │   │   ├── Canvas/
│       │   │   │   ├── DragDropCanvas.vue
│       │   │   │   ├── GridSystem.vue
│       │   │   │   └── CanvasControls.vue
│       │   │   ├── QuestionTypes/     # 題型組件
│       │   │   │   ├── BaseQuestion.vue
│       │   │   │   ├── SingleChoice.vue
│       │   │   │   ├── MultipleChoice.vue
│       │   │   │   ├── TextInput.vue
│       │   │   │   ├── RatingScale.vue
│       │   │   │   └── index.ts
│       │   │   ├── Properties/        # 屬性面板
│       │   │   │   ├── PropertyPanel.vue
│       │   │   │   ├── StyleEditor.vue
│       │   │   │   └── LogicEditor.vue
│       │   │   └── Toolbar/           # 工具欄
│       │   │       ├── MainToolbar.vue
│       │   │       └── QuestionLibrary.vue
│       │   │
│       │   ├── analytics/              # 分析組件
│       │   │   ├── ChartWrapper.vue
│       │   │   ├── StatCard.vue
│       │   │   └── DataTable.vue
│       │   │
│       │   ├── response/               # 回應相關組件
│       │   │   ├── SurveyRenderer.vue
│       │   │   ├── QuestionRenderer.vue
│       │   │   └── ProgressBar.vue
│       │   │
│       │   ├── shared/                 # 共用組件
│       │   │   ├── AppHeader.vue
│       │   │   ├── AppFooter.vue
│       │   │   ├── LoadingSpinner.vue
│       │   │   └── ErrorBoundary.vue
│       │   │
│       │   └── ui/                     # 基礎 UI 組件
│       │       ├── BaseButton.vue
│       │       ├── BaseInput.vue
│       │       ├── BaseModal.vue
│       │       └── BaseToast.vue
│       │
│       ├── composables/                  # 組合式函數
│       │   ├── builder/
│       │   │   ├── useDragDrop.ts     # 拖拽邏輯
│       │   │   ├── useCanvasState.ts  # 畫布狀態
│       │   │   └── useQuestionLogic.ts # 題目邏輯
│       │   ├── data/
│       │   │   ├── useSurveyData.ts   # 問卷數據
│       │   │   ├── useAnalytics.ts    # 分析數據
│       │   │   └── useResponse.ts     # 回應處理
│       │   └── utils/
│       │       ├── useAuth.ts         # 認證邏輯
│       │       ├── useApi.ts          # API 請求
│       │       └── useToast.ts        # 通知提示
│       │
│       ├── layouts/                      # 佈局組件
│       │   ├── default.vue            # 預設佈局
│       │   ├── builder.vue            # 建構器佈局
│       │   ├── response.vue           # 回應頁佈局
│       │   └── auth.vue               # 認證頁佈局
│       │
│       ├── middleware/                   # 中間件
│       │   ├── auth.ts                # 認證檢查
│       │   ├── subscription.ts        # 訂閱檢查
│       │   └── survey-access.ts       # 問卷訪問控制
│       │
│       ├── pages/                        # 頁面組件
│       │   ├── index.vue              # 首頁
│       │   ├── auth/
│       │   │   ├── login.vue          # 登入
│       │   │   ├── register.vue       # 註冊
│       │   │   └── forgot-password.vue
│       │   ├── dashboard/
│       │   │   ├── index.vue          # 儀表板
│       │   │   └── surveys.vue        # 問卷列表
│       │   ├── builder/
│       │   │   ├── new.vue            # 新建問卷
│       │   │   └── [id]/
│       │   │       └── edit.vue       # 編輯問卷
│       │   ├── survey/
│       │   │   └── [id]/
│       │   │       ├── index.vue      # 填寫問卷
│       │   │       └── success.vue    # 完成頁面
│       │   ├── analytics/
│       │   │   └── [id].vue           # 數據分析
│       │   └── settings/
│       │       ├── profile.vue        # 個人設定
│       │       └── team.vue           # 團隊設定
│       │
│       ├── plugins/                      # Nuxt 插件
│       │   ├── api.client.ts          # API 客戶端
│       │   ├── auth.client.ts         # 認證初始化
│       │   └── error-handler.ts       # 錯誤處理
│       │
│       ├── public/                       # 公開文件
│       │   ├── favicon.ico
│       │   ├── robots.txt
│       │   └── images/
│       │
│       ├── server/                       # Nitro 後端
│       │   ├── api/                   # API 路由
│       │   │   ├── auth/
│       │   │   │   ├── login.post.ts
│       │   │   │   ├── register.post.ts
│       │   │   │   └── refresh.post.ts
│       │   │   ├── surveys/
│       │   │   │   ├── index.get.ts   # 列表
│       │   │   │   ├── index.post.ts  # 創建
│       │   │   │   └── [id]/
│       │   │   │       ├── index.get.ts
│       │   │   │       ├── index.put.ts
│       │   │   │       └── index.delete.ts
│       │   │   ├── responses/
│       │   │   │   ├── index.post.ts  # 提交回應
│       │   │   │   └── [id].get.ts    # 獲取回應
│       │   │   └── analytics/
│       │   │       └── [id]/
│       │   │           └── stats.get.ts
│       │   │
│       │   ├── middleware/              # 服務器中間件
│       │   │   ├── cors.ts
│       │   │   ├── rate-limit.ts
│       │   │   └── logger.ts
│       │   │
│       │   ├── utils/                   # 服務器工具
│       │   │   ├── auth.ts            # JWT 處理
│       │   │   ├── db.ts              # 資料庫連接
│       │   │   ├── cache.ts           # Redis 快取
│       │   │   └── validation.ts      # 數據驗證
│       │   │
│       │   └── plugins/                 # Nitro 插件
│       │       ├── mongodb.ts         # MongoDB 初始化
│       │       └── redis.ts           # Redis 初始化
│       │
│       ├── stores/                       # Pinia 狀態管理
│       │   ├── auth.ts                # 認證狀態
│       │   ├── user.ts                # 用戶狀態
│       │   ├── survey.ts              # 問卷狀態
│       │   ├── builder.ts             # 建構器狀態
│       │   └── ui.ts                  # UI 狀態
│       │
│       ├── types/                        # 本地類型定義
│       │   └── index.d.ts
│       │
│       ├── utils/                        # 工具函數
│       │   ├── format.ts              # 格式化
│       │   ├── validate.ts            # 驗證
│       │   └── constants.ts           # 常數
│       │
│       ├── .env.example                  # 環境變數範例
│       ├── .gitignore
│       ├── app.vue                       # 根組件
│       ├── error.vue                     # 錯誤頁面
│       ├── nuxt.config.ts               # Nuxt 配置
│       ├── package.json
│       ├── tailwind.config.ts           # Tailwind 配置
│       └── tsconfig.json                # TypeScript 配置
│
├── packages/
│   └── shared/                           # 共享包 (Phase 1)
│       ├── src/
│       │   ├── types/                 # 類型定義
│       │   │   ├── survey.ts         # 問卷類型
│       │   │   ├── question.ts       # 題目類型
│       │   │   ├── response.ts       # 回應類型
│       │   │   ├── user.ts           # 用戶類型
│       │   │   ├── analytics.ts      # 分析類型
│       │   │   └── index.ts          # 統一導出
│       │   │
│       │   ├── constants/             # 共享常數
│       │   │   ├── question-types.ts # 題型定義
│       │   │   ├── themes.ts         # 主題配置
│       │   │   ├── limits.ts         # 系統限制
│       │   │   └── errors.ts         # 錯誤碼
│       │   │
│       │   ├── schemas/               # Zod 驗證模式
│       │   │   ├── survey.schema.ts
│       │   │   ├── question.schema.ts
│       │   │   ├── response.schema.ts
│       │   │   └── user.schema.ts
│       │   │
│       │   ├── utils/                 # 共享工具
│       │   │   ├── validation.ts     # 驗證函數
│       │   │   ├── format.ts         # 格式化
│       │   │   ├── crypto.ts         # 加密工具
│       │   │   └── helpers.ts        # 輔助函數
│       │   │
│       │   └── index.ts               # 主入口
│       │
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── docs/                                  # 文檔
│   ├── README.md                      # 專案說明
│   ├── ARCHITECTURE.md                # 架構文檔
│   ├── API.md                         # API 文檔
│   ├── DEPLOYMENT.md                  # 部署指南
│   └── CONTRIBUTING.md                # 貢獻指南
│
├── scripts/                               # 腳本
│   ├── setup.sh                       # 初始設置
│   ├── dev.sh                         # 開發腳本
│   └── deploy.sh                      # 部署腳本
│
├── .github/                               # GitHub 配置
│   ├── workflows/
│   │   ├── ci.yml                     # CI 流程
│   │   └── deploy.yml                 # 部署流程
│   └── ISSUE_TEMPLATE/
│
├── .husky/                               # Git hooks
│   ├── pre-commit
│   └── pre-push
│
├── .vscode/                              # VS Code 配置
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── package.json                          # 根 package.json
├── pnpm-workspace.yaml                   # PNPM 工作區配置
├── pnpm-lock.yaml                        # 鎖定文件
├── turbo.json                           # Turborepo 配置
├── tsconfig.json                        # 根 TypeScript 配置
├── .eslintrc.js                         # ESLint 配置
├── .prettierrc                          # Prettier 配置
├── .gitignore                           # Git 忽略
├── .env.example                         # 環境變數範例
└── README.md                            # 專案說明
```

### Phase 3-4 新增結構（第5-6個月）

```bash
# 新增 packages
packages/
├── ui/                                   # UI 組件庫 (Phase 2)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.vue
│   │   │   │   ├── Button.stories.ts
│   │   │   │   └── Button.test.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   └── Charts/
│   │   ├── styles/
│   │   │   ├── base.css
│   │   │   └── utilities.css
│   │   └── index.ts
│   ├── package.json
│   └── vite.config.ts
│
└── core/                                 # 核心業務邏輯 (Phase 2)
    ├── src/
    │   ├── survey-engine/
    │   │   ├── builder.ts
    │   │   ├── validator.ts
    │   │   ├── logic-engine.ts
    │   │   └── question-factory.ts
    │   ├── analytics-engine/
    │   │   ├── calculator.ts
    │   │   ├── aggregator.ts
    │   │   └── reporter.ts
    │   └── collaboration/
    │       ├── crdt.ts
    │       └── sync-manager.ts
    └── package.json

# 新增 admin 應用
apps/
└── admin/                                # 管理後台 (Phase 3)
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── stores/
    ├── nuxt.config.ts
    └── package.json
```

### Phase 5-8 完整結構（第7-8個月）

```bash
# 新增 services
services/
└── admin-api/                           # Go 後端服務 (Phase 6+)
    ├── cmd/
    │   └── server/
    │       └── main.go
    ├── internal/
    │   ├── handlers/
    │   ├── services/
    │   ├── models/
    │   └── middleware/
    ├── pkg/
    │   ├── database/
    │   └── utils/
    ├── go.mod
    └── go.sum

# admin 遷移到 Vite
apps/
└── admin/                                # Vite + Vue3 (Phase 7)
    ├── src/
    │   ├── api/
    │   ├── views/
    │   ├── components/
    │   └── router/
    ├── vite.config.ts
    └── package.json
```

---

## 📋 配置文件詳細說明

### 根目錄配置

#### `package.json` (root)
```json
{
  "name": "survey-builder",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "preview": "turbo run preview",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,vue,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,vue,js,jsx,json,md}\"",
    "prepare": "husky install",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-vue": "^9.20.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0",
    "prettier": "^3.2.0",
    "turbo": "^1.11.0",
    "typescript": "^5.3.0",
    "vitest": "^1.2.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

#### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

#### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": [
    "NODE_ENV",
    "NUXT_PUBLIC_API_BASE",
    "VITE_API_BASE_URL"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        ".nuxt/**",
        ".output/**",
        "dist/**",
        ".next/**"
      ],
      "env": [
        "NODE_ENV",
        "NUXT_PUBLIC_*",
        "VITE_*"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": [
        "NODE_ENV",
        "NUXT_PUBLIC_*",
        "VITE_*"
      ]
    },
    "preview": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "outputs": [],
      "cache": false
    },
    "lint:fix": {
      "outputs": [],
      "cache": false
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": false
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": false
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": [],
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### `tsconfig.json` (root)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "inlineSources": false,
    "preserveWatchOutput": true,
    "paths": {
      "@survey/shared": ["./packages/shared/src"],
      "@survey/shared/*": ["./packages/shared/src/*"],
      "@survey/ui": ["./packages/ui/src"],
      "@survey/ui/*": ["./packages/ui/src/*"],
      "@survey/core": ["./packages/core/src"],
      "@survey/core/*": ["./packages/core/src/*"]
    }
  },
  "exclude": ["node_modules", "dist", ".nuxt", ".output"]
}
```

### 應用配置

#### `apps/web/nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxt/image',
    '@nuxtjs/google-fonts'
  ],

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Noto Sans TC': [400, 500, 700]
    }
  },

  runtimeConfig: {
    // 私有配置（僅服務端）
    mongodbUri: '',
    redisUrl: '',
    jwtSecret: '',
    openaiApiKey: '',
    
    // 公開配置
    public: {
      apiBase: '/api',
      appName: 'SmartSurvey Pro',
      appUrl: 'http://localhost:3000'
    }
  },

  alias: {
    '@survey/shared': '../../packages/shared/src'
  },

  build: {
    transpile: ['@survey/shared']
  },

  nitro: {
    preset: 'node-server',
    storage: {
      redis: {
        driver: 'redis'
      }
    }
  },

  typescript: {
    strict: true,
    shim: false
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  }
})
```

#### `apps/web/package.json`
```json
{
  "name": "@survey/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "nuxt typecheck",
    "test": "vitest",
    "clean": "rm -rf .nuxt .output node_modules"
  },
  "dependencies": {
    "@pinia/nuxt": "^0.5.0",
    "@survey/shared": "workspace:*",
    "@vueuse/nuxt": "^10.7.0",
    "chart.js": "^4.4.0",
    "mongodb": "^6.3.0",
    "nuxt": "^3.9.0",
    "vue": "^3.4.0",
    "vue-chartjs": "^5.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.10.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 共享包配置

#### `packages/shared/package.json`
```json
{
  "name": "@survey/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./constants": "./src/constants/index.ts",
    "./schemas": "./src/schemas/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint \"src/**/*.ts\"",
    "test": "vitest"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.2.0"
  }
}
```

---

## 🔧 開發工具配置

### ESLint 配置 (`.eslintrc.js`)
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }]
  },
  ignorePatterns: [
    'dist',
    '.nuxt',
    '.output',
    'node_modules'
  ]
}
```

### Prettier 配置 (`.prettierrc`)
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./apps/web/tailwind.config.ts"
}
```

### VS Code 配置 (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 🚀 開發指南

### 初始化專案
```bash
# 克隆專案
git clone <repository-url>
cd survey-builder

# 安裝 pnpm (如果尚未安裝)
npm install -g pnpm@8

# 安裝依賴
pnpm install

# 設置環境變數
cp apps/web/.env.example apps/web/.env.local

# 啟動開發服務器
pnpm dev
```

### 常用命令
```bash
# 開發
pnpm dev                    # 啟動所有應用
pnpm dev --filter web       # 只啟動 web 應用
pnpm dev --filter admin     # 只啟動 admin 應用

# 構建
pnpm build                  # 構建所有應用
pnpm build --filter web     # 只構建 web 應用

# 測試
pnpm test                   # 運行所有測試
pnpm test:e2e              # 運行 E2E 測試

# 代碼檢查
pnpm lint                   # 檢查代碼規範
pnpm lint:fix              # 自動修復問題
pnpm type-check            # TypeScript 類型檢查
pnpm format                # 格式化代碼

# 清理
pnpm clean                  # 清理構建產物和 node_modules
```

### 創建新包
```bash
# 在 packages 目錄創建新包
mkdir packages/new-package
cd packages/new-package

# 初始化 package.json
pnpm init

# 添加到工作區
# package.json 中設置 name 為 @survey/new-package
```

### Git 工作流程
```bash
# 功能分支
git checkout -b feature/drag-drop

# 提交前會自動運行 lint 和 format (通過 husky)
git add .
git commit -m "feat: add drag and drop functionality"

# 推送並創建 PR
git push origin feature/drag-drop
```

---

## 📝 命名規範

### 文件命名
- **組件**：PascalCase (e.g., `DragDropCanvas.vue`)
- **組合式函數**：camelCase with 'use' prefix (e.g., `useDragDrop.ts`)
- **工具函數**：camelCase (e.g., `formatDate.ts`)
- **類型定義**：PascalCase (e.g., `Survey.ts`)
- **常數**：UPPER_SNAKE_CASE in file, camelCase filename
- **API 路由**：kebab-case (e.g., `survey-response.post.ts`)

### 代碼命名
- **變數/函數**：camelCase
- **常數**：UPPER_SNAKE_CASE
- **類型/介面**：PascalCase
- **枚舉**：PascalCase (值用 UPPER_SNAKE_CASE)

### 分支命名
- `feature/` - 新功能
- `fix/` - 錯誤修復
- `refactor/` - 重構
- `docs/` - 文檔更新
- `test/` - 測試相關
- `chore/` - 雜項任務

---

## 📊 依賴管理策略

### 依賴安裝原則
1. **共享依賴**放在根目錄（開發工具、TypeScript、ESLint 等）
2. **運行時依賴**放在各自的包/應用中
3. **類型定義**優先放在 `@survey/shared`
4. **UI 相關**依賴放在對應的應用或 UI 包中

### 版本管理
- 使用 `workspace:*` 引用內部包
- 主要依賴使用精確版本
- 開發依賴可以使用範圍版本
- 定期更新依賴（每月一次）

---

## 🔐 環境變數管理

### 環境變數文件
```bash
apps/web/
├── .env.example        # 範例文件（提交到 Git）
├── .env.local         # 本地開發（不提交）
├── .env.production    # 生產環境（不提交）
└── .env.test          # 測試環境（不提交）
```

### 環境變數命名
- `NUXT_` 前綴：Nuxt 自動識別
- `NUXT_PUBLIC_` 前綴：客戶端可訪問
- `VITE_` 前綴：Vite 應用使用
- 私密變數：無特殊前綴，僅服務端可訪問

---

## 🚦 品質保證

### 代碼審查清單
- [ ] 符合命名規範
- [ ] 有適當的類型定義
- [ ] 包含必要的錯誤處理
- [ ] 性能考慮（避免不必要的重渲染）
- [ ] 響應式設計
- [ ] 無 console.log
- [ ] 有適當的註釋

### 測試策略
- **單元測試**：關鍵業務邏輯
- **組件測試**：複雜組件交互
- **E2E 測試**：關鍵用戶流程
- **覆蓋率目標**：> 70%

---

## 📚 參考資源

- [Turborepo 文檔](https://turbo.build/repo/docs)
- [PNPM 文檔](https://pnpm.io/)
- [Nuxt 3 文檔](https://nuxt.com/)
- [Vue 3 文檔](https://vuejs.org/)
- [TypeScript 文檔](https://www.typescriptlang.org/)

---

*本文檔將隨專案發展持續更新*