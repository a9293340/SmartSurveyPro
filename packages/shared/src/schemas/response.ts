/**
 * 問卷回應相關驗證 Schema
 * 使用 Zod 定義 API 請求/回應的驗證規則
 */

import { z } from 'zod';

// ============================================================================
// 基礎 Schema
// ============================================================================

/** 回應狀態 Schema */
export const ResponseStatusSchema = z.enum(['draft', 'submitted', 'completed'], {
  description: '問卷回應狀態',
});

/** 題目答案資料 Schema */
export const QuestionAnswerDataSchema = z.object({
  questionId: z.string().min(1, '題目 ID 不能為空'),
  questionType: z.string().min(1, '題目類型不能為空'),
  value: z.any().describe('答案值，類型依題目而定'),
  answeredAt: z.coerce.date().describe('回答時間'),
});

/** 回應元資料 Schema */
export const ResponseMetadataSchema = z.object({
  userAgent: z.string().optional().describe('瀏覽器用戶代理'),
  ipAddress: z.string().ip().optional().describe('IP 地址'),
  referrer: z.string().url().optional().describe('推薦來源網址'),
  screenResolution: z.string().optional().describe('螢幕解析度'),
  timezone: z.string().optional().describe('時區'),
  language: z.string().optional().describe('語言偏好'),
});

/** 提交統計資料 Schema */
export const SubmissionStatsSchema = z.object({
  startTime: z.coerce.date().describe('開始填寫時間'),
  endTime: z.coerce.date().describe('完成填寫時間'),
  duration: z.number().min(0).describe('總填寫時間（秒）'),
  pageTimings: z.record(z.string(), z.number()).optional().describe('頁面停留時間統計'),
});

// ============================================================================
// API 請求 Schema
// ============================================================================

/** 提交回應請求 Schema */
export const SubmitResponseRequestSchema = z
  .object({
    surveyId: z.string().min(1, '問卷 ID 不能為空'),
    answers: z.record(z.string(), z.any()).describe('題目答案對照表'),
    startTime: z.coerce.date().describe('開始填寫時間'),
    endTime: z.coerce.date().describe('完成填寫時間'),
    metadata: ResponseMetadataSchema.optional().describe('回應元資料'),
  })
  .refine(data => data.endTime >= data.startTime, {
    message: '完成時間必須晚於開始時間',
    path: ['endTime'],
  })
  .refine(data => Object.keys(data.answers).length > 0, {
    message: '必須至少回答一個題目',
    path: ['answers'],
  });

/** 儲存進度請求 Schema */
export const SaveProgressRequestSchema = z.object({
  surveyId: z.string().min(1, '問卷 ID 不能為空'),
  answers: z.record(z.string(), z.any()).describe('目前答案'),
  currentQuestionIndex: z.number().min(0).describe('當前題目索引'),
  lastModified: z.coerce.date().describe('最後修改時間'),
});

// ============================================================================
// API 回應 Schema
// ============================================================================

/** 提交回應回應 Schema */
export const SubmitResponseResponseSchema = z.object({
  success: z.boolean().describe('提交是否成功'),
  responseId: z.string().min(1, '回應 ID 不能為空'),
  submittedAt: z.coerce.date().describe('提交時間'),
  message: z.string().optional().describe('回應訊息'),
});

/** 儲存進度回應 Schema */
export const SaveProgressResponseSchema = z.object({
  success: z.boolean().describe('儲存是否成功'),
  progressId: z.string().min(1, '進度 ID 不能為空'),
  message: z.string().optional().describe('回應訊息'),
});

// ============================================================================
// 驗證相關 Schema
// ============================================================================

/** 答案驗證結果 Schema */
export const AnswerValidationResultSchema = z.object({
  isValid: z.boolean().describe('答案是否有效'),
  errors: z.array(z.string()).describe('錯誤訊息列表'),
  warnings: z.array(z.string()).describe('警告訊息列表'),
});

