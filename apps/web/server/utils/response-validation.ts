/**
 * 問卷回應驗證工具函數
 * 處理回應提交時的各種驗證邏輯
 */

import {
  type Survey,
  type Question,
  type SubmitResponseRequest,
  type ResponseValidationResult,
  type AnswerValidationResult,
  type DuplicateCheckResult,
  SubmitResponseRequestSchema,
  validateAnswerByQuestionType,
} from '@smartsurvey/shared';
import { dbConnection } from '@smartsurvey/shared';
import { ObjectId } from 'mongodb';
import { getClientIP } from './client-ip';

// ============================================================================
// 基礎驗證函數
// ============================================================================

/**
 * 驗證提交請求的基本格式
 */
export async function validateSubmissionRequest(
  data: any
): Promise<{ isValid: boolean; data?: SubmitResponseRequest; errors: string[] }> {
  try {
    const validatedData = SubmitResponseRequestSchema.parse(data);
    return {
      isValid: true,
      data: validatedData,
      errors: [],
    };
  } catch (error: any) {
    const errors = error.errors?.map((e: any) => e.message) || ['請求格式錯誤'];
    return {
      isValid: false,
      errors,
    };
  }
}

/**
 * 驗證問卷是否存在且可填寫
 */
export async function validateSurveyAvailable(surveyId: string): Promise<{
  isValid: boolean;
  survey?: Survey;
  error?: string;
}> {
  try {
    const db = dbConnection.getDatabase();

    const survey = await db.collection('surveys').findOne({
      _id: new ObjectId(surveyId),
    });

    if (!survey) {
      return {
        isValid: false,
        error: '問卷不存在',
      };
    }

    // 檢查問卷狀態
    if (survey.status !== 'published') {
      return {
        isValid: false,
        error: '問卷未發布或已關閉',
      };
    }

    // 檢查問卷是否在有效期間內
    const now = new Date();
    if (
      survey.settings?.publishSettings?.startDate &&
      new Date(survey.settings.publishSettings.startDate) > now
    ) {
      return {
        isValid: false,
        error: '問卷尚未開始',
      };
    }

    if (
      survey.settings?.publishSettings?.endDate &&
      new Date(survey.settings.publishSettings.endDate) < now
    ) {
      return {
        isValid: false,
        error: '問卷已結束',
      };
    }

    return {
      isValid: true,
      survey: survey as unknown as Survey,
    };
  } catch (error) {
    console.error('[Validation] 檢查問卷可用性失敗:', error);
    return {
      isValid: false,
      error: '驗證問卷時發生錯誤',
    };
  }
}

/**
 * 驗證個別題目答案
 */
