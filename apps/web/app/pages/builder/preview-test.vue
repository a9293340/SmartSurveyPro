<template>
  <div class="preview-test-page">
    <div class="test-header">
      <h1>問卷預覽功能測試</h1>
      <div class="test-actions">
        <button class="btn-primary" @click="addSampleQuestions">
          <Icon name="heroicons:plus-circle" class="w-4 h-4" />
          加入範例題目
        </button>
        <button class="btn-secondary" @click="clearQuestions">
          <Icon name="heroicons:trash" class="w-4 h-4" />
          清除所有題目
        </button>
      </div>
    </div>

    <!-- 問卷建構器畫布（包含預覽功能） -->
    <SurveyCanvas />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBuilderStore } from '~/stores';
import { QuestionType } from '@smartsurvey/shared';
import SurveyCanvas from '~/components/builder/SurveyCanvas.vue';

const builderStore = useBuilderStore();

// 初始化測試問卷
onMounted(() => {
  // 初始化一個測試問卷
  builderStore.createNewSurvey({
    title: '客戶滿意度調查問卷',
    description: '感謝您撥冗填寫本問卷，您的意見對我們非常重要。',
    workspaceId: 'test-workspace',
  });

  // 設定完成訊息
  if (builderStore.currentSurvey) {
    builderStore.updateSurveyInfo({
      completionMessage: '感謝您的參與！我們會認真對待您的每一條建議。',
    });
  }
});

// 加入範例題目
function addSampleQuestions() {
  // 清除現有題目
  if (builderStore.currentSurvey) {
    // 刪除所有現有題目
    const questionIds = builderStore.currentSurvey.questions.map(q => q.id);
    questionIds.forEach(id => {
      builderStore.deleteQuestion(id);
    });
  }

  // 單選題
  const q1 = builderStore.addQuestion(QuestionType.SINGLE_CHOICE);
  if (q1) {
    builderStore.updateQuestion(q1.id, {
      title: '您對我們的服務整體滿意度如何？',
      required: true,
      config: {
        options: [
          { id: '1', text: '非常滿意' },
          { id: '2', text: '滿意' },
          { id: '3', text: '一般' },
          { id: '4', text: '不滿意' },
          { id: '5', text: '非常不滿意' },
        ],
      },
    });
  }

  // 多選題
  const q2 = builderStore.addQuestion(QuestionType.MULTIPLE_CHOICE);
  if (q2) {
    builderStore.updateQuestion(q2.id, {
      title: '您最常使用我們的哪些服務？（可複選）',
      required: true,
      config: {
        options: [
          { id: '1', text: '線上購物' },
          { id: '2', text: '客戶服務' },
          { id: '3', text: '技術支援' },
          { id: '4', text: '產品諮詢' },
          { id: '5', text: '售後服務' },
        ],
      },
    });
  }

  // 評分題
  const q3 = builderStore.addQuestion(QuestionType.RATING);
  if (q3) {
    builderStore.updateQuestion(q3.id, {
      title: '請為我們的服務品質評分',
      required: false,
      config: {
        max: 5,
        icon: 'star',
      },
    });
  }

  // 短文字題
  const q4 = builderStore.addQuestion(QuestionType.TEXT_SHORT);
  if (q4) {
    builderStore.updateQuestion(q4.id, {
      title: '請輸入您的姓名',
      required: true,
      validation: {
        rules: {
          minLength: 2,
          maxLength: 50,
        },
      },
    });
  }

  // 長文字題
  const q5 = builderStore.addQuestion(QuestionType.TEXT_LONG);
  if (q5) {
    builderStore.updateQuestion(q5.id, {
      title: '請提供您的寶貴建議',
      description: '您的意見對我們很重要',
      required: false,
      config: {
        placeholder: '請輸入您的建議...',
        rows: 5,
      },
      validation: {
        rules: {
          maxLength: 500,
        },
      },
    });
  }
}

// 清除所有題目
function clearQuestions() {
  if (builderStore.currentSurvey) {
    // 複製題目 ID 列表以避免在迴圈中修改陣列
    const questionIds = builderStore.currentSurvey.questions.map(q => q.id);
    questionIds.forEach(id => {
      builderStore.deleteQuestion(id);
    });
  }
}
</script>

<style scoped>
.preview-test-page {
  @apply h-screen flex flex-col bg-gray-50;
}

.test-header {
  @apply bg-white border-b border-gray-200 px-6 py-4;
  @apply flex items-center justify-between;
}

.test-header h1 {
  @apply text-xl font-semibold text-gray-900;
}

.test-actions {
  @apply flex items-center gap-3;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
  @apply hover:bg-blue-700 transition-colors;
  @apply flex items-center gap-2 text-sm font-medium;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg;
  @apply hover:bg-gray-300 transition-colors;
  @apply flex items-center gap-2 text-sm font-medium;
}
</style>
