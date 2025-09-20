<template>
  <div v-if="question" class="question-properties">
    <!-- 基本資訊 -->
    <div class="property-section">
      <h4 class="section-title">基本資訊</h4>

      <div class="property-group">
        <label class="property-label">
          題目標題
          <input
            v-model="localTitle"
            type="text"
            class="property-input"
            placeholder="請輸入題目標題"
            @blur="updateQuestionTitle"
            @keydown.enter="updateQuestionTitle"
          />
        </label>
      </div>

      <div class="property-group">
        <label class="property-label">
          題目描述
          <textarea
            v-model="localDescription"
            class="property-textarea"
            placeholder="題目的補充說明（可選）"
            rows="2"
            @blur="updateQuestionDescription"
          />
        </label>
      </div>

      <div class="property-group">
        <label class="property-label">
          題目類型
          <input :value="questionTypeLabel" type="text" class="property-input" readonly disabled />
        </label>
      </div>
    </div>

    <!-- 驗證規則 -->
    <div class="property-section">
      <h4 class="section-title">驗證規則</h4>

      <div class="property-group">
        <label class="property-checkbox">
          <input v-model="localRequired" type="checkbox" @change="updateQuestionValidation" />
          <span class="checkbox-label">必填題目</span>
        </label>
      </div>

      <!-- 文字題目的額外驗證 -->
      <template v-if="isTextQuestion">
        <div class="property-group">
          <label class="property-label">
            最小長度
            <input
              v-model.number="localMinLength"
              type="number"
              class="property-input"
              placeholder="0"
              min="0"
              @blur="updateQuestionValidation"
            />
          </label>
        </div>

        <div class="property-group">
          <label class="property-label">
            最大長度
            <input
              v-model.number="localMaxLength"
              type="number"
              class="property-input"
              placeholder="無限制"
              min="1"
              @blur="updateQuestionValidation"
            />
          </label>
        </div>
      </template>

      <!-- 選擇題的額外驗證 -->
      <template v-if="isChoiceQuestion">
        <div class="property-group">
          <label class="property-label">
            最少選擇數
            <input
              v-model.number="localMinChoices"
              type="number"
              class="property-input"
              placeholder="1"
              min="1"
              @blur="updateQuestionValidation"
            />
          </label>
        </div>

        <div class="property-group">
          <label class="property-label">
            最多選擇數
            <input
              v-model.number="localMaxChoices"
              type="number"
              class="property-input"
              placeholder="無限制"
              min="1"
              @blur="updateQuestionValidation"
            />
          </label>
        </div>
      </template>
    </div>

    <!-- 題目配置 -->
    <div class="property-section">
      <h4 class="section-title">題目配置</h4>

      <!-- 選擇題配置 -->
      <template v-if="isChoiceQuestion">
        <!-- 選項編輯 -->
        <div class="property-group">
          <label class="property-label"> 選項設定 </label>
          <div class="options-list">
            <div
              v-for="(option, index) in localOptions"
              :key="option.id || index"
              class="option-item"
            >
              <input
                v-model="option.text"
                type="text"
                class="option-input"
                :placeholder="`選項 ${index + 1}`"
                @blur="updateOptions"
              />
              <button type="button" class="option-delete" @click="removeOption(index)">
                <Icon name="heroicons:x-mark" class="w-4 h-4" />
              </button>
            </div>
            <button type="button" class="add-option-btn" @click="addOption">
              <Icon name="heroicons:plus" class="w-4 h-4" />
              新增選項
            </button>
          </div>
        </div>

        <div class="property-group">
          <label class="property-checkbox">
            <input v-model="localAllowOther" type="checkbox" @change="updateQuestionConfig" />
            <span class="checkbox-label">允許其他選項</span>
          </label>
        </div>

        <div class="property-group">
          <label class="property-checkbox">
            <input v-model="localRandomizeOptions" type="checkbox" @change="updateQuestionConfig" />
            <span class="checkbox-label">隨機排序選項</span>
          </label>
        </div>
      </template>

      <!-- 文字題配置 -->
      <template v-if="isTextQuestion">
        <div class="property-group">
          <label class="property-label">
            預設值
            <input
              v-model="localDefaultValue"
              type="text"
              class="property-input"
              placeholder="預設填入的文字（可選）"
              @blur="updateQuestionConfig"
            />
          </label>
        </div>

        <div class="property-group">
          <label class="property-label">
            占位符
            <input
              v-model="localPlaceholder"
              type="text"
              class="property-input"
              placeholder="請輸入您的答案..."
              @blur="updateQuestionConfig"
            />
          </label>
        </div>
      </template>

      <!-- 評分題配置 -->
      <template v-if="isRatingQuestion">
        <div class="property-group">
          <label class="property-label">
            最大評分
            <input
              v-model.number="localMaxRating"
              type="number"
              class="property-input"
              placeholder="5"
              min="2"
              max="10"
              @blur="updateQuestionConfig"
            />
          </label>
        </div>

        <div class="property-group">
          <label class="property-label">
            評分類型
            <select
              v-model="localRatingType"
              class="property-select"
              @change="updateQuestionConfig"
            >
              <option value="star">星級評分</option>
              <option value="number">數字評分</option>
              <option value="scale">量表評分</option>
            </select>
          </label>
        </div>
      </template>
    </div>

    <!-- 題目狀態 -->
    <div class="property-section">
      <h4 class="section-title">題目狀態</h4>

      <div class="status-info">
        <div class="status-item">
          <span class="status-label">順序：</span>
          <span class="status-value">第 {{ question.order + 1 }} 題</span>
        </div>
        <div class="status-item">
          <span class="status-label">可見性：</span>
          <span class="status-value">{{ question.visible ? '顯示' : '隱藏' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">ID：</span>
          <span class="status-value">{{ question.id.slice(0, 8) }}...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="no-question">
    <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-gray-400" />
    <p class="text-gray-500 text-sm">未選中任何題目</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBuilderStore } from '~/stores/builder';
import { QuestionType } from '@smartsurvey/shared';
import type { Question } from '@smartsurvey/shared';

// Props
interface Props {
  questionId: string;
}

const props = defineProps<Props>();

// Stores
const builderStore = useBuilderStore();

// 本地狀態
const localTitle = ref('');
const localDescription = ref('');
const localRequired = ref(false);
const localMinLength = ref<number | undefined>(undefined);
const localMaxLength = ref<number | undefined>(undefined);
const localMinChoices = ref<number | undefined>(undefined);
const localMaxChoices = ref<number | undefined>(undefined);
const localAllowOther = ref(false);
const localRandomizeOptions = ref(false);
const localDefaultValue = ref('');
const localPlaceholder = ref('');
const localMaxRating = ref(5);
const localRatingType = ref('star');
const localOptions = ref<{ id: string; text: string }[]>([]);

// 計算屬性
const question = computed(() => builderStore.getQuestionById(props.questionId));

const questionTypeLabel = computed(() => {
  if (!question.value) return '';

  const typeLabels: Record<string, string> = {
    [QuestionType.SINGLE_CHOICE]: '單選題',
    [QuestionType.MULTIPLE_CHOICE]: '多選題',
    [QuestionType.TEXT_SHORT]: '短文字',
    [QuestionType.TEXT_LONG]: '長文字',
    [QuestionType.RATING]: '評分題',
    [QuestionType.EMAIL]: '電子郵件',
    [QuestionType.NUMBER]: '數字',
    [QuestionType.URL]: '網址',
    [QuestionType.DATE]: '日期',
    [QuestionType.TIME]: '時間',
    [QuestionType.DATETIME]: '日期時間',
    [QuestionType.FILE_UPLOAD]: '檔案上傳',
  };

  return typeLabels[question.value.type] || question.value.type;
});

const isTextQuestion = computed(() => {
  return (
    question.value &&
    [
      QuestionType.TEXT_SHORT,
      QuestionType.TEXT_LONG,
      QuestionType.EMAIL,
      QuestionType.URL,
    ].includes(question.value.type)
  );
});

const isChoiceQuestion = computed(() => {
  return (
    question.value &&
    [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE].includes(question.value.type)
  );
});

const isRatingQuestion = computed(() => {
  return question.value && question.value.type === QuestionType.RATING;
});

// 監聽題目變更以同步本地狀態
watch(
  question,
  newQuestion => {
    if (newQuestion) {
      syncLocalState(newQuestion);
    }
  },
  { immediate: true }
);

// 方法
function syncLocalState(q: Question) {
  localTitle.value = q.title || '';
  localDescription.value = q.description || '';
  localRequired.value = q.validation?.required || false;

  // 同步驗證規則
  const validation = q.validation as Record<string, unknown>;
  localMinLength.value = validation?.minLength as number | undefined;
  localMaxLength.value = validation?.maxLength as number | undefined;
  localMinChoices.value = validation?.minChoices as number | undefined;
  localMaxChoices.value = validation?.maxChoices as number | undefined;

  // 同步配置
  const config = q.config as Record<string, unknown>;
  localAllowOther.value = (config?.allowOther as boolean) || false;
  localRandomizeOptions.value = (config?.randomizeOptions as boolean) || false;
  localDefaultValue.value = (config?.defaultValue as string) || '';
  localPlaceholder.value = (config?.placeholder as string) || '';
  localMaxRating.value = (config?.maxRating as number) || 5;
  localRatingType.value = (config?.ratingType as string) || 'star';

  // 同步選項
  const options = (config?.options as Array<{ id: string; text: string }>) || [];
  if (options.length > 0) {
    localOptions.value = [...options];
  } else if (isChoiceQuestion.value) {
    // 如果是選擇題但沒有選項，提供預設選項
    localOptions.value = [
      { id: '1', text: '選項 1' },
      { id: '2', text: '選項 2' },
    ];
    console.log('[QuestionProperties] 為選擇題設定預設選項');
  }
}

function updateQuestionTitle() {
  if (question.value && localTitle.value !== question.value.title) {
    builderStore.updateQuestion(props.questionId, {
      title: localTitle.value.trim() || '未命名題目',
    });
  }
}

function updateQuestionDescription() {
  if (question.value && localDescription.value !== question.value.description) {
    builderStore.updateQuestion(props.questionId, {
      description: localDescription.value.trim(),
    });
  }
}

function updateQuestionValidation() {
  if (!question.value) return;

  const validation: Record<string, unknown> = {
    ...question.value.validation,
    required: localRequired.value,
  };

  if (isTextQuestion.value) {
    if (localMinLength.value !== undefined && localMinLength.value > 0) {
      validation.minLength = localMinLength.value;
    } else {
      delete validation.minLength;
    }

    if (localMaxLength.value !== undefined && localMaxLength.value > 0) {
      validation.maxLength = localMaxLength.value;
    } else {
      delete validation.maxLength;
    }
  }

  if (isChoiceQuestion.value) {
    if (localMinChoices.value !== undefined && localMinChoices.value > 0) {
      validation.minChoices = localMinChoices.value;
    } else {
      delete validation.minChoices;
    }

    if (localMaxChoices.value !== undefined && localMaxChoices.value > 0) {
      validation.maxChoices = localMaxChoices.value;
    } else {
      delete validation.maxChoices;
    }
  }

  // 統一更新 question 的 required 屬性和 validation
  builderStore.updateQuestion(props.questionId, {
    required: localRequired.value,
    validation,
  });
}

function addOption() {
  const newId = String(Date.now());
  const newOption = {
    id: newId,
    text: `選項 ${localOptions.value.length + 1}`,
  };
  localOptions.value.push(newOption);
  updateOptions();
}

function removeOption(index: number) {
  if (localOptions.value.length > 1) {
    localOptions.value.splice(index, 1);
    updateOptions();
  }
}

function updateOptions() {
  if (!question.value) return;

  const filteredOptions = localOptions.value
    .filter(option => {
      const text = (option as any).text || (option as any).label;
      return text && text.trim();
    })
    .map(option => ({
      id: option.id || (option as any).id,
      text: (option as any).text || (option as any).label,
    }));

  if (filteredOptions.length === 0) {
    console.error('[QuestionProperties] updateOptions - 沒有有效的選項');
    return;
  }

  const config: Record<string, unknown> = {
    ...question.value.config,
    options: filteredOptions,
  };

  builderStore.updateQuestion(props.questionId, { config });
}

function updateQuestionConfig() {
  if (!question.value) return;

  const config: Record<string, unknown> = {
    ...question.value.config,
  };

  if (isChoiceQuestion.value) {
    config.allowOther = localAllowOther.value;
    config.randomizeOptions = localRandomizeOptions.value;
  }

  if (isTextQuestion.value) {
    config.defaultValue = localDefaultValue.value.trim();
    config.placeholder = localPlaceholder.value.trim();
  }

  if (isRatingQuestion.value) {
    config.maxRating = localMaxRating.value;
    config.ratingType = localRatingType.value;
  }

  builderStore.updateQuestion(props.questionId, { config });
}
</script>

<style scoped>
.question-properties {
  @apply p-4 space-y-6;
}

.no-question {
  @apply p-8 text-center space-y-2;
}

/* 區段樣式 */
.property-section {
  @apply space-y-3;
}

.section-title {
  @apply text-sm font-medium text-gray-900 mb-3;
  @apply border-b border-gray-200 pb-2;
}

/* 屬性組 */
.property-group {
  @apply space-y-2;
}

.property-label {
  @apply block text-xs font-medium text-gray-700 space-y-1;
}

.property-input,
.property-select {
  @apply block w-full px-3 py-2 text-sm;
  @apply border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors;
}

.property-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed;
}

