# SmartSurvey Pro - Claude 開發指南 🤖

> 📅 最後更新：2025-01-20 🎯 用途：Claude
> AI 助手的專案理解與開發協作指南 🌐 對話語言：中文為主，技術術語使用英文

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

### 1. 開發心態準則 🎯

#### 1.1 正向解決問題（No Ostrich Policy）

**原則**：遇到問題必須當下解決，不逃避、不忽略

**執行方式**：

- ❌ **錯誤示範**：發現錯誤但選擇忽略，期待後續會自動解決
- ✅ **正確做法**：立即分析問題根源並修正
- 🔄 **例外情況**：只有當問題確實依賴後續開發時，才使用 `TODO(future)` 標記

**實際案例**：

```typescript
// ❌ 錯誤：發現 getClientIP 未定義，但選擇忽略建構錯誤
// ✅ 正確：立即引入正確的模組或實作該函數
```

#### 1.2 避免重複造輪（DRY - Don't Repeat Yourself）

**原則**：發現重複邏輯立即抽離為共用模組

**執行方式**：

- 🔍 **識別重複**：相同邏輯出現 2 次以上
- 🔧 **立即重構**：抽離為工具函數、共用組件或服務
- 📁 **統一管理**：放置於適當的 utils、composables 或 shared 目錄

**實際案例**：

```typescript
// ❌ 錯誤：logger 和 logout 各自實作 getClientIP
// ✅ 正確：建立 /server/utils/client-ip.ts 共用模組
```

### 2. 協作模式：教學導向開發（Learning-Driven Development）

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
- **類型安全優先**：盡可能避免使用 `any`，若真的有必要也須優先考慮使用
  `unknown`、`Record<string, unknown>`、聯合類型等替代方案
- **測試覆蓋**：核心功能需有對應測試
- **避免重複造輪**：發現共用邏輯立即抽離為工具函數或組件
- **正向解決問題**：遇到問題當下解決，只有依賴後續開發時才用 TODO(future)
- **🔴 強制類型檢查**：每次程式碼修改後必須執行 `pnpm type-check` 確保類型安全
- **🚫 禁用 any 規避**：絕不使用 `any` 類型來規避問題，必須正確解決類型錯誤
- **⚡ 主動類型驗證**：修改完成後立即測試，確保 TypeScript 編譯無錯誤
- **📋 強制 README 文檔**：新增重要資料夾必須創建 README，修改任何檔案必須同步更新對應 README

### 5. 代碼品質驗證 🔴 **必須遵守**

#### 開發時型別檢查要求 🆕

**🔴 重要：每次完成功能開發後，必須執行 type check 確保型別正確**

```bash
# 開發新功能或修改程式碼後
pnpm type-check      # 必須通過，不得有任何型別錯誤

# 特別注意：
- API 開發完成後必須執行 type check
- 組件開發完成後必須執行 type check
- 修改型別定義後必須執行 type check
```

#### 版控前檢查流程

**⚠️ 重要：提交代碼前必須依序執行以下檢查：**

```bash
# 標準檢查流程（依序執行）
1. pnpm type-check   # TypeScript 類型檢查 - 確保類型正確
2. pnpm lint         # ESLint 檢查並自動修復 - 確保代碼規範
3. pnpm format       # Prettier 自動格式化 - 確保格式一致

# 或使用一鍵檢查（推薦）
pnpm quality:fix     # 自動執行上述所有步驟
```

**檢查命令詳解：**

```bash
# 檢查類命令（只檢查不修復）
pnpm quality       # 一鍵檢查所有品質指標
pnpm lint:check    # ESLint 檢查（不修復）
pnpm type-check    # TypeScript 類型檢查
pnpm format:check  # Prettier 格式檢查（不修復）

# 修復類命令（自動修復）
pnpm quality:fix   # 一鍵修復所有可修復問題 ✅ 推薦
pnpm lint          # 自動修復 ESLint 問題
pnpm format        # 自動格式化代碼
```

**配置特點：**

- **適度嚴格**：any 為警告而非錯誤，允許必要時使用
- **console 限制**：目前只允許 console.warn 和 console.error
- **自動修復**：大部分格式和風格問題可自動修復
- **快速反饋**：使用 Turbo 快取，重複檢查速度極快
- **Git Hooks**：已配置自動檢查，但仍建議手動檢查

**重要提醒：**

- 🚫 **絕不提交**未通過檢查的代碼
- ✅ **標準流程**：開發 → type-check → lint → format → commit
- ⚡ **提升效率**：設置 IDE 自動格式化和自動修復
- 📝 **提交前必做**：執行 `pnpm quality:fix` 確保品質

