<template>
  <div class="survey-canvas-container">
    <!-- 主要內容區域 -->
    <div class="canvas-main">
      <!-- 左側：題型選擇面板 -->
      <aside class="question-types-sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <div class="sidebar-header">
          <h3 v-show="!isSidebarCollapsed" class="sidebar-title">題型庫</h3>
          <button type="button" class="sidebar-toggle" @click="toggleSidebar">
            <Icon
              :name="isSidebarCollapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left'"
              class="w-4 h-4"
            />
          </button>
        </div>

        <div v-show="!isSidebarCollapsed" class="sidebar-content">
          <QuestionTypePanel />
        </div>
      </aside>

      <!-- 中間：問卷編輯畫布 -->
      <main class="canvas-area">
        <div class="canvas-header">
          <div class="canvas-title">
            <h2>{{ surveyTitle || '未命名問卷' }}</h2>
            <p class="canvas-subtitle">{{ questionCount }} 個題目</p>
          </div>

          <div class="canvas-actions">
            <button type="button" class="btn-secondary" @click="togglePreview">
              <Icon name="heroicons:eye" class="w-4 h-4" />
              {{ isPreviewMode ? '退出預覽' : '預覽' }}
            </button>
          </div>
        </div>

        <!-- 問卷題目列表 -->
        <div class="question-list" data-drop-zone="question-list">
          <!-- 空狀態 -->
          <div v-if="questions.length === 0" class="empty-state">
            <!-- 空狀態的放置區 -->
            <DropZone
              :index="0"
              :is-active="hoveredDropIndex === 0"
              drop-zone-type="question-list"
              show-empty-hint
            />

            <div class="empty-state-content">
              <Icon name="heroicons:document-plus" class="empty-icon" />
              <h3>開始建立您的問卷</h3>
              <p>從左側拖入題型，或點擊下方按鈕新增題目</p>
              <button type="button" class="btn-primary" @click="addFirstQuestion">
                新增第一個題目
              </button>
            </div>
          </div>

          <!-- 題目列表 -->
          <template v-else>
            <!-- 頂部放置區 -->
            <DropZone
              :index="0"
              :is-active="hoveredDropIndex === 0"
              drop-zone-type="question-list"
            />

            <!-- 渲染每個題目 -->
            <template v-for="(question, index) in questions" :key="question.id">
              <QuestionCard
                :question="question"
                :index="index"
                :is-selected="selectedQuestionId === question.id"
                @select="selectQuestion"
                @delete="deleteQuestion"
              />

              <!-- 題目間的放置區 -->
              <DropZone
                :index="index + 1"
                :is-active="hoveredDropIndex === index + 1"
                drop-zone-type="question-list"
              />
            </template>
          </template>
        </div>
      </main>

      <!-- 右側：屬性面板 -->
      <aside class="properties-sidebar" :class="{ 'sidebar-collapsed': isPropertiesCollapsed }">
        <div class="sidebar-header">
          <button type="button" class="sidebar-toggle" @click="toggleProperties">
            <Icon
              :name="isPropertiesCollapsed ? 'heroicons:chevron-left' : 'heroicons:chevron-right'"
              class="w-4 h-4"
            />
          </button>
          <h3 v-show="!isPropertiesCollapsed" class="sidebar-title">屬性設定</h3>
        </div>

        <div v-show="!isPropertiesCollapsed" class="sidebar-content">
          <!-- TODO: Task 3.2.3 屬性面板內容 -->
          <div class="placeholder-content">
            <p class="text-gray-500 text-sm">屬性面板將在 Task 3.2.3 實作</p>
          </div>
        </div>
      </aside>
    </div>

    <!-- 拖拽預覽層 -->
    <Teleport to="body">
      <div v-if="isDragging" class="drag-preview" :style="dragPreviewStyle">
        <div class="drag-preview-content">
          <Icon :name="draggedQuestionIcon" class="w-5 h-5" />
          <span>{{ draggedQuestionName }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QuestionType } from '@smartsurvey/shared';
import {
  DragItemType,
  DropZoneType,
  type QuestionTypeDragData,
  type ExistingQuestionDragData,
} from '~/stores/drag-drop';
import { useBuilderStore } from '~/stores/builder';
import { useDragDropStore } from '~/stores/drag-drop';
import { useQuestionsStore } from '~/stores/questions';

