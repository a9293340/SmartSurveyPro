# Pinia Stores 說明文件 📦

> 📅 最後更新：2025-01-18
> 🎯 用途：問卷建構器狀態管理文件 📍 位置：/apps/web/stores/

## 概述

本目錄包含 SmartSurvey Pro 問卷建構器的所有 Pinia
stores，負責管理應用程式的全域狀態。

## Store 架構

```
stores/
├── builder.ts      # 主要建構器狀態（問卷編輯核心）
├── drag-drop.ts    # 拖放功能狀態
├── questions.ts    # 題目管理狀態
├── response.ts     # 問卷填寫回應狀態管理
└── index.ts        # Store 匯出入口
```

---

## 📘 Builder Store (`useBuilderStore`)

問卷建構器的核心狀態管理，負責問卷編輯、歷史記錄、自動儲存等功能。

### 狀態屬性 (State)

| 屬性                 | 類型             | 說明               | 唯讀 |
| -------------------- | ---------------- | ------------------ | ---- |
| `currentSurvey`      | `Survey \| null` | 當前編輯的問卷物件 | ❌   |
| `selectedQuestionId` | `string \| null` | 當前選中的題目 ID  | ✅   |
| `isPreviewMode`      | `boolean`        | 是否處於預覽模式   | ✅   |
| `hasUnsavedChanges`  | `boolean`        | 是否有未儲存的變更 | ✅   |
| `isLoading`          | `boolean`        | 是否正在載入       | ✅   |
| `isSaving`           | `boolean`        | 是否正在儲存       | ✅   |
| `lastSavedAt`        | `Date \| null`   | 最後儲存時間       | ✅   |
| `editorSettings`     | `object`         | 編輯器設定         | ❌   |

#### editorSettings 詳細說明

```typescript
{
  autoSave: boolean; // 是否啟用自動儲存（預設：true）
  autoSaveInterval: number; // 自動儲存間隔，毫秒（預設：30000）
  showGrid: boolean; // 是否顯示格線（預設：false）
  enableKeyboardShortcuts: boolean; // 是否啟用快捷鍵（預設：true）
}
```

### 計算屬性 (Computed)

| 屬性               | 類型                                   | 說明               |
| ------------------ | -------------------------------------- | ------------------ |
| `selectedQuestion` | `Question \| null`                     | 當前選中的題目物件 |
| `canUndo`          | `boolean`                              | 是否可以撤銷       |
| `canRedo`          | `boolean`                              | 是否可以重做       |
| `surveyValidation` | `{isValid: boolean, errors: string[]}` | 問卷驗證結果       |
| `builderState`     | `SurveyBuilderState`                   | 建構器完整狀態     |

### 方法 (Methods)

#### 🏗️ 問卷操作

| 方法                 | 參數                                        | 返回值   | 說明             |
| -------------------- | ------------------------------------------- | -------- | ---------------- |
| `createNewSurvey()`  | `{title, description?, type?, workspaceId}` | `Survey` | 建立新問卷       |
| `loadSurvey()`       | `survey: Survey`                            | `void`   | 載入現有問卷     |
| `updateSurveyInfo()` | `updates: Partial<Survey>`                  | `void`   | 更新問卷基本資訊 |

#### ➕ 題目操作

| 方法               | 參數                                    | 返回值     | 說明               |
| ------------------ | --------------------------------------- | ---------- | ------------------ |
| `addQuestion()`    | `type: QuestionType, position?: number` | `Question` | 新增題目到指定位置 |
| `deleteQuestion()` | `questionId: string`                    | `boolean`  | 刪除指定題目       |
| `updateQuestion()` | `questionId: string, updates: object`   | `boolean`  | 更新題目內容       |

#### 🎯 選擇與導航

| 方法                       | 參數                         | 返回值 | 說明           |
| -------------------------- | ---------------------------- | ------ | -------------- |
| `selectQuestion()`         | `questionId: string \| null` | `void` | 選擇指定題目   |
| `selectPreviousQuestion()` | -                            | `void` | 選擇上一個題目 |
| `selectNextQuestion()`     | -                            | `void` | 選擇下一個題目 |

#### 👁️ 預覽模式

