/**
 * 問卷填寫響應狀態管理
 * 管理問卷填寫過程中的所有狀態，包括答案、驗證、進度等
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Survey, Question } from '@smartsurvey/shared';

// ============================================================================
// 類型定義
// ============================================================================

/** 題目答案類型 */
export interface QuestionAnswer {
  questionId: string;
  value: any; // 根據題型不同，值的類型也不同
  isValid: boolean;
  validationErrors: string[];
  lastModified: Date;
}

/** 問卷填寫狀態 */
export interface SurveyResponse {
  surveyId: string;
  answers: Record<string, QuestionAnswer>;
  startTime: Date;
  lastModified: Date;
  currentQuestionIndex: number;
  isSubmitted: boolean;
  submissionId?: string;
}

/** 驗證結果 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

// ============================================================================
// 問卷填寫 Store
// ============================================================================

export const useResponseStore = defineStore('response', () => {
  // ============================================================================
  // 狀態定義
  // ============================================================================

  /** 當前載入的問卷 */
  const currentSurvey = ref<Survey | null>(null);

  /** 當前填寫回應 */
  const currentResponse = ref<SurveyResponse | null>(null);

  /** 是否正在載入 */
  const isLoading = ref(false);

  /** 是否正在提交 */
  const isSubmitting = ref(false);

  /** 錯誤訊息 */
  const errorMessage = ref<string | null>(null);

  // ============================================================================
  // 計算屬性
  // ============================================================================

  /** 當前問卷的所有題目 */
  const questions = computed(() => currentSurvey.value?.questions || []);

  /** 當前顯示的題目 */
  const currentQuestion = computed(() => {
    if (!currentResponse.value || !questions.value.length) return null;
    return questions.value[currentResponse.value.currentQuestionIndex] || null;
  });

  /** 填寫進度百分比 */
  const progressPercentage = computed(() => {
    if (!currentResponse.value || !questions.value.length) return 0;
    const answeredCount = Object.keys(currentResponse.value.answers).length;
    return Math.round((answeredCount / questions.value.length) * 100);
  });

  /** 是否可以提交 */
  const canSubmit = computed(() => {
    if (!currentResponse.value || !questions.value.length) return false;

    // 檢查所有必填題目是否已回答且有效
    return questions.value.every(question => {
      if (!question.required) return true;

      const answer = currentResponse.value!.answers[question.id];
      return answer && answer.isValid && answer.value !== null;
    });
  });

  /** 當前題目的答案 */
  const currentAnswer = computed(() => {
    if (!currentResponse.value || !currentQuestion.value) return null;
    return currentResponse.value.answers[currentQuestion.value.id] || null;
  });

  // ============================================================================
  // 動作方法
  // ============================================================================

  /**
   * 載入問卷資料
   */
  async function loadSurvey(surveyId: string): Promise<void> {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      // 從 API 載入問卷資料
      const response = await $fetch<Survey>(`/api/surveys/${surveyId}`);
      currentSurvey.value = response;

      // 初始化填寫回應
      initializeResponse(surveyId);

      console.warn('[Response] 問卷載入成功:', surveyId);
    } catch (error) {
      console.error('[Response] 載入問卷失敗:', error);
      errorMessage.value = '載入問卷失敗，請稍後再試';
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 初始化填寫回應
   */
  function initializeResponse(surveyId: string): void {
    const now = new Date();
    currentResponse.value = {
      surveyId,
      answers: {},
      startTime: now,
      lastModified: now,
      currentQuestionIndex: 0,
      isSubmitted: false,
    };

    console.warn('[Response] 初始化填寫回應:', surveyId);
  }

  /**
   * 更新題目答案
   */
  function updateAnswer(questionId: string, value: any): void {
    if (!currentResponse.value) return;

    const question = questions.value.find(q => q.id === questionId);
    if (!question) return;

    // 驗證答案
    const validation = validateAnswer(question, value);

    // 更新答案
    currentResponse.value.answers[questionId] = {
      questionId,
      value,
      isValid: validation.isValid,
      validationErrors: validation.errors,
      lastModified: new Date(),
    };

    // 更新最後修改時間
    currentResponse.value.lastModified = new Date();

    console.warn('[Response] 更新答案:', { questionId, value, isValid: validation.isValid });
  }

  /**
   * 驗證單個題目答案
   */
  function validateAnswer(question: Question, value: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 必填驗證
    if (
      question.required &&
      (value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0))
    ) {
      errors.push('此題目為必填');
    }

    // 根據題型進行特定驗證
    if (value !== null && value !== undefined && value !== '') {
      switch (question.type) {
        case 'text_short':
          if (question.validation?.maxLength && value.length > question.validation.maxLength) {
            errors.push(`文字長度不能超過 ${question.validation.maxLength} 個字元`);
          }
          if (question.validation?.minLength && value.length < question.validation.minLength) {
            errors.push(`文字長度不能少於 ${question.validation.minLength} 個字元`);
          }
          break;

        case 'text_long':
          if (question.validation?.maxLength && value.length > question.validation.maxLength) {
            errors.push(`文字長度不能超過 ${question.validation.maxLength} 個字元`);
          }
          break;

        case 'single_choice':
        case 'multiple_choice':
          if (Array.isArray(value)) {
            const maxChoices = question.config?.maxChoices;
            if (maxChoices && value.length > maxChoices) {
              errors.push(`最多只能選擇 ${maxChoices} 個選項`);
            }
          }
          break;

        case 'rating': {
          const min = question.config?.min || 1;
          const max = question.config?.max || 5;
          if (value < min || value > max) {
            errors.push(`評分必須在 ${min} 到 ${max} 之間`);
          }
          break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 驗證整個問卷
   */
  function validateSurvey(): ValidationResult {
    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};

    if (!currentResponse.value) {
      return { isValid: false, errors: { survey: ['問卷未初始化'] }, warnings };
    }

    // 逐一驗證每個題目
    questions.value.forEach(question => {
      const answer = currentResponse.value!.answers[question.id];
      const value = answer?.value;

      const validation = validateAnswer(question, value);
      if (!validation.isValid) {
        errors[question.id] = validation.errors;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 移動到下一題
   */
  function nextQuestion(): void {
    if (!currentResponse.value || !questions.value.length) return;

    const maxIndex = questions.value.length - 1;
    if (currentResponse.value.currentQuestionIndex < maxIndex) {
      currentResponse.value.currentQuestionIndex++;
      console.warn('[Response] 移動到下一題:', currentResponse.value.currentQuestionIndex);
    }
  }

  /**
   * 移動到上一題
   */
  function previousQuestion(): void {
    if (!currentResponse.value) return;

    if (currentResponse.value.currentQuestionIndex > 0) {
      currentResponse.value.currentQuestionIndex--;
      console.warn('[Response] 移動到上一題:', currentResponse.value.currentQuestionIndex);
    }
  }

  /**
   * 跳轉到指定題目
   */
  function goToQuestion(index: number): void {
    if (!currentResponse.value || !questions.value.length) return;

    if (index >= 0 && index < questions.value.length) {
      currentResponse.value.currentQuestionIndex = index;
      console.warn('[Response] 跳轉到題目:', index);
    }
  }

  /**
   * 提交問卷回應
   */
  async function submitResponse(): Promise<string> {
    if (!currentResponse.value || !currentSurvey.value) {
      throw new Error('問卷或回應未初始化');
    }

    // 驗證問卷
    const validation = validateSurvey();
    if (!validation.isValid) {
      console.error('[Response] 問卷驗證失敗:', validation.errors);
      throw new Error('問卷填寫不完整或有錯誤');
    }

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      // 準備提交資料
      const submissionData = {
        surveyId: currentResponse.value.surveyId,
        answers: currentResponse.value.answers,
        startTime: currentResponse.value.startTime,
        endTime: new Date(),
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      // 提交到 API
      const result = await $fetch<{ submissionId: string }>('/api/responses', {
        method: 'POST',
        body: submissionData,
      });

      // 更新提交狀態
      currentResponse.value.isSubmitted = true;
      currentResponse.value.submissionId = result.submissionId;

      console.warn('[Response] 問卷提交成功:', result.submissionId);
      return result.submissionId;
    } catch (error) {
      console.error('[Response] 提交問卷失敗:', error);
      errorMessage.value = '提交失敗，請稍後再試';
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  }

  /**
   * 重置填寫狀態
   */
  function resetResponse(): void {
    currentResponse.value = null;
    currentSurvey.value = null;
    errorMessage.value = null;
    console.warn('[Response] 重置填寫狀態');
  }

  /**
   * 自動保存進度（本地存儲）
   */
  function saveProgress(): void {
    if (!currentResponse.value) return;

    try {
      const progressData = {
        surveyId: currentResponse.value.surveyId,
        answers: currentResponse.value.answers,
        currentQuestionIndex: currentResponse.value.currentQuestionIndex,
        lastModified: currentResponse.value.lastModified,
      };

      localStorage.setItem(
        `survey_progress_${currentResponse.value.surveyId}`,
        JSON.stringify(progressData)
      );

      console.warn('[Response] 進度已自動保存');
    } catch (error) {
      console.error('[Response] 保存進度失敗:', error);
    }
  }

  /**
   * 載入保存的進度
   */
  function loadProgress(surveyId: string): boolean {
    try {
      const saved = localStorage.getItem(`survey_progress_${surveyId}`);
      if (!saved) return false;

      const progressData = JSON.parse(saved);
      if (!currentResponse.value) return false;

      // 恢復答案和進度
      currentResponse.value.answers = progressData.answers || {};
      currentResponse.value.currentQuestionIndex = progressData.currentQuestionIndex || 0;
      currentResponse.value.lastModified = new Date(progressData.lastModified);

      console.warn('[Response] 已載入保存的進度');
      return true;
    } catch (error) {
      console.error('[Response] 載入進度失敗:', error);
      return false;
    }
  }

  // ============================================================================
  // 返回公開介面
  // ============================================================================

  return {
    // 狀態
    currentSurvey,
    currentResponse,
    isLoading,
    isSubmitting,
    errorMessage,

    // 計算屬性
    questions,
    currentQuestion,
    progressPercentage,
    canSubmit,
    currentAnswer,

    // 動作
    loadSurvey,
    updateAnswer,
    validateAnswer,
    validateSurvey,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitResponse,
    resetResponse,
    saveProgress,
    loadProgress,
  };
});
