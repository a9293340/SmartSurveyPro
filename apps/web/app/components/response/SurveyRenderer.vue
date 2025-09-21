<template>
  <div class="survey-renderer">
    <!-- 載入狀態 -->
    <div v-if="isLoading" class="loading-state">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span class="ml-3 text-gray-600">載入問卷中...</span>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="errorMessage" class="error-state">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon name="heroicons:exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-red-800 mb-2">載入失敗</h3>
        <p class="text-red-600 mb-4">{{ errorMessage }}</p>
        <button
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          @click="retry"
        >
          重試
        </button>
      </div>
    </div>

    <!-- 已提交狀態 -->
    <div v-else-if="currentResponse?.isSubmitted" class="submitted-state">
      <div class="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <Icon name="heroicons:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-green-800 mb-2">提交成功！</h2>
        <p class="text-green-700 mb-4">感謝您的填寫，您的回應已成功記錄。</p>
        <div v-if="currentResponse.submissionId" class="text-sm text-green-600">
          提交編號：{{ currentResponse.submissionId }}
        </div>
      </div>
    </div>

    <!-- 問卷填寫主體 -->
    <div v-else-if="currentSurvey && currentResponse" class="survey-content">
      <!-- 問卷標題 -->
      <div class="survey-header mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ currentSurvey.title }}</h1>
        <p v-if="currentSurvey.description" class="text-gray-600 text-lg">
          {{ currentSurvey.description }}
        </p>

        <!-- 進度指示器 -->
        <div class="progress-indicator mt-6">
          <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>填寫進度</span>
            <span>{{ progressPercentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>第 {{ currentQuestionIndex + 1 }} 題</span>
            <span>共 {{ questions?.length || 0 }} 題</span>
          </div>
        </div>
      </div>

      <!-- 題目顯示模式選擇 -->
      <div class="display-mode-tabs mb-6">
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            v-for="mode in displayModes"
            :key="mode.value"
            :class="displayModeClasses(mode.value)"
            @click="setDisplayMode(mode.value as 'single' | 'all')"
          >
            <Icon :name="mode.icon" class="w-4 h-4 mr-2" />
            {{ mode.label }}
          </button>
        </div>
      </div>

      <!-- 單題模式 -->
      <div v-if="displayMode === 'single'" class="single-question-mode">
        <div
          v-if="currentQuestion"
          class="question-container bg-white rounded-lg shadow-sm border p-6"
        >
          <QuestionRenderer
            :question="currentQuestion"
            :value="getCurrentAnswerValue(currentQuestion.id)"
            :error="getQuestionError(currentQuestion.id)"
            @update:value="handleAnswerUpdate(currentQuestion.id, $event)"
          />
        </div>

        <!-- 導航按鈕 -->
        <div class="navigation-buttons flex justify-between items-center mt-6">
          <button
            v-if="currentQuestionIndex > 0"
            class="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            @click="previousQuestion"
          >
            <Icon name="heroicons:chevron-left" class="w-4 h-4 mr-1" />
            上一題
          </button>
          <div v-else />

          <div class="question-dots flex space-x-2">
            <button
              v-for="(question, index) in questions || []"
              :key="question.id"
              :class="questionDotClasses(index)"
              :title="`第 ${index + 1} 題`"
              @click="goToQuestion(index)"
            >
              {{ index + 1 }}
            </button>
          </div>

          <button
            v-if="currentQuestionIndex < (questions?.length || 0) - 1"
            class="flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            @click="nextQuestion"
          >
            下一題
            <Icon name="heroicons:chevron-right" class="w-4 h-4 ml-1" />
          </button>
          <button
            v-else-if="canSubmit"
            :disabled="isSubmitting"
            class="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            @click="handleSubmit"
          >
            <Icon
              v-if="isSubmitting"
              name="heroicons:arrow-path"
              class="w-4 h-4 mr-2 animate-spin"
            />
            <Icon v-else name="heroicons:paper-airplane" class="w-4 h-4 mr-2" />
            {{ isSubmitting ? '提交中...' : '提交問卷' }}
          </button>
          <div v-else class="text-sm text-gray-500">請完成所有必填題目後提交</div>
        </div>
      </div>

      <!-- 全部顯示模式 -->
      <div v-else class="all-questions-mode space-y-6">
        <div
          v-for="(question, index) in questions || []"
          :key="question.id"
          class="question-container bg-white rounded-lg shadow-sm border p-6"
        >
          <div class="question-number text-sm font-medium text-gray-500 mb-2">
            第 {{ index + 1 }} 題
          </div>
          <QuestionRenderer
            :question="question"
            :value="getCurrentAnswerValue(question.id)"
            :error="getQuestionError(question.id)"
            @update:value="handleAnswerUpdate(question.id, $event)"
          />
        </div>

        <!-- 提交按鈕 -->
        <div class="submit-section bg-white rounded-lg shadow-sm border p-6 text-center">
          <button
            v-if="canSubmit"
            :disabled="isSubmitting"
            class="inline-flex items-center px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            @click="handleSubmit"
          >
            <Icon
              v-if="isSubmitting"
              name="heroicons:arrow-path"
              class="w-5 h-5 mr-2 animate-spin"
            />
            <Icon v-else name="heroicons:paper-airplane" class="w-5 h-5 mr-2" />
            {{ isSubmitting ? '提交中...' : '提交問卷' }}
          </button>
          <div v-else class="text-gray-500">
            <p class="mb-2">請完成以下必填題目後提交：</p>
            <ul class="text-sm">
              <li
                v-for="missing in getMissingRequiredQuestions()"
                :key="missing.id"
                class="text-red-600"
              >
                • 第 {{ getQuestionIndex(missing.id) + 1 }} 題：{{ missing.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useResponseStore } from '~/stores/response';
import QuestionRenderer from './QuestionRenderer.vue';
import type { Question } from '@smartsurvey/shared';
import { QuestionType, SurveyStatus, SurveyType, SurveyVisibility } from '@smartsurvey/shared';

// ============================================================================
// Props
// ============================================================================

interface Props {
  surveyId: string;
}

const props = defineProps<Props>();

// ============================================================================
// Store 和狀態
// ============================================================================

const responseStore = useResponseStore();
const displayMode = ref<'single' | 'all'>('single');

// ============================================================================
// 計算屬性
// ============================================================================

const {
  currentSurvey,
  currentResponse,
  isLoading,
  isSubmitting,
  errorMessage,
  questions,
  currentQuestion,
  progressPercentage,
  canSubmit,
} = responseStore;

const currentQuestionIndex = computed(() => {
  return currentResponse?.currentQuestionIndex || 0;
});

const displayModes = computed(() => [
  { value: 'single', label: '逐題填寫', icon: 'heroicons:document-text' },
  { value: 'all', label: '全部顯示', icon: 'heroicons:queue-list' },
]);

const displayModeClasses = (mode: string) => [
  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
  displayMode.value === mode
    ? 'bg-white text-blue-600 shadow-sm'
    : 'text-gray-600 hover:text-gray-900',
];

const questionDotClasses = (index: number) => [
  'w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-colors',
  index === currentQuestionIndex.value
    ? 'bg-blue-600 text-white'
    : hasAnswer(questions[index]?.id || '')
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'bg-gray-100 text-gray-600 border border-gray-300',
];

// ============================================================================
// 方法
// ============================================================================

/**
 * 設置顯示模式
 */
function setDisplayMode(mode: 'single' | 'all'): void {
  displayMode.value = mode;
  console.warn(`[SurveyRenderer] 切換顯示模式:`, mode);
}

/**
 * 獲取當前答案值
 */
function getCurrentAnswerValue(questionId: string): any {
  return currentResponse?.answers[questionId]?.value;
}

/**
 * 獲取題目錯誤訊息
 */
function getQuestionError(questionId: string): string | undefined {
  const answer = currentResponse?.answers[questionId];
  return answer?.validationErrors?.[0];
}

/**
 * 處理答案更新
 */
function handleAnswerUpdate(questionId: string, value: any): void {
  responseStore.updateAnswer(questionId, value);

  // 自動保存進度
  responseStore.saveProgress();
}

/**
 * 檢查是否有答案
 */
function hasAnswer(questionId: string): boolean {
  const answer = currentResponse?.answers[questionId];
  return (
    answer !== null &&
    answer !== undefined &&
    answer.value !== null &&
    answer.value !== undefined &&
    answer.value !== ''
  );
}

/**
 * 移動到下一題
 */
function nextQuestion(): void {
  responseStore.nextQuestion();
}

/**
 * 移動到上一題
 */
function previousQuestion(): void {
  responseStore.previousQuestion();
}

/**
 * 跳轉到指定題目
 */
function goToQuestion(index: number): void {
  responseStore.goToQuestion(index);
}

/**
 * 獲取缺少的必填題目
 */
function getMissingRequiredQuestions(): Question[] {
  if (!currentResponse) return [];

  return questions.filter((question: Question) => {
    if (!question.required) return false;

    const answer = currentResponse!.answers[question.id];
    return !answer || !answer.isValid || answer.value === null || answer.value === undefined;
  });
}

/**
 * 獲取題目索引
 */
function getQuestionIndex(questionId: string): number {
  return questions.findIndex((q: Question) => q.id === questionId);
}

/**
 * 提交問卷
 */
async function handleSubmit(): Promise<void> {
  try {
    const submissionId = await responseStore.submitResponse();
    console.warn('[SurveyRenderer] 問卷提交成功:', submissionId);

    // 可以在這裡添加成功提交後的處理邏輯
    // 例如：顯示感謝頁面、重定向等
  } catch (error) {
    console.error('[SurveyRenderer] 問卷提交失敗:', error);
    // 錯誤處理已經在 store 中完成
  }
}

/**
 * 重試載入
 */
async function retry(): Promise<void> {
  try {
    await responseStore.loadSurvey(props.surveyId);
  } catch (error) {
    // 錯誤處理已經在 store 中完成
  }
}

// ============================================================================
// 生命週期
// ============================================================================

onMounted(async () => {
  console.warn('[SurveyRenderer] 組件開始載入，surveyId:', props.surveyId);

  try {
    await responseStore.loadSurvey(props.surveyId);

    // 嘗試載入保存的進度
    responseStore.loadProgress(props.surveyId);
    console.warn('[SurveyRenderer] 正常載入完成');
  } catch (error) {
    console.error('[SurveyRenderer] 初始化失敗:', error);
    console.warn('[SurveyRenderer] 檢查是否啟動測試模式，ID:', props.surveyId);

    // 🧪 測試模式：當 API 失敗時自動載入測試資料
    if (props.surveyId === 'demo-survey-123') {
      console.warn('[SurveyRenderer] 啟動測試模式...');

      // 注入測試問卷資料
      responseStore.currentSurvey = {
        _id: 'demo-survey-123',
        title: '🧪 測試問卷 - 互動驗證',
        description: '測試各種題型的互動功能',
        status: SurveyStatus.PUBLISHED,
        type: SurveyType.STANDARD,
        ownerId: 'test-owner-123',
        workspaceId: 'test-workspace-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishSettings: {
          visibility: SurveyVisibility.PUBLIC,
          allowAnonymous: true,
          allowMultipleResponses: false,
        },
        appearance: {
          primaryColor: '#3B82F6',
          backgroundColor: '#FFFFFF',
        },
        stats: {
          totalResponses: 0,
          completedResponses: 0,
        },
        questions: [
          {
            id: 'q1',
            type: QuestionType.TEXT_SHORT,
            title: '您的姓名是？',
            description: '請輸入您的真實姓名',
            required: true,
            order: 1,
            visible: true,
            config: {
              placeholder: '請輸入姓名',
              maxLength: 50,
            },
            validation: { maxLength: 50, required: true, errorMessage: '請輸入您的姓名' },
          },
          {
            id: 'q2',
            type: QuestionType.SINGLE_CHOICE,
            title: '您的年齡範圍？',
            required: true,
            order: 2,
            visible: true,
            config: {
              options: [
                { id: 'age1', label: '18-25歲', value: '18-25' },
                { id: 'age2', label: '26-35歲', value: '26-35' },
                { id: 'age3', label: '36-45歲', value: '36-45' },
                { id: 'age4', label: '45歲以上', value: '45+' },
              ],
            },
            validation: { required: true, errorMessage: '請選擇您的年齡範圍' },
          },
          {
            id: 'q3',
            type: QuestionType.RATING,
            title: '請評分我們的服務',
            description: '1分最低，5分最高',
            required: false,
            order: 3,
            visible: true,
            config: {
              min: 1,
              max: 5,
              displayType: 'stars',
              minLabel: '很差',
              maxLabel: '很好',
            },
            validation: { required: false, errorMessage: '請選擇評分' },
          },
          {
            id: 'q4',
            type: QuestionType.MULTIPLE_CHOICE,
            title: '您使用過哪些產品？（可複選）',
            required: false,
            order: 4,
            visible: true,
            config: {
              options: [
                { id: 'prod1', label: '產品A', value: 'product-a' },
                { id: 'prod2', label: '產品B', value: 'product-b' },
                { id: 'prod3', label: '產品C', value: 'product-c' },
              ],
              maxChoices: 3,
            },
            validation: { required: false, maxChoices: 3, errorMessage: '最多可選擇3個項目' },
          },
          {
            id: 'q5',
            type: QuestionType.TEXT_LONG,
            title: '請分享您的建議',
            description: '您的意見對我們很重要',
            required: false,
            order: 5,
            visible: true,
            config: {
              placeholder: '請輸入您的建議...',
              maxLength: 500,
              rows: 4,
            },
            validation: { maxLength: 500, required: false, errorMessage: '請輸入有效的建議' },
          },
        ],
      };

      // 初始化回應狀態
      responseStore.currentResponse = {
        surveyId: 'demo-survey-123',
        answers: {},
        startTime: new Date(),
        lastModified: new Date(),
        currentQuestionIndex: 0,
        isSubmitted: false,
      };

      // 清除錯誤狀態，顯示測試內容
      responseStore.errorMessage = null;
      responseStore.isLoading = false;

      console.warn('[SurveyRenderer] ✅ 測試模式已啟動，可以開始測試互動功能！');
    }
  }
});
</script>

<style scoped>
.survey-renderer {
  @apply max-w-4xl mx-auto p-4;
}

.question-container {
  @apply transition-all duration-200;
}

.question-container:hover {
  @apply shadow-md;
}

.navigation-buttons {
  @apply sticky bottom-4 bg-white rounded-lg shadow-lg border p-4;
}

.question-dots {
  @apply overflow-x-auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.question-dots::-webkit-scrollbar {
  display: none;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .survey-renderer {
    @apply p-2;
  }

  .survey-header h1 {
    @apply text-2xl;
  }

  .display-mode-tabs {
    @apply overflow-x-auto;
  }

  .navigation-buttons {
    @apply sticky bottom-0 rounded-none border-x-0 border-b-0;
  }

  .question-dots {
    @apply max-w-xs;
  }
}

/* 載入動畫 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-state {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