#### 擴充點檢查流程 🆕 **必須遵守**

**🔴 重要：每次完成功能開發後，必須檢查並標註未來擴充需求**

**檢查時機**：

- ✅ 完成 API 開發後
- ✅ 完成組件開發後
- ✅ 完成功能模組後
- ✅ Phase 階段性檢查時

**執行步驟**：

```bash
# 1. 檢查代碼中的潛在擴充點
# 分析每個功能模組，識別未來可能需要的功能

# 2. 標註擴充點
# 在適當位置添加 TODO(feature) 註解，格式：
# TODO(feature): 功能描述 - 詳細說明 (Phase X)

# 3. 更新文檔
# 將所有發現的擴充需求記錄到 docs/TODO.md

# 4. 檢查 README
# 確保相關模組的 README 文檔存在且完整
```

**標註格式範例**：

```typescript
// 在關鍵邏輯前標註未來擴充點
// TODO(feature): Redis 快取支援 - 問卷列表篩選結果快取 (Phase 2)
// TODO(feature): 全文搜尋功能 - 支援問卷標題、描述搜尋 (Phase 2)
// TODO(feature): 工作區整合 - 支援多工作區問卷管理 (Phase 3)

// 連接資料庫
const db = await connectToDatabase();
```

**文檔更新要求**：

```markdown
# 在 docs/TODO.md 中記錄

### 來自 Task X - 功能模組名稱 🔄

#### 📈 功能名稱

- **檔案位置**：具體檔案路徑
- **當前狀態**：功能現況描述
- **延後原因**：為何延後的理由
- **預計實作**：預計實作時間點
- **影響程度**：高/中/低 - 具體影響說明
- **實作內容**：詳細升級計劃
```

**檢查清單**：

- [ ] 分析功能模組的未來擴充需求
- [ ] 在代碼中標註 `TODO(feature)` 擴充點
- [ ] 更新 `docs/TODO.md` 記錄所有發現的擴充需求
- [ ] 確保相關目錄有完整的 README 文檔
- [ ] 按影響程度對擴充需求進行優先級分類

#### 日誌系統規劃 🔮

**當前狀態：**

- 開發階段使用適當的 console 級別進行除錯
- 已限制 console.log 使用，避免生產環境洩漏

**Log 級別使用規範：**

```typescript
// 🟢 console.log - 一般資訊
console.log('[Component] 初始化完成');
console.log('[Store] 載入預設配置');

// 🟡 console.warn - 警告，潛在問題但不中斷執行
console.warn('[API] 使用舊版 API，建議升級');
console.warn('[Validation] 欄位格式可能有誤');

// 🔴 console.error - 錯誤狀況，需要開發者注意
console.error('[Component] 必要參數缺失');
console.error('[Store] 資料更新失敗');

// ❌ 禁止除錯 log 提交到版控
// console.log('[Debug] 臨時除錯訊息'); // 應在問題解決後移除
```

**Phase 2 規劃（第3-4月）：**

```typescript
// 預計引入專業日誌系統
- 後端：Pino 或 Winston（高性能結構化日誌）
- 前端：自訂 Logger Service（錯誤追蹤整合）
- 整合：Sentry 或 LogRocket（生產環境監控）

// 日誌等級規劃
- ERROR: 系統錯誤、異常
- WARN: 警告、效能問題
- INFO: 重要業務事件
- DEBUG: 開發除錯資訊
```

**遷移計劃：**

1. Phase 1：使用 console.warn/error（當前）
2. Phase 2：引入日誌系統，統一日誌介面
3. Phase 3：整合監控平台，建立告警機制

---

## 📋 README 文檔管理規範 🔴 **強制遵守**

### 核心原則：Documentation as Code

**🎯 目標**：建立自動維護、即時同步的文檔系統，讓文檔成為開發流程的有機組成部分

### 1. 強制 README 創建規則

#### 必須創建 README 的資料夾類型

```
重要資料夾（必須有 README.md）：
├── components/          # Vue 組件目錄
│   └── [子分類]/       # 如 builder/, forms/, common/
├── pages/              # 路由頁面目錄
│   └── [子分類]/       # 如 auth/, dashboard/, admin/
├── server/api/         # API 端點目錄
│   └── [功能模組]/     # 如 auth/, surveys/, users/
├── server/middleware/  # 中間件目錄
├── server/utils/       # 伺服器工具目錄
├── stores/             # Pinia 狀態管理目錄
├── composables/        # 組合式函數目錄
├── utils/              # 前端工具函數目錄
├── types/              # 類型定義目錄
└── [任何包含 3+ 檔案的功能目錄]
```

#### README 檢查清單

