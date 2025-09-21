<template>
  <div class="single-choice-input">
    <div class="space-y-3">
      <label
        v-for="option in options"
        :key="option.id"
        :class="optionClasses(option.id)"
        @click="selectOption(option.id)"
      >
        <input
          type="radio"
          :name="`question-${question.id}`"
          :value="option.id"
          :checked="localValue === option.id"
          class="sr-only"
          @change="handleChange"
        />

        <!-- 自訂的單選按鈕 -->
        <div class="flex items-center">
          <div :class="radioClasses(option.id)">
            <div v-if="localValue === option.id" class="radio-dot" />
          </div>
          <span class="ml-3 text-gray-900">{{ option.text }}</span>
        </div>

        <!-- 選項描述 -->
        <div v-if="option.description" class="ml-8 mt-1 text-sm text-gray-600">
          {{ option.description }}
        </div>
      </label>
    </div>

    <!-- 其他選項輸入框 -->
    <div v-if="hasOtherOption && localValue === otherOptionId" class="mt-4">
      <input
        ref="otherInputRef"
        v-model="otherValue"
        type="text"
        placeholder="請輸入其他選項..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="handleOtherInput"
      />
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
  (e: 'update:value', value: string | null): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

// ============================================================================
// 組件狀態
// ============================================================================

const otherInputRef = ref<HTMLInputElement>();
const localValue = ref<string | null>(props.value || null);
const otherValue = ref<string>('');

// ============================================================================
// 計算屬性
// ============================================================================

/** 選項列表 */
const options = computed(() => {
  const config = props.question.config as { options?: any[] } | undefined;
  return config?.options || [];
});

/** 是否有其他選項 */
const hasOtherOption = computed(() => {
  const config = props.question.config as { allowOther?: boolean } | undefined;
  return config?.allowOther || false;
});

/** 其他選項的 ID */
const otherOptionId = computed(() => '__other__');

/** 選項樣式類別 */
const optionClasses = (optionId: string) => [
  'relative flex cursor-pointer rounded-lg p-3 transition-colors duration-200',
  'hover:bg-gray-50 focus:outline-none',
  localValue.value === optionId
    ? 'bg-blue-50 border-2 border-blue-200'
    : 'border-2 border-transparent',
  props.error ? 'hover:bg-red-50' : '',
];

/** 單選按鈕樣式類別 */
const radioClasses = (optionId: string) => [
  'flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-200',
  localValue.value === optionId
    ? 'border-blue-600 bg-blue-600'
    : 'border-gray-300 bg-white hover:border-gray-400',
];

// ============================================================================
// 監聽器
// ============================================================================

/** 監聽外部值變化 */
watch(
  () => props.value,
  newValue => {
    if (newValue !== localValue.value) {
      localValue.value = newValue || null;
    }
  }
);

/** 監聽本地值變化，處理其他選項 */
watch(localValue, newValue => {
  if (newValue === otherOptionId.value && hasOtherOption.value) {
    // 選中其他選項時，聚焦到輸入框
    nextTick(() => {
      otherInputRef.value?.focus();
    });
  } else if (newValue !== otherOptionId.value) {
    // 非其他選項時，清空其他選項的值
    otherValue.value = '';
  }
});

// ============================================================================
// 事件處理
// ============================================================================

/**
 * 選擇選項
 */
function selectOption(optionId: string): void {
  localValue.value = optionId;

  let emitValue: string | null = optionId;

  // 如果是其他選項且有輸入值，則使用輸入值
  if (optionId === otherOptionId.value && otherValue.value.trim()) {
    emitValue = otherValue.value.trim();
  }

  emits('update:value', emitValue);
}

/**
 * 處理單選按鈕變化
 */
function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  selectOption(target.value);
}

/**
 * 處理其他選項輸入
 */
function handleOtherInput(): void {
  if (localValue.value === otherOptionId.value) {
    const trimmedValue = otherValue.value.trim();
    emits('update:value', trimmedValue || otherOptionId.value);
  }
}
</script>

<style scoped>
/* ============================================================================ */
/* 單選組件基礎樣式 */
/* ============================================================================ */

.single-choice-input {
  @apply w-full;
}

/* ============================================================================ */
/* 選項標籤觸控優化 */
/* ============================================================================ */

.single-choice-input label {
  /* 確保觸控友善的最小區域 */
  min-height: 56px;
  display: flex;
  align-items: flex-start;

  /* 觸控體驗優化 */
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  /* 避免文字選取 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  /* 觸控回饋 */
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
}

