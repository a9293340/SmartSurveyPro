# 🏪 狀態管理深度解析 - Pinia Store 完整教學

> 🎯 **學習目標**：深度理解前端狀態管理原理，掌握 Pinia 在企業專案中的應用 ⏱️
> **預估時間**：45 分鐘 📋 **前置知識**：Vue 3 基礎、TypeScript 基礎、組件概念

---

## 🧠 核心概念解析

### 🤔 為什麼需要狀態管理？

想像一下沒有狀態管理的痛苦場景：

```vue
<!-- ❌ Props Drilling 地獄 -->
<template>
  <GrandParent>
    <Parent :survey="survey" @update-survey="updateSurvey">
      <Child :survey="survey" @update-survey="updateSurvey">
        <GrandChild :survey="survey" @update-survey="updateSurvey">
          <!-- 最終使用 survey 的地方 -->
        </GrandChild>
      </Child>
    </Parent>
  </GrandParent>
</template>
```

**問題分析：**

- 🔴 中間層組件被迫傳遞不相關的數據
- 🔴 修改數據流需要層層傳遞事件
- 🔴 組件間耦合度過高，難以維護
- 🔴 無法跨組件樹分支共享狀態

### 🏪 Store：前端的「資料倉庫」

Store 就像現實中的倉庫管理系統：

```typescript
// 🏪 倉庫管理員（Store）
export const useInventoryStore = defineStore('inventory', () => {
  // 📦 庫存清單（State）
  const products = ref<Product[]>([]);

  // 📊 統計報告（Computed）
  const totalValue = computed(() =>
    products.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
  );

  // 🚚 進貨出貨（Actions）
  function addProduct(product: Product) {
    products.value.push(product);
  }

  function removeProduct(id: string) {
    const index = products.value.findIndex(p => p.id === id);
    if (index > -1) products.value.splice(index, 1);
  }

  return { products, totalValue, addProduct, removeProduct };
});
```

**Store 的三大要素：**

1. **State（狀態）**：資料的當前狀態 📦
2. **Computed（計算屬性）**：基於狀態的衍生數據 📊
3. **Actions（動作）**：修改狀態的方法 🚚

---

## 🔍 SmartSurvey Pro 實例剖析

### 📝 問卷建構器狀態管理架構

我們的專案採用 **多 Store 分離** 的架構：

```
StateManagement/
├── useBuilderStore    # 🏗️ 編輯器核心狀態
├── useQuestionsStore  # ❓ 題目管理
├── useDragDropStore   # 🖱️ 拖拽操作
└── (未來擴展...)
```

### 🏗️ BuilderStore 深度剖析

讓我們分析 `useBuilderStore` 的實際實作：

```typescript
// /apps/web/app/stores/builder.ts
export const useBuilderStore = defineStore('builder', () => {
  // 🏠 核心狀態 (State)
  const currentSurvey = ref<Survey | null>(null); // 當前編輯的問卷
  const selectedQuestionId = ref<string | null>(null); // 選中的題目
  const isPreviewMode = ref(false); // 預覽模式
  const hasUnsavedChanges = ref(false); // 未儲存標記
  const isLoading = ref(false); // 載入狀態

  // 📊 計算屬性 (Computed)
  const questions = computed(() => currentSurvey.value?.questions || []);
  const selectedQuestion = computed(() =>
    questions.value.find(q => q.id === selectedQuestionId.value)
  );
  const questionCount = computed(() => questions.value.length);

  // 🚀 動作方法 (Actions)
  function selectQuestion(questionId: string | null) {
    selectedQuestionId.value = questionId;
    console.warn('[Builder] 選中題目:', questionId);
  }

  function togglePreviewMode() {
    isPreviewMode.value = !isPreviewMode.value;
    console.warn('[Builder] 切換預覽模式:', isPreviewMode.value);
  }

  // 返回公開接口
  return {
    // State
    currentSurvey,
    selectedQuestionId,
    isPreviewMode,
    hasUnsavedChanges,
    isLoading,
    // Computed
    questions,
    selectedQuestion,
    questionCount,
    // Actions
    selectQuestion,
    togglePreviewMode,
  };
});
```

**🔍 設計亮點分析：**

1. **單一職責**：只管理編輯器相關狀態，不處理題目數據
2. **響應式連動**：`selectedQuestion` 自動跟隨 `selectedQuestionId` 變化
3. **狀態隔離**：每個功能模組都有獨立的 Store
4. **類型安全**：完整的 TypeScript 類型定義

### 🖱️ DragDropStore 拖拽管理