**創建新資料夾時必須確認：**

- [ ] 是否屬於上述重要資料夾類型？
- [ ] 資料夾內是否有 3 個以上相關檔案？
- [ ] 是否包含重要業務邏輯或通用功能？

**如果答案是「是」→ 立即創建 README.md**

### 2. README 標準格式模板

```markdown
# [目錄名稱] 目錄

> 📁 **目錄作用**：簡短描述目錄的主要功能
>
> 📅 **最後更新**：YYYY-MM-DD
>
> 🎯 **負責功能**：詳細說明負責的業務功能

## 📋 包含檔案清單

| 檔案名稱    | 功能說明     | 狀態      | 依賴關係     |
| ----------- | ------------ | --------- | ------------ |
| `file1.ts`  | 主要功能描述 | ✅ 已完成 | 依賴項目     |
| `file2.vue` | 組件功能描述 | 🔄 開發中 | 使用的 Store |

## 🔧 詳細說明

[根據目錄類型提供對應的詳細說明]

## 🚀 開發指引

[新增檔案時的注意事項和步驟]

## 📝 更新規範

[更新此 README 的時機和要求]

---

**最後更新者**：[更新者名稱] **下次檢查**：[下次檢查時機]
```

### 3. 同步更新強制要求 🔴

#### 觸發 README 更新的操作

```typescript
// 🔴 以下操作完成後，必須立即更新對應 README：

✅ 新增檔案到目錄                → 更新檔案清單
✅ 刪除目錄中的檔案              → 更新檔案清單
✅ 修改檔案的主要功能            → 更新功能說明
✅ 變更檔案的依賴關係            → 更新依賴關係
✅ 新增/修改 API 端點           → 更新 API 說明
✅ 變更組件的 Props 或事件      → 更新組件說明
✅ 修改業務邏輯流程              → 更新邏輯說明
✅ 完成功能開發（狀態變更）      → 更新完成狀態
```

#### README 更新檢查清單

**每次修改檔案後確認：**

- [ ] 檔案清單是否反映當前狀態？
- [ ] 功能說明是否準確描述實際功能？
- [ ] 依賴關係是否正確標記？
- [ ] 狀態標記是否與實際開發進度一致？
- [ ] 更新時間和更新者是否記錄？

### 4. 優先查詢機制

#### Claude 查詢文件的標準流程

```bash
# 🔍 Claude 查找檔案/功能的標準程序：

1. 首先查詢對應目錄的 README.md
   ↓
2. 在 README 中查找檔案清單和功能說明
   ↓
3. 根據 README 的指引找到目標檔案
   ↓
4. 查看具體檔案實作
   ↓
5. 如發現 README 與實際不符，立即更新 README
```

#### 快速定位指南

```markdown
# 常見查詢場景和對應 README：

🔍 尋找 API 端點？ → /server/api/[模組]/README.md 🔍 尋找 Vue 組件？ →
/components/[分類]/README.md 🔍 尋找工具函數？ →
/utils/README.md 或 /server/utils/README.md 🔍 尋找類型定義？ → /types/README.md
🔍 尋找狀態管理？ → /stores/README.md 🔍 尋找中間件？ →
/server/middleware/README.md
```

### 5. 自動化檢查機制（未來實作）

#### Git Hooks 整合

```bash
# 計劃在 pre-commit hook 中加入：
1. 檢查新增的重要目錄是否有 README
2. 檢查修改的檔案是否觸發 README 更新需求
3. 驗證 README 格式是否符合標準模板
4. 提醒開發者更新相關 README
```

#### CI/CD 整合

```yaml
# 計劃在 CI 流程中加入：
- README 格式驗證
- 檔案清單一致性檢查
- 文檔覆蓋率報告
- 文檔更新提醒
```

### 6. 違規處理原則

#### 🚫 不允許的行為

- 新增重要目錄而不創建 README
- 修改檔案功能而不更新對應 README
- 使用過期或錯誤的 README 資訊進行開發
- 批量更新檔案後忘記同步 README

#### ✅ 正確的工作流程

```bash
# 標準開發流程：
1. 計劃新功能 → 檢查是否需要新目錄
2. 創建目錄 → 立即創建 README.md
3. 開發功能 → 即時更新 README 狀態
4. 完成功能 → 更新 README 完成狀態
5. Code Review → 檢查 README 一致性
6. 提交代碼 → README 與代碼同步提交
```

### 7. README 品質標準

#### 內容品質要求

- **準確性**：100% 反映實際檔案和功能狀態
- **完整性**：涵蓋所有重要檔案和功能點
- **即時性**：修改後 24 小時內更新
- **可讀性**：清晰的結構和易懂的說明

