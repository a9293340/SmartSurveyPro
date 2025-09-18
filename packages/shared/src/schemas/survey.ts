/**
 * 問卷系統 Zod 驗證 Schema
 * 定義問卷相關資料的驗證規則
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { SurveyStatus, SurveyType, SurveyVisibility } from '../types/survey';

// ============================================================================
// 基礎驗證 Schema
// ============================================================================

/** ObjectId 驗證 Schema */
export const ObjectIdSchema = z
  .string()
  .refine(value => ObjectId.isValid(value), { message: '無效的 ObjectId 格式' });

/** 問卷狀態驗證 */
export const SurveyStatusSchema = z.nativeEnum(SurveyStatus, {
  errorMap: () => ({ message: '無效的問卷狀態' }),
});

/** 問卷類型驗證 */
export const SurveyTypeSchema = z.nativeEnum(SurveyType, {
  errorMap: () => ({ message: '無效的問卷類型' }),
});

/** 問卷可見性驗證 */
export const SurveyVisibilitySchema = z.nativeEnum(SurveyVisibility, {
  errorMap: () => ({ message: '無效的問卷可見性設定' }),
});

// ============================================================================
// 問卷設定相關 Schema
// ============================================================================

/** 問卷發布設定驗證 */
export const SurveyPublishSettingsSchema = z
  .object({
    visibility: SurveyVisibilitySchema,
    password: z.string().min(1, '密碼不能為空').optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    responseLimit: z.number().int().min(1, '回應限制必須大於 0').optional(),
    allowAnonymous: z.boolean().default(true),
    allowMultipleResponses: z.boolean().default(false),
    redirectUrl: z.string().url('無效的 URL 格式').optional(),
    thankYouMessage: z.string().max(500, '感謝訊息不能超過 500 字元').optional(),
  })
  .refine(
    data => {
      // 如果設定了密碼保護，必須提供密碼
      if (data.visibility === SurveyVisibility.PASSWORD && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: '設定密碼保護時必須提供密碼',
      path: ['password'],
    }
  )
  .refine(
    data => {
      // 開始時間必須早於結束時間
      if (data.startDate && data.endDate && data.startDate >= data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: '開始時間必須早於結束時間',
      path: ['endDate'],
    }
  );

/** 問卷外觀設定驗證 */
export const SurveyAppearanceSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '無效的顏色格式'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '無效的顏色格式'),
  coverImageUrl: z.string().url('無效的圖片 URL').optional(),
  customCss: z.string().max(5000, '自訂 CSS 不能超過 5000 字元').optional(),
  fontFamily: z.string().max(50, '字體名稱不能超過 50 字元').optional(),
});

/** 問卷統計資料驗證 */
export const SurveyStatsSchema = z.object({
  totalResponses: z.number().int().min(0, '回應數不能為負數').default(0),
  completedResponses: z.number().int().min(0, '完成回應數不能為負數').default(0),
  avgCompletionTime: z.number().min(0, '平均完成時間不能為負數').optional(),
  abandonmentRate: z.number().min(0).max(1, '放棄率必須在 0-1 之間').optional(),
  lastResponseAt: z.date().optional(),
});

// ============================================================================
// 問卷主要 Schema
// ============================================================================

/** 問卷建立請求驗證 */
export const CreateSurveySchema = z.object({
  title: z.string().min(1, '問卷標題不能為空').max(200, '問卷標題不能超過 200 字元').trim(),

  description: z.string().max(1000, '問卷描述不能超過 1000 字元').trim().optional(),

  type: SurveyTypeSchema.default(SurveyType.STANDARD),

  workspaceId: ObjectIdSchema,

  publishSettings: SurveyPublishSettingsSchema.optional(),

  appearance: SurveyAppearanceSchema.optional(),
});

/** 問卷更新請求驗證 */
export const UpdateSurveySchema = z.object({
  title: z
    .string()
    .min(1, '問卷標題不能為空')
    .max(200, '問卷標題不能超過 200 字元')
    .trim()
    .optional(),

  description: z.string().max(1000, '問卷描述不能超過 1000 字元').trim().optional(),

  type: SurveyTypeSchema.optional(),

  publishSettings: SurveyPublishSettingsSchema.optional(),

  appearance: SurveyAppearanceSchema.optional(),
});

/** 問卷發布請求驗證 */
export const PublishSurveySchema = z
  .object({
    publishSettings: SurveyPublishSettingsSchema,
  })
  .refine(
    data => {
      // 發布時必須有完整的發布設定
      return data.publishSettings !== undefined;
    },
    {
      message: '發布問卷時必須提供完整的發布設定',
    }
  );

/** 問卷查詢參數驗證 */
export const SurveyQuerySchema = z.object({
  workspaceId: ObjectIdSchema.optional(),
  status: SurveyStatusSchema.optional(),
  type: SurveyTypeSchema.optional(),
  page: z.coerce.number().int().min(1, '頁碼必須大於 0').default(1),
  limit: z.coerce.number().int().min(1).max(100, '每頁數量不能超過 100').default(20),
  search: z.string().max(100, '搜尋關鍵字不能超過 100 字元').optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'publishedAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// 問卷建構器相關 Schema
// ============================================================================

/** 問卷建構器狀態驗證 */
export const SurveyBuilderStateSchema = z.object({
  currentSurvey: z.any().nullable(), // Survey Schema 會在完整定義後更新
  selectedQuestionId: z.string().nullable(),
  isPreviewMode: z.boolean().default(false),
  hasUnsavedChanges: z.boolean().default(false),
  dragState: z
    .object({
      isDragging: z.boolean().default(false),
      draggedQuestionType: z.string().optional(),
      dropZoneIndex: z.number().int().min(0).optional(),
    })
    .default({}),
});

// ============================================================================
// 匯出型別推斷
// ============================================================================

/** 從 Schema 推斷出的型別 */
export type CreateSurveyRequest = z.infer<typeof CreateSurveySchema>;
export type UpdateSurveyRequest = z.infer<typeof UpdateSurveySchema>;
export type PublishSurveyRequest = z.infer<typeof PublishSurveySchema>;
export type SurveyQuery = z.infer<typeof SurveyQuerySchema>;
export type SurveyBuilderStateData = z.infer<typeof SurveyBuilderStateSchema>;

// ============================================================================
// 便利驗證函數
// ============================================================================

/** 驗證問卷建立請求 */
export function validateCreateSurveyRequest(data: unknown): CreateSurveyRequest {
  return CreateSurveySchema.parse(data);
}

/** 驗證問卷更新請求 */
export function validateUpdateSurveyRequest(data: unknown): UpdateSurveyRequest {
  return UpdateSurveySchema.parse(data);
}

/** 驗證問卷發布請求 */
export function validatePublishSurveyRequest(data: unknown): PublishSurveyRequest {
  return PublishSurveySchema.parse(data);
}

/** 驗證問卷查詢參數 */
export function validateSurveyQuery(data: unknown): SurveyQuery {
  return SurveyQuerySchema.parse(data);
}

/** 安全解析 - 不拋出錯誤，返回結果物件 */
export function safeParseCreateSurveyRequest(data: unknown) {
  return CreateSurveySchema.safeParse(data);
}

export function safeParseUpdateSurveyRequest(data: unknown) {
  return UpdateSurveySchema.safeParse(data);
}

export function safeParsePublishSurveyRequest(data: unknown) {
  return PublishSurveySchema.safeParse(data);
}

export function safeParseSurveyQuery(data: unknown) {
  return SurveyQuerySchema.safeParse(data);
}