// 組件引入
import QuestionTypePanel from './QuestionTypePanel.vue';
import QuestionCard from './QuestionCard.vue';
import DropZone from './DropZone.vue';

// Stores
const builderStore = useBuilderStore();
const dragDropStore = useDragDropStore();
const questionsStore = useQuestionsStore();

// 界面狀態
const isSidebarCollapsed = ref(false);
const isPropertiesCollapsed = ref(false);

// 問卷狀態
const surveyTitle = computed(() => builderStore.currentSurvey?.title);
const questions = computed(() => questionsStore.allQuestions);
const questionCount = computed(() => questions.value.length);
const selectedQuestionId = computed(() => builderStore.selectedQuestionId);
const isPreviewMode = computed(() => builderStore.isPreviewMode);

// 拖拽狀態
const isDragging = computed(() => dragDropStore.isDragging);
const hoveredDropIndex = computed(() => dragDropStore.insertIndicatorIndex);
const draggedQuestionType = computed(() => dragDropStore.draggedQuestionType);

// 拖拽預覽
const dragPreviewStyle = computed(() => {
  const position = dragDropStore.previewPosition;
  if (!position) return { display: 'none' };

  return {
    position: 'fixed' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    pointerEvents: 'none' as const,
    zIndex: '9999',
  };
});

const draggedQuestionName = computed(() => {
  if (!draggedQuestionType.value) return '';
  return questionsStore.getQuestionTypeName(draggedQuestionType.value);
});

const draggedQuestionIcon = computed(() => {
  // 根據題型返回對應圖標名稱
  const iconMap: Record<string, string> = {
    [QuestionType.SINGLE_CHOICE]: 'heroicons:radio',
    [QuestionType.MULTIPLE_CHOICE]: 'heroicons:check',
    [QuestionType.TEXT_SHORT]: 'heroicons:pencil',
    [QuestionType.TEXT_LONG]: 'heroicons:document-text',
    [QuestionType.RATING]: 'heroicons:star',
    [QuestionType.EMAIL]: 'heroicons:envelope',
    [QuestionType.NUMBER]: 'heroicons:hashtag',
    [QuestionType.URL]: 'heroicons:link',
    [QuestionType.DROPDOWN]: 'heroicons:chevron-down',
    [QuestionType.SCALE]: 'heroicons:chart-bar',
    [QuestionType.NET_PROMOTER_SCORE]: 'heroicons:chart-bar',
    [QuestionType.DATE]: 'heroicons:calendar',
    [QuestionType.TIME]: 'heroicons:clock',
    [QuestionType.DATETIME]: 'heroicons:calendar',
    [QuestionType.FILE_UPLOAD]: 'heroicons:arrow-up-tray',
    [QuestionType.IMAGE_CHOICE]: 'heroicons:photo',
    [QuestionType.MATRIX]: 'heroicons:table-cells',
    [QuestionType.RANKING]: 'heroicons:list-bullet',
  };

  return draggedQuestionType.value
    ? iconMap[draggedQuestionType.value] || 'heroicons:question-mark-circle'
    : 'heroicons:question-mark-circle';
});

// 方法
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

function toggleProperties() {
  isPropertiesCollapsed.value = !isPropertiesCollapsed.value;
}

function togglePreview() {
  builderStore.togglePreviewMode();
}

function selectQuestion(questionId: string) {
  builderStore.selectQuestion(questionId);
}

function deleteQuestion(questionId: string) {
  questionsStore.deleteQuestion(questionId);
}

function addFirstQuestion() {
  // 新增一個預設的單選題
  questionsStore.addQuestion(QuestionType.SINGLE_CHOICE);
}

// ============================================================================
// 拖拽事件處理
// ============================================================================

/**
 * 處理拖拽懸停事件
 * 允許放置並提供視覺反饋
 */
function onDragOver(event: DragEvent) {
  // 防止預設行為以允許 drop
  event.preventDefault();

  if (!dragDropStore.isDragging) return;

  // 計算滑鼠位置並更新拖拽狀態
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const y = event.clientY - rect.top;

  // 更新拖拽位置（用於預覽和指示器）
  dragDropStore.updateDragPosition({
    x: event.clientX,
    y: event.clientY,
  });

  // 計算最佳插入位置並更新懸停狀態
  const insertIndex = calculateInsertIndex(y);

  // 更新懸停的放置區域和插入指示器
  dragDropStore.setHoveredDropZone({
    type: DropZoneType.QUESTION_LIST,
    index: insertIndex,
    element: event.currentTarget as HTMLElement,
  });
}