#### 格式一致性要求

- 使用統一的模板結構
- 保持表格格式和圖示使用一致
- 遵循 Markdown 最佳實踐
- 包含必要的元資料（更新時間、更新者）

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

### 🎨 設計文件管理規範

#### 設計文件原則

**⚠️ 重要**：所有架構設計討論完成後，必須在 `/docs/design/` 中建立對應文件

**🔴 關鍵提醒**：開發前必須先查閱：

1. `/docs/` - 專案整體文件
2. `/docs/design/` - **最新的設計決策（優先參考）**
3. `/docs/TODO.md` - **統一待辦事項追蹤（必須參考）**
4. 特別注意環境變數使用必須遵循
   `/docs/design/environment-variables-management.md`

#### 管理流程

1. **設計階段**：
   - 重大架構設計或功能規劃時
   - 與 Claude 討論完成後，立即建立設計文件
   - 文件應包含：設計原理、架構圖、關鍵決策、實作策略

2. **文件結構**：

   ```
   /docs/design/
   ├── environment-variables-management.md # 環境變數管理策略 ⭐
   ├── user-permission-system.md          # 用戶權限系統
   ├── survey-builder-architecture.md     # 問卷建構器架構
   ├── analytics-system.md                # 分析系統設計
   └── api-design-principles.md           # API 設計原則
   ```

3. **維護更新**：
   - **📝 同步原則**：實作過程中的任何架構變更都必須同步更新設計文件
   - **🔄 版本控制**：重大設計變更需更新版本號和變更日誌
   - **📅 定期檢查**：每個 Phase 結束時檢查設計文件是否與實作一致

4. **文件模板**：

   ```markdown
   # [功能名稱] - 設計文件

   > 📅 文件版本：v1.0 📝 最後更新：YYYY-MM-DD 👥 設計團隊：Claude + Human
   > 🎯 狀態：設計階段/實作中/已完成

   ## 概述

   ## 系統架構

   ## 關鍵決策

   ## 實作策略

   ## 資料庫設計

   ## API 設計

   ## 測試策略
   ```

5. **更新時機**：
   - ✅ 新功能設計完成時
   - ✅ 架構重構時
   - ✅ 重要 bug 修復涉及設計變更時
   - ✅ Phase 階段性檢查時

### 環境變數使用規範 🔑

**必讀文件**：[環境變數管理系統設計](/docs/design/environment-variables-management.md)

**快速判斷規則**：

```typescript
// 🔴 機敏資料 → 使用 process.env 或 env.getSecret()
(-JWT_SECRET,
  API_KEYS,
  DATABASE_PASSWORD -
    // 🟡 配置資料 → 使用 useRuntimeConfig()
    API_BASE,
  APP_NAME,
  FEATURE_FLAGS);
```

### TODO 管理規範 📋

**必讀文件**：[統一待辦事項追蹤](/docs/TODO.md)

**管理原則**：

1. **集中管理**：所有 TODO 統一記錄在 `/docs/TODO.md`
2. **分類清楚**：按 Phase 和優先級分類
3. **即時更新**：新增或完成 TODO 立即更新文件
4. **標記規範**：程式碼中使用 `TODO(future)` 而非 `TODO(human)`

**工作流程**：

```bash
# 新增 TODO
1. 在程式碼中標記：// TODO(future): 功能描述
2. 在 /docs/TODO.md 中記錄項目
3. commit 時提及 TODO 新增

# 完成 TODO
1. 移除程式碼中的 TODO 標記
2. 在 /docs/TODO.md 中標記為已完成
3. commit 時提及 TODO 完成
```

### 🔍 進度追蹤準則（多機協作必讀）

**目的**：確保在不同機器、不同 Claude 對話間能準確同步開發進度

#### 進度查詢流程（當被問及「目前進度」時）

1. **查看 Roadmap 主架構**
   - 檔案：`/smartsurvey-roadmap.md`
   - 確認當前 Phase 和 Task 序號
   - 檢查整體完成百分比

2. **深入 Tasks 詳細文件**
   - 路徑：`/docs/tasks/phase{X}/{task-number}-{task-name}.md`
   - 檢視子任務的完成狀態標記（✅ ⬜）
   - 查看實際工時 vs 預估工時

3. **驗證程式碼實作狀態**

   ```bash
   # 檢查步驟：
   a. 檢查對應檔案是否存在
      - 使用 Glob 確認檔案已建立

   b. 搜尋 TODO(human) 標記
      - 使用 Grep 搜尋 "TODO(human)"
      - 有 TODO(human) = 該功能未完成
      - 無 TODO(human) = 該功能已完成或已實作

   c. 檢查功能完整性
      - API 端點是否可執行（非 501 錯誤）
      - Model 定義是否完整
      - 測試是否通過
   ```

