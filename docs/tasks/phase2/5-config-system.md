# 5. 動態配置系統

## 📊 概覽

- **階段**: Phase 2
- **優先級**: 🟡 Medium
- **狀態**: ⬜ 未開始
- **預估工時**: 16h
- **實際工時**: -
- **進度**: 0% ░░░░░░░░░░░░░░░░░░░░
- **開始日期**: -
- **完成日期**: -

## 🔗 依賴關係

- **前置任務**: 1.基礎架構設置, 2.用戶認證系統
- **阻塞任務**: 訂閱系統、功能開關管理
- **相關文件**:
  - [系統架構](../../system-architecture.md)
  - [配置管理策略](../../config-management.md)

## 📚 學習目標

- [ ] 理解配置外部化的最佳實踐
- [ ] 掌握 Google Cloud Storage 檔案操作
- [ ] 學會配置熱更新和降級機制
- [ ] 理解配置分層和安全性考量
- [ ] 掌握功能開關 (Feature Flag) 設計模式

## 🏗️ 任務分解

### 5.1 配置分層架構設計 [4h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.1.1 識別可外部化配置

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 分析現有配置，區分系統核心配置和業務參數配置

**配置分類**:

```typescript
// ❌ 保留在代碼中 - 系統核心
export const SYSTEM_CONFIG = {
  PERMISSIONS: { ... },           // 與代碼邏輯強綁定
  DEFAULT_ROLES: { ... },         // 安全關鍵
  ERROR_CODES: { ... },           // 程式邏輯依賴
  REGEX_PATTERNS: { ... }         // 驗證邏輯
}

// ✅ 外部化到 GCS - 業務參數
export const BUSINESS_CONFIG = {
  SUBSCRIPTION_LIMITS: { ... },   // 經常調整定價
  FEATURE_FLAGS: { ... },         // A/B 測試開關
  UI_SETTINGS: { ... },           // 界面參數
  NOTIFICATION_TEMPLATES: { ... }, // 郵件模板
  TIME_CONSTANTS: { ... }         // 過期時間設定
}
```

**驗收標準**:

- [ ] 完成配置分類清單
- [ ] 建立配置外部化評估標準
- [ ] 設計配置檔案結構

#### 5.1.2 GCS 配置存儲結構設計

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 設計 GCS 中的配置檔案組織結構

**目錄結構**:

```
gs://smartsurvey-config/
├── environments/
│   ├── production/
│   │   ├── business-config.json
│   │   ├── feature-flags.json
│   │   ├── subscription-limits.json
│   │   └── notification-templates.json
│   ├── staging/
│   │   └── ...
│   └── development/
│       └── ...
├── versions/
│   ├── v1.0.0/
│   └── v1.1.0/
└── schemas/
    ├── business-config.schema.json
    └── feature-flags.schema.json
```

**驗收標準**:

- [ ] GCS Bucket 權限配置
- [ ] 配置檔案 JSON Schema 設計
- [ ] 版本控制策略定義

### 5.2 配置載入機制實作 [6h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.2.1 GCS 配置載入器

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 實作從 GCS 載入配置的核心邏輯

**TODO(human)**:

```typescript
// 在 packages/shared/src/config/loader.ts
export class ConfigLoader {
  async loadFromGCS(environment: string): Promise<BusinessConfig> {
    // TODO(human): 實作以下邏輯
    // 1. 從 GCS 下載配置檔案
    // 2. JSON 解析和驗證
    // 3. Schema 驗證
    // 4. 回傳配置物件
  }

  async loadWithFallback(): Promise<BusinessConfig> {
    // TODO(human): 實作降級機制
    // 1. 嘗試從 GCS 載入
    // 2. 失敗時使用本地預設值
    // 3. 記錄載入狀態
  }
}
```

**驗收標準**:

- [ ] GCS 客戶端初始化
- [ ] 配置檔案下載和解析
- [ ] 錯誤處理和降級機制

#### 5.2.2 配置驗證和合併

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作配置驗證和與系統配置合併