| 方法                  | 參數 | 返回值 | 說明         |
| --------------------- | ---- | ------ | ------------ |
| `togglePreviewMode()` | -    | `void` | 切換預覽模式 |
| `exitPreviewMode()`   | -    | `void` | 退出預覽模式 |

#### ↩️ 歷史記錄

| 方法     | 參數 | 返回值    | 說明           |
| -------- | ---- | --------- | -------------- |
| `undo()` | -    | `boolean` | 撤銷上一步操作 |
| `redo()` | -    | `boolean` | 重做下一步操作 |

#### 💾 儲存管理

| 方法                | 參數 | 返回值          | 說明             |
| ------------------- | ---- | --------------- | ---------------- |
| `markAsSaved()`     | -    | `void`          | 標記為已儲存     |
| `markAsUnsaved()`   | -    | `void`          | 標記為未儲存     |
| `performAutoSave()` | -    | `Promise<void>` | 手動觸發自動儲存 |

### 使用範例

```vue
<script setup lang="ts">
import { useBuilderStore } from '~/stores/builder';

const builder = useBuilderStore();

// 建立新問卷
const survey = builder.createNewSurvey({
  title: '客戶滿意度調查',
  description: '了解客戶對我們服務的看法',
  type: 'standard',
  workspaceId: 'workspace-123',
});

// 新增題目
const question = builder.addQuestion(QuestionType.SINGLE_CHOICE, 0);

// 更新題目
builder.updateQuestion(question.id, {
  title: '您對我們的服務滿意嗎？',
  required: true,
});

// 切換預覽模式
builder.togglePreviewMode();

// 撤銷操作
if (builder.canUndo) {
  builder.undo();
}

// 手動儲存
await builder.performAutoSave();
</script>
```

### 自動儲存機制說明

自動儲存功能會在以下情況觸發：

1. **問卷內容變更**：當 `currentSurvey` 發生任何變更
2. **設定變更**：當自動儲存設定改變
3. **延遲執行**：根據 `autoSaveInterval` 設定延遲執行

```javascript
// 修改自動儲存設定
builder.editorSettings.autoSave = true;
builder.editorSettings.autoSaveInterval = 60000; // 60 秒
```

### 歷史記錄機制

- **最大記錄數**：50 筆
- **支援操作**：新增題目、刪除題目、更新題目、更新問卷、調整順序
- **自動清理**：超過上限自動移除最舊記錄

---

## 📘 Drag-Drop Store (`useDragDropStore`)

管理拖放功能的狀態，包括拖曳狀態、放置區域、題目重新排序等。

> ✅ **狀態**：已完成實作

### 狀態屬性 (State)

| 屬性                   | 類型               | 說明                   | 唯讀 |
| ---------------------- | ------------------ | ---------------------- | ---- |
| `isDragging`           | `boolean`          | 是否正在拖放           | ✅   |
| `draggedItem`          | `DragItem \| null` | 當前拖放的項目         | ✅   |
| `hoveredDropZone`      | `DropZone \| null` | 當前懸浮的放置區域     | ✅   |
| `canDropToCurrent`     | `boolean`          | 是否可以放置到當前區域 | ✅   |
| `previewPosition`      | `{x, y} \| null`   | 拖放預覽元素的位置     | ✅   |
| `insertIndicatorIndex` | `number \| null`   | 插入指示器位置         | ✅   |
| `dragSettings`         | `object`           | 拖放設定               | ❌   |

#### dragSettings 詳細說明

```typescript
{
  enableAutoScroll: boolean; // 是否啟用自動滾動（預設：true）
  scrollSensitivity: number; // 自動滾動靈敏度（預設：50）
  previewOffset: {
    (x, y);
  } // 拖放預覽偏移（預設：{x: 10, y: 10}）
  insertIndicatorClass: string; // 插入指示器樣式類別
}
```

### 計算屬性 (Computed)

| 屬性                         | 類型                   | 說明                 |
| ---------------------------- | ---------------------- | -------------------- |
| `draggedQuestionType`        | `QuestionType \| null` | 當前拖放的題型       |
| `draggedQuestionId`          | `string \| null`       | 當前拖放的題目 ID    |
| `isDraggingQuestionType`     | `boolean`              | 是否正在拖放題型     |
| `isDraggingExistingQuestion` | `boolean`              | 是否正在拖放現有題目 |
| `dragState`                  | `object`               | 拖放狀態摘要         |

