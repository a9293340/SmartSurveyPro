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

        <!-- 進度指示器組件 -->
        <ProgressIndicator
          :progress-percentage="progressPercentage"
          :answered-count="answeredCount"
          :total-count="questions?.length || 0"
          :required-count="requiredCount"
          :missing-required-count="missingRequiredCount"
          :start-time="currentResponse?.startTime"
          :show-estimated-time="true"
          class="mt-6"
        />

        <!-- 題目進度組件 -->
        <QuestionProgress
          :questions="questions || []"
          :answers="answersForProgress"
          :current-question-id="currentQuestion?.id"
          class="mt-4"
          @question-click="handleQuestionClick"
        />
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
            @validate="handleValidation"
            @touch="handleTouch"
          />
        </div>

        <!-- 混合式驗證錯誤提示區域 -->
        <Transition
          name="validation-error"
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-[-10px] scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-[-10px] scale-95"
        >
          <div
            v-if="navigationValidationError"
            class="validation-error-banner bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
            role="alert"
            aria-live="assertive"
          >
            <div class="flex items-start space-x-3">
              <Icon
                name="heroicons:exclamation-triangle"
                class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-red-800">
                  {{ navigationValidationError.message }}
                </p>
                <p class="text-xs text-red-600 mt-1">完成該題目後即可繼續填寫問卷</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 導航按鈕 -->
        <div class="navigation-buttons flex items-center mt-6 gap-3">
          <!-- 左側按鈕區域 -->
          <div class="nav-left flex-shrink-0">
            <button
              v-if="currentQuestionIndex > 0"
              class="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              @click="previousQuestion"
            >
              <Icon name="heroicons:chevron-left" class="w-4 h-4 mr-1" />
              <span class="hidden sm:inline">上一題</span>
            </button>
          </div>

          <!-- 中間圓點導航區域 -->
          <div class="question-dots flex space-x-2 flex-1 justify-center min-w-0">
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

          <!-- 右側按鈕區域 -->
          <div class="nav-right flex-shrink-0">
            <button
              v-if="currentQuestionIndex < (questions?.length || 0) - 1"
              class="flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              @click="nextQuestion"
            >
              <span class="hidden sm:inline">下一題</span>
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
              <span class="hidden sm:inline">{{ isSubmitting ? '提交中...' : '提交問卷' }}</span>
              <span class="sm:hidden">{{ isSubmitting ? '提交中' : '提交' }}</span>
            </button>
            <div v-else class="text-sm text-gray-500 text-center max-w-32">
              <span class="hidden sm:inline">請完成所有必填題目後提交</span>
              <span class="sm:hidden">請完成必填題目</span>
            </div>
          </div>
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
import { computed, onMounted, ref, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useResponseStore } from '~/stores/response';
import { useFormValidation } from '~/composables/useFormValidation';
import QuestionRenderer from './QuestionRenderer.vue';
import ProgressIndicator from './ProgressIndicator.vue';
import QuestionProgress from './QuestionProgress.vue';
import type { Question, Survey } from '@smartsurvey/shared';
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

// 初始化驗證系統
const {
  currentSurvey,
  currentResponse,
  questions,
  currentQuestion,
  progressPercentage,
  canSubmit,
  isLoading,
  isSubmitting,
  errorMessage,
} = storeToRefs(responseStore);

// 初始化表單驗證
const {
  validationState,
  getFieldValidation,
  getFieldErrors,
  getFieldWarnings,
  isFieldValid,
  hasFieldError,
  errorFields,
  validateField,
  validateAll,
  touchField,
} = useFormValidation(questions);

// ============================================================================
// 提供驗證上下文給子組件
// ============================================================================

// 創建驗證上下文對象，確保函數能正確綁定
const validationContext = {
  getFieldValidation: (questionId: string) => getFieldValidation.value(questionId),
  getFieldErrors: (questionId: string) => getFieldErrors.value(questionId),
  getFieldWarnings: (questionId: string) => getFieldWarnings.value(questionId),
  isFieldValid: (questionId: string) => isFieldValid.value(questionId),
  hasFieldError: (questionId: string) => hasFieldError.value(questionId),
};