.single-choice-input label:hover {
  background-color: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.single-choice-input label:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* 已選中狀態的特殊樣式 */
.single-choice-input label.bg-blue-50 {
  background-color: #eff6ff !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 1px #3b82f6;
}

.single-choice-input label.bg-blue-50:hover {
  background-color: #dbeafe !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

/* ============================================================================ */
/* 單選按鈕樣式優化 */
/* ============================================================================ */

.single-choice-input .flex.items-center > div:first-child {
  /* 單選按鈕容器 - 增大觸控區域 */
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;

  /* 視覺優化 */
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.radio-dot {
  @apply w-2.5 h-2.5 bg-white rounded-full;
  /* 增大選中指示點，更容易看清 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* ============================================================================ */
/* 文字內容樣式 */
/* ============================================================================ */

.single-choice-input label span {
  /* 確保文字對齊和間距 */
  line-height: 1.5;
  padding-top: 0.125rem; /* 與單選按鈕對齊 */
}

.single-choice-input label .ml-8 {
  /* 描述文字的優化 */
  margin-left: 2.5rem; /* 與主文字對齊 */
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* ============================================================================ */
/* 其他選項輸入框優化 */
/* ============================================================================ */

.single-choice-input input[type='text'] {
  /* 觸控友善的輸入框 */
  min-height: 48px;
  font-size: 1rem; /* 防止 iOS Safari 縮放 */

  /* 視覺優化 */
  transition: all 0.2s ease;
  border-width: 2px;
}

.single-choice-input input[type='text']:focus {
  /* 聚焦狀態增強 */
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.single-choice-input input[type='text']::placeholder {
  /* 佔位符文字優化 */
  color: #9ca3af;
  opacity: 1;
}

/* ============================================================================ */
/* 響應式設計 */
/* ============================================================================ */

/* 手機端優化 */
@media (max-width: 639px) {
  .single-choice-input label {
    /* 手機端加大觸控區域 */
    min-height: 60px;
    padding: 1rem 0.75rem;
  }

  .single-choice-input .space-y-3 {
    /* 手機端增加選項間距 */
    gap: 0.75rem;
  }

  .single-choice-input label span {
    /* 手機端文字大小 */
    font-size: 1rem;
    line-height: 1.5;
  }

  .single-choice-input label .ml-8 {
    /* 手機端描述文字 */
    font-size: 0.875rem;
    margin-left: 2.5rem;
    margin-top: 0.375rem;
  }

  .single-choice-input input[type='text'] {
    /* 手機端輸入框 */
    min-height: 52px;
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
}

/* 超小螢幕優化 */
@media (max-width: 359px) {
  .single-choice-input label {
    /* 超小螢幕進一步優化 */
    min-height: 56px;
    padding: 0.875rem 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .single-choice-input .flex.items-center {
    /* 超小螢幕選項排列 */
    width: 100%;
    align-items: center;
  }

  .single-choice-input label .ml-8 {
    /* 超小螢幕描述文字 */
    margin-left: 0;
    margin-top: 0.5rem;
    width: 100%;
  }
}

/* 平板端優化 */
@media (min-width: 640px) and (max-width: 1023px) {
  .single-choice-input label {
    /* 平板端適中的觸控區域 */
    min-height: 58px;
    padding: 0.875rem;
  }
}

/* ============================================================================ */
/* 錯誤狀態樣式 */
/* ============================================================================ */

.single-choice-input label.hover\\:bg-red-50 {
  /* 錯誤狀態的視覺提示 */
  border-color: #ef4444;
  background-color: #fef2f2;
}

.single-choice-input label.hover\\:bg-red-50:hover {
  background-color: #fee2e2;
}

/* ============================================================================ */
/* 無障礙設計 */
/* ============================================================================ */

/* 高對比模式 */
@media (prefers-contrast: high) {
  .single-choice-input label {
    border: 2px solid #374151;
  }

  .single-choice-input label.bg-blue-50 {
    border-color: #1d4ed8 !important;
    background-color: #dbeafe !important;
  }

  .single-choice-input .flex.items-center > div:first-child {
    border-width: 2px;
    border-color: #374151;
  }

  .radio-dot {
    background-color: #1f2937;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .single-choice-input label,
  .single-choice-input .flex.items-center > div:first-child,
  .single-choice-input input[type='text'] {
    transition: none;
  }

  .single-choice-input label:hover,
  .single-choice-input label:active {
    transform: none;
  }
}

/* 焦點管理 */
.single-choice-input label:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.single-choice-input input[type='radio']:focus + .flex {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 50%;
}

/* 觸控設備專用優化 */
@media (hover: none) and (pointer: coarse) {
  .single-choice-input label:hover {
    /* 觸控設備不需要hover效果 */
    transform: none;
    box-shadow: inherit;
    background-color: inherit;
  }

  .single-choice-input label:active {
    /* 觸控設備的按下效果 */
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .single-choice-input label.bg-blue-50:hover {
    background-color: #eff6ff !important;
  }
}

/* ============================================================================ */
/* 長文字處理 */
/* ============================================================================ */

.single-choice-input label span {
  /* 確保長文字正確換行 */
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

/* ============================================================================ */
/* 載入和過渡狀態 */
/* ============================================================================ */

.single-choice-input label {
  /* 選項出現動畫 */
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 減少動畫時禁用 */
@media (prefers-reduced-motion: reduce) {
  .single-choice-input label {
    animation: none;
  }
}
</style>