.property-textarea {
  @apply block w-full px-3 py-2 text-sm;
  @apply border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors resize-none;
}

/* 複選框樣式 */
.property-checkbox {
  @apply flex items-center space-x-2 cursor-pointer;
}

.property-checkbox input[type='checkbox'] {
  @apply w-4 h-4 text-blue-600 border-gray-300 rounded;
  @apply focus:ring-blue-500 focus:ring-2;
}

.checkbox-label {
  @apply text-sm text-gray-700;
}

/* 狀態資訊 */
.status-info {
  @apply space-y-2 text-sm;
}

.status-item {
  @apply flex justify-between;
}

.status-label {
  @apply text-gray-600;
}

.status-value {
  @apply text-gray-900 font-medium;
}

/* 選項編輯樣式 */
.options-list {
  @apply space-y-2;
}

.option-item {
  @apply flex items-center gap-2;
}

.option-input {
  @apply flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors;
}

.option-delete {
  @apply p-2 text-gray-400 hover:text-red-500 hover:bg-red-50;
  @apply rounded-md transition-colors flex-shrink-0;
}

.add-option-btn {
  @apply flex items-center gap-2 w-full px-3 py-2 text-sm;
  @apply border border-dashed border-gray-300 rounded-md;
  @apply text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50;
  @apply transition-colors;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .question-properties {
    @apply p-3 space-y-4;
  }

  .property-input,
  .property-textarea,
  .property-select,
  .option-input {
    @apply text-xs;
  }
}
</style>
