# Previews 題目預覽組件目錄

> 📁 **目錄作用**：各種題型的預覽顯示組件
>
> 📅 **最後更新**：2025-01-20
>
> 🎯 **負責功能**：在問卷建構器中提供題目的即時預覽效果

## 📋 目錄規劃

### 🚧 計劃實作的預覽組件

| 題型     | 組件檔名                    | 狀態      | 優先級 |
| -------- | --------------------------- | --------- | ------ |
| 單選題   | `MultipleChoicePreview.vue` | 🔄 計劃中 | P0     |
| 多選題   | `CheckboxPreview.vue`       | 🔄 計劃中 | P0     |
| 文字題   | `TextInputPreview.vue`      | 🔄 計劃中 | P0     |
| 長文字   | `TextareaPreview.vue`       | 🔄 計劃中 | P1     |
| 數字題   | `NumberInputPreview.vue`    | 🔄 計劃中 | P1     |
| 評分題   | `RatingPreview.vue`         | 🔄 計劃中 | P2     |
| 日期題   | `DatePickerPreview.vue`     | 🔄 計劃中 | P2     |
| 檔案上傳 | `FileUploadPreview.vue`     | 🔄 計劃中 | P3     |
| 矩陣題   | `MatrixPreview.vue`         | 🔄 計劃中 | P3     |

## 🎯 設計原則

### 1. 預覽即所得 (WYSIWYG)

- 預覽組件必須與最終填寫體驗完全一致
- 包含相同的樣式、布局和交互效果
- 支援響應式設計預覽

### 2. 只讀展示

```typescript
// 所有預覽組件的通用原則
const isPreviewMode = true; // 永遠為 true
const disabled = true; // 禁用所有交互
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
  showValidation?: boolean; // 顯示驗證提示
  compact?: boolean; // 緊湊模式
}
```

### 統一事件系統

```typescript
// 預覽組件不觸發任何變更事件
// 只用於顯示，不處理用戶輸入
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

### MultipleChoicePreview.vue

**顯示內容：**

- 題目標題和描述
- 單選按鈕選項列表
- 預設選中狀態（如有）
- 必填星號提示

**特殊處理：**

- 選項過多時的滾動處理
- 圖片選項的預覽顯示
- 其他選項的輸入框展示

### CheckboxPreview.vue

**顯示內容：**

- 題目標題和描述
- 複選框選項列表
- 最大選擇數量提示
- 必填驗證提示

**特殊處理：**

- 選項限制的視覺提示
- 分組選項的層級顯示

### TextInputPreview.vue

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

### Phase 1: 基礎題型 (當前)

- [x] 架構設計完成
- [ ] MultipleChoicePreview
- [ ] CheckboxPreview
- [ ] TextInputPreview

### Phase 2: 進階題型

- [ ] TextareaPreview
- [ ] NumberInputPreview
- [ ] RatingPreview

### Phase 3: 複雜題型

- [ ] DatePickerPreview
- [ ] FileUploadPreview
- [ ] MatrixPreview

## 📝 實作檢查清單

### 新增預覽組件時

- [ ] 實作對應的 Vue 組件
- [ ] 新增到動態組件對應表
- [ ] 測試各種屬性配置的預覽效果
- [ ] 確保響應式設計正確
- [ ] 更新此 README 的狀態

### 測試要點

- [ ] 屬性變更的即時反映
- [ ] 不同螢幕尺寸的顯示效果
- [ ] 極端資料的處理（長文字、大量選項）
- [ ] 無障礙功能的支援

---

**最後更新者**：Claude AI Assistant **下次檢查**：實作第一個預覽組件時