/**
 * 處理拖拽進入事件
 */
function onDragEnter(event: DragEvent) {
  event.preventDefault();

  if (!dragDropStore.isDragging) return;

  // 標記為有效的放置區域
  (event.currentTarget as HTMLElement).classList.add('drag-over');

  console.warn('拖拽進入畫布區域');
}

/**
 * 處理拖拽離開事件
 */
function onDragLeave(event: DragEvent) {
  // 移除放置區域標記
  (event.currentTarget as HTMLElement).classList.remove('drag-over');

  console.warn('拖拽離開畫布區域');
}

/**
 * 處理放置事件
 * 根據拖拽的內容執行相應操作
 */
function onDrop(event: DragEvent) {
  console.warn('🎯 onDrop triggered');
  event.preventDefault();

  // 移除視覺標記
  (event.currentTarget as HTMLElement).classList.remove('drag-over');

  if (!dragDropStore.isDragging) {
    console.warn('❌ Not dragging, onDrop ignored');
    return;
  }

  const draggedItem = dragDropStore.draggedItem;
  if (!draggedItem) return;

  // TODO(human): 實作不同類型的放置邏輯
  // 根據 draggedItem.type 決定如何處理：
  // 1. DragItemType.QUESTION_TYPE - 建立新題目
  // 2. DragItemType.EXISTING_QUESTION - 重新排序題目

  try {
    if (draggedItem.type === DragItemType.QUESTION_TYPE) {
      handleQuestionTypeDropped(draggedItem.data as QuestionTypeDragData, event);
    } else if (draggedItem.type === DragItemType.EXISTING_QUESTION) {
      handleExistingQuestionDropped(draggedItem.data as ExistingQuestionDragData, event);
    }

    // 拖拽成功，清理狀態
    dragDropStore.completeDragDrop();
  } catch (error) {
    console.error('拖拽處理失敗:', error);
    // 拖拽失敗，取消狀態
    dragDropStore.cancelDragDrop();
  }
}

/**
 * 計算拖拽的插入位置
 */
function calculateInsertIndex(mouseY: number): number {
  // 如果沒有題目，直接返回 0（插入到第一個位置）
  if (questions.value.length === 0) {
    return 0;
  }

  // 獲取所有題目卡片元素
  const questionCards = document.querySelectorAll('.question-card');

  // 遍歷每個題目卡片，找出滑鼠位置應該插入的 index
  for (let i = 0; i < questionCards.length; i++) {
    const card = questionCards[i] as HTMLElement;
    const rect = card.getBoundingClientRect();
    const cardMiddle = rect.top + rect.height / 2;

    // 相對於畫布容器的位置
    const canvasRect = card.closest('.question-list')?.getBoundingClientRect();
    if (!canvasRect) continue;

    const relativeMiddle = cardMiddle - canvasRect.top;

    // 如果滑鼠在此題目的中點之上，就插入在此題目之前
    if (mouseY < relativeMiddle) {
      return i;
    }
  }

  // 如果滑鼠位置在所有題目之下，插入到最後
  return questions.value.length;
}

/**
 * 處理題型拖入（建立新題目）
 */
function handleQuestionTypeDropped(data: QuestionTypeDragData, event: DragEvent) {
  // 從 data 中取得題型資訊（QuestionTypeDragData 格式）
  const questionType = data.questionType;
  const displayName = data.displayName;

  // 計算插入位置
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const y = event.clientY - rect.top;
  const insertIndex = calculateInsertIndex(y);

  console.warn('建立新題目:', {
    type: questionType,
    name: displayName,
    insertAt: insertIndex,
  });

  // 使用 questionsStore.addQuestionAt() 建立題目在指定位置
  const result = questionsStore.addQuestionAt(questionType, insertIndex);

  // 選中新建立的題目，提供即時反饋
  if (result.success && result.question) {
    const questionId = result.question.id;
    // 稍微延遲以確保 DOM 更新
    setTimeout(() => {
      builderStore.selectQuestion(questionId);
    }, 100);
  } else {
    console.error('建立題目失敗:', result.message);
  }
}

