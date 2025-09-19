<template>
  <div
    class="drop-zone"
    :class="{
      'drop-zone-active': isActive,
      'drop-zone-hovered': isHovered,
    }"
    :data-drop-zone="dropZoneType"
    :data-drop-index="index"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 插入指示器 -->
    <div
      class="drop-indicator"
      :class="{
        'indicator-active': isActive,
        'indicator-visible': showIndicator,
      }"
    >
      <!-- 指示器線條 -->
      <div class="indicator-line" />

      <!-- 拖放提示 -->
      <div v-if="isActive && draggedItemInfo" class="drop-hint">
        <Icon :name="draggedItemInfo.icon" class="w-4 h-4" />
        <span>{{ dropHintText }}</span>
      </div>
    </div>

    <!-- 空狀態提示（僅在沒有題目時顯示） -->
    <div v-if="showEmptyHint" class="empty-hint">
      <div class="empty-hint-content">
        <Icon name="heroicons:plus-circle" class="w-5 h-5 text-gray-400" />
        <span class="empty-hint-text">拖入題型或點擊新增題目</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  DragItemType,
  DropZoneType,
  type QuestionTypeDragData,
  type ExistingQuestionDragData,
} from '~/stores/drag-drop';
import { useDragDropStore } from '~/stores/drag-drop';
import { useQuestionsStore } from '~/stores/questions';

// Props
interface Props {
  index: number;
  isActive?: boolean;
  showEmptyHint?: boolean;
  dropZoneType?: 'question-list' | 'trash';
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showEmptyHint: false,
  dropZoneType: 'question-list',
});

// Stores
const dragDropStore = useDragDropStore();
const questionsStore = useQuestionsStore();

// 計算屬性
const isHovered = computed(() => {
  return (
    dragDropStore.hoveredDropZone?.type === props.dropZoneType &&
    dragDropStore.hoveredDropZone?.index === props.index
  );
});

const showIndicator = computed(() => {
  return dragDropStore.isDragging && (props.isActive || isHovered.value);
});

const draggedItemInfo = computed(() => {
  if (!dragDropStore.draggedItem) return null;

  const item = dragDropStore.draggedItem;

  if (item.type === DragItemType.QUESTION_TYPE) {
    const data = item.data as QuestionTypeDragData;
    return {
      type: 'question-type',
      name: data.displayName,
      icon: data.icon,
    };
  } else if (item.type === DragItemType.EXISTING_QUESTION) {
    const data = item.data as ExistingQuestionDragData;
    return {
      type: 'existing-question',
      name: data.title,
      icon: 'bars-3',
    };
  }

  return null;
});

const dropHintText = computed(() => {
  if (!draggedItemInfo.value) return '';

  if (props.dropZoneType === 'trash') {
    return '放開以刪除題目';
  }

  const info = draggedItemInfo.value;
  if (info.type === 'question-type') {
    return `放開以新增 ${info.name}`;
  } else {
    return `放開以移動到位置 ${props.index + 1}`;
  }
});

// 方法
function handleMouseEnter() {
  if (!dragDropStore.isDragging) return;

  dragDropStore.setHoveredDropZone({
    type: props.dropZoneType === 'question-list' ? DropZoneType.QUESTION_LIST : DropZoneType.TRASH,
    index: props.dropZoneType === 'question-list' ? props.index : undefined,
    element: undefined, // 將由實際的 DOM 元素設置
  });
}

function handleMouseLeave() {
  if (!dragDropStore.isDragging) return;

  // 只有在真正離開區域時才清除懸停狀態
  // 這裡可以添加更精確的判斷邏輯
  dragDropStore.clearHoveredDropZone();
}
</script>

<style scoped>
.drop-zone {
  @apply relative transition-all duration-200;
  @apply py-1;
}

/* 激活狀態 */
.drop-zone-active {
  @apply py-2;
}

.drop-zone-hovered {
  @apply bg-blue-50 bg-opacity-50;
}

/* 插入指示器 */
.drop-indicator {
  @apply relative flex flex-col items-center;
  @apply opacity-0 transform scale-95;
  @apply transition-all duration-200 ease-out;
}

.indicator-visible {
  @apply opacity-100 transform scale-100;
}

.indicator-active {
  @apply opacity-100 transform scale-100;
}

/* 指示器線條 */
.indicator-line {
  @apply w-full h-0.5 bg-blue-500 rounded-full;
  @apply shadow-lg;
  @apply relative;
}

.indicator-line::before {
  content: '';
  @apply absolute left-0 top-1/2 transform -translate-y-1/2;
  @apply w-2 h-2 bg-blue-500 rounded-full;
  @apply shadow-lg;
}

.indicator-line::after {
  content: '';
  @apply absolute right-0 top-1/2 transform -translate-y-1/2;
  @apply w-2 h-2 bg-blue-500 rounded-full;
  @apply shadow-lg;
}

/* 拖放提示 */
.drop-hint {
  @apply flex items-center gap-2 mt-2 px-3 py-1.5;
  @apply bg-blue-500 text-white text-sm font-medium rounded-lg;
  @apply shadow-lg;
  @apply transform -translate-y-1;
}

/* 空狀態提示 */
.empty-hint {
  @apply flex justify-center py-8;
  @apply opacity-0 hover:opacity-100 transition-opacity duration-300;
}

.drop-zone:hover .empty-hint {
  @apply opacity-100;
}

.empty-hint-content {
  @apply flex items-center gap-2 px-4 py-2;
  @apply bg-white border-2 border-dashed border-gray-300;
  @apply rounded-lg text-gray-500 text-sm;
  @apply hover:border-gray-400 hover:text-gray-600;
  @apply transition-colors cursor-pointer;
}

.empty-hint-text {
  @apply font-medium;
}

/* 不同的放置區域類型 */
.drop-zone[data-drop-zone='trash'] .drop-hint {
  @apply bg-red-500;
}

.drop-zone[data-drop-zone='trash'] .indicator-line {
  @apply bg-red-500;
}

.drop-zone[data-drop-zone='trash'] .indicator-line::before,
.drop-zone[data-drop-zone='trash'] .indicator-line::after {
  @apply bg-red-500;
}

/* 動畫效果 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.indicator-active .indicator-line {
  animation: pulse 1.5s ease-in-out infinite;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .drop-hint {
    @apply text-xs px-2 py-1;
  }

  .empty-hint-content {
    @apply px-3 py-1.5 text-xs;
  }
}

/* 高對比度模式支援 */
@media (prefers-contrast: high) {
  .indicator-line {
    @apply bg-black;
  }

  .drop-hint {
    @apply bg-black;
  }

  .indicator-line::before,
  .indicator-line::after {
    @apply bg-black;
  }
}

/* 減少動畫模式支援 */
@media (prefers-reduced-motion: reduce) {
  .drop-indicator,
  .empty-hint,
  .indicator-line {
    @apply transition-none;
  }

  .indicator-active .indicator-line {
    animation: none;
  }
}
</style>
