<template>
  <div class="question-type-panel">
    <!-- 搜尋框 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <Icon name="magnifying-glass" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="搜尋題型..." class="search-input" />
      </div>
    </div>

    <!-- 題型分類 -->
    <div class="categories-section">
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="category-tab"
          :class="{ 'category-tab-active': selectedCategory === category.id }"
          @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 題型列表 -->
    <div class="question-types-grid">
      <div
        v-for="questionType in filteredQuestionTypes"
        :key="questionType.type"
        class="question-type-item"
        :draggable="false"
        @mousedown="handleQuestionTypeMouseDown($event, questionType)"
      >
        <div class="question-type-icon">
          <Icon :name="questionType.icon" class="w-5 h-5" />
        </div>
        <div class="question-type-info">
          <h4 class="question-type-title">{{ questionType.displayName }}</h4>
          <p class="question-type-description">{{ questionType.description }}</p>
        </div>
        <div class="drag-handle">
          <Icon name="bars-3" class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Phase 1 說明 -->
    <div class="phase-info">
      <div class="info-card">
        <Icon name="info-circle" class="w-4 h-4 text-blue-500" />
        <p class="text-xs text-gray-600">Phase 1 支援 5 種基礎題型，更多題型將在 Phase 2 加入</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QuestionType } from '@smartsurvey/shared';
import { useDragDropStore } from '~/stores/drag-drop';
import { useQuestionsStore } from '~/stores/questions';

// Stores
const dragDropStore = useDragDropStore();
const questionsStore = useQuestionsStore();

// 狀態
const searchQuery = ref('');
const selectedCategory = ref('basic');

// 題型分類
const categories = [
  { id: 'basic', name: '基礎' },
  { id: 'choice', name: '選擇' },
  { id: 'input', name: '輸入' },
  { id: 'advanced', name: '進階' },
];

// Phase 1 支援的題型定義
const questionTypeDefinitions = [
  {
    type: QuestionType.SINGLE_CHOICE,
    displayName: '單選題',
    description: '從多個選項中選擇一個',
    icon: 'radio-button',
    category: 'choice',
    phase: 1,
  },
  {
    type: QuestionType.MULTIPLE_CHOICE,
    displayName: '多選題',
    description: '可以選擇多個選項',
    icon: 'checkbox',
    category: 'choice',
    phase: 1,
  },
  {
    type: QuestionType.TEXT_SHORT,
    displayName: '短文字',
    description: '單行文字輸入',
    icon: 'text-short',
    category: 'input',
    phase: 1,
  },
  {
    type: QuestionType.TEXT_LONG,
    displayName: '長文字',
    description: '多行文字輸入',
    icon: 'text-long',
    category: 'input',
    phase: 1,
  },
  {
    type: QuestionType.RATING,
    displayName: '評分題',
    description: '星級評分或數字評分',
    icon: 'star',
    category: 'basic',
    phase: 1,
  },
  // Phase 2 題型（暫時顯示但不可拖動）
  {
    type: QuestionType.EMAIL,
    displayName: '電子郵件',
    description: '電子郵件格式驗證',
    icon: 'envelope',
    category: 'input',
    phase: 2,
  },
  {
    type: QuestionType.NUMBER,
    displayName: '數字',
    description: '數字輸入與驗證',
    icon: 'number-symbol',
    category: 'input',
    phase: 2,
  },
  {
    type: QuestionType.DROPDOWN,
    displayName: '下拉選單',
    description: '下拉式選擇',
    icon: 'chevron-down',
    category: 'choice',
    phase: 2,
  },
  {
    type: QuestionType.SCALE,
    displayName: '量表',
    description: '線性量表評分',
    icon: 'scale',
    category: 'advanced',
    phase: 2,
  },
  {
    type: QuestionType.DATE,
    displayName: '日期',
    description: '日期選擇器',
    icon: 'calendar',
    category: 'input',
    phase: 2,
  },
];