provide('validationContext', validationContext);

// ============================================================================
// 計算屬性
// ============================================================================

const currentQuestionIndex = computed(() => {
  return currentResponse.value?.currentQuestionIndex || 0;
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

// 進度指示器相關計算屬性
const answeredCount = computed(() => {
  if (!currentResponse.value || !questions.value) return 0;
  return questions.value.filter(q => hasAnswer(q.id)).length;
});

const requiredCount = computed(() => {
  if (!questions.value) return 0;
  return questions.value.filter(q => q.required).length;
});

const missingRequiredCount = computed(() => {
  return getMissingRequiredQuestions().length;
});

const answersForProgress = computed(() => {
  if (!currentResponse.value) return {};
  const answers: Record<string, any> = {};
  Object.keys(currentResponse.value.answers).forEach(questionId => {
    answers[questionId] = currentResponse.value?.answers[questionId]?.value;
  });
  return answers;
});

const questionDotClasses = (index: number) => [
  'w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-colors',
  index === currentQuestionIndex.value
    ? 'bg-blue-600 text-white'
    : hasAnswer(questions.value?.[index]?.id || '')
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'bg-gray-100 text-gray-600 border border-gray-300',
];

/** 混合式驗證相關計算屬性 */
// 檢查當前題目是否為必填且未完成
const isCurrentQuestionRequiredAndIncomplete = computed(() => {
  const currentQ = currentQuestion.value;
  if (!currentQ) return false;

  // 檢查是否為必填題
  if (!currentQ.required) return false;

  // 檢查是否未完成
  return !hasAnswer(currentQ.id);
});

// 導航驗證錯誤訊息
const navigationValidationError = computed(() => {
  if (isCurrentQuestionRequiredAndIncomplete.value) {
    const currentQ = currentQuestion.value;
    return {
      message: `請先完成第 ${currentQuestionIndex.value + 1} 題 (${currentQ?.title || '必填題目'}) 後再繼續`,
      type: 'required' as const,
    };
  }
  return null;
});

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
  return currentResponse.value?.answers[questionId]?.value;
}

/**
 * 獲取題目錯誤訊息
 */
function getQuestionError(questionId: string): string | undefined {
  const answer = currentResponse.value?.answers[questionId];
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
  const answer = currentResponse.value?.answers[questionId];
  return (
    answer !== null &&
    answer !== undefined &&
    answer.value !== null &&
    answer.value !== undefined &&
    answer.value !== ''
  );
}

/**
 * 移動到下一題 - 實作混合式驗證模式
 */
function nextQuestion(): void {
  const currentQ = currentQuestion.value;
  if (!currentQ) return;

  // 觸發當前題目的失焦驗證
  const currentAnswer = getCurrentAnswerValue(currentQ.id);
  validateField(currentQ.id, currentAnswer, 'blur');

  // 檢查當前題目是否為必填且未完成
  if (isCurrentQuestionRequiredAndIncomplete.value) {
    // 標記該題為已觸碰，確保顯示驗證錯誤
    touchField(currentQ.id);

    // 不允許移動，用戶會看到驗證錯誤訊息
    return;
  }

  // 允許移動到下一題
  responseStore.nextQuestion();
}

/**
 * 移動到上一題
 */
function previousQuestion(): void {
  responseStore.previousQuestion();
}

/**
 * 跳轉到指定題目 - 支援混合式驗證
 */
function goToQuestion(index: number): void {
  const currentIndex = currentQuestionIndex.value;
  const currentQ = currentQuestion.value;

  // 觸發當前題目的驗證
  if (currentQ) {
    const currentAnswer = getCurrentAnswerValue(currentQ.id);
    validateField(currentQ.id, currentAnswer, 'blur');
  }

  // 如果是向後跳轉或跳轉到相同位置，允許自由移動
  if (index <= currentIndex) {
    responseStore.goToQuestion(index);
    return;
  }

  // 向前跳轉：檢查中間是否有未完成的必填題
  if (!questions.value) return;

  for (let i = currentIndex; i < index; i++) {
    const question = questions.value[i];
    if (question?.required && !hasAnswer(question.id)) {
      // 發現未完成的必填題，標記為已觸碰並阻止跳轉
      touchField(question.id);

      // 跳轉到第一個未完成的必填題
      if (i !== currentIndex) {
        responseStore.goToQuestion(i);
      }
      return;
    }
  }

  // 所有中間的必填題都已完成，允許跳轉
  responseStore.goToQuestion(index);
}

/**
 * 處理題目進度組件的題目點擊事件
 */
function handleQuestionClick(questionId: string, index: number): void {
  goToQuestion(index);

  // 如果是在單題模式，確保切換到該題目
  if (displayMode.value === 'single') {
    displayMode.value = 'single';
  }
}

/**
 * 獲取缺少的必填題目
 */
function getMissingRequiredQuestions(): Question[] {
  if (!currentResponse.value || !questions.value) return [];

  return questions.value.filter((question: Question) => {
    if (!question.required) return false;

    const answer = currentResponse.value!.answers[question.id];
    return !answer || !answer.isValid || answer.value === null || answer.value === undefined;
  });
}

/**
 * 獲取題目索引
 */
function getQuestionIndex(questionId: string): number {
  return questions.value?.findIndex((q: Question) => q.id === questionId) ?? -1;
}

/**
 * 處理驗證事件
 */
function handleValidation(
  questionId: string,
  value: any,
  trigger: 'input' | 'blur' | 'focus'
): void {
  // 使用新的驗證系統驗證單一題目
  validateField(questionId, value, trigger);
}

/**
 * 處理觸摸事件
 */
function handleTouch(questionId: string): void {
  // 標記題目為已觸摸
  touchField(questionId);
}

/**
 * 提交問卷
 */
async function handleSubmit(): Promise<void> {
  try {
    // 先進行完整驗證
    const validationResult = validateAll('submit');

    if (!validationResult.isValid) {
      console.warn('[SurveyRenderer] 問卷驗證失敗:', validationResult.errors);

      // 顯示第一個錯誤題目
      const firstErrorField = errorFields.value[0];
      if (firstErrorField) {
        const questionIndex = getQuestionIndex(firstErrorField.questionId);
        if (questionIndex >= 0) {
          responseStore.goToQuestion(questionIndex);
        }
      }

      return;
    }

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
// 生命週期與初始化
// ============================================================================

// 立即檢查測試模式（在 setup 階段執行）
if (props.surveyId === 'demo-survey-123') {
  console.warn('[SurveyRenderer] 檢測到測試模式，準備初始化...');
}

onMounted(async () => {
  console.warn('[SurveyRenderer] 組件開始載入，surveyId:', props.surveyId);

  // 🧪 測試模式：直接啟動測試資料，不嘗試 API 調用
  if (props.surveyId === 'demo-survey-123') {
    console.warn('[SurveyRenderer] 直接啟動測試模式...');

    // 注入測試問卷資料
    responseStore.$patch({
      currentSurvey: {
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
      },
      currentResponse: {
        surveyId: 'demo-survey-123',
        answers: {},
        startTime: new Date(),
        lastModified: new Date(),
        currentQuestionIndex: 0,
        isSubmitted: false,
      },
      errorMessage: null,
      isLoading: false,
    });

    console.warn('[SurveyRenderer] ✅ 測試模式已啟動，可以開始測試互動功能！');
  } else {
    // 正常模式：載入真實 API 資料
    try {
      await responseStore.loadSurvey(props.surveyId);
      responseStore.loadProgress(props.surveyId);
      console.warn('[SurveyRenderer] 正常載入完成');
    } catch (error) {
      console.error('[SurveyRenderer] 載入失敗:', error);
    }
  }
});
</script>

<style scoped>
/* ============================================================================ */
/* 主容器響應式設計 */
/* ============================================================================ */

.survey-renderer {
  /* 桌面版：最大寬度限制，保持良好的閱讀體驗 */
  @apply mx-auto;

  /* 響應式 padding：漸進式減少邊距 */
  @apply px-6 py-8;
  max-width: 900px; /* 比原本的 max-w-4xl (56rem) 稍小，更適合問卷閱讀 */
}

/* 平板橫向 (1024px - 1279px) */
@media (max-width: 1279px) {
  .survey-renderer {
    @apply px-5 py-6;
    max-width: 800px;
  }
}

/* 平板直向 (768px - 1023px) */
@media (max-width: 1023px) {
  .survey-renderer {
    @apply px-4 py-5;
    max-width: 700px;
  }
}

/* 手機橫向 (640px - 767px) */
@media (max-width: 767px) {
  .survey-renderer {
    @apply px-3 py-4;
    max-width: none; /* 手機端使用全寬 */
  }
}

/* 手機直向 (< 640px) */
@media (max-width: 639px) {
  .survey-renderer {
    @apply px-2 py-3;
  }
}

/* ============================================================================ */
/* 問卷標題區域響應式優化 */
/* ============================================================================ */

.survey-header h1 {
  /* 響應式字體大小 */
  @apply font-bold text-gray-900 leading-tight;
  font-size: clamp(1.75rem, 4vw, 3rem); /* 動態字體：最小28px，最大48px */
}

.survey-header p {
  /* 描述文字響應式優化 */
  @apply text-gray-600 leading-relaxed;
  font-size: clamp(1rem, 2.5vw, 1.125rem); /* 動態字體：最小16px，最大18px */
}

/* 手機端標題額外優化 */
@media (max-width: 639px) {
  .survey-header {
    @apply mb-6; /* 減少底部間距 */
  }

  .survey-header h1 {
    @apply mb-3; /* 減少標題與描述間距 */
  }
}

/* ============================================================================ */
/* 顯示模式切換按鈕優化 */
/* ============================================================================ */

.display-mode-tabs {
  /* 確保按鈕容器響應式 */
  @apply mb-6;
}

.display-mode-tabs .flex {
  /* 手機端支援橫向捲動 */
  @apply overflow-x-auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.display-mode-tabs .flex::-webkit-scrollbar {
  display: none;
}

/* 按鈕觸控友善優化 */
.display-mode-tabs button {
  /* 最小觸控區域 44px */
  min-height: 44px;
  @apply flex-shrink-0; /* 防止按鈕被壓縮 */
}

/* 手機端按鈕優化 */
@media (max-width: 639px) {
  .display-mode-tabs {
    @apply mb-4;
  }

  .display-mode-tabs button {
    @apply text-sm px-4 py-3; /* 增加觸控區域 */
  }
}

/* ============================================================================ */
/* 題目容器響應式優化 */
/* ============================================================================ */

.question-container {
  @apply transition-all duration-200;
}

.question-container:hover {
  @apply shadow-md;
}

/* 手機端題目容器優化 */
@media (max-width: 639px) {
  .question-container {
    @apply p-4; /* 減少內邊距 */
    @apply rounded-lg; /* 保持圓角 */
  }

  /* 全顯示模式間距優化 */
  .all-questions-mode .question-container + .question-container {
    @apply mt-4; /* 減少題目間距 */
  }
}

/* ============================================================================ */
/* 導航按鈕區域響應式優化 */
/* ============================================================================ */

.navigation-buttons {
  @apply bg-white rounded-lg shadow-lg border;

  /* 桌面版：浮動在底部 */
  @apply sticky bottom-4 p-4;
}

/* 平板以下：導航按鈕優化 */
@media (max-width: 1023px) {
  .navigation-buttons {
    @apply bottom-2 mx-2; /* 減少間距，增加側邊距 */
    @apply p-3; /* 減少內邊距 */
  }
}

/* 手機端：導航按鈕全寬黏底 */
@media (max-width: 639px) {
  .navigation-buttons {
    @apply sticky bottom-0 left-0 right-0;
    @apply rounded-none border-x-0 border-b-0; /* 移除側邊和底部邊框 */
    @apply mx-0 p-3; /* 全寬顯示 */
    @apply shadow-2xl; /* 增強陰影效果 */
  }

  /* 導航按鈕內容優化 */
  .navigation-buttons button {
    min-height: 44px; /* 觸控友善 */
  }

  /* 上一題/下一題按鈕 */
  .navigation-buttons button:first-child,
  .navigation-buttons button:last-child {
    @apply px-4 py-3; /* 增加觸控區域 */
  }
}

/* ============================================================================ */
/* 題目圓點導航優化 */
/* ============================================================================ */

.question-dots {
  @apply overflow-x-auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* 允許彈性壓縮但保持最小可用空間 */
  min-width: 0;
  flex: 1 1 0%;
}

.question-dots::-webkit-scrollbar {
  display: none;
}

/* 圓點按鈕觸控優化 */
.question-dots button {
  /* 確保觸控友善 */
  min-width: 32px;
  min-height: 32px;
  @apply flex-shrink-0; /* 防止被壓縮 */
}

/* 導航區域佈局優化 */
.nav-left,
.nav-right {
  /* 固定寬度區域，不允許壓縮 */
  flex: 0 0 auto;
  min-width: fit-content;
}

/* 手機端導航優化 */
@media (max-width: 639px) {
  .navigation-buttons {
    /* 手機端間距調整 */
    gap: 0.5rem;
  }

  .question-dots button {
    /* 手機端圓點稍微縮小 */
    min-width: 28px;
    min-height: 28px;
    @apply text-xs; /* 縮小字體 */
  }

  .nav-left button,
  .nav-right button {
    /* 手機端按鈕最小寬度 */
    min-width: 44px;
    padding: 0.5rem 0.75rem;
  }

  /* 超小螢幕進一步優化 */
  @media (max-width: 359px) {
    .question-dots button {
      min-width: 24px;
      min-height: 24px;
      font-size: 0.6rem;
    }

    .nav-left button,
    .nav-right button {
      min-width: 40px;
      padding: 0.5rem;
    }
  }
}

/* ============================================================================ */
/* 提交區域響應式優化 */
/* ============================================================================ */

.submit-section {
  /* 提交按鈕觸控優化 */
}

.submit-section button {
  min-height: 48px; /* 主要操作按鈕更大的觸控區域 */
}

/* 手機端提交區域優化 */
@media (max-width: 639px) {
  .submit-section {
    @apply p-4; /* 減少內邊距 */
  }

  .submit-section button {
    @apply w-full; /* 全寬按鈕 */
    min-height: 52px; /* 更大的觸控區域 */
    @apply text-base; /* 適當的字體大小 */
  }
}

/* ============================================================================ */
/* 載入和錯誤狀態響應式優化 */
/* ============================================================================ */

/* 手機端狀態顯示優化 */
@media (max-width: 639px) {
  .loading-state,
  .error-state,
  .submitted-state {
    @apply px-4 py-6; /* 減少內邊距 */
  }

  .error-state h3,
  .submitted-state h2 {
    @apply text-xl; /* 縮小標題字體 */
  }

  .error-state .w-12,
  .submitted-state .w-16 {
    @apply w-10 h-10; /* 縮小圖示 */
  }

  .submitted-state .w-16 {
    @apply w-12 h-12;
  }
}

/* ============================================================================ */
/* 載入動畫保持 */
/* ============================================================================ */

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

/* ============================================================================ */
/* 滾動行為優化 */
/* ============================================================================ */

/* 平滑滾動 */
.survey-renderer {
  scroll-behavior: smooth;
}

/* 確保內容不會被固定導航遮擋 */
@media (max-width: 639px) {
  .survey-content {
    padding-bottom: 80px; /* 為底部導航留出空間 */
  }
}
</style>
