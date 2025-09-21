<template>
  <div class="progress-indicator bg-white border border-gray-200 rounded-lg mb-6">
    <!-- 進度標題和百分比 -->
    <div class="progress-header flex items-center justify-between p-4 pb-3">
      <h3 class="progress-title text-lg font-medium text-gray-900">填寫進度</h3>
      <span
        class="progress-percentage text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md"
      >
        {{ progressPercentage }}%
      </span>
    </div>

    <!-- 進度條區域 -->
    <div class="progress-bar-section px-4 pb-4">
      <div class="progress-bar-container relative">
        <div class="w-full bg-gray-200 rounded-full progress-track">
          <div
            class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out progress-fill"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
        <!-- 進度條上的數字標示（手機端隱藏） -->
        <div
          v-if="progressPercentage > 20"
          class="progress-overlay absolute inset-y-0 right-2 flex items-center text-xs font-medium text-white hidden sm:flex"
        >
          {{ answeredCount }}/{{ totalCount }}
        </div>
      </div>
    </div>

    <!-- 進度詳情卡片 -->
    <div class="progress-details-section border-t border-gray-100 p-4">
      <!-- 手機端：簡潔的兩行佈局 -->
      <div class="progress-stats grid grid-cols-2 gap-3 sm:hidden">
        <div class="stat-card bg-green-50 rounded-lg p-3 text-center">
          <div class="flex items-center justify-center space-x-1 mb-1">
            <Icon name="heroicons:check-circle" class="w-4 h-4 text-green-600" />
            <span class="text-xs font-medium text-green-700">已完成</span>
          </div>
          <div class="text-lg font-bold text-green-800">{{ answeredCount }}</div>
        </div>

        <div class="stat-card bg-blue-50 rounded-lg p-3 text-center">
          <div class="flex items-center justify-center space-x-1 mb-1">
            <Icon name="heroicons:document-text" class="w-4 h-4 text-blue-600" />
            <span class="text-xs font-medium text-blue-700">總計</span>
          </div>
          <div class="text-lg font-bold text-blue-800">{{ totalCount }}</div>
        </div>
      </div>

      <!-- 必填提示（手機端） -->
      <div v-if="requiredCount > 0" class="mt-3 sm:hidden">
        <div class="flex items-center justify-center space-x-2 bg-amber-50 rounded-lg p-2">
          <Icon name="heroicons:exclamation-circle" class="w-4 h-4 text-amber-600" />
          <span class="text-xs text-amber-700">
            必填：<span class="font-medium">{{ requiredCount }}</span> 題
            <span v-if="missingRequiredCount > 0" class="text-amber-800">
              （還需填寫 {{ missingRequiredCount }} 題）
            </span>
          </span>
        </div>
      </div>

      <!-- 桌面端：原有的三欄佈局 -->
      <div class="progress-details hidden sm:grid grid-cols-3 gap-4 text-sm">
        <!-- 已完成題目數 -->
        <div class="flex items-center space-x-2">
          <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
          <span class="text-gray-700">
            已完成：<span class="font-medium text-gray-900">{{ answeredCount }}</span>
          </span>
        </div>

        <!-- 必填題目數 -->
        <div class="flex items-center space-x-2">
          <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-600" />
          <span class="text-gray-700">
            必填：<span class="font-medium text-gray-900">{{ requiredCount }}</span>
          </span>
        </div>

        <!-- 總題目數 -->
        <div class="flex items-center space-x-2">
          <Icon name="heroicons:document-text" class="w-5 h-5 text-blue-600" />
          <span class="text-gray-700">
            總計：<span class="font-medium text-gray-900">{{ totalCount }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 預估完成時間（優化顯示） -->
    <div
      v-if="estimatedTimeRemaining && progressPercentage > 0 && progressPercentage < 100"
      class="time-estimation border-t border-gray-100 px-4 py-3"
    >
      <div
        class="flex items-center justify-center sm:justify-start space-x-2 text-sm text-gray-600"
      >
        <Icon name="heroicons:clock" class="w-4 h-4 text-blue-500" />
        <span class="font-medium">預估剩餘：</span>
        <span class="text-blue-600 font-bold">{{ estimatedTimeRemaining }}</span>
      </div>
    </div>

    <!-- 完成提示（增強視覺效果） -->
    <div
      v-if="progressPercentage === 100"
      class="completion-banner border-t border-gray-100 px-4 py-3"
    >
      <div class="flex items-center justify-center space-x-2 bg-green-50 rounded-lg p-3">
        <Icon name="heroicons:check-badge" class="w-6 h-6 text-green-600" />
        <span class="text-sm font-bold text-green-700">恭喜！您已完成所有題目</span>
      </div>
    </div>

    <!-- 缺失必填提示（移動端友善） -->
    <div
      v-if="missingRequiredCount > 0 && progressPercentage < 100"
      class="missing-required border-t border-gray-100 px-4 py-3"
    >
      <div
        class="flex items-center justify-center sm:justify-start space-x-2 bg-amber-50 rounded-lg p-3"
      >
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-amber-600" />
        <span class="text-sm text-amber-700">
          <span class="font-medium">還有 {{ missingRequiredCount }} 個必填題目</span>
          <span class="hidden sm:inline">待填寫</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定義組件屬性
interface Props {
  /** 填寫進度百分比 */
  progressPercentage: number;
  /** 已回答題目數量 */
  answeredCount: number;
  /** 總題目數量 */
  totalCount: number;
  /** 必填題目數量 */
  requiredCount: number;
  /** 未填寫的必填題目數量 */
  missingRequiredCount: number;
  /** 開始填寫時間 */
  startTime?: Date;
  /** 是否顯示預估時間 */
  showEstimatedTime?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  progressPercentage: 0,
  answeredCount: 0,
  totalCount: 0,
  requiredCount: 0,
  missingRequiredCount: 0,
  showEstimatedTime: true,
});

