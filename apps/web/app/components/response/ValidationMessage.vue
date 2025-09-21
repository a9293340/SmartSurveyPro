<!--
  驗證訊息顯示組件
  專門用於顯示表單驗證的錯誤、警告和成功訊息
-->

<template>
  <Transition
    name="validation-message"
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-[-10px] scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-[-10px] scale-95"
  >
    <div
      v-if="shouldShow"
      :class="[
        'mt-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200',
        messageClasses,
        sizeClasses,
      ]"
      :aria-live="level === 'error' ? 'assertive' : 'polite'"
      role="alert"
    >
      <!-- 圖示 -->
      <div class="flex items-start space-x-2">
        <Icon
          v-if="showIcon"
          :name="iconName"
          :class="['mt-0.5 flex-shrink-0', iconSizeClasses, iconColorClasses]"
          aria-hidden="true"
        />

        <!-- 訊息內容 -->
        <div class="flex-1 min-w-0">
          <!-- 單一訊息 -->
          <p v-if="!isMultipleMessages" :class="textColorClasses">
            {{ displayMessage }}
          </p>

          <!-- 多個訊息 -->
          <div v-else>
            <p v-if="messageTitle" :class="[textColorClasses, 'font-medium mb-1']">
              {{ messageTitle }}
            </p>

            <ul :class="['space-y-1', isCompact ? 'text-xs' : 'text-sm']">
              <li
                v-for="(msg, index) in allMessages"
                :key="`${level}-${index}`"
                :class="['flex items-start space-x-1', textColorClasses]"
              >
                <span
                  class="block w-1 h-1 rounded-full mt-2 flex-shrink-0"
                  :class="bulletColorClasses"
                  aria-hidden="true"
                />
                <span class="flex-1">{{ msg }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 關閉按鈕 -->
        <button
          v-if="dismissible"
          :class="[
            'flex-shrink-0 rounded p-1 transition-colors duration-200',
            dismissButtonClasses,
          ]"
          :aria-label="dismissLabel"
          type="button"
          @click="handleDismiss"
        >
          <Icon name="x-mark" :class="iconSizeClasses" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ValidationResult } from '~/composables/useFormValidation';

// ============================================================================
// Props 定義
// ============================================================================

export interface Props {
  /** 驗證結果 */
  result?: ValidationResult | null;
  /** 只顯示錯誤訊息 */
  errorsOnly?: boolean;
  /** 只顯示警告訊息 */
  warningsOnly?: boolean;
  /** 緊湊模式 */
  compact?: boolean;
  /** 是否顯示圖示 */
  showIcon?: boolean;
  /** 是否可關閉 */
  dismissible?: boolean;
  /** 多訊息時的標題 */
  messageTitle?: string;
  /** 強制顯示級別 */
  forceLevel?: 'error' | 'warning' | 'success';
  /** 自訂訊息（覆蓋驗證結果） */
  message?: string;
  /** 最大顯示訊息數量 */
  maxMessages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  errorsOnly: false,
  warningsOnly: false,
  compact: false,
  showIcon: true,
  dismissible: false,
  maxMessages: 5,
});

// ============================================================================
// Emits 定義
// ============================================================================

export interface Emits {
  (e: 'dismiss'): void;
}

const emit = defineEmits<Emits>();

// ============================================================================
// 計算屬性
// ============================================================================

/** 當前顯示級別 */
const level = computed(() => {
  if (props.forceLevel) return props.forceLevel;
  if (!props.result) return 'success';
  return props.result.level;
});

/** 所有錯誤訊息 */
const errorMessages = computed(() => {
  if (props.message) return [];
  return props.result?.errors || [];
});

/** 所有警告訊息 */
const warningMessages = computed(() => {
  if (props.message) return [];
  return props.result?.warnings || [];
});

/** 要顯示的訊息列表 */
const allMessages = computed(() => {
  if (props.message) return [props.message];

  let messages: string[] = [];

  if (props.errorsOnly) {
    messages = [...errorMessages.value];
  } else if (props.warningsOnly) {
    messages = [...warningMessages.value];
  } else {
    // 優先顯示錯誤，然後警告
    messages = [...errorMessages.value, ...warningMessages.value];
  }

  // 限制最大訊息數量
  if (props.maxMessages > 0 && messages.length > props.maxMessages) {
    const remaining = messages.length - props.maxMessages;
    messages = messages.slice(0, props.maxMessages);
    messages.push(`還有 ${remaining} 個其他問題...`);
  }

  return messages;
});

/** 單一訊息內容 */
const displayMessage = computed(() => {
  return allMessages.value[0] || '';
});

