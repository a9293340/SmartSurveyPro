# 環境變數管理系統 - 設計文件

> 📅 文件版本：v1.0 📝 最後更新：2025-01-17 👥 設計團隊：Claude + Human
> 🎯 狀態：設計階段

## 概述

本文件定義 SmartSurvey Pro 專案的環境變數管理策略，解決 Nuxt3 + Cloud Run + GCP
Secret Manager 整合的關鍵問題，確保機敏資料安全性與配置管理的一致性。

## 核心問題

1. **Runtime vs Build-time**：Nuxt runtimeConfig 在 build 時固定，但 Cloud
   Run 的 secrets 在 runtime 注入
2. **機敏資料管理**：需要區分機敏資料（secrets）與一般配置（configs）
3. **開發與生產環境**：本地開發使用 `.env`，生產環境使用 Secret Manager
4. **類型安全**：確保 TypeScript 類型定義與實際環境變數一致

## 系統架構

### 環境變數分層架構

```
┌─────────────────────────────────────────┐
│         應用層 (Application)            │
├─────────────────────────────────────────┤
│     環境變數管理器 (EnvManager)         │
├─────────┬───────────────┬───────────────┤
│  Secret │  RuntimeConfig │   Process.env │
│ Manager │   (Nuxt)      │   (Node.js)   │
└─────────┴───────────────┴───────────────┘
```

### 資料流向

```mermaid
graph TD
    A[GCP Secret Manager] -->|Production| B[Cloud Run Env]
    C[.env.local] -->|Development| D[Process.env]
    B --> D
    D --> E[EnvManager]
    F[nuxt.config.ts] --> G[useRuntimeConfig]
    G --> E
    E --> H[Application Code]
```

## 環境變數分類規則

### 🔴 機敏資料 (Secrets) - 使用 `process.env`

**定義**：任何洩漏會造成安全風險的資料

**管理方式**：

- 開發環境：`.env.local`（不進版控）
- 生產環境：GCP Secret Manager
- 存取方式：`process.env.XXX` 或 `EnvManager`

**清單**：

```typescript
// 認證相關
JWT_SECRET; // JWT 簽名密鑰
JWT_REFRESH_SECRET; // Refresh Token 密鑰
SESSION_SECRET; // Session 加密密鑰

// 資料庫
MONGODB_URI; // MongoDB 連接字串
MONGODB_PASSWORD; // MongoDB 密碼
REDIS_PASSWORD; // Redis 密碼

// 第三方服務
STRIPE_SECRET_KEY; // Stripe 私鑰
SENDGRID_API_KEY; // SendGrid API 密鑰
OPENAI_API_KEY; // OpenAI API 密鑰
GOOGLE_CLIENT_SECRET; // Google OAuth 密鑰

// 加密相關
ENCRYPTION_KEY; // 資料加密密鑰
SIGNING_KEY; // 簽名密鑰
```

### 🟡 配置資料 (Configs) - 使用 `useRuntimeConfig`

**定義**：非機敏的配置資料，可公開或半公開

**管理方式**：

- 定義在 `nuxt.config.ts`
- 透過 `NUXT_` 前綴環境變數覆蓋
- 存取方式：`useRuntimeConfig()`

**清單**：

```typescript
// 伺服器端配置 (runtimeConfig)
APP_ENV; // development/staging/production
LOG_LEVEL; // debug/info/warn/error
RATE_LIMIT_MAX; // API 速率限制
CACHE_TTL; // 快取過期時間
BATCH_SIZE; // 批次處理大小

// 客戶端配置 (runtimeConfig.public)
NUXT_PUBLIC_API_BASE; // API 基礎路徑
NUXT_PUBLIC_APP_NAME; // 應用名稱
NUXT_PUBLIC_VERSION; // 應用版本
NUXT_PUBLIC_GA_ID; // Google Analytics ID
NUXT_PUBLIC_SENTRY_DSN; // Sentry DSN（公開部分）
```

## 實作策略

### 1. 環境變數管理器 (EnvManager)

```typescript
// server/utils/env-manager.ts
export class EnvManager {
  private static instance: EnvManager;
  private secrets: Map<string, string> = new Map();
  private validated = false;

  static getInstance(): EnvManager {
    if (!this.instance) {
      this.instance = new EnvManager();
    }
    return this.instance;
  }

  // 取得機敏資料
  getSecret(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required secret: ${key}`);
    }
    return value;
  }

  // 取得配置資料
  getConfig(key: string): string {
    const config = useRuntimeConfig();
    return config[key] || config.public[key] || '';
  }

  // 啟動時驗證
  validateRequired(): void {
    if (this.validated) return;

    const requiredSecrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGODB_URI'];

    for (const key of requiredSecrets) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    this.validated = true;
  }
}

export const env = EnvManager.getInstance();
```

### 2. Nuxt 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有配置 - 僅伺服器端，支援 runtime 覆蓋
    appEnv: process.env.APP_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),

    // 公開配置 - 客戶端可存取
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'SmartSurvey Pro',
      version: process.env.NUXT_PUBLIC_VERSION || '1.0.0',
    },
  },
});
```

### 3. 環境檔案結構

```bash
# .env.example (進版控，作為範本)
JWT_SECRET=your-secret-here
MONGODB_URI=mongodb://localhost:27017/smartsurvey
NUXT_PUBLIC_API_BASE=/api

# .env.local (不進版控，本地開發)
JWT_SECRET=dev-secret-key-do-not-use-in-production
MONGODB_URI=mongodb://localhost:27017/smartsurvey-dev
NUXT_PUBLIC_API_BASE=http://localhost:3000/api

# .env.production (不進版控，僅作參考)
# 生產環境使用 Secret Manager，不使用檔案
```

