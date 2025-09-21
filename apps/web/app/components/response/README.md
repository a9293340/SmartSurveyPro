# 📝 Response 目錄 - 問卷填寫組件

> 📁 **目錄作用**：問卷填寫和回應收集相關組件
>
> 📅 **最後更新**：2025-01-21
>
> 🎯 **負責功能**：提供完整的問卷填寫體驗，包括渲染、驗證、提交

## 📋 包含檔案清單

### 🏗️ 主要組件

| 檔案名稱                | 功能說明           | 狀態      | 依賴關係         |
| ----------------------- | ------------------ | --------- | ---------------- |
| `SurveyRenderer.vue`    | 問卷渲染引擎主組件 | ✅ 已完成 | useResponseStore |
| `QuestionRenderer.vue`  | 通用題目渲染組件   | ✅ 已完成 | 動態輸入組件     |
| `ProgressIndicator.vue` | 進度指示器組件     | ✅ 已完成 | useResponseStore |
| `QuestionProgress.vue`  | 題目進度概覽組件   | ✅ 已完成 | useResponseStore |

### 🎨 輸入組件

| 檔案名稱                         | 功能說明       | 狀態      | 支援功能                 |
| -------------------------------- | -------------- | --------- | ------------------------ |
| `inputs/TextShortInput.vue`      | 短文字輸入組件 | ✅ 已完成 | 字數限制、即時驗證       |
| `inputs/TextLongInput.vue`       | 長文字輸入組件 | ✅ 已完成 | 多行輸入、字數統計       |
| `inputs/SingleChoiceInput.vue`   | 單選題輸入組件 | ✅ 已完成 | 選項選擇、其他選項支援   |
| `inputs/MultipleChoiceInput.vue` | 多選題輸入組件 | ✅ 已完成 | 多選邏輯、最大選擇數限制 |
| `inputs/RatingInput.vue`         | 評分題輸入組件 | ✅ 已完成 | 星級評分、數字評分模式   |
| `inputs/UnsupportedInput.vue`    | 不支援題型組件 | ✅ 已完成 | 錯誤提示、題目內容顯示   |

## 🔧 架構設計說明

### 📐 組件層次結構

```
SurveyRenderer (主容器)
├── ProgressIndicator (進度指示器)
│   ├── 進度百分比顯示
│   ├── 預估剩餘時間
│   └── 完成狀態提示
├── QuestionProgress (題目進度概覽)
│   ├── 可折疊題目列表
│   ├── 題目狀態指示
│   └── 快速導航功能
├── 顯示模式切換 (單題/全部)
├── QuestionRenderer (題目渲染器)
│   └── Dynamic Input Components (動態輸入組件)
│       ├── TextShortInput
│       ├── TextLongInput
│       ├── SingleChoiceInput
│       ├── MultipleChoiceInput
│       ├── RatingInput
│       └── UnsupportedInput
└── 導航和提交控制
```

### 🎯 設計原則

1. **組件化設計**：每個題型都有獨立的輸入組件
2. **動態載入**：根據題型動態載入對應組件
3. **狀態統一管理**：使用 useResponseStore 管理所有填寫狀態
4. **響應式設計**：適配桌面、平板、手機三種螢幕
5. **無障礙支援**：完整的鍵盤導航和螢幕閱讀器支援

### 🔄 數據流向

```
使用者操作 → Input 組件 → QuestionRenderer → SurveyRenderer → ResponseStore → API
                ↓
            即時驗證 ← ValidationEngine ← ResponseStore
                ↓
            自動保存 ← LocalStorage ← ResponseStore
```

## 🚀 核心功能特色

### 📱 雙模式顯示

1. **單題模式**：
   - 逐題填寫，專注體驗
   - 進度指示和題目導航
   - 上一題/下一題按鈕

2. **全部顯示模式**：
   - 一頁顯示所有題目
   - 適合快速瀏覽和填寫
   - 缺失題目自動提醒

### ✅ 即時驗證系統

- **前端驗證**：即時檢查輸入格式和長度
- **業務規則驗證**：必填、選擇數量限制等
- **錯誤提示**：友善的錯誤訊息顯示
- **視覺回饋**：驗證狀態的顏色指示

### 💾 進度保存機制

- **自動保存**：每次輸入後自動保存到 localStorage
- **斷點續填**：重新進入可恢復上次進度
- **跨設備同步**：(Future) 登入後雲端同步

### 📊 智能進度追蹤

- **智能進度計算**：基於已填寫題目和必填題權重的動態計算
- **預估完成時間**：根據平均作答時間預測剩餘時間
- **題目狀態管理**：已完成/進行中/未開始/必填缺失四種狀態
- **快速導航**：一鍵跳轉到下一個未完成或第一個必填題目
- **可折疊概覽**：詳細的題目進度列表，支援展開/收合
- **視覺化指示**：進度條、狀態圖示、顏色標示的完整視覺回饋

## 🎨 樣式設計

### 🎭 主題色彩

