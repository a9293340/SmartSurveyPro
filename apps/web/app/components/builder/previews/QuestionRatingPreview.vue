<template>
  <div class="rating-preview">
    <!-- 錯誤訊息顯示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 評分類型切換 -->
    <div v-if="!previewMode" class="rating-type-selector">
      <div class="type-options">
        <button
          v-for="type in ratingTypes"
          :key="type.value"
          type="button"
          class="type-button"
          :class="{ 'type-active': ((config as any)?.ratingType || 'star') === type.value }"
          @click="updateRatingType(type.value)"
        >
          <Icon :name="type.icon" class="w-4 h-4" />
          <span>{{ type.label }}</span>
        </button>
      </div>
    </div>

    <!-- 星級評分 -->
    <div v-if="((config as any)?.ratingType || 'star') === 'star'" class="star-rating">
      <div class="star-container">
        <button
          v-for="n in (config as any)?.maxRating || 5"
          :key="n"
          type="button"
          class="star-button"
          :class="{
            'star-filled': n <= currentRating,
            'star-hover': n <= hoverRating,
            'star-disabled': readonly,
          }"
          :disabled="readonly"
          @click="selectRating(n)"
          @mouseenter="hoverRating = n"
          @mouseleave="hoverRating = 0"
        >
          <Icon name="heroicons:star" class="star-icon" />
        </button>
      </div>

      <!-- 評分標籤 -->
      <div v-if="(config as any)?.showLabels" class="rating-labels">
        <span class="label-start">{{ (config as any)?.minLabel || '很差' }}</span>
        <span class="label-end">{{ (config as any)?.maxLabel || '很好' }}</span>
      </div>
    </div>

    <!-- 數字評分 -->
    <div v-else-if="(config as any)?.ratingType === 'number'" class="number-rating">
      <div class="number-container">
        <button
          v-for="n in (config as any)?.maxRating || 10"
          :key="n"
          type="button"
          class="number-button"
          :class="{
            'number-selected': n === currentRating,
            'number-disabled': readonly,
          }"
          :disabled="readonly"
          @click="selectRating(n)"
        >
          {{ n }}
        </button>
      </div>

      <!-- 評分範圍提示 -->
      <div class="range-hint">
        <span class="range-text">1 - {{ (config as any)?.maxRating || 10 }} 分</span>
      </div>
    </div>

    <!-- 量表評分 -->
    <div v-else-if="(config as any)?.ratingType === 'scale'" class="scale-rating">
      <div class="scale-container">
        <input
          type="range"
          :min="1"
          :max="(config as any)?.maxRating || 10"
          :value="currentRating"
          :disabled="readonly"
          class="scale-slider"
          @input="updateSliderRating"
        />
        <div class="scale-value">
          {{ currentRating || 1 }} / {{ (config as any)?.maxRating || 10 }}
        </div>
      </div>

      <!-- 標籤 -->
      <div v-if="(config as any)?.showLabels" class="scale-labels">
        <span class="label-start">{{ (config as any)?.minLabel || '完全不同意' }}</span>
        <span class="label-end">{{ (config as any)?.maxLabel || '完全同意' }}</span>
      </div>
    </div>

    <!-- 配置選項（僅在編輯模式下顯示） -->
    <div v-if="!previewMode" class="config-options">
      <div class="config-row">
        <div class="config-section">
          <label class="config-label">
            最高分數：
            <input
              type="number"
              :value="
                (config as any)?.maxRating ||
                (((config as any)?.ratingType || 'star') === 'star' ? 5 : 10)
              "
              :min="((config as any)?.ratingType || 'star') === 'star' ? 3 : 2"
              :max="((config as any)?.ratingType || 'star') === 'star' ? 10 : 100"
              class="config-input"
              @input="updateMaxRating"
            />
          </label>
        </div>

        <div class="config-section">
          <label class="config-checkbox">
            <input
              type="checkbox"
              :checked="(config as any)?.showLabels"
              class="checkbox"
              @change="updateShowLabels"
            />
            <span class="checkbox-label">顯示標籤</span>
          </label>
        </div>
      </div>

      <div v-if="(config as any)?.showLabels" class="config-row">
        <div class="config-section">
          <label class="config-label">
            最低分標籤：
            <input
              type="text"
              :value="(config as Record<string, unknown>).minLabel || ''"
              placeholder="例：很差"
              class="config-text-input"
              @input="updateMinLabel"
            />
          </label>
        </div>

        <div class="config-section">
          <label class="config-label">
            最高分標籤：
            <input
              type="text"
              :value="(config as Record<string, unknown>).maxLabel || ''"
              placeholder="例：很好"
              class="config-text-input"
              @input="updateMaxLabel"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Question } from '@smartsurvey/shared';

