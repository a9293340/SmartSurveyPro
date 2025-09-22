<!--
  簡化版問卷提交成功組件
  適合嵌入在問卷頁面中顯示
-->

<template>
  <div class="text-center py-8 px-4">
    <!-- 成功圖示 -->
    <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
      <Icon name="heroicons:check-circle" class="w-10 h-10 text-green-600" />
    </div>

    <!-- 成功訊息 -->
    <h2 class="text-2xl font-bold text-gray-900 mb-2">提交成功！</h2>
    <p class="text-gray-600 mb-6">感謝您的參與，您的回答已成功送出</p>

    <!-- 回應 ID（可選） -->
    <div v-if="showResponseId && submissionResult" class="mb-6">
      <div class="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg">
        <span class="text-sm text-gray-600 mr-2">回應編號：</span>
        <span class="text-sm font-mono text-gray-900 select-all">
          {{ submissionResult.responseId }}
        </span>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="space-y-3">
      <button
        v-if="showViewResults"
        class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        @click="emit('viewResults')"
      >
        查看我的回答
      </button>

      <button
        v-if="showNewResponse"
        class="block w-full sm:w-auto px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
        @click="emit('newResponse')"
      >
        重新填寫
      </button>

      <button
        class="block w-full sm:w-auto px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
        @click="emit('goHome')"
      >
        返回首頁
      </button>
    </div>

    <!-- 感謝訊息 -->
    <p class="mt-6 text-sm text-gray-500">感謝您的寶貴時間 ❤️</p>
  </div>
</template>

<script setup lang="ts">
import type { SubmitResponseResponse } from '@smartsurvey/shared';

// ====================================================================
// Props 定義
// ====================================================================

interface Props {
  /** 提交結果 */
  submissionResult?: SubmitResponseResponse | null;
  /** 是否顯示回應 ID */
  showResponseId?: boolean;
  /** 是否顯示查看結果按鈕 */
  showViewResults?: boolean;
  /** 是否顯示重新填寫按鈕 */
  showNewResponse?: boolean;
}

withDefaults(defineProps<Props>(), {
  submissionResult: null,
  showResponseId: true,
  showViewResults: false,
  showNewResponse: false,
});

// ====================================================================
// Emits 定義
// ====================================================================

const emit = defineEmits<{
  viewResults: [];
  newResponse: [];
  goHome: [];
}>();
</script>
