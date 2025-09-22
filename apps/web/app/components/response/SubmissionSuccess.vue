<!--
  問卷提交成功頁面組件
  顯示提交成功的確認訊息、統計資訊和後續操作
-->

<template>
  <div class="max-w-2xl mx-auto">
    <!-- 成功圖示和標題 -->
    <div class="text-center py-8">
      <!-- 動畫成功圖示 -->
      <div class="w-20 h-20 mx-auto mb-6 relative">
        <div
          class="w-full h-full bg-green-100 rounded-full flex items-center justify-center animate-pulse"
        >
          <Icon name="heroicons:check-circle" class="w-12 h-12 text-green-600" />
        </div>
        <!-- 慶祝動畫效果 -->
        <div class="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20" />
      </div>

      <!-- 標題訊息 -->
      <h1 class="text-3xl font-bold text-gray-900 mb-3">🎉 提交成功！</h1>
      <p class="text-lg text-gray-600 mb-8">感謝您的參與，您的回答已成功送出</p>
    </div>

    <!-- 提交資訊卡片 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Icon name="heroicons:information-circle" class="w-5 h-5 mr-2 text-blue-500" />
        提交資訊
      </h2>

      <div class="grid gap-4 sm:grid-cols-2">
        <!-- 回應 ID -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-600">回應編號：</span>
          <span class="text-sm font-mono text-gray-900 select-all">
            {{ submissionResult.responseId }}
          </span>
        </div>

        <!-- 提交時間 -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm font-medium text-gray-600">提交時間：</span>
          <span class="text-sm text-gray-900">
            {{ formatDateTime(submissionResult.submittedAt) }}
          </span>
        </div>
      </div>

      <!-- 完成統計 -->
      <div v-if="completionStats" class="mt-4 pt-4 border-t border-gray-200">
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ completionStats.answeredCount }}
            </div>
            <div class="text-xs text-gray-500">已回答題目</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ formatDuration(completionStats.duration) }}
            </div>
            <div class="text-xs text-gray-500">填寫時間</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">
              {{ Math.round(completionStats.completionRate * 100) }}%
            </div>
            <div class="text-xs text-gray-500">完成度</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 後續操作 -->
    <div class="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
      <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
        <Icon name="heroicons:sparkles" class="w-5 h-5 mr-2" />
        接下來您可以...
      </h3>

      <div class="space-y-3">
        <!-- 查看結果（如果允許） -->
        <button
          v-if="canViewResults"
          class="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left"
          @click="viewResults"
        >
          <div>
            <div class="font-medium text-blue-900">查看填寫結果</div>
            <div class="text-sm text-blue-600">檢視您剛才的回答內容</div>
          </div>
          <Icon name="heroicons:arrow-right" class="w-5 h-5 text-blue-500" />
        </button>

        <!-- 分享問卷 -->
        <button
          v-if="canShare"
          class="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left"
          @click="shareSurvey"
        >
          <div>
            <div class="font-medium text-blue-900">分享這份問卷</div>
            <div class="text-sm text-blue-600">推薦給您的朋友和同事</div>
          </div>
          <Icon name="heroicons:share" class="w-5 h-5 text-blue-500" />
        </button>

        <!-- 填寫其他問卷 -->
        <button
          class="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left"
          @click="exploreMore"
        >
          <div>
            <div class="font-medium text-blue-900">探索更多問卷</div>
            <div class="text-sm text-blue-600">發現其他有趣的調查</div>
          </div>
          <Icon name="heroicons:arrow-right" class="w-5 h-5 text-blue-500" />
        </button>
      </div>
    </div>

    <!-- 感謝訊息 -->
    <div class="text-center text-gray-500 text-sm">
      <p>再次感謝您的寶貴時間和回答</p>
      <p class="mt-1">您的意見對我們非常重要 ❤️</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubmitResponseResponse } from '@smartsurvey/shared';

// ====================================================================
// Props 定義
// ====================================================================

interface Props {
  /** 提交結果資料 */
  submissionResult: SubmitResponseResponse;
  /** 完成統計 */
  completionStats?: {
    answeredCount: number;
    totalQuestions: number;
    duration: number; // 秒
    completionRate: number; // 0-1
  };
  /** 是否允許查看結果 */
  canViewResults?: boolean;
  /** 是否允許分享 */
  canShare?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canViewResults: false,
  canShare: true,
});

// ====================================================================
// Emits 定義
// ====================================================================

const emit = defineEmits<{
  viewResults: [];
  shareSurvey: [];
  exploreMore: [];
}>();

// ====================================================================
// 事件處理
// ====================================================================

function viewResults() {
  emit('viewResults');
}

function shareSurvey() {
  emit('shareSurvey');
}

function exploreMore() {
  emit('exploreMore');
}

// ====================================================================
// 工具函數
// ====================================================================

/**
 * 格式化日期時間
 */
function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

/**
 * 格式化持續時間
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分鐘`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小時${minutes}分鐘`;
  }
}
</script>

<style scoped>
/* 自定義動畫效果 */
@keyframes celebration {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}

.animate-celebration {
  animation: celebration 2s ease-in-out infinite;
}
</style>
