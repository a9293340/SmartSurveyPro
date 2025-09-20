<template>
  <div class="text-long-preview">
    <!-- 文字區域 -->
    <div class="textarea-wrapper">
      <textarea
        :placeholder="(config as any)?.placeholder || '請詳細描述您的想法...'"
        :maxlength="(config as any)?.maxLength"
        :rows="(config as any)?.rows || 4"
        :disabled="previewMode"
        class="textarea-input"
        :class="{
          'input-error': showValidationError,
          'input-disabled': previewMode,
        }"
      />

      <!-- 字數統計 -->
      <div v-if="(config as any)?.maxLength || (config as any)?.showWordCount" class="word-count">
        <span class="count-text">
          0{{ (config as any)?.maxLength ? ` / ${(config as any)?.maxLength}` : '' }} 字
        </span>
      </div>
    </div>

    <!-- 輸入提示 -->
    <div v-if="(config as any)?.helpText" class="help-text">
      <Icon name="heroicons:information-circle" class="w-4 h-4 text-blue-500" />
      <span class="help-content">{{ (config as any)?.helpText }}</span>
    </div>

    <!-- 驗證規則提示 -->
    <div v-if="question.validation" class="validation-hints">
      <div v-if="question.validation.required" class="validation-item">
        <Icon name="heroicons:exclamation-triangle" class="w-3 h-3 text-amber-500" />
        <span class="validation-text">此題為必填</span>
      </div>
      <div v-if="(question.validation as any)?.minLength" class="validation-item">
        <Icon name="heroicons:information-circle" class="w-3 h-3 text-blue-500" />
        <span class="validation-text">最少 {{ (question.validation as any)?.minLength }} 字</span>
      </div>
      <div v-if="(question.validation as any)?.maxWords" class="validation-item">
        <Icon name="heroicons:document-text" class="w-3 h-3 text-green-500" />
        <span class="validation-text">最多 {{ (question.validation as any)?.maxWords }} 個字</span>
      </div>
    </div>

    <!-- 配置選項（僅在編輯模式下顯示） -->
    <div v-if="!previewMode" class="config-options">
      <div class="config-row">
        <div class="config-section">
          <label class="config-label">
            顯示行數：
            <input
              type="number"
              :value="(config as any)?.rows || 4"
              min="2"
              max="20"
              class="config-input"
              @input="updateRows"
            />
          </label>
        </div>

        <div class="config-section">
          <label class="config-label">
            字數限制：
            <input
              type="number"
              :value="(config as any)?.maxLength || ''"
              placeholder="無限制"
              min="1"
              max="10000"
              class="config-input"
              @input="updateMaxLength"
            />
          </label>
        </div>
      </div>

      <div class="config-section">
        <label class="config-checkbox">
          <input
            type="checkbox"
            :checked="(config as any)?.showWordCount"
            class="checkbox"
            @change="updateShowWordCount"
          />
          <span class="checkbox-label">顯示字數統計</span>
        </label>
      </div>

      <div class="config-section">
        <label class="config-label">
          輸入提示：
          <input
            type="text"
            :value="(config as any)?.helpText || ''"
            placeholder="提供輸入指引..."
            class="config-text-input"
            @input="updateHelpText"
          />
        </label>
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
  previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  previewMode: false,
});

// Emits
const emit = defineEmits<{
  updateQuestion: [questionId: string, updates: Partial<Question>];
}>();

// 響應式狀態
const showValidationError = ref(false);

// 計算屬性
const config = computed(() => props.question.config || {});

// 方法
function updateRows(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 4;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      rows: Math.max(2, Math.min(20, value)),
    } as any,
  });
}

function updateMaxLength(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || undefined;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      maxLength: value,
    } as any,
  });
}

function updateShowWordCount(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      showWordCount: target.checked,
    } as any,
  });
}

function updateHelpText(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      helpText: target.value || undefined,
    } as any,
  });
}
</script>

<style scoped>
.text-long-preview {
  @apply space-y-3;
}

.textarea-wrapper {
  @apply relative;
}

.textarea-input {
  @apply w-full px-3 py-2 text-sm;
  @apply border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors;
  @apply resize-y min-h-[80px];
}

.textarea-input.input-disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed resize-none;
}

.textarea-input.input-error {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

.word-count {
  @apply absolute bottom-2 right-2;
  @apply text-xs text-gray-400;
  @apply bg-white px-1 rounded;
  @apply pointer-events-none;
}

.count-text {
  @apply font-mono;
}

.help-text {
  @apply flex items-start gap-2 px-3 py-2;
  @apply text-sm text-blue-700;
  @apply bg-blue-50 rounded-md;
}

.help-content {
  @apply flex-1;
}

.validation-hints {
  @apply space-y-1;
}

.validation-item {
  @apply flex items-center gap-2 text-xs;
}

.validation-text {
  @apply text-gray-600;
}

.config-options {
  @apply pt-3 border-t border-gray-100;
  @apply space-y-3;
}

.config-row {
  @apply grid grid-cols-2 gap-3;
}

.config-section {
  @apply space-y-1;
}

.config-label {
  @apply block text-xs font-medium text-gray-700;
  @apply space-y-1;
}

.config-checkbox {
  @apply flex items-center gap-2 text-xs font-medium text-gray-700;
  @apply cursor-pointer;
}

.checkbox {
  @apply w-3 h-3 text-blue-600;
  @apply border-gray-300 rounded;
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
  .textarea-input {
    @apply text-xs px-2 py-1.5;
  }

  .config-row {
    @apply grid-cols-1 gap-2;
  }

  .config-options {
    @apply space-y-2;
  }
}
</style>
