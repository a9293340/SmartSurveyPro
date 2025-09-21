<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- 測試標題 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🧪 Survey Renderer 測試頁面</h1>
        <p class="text-gray-600 mt-2">直接載入測試問卷，驗證必填欄位功能</p>
      </div>

      <!-- 測試問卷 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div v-if="!survey" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p class="text-gray-500 mt-2">載入測試問卷...</p>
        </div>

        <div v-if="survey">
          <!-- 問卷標題 -->
          <div class="mb-6 border-b border-gray-200 pb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ survey.title }}</h2>
            <p class="text-gray-600 mt-2">{{ survey.description }}</p>
          </div>

          <!-- 問題列表 -->
          <div class="space-y-6">
            <div
              v-for="question in survey.questions"
              :key="question.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="mb-3">
                <label class="block text-lg font-medium text-gray-900">
                  {{ question.title }}
                  <span v-if="question.required" class="text-red-500">*</span>
                </label>
                <p v-if="question.description" class="text-sm text-gray-600 mt-1">
                  {{ question.description }}
                </p>
              </div>

              <!-- 不同題型的輸入組件 -->
              <component
                :is="getInputComponent(question.type)"
                :question="question"
                :value="answers[question.id]"
                @update:value="updateAnswer(question.id, $event)"
              />
            </div>
          </div>

          <!-- 提交按鈕 -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <button
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              @click="submitSurvey"
            >
              提交問卷
            </button>
          </div>

          <!-- 調試資訊 -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <details class="bg-gray-50 rounded-lg p-4">
              <summary class="cursor-pointer font-medium text-gray-700">調試資訊</summary>
              <pre class="mt-2 text-xs text-gray-600 overflow-auto">{{
                JSON.stringify({ survey, answers }, null, 2)
              }}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { QuestionType, SurveyStatus, SurveyType, SurveyVisibility } from '@smartsurvey/shared';

// 動態導入組件
const TextShortInput = defineAsyncComponent(
  () => import('~/components/response/inputs/TextShortInput.vue')
);
const SingleChoiceInput = defineAsyncComponent(
  () => import('~/components/response/inputs/SingleChoiceInput.vue')
);
const RatingInput = defineAsyncComponent(
  () => import('~/components/response/inputs/RatingInput.vue')
);

// 定義類型
interface TestSurvey {
  _id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  type: SurveyType;
  questions: any[];
}

const survey = ref<TestSurvey | null>(null);
const answers = ref<Record<string, any>>({});

function getInputComponent(questionType: QuestionType) {
  const componentMap: Partial<Record<QuestionType, any>> = {
    [QuestionType.TEXT_SHORT]: TextShortInput,
    [QuestionType.SINGLE_CHOICE]: SingleChoiceInput,
    [QuestionType.RATING]: RatingInput,
  };
  return componentMap[questionType] || TextShortInput;
}

function updateAnswer(questionId: string, value: any) {
  answers.value[questionId] = value;
  console.log(`[Test] 更新答案 ${questionId}:`, value);
}

function submitSurvey() {
  // 驗證必填欄位
  const errors: string[] = [];

  if (survey.value) {
    survey.value.questions.forEach(question => {
      if (question.required) {
        const answer = answers.value[question.id];
        if (!answer || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
          errors.push(`「${question.title}」為必填欄位`);
        }
      }
    });
  }

  if (errors.length > 0) {
    alert(`❌ 提交失敗：\n\n${errors.join('\n')}`);
    console.log('[Test] 驗證錯誤:', errors);
    return;
  }

  console.log('[Test] 提交問卷:', answers.value);
  alert('✅ 問卷提交成功！請查看控制台日誌。');
}

onMounted(() => {
  console.log('[Test] 測試頁面載入開始...');

  // 模擬載入延遲
  setTimeout(() => {
    survey.value = {
      _id: 'test-survey',
      title: '🧪 測試問卷 - 基礎功能驗證',
      description: '這是一個簡化的測試問卷，用來驗證各種輸入組件是否正常工作。',
      status: SurveyStatus.PUBLISHED,
      type: SurveyType.STANDARD,
      questions: [
        {
          id: 'q1',
          type: QuestionType.TEXT_SHORT,
          title: '您的姓名',
          description: '請輸入您的姓名',
          required: true,
          order: 1,
          visible: true,
          config: {
            placeholder: '請輸入...',
            maxLength: 50,
          },
        },
        {
          id: 'q2',
          type: QuestionType.SINGLE_CHOICE,
          title: '您的年齡範圍',
          required: true,
          order: 2,
          visible: true,
          config: {
            options: [
              { id: 'age1', label: '18-25歲', value: '18-25' },
              { id: 'age2', label: '26-35歲', value: '26-35' },
              { id: 'age3', label: '36歲以上', value: '36+' },
            ],
          },
        },
        {
          id: 'q3',
          type: QuestionType.RATING,
          title: '滿意度評分',
          description: '請為我們的服務評分',
          required: false,
          order: 3,
          visible: true,
          config: {
            min: 1,
            max: 5,
            displayType: 'stars',
          },
        },
      ],
    };

    console.log('[Test] 測試問卷載入完成:', survey.value);
  }, 500);
});

// SEO
useHead({
  title: '測試問卷 - SmartSurvey Pro',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>
