<template>
  <div class="survey-preview">
    <!-- 預覽頂部標題列 -->
    <div class="preview-header">
      <h3 class="text-lg font-semibold text-gray-800">問卷預覽</h3>
      <div class="preview-controls">
        <button
          class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          @click="resetPreview"
        >
          <Icon name="heroicons:arrow-path" class="w-4 h-4 inline mr-1" />
          重置預覽
        </button>
      </div>
    </div>

    <!-- 預覽內容區域 -->
    <div class="preview-container" :class="previewContainerClass">
      <div v-if="!survey || survey.questions.length === 0" class="empty-preview">
        <div class="text-center py-12">
          <Icon name="heroicons:document-text" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">尚無內容可預覽</p>
          <p class="text-sm text-gray-400 mt-2">請先新增題目到問卷中</p>
        </div>
      </div>

      <div v-else class="preview-content">
        <!-- 問卷標題與描述 -->
        <div class="survey-header">
          <h1 class="survey-title">{{ survey.title || '未命名問卷' }}</h1>
          <p v-if="survey.description" class="survey-description">
            {{ survey.description }}
          </p>
        </div>

        <!-- 進度指示器 -->
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }" />
          </div>
          <div class="progress-text">
            {{ currentQuestionIndex + 1 }} / {{ survey.questions.length }}
          </div>
        </div>

        <!-- 題目展示區域 -->
        <div class="questions-area">
          <TransitionGroup name="slide-fade">
            <div v-for="question in visibleQuestions" :key="question.id" class="preview-question">
              <component
                :is="getQuestionComponent(question.type)"
                :question="question"
                :value="formData[question.id]"
                :error="validationErrors[question.id]"
                :readonly="false"
                :preview-mode="true"
                @update="updateFormData(question.id, $event)"
              />
            </div>
          </TransitionGroup>
        </div>

        <!-- 導航按鈕 -->
        <div class="navigation-buttons">
          <button v-if="!isFirstPage" class="nav-btn nav-btn-secondary" @click="previousPage">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            上一題
          </button>

          <div class="flex-1" />

          <button v-if="!isLastPage" class="nav-btn nav-btn-primary" @click="nextPage">
            下一題
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </button>

          <button v-else class="nav-btn nav-btn-success" @click="submitPreview">
            <Icon name="heroicons:check-circle" class="w-4 h-4 mr-2" />
            提交預覽
          </button>
        </div>

        <!-- 提交成功訊息 -->
        <Transition name="fade">
          <div v-if="showCompletionMessage" class="completion-message">
            <Icon name="heroicons:check-circle" class="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-gray-800 mb-2">感謝您的填寫！</h3>
            <p class="text-gray-600">{{ survey.completionMessage || '您的回覆已成功提交。' }}</p>
            <button class="mt-4 text-sm text-blue-600 hover:text-blue-700" @click="resetPreview">
              重新預覽
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';
import { useBuilderStore } from '~/stores';
import type { Question } from '@smartsurvey/shared';

// 題型組件映射
import QuestionSingleChoicePreview from './previews/QuestionSingleChoicePreview.vue';
import QuestionMultipleChoicePreview from './previews/QuestionMultipleChoicePreview.vue';
import QuestionTextShortPreview from './previews/QuestionTextShortPreview.vue';
import QuestionTextLongPreview from './previews/QuestionTextLongPreview.vue';
import QuestionRatingPreview from './previews/QuestionRatingPreview.vue';

const builderStore = useBuilderStore();

// 組件映射表
const questionComponents = {
  single_choice: markRaw(QuestionSingleChoicePreview),
  multiple_choice: markRaw(QuestionMultipleChoicePreview),
  text_short: markRaw(QuestionTextShortPreview),
  text_long: markRaw(QuestionTextLongPreview),
  rating: markRaw(QuestionRatingPreview),
};

// 預覽狀態
const currentQuestionIndex = ref(0);
const formData = ref<Record<string, any>>({});
const validationErrors = ref<Record<string, string>>({});
const showCompletionMessage = ref(false);
const questionsPerPage = ref(1); // 每頁顯示題目數，預設一題一頁

// 計算屬性
const survey = computed(() => builderStore.currentSurvey);

const visibleQuestions = computed(() => {
  if (!survey.value?.questions) return [];
  const start = currentQuestionIndex.value;
  const end = start + questionsPerPage.value;
  return survey.value.questions.slice(start, end);
});

const progressPercentage = computed(() => {
  if (!survey.value?.questions?.length) return 0;
  return ((currentQuestionIndex.value + 1) / survey.value.questions.length) * 100;
});

const isFirstPage = computed(() => currentQuestionIndex.value === 0);

const isLastPage = computed(() => {
  if (!survey.value?.questions?.length) return true;
  return currentQuestionIndex.value >= survey.value.questions.length - questionsPerPage.value;
});

