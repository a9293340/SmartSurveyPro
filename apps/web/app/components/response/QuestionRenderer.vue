<template>
  <div class="question-renderer">
    <!-- 題目標題和描述 -->
    <div class="question-header mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ question.title }}
        <span v-if="question.required" class="text-red-500 ml-1">*</span>
      </h3>
      <p v-if="question.description" class="text-gray-600 text-sm">
        {{ question.description }}
      </p>
    </div>

    <!-- 動態渲染不同題型的填寫組件 -->
    <div class="question-content mb-4">
      <component
        :is="currentComponent"
        :question="question"
        :value="currentValue"
        :error="validationError"
        @update:value="handleValueUpdate"
      />
    </div>

    <!-- 驗證錯誤訊息 -->
    <div v-if="validationError" class="error-message mt-2">
      <p class="text-red-600 text-sm">{{ validationError }}</p>
    </div>

    <!-- 題目提示 -->
    <div v-if="question.description" class="hint-message mt-2">
      <p class="text-gray-500 text-xs">💡 {{ question.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { Question } from '@smartsurvey/shared';

// ============================================================================
// Props 和 Emits
// ============================================================================

interface Props {
  question: Question;
  value?: any;
  error?: string;
}

interface Emits {
  (e: 'update:value', value: any): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

// ============================================================================
// 動態組件映射
// ============================================================================

const componentMap = {
  text_short: defineAsyncComponent(() => import('./inputs/TextShortInput.vue')),
  text_long: defineAsyncComponent(() => import('./inputs/TextLongInput.vue')),
  single_choice: defineAsyncComponent(() => import('./inputs/SingleChoiceInput.vue')),
  multiple_choice: defineAsyncComponent(() => import('./inputs/MultipleChoiceInput.vue')),
  rating: defineAsyncComponent(() => import('./inputs/RatingInput.vue')),
  // 更多題型可以在這裡添加
};

// ============================================================================
// 計算屬性
// ============================================================================

/** 當前題型對應的組件 */
const currentComponent = computed(() => {
  const component = componentMap[props.question.type as keyof typeof componentMap];
  if (!component) {
    console.warn(`[QuestionRenderer] 未支援的題型: ${props.question.type}`);
    // 返回一個預設的未支援組件
    return defineAsyncComponent(() => import('./inputs/UnsupportedInput.vue'));
  }
  return component;
});

/** 當前值 */
const currentValue = computed(() => props.value);

/** 驗證錯誤訊息 */
const validationError = computed(() => props.error);

// ============================================================================
// 事件處理
// ============================================================================

/**
 * 處理值更新
 */
function handleValueUpdate(newValue: any): void {
  console.warn(`[QuestionRenderer] 題目 ${props.question.id} 值更新:`, newValue);
  emits('update:value', newValue);
}
</script>

<style scoped>
.question-renderer {
  @apply w-full;
}

.question-header h3 {
  line-height: 1.4;
}

.error-message {
  @apply border-l-4 border-red-400 bg-red-50 p-2 rounded-r;
}

.hint-message {
  @apply border-l-4 border-blue-400 bg-blue-50 p-2 rounded-r;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .question-header h3 {
    @apply text-base;
  }

  .question-header p {
    @apply text-xs;
  }
}
</style>
