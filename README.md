# SmartSurvey Pro 🚀

> 智慧問卷建構與分析平台 - 讓問卷調查變得簡單而強大
>
> **開發狀態**: 🏗️ MVP Development (Phase 1)  
> **目標上線**: 2025年3月  
> **技術棧**: Nuxt3 + Vue3 + MongoDB + Redis  
> **架構**: Monorepo (Turborepo + PNPM)

---

## 📋 目錄

- [專案概述](#專案概述)
- [核心功能](#核心功能)
- [技術架構](#技術架構)
- [資料庫結構](#資料庫結構)
- [API 端點](#api-端點)
- [專案結構](#專案結構)
- [開發進度](#開發進度)
- [快速開始](#快速開始)
- [部署資訊](#部署資訊)

---

## 專案概述

SmartSurvey
Pro 是一個現代化的問卷建構與分析平台，提供拖放式問卷編輯器、即時資料分析、AI 智慧建議等功能。目標是打造比 Google
Forms 更專業、比 SurveyMonkey 更易用的解決方案。

### 🎯 核心價值

- **直覺操作**: 拖放式編輯器，5分鐘創建專業問卷
- **智慧分析**: 即時統計圖表，AI 洞察建議
- **彈性擴展**: 支援複雜邏輯跳轉、自訂主題
- **團隊協作**: 多人編輯、權限管理（Phase 3+）

### 📊 目標用戶

- 主要：中小企業、教育機構、研究單位
- 次要：個人用戶、非營利組織

---

## 核心功能

### ✅ 已實現功能

- [ ] 基礎架構設置
- [ ] 用戶認證系統
- [ ] 問卷 CRUD 操作
- [ ] 拖放式問卷編輯器

### 🚧 開發中功能 (Phase 1-2)

- [ ] 10+ 種題型支援
- [ ] 問卷預覽與測試
- [ ] 基礎資料統計
- [ ] 回應資料匯出

### 📅 計劃功能 (Phase 3+)

- [ ] 進階邏輯跳轉
- [ ] AI 問卷生成
- [ ] 即時協作編輯
- [ ] 自訂主題系統
- [ ] 進階分析報表
- [ ] API 開放平台

---

## 技術架構

### 🔧 技術棧

| 層級     | 技術             | 版本    | 說明             |
| -------- | ---------------- | ------- | ---------------- |
| **前端** | Nuxt 3           | ^3.9.0  | SSR/SSG 框架     |
|          | Vue 3            | ^3.4.0  | 漸進式框架       |
|          | TypeScript       | ^5.3.0  | 類型安全         |
|          | Tailwind CSS     | ^3.4.0  | 原子化 CSS       |
|          | Pinia            | ^2.1.0  | 狀態管理         |
| **後端** | Nitro            | 內建    | Nuxt3 伺服器引擎 |
|          | MongoDB          | ^6.3.0  | 主資料庫驅動     |
|          | Redis            | ^4.6.0  | 快取客戶端       |
| **工具** | Turborepo        | ^1.11.0 | Monorepo 管理    |
|          | PNPM             | 8.15.0+ | 套件管理         |
|          | Docker           | 24.0+   | 容器化 (選用)    |
| **部署** | Google Cloud Run | -       | 主要部署平台     |

### 🏗️ 系統架構圖

```
┌─────────────────────────────────────┐
│         客戶端 (Browser)            │
├─────────────────────────────────────┤
│          CDN (Cloudflare)           │
├─────────────────────────────────────┤
│      Nuxt3 App (SSR/API)           │
│         ├── Pages                   │
│         ├── API Routes              │
│         └── Nitro Server            │
├─────────────────────────────────────┤
│   Cache Layer      │  Data Layer    │
│    (Redis)         │   (MongoDB)    │
└─────────────────────────────────────┘
```

---

## 資料庫結構

### 📊 Collections 概覽

| Collection  | 用途     | 預估規模 | 索引策略               |
| ----------- | -------- | -------- | ---------------------- |
| `users`     | 用戶資料 | 10萬筆   | email, teams           |
| `surveys`   | 問卷主體 | 100萬筆  | creator, status, slug  |
| `responses` | 回應資料 | 1000萬筆 | surveyId, userId, date |
| `teams`     | 團隊資料 | 1萬筆    | slug, members          |
| `analytics` | 統計快取 | 100萬筆  | surveyId, date         |

### 🔑 Redis 快取結構

```javascript
// Session 管理
session:{sessionId} → user data (TTL: 7d)

// 熱數據快取
survey:{surveyId} → survey data (TTL: 5m)
stats:{surveyId} → statistics (TTL: 1h)

// 即時分析
realtime:{surveyId} → active users (TTL: 10s)

// API 限流
rate:{ip}:{endpoint} → count (TTL: 1m)
```

詳細結構請參考 [資料庫設計文件](./docs/smartsurvey-db-structure.md)

---

## API 端點

### 🔐 認證相關

| Method | Endpoint             | 說明     | 狀態 |
| ------ | -------------------- | -------- | ---- |
| POST   | `/api/auth/register` | 註冊     | 🚧   |
| POST   | `/api/auth/login`    | 登入     | 🚧   |
| POST   | `/api/auth/logout`   | 登出     | 🚧   |
| GET    | `/api/auth/me`       | 當前用戶 | 🚧   |

### 📝 問卷管理

| Method | Endpoint                     | 說明     | 狀態 |
| ------ | ---------------------------- | -------- | ---- |
| GET    | `/api/surveys`               | 問卷列表 | 🚧   |
| POST   | `/api/surveys`               | 創建問卷 | 🚧   |
| GET    | `/api/surveys/:id`           | 問卷詳情 | 🚧   |
| PUT    | `/api/surveys/:id`           | 更新問卷 | 🚧   |
| DELETE | `/api/surveys/:id`           | 刪除問卷 | 🚧   |
| POST   | `/api/surveys/:id/publish`   | 發布問卷 | 📅   |
| POST   | `/api/surveys/:id/duplicate` | 複製問卷 | 📅   |

### 📊 回應與分析

| Method | Endpoint                     | 說明     | 狀態 |
| ------ | ---------------------------- | -------- | ---- |
| POST   | `/api/surveys/:id/responses` | 提交回應 | 🚧   |
| GET    | `/api/surveys/:id/responses` | 回應列表 | 🚧   |
| GET    | `/api/surveys/:id/analytics` | 統計分析 | 📅   |
| GET    | `/api/surveys/:id/export`    | 匯出資料 | 📅   |

**圖例**: ✅ 完成 | 🚧 開發中 | 📅 計劃中

完整 API 文件請參考 [API Reference](./smartsurvey-api-reference.md)

---

## 專案結構

```bash
SmartSurveyPro/
├── apps/                      # 應用程式目錄
│   ├── web/                  # Nuxt3 主應用 [Phase 1]
│   └── admin/                # 管理後台 [Phase 3+]
│
├── packages/                  # 共享套件目錄
│   ├── shared/               # 共享基礎包 [Phase 1]
│   ├── ui/                   # UI 組件庫 [Phase 2]
│   └── core/                 # 核心業務邏輯 [Phase 2]
│
├── services/                  # 微服務目錄 [Phase 4+]
│
├── docs/                      # 技術文件
│   ├── tasks/                # 任務管理
│   └── [各種技術文件]
│
├── scripts/                   # 自動化腳本
│   ├── setup/                # 環境設置
│   ├── dev/                  # 開發輔助
│   ├── build/                # 建構相關
│   └── deploy/               # 部署腳本
│
├── CLAUDE.md                 # Claude AI 開發指南
├── pnpm-workspace.yaml       # PNPM 工作區配置
└── [其他配置文件]
```

詳細架構說明請參考 [Monorepo 架構文件](./docs/monorepo-architecture.md)

---

## 開發進度

### 📅 Phase 1: MVP (第1-2個月)

**目標**: 基礎問卷建構與回應收集

- [x] 專案架構設置
- [ ] 用戶認證系統 `[進行中]`
- [ ] 問卷 CRUD API
- [ ] 拖放式編輯器
- [ ] 5種基礎題型
- [ ] 問卷填寫頁面
- [ ] 基礎統計頁面

### 📅 Phase 2: 核心功能 (第3-4個月)

**目標**: 完整問卷功能與基礎分析

- [ ] 10+ 種題型
- [ ] 邏輯跳轉
- [ ] 問卷主題
- [ ] 資料匯出
- [ ] 進階統計
- [ ] 效能優化

### 📅 Phase 3: 進階功能 (第5-6個月)

**目標**: 團隊協作與 AI 功能

- [ ] 團隊管理
- [ ] 權限控制
- [ ] AI 問卷生成
- [ ] 即時協作
- [ ] 付費方案

[查看完整開發計劃](./smartsurvey-roadmap.md)

---

## 快速開始

### 環境需求

- Node.js 18+
- PNPM 8.15+
- MongoDB 7.0+
- Redis 7.2+

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/yourusername/survey-builder.git
cd survey-builder

# 2. 安裝依賴
pnpm install

# 3. 環境設定
cp .env.example .env
# 編輯 .env 設定 MongoDB 和 Redis 連線

# 4. 啟動開發伺服器
pnpm dev

# 5. 開啟瀏覽器
http://localhost:3000
```

### 常用指令

```bash
pnpm dev          # 開發模式
pnpm build        # 建構專案
pnpm preview      # 預覽生產版本
pnpm lint         # 程式碼檢查
pnpm test         # 執行測試
pnpm type-check   # TypeScript 檢查
```

---

## 部署資訊

### 🚀 部署平台

- **開發環境**: Vercel (自動部署)
- **生產環境**: Google Cloud Platform (Cloud Run)

### 📦 Docker 部署

```bash
# 建構映像
docker build -t survey-builder .

# 執行容器
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e REDIS_URL=your_redis_url \
  survey-builder
```

### 🔧 環境變數

```env
# 應用設定
NODE_ENV=production
BASE_URL=https://survey.example.com

# 資料庫
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

# 認證
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# 第三方服務
OPENAI_API_KEY=sk-... (Phase 3+)
GOOGLE_CLIENT_ID=... (Optional)

# 功能開關
ENABLE_AI_FEATURES=false
ENABLE_TEAM_FEATURES=false
```

---

## 相關文件

### 📚 文件索引中心

- 📋 [文件索引總覽](./docs/README.md) - 所有文件的快速導航

### 📖 核心文件

- 🤖 [Claude 開發指南](./CLAUDE.md) - AI 協作指南
- 📊 [開發路線圖](./smartsurvey-roadmap.md) - 完整開發計劃
- 📖 [API 參考文件](./smartsurvey-api-reference.md)
- 🏗️ [資料庫結構](./docs/smartsurvey-db-structure.md)
- 💼 [業務邏輯規則](./smartsurvey-business-logic.md)

### 🔧 技術文件

- 🏗️ [系統架構](./docs/system-architecture.md)
- 📦 [Monorepo 架構](./docs/monorepo-architecture.md)
- 🎨 [設計系統](./docs/design-system.md)
- 🛠️ [技術棧指南](./docs/tech-stack-guide.md)

---

## 授權與聯繫

**授權**: MIT License  
**作者**: Your Name  
**Email**: your.email@example.com  
**最後更新**: 2025-01-10

---

> 💡
> **開發筆記**: 本專案採用漸進式開發策略，優先實現核心功能，根據用戶反饋迭代優化。遵循 YAGNI 原則，避免過度設計。