### 方法 (Methods)

#### 🎬 拖放開始

| 方法                          | 參數                                 | 返回值 | 說明             |
| ----------------------------- | ------------------------------------ | ------ | ---------------- |
| `startDragQuestionType()`     | `type, displayName, icon, position`  | `void` | 開始拖放題型     |
| `startDragExistingQuestion()` | `questionId, title, index, position` | `void` | 開始拖放現有題目 |

#### 🔄 拖放過程

| 方法                   | 參數                         | 返回值 | 說明               |
| ---------------------- | ---------------------------- | ------ | ------------------ |
| `updateDragPosition()` | `position: {x, y}`           | `void` | 更新拖放位置       |
| `setHoveredDropZone()` | `dropZone: DropZone \| null` | `void` | 設置懸浮的放置區域 |

#### ✅ 拖放結束

| 方法                 | 參數 | 返回值           | 說明         |
| -------------------- | ---- | ---------------- | ------------ |
| `completeDragDrop()` | -    | `DragDropResult` | 完成拖放操作 |
| `cancelDragDrop()`   | -    | `DragDropResult` | 取消拖放操作 |

#### ⚙️ 設定管理

| 方法                   | 參數                              | 返回值 | 說明         |
| ---------------------- | --------------------------------- | ------ | ------------ |
| `updateDragSettings()` | `settings: Partial<DragSettings>` | `void` | 更新拖放設定 |
| `resetDragSettings()`  | -                                 | `void` | 重置拖放設定 |

### 進階功能

- **自動滾動**：支援視窗和容器的自動滾動，速度根據距離動態調整
- **智慧插入位置**：根據鼠標位置自動計算最佳插入索引
- **放置區域優先級**：使用距離計算選擇最近的有效放置區域
- **全局事件管理**：自動管理滑鼠和鍵盤事件監聽器

---

## 📘 Questions Store (`useQuestionsStore`)

管理題目相關的進階功能，如題目庫、題目範本、批量操作等。

> ✅ **狀態**：已完成實作

### 狀態屬性 (State)

| 屬性                     | 類型               | 說明                 | 唯讀 |
| ------------------------ | ------------------ | -------------------- | ---- |
| `clipboard`              | `Question \| null` | 剪貼簿中的題目       | ✅   |
| `lastOperatedQuestionId` | `string \| null`   | 最後操作的題目 ID    | ✅   |
| `operationHistory`       | `string[]`         | 題目操作歷史記錄     | ✅   |
| `selectedQuestionIds`    | `Set<string>`      | 批量選擇的題目 ID    | ✅   |
| `isBatchMode`            | `boolean`          | 是否處於批量操作模式 | ✅   |

### 計算屬性 (Computed)

| 屬性                     | 類型                       | 說明               |
| ------------------------ | -------------------------- | ------------------ |
| `allQuestions`           | `Question[]`               | 當前問卷的所有題目 |
| `supportedQuestionTypes` | `QuestionTypeDefinition[]` | 支援的題型列表     |
| `questionStats`          | `object`                   | 題目統計資訊       |
| `selectedQuestions`      | `Question[]`               | 選中的題目列表     |
| `validationStats`        | `object`                   | 題目驗證統計       |

### 方法 (Methods)

#### 📝 基礎 CRUD

| 方法                         | 參數                 | 返回值                    | 說明               |
| ---------------------------- | -------------------- | ------------------------- | ------------------ |
| `addQuestion()`              | `type: QuestionType` | `QuestionOperationResult` | 新增題目           |
| `addQuestionAt()`            | `type, position`     | `QuestionOperationResult` | 新增題目到指定位置 |
| `addQuestionAfterSelected()` | `type`               | `QuestionOperationResult` | 在選中題目後新增   |
| `duplicateQuestion()`        | `questionId`         | `QuestionOperationResult` | 複製題目           |
| `deleteQuestion()`           | `questionId`         | `QuestionOperationResult` | 刪除題目           |

#### 🔀 移動和排序

| 方法                 | 參數                      | 返回值                    | 說明     |
| -------------------- | ------------------------- | ------------------------- | -------- |
| `moveQuestion()`     | `questionId, newPosition` | `QuestionOperationResult` | 移動題目 |
| `moveQuestionUp()`   | `questionId`              | `QuestionOperationResult` | 向上移動 |
| `moveQuestionDown()` | `questionId`              | `QuestionOperationResult` | 向下移動 |

