<template>
  <div
    class="question-card"
    :class="{
      'question-selected': isSelected,
      'question-dragging': isDragging,
    }"
    :data-draggable="true"
    :data-question-id="question.id"
    :data-question-index="index"
    @click="handleSelect"
    @mousedown="handleMouseDown"
  >
    <!-- 卡片頭部 -->
    <div class="card-header">
      <div class="question-info">
        <div class="question-number">{{ index + 1 }}</div>
        <div class="question-meta">
          <Icon :name="questionTypeIcon" class="w-4 h-4 text-gray-500" />
          <span class="question-type-label">{{ questionTypeName }}</span>
          <span v-if="question.required" class="required-indicator">*</span>
        </div>
      </div>

      <div class="card-actions">
        <!-- 拖動手柄 -->
        <div class="drag-handle">
          <Icon name="heroicons:bars-3" class="w-4 h-4" />
        </div>

        <!-- 更多選項 -->
        <div class="dropdown-wrapper">
          <button type="button" class="action-button" @click.stop="toggleDropdown">
            <Icon name="heroicons:ellipsis-horizontal" class="w-4 h-4" />
          </button>

          <!-- 下拉選單 -->
          <div v-show="showDropdown" class="dropdown-menu">
            <button type="button" class="dropdown-item" @click="handleDuplicate">
              <Icon name="heroicons:document-duplicate" class="w-4 h-4" />
              複製題目
            </button>
            <button type="button" class="dropdown-item" @click="handleCopy">
              <Icon name="heroicons:clipboard" class="w-4 h-4" />
              複製到剪貼簿
            </button>
            <div class="dropdown-divider" />
            <button
              type="button"
              class="dropdown-item text-red-600 hover:bg-red-50"
              @click="handleDelete"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
              刪除題目
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 題目內容 -->
    <div class="card-content">
      <!-- 題目標題 -->
      <div class="question-title-section">
        <input
          v-if="isEditingTitle"
          ref="titleInput"
          v-model="editableTitle"
          type="text"
          class="title-input"
          @blur="saveTitle"
          @keydown.enter="saveTitle"
          @keydown.escape="cancelTitleEdit"
          @click.stop
        />
        <div v-else class="title-container" @dblclick="startTitleEdit">
          <h3 class="question-title">
            {{ displayTitle }}
          </h3>
          <span class="edit-hint">雙擊編輯</span>
        </div>

        <button
          v-if="!isEditingTitle"
          type="button"
          class="edit-title-button"
          title="編輯題目標題"
          @click.stop="startTitleEdit"
        >
          <Icon name="heroicons:pencil" class="w-4 h-4" />
        </button>
      </div>

      <!-- 題目描述 -->
      <p v-if="question.description" class="question-description">
        {{ question.description }}
      </p>

      <!-- 題目預覽內容 -->
      <div class="question-preview">
        <component
          :is="previewComponent"
          :question="question"
          :preview-mode="true"
          @update-question="handleUpdateQuestion"
        />
      </div>
    </div>

    <!-- 卡片底部 -->
    <div class="card-footer">
      <div class="question-stats">
        <span class="stat-item">
          <Icon name="heroicons:eye" class="w-3 h-3" />
          {{ question.visible ? '顯示' : '隱藏' }}
        </span>
        <span v-if="hasValidation" class="stat-item">
          <Icon name="heroicons:shield-check" class="w-3 h-3" />
          有驗證
        </span>
      </div>

      <div class="quick-actions">
        <button
          type="button"
          class="quick-action"
          :class="{ active: question.required }"
          @click.stop="toggleRequired"
        >
          <Icon name="heroicons:exclamation-triangle" class="w-3 h-3" />
          必填
        </button>
        <button
          type="button"
          class="quick-action"
          :class="{ active: question.visible }"
          @click.stop="toggleVisible"
        >
          <Icon
            :name="question.visible ? 'heroicons:eye' : 'heroicons:eye-slash'"
            class="w-3 h-3"
          />
          {{ question.visible ? '顯示' : '隱藏' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue';
import { QuestionType } from '@smartsurvey/shared';
import type { Question } from '@smartsurvey/shared';

// 使用共享的 Question 類型
import { useDragDropStore } from '~/stores/drag-drop';
import { useBuilderStore } from '~/stores/builder';
import { useQuestionsStore } from '~/stores/questions';

// 動態引入預覽組件
import QuestionSingleChoicePreview from './previews/QuestionSingleChoicePreview.vue';
import QuestionMultipleChoicePreview from './previews/QuestionMultipleChoicePreview.vue';
import QuestionTextShortPreview from './previews/QuestionTextShortPreview.vue';
import QuestionTextLongPreview from './previews/QuestionTextLongPreview.vue';
import QuestionRatingPreview from './previews/QuestionRatingPreview.vue';

// Props
interface Props {
  question: Question;
  index: number;
  isSelected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});

// Emits
const emit = defineEmits<{
  select: [questionId: string];
  delete: [questionId: string];
}>();

// Stores
const dragDropStore = useDragDropStore();
const builderStore = useBuilderStore();
const questionsStore = useQuestionsStore();

// 響應式狀態
const showDropdown = ref(false);
const isEditingTitle = ref(false);
const editableTitle = ref(props.question.title);
const titleInput = ref<HTMLInputElement>();
const isDragging = ref(false);

// 計算屬性
const questionTypeName = computed(() => {
  return questionsStore.getQuestionTypeName(props.question.type);
});

const questionTypeIcon = computed(() => {
  const iconMap: Record<string, string> = {
    [QuestionType.SINGLE_CHOICE]: 'heroicons:stop',
    [QuestionType.MULTIPLE_CHOICE]: 'heroicons:squares-2x2',
    [QuestionType.TEXT_SHORT]: 'heroicons:pencil-square',
    [QuestionType.TEXT_LONG]: 'heroicons:document-text',
    [QuestionType.RATING]: 'heroicons:star',
    [QuestionType.EMAIL]: 'heroicons:envelope',
    [QuestionType.NUMBER]: 'heroicons:hashtag',
    [QuestionType.URL]: 'heroicons:link',
    [QuestionType.DROPDOWN]: 'heroicons:chevron-down',
    [QuestionType.SCALE]: 'heroicons:chart-bar-square',
    [QuestionType.NET_PROMOTER_SCORE]: 'heroicons:chart-bar-square',
    [QuestionType.DATE]: 'heroicons:calendar',
    [QuestionType.TIME]: 'heroicons:clock',
    [QuestionType.DATETIME]: 'heroicons:calendar',
    [QuestionType.FILE_UPLOAD]: 'heroicons:arrow-up-tray',
    [QuestionType.IMAGE_CHOICE]: 'heroicons:photo',
    [QuestionType.MATRIX]: 'heroicons:table-cells',
    [QuestionType.RANKING]: 'heroicons:list-bullet',
  };

  return iconMap[props.question.type] || 'heroicons:document-text';
});

const displayTitle = computed(() => {
  return props.question.title || `題目 ${props.index + 1}`;
});

const hasValidation = computed(() => {
  return props.question.validation && Object.keys(props.question.validation).length > 0;
});

const previewComponent = computed(() => {
  // 根據題型返回對應的預覽組件
  const componentMap: Record<string, any> = {
    [QuestionType.SINGLE_CHOICE]: QuestionSingleChoicePreview,
    [QuestionType.MULTIPLE_CHOICE]: QuestionMultipleChoicePreview,
    [QuestionType.TEXT_SHORT]: QuestionTextShortPreview,
    [QuestionType.TEXT_LONG]: QuestionTextLongPreview,
    [QuestionType.RATING]: QuestionRatingPreview,
    // Phase 2 題型暫時使用空組件
    [QuestionType.EMAIL]: QuestionTextShortPreview,
    [QuestionType.NUMBER]: QuestionTextShortPreview,
    [QuestionType.URL]: QuestionTextShortPreview,
    [QuestionType.DROPDOWN]: QuestionSingleChoicePreview,
    [QuestionType.SCALE]: QuestionRatingPreview,
    [QuestionType.NET_PROMOTER_SCORE]: QuestionRatingPreview,
    [QuestionType.DATE]: QuestionTextShortPreview,
    [QuestionType.TIME]: QuestionTextShortPreview,
    [QuestionType.FILE_UPLOAD]: QuestionTextShortPreview,
    [QuestionType.MATRIX]: QuestionMultipleChoicePreview,
    [QuestionType.RANKING]: QuestionMultipleChoicePreview,
  };

  return componentMap[props.question.type] || QuestionTextShortPreview;
});

// 方法
function handleSelect() {
  if (!props.isSelected) {
    emit('select', props.question.id);
  }
}

function handleMouseDown(event: MouseEvent) {
  // 防止在編輯模式下觸發拖動
  if (isEditingTitle.value) return;

  const target = event.target as HTMLElement;

  // 檢查是否點擊在可編輯區域或按鈕上
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'BUTTON' ||
    target.closest('.dropdown-menu') ||
    target.closest('.quick-actions')
  ) {
    return;
  }

  // 確保先選中題目
  if (!props.isSelected) {
    emit('select', props.question.id);
  }

  // 開始拖動
  startDrag(event);
}

