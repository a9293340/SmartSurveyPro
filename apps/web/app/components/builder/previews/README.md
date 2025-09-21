# Previews 題目預覽組件目錄

> 📁 **目錄作用**：各種題型的預覽顯示組件
>
> 📅 **最後更新**：2025-01-21
>
> 🎯 **負責功能**：在問卷建構器中提供題目的即時預覽效果

## 📋 目錄規劃

### ✅ 已完成的預覽組件

| 題型     | 組件檔名                            | 狀態      | 優先級 | 設計特色                         |
| -------- | ----------------------------------- | --------- | ------ | -------------------------------- |
| 單選題   | `QuestionSingleChoicePreview.vue`   | ✅ 完成   | P0     | 單選按鈕、圖片支援、其他選項     |
| 多選題   | `QuestionMultipleChoicePreview.vue` | ✅ 完成   | P0     | 複選框、數量限制、智能驗證       |
| 短文字   | `QuestionTextShortPreview.vue`      | ✅ 完成   | P0     | 格式驗證、字數限制、多種輸入類型 |
| 長文字   | `QuestionTextLongPreview.vue`       | ✅ 完成   | P1     | 多行文字框、動態高度、字數統計   |
| 評分題   | `QuestionRatingPreview.vue`         | ✅ 完成   | P2     | 星級評分、數字、等級多種模式     |
| 日期題   | -                                   | 🔄 計劃中 | P2     | 待開發                           |
| 檔案上傳 | -                                   | 🔄 計劃中 | P3     | 待開發                           |
| 矩陣題   | -                                   | 🔄 計劃中 | P3     | 待開發                           |

## 🎯 設計原則

### 1. 預覽即所得 (WYSIWYG)

- 預覽組件必須與最終填寫體驗完全一致
- 包含相同的樣式、布局和交互效果
- 支援響應式設計預覽

### 2. 可交互預覽

```typescript
// 新的設計：支援互動預覽，但有不同模式
interface PreviewProps {
  question: Question;
  value?: any; // 當前值
  error?: string; // 驗證錯誤
  readonly?: boolean; // 只讀模式
  previewMode?: boolean; // 預覽模式（隱藏編輯工具）
}
```

### 3. 即時更新

- 監聽題目屬性變更
- 自動重新渲染預覽內容
- 保持與屬性編輯的同步

## 🔧 組件架構設計

### 通用 Props 介面

```typescript
interface PreviewProps {
  question: Question; // 題目完整資料
  value?: any; // 當前輸入值
  error?: string; // 驗證錯誤訊息
  readonly?: boolean; // 是否只讀
  previewMode?: boolean; // 是否預覽模式（控制 UI 元素顯示）
}
```

### 統一事件系統

```typescript
// 預覽組件支援互動事件
const emit = defineEmits<{
  updateQuestion: [questionId: string, updates: Partial<Question>]; // 更新題目配置
  update: [value: any]; // 更新輸入值
}>();
```

### 共用樣式系統

```scss
// 預覽組件統一樣式前綴
.preview-question {
  &__container {
    /* 容器樣式 */
  }
  &__title {
    /* 題目標題 */
  }
  &__description {
    /* 題目描述 */
  }
  &__content {
    /* 題目內容 */
  }
  &__validation {
    /* 驗證訊息 */
  }
}
```

## 📝 各題型預覽規格

### QuestionSingleChoicePreview.vue

**實際檔案位置**：`QuestionSingleChoicePreview.vue`

**顯示內容：**

- 題目標題和描述
- 單選按鈕選項列表
- 預設選中狀態（如有）
- 必填星號提示

**特殊處理：**

- 選項過多時的滾動處理
- 圖片選項的預覽顯示
- 其他選項的輸入框展示

### QuestionMultipleChoicePreview.vue

**實際檔案位置**：`QuestionMultipleChoicePreview.vue`

**顯示內容：**