// Props
interface Props {
  question: Question;
  value?: number;
  error?: string;
  readonly?: boolean;
  previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  previewMode: false,
  readonly: false,
});

// Emits
const emit = defineEmits<{
  updateQuestion: [questionId: string, updates: Partial<Question>];
  update: [value: number];
}>();

// 響應式狀態
const currentRating = computed(() => props.value || 0);
const hoverRating = ref(0);

// 評分類型定義
const ratingTypes = [
  { value: 'star', label: '星級', icon: 'heroicons:star' },
  { value: 'number', label: '數字', icon: 'heroicons:hashtag' },
  { value: 'scale', label: '量表', icon: 'heroicons:chart-bar-square' },
];

// 計算屬性
const config = computed(() => props.question.config || {});

// 方法
function selectRating(rating: number) {
  emit('update', rating);
}

function updateSliderRating(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value);
  emit('update', value);
}

function updateRatingType(type: string) {
  const defaultMaxRating = type === 'star' ? 5 : 10;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      ratingType: type,
      maxRating: (config.value as Record<string, unknown>).maxRating || defaultMaxRating,
    } as Record<string, unknown>,
  });
}

function updateMaxRating(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 5;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      maxRating: value,
    },
  });
}

function updateShowLabels(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      showLabels: target.checked,
    },
  });
}

function updateMinLabel(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      minLabel: target.value || undefined,
    },
  });
}

function updateMaxLabel(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      maxLabel: target.value || undefined,
    },
  });
}
</script>

<style scoped>
.rating-preview {
  @apply space-y-4;
}

/* 評分類型選擇器 */
.rating-type-selector {
  @apply pb-3 border-b border-gray-100;
}

.type-options {
  @apply flex gap-2;
}

.type-button {
  @apply flex items-center gap-2 px-3 py-2;
  @apply text-sm text-gray-600 hover:text-gray-800;
  @apply border border-gray-300 hover:border-gray-400;
  @apply rounded-lg transition-colors;
}

.type-button.type-active {
  @apply text-blue-600 border-blue-500 bg-blue-50;
}

/* 星級評分 */
.star-rating {
  @apply space-y-3;
}

.star-container {
  @apply flex gap-1;
}

.star-button {
  @apply transition-colors;
}

.star-button.star-disabled {
  @apply cursor-default;
}

.star-icon {
  @apply w-6 h-6 text-gray-300;
  @apply transition-colors;
}

.star-button.star-filled .star-icon,
.star-button.star-hover .star-icon {
  @apply text-yellow-400;
}

.star-button:hover:not(.star-disabled) .star-icon {
  @apply text-yellow-300;
}

.rating-labels {
  @apply flex justify-between text-xs text-gray-500;
}

/* 數字評分 */
.number-rating {
  @apply space-y-3;
}

.number-container {
  @apply flex gap-2 flex-wrap;
}

.number-button {
  @apply w-10 h-10 flex items-center justify-center;
  @apply text-sm font-medium;
  @apply border border-gray-300 rounded-lg;
  @apply transition-colors;
  @apply hover:border-gray-400;
}

.number-button.number-selected {
  @apply border-blue-500 bg-blue-500 text-white;
}

.number-button.number-disabled {
  @apply cursor-default hover:border-gray-300;
}

.range-hint {
  @apply text-xs text-gray-500 text-center;
}

/* 量表評分 */
.scale-rating {
  @apply space-y-3;
}

.scale-container {
  @apply space-y-2;
}

.scale-slider {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

.scale-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

.scale-slider::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-0;
}

.scale-value {
  @apply text-center text-sm font-medium text-gray-700;
}

.scale-labels {
  @apply flex justify-between text-xs text-gray-500;
}

.label-start,
.label-end {
  @apply max-w-20 text-center;
}

/* 配置選項 */
.config-options {
  @apply pt-3 border-t border-gray-100 space-y-3;
}

.config-row {
  @apply grid grid-cols-2 gap-3;
}

.config-section {
  @apply space-y-1;
}

.config-label {
  @apply block text-xs font-medium text-gray-700 space-y-1;
}

.config-checkbox {
  @apply flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer;
}

.checkbox {
  @apply w-3 h-3 text-blue-600 border-gray-300 rounded;
  @apply focus:ring-blue-500 focus:ring-2;
}

.checkbox-label {
  @apply cursor-pointer;
}

.config-input,
.config-text-input {
  @apply block w-full px-2 py-1 text-xs;
  @apply border border-gray-300 rounded;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
}

.config-input {
  @apply max-w-20;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .type-options {
    @apply flex-col;
  }

  .star-container {
    @apply justify-center;
  }

  .number-container {
    @apply justify-center;
  }

  .config-row {
    @apply grid-cols-1 gap-2;
  }
}
</style>