// 計算屬性
const filteredQuestionTypes = computed(() => {
  let types = questionTypeDefinitions;

  // 按分類篩選
  if (selectedCategory.value !== 'basic') {
    types = types.filter(
      type => selectedCategory.value === 'basic' || type.category === selectedCategory.value
    );
  }

  // 按搜尋關鍵字篩選
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    types = types.filter(
      type =>
        type.displayName.toLowerCase().includes(query) ||
        type.description.toLowerCase().includes(query)
    );
  }

  return types;
});

// 方法
function handleQuestionTypeMouseDown(
  event: MouseEvent,
  questionType: {
    type: QuestionType;
    displayName: string;
    description: string;
    icon: string;
    category: string;
    phase: number;
  }
) {
  // 檢查是否為 Phase 1 支援的題型
  if (questionType.phase > 1) {
    // TODO: 顯示 "即將推出" 提示
    return;
  }

  // 防止預設的拖放行為
  event.preventDefault();

  // 開始自訂拖放
  const startPosition = {
    x: event.clientX,
    y: event.clientY,
  };

  dragDropStore.startDragQuestionType(
    questionType.type,
    questionType.displayName,
    questionType.icon,
    startPosition
  );

  // 添加視覺反饋
  const target = event.currentTarget as HTMLElement;
  target.classList.add('dragging');

  // 監聽全局滑鼠事件
  const handleMouseMove = (e: MouseEvent) => {
    dragDropStore.updateDragPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = () => {
    target.classList.remove('dragging');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}
</script>

<style scoped>
.question-type-panel {
  @apply flex flex-col h-full;
}

/* 搜尋區域 */
.search-section {
  @apply p-4 border-b border-gray-200;
}

.search-input-wrapper {
  @apply relative;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2;
  @apply w-4 h-4 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg;
  @apply text-sm placeholder-gray-500;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors;
}

/* 分類標籤 */
.categories-section {
  @apply p-4 border-b border-gray-200;
}

.category-tabs {
  @apply flex gap-1 overflow-x-auto;
}

.category-tab {
  @apply px-3 py-2 text-sm font-medium rounded-lg;
  @apply text-gray-600 hover:text-gray-900 hover:bg-gray-100;
  @apply transition-colors whitespace-nowrap;
}

.category-tab-active {
  @apply text-blue-600 bg-blue-100 hover:bg-blue-100 hover:text-blue-600;
}

/* 題型網格 */
.question-types-grid {
  @apply flex-1 p-4 overflow-y-auto;
  @apply space-y-2;
}

.question-type-item {
  @apply flex items-center gap-3 p-3 rounded-lg border border-gray-200;
  @apply hover:border-gray-300 hover:shadow-sm;
  @apply transition-all duration-200 cursor-grab;
  @apply bg-white;
}

.question-type-item:active {
  @apply cursor-grabbing;
}

.question-type-item.dragging {
  @apply opacity-50 cursor-grabbing;
}

/* Phase 2 題型樣式 */
.question-type-item[data-phase='2'] {
  @apply opacity-60 cursor-not-allowed;
  @apply border-gray-150 hover:border-gray-150 hover:shadow-none;
}

.question-type-item[data-phase='2'] .question-type-info {
  @apply relative;
}

.question-type-item[data-phase='2']::after {
  content: 'Phase 2';
  @apply absolute top-1 right-1 px-2 py-0.5 text-xs;
  @apply bg-gray-100 text-gray-500 rounded;
}

.question-type-icon {
  @apply flex-shrink-0 w-8 h-8 flex items-center justify-center;
  @apply bg-gray-100 rounded-lg text-gray-600;
}

.question-type-info {
  @apply flex-1 min-w-0;
}

.question-type-title {
  @apply font-medium text-gray-900 text-sm;
}

.question-type-description {
  @apply text-xs text-gray-500 mt-0.5;
}

.drag-handle {
  @apply flex-shrink-0 text-gray-400 opacity-0;
  @apply transition-opacity;
}

.question-type-item:hover .drag-handle {
  @apply opacity-100;
}

/* Phase 說明 */
.phase-info {
  @apply p-4 border-t border-gray-200;
}

.info-card {
  @apply flex items-start gap-2 p-3 bg-blue-50 rounded-lg;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .question-type-item {
    @apply flex-col items-start gap-2;
  }

  .question-type-icon {
    @apply w-6 h-6;
  }
}
</style>
