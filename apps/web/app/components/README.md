# 📦 Components 目錄

> 📁 **目錄作用**：前端 Vue 組件庫，包含所有可重用的 UI 組件
>
> 📅 **最後更新**：2025-01-21
>
> 🎯 **負責功能**：組件化 UI 開發，確保代碼重用性和維護性

## 📋 包含檔案清單

### 🏗️ 問卷建構器組件

| 檔案名稱                    | 功能說明       | 狀態      | 依賴關係         |
| --------------------------- | -------------- | --------- | ---------------- |
| `builder/SurveyCanvas.vue`  | 問卷畫布主容器 | ✅ 已完成 | useBuilderStore  |
| `builder/QuestionCard.vue`  | 題目卡片組件   | ✅ 已完成 | useDragDropStore |
| `builder/PropertyPanel.vue` | 屬性設定面板   | ✅ 已完成 | useBuilderStore  |
| `builder/DropZone.vue`      | 拖放區域組件   | ✅ 已完成 | useDragDropStore |
| `builder/SurveyPreview.vue` | 問卷預覽組件   | ✅ 已完成 | useBuilderStore  |

### 🎨 題型預覽組件

| 檔案名稱                                             | 功能說明   | 狀態      | 支援功能           |
| ---------------------------------------------------- | ---------- | --------- | ------------------ |
| `builder/previews/QuestionSingleChoicePreview.vue`   | 單選題預覽 | ✅ 已完成 | 選項管理、驗證     |
| `builder/previews/QuestionMultipleChoicePreview.vue` | 多選題預覽 | ✅ 已完成 | 多選邏輯、限制設定 |
| `builder/previews/QuestionTextShortPreview.vue`      | 短文字預覽 | ✅ 已完成 | 字數限制、格式驗證 |
| `builder/previews/QuestionTextLongPreview.vue`       | 長文字預覽 | ✅ 已完成 | 多行輸入、自動調整 |
| `builder/previews/QuestionRatingPreview.vue`         | 評分題預覽 | ✅ 已完成 | 星級評分、數字範圍 |

### ⚙️ 屬性設定組件

| 檔案名稱                                    | 功能說明         | 狀態      | 管理範圍         |
| ------------------------------------------- | ---------------- | --------- | ---------------- |
| `builder/properties/SurveyProperties.vue`   | 問卷全域設定面板 | ✅ 已完成 | 標題、描述、設定 |
| `builder/properties/QuestionProperties.vue` | 題目屬性設定面板 | ✅ 已完成 | 題目配置、驗證   |

### 🧩 工具組件

| 檔案名稱                        | 功能說明     | 狀態      | 使用場景     |
| ------------------------------- | ------------ | --------- | ------------ |
| `builder/QuestionTypePanel.vue` | 題型選擇面板 | ✅ 已完成 | 拖拽新增題目 |

## 🔧 目錄結構說明

```
components/
├── builder/                    # 問卷建構器相關組件
│   ├── previews/              # 題型預覽組件 [5個]
│   ├── properties/            # 屬性設定組件 [2個]
│   ├── SurveyCanvas.vue       # 主畫布容器
│   ├── QuestionCard.vue       # 題目卡片
│   ├── PropertyPanel.vue      # 動態屬性面板
│   ├── DropZone.vue          # 拖放目標區域
│   ├── SurveyPreview.vue     # 問卷預覽
│   ├── QuestionTypePanel.vue # 題型選擇器
│   └── README.md             # 建構器組件說明
└── README.md                 # 本檔案
```

## 🎯 組件設計原則

### 📦 組件分類策略

1. **功能模組化**：按業務功能分組 (builder/, forms/, common/)
2. **職責單一化**：每個組件只負責特定功能
3. **高度可重用**：通過 Props 和 Events 實現靈活配置
4. **類型安全**：完整的 TypeScript 接口定義

### 🔄 組件通訊模式

```typescript
// 🎯 Props Down, Events Up 模式
<QuestionCard
  :question="question"              // Props 向下傳遞數據
  @update="handleQuestionUpdate"    // Events 向上傳遞操作
  @delete="handleQuestionDelete"
/>

// 🏪 Store 共享狀態
const { selectedQuestionId, selectQuestion } = useBuilderStore();
```

### 🎨 樣式管理策略

1. **Tailwind CSS**：統一的工具類別系統
2. **Scoped Styles**：組件級樣式隔離
3. **CSS Modules**：複雜樣式的模組化管理
4. **響應式設計**：mobile-first 響應式實作

## 🚀 開發指引

### 📝 新增組件流程

1. **確定組件類型**：功能組件 vs 展示組件
2. **定義接口**：Props、Events、Slots 設計
3. **實作組件**：遵循 Composition API 模式
4. **添加類型**：完整的 TypeScript 支援
5. **撰寫測試**：單元測試覆蓋關鍵功能
6. **更新文檔**：同步更新本 README

### 🔧 組件開發模板

```vue
<template>
  <div class="component-name">
    <!-- 組件內容 -->
  </div>
</template>

<script setup lang="ts">
// 📋 類型定義
interface Props {
  // 定義 Props 類型
}

interface Emits {
  // 定義 Events 類型
}

// 🎯 Props 和 Emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

// 🏪 Store 使用
const store = useRelatedStore();

// 🔄 響應式邏輯
const computedValue = computed(() => {
  // 計算邏輯
});

// 🚀 方法定義
function handleAction() {
  // 操作邏輯
}
</script>
```

### 🧪 測試策略

1. **Props 測試**：驗證 Props 正確渲染
2. **Events 測試**：確認事件正確觸發
3. **Store 整合**：測試狀態管理互動
4. **響應式測試**：驗證響應式邏輯
5. **可訪問性測試**：確保無障礙支援

## 📈 效能優化

### ⚡ 組件優化策略

1. **懶加載**：使用 `defineAsyncComponent` 動態載入
2. **記憶化**：使用 `computed` 快取計算結果
3. **事件優化**：防抖和節流處理
4. **虛擬化**：長列表使用虛擬滾動

### 🎯 Bundle 優化

1. **Tree Shaking**：移除未使用的組件
2. **代碼分割**：按路由和功能分割
3. **壓縮優化**：生產環境壓縮
4. **CDN 使用**：靜態資源 CDN 加速

## 📝 更新規範

### 🔄 何時更新本 README

- ✅ 新增組件時：添加到檔案清單
- ✅ 修改組件功能時：更新功能說明
- ✅ 變更組件依賴時：更新依賴關係
- ✅ 組件狀態變更時：更新完成狀態
- ✅ 目錄結構變更時：更新結構說明

### 📋 維護檢查清單

- [ ] 檔案清單是否完整反映當前組件？
- [ ] 功能說明是否準確描述實際功能？
- [ ] 依賴關係是否正確標記？
- [ ] 狀態標記是否與開發進度一致？
- [ ] 開發指引是否反映最新實踐？

## 🎓 學習資源

### 📚 相關文檔

- [Vue 3 組件基礎](https://vuejs.org/guide/components/)
- [Composition API 指南](https://vuejs.org/guide/composition-api/)
- [TypeScript 與 Vue](https://vuejs.org/guide/typescript/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)

### 🔗 專案相關

- [狀態管理深度解析](/docs/tutorials/state-management-guide.md)
- [問卷建構器組件說明](./builder/README.md)
- [專案技術棧指南](/docs/tech-stack-guide.md)

---

**最後更新者**：Claude **下次檢查**：新增組件時