- 題目標題和描述
- 複選框選項列表
- 最大選擇數量提示
- 必填驗證提示

**特殊處理：**

- 選項限制的視覺提示
- 分組選項的層級顯示

### QuestionTextShortPreview.vue

**實際檔案位置**：`QuestionTextShortPreview.vue`

**顯示內容：**

- 題目標題和描述
- 文字輸入框
- 字數限制提示
- 格式驗證提示（如：Email）

**特殊處理：**

- 不同輸入類型的展示
- 即時字數統計顯示

## 🔄 與建構器的整合

### 在 QuestionCard 中使用

```vue
<template>
  <div class="question-card">
    <!-- 題目管理工具列 -->
    <QuestionToolbar />

    <!-- 動態預覽組件 -->
    <component
      :is="getPreviewComponent(question.type)"
      :question="question"
      :show-validation="showValidation"
    />
  </div>
</template>
```

### 動態組件載入

```typescript
function getPreviewComponent(questionType: QuestionType) {
  const componentMap = {
    [QuestionType.MULTIPLE_CHOICE]: 'MultipleChoicePreview',
    [QuestionType.CHECKBOX]: 'CheckboxPreview',
    [QuestionType.TEXT]: 'TextInputPreview',
    // ... 其他題型對應
  };

  return componentMap[questionType] || 'DefaultPreview';
}
```

## 🎨 視覺設計指南

### 狀態指示

- **正常狀態**：標準顏色和透明度
- **驗證錯誤**：紅色邊框和錯誤訊息
- **必填提示**：紅色星號標記
- **禁用狀態**：灰色背景和減少透明度

### 響應式斷點

```scss
// 手機版 (< 768px)
.preview-question {
  padding: 1rem;
  font-size: 0.875rem;
}

// 平板版 (≥ 768px)
.preview-question {
  padding: 1.5rem;
  font-size: 1rem;
}

// 桌面版 (≥ 1024px)
.preview-question {
  padding: 2rem;
  font-size: 1rem;
}
```

## 🚀 開發優先級和時程

### Phase 1: 基礎題型 (已完成)

- [x] 架構設計完成
- [x] QuestionSingleChoicePreview - 單選題
- [x] QuestionMultipleChoicePreview - 多選題
- [x] QuestionTextShortPreview - 短文字
- [x] QuestionTextLongPreview - 長文字
- [x] QuestionRatingPreview - 評分題

### Phase 2: 進階題型 (待開發)

- [ ] QuestionDatePreview - 日期選擇題
- [ ] QuestionFileUploadPreview - 檔案上傳題
- [ ] QuestionNumberPreview - 數字輸入題

### Phase 3: 複雜題型 (待開發)

- [ ] QuestionMatrixPreview - 矩陣題
- [ ] QuestionRankingPreview - 排序題
- [ ] QuestionSliderPreview - 滑桿題

## 📝 實作檢查清單

### 新增預覽組件時

- [x] 實作對應的 Vue 組件
- [x] 新增到動態組件對應表 (SurveyPreview.vue)
- [x] 測試各種屬性配置的預覽效果
- [x] 確保響應式設計正確
- [x] 更新此 README 的狀態

### 測試要點

- [x] 屬性變更的即時反映
- [x] 不同螢幕尺寸的顯示效果
- [x] 極端資料的處理（長文字、大量選項）
- [x] 表單驗證和互動效果
- [x] 多題分頁導航功能

---

## 🎆 完成成果

目前已完成了完整的問卷預覽系統，包括：

- **SurveyPreview.vue** - 主預覽組件，支援多題分頁、驗證、進度顯示
- **5 種題型預覽組件** - 完整的題型支援和互動驗證
- **完整的表單驗證系統** - 支援必填、字數限制、選擇數量限制等
- **響應式設計** - 支援手機、平板、桌面各種螢幕

**最後更新者**：Claude AI Assistant **更新日期**：2025-01-21