export function validateQuestionAnswer(question: Question, answer: any): AnswerValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 檢查必填
  if (question.required) {
    if (
      answer === null ||
      answer === undefined ||
      answer === '' ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      errors.push('此題目為必填');
      return { isValid: false, errors, warnings };
    }
  }

  // 如果答案為空且非必填，則跳過後續驗證
  if (
    answer === null ||
    answer === undefined ||
    answer === '' ||
    (Array.isArray(answer) && answer.length === 0)
  ) {
    return { isValid: true, errors, warnings };
  }

  // 檢查答案類型是否符合題型
  if (!validateAnswerByQuestionType(question.type, answer)) {
    errors.push('答案格式不符合題目類型');
    return { isValid: false, errors, warnings };
  }

  // 根據題型進行具體驗證
  switch (question.type) {
    case 'text_short':
    case 'text_long':
      if (typeof answer === 'string') {
        const minLength = question.validation?.minLength;
        const maxLength = question.validation?.maxLength;

        if (minLength && answer.length < minLength) {
          errors.push(`文字長度不能少於 ${minLength} 個字元`);
        }
        if (maxLength && answer.length > maxLength) {
          errors.push(`文字長度不能超過 ${maxLength} 個字元`);
        }
      }
      break;

    case 'single_choice':
      if (
        question.config?.options &&
        !question.config.options.find((opt: any) => opt.value === answer)
      ) {
        errors.push('選項不存在');
      }
      break;

    case 'multiple_choice':
      if (Array.isArray(answer) && question.config?.options) {
        const invalidOptions = answer.filter(
          val => !question.config!.options!.find((opt: any) => opt.value === val)
        );
        if (invalidOptions.length > 0) {
          errors.push('包含無效選項');
        }

        const maxChoices = question.config?.maxChoices;
        if (maxChoices && answer.length > maxChoices) {
          errors.push(`最多只能選擇 ${maxChoices} 個選項`);
        }
      }
      break;

    case 'rating':
      if (typeof answer === 'number') {
        const min = question.config?.min || 1;
        const max = question.config?.max || 5;

        if (answer < min || answer > max) {
          errors.push(`評分必須在 ${min} 到 ${max} 之間`);
        }
      }
      break;

    case 'number':
      if (typeof answer === 'number') {
        const min = question.validation?.min;
        const max = question.validation?.max;

        if (min !== undefined && answer < min) {
          errors.push(`數值不能小於 ${min}`);
        }
        if (max !== undefined && answer > max) {
          errors.push(`數值不能大於 ${max}`);
        }
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 驗證整個問卷回應
 */
export function validateSurveyResponse(
  survey: Survey,
  answers: Record<string, any>
): ResponseValidationResult {
  const questionResults: Record<string, AnswerValidationResult> = {};
  const globalErrors: string[] = [];

  // 驗證每個題目
  survey.questions.forEach(question => {
    const answer = answers[question.id];
    questionResults[question.id] = validateQuestionAnswer(question, answer);
  });

  // 檢查是否有必填題目未回答
  const requiredQuestions = survey.questions.filter(q => q.required);
  const missingRequired = requiredQuestions.filter(q => {
    const result = questionResults[q.id];
    return result && !result.isValid && result.errors.includes('此題目為必填');
  });

  if (missingRequired.length > 0) {
    globalErrors.push(`還有 ${missingRequired.length} 個必填題目未完成`);
  }

  // 檢查整體是否有效
  const hasErrors =
    Object.values(questionResults).some(result => !result.isValid) || globalErrors.length > 0;

  return {
    isValid: !hasErrors,
    questionResults,
    globalErrors,
  };
}

// ============================================================================
// 重複提交檢查
// ============================================================================

/**
 * 檢查是否為重複提交
 */
export async function checkDuplicateSubmission(
  event: any,
  surveyId: string,
  answers: Record<string, any>
): Promise<DuplicateCheckResult> {
  try {
    const db = dbConnection.getDatabase();
    const clientIP = getClientIP(event);
    const userAgent = getHeader(event, 'user-agent') || '';

    // 設定檢查時間窗口（30分鐘內）
    const timeWindow = new Date(Date.now() - 30 * 60 * 1000);

    // 查找相似的提交
    const recentSubmissions = await db
      .collection('responses')
      .find({
        surveyId: new ObjectId(surveyId),
        createdAt: { $gte: timeWindow },
      })
      .toArray();

    const checkCriteria = {
      ipMatch: false,
      userAgentMatch: false,
      answerSimilarity: 0,
      timeInterval: 0,
    };

    // 檢查每個最近的提交
    for (const submission of recentSubmissions) {
      let suspiciousScore = 0;

      // IP 地址匹配 (+40 分)
      if (submission.metadata?.ipAddress === clientIP) {
        checkCriteria.ipMatch = true;
        suspiciousScore += 40;
      }

      // User-Agent 匹配 (+30 分)
      if (submission.metadata?.userAgent === userAgent) {
        checkCriteria.userAgentMatch = true;
        suspiciousScore += 30;
      }

      // 答案相似度檢查 (+0-30 分)
      const similarity = calculateAnswerSimilarity(answers, submission.answers);
      checkCriteria.answerSimilarity = Math.max(checkCriteria.answerSimilarity || 0, similarity);
      suspiciousScore += similarity * 30;

      // 時間間隔檢查 (+0-10 分)
      const timeInterval = (Date.now() - submission.createdAt.getTime()) / (1000 * 60); // 分鐘
      checkCriteria.timeInterval = Math.min(checkCriteria.timeInterval || Infinity, timeInterval);
      if (timeInterval < 5) {
        suspiciousScore += 10;
      }

      // 如果總分超過 70 分，視為重複提交
      if (suspiciousScore >= 70) {
        return {
          isDuplicate: true,
          existingResponseId: submission.responseId,
          checkCriteria,
        };
      }
    }

    return {
      isDuplicate: false,
      checkCriteria,
    };
  } catch (error) {
    console.error('[Validation] 重複提交檢查失敗:', error);
    // 檢查失敗時，為了安全起見，允許提交
    return {
      isDuplicate: false,
      checkCriteria: {},
    };
  }
}

/**
 * 計算答案相似度 (0-1)
 */
function calculateAnswerSimilarity(answers1: Record<string, any>, answers2: any[]): number {
  const answersMap2: Record<string, any> = {};
  answers2.forEach(answer => {
    answersMap2[answer.questionId] = answer.value;
  });

  const allQuestions = new Set([...Object.keys(answers1), ...Object.keys(answersMap2)]);

  if (allQuestions.size === 0) return 0;

  let matchingAnswers = 0;
  for (const questionId of allQuestions) {
    const val1 = answers1[questionId];
    const val2 = answersMap2[questionId];

    if (JSON.stringify(val1) === JSON.stringify(val2)) {
      matchingAnswers++;
    }
  }

  return matchingAnswers / allQuestions.size;
}

/**
 * 生成唯一的回應 ID
 */
export function generateResponseId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `resp_${timestamp}_${random}`;
}

// ============================================================================
// 輔助函數
// ============================================================================

function getHeader(event: any, name: string): string | undefined {
  return event.node?.req?.headers?.[name] || event.headers?.[name];
}
