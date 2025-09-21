<template>
  <div class="text-short-input">
    <input
      ref="inputRef"
      v-model="localValue"
      :type="inputType"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :class="inputClasses"
      :aria-invalid="hasValidationError"
      :aria-describedby="ariaDescribedBy"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 字數統計 -->
    <div v-if="showCharCount" :class="['char-count mt-1 text-xs text-right', charCountClasses]">
      {{ currentLength }}{{ maxLength ? ` / ${maxLength}` : '' }}
    </div>

    <!-- 驗證訊息 -->
    <ValidationMessage
      v-if="validationResult"
      :result="validationResult"
      :compact="true"
      class="mt-2"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, inject } from 'vue';
import type { Question } from '@smartsurvey/shared';
import type { ValidationResult } from '~/composables/useFormValidation';
import { getValidationCssClass, debounce } from '~/composables/useFormValidation';
import ValidationMessage from '../ValidationMessage.vue';

// ============================================================================
// Props 和 Emits
// ============================================================================

interface Props {
  question: Question;
  value?: string;
  error?: string;
}

interface Emits {
  (e: 'update:value', value: string): void;
  (e: 'validate', questionId: string, value: string, trigger: 'input' | 'blur' | 'focus'): void;
  (e: 'touch', questionId: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

// ============================================================================
// 注入驗證系統
// ============================================================================

interface ValidationContext {
  getFieldValidation: (questionId: string) => any;
  isFieldValid: (questionId: string) => boolean;
  hasFieldError: (questionId: string) => boolean;
  getFieldErrors: (questionId: string) => string[];
}

// 注入驗證上下文（如果存在）
const validationContext = inject<ValidationContext | null>('validationContext');

// ============================================================================
// 組件狀態
// ============================================================================

const inputRef = ref<HTMLInputElement>();
const localValue = ref<string>(props.value || '');

// ============================================================================
// 計算屬性
// ============================================================================

/** 當前驗證結果 */
const validationResult = computed((): ValidationResult | null => {
  if (!validationContext) return null;
  const fieldValidation = validationContext.getFieldValidation(props.question.id);
  return fieldValidation?.result || null;
});

/** 是否有驗證錯誤 */
const hasValidationError = computed(() => {
  return validationResult.value?.level === 'error' || !!props.error;
});

/** 是否有驗證警告 */
const hasValidationWarning = computed(() => {
  return validationResult.value?.level === 'warning';
});

/** 是否驗證成功 */
const isValidationSuccess = computed(() => {
  return validationResult.value?.level === 'success' && localValue.value.length > 0;
});

/** 輸入框類型 */
const inputType = computed(() => {
  const config = props.question.config as { inputType?: string } | undefined;
  switch (props.question.type) {
    case 'email':
      return 'email';
    case 'url':
      return 'url';
    case 'number':
      return 'number';
    default:
      return config?.inputType || 'text';
  }
});

/** 輸入框樣式類別 */
const inputClasses = computed(() => {
  const baseClasses = [
    'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200',
    'min-h-[48px] text-base', // 觸控友善高度和字體大小
    'focus:outline-none focus:ring-2',
    'placeholder:text-gray-400 placeholder:opacity-100',
  ];

  // 根據驗證狀態決定樣式
  if (hasValidationError.value) {
    baseClasses.push(
      'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500 focus:ring-red-100'
    );
  } else if (hasValidationWarning.value) {
    baseClasses.push(
      'border-amber-300 bg-amber-50 focus:border-amber-500 focus:ring-amber-500 focus:ring-amber-100'
    );
  } else if (isValidationSuccess.value) {
    baseClasses.push(
      'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500 focus:ring-green-100'
    );
  } else {
    baseClasses.push(
      'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-100'
    );
  }

  return baseClasses;
});

/** 占位符文字 */
const placeholder = computed(() => {
  const config = props.question.config as { placeholder?: string } | undefined;
  return config?.placeholder || '請輸入您的答案...';
});

/** 最大字數限制 */
const maxLength = computed(() => {
  const validation = props.question.validation as { maxLength?: number } | undefined;
  return validation?.maxLength || undefined;
});

/** 是否顯示字數統計 */
const showCharCount = computed(() => {
  return maxLength.value !== undefined || localValue.value.length > 0;
});

/** 當前字數 */
const currentLength = computed(() => localValue.value.length);

/** 字數統計樣式 */
const charCountClasses = computed(() => {
  if (maxLength.value && currentLength.value > maxLength.value) {
    return 'text-red-600 font-medium';
  } else if (maxLength.value && currentLength.value > maxLength.value * 0.8) {
    return 'text-amber-600 font-medium';
  } else {
    return 'text-gray-500';
  }
});

/** ARIA 描述屬性 */
const ariaDescribedBy = computed(() => {
  const ids: string[] = [];
  if (hasValidationError.value || hasValidationWarning.value) {
    ids.push(`${props.question.id}-validation`);
  }
  if (showCharCount.value) {
    ids.push(`${props.question.id}-char-count`);
  }
  return ids.length > 0 ? ids.join(' ') : undefined;
});

// ============================================================================
// 監聽器
// ============================================================================

/** 監聽外部值變化 */
watch(
  () => props.value,
  newValue => {
    if (newValue !== localValue.value) {
      localValue.value = newValue || '';
    }
  }
);

// ============================================================================
// 事件處理
// ============================================================================

// 防抖的驗證函數
const debouncedValidate = debounce((value: string) => {
  emits('validate', props.question.id, value, 'input');
}, 300);

/**
 * 處理輸入事件
 */
function handleInput(): void {
  emits('update:value', localValue.value);

  // 觸發即時驗證（防抖）
  if (validationContext) {
    debouncedValidate(localValue.value);
  }
}

/**
 * 處理失焦事件
 */
function handleBlur(): void {
  emits('update:value', localValue.value);

  // 觸發失焦驗證
  if (validationContext) {
    emits('validate', props.question.id, localValue.value, 'blur');
    emits('touch', props.question.id);
  }
}

/**
 * 處理聚焦事件
 */
function handleFocus(): void {
  // 觸發聚焦驗證（如果需要）
  if (validationContext) {
    emits('validate', props.question.id, localValue.value, 'focus');
  }
}

// ============================================================================
// 公開方法
// ============================================================================

/** 聚焦到輸入框 */
function focus(): void {
  nextTick(() => {
    inputRef.value?.focus();
  });
}

defineExpose({
  focus,
});
</script>

<style scoped>
.text-short-input {
  @apply w-full;
}

/* 手機端觸控優化 */
@media (max-width: 639px) {
  .text-short-input input {
    /* 確保觸控友善 */
    min-height: 52px;
    padding: 0.875rem 1rem;
    font-size: 1rem; /* 防止 iOS Safari 縮放 */
    line-height: 1.5;
  }

  .char-count {
    /* 手機端字數統計 */
    font-size: 0.75rem;
    margin-top: 0.375rem;
  }
}

/* 超小螢幕優化 */
@media (max-width: 359px) {
  .text-short-input input {
    min-height: 48px;
    padding: 0.75rem;
  }
}

/* 焦點增強 */
.text-short-input input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.text-short-input input[data-error='true']:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 觸控設備優化 */
@media (hover: none) and (pointer: coarse) {
  .text-short-input input {
    /* 觸控設備不需要hover效果 */
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
}

/* 無障礙設計 */
@media (prefers-contrast: high) {
  .text-short-input input {
    border-width: 2px;
    border-color: #374151;
  }

  .text-short-input input:focus {
    border-color: #1d4ed8;
    box-shadow: 0 0 0 2px #1d4ed8;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .text-short-input input {
    transition: none;
  }
}
</style>