// 計算預估剩餘時間
const estimatedTimeRemaining = computed(() => {
  if (!props.showEstimatedTime || !props.startTime || props.progressPercentage <= 0) {
    return null;
  }

  const now = new Date();
  const elapsedMinutes = (now.getTime() - props.startTime.getTime()) / (1000 * 60);

  // 如果填寫時間太短，不顯示預估時間
  if (elapsedMinutes < 0.5) {
    return null;
  }

  // 計算每題平均時間
  const averageTimePerQuestion = elapsedMinutes / props.answeredCount;
  const remainingQuestions = props.totalCount - props.answeredCount;
  const estimatedMinutes = Math.round(averageTimePerQuestion * remainingQuestions);

  // 格式化時間顯示
  if (estimatedMinutes < 1) {
    return '不到 1 分鐘';
  } else if (estimatedMinutes < 60) {
    return `約 ${estimatedMinutes} 分鐘`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    return minutes > 0 ? `約 ${hours} 小時 ${minutes} 分鐘` : `約 ${hours} 小時`;
  }
});
</script>

<style scoped>
/* ============================================================================ */
/* 進度指示器容器樣式 */
/* ============================================================================ */

.progress-indicator {
  /* 進度指示器的陰影效果 */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);

  /* 確保在所有設備上的一致性 */
  transition: box-shadow 0.2s ease;
}

.progress-indicator:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ============================================================================ */
/* 進度標題區域 */
/* ============================================================================ */

.progress-header {
  /* 確保標題區域在小螢幕上有足夠觸控空間 */
  min-height: 56px;
}

.progress-title {
  /* 響應式字體大小 */
  font-size: clamp(1rem, 3vw, 1.125rem);
}

.progress-percentage {
  /* 百分比數字的特殊樣式 */
  min-width: 48px;
  text-align: center;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
}