```typescript
// 拖拽操作的專用 Store
export const useDragDropStore = defineStore('dragDrop', () => {
  // 🎯 拖拽狀態
  const isDragging = ref(false);
  const dragItem = ref<DragItem | null>(null);
  const dropZone = ref<DropZone | null>(null);

  // 🚀 拖拽動作
  function startDrag(item: DragItem) {
    isDragging.value = true;
    dragItem.value = item;
  }

  function endDrag() {
    isDragging.value = false;
    dragItem.value = null;
    dropZone.value = null;
  }

  return { isDragging, dragItem, dropZone, startDrag, endDrag };
});
```

---

## 🌐 多用戶環境下的 Store 運作

### 🏠 每個用戶都有獨立的「個人倉庫」

這是很多人容易混淆的概念。讓我們用生活化的比喻：

```
🏢 大樓（應用程式）
├── 📱 用戶 A 的公寓（瀏覽器會話 A）
│   ├── 🏪 個人倉庫 A（Store A）
│   ├── 📝 問卷草稿 A
│   └── 🎨 編輯狀態 A
│
├── 📱 用戶 B 的公寓（瀏覽器會話 B）
│   ├── 🏪 個人倉庫 B（Store B）
│   ├── 📝 問卷草稿 B
│   └── 🎨 編輯狀態 B
│
└── 🔒 完全隔離！互不干擾！
```

### ⏱️ Store 生命週期詳解

```typescript
// 🔄 完整生命週期演示
function demonstrateStoreLifecycle() {
  // 1️⃣ 用戶打開瀏覽器，訪問應用
  console.log('1. 用戶進入應用');

  // 2️⃣ Vue 應用初始化
  console.log('2. Vue 應用啟動');

  // 3️⃣ 第一次使用 Store 時才創建（懶加載）
  const builderStore = useBuilderStore(); // 🆕 Store 誕生！
  console.log('3. BuilderStore 創建完成');

  // 4️⃣ 用戶操作期間，Store 保持活躍
  builderStore.selectQuestion('question-1');
  builderStore.togglePreviewMode();
  console.log('4. Store 狀態管理運行中...');

  // 5️⃣ 用戶關閉頁面/標籤
  window.addEventListener('beforeunload', () => {
    console.log('5. 用戶關閉頁面，Store 即將銷毀');
    // 💥 Store 實例自動銷毀，記憶體回收
  });
}
```

**⚠️ 重要提醒：Store 不會跨會話保存！**

```typescript
// ❌ 錯誤期待
用戶關閉頁面 → 重新打開 → Store 狀態還在？ // NO！

// ✅ 實際情況
用戶關閉頁面 → Store 銷毀 → 重新打開 → 全新空白 Store
```

### 💾 持久化策略

如果需要跨會話保存狀態：

```typescript
// 🔄 自動保存到 localStorage
export const useBuilderStore = defineStore('builder', () => {
  const currentSurvey = ref<Survey | null>(null);

  // 👀 監聽狀態變化，自動保存
  watch(
    currentSurvey,
    newSurvey => {
      if (newSurvey) {
        localStorage.setItem('draft-survey', JSON.stringify(newSurvey));
        console.warn('[Builder] 草稿已自動保存');
      }
    },
    { deep: true }
  );

  // 🔄 應用啟動時恢復狀態
  function restoreFromStorage() {
    const saved = localStorage.getItem('draft-survey');
    if (saved) {
      currentSurvey.value = JSON.parse(saved);
      console.warn('[Builder] 已恢復上次的草稿');
    }
  }

  return { currentSurvey, restoreFromStorage };
});
```

---

## 🚀 組件中的 Store 使用模式

### 📖 基礎使用方式

```vue
<!-- SurveyCanvas.vue -->
<template>
  <div class="survey-canvas">
    <!-- 響應式顯示題目 -->
    <div v-for="question in questions" :key="question.id">
      <QuestionCard
        :question="question"
        :selected="question.id === selectedQuestionId"
        @click="selectQuestion(question.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// 🎯 獲取 Store 實例
const {
  questions, // 計算屬性，自動響應
  selectedQuestionId, // 響應式狀態
  selectQuestion, // 動作方法
} = useBuilderStore();

// ✨ 就這麼簡單！不需要 props 或 emit
</script>
```

### 🔄 跨組件通訊實例

```vue
<!-- PropertyPanel.vue -->
<script setup lang="ts">
const { selectedQuestion, updateQuestion } = useBuilderStore();

// 🎯 修改選中題目的屬性
function updateTitle(newTitle: string) {
  if (selectedQuestion.value) {
    updateQuestion(selectedQuestion.value.id, { title: newTitle });
    // ✨ SurveyCanvas 會自動同步更新！
  }
}
</script>
```

