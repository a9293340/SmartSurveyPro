<template>
  <div class="single-choice-preview">
    <!-- 選項列表 -->
    <div class="options-list">
      <div
        v-for="(option, index) in displayOptions"
        :key="option.id"
        class="option-item"
        :class="{ 'option-disabled': previewMode }"
      >
        <div class="option-input">
          <input
            :id="`option-${question.id}-${index}`"
            type="radio"
            :name="`question-${question.id}`"
            :value="option.value"
            :disabled="previewMode"
            class="radio-input"
          />
          <label :for="`option-${question.id}-${index}`" class="radio-label">
            <span class="radio-indicator" />
            <span class="option-text">{{ option.label || `選項 ${index + 1}` }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 添加選項按鈕（僅在編輯模式下顯示） -->
    <div v-if="!previewMode" class="add-option">
      <button type="button" class="add-option-btn" @click="addOption">
        <Icon name="heroicons:plus" class="w-4 h-4" />
        新增選項
      </button>
    </div>

    <!-- 其他選項（如果啟用） -->
    <div v-if="(config as any).allowOther" class="other-option">
      <div class="option-input">
        <input
          :id="`other-${question.id}`"
          type="radio"
          :name="`question-${question.id}`"
          value="__other__"
          :disabled="previewMode"
          class="radio-input"
        />
        <label :for="`other-${question.id}`" class="radio-label">
          <span class="radio-indicator" />
          <span class="option-text">其他</span>
        </label>
      </div>
      <input type="text" placeholder="請說明..." class="other-input" :disabled="previewMode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { Question } from '@smartsurvey/shared';

// Props
interface Props {
  question: Question;
  previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  previewMode: false,
});

// Emits
const emit = defineEmits<{
  updateQuestion: [questionId: string, updates: Partial<Question>];
}>();

// 計算屬性
const config = computed(() => props.question.config || {});

const displayOptions = computed(() => {
  const options = (config.value as any)?.options || [];
  // 確保至少有 2 個選項
  if (options.length < 2) {
    return [
      { id: '1', label: '選項 1', value: '1' },
      { id: '2', label: '選項 2', value: '2' },
    ];
  }
  return options;
});

// 方法
function addOption() {
  const currentOptions = (config.value as any)?.options || [];
  const newOption = {
    id: `option-${Date.now()}`,
    label: `選項 ${currentOptions.length + 1}`,
    value: `${currentOptions.length + 1}`,
  };

  const updatedOptions = [...currentOptions, newOption];

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      options: updatedOptions,
    } as any,
  });
}
</script>

<style scoped>
.single-choice-preview {
  @apply space-y-3;
}

.options-list {
  @apply space-y-2;
}

.option-item {
  @apply transition-colors;
}

.option-item.option-disabled {
  @apply opacity-75;
}

.option-input {
  @apply flex items-start gap-2;
}

.radio-input {
  @apply sr-only;
}

.radio-label {
  @apply flex items-start gap-3 cursor-pointer;
  @apply p-2 rounded-lg hover:bg-gray-50;
  @apply transition-colors;
}

.radio-input:disabled + .radio-label {
  @apply cursor-default hover:bg-transparent;
}

.radio-indicator {
  @apply w-4 h-4 mt-0.5 border-2 border-gray-300 rounded-full;
  @apply flex items-center justify-center;
  @apply transition-colors;
}

.radio-input:checked + .radio-label .radio-indicator {
  @apply border-blue-500 bg-blue-500;
}

.radio-input:checked + .radio-label .radio-indicator::after {
  content: '';
  @apply w-2 h-2 bg-white rounded-full;
}

.radio-input:focus + .radio-label .radio-indicator {
  @apply ring-2 ring-blue-500 ring-offset-1;
}

.option-text {
  @apply text-sm text-gray-700 flex-1;
  @apply leading-5;
}

.add-option {
  @apply pt-2 border-t border-gray-100;
}

.add-option-btn {
  @apply flex items-center gap-2 px-3 py-2;
  @apply text-sm text-gray-600 hover:text-gray-800;
  @apply border border-dashed border-gray-300 hover:border-gray-400;
  @apply rounded-lg transition-colors;
  @apply w-full justify-center;
}

.other-option {
  @apply pt-2 border-t border-gray-100 space-y-2;
}

.other-input {
  @apply ml-7 w-full px-3 py-2 text-sm;
  @apply border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply disabled:bg-gray-50 disabled:text-gray-500;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .radio-label {
    @apply p-1.5;
  }

  .option-text {
    @apply text-xs;
  }
}
</style>