/* ============================================================================ */
/* 進度條樣式優化 */
/* ============================================================================ */

.progress-track {
  /* 進度條軌道 */
  height: 8px; /* 比原本稍微粗一點，更容易看清 */
  position: relative;
  overflow: hidden;
}

.progress-fill {
  /* 進度條填充 */
  height: 8px;
  min-width: 2px; /* 確保即使是很小的百分比也能看到 */
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  /* 進度條的光澤效果 */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-overlay {
  /* 進度條上的文字顯示 */
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* ============================================================================ */
/* 統計卡片樣式（手機端） */
/* ============================================================================ */

.stat-card {
  /* 統計卡片的基礎樣式 */
  transition: all 0.2s ease;
  min-height: 64px; /* 確保觸控友善 */

  /* 輕微的立體感 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* ============================================================================ */
/* 時間預估區域 */
/* ============================================================================ */

.time-estimation {
  /* 時間預估的特殊背景 */
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* ============================================================================ */
/* 完成橫幅 */
/* ============================================================================ */

.completion-banner {
  /* 完成提示的動畫效果 */
  animation: completionPulse 1s ease-in-out;
}

@keyframes completionPulse {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ============================================================================ */
/* 警告提示區域 */
/* ============================================================================ */

.missing-required {
  /* 必填提示的脈衝動畫 */
  animation: gentlePulse 3s ease-in-out infinite;
}

@keyframes gentlePulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* ============================================================================ */
/* 響應式設計 */
/* ============================================================================ */

/* 手機端專用優化 */
@media (max-width: 639px) {
  .progress-indicator {
    /* 手機端減少邊距 */
    margin-bottom: 1rem;
  }

  .progress-header {
    /* 手機端標題區域調整 */
    padding: 1rem 1rem 0.75rem;
  }

  .progress-bar-section {
    /* 手機端進度條區域 */
    padding: 0 1rem 1rem;
  }

  .progress-details-section {
    /* 手機端詳情區域 */
    padding: 1rem;
  }

  .progress-stats {
    /* 手機端統計區域間距 */
    gap: 0.75rem;
  }

  .stat-card {
    /* 手機端統計卡片 */
    padding: 0.75rem;
    min-height: 60px;
  }

  .time-estimation,
  .completion-banner,
  .missing-required {
    /* 手機端提示區域 */
    padding: 0.75rem 1rem;
  }
}

/* 超小螢幕優化 */
@media (max-width: 359px) {
  .progress-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .progress-percentage {
    align-self: stretch;
    padding: 0.5rem;
  }

  .stat-card {
    padding: 0.5rem;
    min-height: 52px;
  }

  .stat-card .text-lg {
    font-size: 1rem;
  }
}

/* 平板端優化 */
@media (min-width: 640px) and (max-width: 1023px) {
  .progress-details {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* 大螢幕優化 */
@media (min-width: 1024px) {
  .progress-indicator {
    /* 大螢幕時可以有更多的留白 */
    margin-bottom: 1.5rem;
  }

  .progress-track,
  .progress-fill {
    /* 大螢幕上進度條可以稍微細一些 */
    height: 6px;
  }
}

/* ============================================================================ */
/* 無障礙設計 */
/* ============================================================================ */

/* 高對比模式支援 */
@media (prefers-contrast: high) {
  .progress-track {
    background-color: #000;
  }

  .progress-fill {
    background: #0066cc !important;
  }

  .stat-card {
    border: 2px solid #333;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .stat-card,
  .completion-banner,
  .missing-required {
    animation: none;
    transition: none;
  }

  .progress-fill::after {
    display: none;
  }
}

/* 暗色主題準備 */
@media (prefers-color-scheme: dark) {
  .progress-indicator {
    /* 暗色主題下的調整（未來可啟用） */
    /* background-color: #1f2937; */
    /* border-color: #374151; */
  }
}
</style>
