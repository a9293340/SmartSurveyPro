# SmartSurvey Pro - Claude 開發指南 🤖

> 📅 最後更新：2025-01-13
> 🎯 用途：Claude AI 助手的專案理解與開發協作指南
> 🌐 對話語言：中文為主，技術術語使用英文

---

## 🎯 專案概述

**SmartSurvey Pro** 是一個企業級智能問卷建構平台，核心競爭力在於：
- 業界唯一的**自由畫布設計**（Free Canvas Design）
- **AI 深度整合**貫穿問卷全生命週期
- 完整的**企業級協作**功能
- 超越簡單統計的**深度分析洞察**

### 當前狀態
- **階段**：Phase 1 - MVP Development
- **開始日期**：2025-01-12
- **目標**：2個月內完成 MVP 基礎功能

---

## ⚠️ 重要開發準則

### 1. 協作模式：教學導向開發（Learning-Driven Development）

**核心原則**：這是一個教學專案，透過實作學習，而非直接完成。

#### 開發流程
```
1. Claude 提供架構設計與起始框架
2. 使用者實作核心邏輯（附 TODO(human) 標記）
3. Claude review 並提供改進建議
4. 使用者修正並完成實作
5. Claude 提供知識點總結
```

#### 任務拆解原則
- **架構先行**：Claude 建立檔案結構和介面定義
- **核心留白**：關鍵業務邏輯標記 `TODO(human)` 供使用者實作
- **漸進完成**：從簡單到複雜，循序漸進
- **即時反饋**：每個小步驟都要 review 和討論

### 2. 對話語言規範
- **主要語言**：中文
- **技術術語**：保持英文（如 Component、Hook、API 等）
- **註解規範**：程式碼註解使用中文，便於理解
- **文件撰寫**：所有文件以中文為主

### 3. 文件維護原則
- **README 優先**：每個關鍵資料夾都必須有 README.md
- **即時更新**：開發過程中同步更新相關文件
- **結構一致**：所有 README 遵循統一模板
- **版本追蹤**：重要變更需在文件中記錄