#### 📋 剪貼簿操作

| 方法                   | 參數         | 返回值                    | 說明         |
| ---------------------- | ------------ | ------------------------- | ------------ |
| `copyToClipboard()`    | `questionId` | `QuestionOperationResult` | 複製到剪貼簿 |
| `pasteFromClipboard()` | `position?`  | `QuestionOperationResult` | 從剪貼簿貼上 |
| `clearClipboard()`     | -            | `void`                    | 清空剪貼簿   |

#### 📦 批量操作

| 方法                                | 參數         | 返回值                 | 說明         |
| ----------------------------------- | ------------ | ---------------------- | ------------ |
| `toggleBatchMode()`                 | -            | `void`                 | 切換批量模式 |
| `toggleQuestionSelection()`         | `questionId` | `void`                 | 切換題目選擇 |
| `selectAllQuestions()`              | -            | `void`                 | 選擇所有題目 |
| `clearSelection()`                  | -            | `void`                 | 清除選擇     |
| `deleteSelectedQuestions()`         | -            | `BatchOperationResult` | 批量刪除     |
| `batchUpdateSelectedQuestions()`    | `updates`    | `BatchOperationResult` | 批量更新屬性 |
| `batchDuplicateSelectedQuestions()` | -            | `BatchOperationResult` | 批量複製     |

#### 🔍 搜尋和篩選

| 方法                     | 參數       | 返回值       | 說明         |
| ------------------------ | ---------- | ------------ | ------------ |
| `searchQuestions()`      | `criteria` | `Question[]` | 搜尋題目     |
| `getQuestionsByType()`   | `type`     | `Question[]` | 獲取特定題型 |
| `getRequiredQuestions()` | -          | `Question[]` | 獲取必填題目 |
| `getInvalidQuestions()`  | -          | `Question[]` | 獲取無效題目 |

#### ⚙️ 選項管理

| 方法                         | 參數                        | 返回值                    | 說明     |
| ---------------------------- | --------------------------- | ------------------------- | -------- |
| `addOptionToQuestion()`      | `questionId, label, value?` | `QuestionOperationResult` | 新增選項 |
| `removeOptionFromQuestion()` | `questionId, optionId`      | `QuestionOperationResult` | 刪除選項 |

### 進階功能

- **事務性批量操作**：批量更新支援回滾機制，確保資料一致性
- **操作歷史追蹤**：最多保留 100 筆操作記錄
- **智慧複製貼上**：保留題目配置和驗證規則
- **選項最小數量保護**：選擇題至少保留 2 個選項

---

## 📘 Response Store (`useResponseStore`)

管理問卷填寫和回應收集的狀態，負責問卷載入、答案驗證、進度保存、提交等功能。

> ✅ **狀態**：已完成實作（Task 4.1.1）

### 狀態屬性 (State)

| 屬性              | 類型                     | 說明             | 唯讀 |
| ----------------- | ------------------------ | ---------------- | ---- |
| `currentSurvey`   | `Survey \| null`         | 當前載入的問卷   | ✅   |
| `currentResponse` | `SurveyResponse \| null` | 當前填寫回應     | ✅   |
| `isLoading`       | `boolean`                | 是否正在載入問卷 | ✅   |
| `isSubmitting`    | `boolean`                | 是否正在提交回應 | ✅   |
| `errorMessage`    | `string \| null`         | 錯誤訊息         | ✅   |

### 計算屬性 (Computed)

| 屬性                 | 類型                     | 說明                       |
| -------------------- | ------------------------ | -------------------------- |
| `questions`          | `Question[]`             | 當前問卷的所有題目         |
| `currentQuestion`    | `Question \| null`       | 當前顯示的題目             |
| `progressPercentage` | `number`                 | 填寫進度百分比             |
| `canSubmit`          | `boolean`                | 是否可以提交（必填題已填） |
| `currentAnswer`      | `QuestionAnswer \| null` | 當前題目的答案             |

### 方法 (Methods)

#### 📥 問卷載入

| 方法                   | 參數       | 返回值          | 說明           |
| ---------------------- | ---------- | --------------- | -------------- |
| `loadSurvey()`         | `surveyId` | `Promise<void>` | 載入問卷資料   |
| `initializeResponse()` | `surveyId` | `void`          | 初始化填寫回應 |

