# 3. 問卷建構器系統

## 📊 概覽

- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: 🟨 進行中
- **預估工時**: 32h
- **實際工時**: 20h
- **進度**: 63% ████████████░░░░░░░░
- **開始日期**: 2025-01-18
- **完成日期**: -

## 🔗 依賴關係

- **前置任務**: 1.基礎架構設置, 2.用戶認證系統
- **阻塞任務**: 4.資料收集系統
- **相關文件**:
  - [產品規格書](../../../docs/smart-survey-pro-spec.md#智能題型系統)
  - [業務邏輯規則](../../../smartsurvey-business-logic.md#問卷邏輯規則)
  - [API 參考](../../../smartsurvey-api-reference.md#問卷-apis)

## 📚 學習目標

- [ ] 掌握 Vue3 拖拽功能的實作技巧
- [ ] 理解組件化設計和狀態管理模式
- [ ] 學會複雜表單的動態生成和驗證
- [ ] 掌握 Pinia 在複雜應用中的使用
- [ ] 理解問卷邏輯引擎的設計思路

## 🏗️ 任務分解

### 3.1 資料模型與狀態管理 [8h]

**狀態**: ✅ **優先級**: 🔴

#### 3.1.1 Survey & Question Schema 設計

- **預估**: 4h | **實際**: 4h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-18

**任務說明**: 設計問卷和題目的完整資料結構

**已完成內容**:

- ✅ packages/shared/src/types/survey.ts - 完整問卷型別系統
  - 問卷狀態管理（草稿、發布、暫停、關閉、封存）
  - 發布設定（可見性、密碼保護、時間限制）
  - 外觀設定（主題色彩、封面圖片、自訂 CSS）
  - 統計資料追蹤

- ✅ packages/shared/src/types/question.ts - 完整題型系統
  - 15+ 種題型支援（文字、選擇、評分、日期、檔案）
  - 靈活的驗證規則系統
  - 型別安全的題目配置

- ✅ packages/shared/src/schemas/survey.ts - Zod 驗證規則
  - 前後端共用驗證邏輯
  - 詳細的中文錯誤訊息
  - 安全解析和便利函數

#### 3.1.2 問卷建構器狀態設計

- **預估**: 3h | **實際**: 3h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-18

**任務說明**: 使用 Pinia 設計建構器的狀態管理

**已完成內容**:

- ✅ apps/web/stores/builder.ts - 建構器核心狀態
  - 問卷編輯狀態管理
  - 歷史記錄系統（undo/redo）
  - 自動儲存機制
  - 預覽模式切換

- ✅ apps/web/stores/drag-drop.ts - 拖放功能狀態
  - 拖曳狀態追蹤
  - 放置區域管理
  - 自動滾動功能
  - 智慧插入位置計算

- ✅ apps/web/stores/questions.ts - 題目管理狀態
  - 題目 CRUD 操作
  - 批量操作（含事務性回滾）
  - 剪貼簿功能
  - 搜尋和篩選

#### 3.1.3 題型註冊系統

- **預估**: 1h | **實際**: 1h
- **狀態**: ✅
- **負責**: Claude
- **完成日期**: 2025-01-18

**任務說明**: 建立可擴展的題型註冊和管理系統

**已完成內容**:

- ✅ packages/shared/src/survey/question-registry.ts - 題型註冊系統
  - 插件化題型管理機制
  - Phase 1 支援 5 種基礎題型
  - 工廠模式建立和驗證題目
  - 完整的題目驗證邏輯

### 3.2 拖拽編輯器核心 [12h]

**狀態**: ✅ **優先級**: 🔴

#### 3.2.1 拖拽容器組件

- **預估**: 4h | **實際**: 4h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-19

**任務說明**: 建立支援拖拽的問卷畫布組件

**已完成內容**:

- ✅ apps/web/app/components/builder/SurveyCanvas.vue - 完整拖放畫布
  - 整合拖放容器（DropZone）和題型面板（QuestionTypePanel）
  - 響應式三欄布局設計（題型庫 | 畫布 | 屬性面板）
  - 動態屬性面板寬度控制
  - 題目選擇狀態管理

- ✅ apps/web/app/components/builder/DropZone.vue - 拖放核心邏輯
  - HTML5 拖拽 API 完整實作
  - 動態插入位置計算和視覺提示
  - 題目新增、重排、刪除功能
  - 空狀態和載入狀態處理

#### 3.2.2 題型元件庫

- **預估**: 6h | **實際**: 4h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-20

**任務說明**: 實作 5 種基礎題型組件

**題型清單**:

- [x] 單選題 (SingleChoice) - QuestionSingleChoicePreview.vue
- [x] 多選題 (MultipleChoice) - QuestionMultipleChoicePreview.vue
- [x] 短文字 (TextShort) - QuestionTextShortPreview.vue
- [x] 長文字 (TextLong) - QuestionTextLongPreview.vue
- [x] 評分題 (Rating) - QuestionRatingPreview.vue

**已完成內容**:

- ✅ apps/web/app/components/builder/previews/ - 5個題型預覽組件
  - 統一的 Props 介面設計（question, previewMode）
  - 事件驅動的配置更新系統（updateQuestion）
  - 響應式設計和無障礙支援
  - TypeScript 類型安全實作

- ✅ apps/web/app/components/builder/QuestionCard.vue - 動態組件載入
  - componentMap 題型組件映射系統
  - 自動 fallback 機制
  - 配置更新事件整合

- ✅ apps/web/app/utils/question-type-helpers.ts - 工具函數
  - 題型圖示映射
  - 預設配置產生器

- ✅ packages/shared/src/types/question.ts - 類型系統強化
  - 驗證規則繼承 Record<string, unknown>
  - 配置介面擴展支援

#### 3.2.3 屬性面板

- **預估**: 2h | **實際**: 4h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-20

**任務說明**: 建立題目屬性編輯面板

**已完成內容**:

- ✅ apps/web/app/components/builder/PropertyPanel.vue - 動態屬性面板主容器
  - 智能標題切換（問卷設定 ↔ 題目設定）
  - 響應式面板寬度控制 (400px)
  - 條件渲染系統

- ✅
  apps/web/app/components/builder/properties/SurveyProperties.vue - 問卷層級屬性
  - 問卷標題、描述編輯
  - 基礎設定選項

- ✅
  apps/web/app/components/builder/properties/QuestionProperties.vue - 題目層級屬性
  - 支援 5 種基礎題型的專屬設定
  - 選項動態新增/編輯/刪除功能
  - 驗證規則設定介面
  - 實時狀態同步機制
  - 資料格式相容性處理 (text/label 格式統一)

- ✅ apps/web/app/stores/builder.ts - Store 整合擴展
  - 新增 getQuestionById 查詢方法
  - 保持單一資料來源原則

### 3.3 問卷 CRUD API [8h]

**狀態**: ⬜ **優先級**: 🔴

#### 3.3.1 問卷管理 API

- **預估**: 4h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 實作問卷的增刪改查 API

**TODO(human)**:

```typescript
// apps/web/server/api/surveys/index.post.ts
export default defineEventHandler(async event => {
  // TODO(human): 實作問卷建立邏輯
  // 1. 驗證用戶權限
  // 2. 檢查訂閱限制
  // 3. 驗證問卷資料
  // 4. 儲存到資料庫
  // 5. 回傳問卷 ID
});
```

#### 3.3.2 題目操作 API

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

#### 3.3.3 問卷發布機制

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

### 3.4 預覽功能 [4h]

**狀態**: ⬜ **優先級**: 🟡

#### 3.4.1 即時預覽組件

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 建立問卷即時預覽功能

#### 3.4.2 響應式預覽

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 支援桌面/平板/手機預覽模式

## 🎨 UI/UX 設計要點

### 拖拽體驗

- **視覺回饋**: 拖拽時顯示插入位置提示線
- **動畫效果**: 平滑的拖入拖出動畫
- **觸控支援**: 支援觸控設備的拖拽操作

### 編輯體驗

- **即時儲存**: 每次修改後自動儲存（防抖 500ms）
- **快捷鍵**: 支援常用快捷鍵（複製、刪除、撤銷）
- **右鍵選單**: 提供題目操作的上下文選單

### 響應式設計

- **斷點**: Desktop (>1024px), Tablet (768-1024px), Mobile (<768px)
- **佈局**: 大螢幕三欄式，小螢幕可摺疊側邊欄

## 🧪 測試策略

### 組件測試

```typescript
// 單選題組件測試範例
describe('SingleChoiceQuestion', () => {
  it('should render question title', () => {
    // TODO(human): 撰寫測試
  });

  it('should add new option when click add button', () => {
    // TODO(human): 測試選項新增功能
  });
});
```

### E2E 測試場景

- [ ] 建立新問卷流程
- [ ] 拖拽新增題目
- [ ] 編輯題目屬性
- [ ] 預覽問卷
- [ ] 儲存並發布問卷

## 📋 頁面結構規劃

```
/builder/
├── new                    # 新建問卷頁
└── [id]/
    ├── edit              # 編輯問卷頁
    └── preview           # 預覽問卷頁
```

### 編輯頁面佈局

```
┌─────────────────────────────────────────┐
│              Header Toolbar              │
├─────────────┬──────────────┬─────────────┤
│             │              │             │
│  Question   │    Canvas    │ Properties  │
│  Library    │              │   Panel     │
│             │              │             │
├─────────────┼──────────────┼─────────────┤
│             │   Preview    │             │
└─────────────┴──────────────┴─────────────┘
```

## 🔄 狀態變更歷史

- 2025-01-13: 任務建立，等待前置任務完成

## 💡 給 Claude 的上下文

**任務位置**: Phase 1 > 問卷建構器系統 **技術重點**: Vue3 拖拽 +
Pinia 狀態管理 + 組件化設計 **UX 要求**: 直覺的拖拽操作，即時預覽，流暢動畫
**核心挑戰**: 複雜狀態管理、拖拽交互、組件解耦

**相關檔案**:

- `packages/shared/src/types/survey.ts`
- `apps/web/stores/builder.ts`
- `apps/web/components/builder/`
- `apps/web/pages/builder/`
- `apps/web/server/api/surveys/`

**設計參考**:

- Typeform 的問卷建構體驗
- Notion 的拖拽編輯器
- Figma 的屬性面板設計