### 4. 程式碼規範
- **不要過度設計**：遵循 YAGNI (You Aren't Gonna Need It) 原則
- **註解充足**：關鍵邏輯必須有中文註解
- **類型完整**：TypeScript 類型定義必須完整
- **測試覆蓋**：核心功能需有對應測試

---

## 🏗️ 技術架構

### 核心技術棧
```
前端框架：Nuxt3 + Vue3 + TypeScript
樣式系統：Tailwind CSS + CSS Modules
狀態管理：Pinia
構建工具：Vite + Turborepo
包管理器：PNPM
後端服務：Nitro Server (內建於 Nuxt3)
資料庫：MongoDB Atlas (M5) + Redis Cloud
部署平台：Google Cloud Run
CDN：Cloudflare
```

### Monorepo 結構
```
survey-builder/
├── apps/
│   ├── web/          # Nuxt3 主應用 [Phase 1]
│   └── admin/        # 管理後台 [Phase 3+]
├── packages/
│   ├── shared/       # 共享類型和工具 [Phase 1]
│   ├── ui/          # UI 組件庫 [Phase 2]
│   └── core/        # 核心業務邏輯 [Phase 2]
├── services/         # 微服務 [Phase 4+]
├── docs/            # 專案文件
└── scripts/         # 自動化腳本
```

---

## 📋 專案路線圖

### Phase 1: MVP Foundation (第1-2月) 🚧
重點：建立基礎架構和核心功能
- [ ] 基礎架構設置
- [ ] 用戶認證系統
- [ ] 問卷 CRUD
- [ ] 拖放式編輯器（5種基礎題型）
- [ ] 問卷填寫與回應收集
- [ ] 基礎統計顯示

### Phase 2: Core Features (第3-4月) 📅
重點：完整功能和基礎分析
- [ ] 15+ 種題型支援
- [ ] 邏輯跳轉引擎
- [ ] 資料驗證規則
- [ ] 即時統計圖表
- [ ] 資料匯出功能
- [ ] 主題系統

### Phase 3: Advanced Features (第5-6月) 📅
重點：團隊協作和 AI 功能
- [ ] 團隊管理與權限
- [ ] AI 問卷生成
- [ ] 智慧分析洞察
- [ ] 即時協作編輯
- [ ] 訂閱付費系統

---

## 💡 開發指引

### 檔案命名規範
```typescript
// 組件：PascalCase
components/SurveyBuilder.vue
components/QuestionCard.vue

// 組合式函數：use 前綴 + camelCase
composables/useDragDrop.ts
composables/useSurveyData.ts

// 工具函數：camelCase
utils/formatDate.ts
utils/validateEmail.ts

// 類型定義：PascalCase
types/Survey.ts
types/Question.ts

// API 路由：kebab-case
server/api/surveys.get.ts
server/api/survey-response.post.ts
```

### 目錄職責說明

#### `/apps/web` - 主應用
- **pages/**: 路由頁面，對應 URL 結構
- **components/**: Vue 組件，按功能模組分類
- **composables/**: 組合式函數，可重用邏輯
- **server/**: Nitro 後端 API 和中間件
- **stores/**: Pinia 狀態管理
- **utils/**: 工具函數

#### `/packages/shared` - 共享包
- **types/**: TypeScript 類型定義
- **schemas/**: Zod 驗證模式
- **constants/**: 共用常數
- **utils/**: 跨專案工具函數
- **db/**: 資料庫連接和操作

#### `/packages/config` - 配置管理 🆕
- **tsconfig/**: TypeScript 配置模板
- **tsup/**: 建構配置模板
- **eslint/**: ESLint 配置模板（未來）

---

## 🔧 配置管理規範

### 配置共享原則

**所有專案的配置檔案應優先使用共享配置：**

1. **查看 packages/config**: 先檢查是否有適合的配置模板
2. **繼承基礎配置**: 使用 `extends` 繼承標準配置
3. **最小化覆蓋**: 只覆蓋必要的專案特定設定
4. **統一維護**: 通用配置修改應在 config 套件中進行

### TypeScript 配置使用

```json
// 套件專用 (packages/*)
{
  "extends": "../config/tsconfig/package.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"]
}

// Web 應用專用 (apps/web)
{
  "extends": "../../packages/config/tsconfig/web.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { /* 專案特定路徑 */ }
  }
}
```

### 建構配置使用

```ts
// 套件建構 (packages/*)
import { packageConfig } from '../config/tsup/package.js'
export default packageConfig

// 自訂建構
import { createBaseConfig } from '../config/tsup/base.js'
export default createBaseConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  dts: true
})
```

### 新增共享配置

1. **評估通用性**: 確認配置會被多個專案使用
2. **建立模板**: 在 `packages/config` 中新增配置
3. **更新文件**: 更新 config/README.md 使用說明
4. **遷移現有**: 將現有專案遷移到新配置

---

## 🔑 關鍵業務邏輯

### 訂閱方案限制
| 方案 | 問卷數 | 月回應數 | AI額度 | 價格 |
|-----|--------|----------|--------|------|
| Free | 3 | 100 | 0 | $0 |
| Pro | 無限 | 10,000 | 100 | $29 |
| Team | 無限 | 50,000 | 500 | $99 |
| Enterprise | 無限 | 無限 | 5000 | 客製 |

### 問卷狀態機
```
draft → published → closed → archived
```

### 權限矩陣
- **Owner**: 完全控制權
- **Admin**: 管理權限（不含帳單）
- **Editor**: 編輯權限
- **Viewer**: 唯讀權限

---

## 📚 重要文件索引

### 🎯 文件導航中心
使用 [`/docs/README.md`](./docs/README.md) 作為文件索引中心，快速找到所需文件：
- **專案總覽**：Claude 開發指南、專案說明、路線圖
- **業務邏輯**：產品規格、業務規則、API 規格
- **技術架構**：系統設計、資料庫結構、技術選型
- **開發管理**：任務追蹤、實作標準、用戶故事

### 📖 文件查找方式
```
# Claude 快速查找文件的建議模式：
"查看 docs/README.md 找到 [主題] 相關文件"
"從文件索引中找到 [功能] 的技術規格"
"參考業務邏輯文檔了解 [規則] 的具體實作"
```

### 🔗 重要文件直達連結

#### 業務邏輯
- [業務規則詳細](./smartsurvey-business-logic.md)
- [API 規格書](./smartsurvey-api-reference.md)
- [資料庫結構](./docs/smartsurvey-db-structure.md)

#### 技術文件
- [系統架構](./docs/system-architecture.md)
- [Monorepo 架構](./docs/monorepo-architecture.md)
- [技術棧指南](./docs/tech-stack-guide.md)
- [設計系統](./docs/design-system.md)

#### 開發管理
- [開發路線圖](./smartsurvey-roadmap.md)
- [任務追蹤](./docs/tasks/)

---

## 🚀 快速開始

### 環境需求
- Node.js >= 18.0.0
- PNPM >= 8.15.0
- MongoDB Atlas 帳號
- Redis Cloud 帳號（可選）

### 初始化步驟
```bash
# 1. 安裝 pnpm
npm install -g pnpm@8

