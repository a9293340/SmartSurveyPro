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
  'w-full px-3 py-2 border rounded-lg transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  props.error
    ? 'border-red-300 bg-red-50'
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

/* 手機端優化 */
@media (max-width: 768px) {
  .text-short-input input {
    @apply text-base; /* 防止 iOS Safari 縮放 */
  }
}
</style>