#### 5.2.3 應用啟動整合

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 整合配置載入到 Nuxt3 應用啟動流程

### 5.3 功能開關系統 [4h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.3.1 Feature Flag 介面設計

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 設計功能開關的類型定義和使用介面

```typescript
// Feature Flag 設計
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number; // 灰度發布百分比
  userGroups?: string[]; // 特定用戶群組
  startDate?: Date; // 開始時間
  endDate?: Date; // 結束時間
}

// 使用介面
export class FeatureFlagService {
  isEnabled(flagKey: string, context?: FeatureFlagContext): boolean;
  getFeatureConfig<T>(flagKey: string): T | undefined;
}
```

#### 5.3.2 條件性功能啟用

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作基於用戶、群組、時間的條件性功能啟用

### 5.4 配置熱更新機制 [2h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.4.1 配置變更檢測

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 實作定期檢查 GCS 配置變更的機制

#### 5.4.2 運行時配置更新

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作不重啟應用的配置熱更新

## 🧪 測試計劃

### 單元測試

- [ ] 配置載入器測試
- [ ] 配置驗證測試
- [ ] Feature Flag 邏輯測試

### 整合測試

- [ ] GCS 連接測試
- [ ] 配置降級機制測試
- [ ] 熱更新機制測試

### 壓力測試

- [ ] 配置載入性能測試
- [ ] 並發配置更新測試

## 📝 配置檔案範例

### business-config.json

```json
{
  "subscriptionLimits": {
    "free": {
      "maxMembers": 5,
      "maxSurveys": 3,
      "maxResponses": 100,
      "maxStorage": 50
    },
    "pro": {
      "maxMembers": 20,
      "maxSurveys": -1,
      "maxResponses": 10000,
      "maxStorage": 1000
    }
  },
  "timeConstants": {
    "jwtAccessTokenExpires": 3600,
    "jwtRefreshTokenExpires": 604800,
    "emailVerificationExpires": 86400
  },
  "fileSettings": {
    "maxFileSize": 10,
    "supportedImageFormats": ["jpg", "jpeg", "png", "gif", "webp"],
    "maxAvatarSize": 1024
  }
}
```

### feature-flags.json

```json
{
  "flags": {
    "enableAdvancedAnalytics": {
      "enabled": true,
      "description": "啟用進階分析功能",
      "rolloutPercentage": 50
    },
    "enableAiSuggestions": {
      "enabled": false,
      "description": "AI 問卷建議功能",
      "userGroups": ["beta-testers"],
      "startDate": "2025-02-01T00:00:00Z"
    },
    "newDashboardUI": {
      "enabled": true,
      "description": "新版控制台界面",
      "rolloutPercentage": 100
    }
  }
}
```

## 💡 實作要點

### 安全考量

1. **權限控制**: GCS Bucket 權限最小化
2. **配置驗證**: JSON Schema 驗證防止錯誤配置
3. **降級機制**: 載入失敗時使用安全預設值
4. **審計日誌**: 記錄所有配置變更

### 效能考量

1. **快取機制**: 本地快取減少 GCS 請求
2. **批次載入**: 一次載入所有相關配置
3. **增量更新**: 只更新變更的配置項目

### 部署優勢

```bash
# 傳統方式：修改代碼 → CI/CD → 部署
git commit && git push  # 觸發完整 pipeline

# 新方式：只更新配置
gsutil cp new-config.json gs://smartsurvey-config/production/
kubectl rollout restart deployment/smartsurvey  # 只重啟拉取新配置
```

## 🔄 狀態變更歷史

- 2025-01-16: 任務建立，狀態設為未開始

## 💡 給 Claude 的上下文

**任務位置**: Phase 2 > 動態配置系統 **技術要點**: GCS + 配置分層 + Feature
Flag + 熱更新 **安全要求**: 配置驗證 + 降級機制 + 權限控制 **相關檔案**:

- `packages/shared/src/config/`
- `packages/shared/src/constants/`
- `apps/web/nuxt.config.ts`