### 4. Docker 部署策略

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
# Build 階段不需要 secrets
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output .output
# Runtime 階段由 Cloud Run 注入環境變數
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```yaml
# cloud-run-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: smartsurvey-pro
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
    spec:
      containers:
        - image: gcr.io/PROJECT_ID/smartsurvey-pro
          env:
            # 配置類環境變數
            - name: APP_ENV
              value: production
            - name: NUXT_PUBLIC_API_BASE
              value: https://api.smartsurvey.pro
          # 機敏資料從 Secret Manager 注入
          - name: JWT_SECRET
            valueFrom:
              secretKeyRef:
                name: jwt-secret
                key: latest
          - name: MONGODB_URI
            valueFrom:
              secretKeyRef:
                name: mongodb-uri
                key: latest
```

## 使用指南

### 開發者使用流程

#### 1. 判斷環境變數類型

```mermaid
graph TD
    A[需要新增環境變數] --> B{是否為機敏資料?}
    B -->|是| C[加入 Secrets 清單]
    B -->|否| D{是否需要客戶端存取?}
    C --> E[使用 process.env 或 env.getSecret]
    D -->|是| F[加入 runtimeConfig.public]
    D -->|否| G[加入 runtimeConfig]
    F --> H[使用 useRuntimeConfig]
    G --> H
```

#### 2. 實際使用範例

```typescript
// ❌ 錯誤：機敏資料使用 runtimeConfig
const config = useRuntimeConfig();
const jwtSecret = config.jwtSecret; // 錯誤！

// ✅ 正確：機敏資料使用 process.env
import { env } from '~/server/utils/env-manager';
const jwtSecret = env.getSecret('JWT_SECRET');

// ✅ 正確：配置資料使用 runtimeConfig
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
```

### 新增環境變數 SOP

1. **評估資料類型**
   - 機敏？→ Secrets 類別
   - 公開？→ Configs 類別

2. **更新文件**
   - 更新本設計文件的環境變數清單
   - 更新 `.env.example`

3. **實作存取**
   - Secrets：透過 `env.getSecret()`
   - Configs：透過 `useRuntimeConfig()`

4. **設定 Secret Manager**（生產環境）

   ```bash
   gcloud secrets create jwt-secret --data-file=-
   gcloud secrets add-iam-policy-binding jwt-secret \
     --member="serviceAccount:SERVICE_ACCOUNT" \
     --role="roles/secretmanager.secretAccessor"
   ```

5. **更新 Cloud Run 配置**
   - 添加環境變數映射
   - 部署新版本

## 測試策略

### 單元測試

```typescript
// test/server/utils/env-manager.test.ts
describe('EnvManager', () => {
  beforeEach(() => {
    process.env.TEST_SECRET = 'test-value';
  });

  it('should get secret from process.env', () => {
    const value = env.getSecret('TEST_SECRET');
    expect(value).toBe('test-value');
  });

  it('should throw on missing secret', () => {
    expect(() => env.getSecret('MISSING')).toThrow();
  });
});
```

### 整合測試

```typescript
// test/integration/auth.test.ts
describe('Authentication with env vars', () => {
  it('should use JWT_SECRET for signing', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = generateAccessToken({ userId: '123' });
    expect(token).toBeDefined();
  });
});
```

## 安全性考量

1. **Secrets 永不進版控**
   - `.gitignore` 包含所有 `.env*` 檔案（除了 `.env.example`）
   - 使用 git-secrets 掃描工具

2. **最小權限原則**
   - Cloud Run Service Account 只有必要的 Secret Manager 權限
   - 每個 secret 獨立管理權限

3. **輪替機制**
   - JWT_SECRET 每季輪替
   - API Keys 定期更新
   - 建立輪替 SOP

4. **審計追蹤**
   - Cloud Audit Logs 記錄 secret 存取
   - 監控異常存取模式

## 故障排除

### 常見問題

**Q1: Cloud Run 部署後環境變數讀不到？**

- 檢查 Secret Manager 權限設定
- 確認 Service Account 有存取權限
- 驗證環境變數名稱是否正確

**Q2: useRuntimeConfig 在 build 時就固定了？**

- 使用 `NUXT_` 前綴覆蓋
- 確保是在 server 端使用（非 public）

**Q3: TypeScript 類型錯誤？**

- 更新 `env.d.ts` 類型定義
- 使用 `env.getSecret()` 確保類型安全

## 遷移計劃

### Phase 1（當前）

- [x] 建立環境變數分類
- [x] 實作 EnvManager
- [ ] 遷移現有環境變數

### Phase 2（第2月）

- [ ] 整合 Secret Manager
- [ ] 建立 CI/CD 管線
- [ ] 實作 secret 輪替

### Phase 3（第3月）

- [ ] 監控與告警
- [ ] 自動化 secret 管理
- [ ] 災難復原計劃

## 參考資料

- [Nuxt Runtime Config](https://nuxt.com/docs/api/configuration/nuxt-config#runtimeconfig)
- [GCP Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Cloud Run Environment Variables](https://cloud.google.com/run/docs/configuring/environment-variables)
- [12 Factor App - Config](https://12factor.net/config)

---

_此文件是環境變數管理的核心設計規範，所有環境變數相關的實作都必須遵循此文件_
