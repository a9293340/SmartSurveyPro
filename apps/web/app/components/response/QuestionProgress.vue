<template>
  <div class="question-progress bg-white border border-gray-200 rounded-lg p-4">
    <!-- 題目進度標題 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">題目概覽</h3>
      <button
        v-if="!showQuestionList"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        @click="showQuestionList = true"
      >
        顯示詳細
      </button>
      <button
        v-else
        class="text-sm text-gray-600 hover:text-gray-700 font-medium"
        @click="showQuestionList = false"
      >
        隱藏詳細
      </button>
    </div>

    <!-- 進度摘要 -->
    <div class="progress-summary grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
      <!-- 已完成 -->
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
        <div class="text-sm text-gray-500">已完成</div>
      </div>

      <!-- 進行中 -->
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ inProgressCount }}</div>
        <div class="text-sm text-gray-500">進行中</div>
      </div>

      <!-- 未開始 -->
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-400">{{ notStartedCount }}</div>
        <div class="text-sm text-gray-500">未開始</div>
      </div>

      <!-- 必填缺失 -->
      <div class="text-center">
        <div class="text-2xl font-bold text-red-600">{{ missingRequiredCount }}</div>
        <div class="text-sm text-gray-500">必填缺失</div>
      </div>
    </div>

    <!-- 題目列表（可折疊） -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showQuestionList" class="question-list space-y-2 overflow-hidden">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="question-item flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
          :class="getQuestionItemClass(question)"
          @click="$emit('questionClick', question.id, index)"
        >
          <!-- 題目序號 -->
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              :class="getQuestionNumberClass(question)"
            >
              <Icon
                v-if="getQuestionStatus(question) === 'completed'"
                name="heroicons:check"
                class="w-5 h-5"
              />
              <Icon
                v-else-if="getQuestionStatus(question) === 'in-progress'"
                name="heroicons:pencil"
                class="w-4 h-4"
              />
              <span v-else>{{ index + 1 }}</span>
            </div>
          </div>

          <!-- 題目資訊 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ question.title }}
              </p>
              <!-- 必填標記 -->
              <span
                v-if="question.required"
                class="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
              >
                必填
              </span>
            </div>
            <!-- 題目類型 -->
            <p class="text-xs text-gray-500 mt-1">
              {{ getQuestionTypeLabel(question.type) }}
            </p>
          </div>

          <!-- 狀態指示 -->
          <div class="flex-shrink-0">
            <div class="w-3 h-3 rounded-full" :class="getQuestionStatusColor(question)" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- 快速導航 -->
    <div v-if="showQuestionList" class="quick-nav mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">快速跳轉：</span>
        <div class="flex space-x-2">
          <button
            v-if="nextIncompleteQuestion"
            class="px-3 py-1 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            @click="
              $emit(
                'questionClick',
                nextIncompleteQuestion.id,
                getQuestionIndex(nextIncompleteQuestion.id)
              )
            "
          >
            下一個未完成
          </button>
          <button
            v-if="firstRequiredIncomplete"
            class="px-3 py-1 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            @click="
              $emit(
                'questionClick',
                firstRequiredIncomplete.id,
                getQuestionIndex(firstRequiredIncomplete.id)
              )
            "
          >
            第一個必填
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Question, QuestionType } from '@smartsurvey/shared';

// 定義組件屬性
interface Props {
  /** 問卷題目列表 */
  questions: Question[];
  /** 已填寫的答案 */
  answers: Record<string, any>;
  /** 當前題目 ID */
  currentQuestionId?: string;
}

const props = defineProps<Props>();

// 定義事件
interface Emits {
  (e: 'questionClick', questionId: string, index: number): void;
}

const emit = defineEmits<Emits>();

// 組件狀態
const showQuestionList = ref(false);

// 題目類型標籤映射
const questionTypeLabels: Partial<Record<QuestionType, string>> = {
  text_short: '短文字',
  text_long: '長文字',
  single_choice: '單選題',
  multiple_choice: '多選題',
  rating: '評分題',
  date: '日期題',
  file_upload: '檔案上傳',
  email: '電子郵件',
  number: '數字輸入',
  url: '網址輸入',
  dropdown: '下拉選單',
  scale: '量表評分',
  nps: '淨推薦值',
  time: '時間選擇',
  datetime: '日期時間',
};