# 2. 安裝依賴
pnpm install

# 3. 設置環境變數
cp .env.example .env.local

# 4. 啟動開發伺服器
pnpm dev
```

---

## 🎯 當前任務焦點

### 立即任務（Today）
1. 完成 Monorepo 初始化設置
2. 建立基礎資料夾結構
3. 配置 Turborepo 和 PNPM workspace

### 本週目標（This Week）
- 完成基礎架構設置（Task 1）
- MongoDB 和 Redis 連接設置
- 建立開發環境

### 下週計劃（Next Week）
- 開始用戶系統開發
- User Model 設計
- 認證 API 實作

---

## 💬 與 Claude 協作提示

### 有效的請求範例
```
"幫我設計 Survey Model 的 TypeScript interface，
並在關鍵欄位加上中文註解"

"為拖放功能建立基礎框架，
核心邏輯部分標記 TODO(human) 讓我實作"

"Review 我寫的認證邏輯，
提供改進建議和最佳實踐"
```

### 協作流程範例
1. **請求架構**：「幫我設計問卷編輯器的組件結構」
2. **取得框架**：Claude 提供檔案結構和介面定義
3. **實作核心**：使用者完成 TODO(human) 部分
4. **請求審查**：「請 review 我的實作並提供建議」
5. **知識總結**：Claude 提供學習重點和改進方向

---

## 🔄 版控工作流程

### 階段完成提交規範
每個任務階段完成後，必須進行版控提交：

1. **驗證功能**：確保新功能可正常運作
2. **分批提交**：依照功能模組合理分批 commit
3. **有意義的訊息**：commit message 要清楚描述變更內容
4. **不標註工具**：不要在 commit message 中提及是 Claude 生成

### Commit Message 格式
```bash
# 功能新增
feat: 建立 Monorepo 基礎架構
feat: 配置 Turborepo 建構管道
feat: 初始化共享套件結構

# 配置變更
config: 設定 TypeScript 和 PNPM workspace
config: 建立開發環境配置檔案

# 文件更新
docs: 更新任務進度和架構說明
docs: 新增開發工作流程指引
```

### 階段提交檢查清單
- [ ] 功能驗證完成（build、lint、test 通過）
- [ ] 文件同步更新（進度、README、變更日誌）
- [ ] 依功能模組分批提交
- [ ] Commit message 具體且有意義
- [ ] 不包含 Claude 或 AI 工具標註

---

## 📝 注意事項

1. **漸進式開發**：從 MVP 開始，避免過度工程
2. **文件同步**：程式碼變更必須同步更新文件
3. **版控紀律**：每階段完成必須適當 commit，保持清晰的開發歷史
3. **中文優先**：溝通和註解使用中文
4. **教學導向**：重視學習過程勝於完成速度
5. **持續優化**：定期重構和改進程式碼品質

---

## 🔄 文件更新記錄

- 2025-01-13：初始版本建立，加入教學導向開發原則
- [待更新]：根據開發進度持續更新

---

*此文件是 Claude 理解和協助開發 SmartSurvey Pro 的核心指南*
*請在每次對話開始時參考此文件以保持上下文一致性*