- **主色調**：藍色系 (Blue-600)
- **成功色**：綠色系 (Green-600)
- **警告色**：黃色系 (Amber-600)
- **錯誤色**：紅色系 (Red-600)
- **中性色**：灰色系 (Gray-100 到 Gray-900)

### 📐 響應式設計

```css
/* 桌面端 (>1024px) */
-最大寬度: 1024px - 三欄式佈局 - 大按鈕和間距 /* 平板端 (768px-1024px) */ -
  兩欄式佈局 - 中等按鈕和間距 /* 手機端 (<768px) */ - 單欄佈局 - 大觸控按鈕 -
  簡化導航;
```

### 🎯 無障礙支援

- **鍵盤導航**：Tab 順序邏輯清晰
- **螢幕閱讀器**：完整的 ARIA 標籤
- **對比度**：符合 WCAG 2.1 AA 標準
- **焦點指示**：清晰的焦點視覺回饋

## 🔧 開發指引

### 📝 新增題型輸入組件

1. **建立組件檔案**：`inputs/NewTypeInput.vue`
2. **實作標準介面**：

   ```typescript
   interface Props {
     question: Question;
     value?: any;
     error?: string;
   }

   interface Emits {
     (e: 'update:value', value: any): void;
   }
   ```

3. **註冊到映射表**：在 `QuestionRenderer.vue` 的 `componentMap` 中添加
4. **新增驗證邏輯**：在 `ResponseStore` 的 `validateAnswer` 方法中添加
5. **撰寫測試**：確保輸入和驗證邏輯正確

### 🧪 測試策略

```typescript
// 組件測試重點
describe('QuestionRenderer', () => {
  test('正確渲染不同題型', () => {
    // 測試動態組件載入
  });

  test('值更新正確傳遞', () => {
    // 測試 value 更新事件
  });

  test('驗證錯誤正確顯示', () => {
    // 測試錯誤狀態顯示
  });
});

// Store 測試重點
describe('ResponseStore', () => {
  test('答案更新和驗證', () => {
    // 測試狀態管理邏輯
  });

  test('進度保存和載入', () => {
    // 測試 localStorage 操作
  });
});
```

### ⚡ 效能優化

1. **懶加載**：輸入組件使用 `defineAsyncComponent`
2. **記憶化**：使用 `computed` 快取計算結果
3. **防抖**：輸入事件使用防抖處理
4. **虛擬化**：長問卷使用虛擬滾動 (Future)

## 🎯 使用範例

### 基礎使用

```vue
<template>
  <!-- 在任何頁面中使用 -->
  <SurveyRenderer :survey-id="surveyId" />
</template>

<script setup>
// 傳入問卷 ID 即可自動載入和渲染
const surveyId = 'survey-123';
</script>
```

### 進階配置

```vue
<template>
  <SurveyRenderer
    :survey-id="surveyId"
    @submit="handleSubmit"
    @progress="handleProgress"
  />
</template>

<script setup>
function handleSubmit(submissionId) {
  // 處理提交成功
  console.log('提交成功:', submissionId);
}

function handleProgress(percentage) {
  // 處理進度變化
  console.log('進度:', percentage);
}
</script>
```

## 📈 未來擴展計劃

### Phase 2 功能

- [ ] 更多題型支援 (日期、檔案上傳、簽名等)
- [ ] 邏輯跳轉引擎
- [ ] 題目依賴關係
- [ ] 動態選項載入

### Phase 3 功能

- [ ] 離線填寫支援
- [ ] 即時協作填寫
- [ ] 智能自動填寫建議
- [ ] 填寫行為分析

## 📝 更新規範

### 🔄 何時更新本 README

- ✅ 新增輸入組件時：更新檔案清單和功能說明
- ✅ 修改核心架構時：更新架構設計說明
- ✅ 新增功能特色時：更新功能列表
- ✅ 變更使用方式時：更新使用範例
- ✅ 完成功能開發時：更新狀態標記

### 📋 維護檢查清單

- [ ] 檔案清單是否完整反映組件？
- [ ] 功能說明是否準確描述實際功能？
- [ ] 架構圖是否與實際實作一致？
- [ ] 使用範例是否可運行且正確？
- [ ] 未來計劃是否符合產品規劃？

## 🎓 學習資源

### 📚 相關文檔

- [Response Store 狀態管理](/apps/web/app/stores/response.ts)
- [問卷填寫頁面](/apps/web/app/pages/survey/[id].vue)
- [狀態管理深度解析](/docs/tutorials/state-management-guide.md)

### 🔗 外部資源

- [Vue 3 動態組件](https://vuejs.org/guide/essentials/component-basics.html#dynamic-components)
- [Pinia 狀態管理](https://pinia.vuejs.org/)
- [無障礙設計指南](https://www.w3.org/WAI/WCAG21/quickref/)

---

**最後更新者**：Claude **更新日期**：2025-01-21
**下次檢查**：新增輸入組件或進度功能時