/** 是否有多個訊息 */
const isMultipleMessages = computed(() => {
  return allMessages.value.length > 1;
});

/** 是否應該顯示 */
const shouldShow = computed(() => {
  return allMessages.value.length > 0;
});

/** 是否為緊湊模式 */
const isCompact = computed(() => {
  return props.compact;
});

/** 訊息樣式類名 */
const messageClasses = computed(() => {
  switch (level.value) {
    case 'error':
      return 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800';
    case 'warning':
      return 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800';
    case 'success':
      return 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800';
    default:
      return 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800';
  }
});

/** 文字顏色類名 */
const textColorClasses = computed(() => {
  switch (level.value) {
    case 'error':
      return 'text-red-800 dark:text-red-200';
    case 'warning':
      return 'text-amber-800 dark:text-amber-200';
    case 'success':
      return 'text-green-800 dark:text-green-200';
    default:
      return 'text-blue-800 dark:text-blue-200';
  }
});

/** 圖示顏色類名 */
const iconColorClasses = computed(() => {
  switch (level.value) {
    case 'error':
      return 'text-red-500 dark:text-red-400';
    case 'warning':
      return 'text-amber-500 dark:text-amber-400';
    case 'success':
      return 'text-green-500 dark:text-green-400';
    default:
      return 'text-blue-500 dark:text-blue-400';
  }
});

/** 子彈點顏色類名 */
const bulletColorClasses = computed(() => {
  switch (level.value) {
    case 'error':
      return 'bg-red-400 dark:bg-red-500';
    case 'warning':
      return 'bg-amber-400 dark:bg-amber-500';
    case 'success':
      return 'bg-green-400 dark:bg-green-500';
    default:
      return 'bg-blue-400 dark:bg-blue-500';
  }
});

/** 關閉按鈕樣式類名 */
const dismissButtonClasses = computed(() => {
  switch (level.value) {
    case 'error':
      return 'text-red-500 hover:bg-red-100 focus:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 dark:focus:bg-red-900/50';
    case 'warning':
      return 'text-amber-500 hover:bg-amber-100 focus:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50 dark:focus:bg-amber-900/50';
    case 'success':
      return 'text-green-500 hover:bg-green-100 focus:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50 dark:focus:bg-green-900/50';
    default:
      return 'text-blue-500 hover:bg-blue-100 focus:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:focus:bg-blue-900/50';
  }
});

/** 尺寸相關類名 */
const sizeClasses = computed(() => {
  return isCompact.value ? 'px-2 py-1' : 'px-3 py-2';
});

/** 圖示尺寸類名 */
const iconSizeClasses = computed(() => {
  return isCompact.value ? 'w-4 h-4' : 'w-5 h-5';
});

/** 圖示名稱 */
const iconName = computed(() => {
  switch (level.value) {
    case 'error':
      return 'exclamation-circle';
    case 'warning':
      return 'exclamation-triangle';
    case 'success':
      return 'check-circle';
    default:
      return 'information-circle';
  }
});

/** 關閉按鈕標籤 */
const dismissLabel = computed(() => {
  switch (level.value) {
    case 'error':
      return '關閉錯誤訊息';
    case 'warning':
      return '關閉警告訊息';
    case 'success':
      return '關閉成功訊息';
    default:
      return '關閉訊息';
  }
});

// ============================================================================
// 方法
// ============================================================================

/**
 * 處理關閉事件
 */
function handleDismiss(): void {
  emit('dismiss');
}
</script>

<style scoped>
/* 自訂動畫效果 */
.validation-message-enter-active {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.validation-message-leave-active {
  transition: all 150ms cubic-bezier(0.4, 0, 1, 1);
}

.validation-message-enter-from,
.validation-message-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.validation-message-enter-to,
.validation-message-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 深色模式微調 */
@media (prefers-color-scheme: dark) {
  .bg-red-50 {
    background-color: rgba(239, 68, 68, 0.1);
  }

  .bg-amber-50 {
    background-color: rgba(245, 158, 11, 0.1);
  }

  .bg-green-50 {
    background-color: rgba(34, 197, 94, 0.1);
  }

  .bg-blue-50 {
    background-color: rgba(59, 130, 246, 0.1);
  }
}

/* 無障礙支援：減少動畫效果偏好 */
@media (prefers-reduced-motion: reduce) {
  .validation-message-enter-active,
  .validation-message-leave-active {
    transition: opacity 150ms linear;
  }

  .validation-message-enter-from,
  .validation-message-leave-to {
    transform: none;
  }
}
</style>