/**
 * 處理現有題目拖拽重排
 */
function handleExistingQuestionDropped(data: ExistingQuestionDragData, event: DragEvent) {
  // 從 data 中取得題目資訊（ExistingQuestionDragData 格式）
  const questionId = data.questionId;
  const currentIndex = data.currentIndex;

  // 計算新的插入位置
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const y = event.clientY - rect.top;
  let targetIndex = calculateInsertIndex(y);

  // 如果是向下移動，需要調整 targetIndex
  // 因為移除當前項目會影響後面項目的索引
  if (currentIndex < targetIndex) {
    targetIndex--;
  }

  // 如果位置沒有改變，不需要移動
  if (currentIndex === targetIndex) {
    console.warn('題目位置未改變');
    return;
  }

  console.warn('移動題目:', {
    questionId,
    from: currentIndex,
    to: targetIndex,
  });

  // 使用 questionsStore.moveQuestion() 移動題目
  questionsStore.moveQuestion(questionId, targetIndex);

  // 保持選中狀態
  builderStore.selectQuestion(questionId);
}
</script>

<style scoped>
.survey-canvas-container {
  @apply h-screen flex flex-col bg-gray-50;
}

.canvas-main {
  @apply flex flex-1 overflow-hidden;
}

/* 側邊欄樣式 */
.question-types-sidebar,
.properties-sidebar {
  @apply bg-white border-gray-200 transition-all duration-300 ease-in-out;
  @apply flex flex-col;
  width: 280px;
}

.question-types-sidebar {
  @apply border-r;
}

.properties-sidebar {
  @apply border-l;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
  @apply bg-gray-50;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-900;
}

.sidebar-toggle {
  @apply p-2 rounded-lg hover:bg-gray-100 transition-colors;
  @apply text-gray-500 hover:text-gray-700;
}

.sidebar-content {
  @apply flex-1 overflow-y-auto;
}

/* 畫布區域 */
.canvas-area {
  @apply flex-1 flex flex-col overflow-hidden;
}

.canvas-header {
  @apply flex items-center justify-between p-6 bg-white border-b border-gray-200;
}

.canvas-title h2 {
  @apply text-xl font-semibold text-gray-900;
}

.canvas-subtitle {
  @apply text-sm text-gray-500 mt-1;
}

.canvas-actions {
  @apply flex items-center gap-3;
}

/* 題目列表 */
.question-list {
  @apply flex-1 overflow-y-auto p-6;
}

/* 空狀態 */
.empty-state {
  @apply flex flex-col items-center justify-center;
  @apply text-center py-20;
}

.empty-icon {
  @apply w-16 h-16 text-gray-400 mb-4;
}

.empty-state h3 {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.empty-state p {
  @apply text-gray-500 mb-6 max-w-md;
}

/* 按鈕樣式 */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
  @apply transition-colors flex items-center gap-2;
}

.btn-secondary {
  @apply px-4 py-2 bg-white border border-gray-300 text-gray-700;
  @apply rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2;
}

/* 拖拽預覽 */
.drag-preview {
  @apply pointer-events-none select-none;
}

.drag-preview-content {
  @apply bg-white border-2 border-blue-500 rounded-lg px-3 py-2;
  @apply shadow-lg flex items-center gap-2 text-sm font-medium;
  @apply text-blue-700;
}

/* 拖拽反饋效果 */
.question-list.drag-over {
  @apply bg-blue-50 border-2 border-blue-300 border-dashed;
  @apply transition-all duration-200;
}

.question-list {
  @apply border-2 border-transparent rounded-lg p-4;
  @apply transition-all duration-200;
  min-height: 400px;
}

/* 佔位內容 */
.placeholder-content {
  @apply p-6;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .question-types-sidebar,
  .properties-sidebar {
    width: 240px;
  }

  .sidebar-collapsed {
    width: 50px;
  }
}

@media (max-width: 768px) {
  .canvas-main {
    @apply flex-col;
  }

  .question-types-sidebar {
    @apply border-r-0 border-b;
    width: 100%;
    height: auto;
  }

  .properties-sidebar {
    @apply border-l-0 border-t;
    width: 100%;
    height: auto;
  }

  .sidebar-collapsed {
    height: 50px;
    width: 100%;
  }
}
</style>
