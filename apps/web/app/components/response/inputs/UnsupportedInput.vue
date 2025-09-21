<template>
  <div class="unsupported-input">
    <div class="bg-gray-100 border-2 border-gray-200 rounded-lg p-6 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-700 mb-2">不支援的題型</h3>
      <p class="text-gray-500 text-sm mb-4">目前不支援 "{{ question.type }}" 題型的填寫。</p>
      <div class="bg-white border border-gray-200 rounded p-3 text-left">
        <p class="text-xs text-gray-600 mb-1">題目內容：</p>
        <p class="text-sm font-medium">{{ question.title }}</p>
        <p v-if="question.description" class="text-xs text-gray-500 mt-1">
          {{ question.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '@smartsurvey/shared';

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

// 不支援的題型不需要做任何處理
console.warn(`[不支援的題型] ${props.question.type}`);
</script>

<style scoped>
.unsupported-input {
  @apply w-full;
}
</style>