// 計算題目狀態
const getQuestionStatus = (question: Question) => {
  const answer = props.answers[question.id];

  if (!answer || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
    return 'not-started';
  }

  if (question.id === props.currentQuestionId) {
    return 'in-progress';
  }

  return 'completed';
};

// 計算各狀態的題目數量
const completedCount = computed(
  () => props.questions.filter(q => getQuestionStatus(q) === 'completed').length
);

const inProgressCount = computed(
  () => props.questions.filter(q => getQuestionStatus(q) === 'in-progress').length
);

const notStartedCount = computed(
  () => props.questions.filter(q => getQuestionStatus(q) === 'not-started').length
);

const missingRequiredCount = computed(
  () => props.questions.filter(q => q.required && getQuestionStatus(q) !== 'completed').length
);

// 下一個未完成的題目
const nextIncompleteQuestion = computed(() =>
  props.questions.find(q => getQuestionStatus(q) !== 'completed')
);

// 第一個未完成的必填題目
const firstRequiredIncomplete = computed(() =>
  props.questions.find(q => q.required && getQuestionStatus(q) !== 'completed')
);

// 獲取題目索引
const getQuestionIndex = (questionId: string) =>
  props.questions.findIndex(q => q.id === questionId);

// 獲取題目類型標籤
const getQuestionTypeLabel = (type: QuestionType) => questionTypeLabels[type] || type;

// 獲取題目項目樣式
const getQuestionItemClass = (question: Question) => {
  const status = getQuestionStatus(question);
  const isRequired = question.required;

  if (status === 'completed') {
    return 'bg-green-50 border-green-200';
  }

  if (status === 'in-progress') {
    return 'bg-blue-50 border-blue-200';
  }

  if (isRequired) {
    return 'bg-red-50 border-red-200';
  }

  return 'bg-gray-50';
};

// 獲取題目序號樣式
const getQuestionNumberClass = (question: Question) => {
  const status = getQuestionStatus(question);

  if (status === 'completed') {
    return 'bg-green-600 text-white';
  }

  if (status === 'in-progress') {
    return 'bg-blue-600 text-white';
  }

  if (question.required) {
    return 'bg-red-600 text-white';
  }

  return 'bg-gray-300 text-gray-700';
};

// 獲取題目狀態顏色
const getQuestionStatusColor = (question: Question) => {
  const status = getQuestionStatus(question);

  if (status === 'completed') {
    return 'bg-green-500';
  }

  if (status === 'in-progress') {
    return 'bg-blue-500';
  }

  if (question.required) {
    return 'bg-red-500';
  }

  return 'bg-gray-300';
};
</script>

<style scoped>
/* ============================================================================ */
/* 題目進度組件樣式 */
/* ============================================================================ */

.question-progress {
  /* 題目進度組件的陰影效果 */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);

  /* 確保組件響應式 */
  transition: box-shadow 0.2s ease;
}

.question-progress:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ============================================================================ */
/* 題目列表樣式 */
/* ============================================================================ */

.question-list {
  /* 桌面端：較大的高度 */
  max-height: 24rem; /* 約6個項目 */
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* 題目項目基礎樣式 */
.question-item {
  /* 確保觸控友善 */
  min-height: 56px;
  cursor: pointer;

  /* 過渡動畫 */
  transition: all 0.2s ease;
}

.question-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.question-item:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* ============================================================================ */
/* 自定義滾動條 */
/* ============================================================================ */

.question-list::-webkit-scrollbar {
  width: 6px;
}

.question-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
  margin: 4px 0;
}

