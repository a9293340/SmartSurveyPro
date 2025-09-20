<template>
  <div class="survey-properties">
    <!-- 基本資訊 -->
    <div class="property-section">
      <h4 class="section-title">基本資訊</h4>

      <div class="property-group">
        <label class="property-label">
          問卷標題
          <input
            v-model="localTitle"
            type="text"
            class="property-input"
            placeholder="請輸入問卷標題"
            @blur="updateSurveyTitle"
            @keydown.enter="updateSurveyTitle"
          />
        </label>
      </div>

      <div class="property-group">
        <label class="property-label">
          問卷描述
          <textarea
            v-model="localDescription"
            class="property-textarea"
            placeholder="請輸入問卷描述（可選）"
            rows="3"
            @blur="updateSurveyDescription"
          />
        </label>
      </div>
    </div>

    <!-- 設定選項 -->
    <div class="property-section">
      <h4 class="section-title">設定選項</h4>

      <div class="property-group">
        <label class="property-checkbox">
          <input
            v-model="localSettings.allowAnonymous"
            type="checkbox"
            @change="updateSurveySettings"
          />
          <span class="checkbox-label">允許匿名填寫</span>
        </label>
      </div>

      <div class="property-group">
        <label class="property-checkbox">
          <input v-model="localSettings.collectIP" type="checkbox" @change="updateSurveySettings" />
          <span class="checkbox-label">收集 IP 地址</span>
        </label>
      </div>

      <div class="property-group">
        <label class="property-checkbox">
          <input
            v-model="localSettings.allowMultipleSubmissions"
            type="checkbox"
            @change="updateSurveySettings"
          />
          <span class="checkbox-label">允許重複填寫</span>
        </label>
      </div>
    </div>

    <!-- 完成頁面 -->
    <div class="property-section">
      <h4 class="section-title">完成頁面</h4>

      <div class="property-group">
        <label class="property-label">
          感謝訊息
          <textarea
            v-model="localCompletionMessage"
            class="property-textarea"
            placeholder="感謝您填寫本問卷！"
            rows="2"
            @blur="updateCompletionMessage"
          />
        </label>
      </div>
    </div>

    <!-- 問卷狀態 -->
    <div class="property-section">
      <h4 class="section-title">問卷狀態</h4>

      <div class="status-info">
        <div class="status-item">
          <span class="status-label">狀態：</span>
          <span class="status-value">{{ surveyStatus }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">題目數量：</span>
          <span class="status-value">{{ questionCount }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">建立時間：</span>
          <span class="status-value">{{ formattedCreatedAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBuilderStore } from '~/stores';

// Stores
const builderStore = useBuilderStore();

// 本地狀態
const localTitle = ref('');
const localDescription = ref('');
const localCompletionMessage = ref('');
const localSettings = ref({
  allowAnonymous: true,
  collectIP: false,
  allowMultipleSubmissions: false,
});

// 計算屬性
const currentSurvey = computed(() => builderStore.currentSurvey);
const questionCount = computed(() => currentSurvey.value?.questions.length || 0);

const surveyStatus = computed(() => {
  switch (currentSurvey.value?.status) {
    case 'draft':
      return '草稿';
    case 'published':
      return '已發布';
    case 'closed':
      return '已關閉';
    case 'archived':
      return '已歸檔';
    default:
      return '未知';
  }
});

const formattedCreatedAt = computed(() => {
  if (!currentSurvey.value?.createdAt) return '--';
  return new Date(currentSurvey.value.createdAt).toLocaleDateString('zh-TW');
});

// 監聽問卷變更以同步本地狀態
watch(
  currentSurvey,
  survey => {
    if (survey) {
      localTitle.value = survey.title || '';
      localDescription.value = survey.description || '';
      localCompletionMessage.value = survey.completionMessage || '感謝您填寫本問卷！';

      // 同步設定（使用預設值）
      localSettings.value = {
        allowAnonymous: true,
        collectIP: false,
        allowMultipleSubmissions: false,
        ...survey.settings,
      };
    }
  },
  { immediate: true }
);

// 方法
function updateSurveyTitle() {
  if (currentSurvey.value && localTitle.value !== currentSurvey.value.title) {
    builderStore.updateSurveyInfo({
      title: localTitle.value.trim() || '未命名問卷',
    });
  }
}

function updateSurveyDescription() {
  if (currentSurvey.value && localDescription.value !== currentSurvey.value.description) {
    builderStore.updateSurveyInfo({
      description: localDescription.value.trim(),
    });
  }
}

function updateSurveySettings() {
  if (currentSurvey.value) {
    builderStore.updateSurveyInfo({
      settings: { ...localSettings.value },
    });
  }
}

function updateCompletionMessage() {
  if (
    currentSurvey.value &&
    localCompletionMessage.value !== currentSurvey.value.completionMessage
  ) {
    builderStore.updateSurveyInfo({
      completionMessage: localCompletionMessage.value.trim() || '感謝您填寫本問卷！',
    });
  }
}
</script>

<style scoped>
.survey-properties {
  @apply p-4 space-y-6;
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

.property-input {
  @apply block w-full px-3 py-2 text-sm;
  @apply border border-gray-300 rounded-md;
  @apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none;
  @apply transition-colors;
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

/* 響應式設計 */
@media (max-width: 768px) {
  .survey-properties {
    @apply p-3 space-y-4;
  }

  .property-input,
  .property-textarea {
    @apply text-xs;
  }
}
</style>