4. **檢查 TODO.md 延後項目**
   - 檔案：`/docs/TODO.md`
   - 確認 TODO(future) 項目（不影響當前進度）
   - 注意已知的延後優化事項

#### 進度判定規則

```typescript
// 任務完成度計算邏輯
if (檔案不存在) {
  狀態 = "未開始";
  完成度 = 0%;
} else if (有 TODO(human) 標記) {
  狀態 = "開發中";
  完成度 = 50%;  // 框架已建立，核心邏輯待實作
} else if (有 501 錯誤回應) {
  狀態 = "待實作";
  完成度 = 30%;  // 僅有模板
} else {
  狀態 = "已完成";
  完成度 = 100%;
}
```

#### 進度報告格式範例

```markdown
## 📊 目前進度報告

### 當前位置

- **Phase**: Phase 1 (MVP Foundation)
- **Task**: Task 2 - 用戶認證系統
- **整體進度**: 80% 完成

### 詳細狀態

✅ 2.1 User Model 設計 (100%) ⚠️ 2.2 認證 API 實作 (70%)

- ✅ register.post.ts
- ✅ login.post.ts
- ✅ me.get.ts
- ❌ logout.post.ts (有 TODO(human))
- ❌ refresh.post.ts (有 TODO(human)) ✅ 2.3 認證中間件 (100%)

### 下一步建議

完成 logout 和 refresh API 後進入 Task 3
```

#### 特別注意事項

1. **優先檢查 git status**：了解最新未提交變更
2. **查看最近 commits**：根據使用者指定的數量
   - 使用者會說：「請看最近 N 個 commit」
   - 執行 `git log --oneline -N` 查看概要
   - 執行 `git diff HEAD~N..HEAD --stat` 查看變更統計
3. **TODO(human) 是關鍵**：有此標記代表功能未完成
4. **TODO(future) 可忽略**：屬於優化項目，不影響進度判定

### 檔案命名規範

```typescript
// 組件：PascalCase
components / SurveyBuilder.vue;
components / QuestionCard.vue;

// 組合式函數：use 前綴 + camelCase
composables / useDragDrop.ts;
composables / useSurveyData.ts;

// 工具函數：camelCase
utils / formatDate.ts;
utils / validateEmail.ts;

// 類型定義：PascalCase
types / Survey.ts;
types / Question.ts;

// API 路由：kebab-case
server / api / surveys.get.ts;
server / api / survey - response.post.ts;
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
import { packageConfig } from '../config/tsup/package.js';
export default packageConfig;

// 自訂建構
import { createBaseConfig } from '../config/tsup/base.js';
export default createBaseConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  dts: true,
});
```

### 新增共享配置

1. **評估通用性**: 確認配置會被多個專案使用
2. **建立模板**: 在 `packages/config` 中新增配置
3. **更新文件**: 更新 config/README.md 使用說明
4. **遷移現有**: 將現有專案遷移到新配置

---

## 🔑 關鍵業務邏輯

### 訂閱方案限制

| 方案       | 問卷數 | 月回應數 | AI額度 | 價格 |
| ---------- | ------ | -------- | ------ | ---- |
| Free       | 3      | 100      | 0      | $0   |
| Pro        | 無限   | 10,000   | 100    | $29  |
| Team       | 無限   | 50,000   | 500    | $99  |
| Enterprise | 無限   | 無限     | 5000   | 客製 |

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
4. **中文優先**：溝通和註解使用中文
5. **教學導向**：重視學習過程勝於完成速度
6. **持續優化**：定期重構和改進程式碼品質

---

## 🔄 文件更新記錄

- 2025-01-13：初始版本建立，加入教學導向開發原則
- 2025-01-16：加入版控前檢查流程與日誌系統規劃
- 2025-01-17：新增環境變數管理設計文件與使用規範
- 2025-01-17：建立統一 TODO 管理系統與開發規範
- 2025-01-18：新增進度追蹤準則，支援多機協作開發
- 2025-01-18：新增開發心態準則（正向解決問題、避免重複造輪）
- 2025-09-20：新增強制類型檢查準則，禁止使用 any 規避問題
- 2025-09-20：建立強制 README 文檔管理規範，實現 Documentation as Code
- 2025-01-20：建立擴充點檢查流程準則，確保功能完成後進行未來擴充需求分析

---

_此文件是 Claude 理解和協助開發 SmartSurvey Pro 的核心指南_
_請在每次對話開始時參考此文件以保持上下文一致性_