function startDrag(event: MouseEvent) {
  event.preventDefault();
  isDragging.value = true;

  const startPosition = {
    x: event.clientX,
    y: event.clientY,
  };

  dragDropStore.startDragExistingQuestion(
    props.question.id,
    displayTitle.value,
    props.index,
    startPosition
  );

  // 監聽全局事件
  const handleMouseMove = (e: MouseEvent) => {
    dragDropStore.updateDragPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleDuplicate() {
  questionsStore.duplicateQuestion(props.question.id);
  showDropdown.value = false;
}

function handleCopy() {
  questionsStore.copyToClipboard(props.question.id);
  showDropdown.value = false;
  // TODO: 顯示成功提示
}

function handleDelete() {
  emit('delete', props.question.id);
  showDropdown.value = false;
}

function startTitleEdit() {
  isEditingTitle.value = true;
  editableTitle.value = props.question.title;
  nextTick(() => {
    titleInput.value?.focus();
    titleInput.value?.select();
  });
}

function saveTitle() {
  if (editableTitle.value.trim() !== props.question.title) {
    builderStore.updateQuestion(props.question.id, {
      title: editableTitle.value.trim() || `題目 ${props.index + 1}`,
    });
  }
  isEditingTitle.value = false;
}

function cancelTitleEdit() {
  editableTitle.value = props.question.title;
  isEditingTitle.value = false;
}

function toggleRequired() {
  builderStore.updateQuestion(props.question.id, {
    required: !props.question.required,
  });
}

function toggleVisible() {
  builderStore.updateQuestion(props.question.id, {
    visible: !props.question.visible,
  });
}

function handleUpdateQuestion(questionId: string, updates: Partial<Question>) {
  builderStore.updateQuestion(questionId, updates);
}

// 點擊外部關閉下拉選單
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-wrapper')) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.question-card {
  @apply bg-white border border-gray-200 rounded-lg shadow-sm;
  @apply hover:border-gray-300 hover:shadow-md;
  @apply transition-all duration-200 cursor-pointer;
  @apply mb-4;
}

.question-selected {
  @apply border-blue-500 shadow-md ring-1 ring-blue-500 ring-opacity-50;
}

.question-dragging {
  @apply opacity-50 cursor-grabbing;
}

/* 卡片頭部 */
.card-header {
  @apply flex items-center justify-between p-4 border-b border-gray-100;
}

.question-info {
  @apply flex items-center gap-3;
}

.question-number {
  @apply flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600;
  @apply rounded-full flex items-center justify-center text-sm font-medium;
}

.question-selected .question-number {
  @apply bg-blue-100 text-blue-600;
}

.question-meta {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.question-type-label {
  @apply font-medium;
}

.required-indicator {
  @apply text-red-500 font-bold text-base;
}

.card-actions {
  @apply flex items-center gap-2;
}

.drag-handle {
  @apply p-1 rounded text-gray-400 opacity-0 cursor-grab;
  @apply hover:bg-gray-100 hover:text-gray-600;
  @apply transition-all;
}

.question-card:hover .drag-handle {
  @apply opacity-100;
}

.action-button {
  @apply p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600;
  @apply transition-colors;
}

/* 下拉選單 */
.dropdown-wrapper {
  @apply relative;
}

.dropdown-menu {
  @apply absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200;
  @apply rounded-lg shadow-lg py-1 z-10;
}

.dropdown-item {
  @apply w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700;
  @apply hover:bg-gray-100 transition-colors;
}

.dropdown-divider {
  @apply border-t border-gray-100 my-1;
}

/* 卡片內容 */
.card-content {
  @apply p-4;
}

.question-title-section {
  @apply flex items-center gap-2 mb-3;
}

.title-container {
  @apply flex-1 flex items-center gap-2 cursor-pointer;
  @apply hover:bg-gray-50 rounded px-2 py-1 transition-colors;
  @apply relative;
}

.question-title {
  @apply text-lg font-medium text-gray-900;
  @apply hover:text-gray-700 transition-colors;
}

.edit-hint {
  @apply text-xs text-gray-400 opacity-0 transition-opacity;
  @apply select-none pointer-events-none;
}

.title-container:hover .edit-hint {
  @apply opacity-100;
}

.title-input {
  @apply flex-1 text-lg font-medium px-2 py-1 border border-gray-300 rounded;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
}

.edit-title-button {
  @apply p-2 rounded-lg text-gray-400 opacity-0 hover:bg-blue-50 hover:text-blue-600;
  @apply transition-all border border-transparent hover:border-blue-200;
  @apply shadow-sm hover:shadow;
}

.question-title-section:hover .edit-title-button {
  @apply opacity-100;
}

.question-description {
  @apply text-sm text-gray-600 mb-3;
}

.question-preview {
  @apply bg-gray-50 border border-gray-200 rounded-lg p-3;
  @apply min-h-[60px] flex items-center;
}

/* 卡片底部 */
.card-footer {
  @apply flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100;
  @apply rounded-b-lg;
}

.question-stats {
  @apply flex items-center gap-3 text-xs text-gray-500;
}

.stat-item {
  @apply flex items-center gap-1;
}

.quick-actions {
  @apply flex items-center gap-2;
}

.quick-action {
  @apply flex items-center gap-1 px-2 py-1 text-xs rounded;
  @apply text-gray-600 hover:bg-gray-200 transition-colors;
}

.quick-action.active {
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .card-header {
    @apply flex-col items-start gap-3;
  }

  .card-actions {
    @apply self-end;
  }

  .card-footer {
    @apply flex-col items-start gap-2;
  }

  .quick-actions {
    @apply self-end;
  }
}
</style>