/** 問卷回應驗證結果 Schema */
export const ResponseValidationResultSchema = z.object({
  isValid: z.boolean().describe('整體是否有效'),
  questionResults: z.record(z.string(), AnswerValidationResultSchema).describe('各題目驗證結果'),
  globalErrors: z.array(z.string()).describe('整體錯誤訊息'),
});

/** 重複提交檢查結果 Schema */
export const DuplicateCheckResultSchema = z.object({
  isDuplicate: z.boolean().describe('是否為重複提交'),
  existingResponseId: z.string().optional().describe('現有回應 ID'),
  checkCriteria: z
    .object({
      ipMatch: z.boolean().optional().describe('IP 地址是否匹配'),
      userAgentMatch: z.boolean().optional().describe('用戶代理是否匹配'),
      answerSimilarity: z.number().min(0).max(1).optional().describe('答案相似度'),
      timeInterval: z.number().min(0).optional().describe('時間間隔（分鐘）'),
    })
    .describe('檢查依據'),
});

// ============================================================================
// 統計相關 Schema
// ============================================================================

/** 問卷統計資料 Schema */
export const SurveyStatisticsSchema = z.object({
  surveyId: z.string().min(1, '問卷 ID 不能為空'),
  totalResponses: z.number().min(0).describe('總回應數'),
  completedResponses: z.number().min(0).describe('完成回應數'),
  draftResponses: z.number().min(0).describe('草稿回應數'),
  averageCompletionTime: z.number().min(0).describe('平均完成時間（秒）'),
  lastUpdated: z.coerce.date().describe('最後更新時間'),
});

/** 題目統計資料 Schema */
export const QuestionStatisticsSchema = z.object({
  questionId: z.string().min(1, '題目 ID 不能為空'),
  questionType: z.string().min(1, '題目類型不能為空'),
  responseCount: z.number().min(0).describe('回應總數'),
  skipCount: z.number().min(0).describe('跳過總數'),
  responseRate: z.number().min(0).max(1).describe('回應率'),
  stats: z.any().describe('具體統計資料'),
});

// ============================================================================
// 特殊驗證函數
// ============================================================================

/**
 * 驗證答案格式是否符合題目類型
 */
export const validateAnswerByQuestionType = (questionType: string, value: any): boolean => {
  switch (questionType) {
    case 'text_short':
    case 'text_long':
      return typeof value === 'string';

    case 'single_choice':
      return typeof value === 'string';

    case 'multiple_choice':
      return Array.isArray(value) && value.every(v => typeof v === 'string');

    case 'rating':
      return typeof value === 'number' && value >= 1 && value <= 10;

    case 'number':
      return typeof value === 'number' && !isNaN(value);

    case 'email':
      return typeof value === 'string' && z.string().email().safeParse(value).success;

    case 'url':
      return typeof value === 'string' && z.string().url().safeParse(value).success;

    case 'date':
      return value instanceof Date || !isNaN(Date.parse(value));

    default:
      // 未知題型，暫時接受任何值
      return true;
  }
};

/**
 * 建立動態答案驗證 Schema
 */
export const createAnswerValidationSchema = (questionType: string, required: boolean = false) => {
  let baseSchema: z.ZodSchema;

  switch (questionType) {
    case 'text_short':
    case 'text_long':
      baseSchema = z.string();
      break;

    case 'single_choice':
      baseSchema = z.string().min(1, '請選擇一個選項');
      break;

    case 'multiple_choice':
      baseSchema = z.array(z.string()).min(1, '請至少選擇一個選項');
      break;

    case 'rating':
      baseSchema = z.number().min(1, '評分不能小於 1').max(10, '評分不能大於 10');
      break;

    case 'number':
      baseSchema = z.number();
      break;

    case 'email':
      baseSchema = z.string().email('請輸入有效的電子郵件地址');
      break;

    case 'url':
      baseSchema = z.string().url('請輸入有效的網址');
      break;

    case 'date':
      baseSchema = z.coerce.date();
      break;

    default:
      baseSchema = z.any();
      break;
  }

  return required ? baseSchema : baseSchema.optional();
};

// ============================================================================
// 匯出說明
// ============================================================================
// 所有 Schema 已在定義時直接 export，此處不需要重複匯出
