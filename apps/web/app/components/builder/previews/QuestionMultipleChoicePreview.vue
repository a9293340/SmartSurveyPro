<template>
  <div class="multiple-choice-preview">
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
            type="checkbox"
            :value="option.value"
            :disabled="previewMode"
            class="checkbox-input"
          />
          <label :for="`option-${question.id}-${index}`" class="checkbox-label">
            <span class="checkbox-indicator">
              <Icon name="heroicons:check" class="check-icon w-3 h-3" />
            </span>
            <span class="option-text">{{ option.text || `選項 ${index + 1}` }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 選項限制提示 -->
    <div v-if="(config as any).minChoices || (config as any).maxChoices" class="constraints-hint">
      <span class="hint-text">
        <template v-if="(config as any).minChoices && (config as any).maxChoices">
          請選擇 {{ (config as any).minChoices }}-{{ (config as any).maxChoices }} 個選項
        </template>
        <template v-else-if="(config as any).minChoices">
          至少選擇 {{ (config as any).minChoices }} 個選項
        </template>
        <template v-else-if="(config as any).maxChoices">
          最多選擇 {{ (config as any).maxChoices }} 個選項
        </template>
      </span>
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
          type="checkbox"
          value="__other__"
          :disabled="previewMode"
          class="checkbox-input"
        />
        <label :for="`other-${question.id}`" class="checkbox-label">
          <span class="checkbox-indicator">
            <Icon name="heroicons:check" class="check-icon w-3 h-3" />
          </span>
          <span class="option-text">其他</span>
        </label>
      </div>
      <input type="text" placeholder="請說明..." class="other-input" :disabled="previewMode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
  // 統一格式：支援 text 和 label 屬性
  return options.map((option: any, index: number) => ({
    id: option.id || String(index + 1),
    text: option.text || option.label || `選項 ${index + 1}`,
    value: option.value || option.id || String(index + 1),
  }));
});

// 方法
function addOption() {
  const currentOptions = (config.value as any)?.options || [];
  const newOption = {
    id: `option-${Date.now()}`,
    text: `選項 ${currentOptions.length + 1}`,
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
.multiple-choice-preview {
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

.checkbox-input {
  @apply sr-only;
}

.checkbox-label {
  @apply flex items-start gap-3 cursor-pointer;
  @apply p-2 rounded-lg hover:bg-gray-50;
  @apply transition-colors;
}

.checkbox-input:disabled + .checkbox-label {
  @apply cursor-default hover:bg-transparent;
}

.checkbox-indicator {
  @apply w-4 h-4 mt-0.5 border-2 border-gray-300 rounded;
  @apply flex items-center justify-center;
  @apply transition-colors;
}

.checkbox-input:checked + .checkbox-label .checkbox-indicator {
  @apply border-blue-500 bg-blue-500;
}

.checkbox-input:focus + .checkbox-label .checkbox-indicator {
  @apply ring-2 ring-blue-500 ring-offset-1;
}

.check-icon {
  @apply text-white opacity-0 transition-opacity;
}

.checkbox-input:checked + .checkbox-label .check-icon {
  @apply opacity-100;
}

.option-text {
  @apply text-sm text-gray-700 flex-1;
  @apply leading-5;
}

.constraints-hint {
  @apply text-xs text-gray-500 italic;
  @apply px-2 py-1 bg-gray-50 rounded;
}

.hint-text {
  @apply flex items-center gap-1;
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
  .checkbox-label {
    @apply p-1.5;
  }

  .option-text {
    @apply text-xs;
  }
}
</style>