.question-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.question-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Firefox 滾動條 */
.question-list {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* ============================================================================ */
/* 快速導航按鈕 */
/* ============================================================================ */

.quick-nav button {
  /* 確保按鈕觸控友善 */
  min-height: 44px;
  transition: all 0.2s ease;
}

.quick-nav button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.quick-nav button:active {
  transform: translateY(0);
}

/* ============================================================================ */
/* 響應式設計 */
/* ============================================================================ */

/* 手機端優化 */
@media (max-width: 639px) {
  .question-progress {
    /* 手機端邊距調整 */
    margin-bottom: 1rem;
  }

  /* 進度摘要：手機端改為2列佈局 */
  .progress-summary {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0 0.5rem;
  }

  .progress-summary > div {
    /* 手機端統計項目 */
    padding: 0.75rem 0.5rem;
    min-height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .progress-summary .text-2xl {
    /* 手機端數字稍小 */
    font-size: 1.5rem;
  }

  .progress-summary .text-sm {
    /* 手機端標籤更小 */
    font-size: 0.75rem;
  }

  /* 題目列表 */
  .question-list {
    /* 手機端列表高度減小 */
    max-height: 16rem; /* 約4個項目 */
  }

  .question-item {
    /* 手機端項目樣式 */
    padding: 0.75rem;
    min-height: 52px;
  }

  .question-item .w-8.h-8 {
    /* 手機端序號圓圈稍小 */
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }

  .question-item .text-sm {
    /* 手機端文字稍小 */
    font-size: 0.8rem;
  }

  .question-item .text-xs {
    /* 手機端小文字更小 */
    font-size: 0.7rem;
  }

  /* 快速導航 */
  .quick-nav {
    /* 手機端導航調整 */
    padding: 0.75rem 0;
  }

  .quick-nav .flex.space-x-2 {
    /* 手機端按鈕間距 */
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .quick-nav button {
    /* 手機端導航按鈕 */
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-height: 40px;
  }
}

/* 超小螢幕優化 */
@media (max-width: 359px) {
  .progress-summary {
    /* 超小螢幕改為單列 */
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .progress-summary > div {
    /* 超小螢幕統計項目 */
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    padding: 0.5rem;
  }

  .question-list {
    /* 超小螢幕列表高度進一步減小 */
    max-height: 12rem;
  }

  .question-item {
    /* 超小螢幕項目間距 */
    padding: 0.5rem;
    min-height: 48px;
  }

  .question-item .space-x-3 {
    /* 超小螢幕間距調整 */
    gap: 0.5rem;
  }

  .quick-nav button {
    /* 超小螢幕按鈕 */
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    min-height: 36px;
  }
}

/* 平板橫向優化 */
@media (min-width: 640px) and (max-width: 1023px) {
  .progress-summary {
    /* 平板保持4列 */
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .question-list {
    /* 平板列表高度適中 */
    max-height: 20rem;
  }
}

/* 大螢幕優化 */
@media (min-width: 1024px) {
  .question-list {
    /* 大螢幕可以顯示更多項目 */
    max-height: 28rem;
  }

  .question-item {
    /* 大螢幕項目有更多內邊距 */
    padding: 1rem;
  }

  .quick-nav button {
    /* 大螢幕按鈕更大 */
    padding: 0.75rem 1rem;
  }
}

/* ============================================================================ */
/* 狀態指示特殊樣式 */
/* ============================================================================ */

/* 已完成狀態的特殊效果 */
.question-item.bg-green-50 {
  border-left: 4px solid #10b981;
}

/* 進行中狀態的特殊效果 */
.question-item.bg-blue-50 {
  border-left: 4px solid #3b82f6;
}

/* 必填未完成的特殊效果 */
.question-item.bg-red-50 {
  border-left: 4px solid #ef4444;
  animation: gentleRedPulse 3s ease-in-out infinite;
}

@keyframes gentleRedPulse {
  0%,
  100% {
    border-left-color: #ef4444;
  }
  50% {
    border-left-color: #f87171;
  }
}

/* ============================================================================ */
/* 無障礙設計 */
/* ============================================================================ */

/* 高對比模式 */
@media (prefers-contrast: high) {
  .question-item {
    border: 2px solid #333;
  }

  .question-item.bg-green-50 {
    background-color: #d1fae5 !important;
    border-color: #059669 !important;
  }

  .question-item.bg-blue-50 {
    background-color: #dbeafe !important;
    border-color: #2563eb !important;
  }

  .question-item.bg-red-50 {
    background-color: #fee2e2 !important;
    border-color: #dc2626 !important;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .question-item,
  .quick-nav button {
    transition: none;
  }

  .question-item:hover,
  .quick-nav button:hover {
    transform: none;
  }

  .question-item.bg-red-50 {
    animation: none;
  }
}

/* 焦點管理 */
.question-item:focus,
.quick-nav button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 觸控設備優化 */
@media (hover: none) and (pointer: coarse) {
  .question-item:hover,
  .quick-nav button:hover {
    /* 觸控設備不需要hover效果 */
    transform: none;
    box-shadow: inherit;
  }

  .question-item:active,
  .quick-nav button:active {
    /* 觸控設備的按下效果 */
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}
</style>
