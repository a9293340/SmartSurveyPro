<template>
  <div class="progress-indicator bg-white border border-gray-200 rounded-lg p-4 mb-6">
    <!-- 進度標題 -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-medium text-gray-900">填寫進度</h3>
      <span class="text-sm font-medium text-blue-600">{{ progressPercentage }}%</span>
    </div>

    <!-- 進度條 -->
    <div class="progress-bar-container mb-4">
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
    </div>

    <!-- 進度詳情 -->
    <div class="progress-details grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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

    <!-- 預估完成時間 -->
    <div
      v-if="estimatedTimeRemaining && progressPercentage > 0 && progressPercentage < 100"
      class="mt-4 pt-4 border-t border-gray-100"
    >
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <Icon name="heroicons:clock" class="w-4 h-4" />
        <span>預估剩餘時間：{{ estimatedTimeRemaining }}</span>
      </div>
    </div>

    <!-- 完成提示 -->
    <div v-if="progressPercentage === 100" class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center space-x-2 text-sm text-green-600">
        <Icon name="heroicons:check-badge" class="w-5 h-5" />
        <span class="font-medium">恭喜！您已完成所有題目</span>
      </div>
    </div>

    <!-- 缺失必填提示 -->
    <div v-if="missingRequiredCount > 0" class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center space-x-2 text-sm text-amber-600">
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
        <span>還有 {{ missingRequiredCount }} 個必填題目待填寫</span>
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
.progress-indicator {
  /* 進度指示器的陰影效果 */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.progress-bar-container {
  /* 進度條容器的特殊樣式 */
  position: relative;
}

.progress-bar-container::after {
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
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  border-radius: 9999px;
  pointer-events: none;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .progress-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
