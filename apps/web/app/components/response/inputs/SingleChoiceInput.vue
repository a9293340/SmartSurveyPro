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
.single-choice-input {
  @apply w-full;
}

.radio-dot {
  @apply w-2 h-2 bg-white rounded-full;
}

/* 手機端優化 */
@media (max-width: 768px) {
  .single-choice-input label {
    @apply p-2;
  }

  .single-choice-input input[type='text'] {
    @apply text-base; /* 防止 iOS Safari 縮放 */
  }
}
</style>
