<template>
  <div class="single-choice-preview">
    <!-- 錯誤訊息顯示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 選項列表 -->
    <div class="options-list">
      <div
        v-for="(option, index) in displayOptions"
        :key="option.id"
        class="option-item"
        :class="{ 'option-disabled': readonly }"
      >
        <div class="option-input">
          <input
            :id="`option-${question.id}-${index}`"
            type="radio"
            :name="`question-${question.id}`"
            :value="option.value"
            :checked="props.value === option.value"
            :disabled="readonly"
            class="radio-input"
            @change="handleOptionChange"
          />
          <label :for="`option-${question.id}-${index}`" class="radio-label">
            <span class="radio-indicator" />
            <span class="option-text">{{ option.label }}</span>
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
    <div v-if="config.allowOther" class="other-option">
      <div class="option-input">
        <input
          :id="`other-${question.id}`"
          type="radio"
          :name="`question-${question.id}`"
          value="__other__"
          :checked="props.value === '__other__'"
          :disabled="readonly"
          class="radio-input"
          @change="handleOptionChange"
        />
        <label :for="`other-${question.id}`" class="radio-label">
          <span class="radio-indicator" />
          <span class="option-text">其他</span>
        </label>
      </div>
      <input
        v-if="props.value === '__other__'"
        type="text"
        :placeholder="config.otherPlaceholder || '請說明...'"
        class="other-input"
        :disabled="readonly"
        @input="handleOtherInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Question, QuestionOption, ChoiceQuestion } from '@smartsurvey/shared';

// Props
interface Props {
  question: Question;
  value?: string;
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
  update: [value: string];
}>();

// 類型守衛函數
function isChoiceQuestion(question: Question): question is ChoiceQuestion {
  return ['single_choice', 'multiple_choice', 'dropdown'].includes(question.type);
}

// 計算屬性
const config = computed(() => {
  if (isChoiceQuestion(props.question)) {
    return props.question.config;
  }
  return {
    options: [],
    allowOther: false,
    otherPlaceholder: '請說明...',
    randomizeOptions: false,
  };
});

const displayOptions = computed((): QuestionOption[] => {
  const options = config.value.options || [];

  // 統一格式：確保選項有所有必要屬性
  const normalizedOptions = options.map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    label: option.label || `選項 ${index + 1}`,
    value: option.value || option.id || `option-${index + 1}`,
    isDefault: option.isDefault || false,
    imageUrl: option.imageUrl,
    isOther: option.isOther || false,
  }));

  // 如果需要隨機排序選項
  if (config.value.randomizeOptions && !props.previewMode) {
    return [...normalizedOptions].sort(() => Math.random() - 0.5);
  }

  return normalizedOptions;
});

// 方法
function handleOptionChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.checked) {
    emit('update', target.value);
  }
}

function handleOtherInput(event: Event) {
  const target = event.target as HTMLInputElement;
  // 對於其他選項，我們將值設為 "__other__:用戶輸入的內容"
  emit('update', `__other__:${target.value}`);
}

function addOption() {
  if (!isChoiceQuestion(props.question)) return;

  const currentOptions = config.value.options || [];
  const newOption: QuestionOption = {
    id: `option-${Date.now()}`,
    label: `選項 ${currentOptions.length + 1}`,
    value: `option-${currentOptions.length + 1}`,
    isDefault: false,
  };

  const updatedOptions = [...currentOptions, newOption];

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      options: updatedOptions,
    },
  });
}
</script>

<style scoped>
.single-choice-preview {
  @apply space-y-3;
}

.error-message {
  @apply text-sm text-red-600 mb-2 px-2 py-1 bg-red-50 border border-red-200 rounded;
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
