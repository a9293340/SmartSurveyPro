<template>
  <div class="text-short-preview">
    <!-- 錯誤訊息顯示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 文字輸入框 -->
    <div class="input-wrapper">
      <input
        type="text"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :value="value || ''"
        :disabled="readonly"
        class="text-input"
        :class="{
          'input-error': showValidationError,
          'input-disabled': readonly,
        }"
        @input="handleInput"
      />

      <!-- 字數限制提示 -->
      <div v-if="maxLength" class="length-hint">
        <span class="length-text">0 / {{ maxLength }} 字</span>
      </div>
    </div>

    <!-- 格式化選項 -->
    <div v-if="showFormatHint" class="format-hint">
      <Icon :name="getFormatIcon(inputType)" class="w-4 h-4 text-gray-500" />
      <span class="hint-text">{{ getFormatHint(inputType) }}</span>
    </div>

    <!-- 驗證規則提示 -->
    <div v-if="question.validation" class="validation-hints">
      <div v-if="question.validation.required" class="validation-item">
        <Icon name="heroicons:exclamation-triangle" class="w-3 h-3 text-amber-500" />
        <span class="validation-text">此題為必填</span>
      </div>
      <div v-if="minLength" class="validation-item">
        <Icon name="heroicons:information-circle" class="w-3 h-3 text-blue-500" />
        <span class="validation-text">最少 {{ minLength }} 字</span>
      </div>
      <div v-if="pattern" class="validation-item">
        <Icon name="heroicons:shield-check" class="w-3 h-3 text-green-500" />
        <span class="validation-text">{{ getPatternHint(pattern) }}</span>
      </div>
    </div>

    <!-- 配置選項（僅在編輯模式下顯示） -->
    <div v-if="!previewMode" class="config-options">
      <div class="config-section">
        <label class="config-label">
          輸入格式：
          <select :value="inputType" class="config-select" @change="updateInputType">
            <option value="text">一般文字</option>
            <option value="email">電子郵件</option>
            <option value="url">網址</option>
            <option value="tel">電話</option>
          </select>
        </label>
      </div>

      <div class="config-section">
        <label class="config-label">
          字數限制：
          <input
            type="number"
            :value="maxLength || ''"
            placeholder="無限制"
            min="1"
            max="1000"
            class="config-input"
            @input="updateMaxLength"
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
  value?: string;
  error?: string;
  readonly?: boolean;
  previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  previewMode: false,
});

// Emits
const emit = defineEmits<{
  updateQuestion: [questionId: string, updates: Partial<Question>];
  update: [value: string];
}>();

// 響應式狀態
const showValidationError = ref(false);

// 計算屬性
const config = computed(() => props.question.config || {});
const maxLength = computed(() => (config.value as Record<string, unknown>).maxLength as number);
const inputType = computed(
  () => ((config.value as Record<string, unknown>).inputType as string) || 'text'
);
const placeholder = computed(
  () => ((config.value as Record<string, unknown>).placeholder as string) || '請輸入您的答案...'
);
const showFormatHint = computed(() => inputType.value && inputType.value !== 'text');
const minLength = computed(
  () => (props.question.validation as Record<string, unknown>)?.minLength as number
);
const pattern = computed(
  () => (props.question.validation as Record<string, unknown>)?.pattern as string
);

// 方法
function getFormatIcon(inputType: string): string {
  const iconMap: Record<string, string> = {
    email: 'heroicons:envelope',
    url: 'heroicons:link',
    tel: 'heroicons:phone',
    text: 'heroicons:pencil',
  };
  return iconMap[inputType] || 'heroicons:pencil';
}

function getFormatHint(inputType: string): string {
  const hintMap: Record<string, string> = {
    email: '請輸入有效的電子郵件地址',
    url: '請輸入有效的網址 (如：https://example.com)',
    tel: '請輸入電話號碼',
    text: '一般文字輸入',
  };
  return hintMap[inputType] || '一般文字輸入';
}

function getPatternHint(pattern: string): string {
  // 常見模式的友好提示
  const patternHints: Record<string, string> = {
    '^[0-9]+$': '僅限數字',
    '^[a-zA-Z]+$': '僅限英文字母',
    '^[a-zA-Z0-9]+$': '僅限英文字母和數字',
  };
  return patternHints[pattern] || '符合特定格式';
}

function updateInputType(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      inputType: target.value,
    },
  });
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update', target.value);
}

function updateMaxLength(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || undefined;

  emit('updateQuestion', props.question.id, {
    config: {
      ...config.value,
      maxLength: value,
    },
  });
}
</script>

<style scoped>
.text-short-preview {
  @apply space-y-3;
}

/* 錯誤訊息樣式 */
.error-message {
  @apply text-sm text-red-600 mb-2 px-2 py-1;
  @apply bg-red-50 border border-red-200 rounded;
}

.input-wrapper {
  @apply relative;
}

.text-input {
  @apply w-full px-3 py-2 text-sm;
  @apply border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors;
}

.text-input.input-disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed;
}

.text-input.input-error {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

.length-hint {
  @apply absolute right-2 top-2 text-xs text-gray-400;
  @apply pointer-events-none;
}

.length-text {
  @apply bg-white px-1;
}

.format-hint {
  @apply flex items-center gap-2 px-2 py-1;
  @apply text-xs text-gray-600;
  @apply bg-blue-50 rounded;
}

.hint-text {
  @apply text-xs;
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

.config-section {
  @apply space-y-1;
}

.config-label {
  @apply block text-xs font-medium text-gray-700;
  @apply space-y-1;
}

.config-select,
.config-input {
  @apply block w-full px-2 py-1 text-xs;
  @apply border border-gray-300 rounded;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
}

.config-input {
  @apply max-w-24;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .text-input {
    @apply text-xs px-2 py-1.5;
  }

  .config-options {
    @apply space-y-2;
  }
}
</style>
