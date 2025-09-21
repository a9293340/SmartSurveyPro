<template>
  <div class="text-short-input">
    <input
      ref="inputRef"
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
    />

    <!-- 字數統計 -->
    <div v-if="showCharCount" class="char-count mt-1 text-xs text-gray-500 text-right">
      {{ currentLength }}{{ maxLength ? ` / ${maxLength}` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { Question } from '@smartsurvey/shared';

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
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

// ============================================================================
// 組件狀態
// ============================================================================

const inputRef = ref<HTMLInputElement>();
const localValue = ref<string>(props.value || '');

// ============================================================================
// 計算屬性
// ============================================================================

/** 輸入框樣式類別 */
const inputClasses = computed(() => [
  'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200',
  'min-h-[48px] text-base', // 觸控友善高度和字體大小
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  'placeholder:text-gray-400 placeholder:opacity-100',
  props.error
    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 hover:border-gray-400 focus:border-blue-500',
]);

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

/**
 * 處理輸入事件
 */
function handleInput(): void {
  emits('update:value', localValue.value);
}

/**
 * 處理失焦事件
 */
function handleBlur(): void {
  // 可以在這裡添加失焦時的處理邏輯
  emits('update:value', localValue.value);
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
