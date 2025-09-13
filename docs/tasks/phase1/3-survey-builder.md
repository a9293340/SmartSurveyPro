# 3. 問卷建構器系統

## 📊 概覽

- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: ⬜ 未開始
- **預估工時**: 32h
- **實際工時**: 0h
- **進度**: 0% ░░░░░░░░░░░░░░░░░░░░
- **開始日期**: -
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

**狀態**: ⬜ **優先級**: 🔴

#### 3.1.1 Survey & Question Schema 設計

- **預估**: 4h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 設計問卷和題目的完整資料結構

**TODO(human)**:

```typescript
// 在 packages/shared/src/types/survey.ts
export interface Survey {
  id: string;
  title: string;
  // TODO(human): 完成以下設計
  // 1. 問卷基本資訊包含哪些欄位？
  // 2. 問卷狀態如何設計？
  // 3. 發布設定包含什麼？
  // 4. questions 陣列如何組織？
}

export interface Question {
  // TODO(human): 設計題目資料結構
  // 考慮：不同題型的差異化處理
  // 驗證規則如何設計？
  // 邏輯跳轉如何表示？
}
```

#### 3.1.2 問卷建構器狀態設計

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 使用 Pinia 設計建構器的狀態管理

**TODO(human)**:

```typescript
// 在 apps/web/stores/builder.ts
export const useBuilderStore = defineStore('builder', () => {
  // TODO(human): 設計建構器狀態
  // 1. 當前編輯的問卷資料
  // 2. 選中的題目狀態
  // 3. 拖拽狀態管理
  // 4. 歷史記錄 (undo/redo)

  const currentSurvey = ref<Survey | null>(null);

  // 你來完成其他狀態和 actions
});
```

#### 3.1.3 題型註冊系統

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude

**任務說明**: 建立可擴展的題型註冊和管理系統

### 3.2 拖拽編輯器核心 [12h]

**狀態**: ⬜ **優先級**: 🔴

#### 3.2.1 拖拽容器組件

- **預估**: 4h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 建立支援拖拽的問卷畫布組件

**學習重點**: Vue3 拖拽事件處理、組件間通訊、動畫效果

**TODO(human)**:

```vue
<!-- apps/web/components/builder/SurveyCanvas.vue -->
<template>
  <div class="survey-canvas" @drop="onDrop" @dragover="onDragOver">
    <!-- TODO(human): 實作拖拽邏輯 -->
    <!-- 1. 如何處理題目的拖入？ -->
    <!-- 2. 拖拽時的視覺反饋？ -->
    <!-- 3. 題目順序如何調整？ -->
  </div>
</template>

<script setup>
// 你來實作拖拽核心邏輯
</script>
```

#### 3.2.2 題型元件庫

- **預估**: 6h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 實作 5 種基礎題型組件

**題型清單**:

- [ ] 單選題 (SingleChoice)
- [ ] 多選題 (MultipleChoice)
- [ ] 短文字 (TextShort)
- [ ] 長文字 (TextLong)
- [ ] 評分題 (Rating)

**TODO(human)**:

```vue
<!-- 以單選題為例 -->
<template>
  <div class="question-single-choice">
    <!-- TODO(human): 設計單選題的 UI -->
    <!-- 1. 題目標題如何顯示？ -->
    <!-- 2. 選項如何動態新增/刪除？ -->
    <!-- 3. 必填標記如何處理？ -->
    <!-- 4. 驗證錯誤如何顯示？ -->
  </div>
</template>
```

#### 3.2.3 屬性面板

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 建立題目屬性編輯面板

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