#### ✏️ 答案管理

| 方法               | 參數                | 返回值             | 說明             |
| ------------------ | ------------------- | ------------------ | ---------------- |
| `updateAnswer()`   | `questionId, value` | `void`             | 更新題目答案     |
| `validateAnswer()` | `question, value`   | `ValidationResult` | 驗證單個題目答案 |
| `validateSurvey()` | -                   | `ValidationResult` | 驗證整個問卷     |

#### 🧭 導航控制

| 方法                 | 參數    | 返回值 | 說明           |
| -------------------- | ------- | ------ | -------------- |
| `nextQuestion()`     | -       | `void` | 移動到下一題   |
| `previousQuestion()` | -       | `void` | 移動到上一題   |
| `goToQuestion()`     | `index` | `void` | 跳轉到指定題目 |

#### 📤 提交管理

| 方法               | 參數 | 返回值            | 說明         |
| ------------------ | ---- | ----------------- | ------------ |
| `submitResponse()` | -    | `Promise<string>` | 提交問卷回應 |
| `resetResponse()`  | -    | `void`            | 重置填寫狀態 |

#### 💾 進度保存

| 方法             | 參數       | 返回值    | 說明           |
| ---------------- | ---------- | --------- | -------------- |
| `saveProgress()` | -          | `void`    | 自動保存進度   |
| `loadProgress()` | `surveyId` | `boolean` | 載入保存的進度 |

### 核心功能特色

#### 🔍 智慧驗證系統

- **即時驗證**：輸入時即時檢查答案有效性
- **多層驗證**：必填、格式、業務規則驗證
- **友善錯誤提示**：具體的錯誤訊息和修正建議

#### 📊 進度追蹤

- **動態進度計算**：基於已填答題目數量
- **視覺化指示**：進度條和完成狀態標記
- **斷點續填**：LocalStorage 自動保存進度

#### 🔄 狀態同步

- **自動保存**：每次答案更新自動保存
- **記憶體管理**：合理的狀態清理機制
- **錯誤恢復**：載入失敗時的降級處理

### 類型定義

```typescript
interface QuestionAnswer {
  questionId: string;
  value: any;
  isValid: boolean;
  validationErrors: string[];
  lastModified: Date;
}

interface SurveyResponse {
  surveyId: string;
  answers: Record<string, QuestionAnswer>;
  startTime: Date;
  lastModified: Date;
  currentQuestionIndex: number;
  isSubmitted: boolean;
  submissionId?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}
```

---

## 🔧 開發指引

### Store 命名規範

- 檔案名稱：`kebab-case.ts`
- Store 名稱：`use{Name}Store`
- Store ID：`camelCase`

### 狀態設計原則

1. **唯讀保護**：對外暴露的狀態使用 `readonly()` 包裝
2. **計算屬性**：衍生狀態使用 `computed()`
3. **副作用管理**：使用 `watch()` 處理狀態變更副作用
4. **類型安全**：所有狀態和方法都要有明確類型定義

### 性能優化建議

1. **避免深度監聽**：只在必要時使用 `deep: true`
2. **防抖處理**：頻繁操作使用 debounce（如自動儲存）
3. **批量更新**：多個狀態更新合併為單次操作
4. **記憶體管理**：及時清理不需要的歷史記錄

---

## 📋 待辦事項

- [x] 完成 drag-drop.ts 的拖拽邏輯實作
- [x] 完成 questions.ts 的題型管理實作
- [x] 完成 response.ts 的問卷填寫狀態管理（Task 4.1.1）
- [ ] 實作與後端 API 的連接
- [ ] 新增單元測試
- [ ] 優化歷史記錄的記憶體使用
- [ ] 實作離線編輯功能
- [ ] 建立拖放 UI 組件
- [ ] 整合 stores 與 Vue 組件
- [ ] 實作 response.ts 的後端提交 API 整合

---

## 🔗 相關文件

- [問卷建構器任務文件](../../../docs/tasks/phase1/3-survey-builder.md)
- [Survey & Question 類型定義](../../../packages/shared/src/types/)
- [API 參考文件](../../../smartsurvey-api-reference.md#問卷-apis)

---

_此文件會隨著開發進度持續更新_
