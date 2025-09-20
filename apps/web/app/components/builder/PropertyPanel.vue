<template>
  <div class="property-panel">
    <!-- 面板標題 -->
    <div class="panel-header">
      <h3 class="panel-title">
        {{ currentTitle }}
      </h3>
    </div>

    <!-- 面板內容 -->
    <div class="panel-content">
      <!-- 問卷屬性 -->
      <SurveyProperties v-if="!selectedQuestionId" />

      <!-- 題目屬性 -->
      <QuestionProperties v-else :question-id="selectedQuestionId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useBuilderStore } from '~/stores/builder';
import SurveyProperties from './properties/SurveyProperties.vue';
import QuestionProperties from './properties/QuestionProperties.vue';

// Stores
const builderStore = useBuilderStore();

// 計算屬性
const selectedQuestionId = computed(() => builderStore.selectedQuestionId);

const currentTitle = computed(() => {
  if (selectedQuestionId.value) {
    const question = builderStore.getQuestionById(selectedQuestionId.value);
    return question ? `題目設定 - ${question.title || '未命名題目'}` : '題目設定';
  }
  return '問卷設定';
});
</script>

<style scoped>
.property-panel {
  @apply bg-white flex flex-col;
  @apply transition-all duration-300 ease-in-out;
  @apply h-full;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}

/* 面板標題 */
.panel-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
  @apply bg-gray-50;
}

.panel-title {
  @apply text-sm font-medium text-gray-900 truncate;
}

/* 面板內容 */
.panel-content {
  @apply flex-1 overflow-y-auto;
}
</style>