### 🎭 組合多個 Store

```vue
<!-- QuestionCard.vue -->
<script setup lang="ts">
// 🎯 同時使用多個 Store
const builderStore = useBuilderStore();
const dragDropStore = useDragDropStore();

// 🖱️ 處理拖拽開始
function handleDragStart(question: Question) {
  dragDropStore.startDrag({
    type: DragItemType.EXISTING_QUESTION,
    data: { questionId: question.id },
  });

  builderStore.selectQuestion(question.id);
}
</script>
```

---

## ✋ 動手實踐：建立自己的 Store

現在輪到你了！讓我們建立一個簡單的通知系統 Store：

### 🎯 練習目標

建立一個 `useNotificationStore`，具備以下功能：

- 顯示成功、警告、錯誤通知
- 自動消失的倒計時
- 手動關閉通知

### 📝 起始框架

```typescript
// /stores/notification.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number; // 毫秒，0 表示不自動關閉
  timestamp: Date;
}

export const useNotificationStore = defineStore('notification', () => {
  // 🏠 狀態定義
  const notifications = ref<Notification[]>([]);

  // 📊 計算屬性
  const notificationCount = computed(() => notifications.value.length);
  const hasNotifications = computed(() => notificationCount.value > 0);

  // TODO(human): 實作以下方法

  /**
   * 新增通知
   * @param notification 通知內容
   */
  function addNotification(
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) {
    // TODO(human): 實作新增通知邏輯
    // 提示：需要生成唯一 ID 和時間戳
    // 提示：如果設定了 duration，需要設置自動移除定時器
  }

  /**
   * 移除通知
   * @param id 通知 ID
   */
  function removeNotification(id: string) {
    // TODO(human): 實作移除通知邏輯
  }

  /**
   * 清空所有通知
   */
  function clearAll() {
    // TODO(human): 實作清空通知邏輯
  }

  /**
   * 便捷方法：顯示成功通知
   */
  function showSuccess(title: string, message?: string) {
    // TODO(human): 調用 addNotification，傳入適當參數
  }

  /**
   * 便捷方法：顯示錯誤通知
   */
  function showError(title: string, message?: string) {
    // TODO(human): 調用 addNotification，傳入適當參數
  }

  return {
    // State
    notifications,
    // Computed
    notificationCount,
    hasNotifications,
    // Actions
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
  };
});
```

### 💡 實作提示

1. **ID 生成**：可以使用 `Date.now() + Math.random()` 的組合
2. **自動移除**：使用 `setTimeout` 設置定時器
3. **狀態更新**：直接修改 `notifications.value` 陣列
4. **類型安全**：確保所有參數都有正確的型別

### 🧪 測試你的實作

完成後，在組件中這樣使用：

```vue
<template>
  <div>
    <button @click="testSuccess">測試成功通知</button>
    <button @click="testError">測試錯誤通知</button>

    <!-- 顯示通知 -->
    <div v-for="notification in notifications" :key="notification.id">
      {{ notification.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { notifications, showSuccess, showError } = useNotificationStore();

function testSuccess() {
  showSuccess('操作成功', '問卷已成功保存');
}

function testError() {
  showError('操作失敗', '網路連線異常，請稍後再試');
}
</script>
```

---

## 💡 深度思考與最佳實踐

### 🎯 Store 設計原則

#### 1️⃣ 單一職責原則

```typescript
// ✅ 好的設計：職責清晰
useBuilderStore; // 只管編輯器狀態
useQuestionsStore; // 只管題目數據
useDragDropStore; // 只管拖拽操作

// ❌ 不好的設計：職責混亂
useGlobalStore; // 什麼都管，難以維護
```

#### 2️⃣ 狀態最小化原則

```typescript
// ✅ 最小狀態，其他用計算屬性
const todos = ref<Todo[]>([]);
const completedTodos = computed(() => todos.value.filter(t => t.completed));

// ❌ 冗餘狀態，容易不同步
const todos = ref<Todo[]>([]);
const completedTodos = ref<Todo[]>([]); // 容易與 todos 不同步
```

#### 3️⃣ 不可變更新原則

```typescript
// ✅ 不可變更新，保持響應性
function updateQuestion(id: string, updates: Partial<Question>) {
  const index = questions.value.findIndex(q => q.id === id);
  if (index > -1) {
    questions.value[index] = { ...questions.value[index], ...updates };
  }
}

// ❌ 直接變更，可能破壞響應性
function updateQuestion(id: string, updates: Partial<Question>) {
  const question = questions.value.find(q => q.id === id);
  if (question) {
    Object.assign(question, updates); // 危險！
  }
}
```

