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
.question-progress {
  /* 題目進度組件的陰影效果 */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.question-list {
  max-height: 24rem; /* 限制列表高度，約6個項目 */
  overflow-y: auto;
}

/* 自定義滾動條 */
.question-list::-webkit-scrollbar {
  width: 6px;
}

.question-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.question-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.question-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .progress-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .question-item {
    padding: 0.75rem;
  }
}
</style>