const previewContainerClass = computed(() => {
  return showCompletionMessage.value ? 'preview-completed' : '';
});

// 方法
const getQuestionComponent = (type: string) => {
  return questionComponents[type as keyof typeof questionComponents] || null;
};

const updateFormData = (questionId: string, value: any) => {
  formData.value[questionId] = value;
  // 清除該題目的驗證錯誤
  delete validationErrors.value[questionId];
};

const validateCurrentPage = () => {
  let isValid = true;
  validationErrors.value = {};

  // 驗證開始

  for (const question of visibleQuestions.value) {
    // 檢查題目驗證

    // 檢查必填
    if (question.required && !formData.value[question.id]) {
      validationErrors.value[question.id] = '此題為必填';
      isValid = false;
      // 必填題目未填寫
    }

    // 根據題型進行額外驗證
    const value = formData.value[question.id];
    if (value) {
      // 文字題型長度驗證
      if (question.type === 'text_short' || question.type === 'text_long') {
        const rules = question.validation?.rules as any;
        if (rules?.minLength && value.length < rules.minLength) {
          validationErrors.value[question.id] = `最少需要 ${rules.minLength} 個字`;
          isValid = false;
          // 字數不足
        }
        if (rules?.maxLength && value.length > rules.maxLength) {
          validationErrors.value[question.id] = `最多只能 ${rules.maxLength} 個字`;
          isValid = false;
          // 字數超限
        }
      }

      // 多選題選擇數量驗證
      if (question.type === 'multiple_choice') {
        const selectedValues = Array.isArray(value)
          ? value
          : typeof value === 'string'
            ? value.split(',').filter(v => v.trim())
            : [];
        const validation = question.validation as any;

        // 多選題驗證檢查

        // 檢查最少選擇數
        if (validation?.minChoices && selectedValues.length < validation.minChoices) {
          validationErrors.value[question.id] = `至少選擇 ${validation.minChoices} 個選項`;
          isValid = false;
          // 選擇數不足
        }

        // 檢查最多選擇數
        if (validation?.maxChoices && selectedValues.length > validation.maxChoices) {
          validationErrors.value[question.id] = `最多選擇 ${validation.maxChoices} 個選項`;
          isValid = false;
          // 選擇數超限
        }
      }
    }
  }

  // 驗證完成
  return isValid;
};

const nextPage = () => {
  // 嘗試進入下一頁

  if (!validateCurrentPage()) {
    // 驗證失敗，無法進入下一頁
    return;
  }

  if (!isLastPage.value) {
    const oldIndex = currentQuestionIndex.value;
    currentQuestionIndex.value += questionsPerPage.value;
    // 成功切換到下一頁
  } else {
    // 已經是最後一頁
  }
};

const previousPage = () => {
  if (!isFirstPage.value) {
    currentQuestionIndex.value -= questionsPerPage.value;
  }
};

const submitPreview = () => {
  if (!validateCurrentPage()) {
    return;
  }

  // 顯示完成訊息
  showCompletionMessage.value = true;

  // 模擬提交效果
  // 模擬提交效果，在正式版本中會提交到後端
};

const resetPreview = () => {
  currentQuestionIndex.value = 0;
  formData.value = {};
  validationErrors.value = {};
  showCompletionMessage.value = false;
};

// 監聽問卷變化，重置預覽狀態
watch(
  () => survey.value?.questions?.length,
  () => {
    resetPreview();
  }
);
</script>

<style scoped>
.survey-preview {
  @apply h-full flex flex-col bg-white;
}

.preview-header {
  @apply flex items-center justify-between px-6 py-4 border-b;
}

.preview-container {
  @apply flex-1 overflow-y-auto;
}

.preview-content {
  @apply max-w-3xl mx-auto p-6;
}

.survey-header {
  @apply mb-8 text-center;
}

.survey-title {
  @apply text-3xl font-bold text-gray-900 mb-3;
}

.survey-description {
  @apply text-lg text-gray-600;
}

.progress-indicator {
  @apply mb-8;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2;
}

.progress-fill {
  @apply h-full bg-blue-500 transition-all duration-300 ease-out;
}

.progress-text {
  @apply text-sm text-gray-500 text-center;
}

.questions-area {
  @apply mb-8;
}

.preview-question {
  @apply mb-6;
}

.navigation-buttons {
  @apply flex items-center gap-4 pt-6 border-t;
}

.nav-btn {
  @apply inline-flex items-center px-6 py-2 rounded-lg font-medium transition-all;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.nav-btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.nav-btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500;
}

.nav-btn-success {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}

.empty-preview {
  @apply flex items-center justify-center min-h-[400px];
}

.completion-message {
  @apply text-center py-12 px-6;
}

/* 過渡動畫 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
