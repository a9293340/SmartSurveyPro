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
  'option-container relative flex cursor-pointer p-3 transition-colors duration-200',
  'hover:bg-gray-50 focus:outline-none',
  localValue.value === optionId
    ? 'selected-option bg-blue-50 border-2 border-blue-200'
    : 'border-2 border-transparent',
  props.error ? 'hover:bg-red-50' : '',
];

/** 單選按鈕樣式類別 */
const radioClasses = (optionId: string) => [
  'radio-button flex items-center justify-center rounded-full border-2 transition-colors duration-200',
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

.option-container {
  /* 確保觸控友善的最小區域 */
  min-height: 56px;
  display: flex;
  align-items: flex-start;

  /* 觸控體驗優化 */
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px; /* 調整為更圓潤但不會過度橢圓的邊角 */
  transition: all 0.2s ease;

  /* 避免文字選取 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  /* 觸控回饋 */
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
}

/* 選中狀態的特殊處理 */
.selected-option {
  /* 選中時使用稍大的圓角以保持視覺美觀 */
  border-radius: 16px !important;
  background-color: #eff6ff !important;
  border-color: #3b82f6 !important;
  box-shadow:
    0 0 0 1px #3b82f6,
    0 2px 8px rgba(59, 130, 246, 0.15);
}

.option-container:hover {
  background-color: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.option-container:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* 選中狀態的 hover 效果 */
.selected-option:hover {
  background-color: #dbeafe !important;
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px #3b82f6,
    0 4px 12px rgba(59, 130, 246, 0.2);
}

/* ============================================================================ */
/* 單選按鈕樣式優化 */
/* ============================================================================ */

.radio-button {
  /* 確保完美圓形 - 使用固定尺寸避免 flexbox 拉伸 */
  width: 20px !important;
  height: 20px !important;
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  flex-shrink: 0;

  /* 確保圓形保持 */
  aspect-ratio: 1 / 1;
  border-radius: 50% !important;

  /* 視覺優化 */
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.radio-dot {
  /* 確保選中點完美圓形並居中 */
  width: 8px !important;
  height: 8px !important;
  min-width: 8px;
  min-height: 8px;
  max-width: 8px;
  max-height: 8px;
  background-color: white;
  border-radius: 50% !important;
  aspect-ratio: 1 / 1;

  /* 視覺優化 */
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
  .option-container {
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
  .option-container {
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
  .option-container {
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
  .option-container {
    border: 2px solid #374151;
  }

  .selected-option {
    border-color: #1d4ed8 !important;
    background-color: #dbeafe !important;
  }

  .radio-button {
    border-width: 2px;
    border-color: #374151;
  }

  .radio-dot {
    background-color: #1f2937;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .option-container,
  .radio-button,
  .single-choice-input input[type='text'] {
    transition: none;
  }

  .option-container:hover,
  .option-container:active {
    transform: none;
  }
}

/* 焦點管理 */
.option-container:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 16px; /* 確保 focus 狀態的 outline 也是圓角 */
}

.single-choice-input input[type='radio']:focus + .flex .radio-button {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 50%;
}

/* 觸控設備專用優化 */
@media (hover: none) and (pointer: coarse) {
  .option-container:hover {
    /* 觸控設備不需要hover效果 */
    transform: none;
    box-shadow: inherit;
    background-color: inherit;
  }

  .option-container:active {
    /* 觸控設備的按下效果 */
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .selected-option:hover {
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

.option-container {
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
  .option-container {
    animation: none;
  }
}
</style>