### 🚀 效能優化技巧

#### 1️⃣ 合理使用 computed

```typescript
// ✅ 使用 computed 快取計算結果
const expensiveCalculation = computed(() => {
  return questions.value
    .filter(q => q.visible)
    .map(q => analyzeComplexity(q))
    .reduce((sum, complexity) => sum + complexity, 0);
});

// ❌ 每次都重新計算
function getExpensiveCalculation() {
  return questions.value
    .filter(q => q.visible)
    .map(q => analyzeComplexity(q))
    .reduce((sum, complexity) => sum + complexity, 0);
}
```

#### 2️⃣ 批量更新狀態

```typescript
// ✅ 批量更新，減少響應式觸發
function bulkUpdateQuestions(
  updates: Array<{ id: string; data: Partial<Question> }>
) {
  // 批量處理，只觸發一次響應式更新
  questions.value = questions.value.map(question => {
    const update = updates.find(u => u.id === question.id);
    return update ? { ...question, ...update.data } : question;
  });
}

// ❌ 多次更新，每次都觸發響應式
function updateQuestionsOneByOne(
  updates: Array<{ id: string; data: Partial<Question> }>
) {
  updates.forEach(update => {
    updateQuestion(update.id, update.data); // 每次都觸發！
  });
}
```

### 🔍 除錯技巧

#### 1️⃣ 使用 Vue DevTools

```typescript
// Store 會自動出現在 DevTools 中
// 可以即時查看狀態變化和時間旅行除錯
```

#### 2️⃣ 添加開發模式日誌

```typescript
export const useBuilderStore = defineStore('builder', () => {
  // 狀態定義...

  function selectQuestion(questionId: string | null) {
    if (process.env.NODE_ENV === 'development') {
      console.group('[BuilderStore] selectQuestion');
      console.log('Previous:', selectedQuestionId.value);
      console.log('New:', questionId);
      console.groupEnd();
    }

    selectedQuestionId.value = questionId;
  }

  return {
    /* ... */
  };
});
```

### 🔮 進階模式

#### 1️⃣ Store 組合模式

```typescript
// 組合多個相關的 Store
export function useSurveyEditor() {
  const builderStore = useBuilderStore();
  const questionsStore = useQuestionsStore();
  const dragDropStore = useDragDropStore();

  // 組合操作
  function addQuestionAndSelect(questionType: QuestionType) {
    const newQuestion = questionsStore.createQuestion(questionType);
    questionsStore.addQuestion(newQuestion);
    builderStore.selectQuestion(newQuestion.id);
  }

  return {
    ...builderStore,
    ...questionsStore,
    ...dragDropStore,
    // 組合方法
    addQuestionAndSelect,
  };
}
```

#### 2️⃣ Store 插件模式

```typescript
// 為 Store 添加通用功能
function createUndoRedoPlugin() {
  return ({ store }: { store: any }) => {
    const history = ref<any[]>([]);
    const currentIndex = ref(-1);

    // 添加撤銷重做功能
    store.undo = () => {
      /* 撤銷邏輯 */
    };
    store.redo = () => {
      /* 重做邏輯 */
    };
  };
}

// 使用插件
const pinia = createPinia();
pinia.use(createUndoRedoPlugin());
```

---

## 🎓 總結與下一步

### 🎯 核心概念回顧

1. **Store 是狀態管理的中央樞紐**：解決組件間通訊問題
2. **每個用戶會話都有獨立的 Store 實例**：天然隔離，無需擔心數據混亂
3. **Store 生命週期與頁面會話一致**：關閉頁面即銷毀，需要持久化須主動保存
4. **響應式系統讓狀態變化自動同步**：修改狀態，所有相關組件自動更新

### 🚀 學習路徑建議

1. **熟練基礎操作**：掌握 State、Computed、Actions 的使用
2. **實踐專案模式**：嘗試設計自己的 Store 架構
3. **探索進階技巧**：組合模式、插件系統、效能優化
4. **結合實際需求**：將狀態管理融入真實專案開發

### 📚 延伸學習

- [組件通訊模式](./component-communication.md) - 深入理解不同通訊方式
- [響應式系統原理](./reactivity-system.md) - Vue 3 響應式原理
- [TypeScript 最佳實踐](./typescript-best-practices.md) - 類型安全的狀態管理

---

**🎉 恭喜！你已經掌握了前端狀態管理的核心概念！**

現在你可以自信地設計和實作任何複雜的狀態管理需求。記住，好的狀態管理不是把所有東西都放進 Store，而是合理地組織狀態，讓組件間的通訊變得簡單而優雅。

開始你的 Store 設計之旅吧！🚀
