<template>
  <div class="rating-input">
    <!-- 星級評分模式 -->
    <div v-if="displayType === 'stars'" class="star-rating flex items-center space-x-1">
      <button
        v-for="i in maxRating"
        :key="i"
        type="button"
        :class="starClasses(i)"
        @click="selectRating(i)"
        @mouseenter="hoverRating = i"
        @mouseleave="hoverRating = 0"
      >
        <Icon
          name="heroicons:star"
          :class="i <= (hoverRating || localValue || 0) ? 'text-yellow-400' : 'text-gray-300'"
          class="w-8 h-8 transition-colors duration-150"
        />
      </button>

      <!-- 評分文字 -->
      <span v-if="localValue" class="ml-3 text-gray-700"> {{ localValue }} / {{ maxRating }} </span>
    </div>

    <!-- 數字評分模式 -->
    <div v-else class="number-rating">
      <div class="flex items-center space-x-2 flex-wrap">
        <button
          v-for="i in maxRating"
          :key="i"
          type="button"
          :class="numberClasses(i)"
          @click="selectRating(i)"
        >
          {{ i }}
        </button>
      </div>

      <!-- 範圍標示 -->
      <div class="mt-2 flex justify-between text-xs text-gray-500">
        <span>{{ minLabel }}</span>
        <span>{{ maxLabel }}</span>
      </div>
    </div>

    <!-- 清除選擇 -->
    <div v-if="localValue && !question.required" class="mt-3">
      <button
        type="button"
        class="text-sm text-gray-500 hover:text-gray-700 underline"
        @click="clearRating"
      >
        清除選擇
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Question } from '@smartsurvey/shared';

interface Props {
  question: Question;
  value?: number;
  error?: string;
}

interface Emits {
  (e: 'update:value', value: number | null): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const localValue = ref<number | null>(props.value || null);
const hoverRating = ref<number>(0);

const maxRating = computed(() => {
  const config = props.question.config as { max?: number } | undefined;
  return config?.max || 5;
});

const minRating = computed(() => {
  const config = props.question.config as { min?: number } | undefined;
  return config?.min || 1;
});

const displayType = computed(() => {
  const config = props.question.config as { displayType?: string } | undefined;
  return config?.displayType || 'stars';
});

const minLabel = computed(() => {
  const config = props.question.config as { minLabel?: string } | undefined;
  return config?.minLabel || '最低';
});

const maxLabel = computed(() => {
  const config = props.question.config as { maxLabel?: string } | undefined;
  return config?.maxLabel || '最高';
});

const starClasses = (rating: number) => [
  'p-1 rounded hover:bg-gray-100 transition-colors duration-150',
  'focus:outline-none focus:ring-2 focus:ring-blue-500',
];

const numberClasses = (rating: number) => [
  'w-10 h-10 rounded-lg border-2 transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-blue-500',
  localValue.value === rating
    ? 'border-blue-600 bg-blue-600 text-white'
    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50',
];

function selectRating(rating: number): void {
  if (rating >= minRating.value && rating <= maxRating.value) {
    localValue.value = rating;
    emits('update:value', rating);
  }
}

function clearRating(): void {
  localValue.value = null;
  emits('update:value', null);
}

watch(
  () => props.value,
  newValue => {
    if (newValue !== localValue.value) {
      localValue.value = newValue || null;
    }
  }
);
</script>

<style scoped>
.rating-input {
  @apply w-full;
}

@media (max-width: 768px) {
  .star-rating {
    @apply flex-wrap;
  }

  .number-rating button {
    @apply w-8 h-8 text-sm;
  }
}
</style>
