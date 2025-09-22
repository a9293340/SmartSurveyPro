/**
 * 問卷提交功能 Composable
 * 處理問卷提交的完整流程，包含驗證、提交、錯誤處理
 */

import { ref, computed } from 'vue';
import type { SubmitResponseRequest, SubmitResponseResponse, Survey } from '@smartsurvey/shared';

export interface SubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionResult: SubmitResponseResponse | null;
  submissionError: string | null;
}

export interface SubmissionOptions {
  /** 是否在提交前進行前端驗證 */
  validateBeforeSubmit?: boolean;
  /** 是否顯示提交確認對話框 */
  showConfirmDialog?: boolean;
  /** 提交成功後的重定向 URL */
  redirectUrl?: string;
}

/**
 * 問卷提交功能 Hook
 */
export function useSubmission(surveyId: string, options: SubmissionOptions = {}) {
  // ====================================================================
  // 狀態管理
  // ====================================================================

  const state = ref<SubmissionState>({
    isSubmitting: false,
    isSubmitted: false,
    submissionResult: null,
    submissionError: null,
  });

  const startTime = ref<Date | null>(null);

  // ====================================================================
  // 計算屬性
  // ====================================================================

  const canSubmit = computed(() => {
    return !state.value.isSubmitting && !state.value.isSubmitted;
  });

  const hasError = computed(() => {
    return state.value.submissionError !== null;
  });

  // ====================================================================
  // 提交邏輯
  // ====================================================================

  /**
   * 開始填寫計時
   */
  function startSurvey() {
    if (!startTime.value) {
      startTime.value = new Date();
    }
  }

  /**
   * 提交問卷回應
   */
  async function submitSurvey(
    survey: Survey,
    answers: Record<string, any>,
    metadata: Record<string, any> = {}
  ): Promise<SubmitResponseResponse | null> {
    // 重置狀態
    state.value.submissionError = null;
    state.value.submissionResult = null;
    state.value.isSubmitting = true;

    try {
      // 準備提交數據
      const submitData: SubmitResponseRequest = {
        surveyId,
        answers,
        startTime: startTime.value || new Date(),
        endTime: new Date(),
        metadata: {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          ...metadata,
        },
      };

      console.warn('[useSubmission] 準備提交問卷:', {
        surveyId,
        answersCount: Object.keys(answers).length,
        duration: startTime.value ? Math.floor((Date.now() - startTime.value.getTime()) / 1000) : 0,
      });

      // 發送 API 請求
      const response = await $fetch<SubmitResponseResponse>(`/api/surveys/${surveyId}/responses`, {
        method: 'POST',
        body: submitData,
      });

      // 提交成功
      state.value.submissionResult = response;
      state.value.isSubmitted = true;

      console.warn('[useSubmission] 提交成功:', {
        responseId: response.responseId,
        submittedAt: response.submittedAt,
      });

      // 處理重定向
      if (options.redirectUrl) {
        await navigateTo(options.redirectUrl);
      }

      return response;
    } catch (error: any) {
      // 提交失敗
      console.error('[useSubmission] 提交失敗:', error);

      let errorMessage = '提交失敗，請稍後再試';

      if (error.statusCode) {
        switch (error.statusCode) {
          case 400:
            errorMessage = '提交的資料格式不正確';
            break;
          case 404:
            errorMessage = '問卷不存在或已關閉';
            break;
          case 409:
            errorMessage = '檢測到重複提交，請勿重複送出';
            break;
          case 422:
            errorMessage = '回答驗證失敗，請檢查必填項目';
            break;
          case 429:
            errorMessage = '提交太頻繁，請稍後再試';
            break;
          case 500:
            errorMessage = '伺服器錯誤，請稍後再試';
            break;
          default:
            errorMessage = error.statusMessage || errorMessage;
        }
      }

      state.value.submissionError = errorMessage;
      return null;
    } finally {
      state.value.isSubmitting = false;
    }
  }

  /**
   * 重置提交狀態
   */
  function resetSubmission() {
    state.value.isSubmitting = false;
    state.value.isSubmitted = false;
    state.value.submissionResult = null;
    state.value.submissionError = null;
    startTime.value = null;
  }

  /**
   * 重試提交
   */
  async function retrySubmission(
    survey: Survey,
    answers: Record<string, any>,
    metadata?: Record<string, any>
  ) {
    state.value.submissionError = null;
    return await submitSurvey(survey, answers, metadata);
  }

  // ====================================================================
  // 返回介面
  // ====================================================================

  return {
    // 狀態
    state: readonly(state),

    // 計算屬性
    canSubmit,
    hasError,

    // 方法
    startSurvey,
    submitSurvey,
    resetSubmission,
    retrySubmission,

    // 輔助方法
    getSubmissionDuration: () => {
      if (!startTime.value) return 0;
      return Math.floor((Date.now() - startTime.value.getTime()) / 1000);
    },

    getSubmissionSummary: () => {
      if (!state.value.submissionResult) return null;

      return {
        responseId: state.value.submissionResult.responseId,
        submittedAt: state.value.submissionResult.submittedAt,
        duration: startTime.value
          ? Math.floor(
              (state.value.submissionResult.submittedAt.getTime() - startTime.value.getTime()) /
                1000
            )
          : 0,
      };
    },
  };
}

// ====================================================================
// 類型輔助
// ====================================================================

export type UseSubmissionReturn = ReturnType<typeof useSubmission>;
