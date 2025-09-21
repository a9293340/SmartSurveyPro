<template>
  <div class="text-long-input">
    <textarea
      ref="textareaRef"
      v-model="localValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :class="textareaClasses"
      rows="4"
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
import { ref, computed, watch } from 'vue';
import type { Question } from '@smartsurvey/shared';

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

const textareaRef = ref<HTMLTextAreaElement>();
const localValue = ref<string>(props.value || '');

const textareaClasses = computed(() => [
  'w-full px-3 py-2 border rounded-lg resize-vertical transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  props.error
    ? 'border-red-300 bg-red-50'
    : 'border-gray-300 hover:border-gray-400 focus:border-blue-500',
]);

const placeholder = computed(() => {
  const config = props.question.config as { placeholder?: string } | undefined;
  return config?.placeholder || '請輸入您的詳細回答...';
});

const maxLength = computed(() => {
  const validation = props.question.validation as { maxLength?: number } | undefined;
  return validation?.maxLength || undefined;
});

const showCharCount = computed(() => {
  return maxLength.value !== undefined || localValue.value.length > 0;
});

const currentLength = computed(() => localValue.value.length);

watch(
  () => props.value,
  newValue => {
    if (newValue !== localValue.value) {
      localValue.value = newValue || '';
    }
  }
);

function handleInput(): void {
  emits('update:value', localValue.value);
}

function handleBlur(): void {
  emits('update:value', localValue.value);
}
</script>

<style scoped>
.text-long-input {
  @apply w-full;
}

@media (max-width: 768px) {
  .text-long-input textarea {
    @apply text-base;
  }
}
</style>
