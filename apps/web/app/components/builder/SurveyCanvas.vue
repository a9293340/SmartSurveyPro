<template>
  <div class="survey-canvas-container">
    <!-- 主要內容區域 -->
    <div class="canvas-main">
      <!-- 左側：題型選擇面板 -->
      <aside class="question-types-sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <div class="sidebar-header">
          <h3 v-show="!isSidebarCollapsed" class="sidebar-title">題型庫</h3>
          <button type="button" class="sidebar-toggle" @click="toggleSidebar">
            <Icon :name="isSidebarCollapsed ? 'chevron-right' : 'chevron-left'" class="w-4 h-4" />
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
              <Icon name="eye" class="w-4 h-4" />
              {{ isPreviewMode ? '退出預覽' : '預覽' }}
            </button>
          </div>
        </div>

        <!-- 問卷題目列表 -->
        <div class="question-list" data-drop-zone="question-list">
          <!-- 空狀態 -->
          <div v-if="questions.length === 0" class="empty-state">
            <Icon name="document-plus" class="empty-icon" />
            <h3>開始建立您的問卷</h3>
            <p>從左側拖入題型，或點擊下方按鈕新增題目</p>
            <button type="button" class="btn-primary" @click="addFirstQuestion">
              新增第一個題目
            </button>
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
              :name="isPropertiesCollapsed ? 'chevron-left' : 'chevron-right'"
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
  const iconMap: Record<QuestionType, string> = {
    [QuestionType.SINGLE_CHOICE]: 'radio-button',
    [QuestionType.MULTIPLE_CHOICE]: 'checkbox',
    [QuestionType.TEXT_SHORT]: 'text-short',
    [QuestionType.TEXT_LONG]: 'text-long',
    [QuestionType.RATING]: 'star',
    [QuestionType.EMAIL]: 'envelope',
    [QuestionType.NUMBER]: 'number',
    [QuestionType.URL]: 'link',
    [QuestionType.DROPDOWN]: 'chevron-down',
    [QuestionType.SCALE]: 'scale',
    [QuestionType.NET_PROMOTER_SCORE]: 'chart-bar',
    [QuestionType.DATE]: 'calendar',
    [QuestionType.TIME]: 'clock',
    [QuestionType.DATETIME]: 'calendar-clock',
    [QuestionType.FILE_UPLOAD]: 'upload',
    [QuestionType.IMAGE_CHOICE]: 'image',
    [QuestionType.MATRIX]: 'table',
    [QuestionType.RANKING]: 'list-ordered',
  };

  return iconMap[draggedQuestionType.value!] || 'question-mark';
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
