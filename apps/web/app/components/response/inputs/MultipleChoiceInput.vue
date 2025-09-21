<template>
  <div class="multiple-choice-input">
    <div class="space-y-3">
      <label
        v-for="option in options"
        :key="option.id"
        :class="optionClasses(option.id)"
        @click="toggleOption(option.id)"
      >
        <input
          type="checkbox"
          :value="option.id"
          :checked="isSelected(option.id)"
          class="sr-only"
          @change="handleChange"
        />

        <!-- 自訂的多選按鈕 -->
        <div class="flex items-center">
          <div :class="checkboxClasses(option.id)">
            <Icon v-if="isSelected(option.id)" name="heroicons:check" class="w-3 h-3 text-white" />
          </div>
          <span class="ml-3 text-gray-900">{{ option.text }}</span>
        </div>

        <!-- 選項描述 -->
        <div v-if="option.description" class="ml-8 mt-1 text-sm text-gray-600">
          {{ option.description }}
        </div>
      </label>
    </div>

    <!-- 最大選擇數量提示 -->
    <div
      v-if="maxChoices && selectedOptions.length >= maxChoices"
      class="mt-3 text-sm text-amber-600"
    >
      ⚠️ 您最多只能選擇 {{ maxChoices }} 個選項
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Question } from '@smartsurvey/shared';

interface Props {
  question: Question;
  value?: string[];
  error?: string;
}

interface Emits {
  (e: 'update:value', value: string[]): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const selectedOptions = ref<string[]>(props.value || []);

const options = computed(() => {
  const config = props.question.config as { options?: any[] } | undefined;
  return config?.options || [];
});

const maxChoices = computed(() => {
  const config = props.question.config as { maxChoices?: number } | undefined;
  return config?.maxChoices || undefined;
});

const optionClasses = (optionId: string) => [
  'relative flex cursor-pointer rounded-lg p-3 transition-colors duration-200',
  'hover:bg-gray-50 focus:outline-none',
  isSelected(optionId) ? 'bg-blue-50 border-2 border-blue-200' : 'border-2 border-transparent',
  props.error ? 'hover:bg-red-50' : '',
];

const checkboxClasses = (optionId: string) => [
  'flex items-center justify-center w-5 h-5 rounded border-2 transition-colors duration-200',
  isSelected(optionId)
    ? 'border-blue-600 bg-blue-600'
    : 'border-gray-300 bg-white hover:border-gray-400',
];

function isSelected(optionId: string): boolean {
  return selectedOptions.value.includes(optionId);
}

function toggleOption(optionId: string): void {
  const index = selectedOptions.value.indexOf(optionId);

  if (index > -1) {
    // 移除選項
    selectedOptions.value.splice(index, 1);
  } else {
    // 添加選項（檢查最大數量限制）
    if (!maxChoices.value || selectedOptions.value.length < maxChoices.value) {
      selectedOptions.value.push(optionId);
    }
  }

  emits('update:value', [...selectedOptions.value]);
}

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  toggleOption(target.value);
}

watch(
  () => props.value,
  newValue => {
    if (JSON.stringify(newValue) !== JSON.stringify(selectedOptions.value)) {
      selectedOptions.value = newValue || [];
    }
  }
);
</script>

<style scoped>
.multiple-choice-input {
  @apply w-full;
}

@media (max-width: 768px) {
  .multiple-choice-input label {
    @apply p-2;
  }
}
</style>
