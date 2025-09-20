/**
 * 更新問卷 API
 * PUT /api/surveys/[id]
 *
 * 功能：
 * 1. 驗證用戶身份和權限
 * 2. 支援部分更新（PATCH 語意）
 * 3. 智能狀態轉換管理
 * 4. 問卷完整性驗證
 * 5. 樂觀鎖定防止併發修改
 */

import { z } from 'zod';
import type { Survey, Question } from '@smartsurvey/shared';
import { SurveyStatus, SurveyType, SurveyVisibility } from '@smartsurvey/shared';
import { requireAuth } from '../../middleware/auth';
import { connectToDatabase } from '@smartsurvey/shared/server';

// 問卷更新請求 Schema（支援部分更新）
const updateSurveyRequestSchema = z.object({
  title: z.string().min(1, '問卷標題不能為空').max(200, '問卷標題不能超過 200 字').optional(),
  description: z.string().max(1000, '問卷描述不能超過 1000 字').optional(),
  type: z.nativeEnum(SurveyType).optional(),
  status: z.nativeEnum(SurveyStatus).optional(),
  questions: z.array(z.any()).optional(),
  publishSettings: z
    .object({
      visibility: z.nativeEnum(SurveyVisibility).optional(),
      password: z.string().optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      responseLimit: z.number().int().positive().optional(),
      allowAnonymous: z.boolean().optional(),
      allowMultipleResponses: z.boolean().optional(),
      redirectUrl: z.string().url().optional(),
      thankYouMessage: z.string().max(500).optional(),
    })
    .partial()
    .optional(),
  appearance: z
    .object({
      primaryColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, '主題色彩格式錯誤')
        .optional(),
      backgroundColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, '背景色彩格式錯誤')
        .optional(),
      coverImageUrl: z.string().url().optional(),
      customCss: z.string().max(5000).optional(),
      fontFamily: z.string().max(100).optional(),
    })
    .partial()
    .optional(),
  completionMessage: z.string().max(500).optional(),
  settings: z
    .object({
      allowAnonymous: z.boolean().optional(),
      collectIP: z.boolean().optional(),
      allowMultipleSubmissions: z.boolean().optional(),
    })
    .partial()
    .optional(),
  // 樂觀鎖定：前端傳送目前版本的 updatedAt
  lastModified: z.string().datetime().optional(),
});

// 路徑參數驗證
const paramsSchema = z.object({
  id: z.string().min(1, '問卷ID不能為空'),
});

export default defineEventHandler(async event => {
  try {
    // 1. 驗證用戶身份
    const user = requireAuth(event);

    // 2. 驗證路徑參數
    const surveyId = getRouterParam(event, 'id');
    const validatedParams = paramsSchema.parse({ id: surveyId });

    // 3. 解析請求資料
    const body = await readBody(event);
    const updateData = updateSurveyRequestSchema.parse(body);

    // 4. 檢查是否有更新內容
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '沒有提供要更新的資料',
      });
    }

    // TODO(feature): Redis 快取支援 - 問卷更新時自動清除相關快取 (Phase 2)
    // TODO(feature): 協作權限檢查 - 支援 workspace 成員編輯權限 (Phase 3)
    // TODO(feature): 版本控制系統 - 保存問卷修改歷史記錄 (Phase 2)
    // TODO(feature): 即時協作同步 - WebSocket 廣播問卷變更 (Phase 3)
    // TODO(feature): 高級狀態機 - 支援自訂狀態轉換和審核流程 (Phase 3)

    // 5. 連接資料庫
    const db = await connectToDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    // 6. 查詢當前問卷（用於權限檢查和樂觀鎖定）
    const currentSurvey = await surveysCollection.findOne({
      _id: validatedParams.id,
      ownerId: user.userId,
    });

    if (!currentSurvey) {
      throw createError({
        statusCode: 404,
        statusMessage: '問卷不存在或無權限修改',
      });
    }

    // 7. 樂觀鎖定檢查（防止併發修改）
    if (updateData.lastModified) {
      const providedTime = new Date(updateData.lastModified);
      const currentTime = new Date(currentSurvey.updatedAt);

      if (providedTime.getTime() !== currentTime.getTime()) {
        throw createError({
          statusCode: 409,
          statusMessage: '問卷已被其他用戶修改，請重新載入後再試',
          data: {
            currentUpdatedAt: currentSurvey.updatedAt,
            providedUpdatedAt: updateData.lastModified,
          },
        });
      }
    }

    // 8. 狀態轉換驗證
    if (updateData.status && updateData.status !== currentSurvey.status) {
      const isValidTransition = validateStatusTransition(currentSurvey.status, updateData.status);
      if (!isValidTransition) {
        throw createError({
          statusCode: 400,
          statusMessage: `不能從 ${currentSurvey.status} 狀態轉換到 ${updateData.status}`,
        });
      }

      // 發布時的額外驗證
      if (updateData.status === SurveyStatus.PUBLISHED) {
        const validationResult = validateSurveyForPublish(currentSurvey, updateData);
        if (!validationResult.isValid) {
          throw createError({
            statusCode: 400,
            statusMessage: '問卷尚未完成，無法發布',
            data: { errors: validationResult.errors },
          });
        }
      }
    }

    // 9. 處理發布設定的密碼驗證
    if (updateData.publishSettings?.visibility === SurveyVisibility.PASSWORD) {
      if (!updateData.publishSettings.password || updateData.publishSettings.password.length < 4) {
        throw createError({
          statusCode: 400,
          statusMessage: '密碼保護模式需要設定至少 4 位數的密碼',
        });
      }
    }

    // 10. 準備更新資料
    const now = new Date();

    // 處理巢狀物件的更新邏輯
    const updateFields: Record<string, any> = {
      updatedAt: now,
    };

    // 處理基本欄位
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.questions !== undefined) updateFields.questions = updateData.questions;
    if (updateData.completionMessage !== undefined) {
      updateFields.completionMessage = updateData.completionMessage;
    }

    // 處理巢狀物件更新（使用 MongoDB $set 操作符）
    if (updateData.publishSettings) {
      Object.entries(updateData.publishSettings).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields[`publishSettings.${key}`] = value;
        }
      });
    }

    if (updateData.appearance) {
      Object.entries(updateData.appearance).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields[`appearance.${key}`] = value;
        }
      });
    }

    if (updateData.settings) {
      Object.entries(updateData.settings).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields[`settings.${key}`] = value;
        }
      });
    }

    // 發布時設定發布時間
    if (
      updateData.status === SurveyStatus.PUBLISHED &&
      currentSurvey.status !== SurveyStatus.PUBLISHED
    ) {
      updateFields.publishedAt = now;
    }

    // 移除樂觀鎖定欄位（不需要儲存到資料庫）
    delete updateFields.lastModified;

    // 11. 執行更新
    const updateResult = await surveysCollection.updateOne(
      { _id: validatedParams.id },
      { $set: updateFields }
    );

    if (updateResult.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '問卷不存在',
      });
    }

    if (updateResult.modifiedCount === 0) {
      // 沒有實際修改（可能是相同資料）
      console.warn(`[UpdateSurvey] 問卷 ${validatedParams.id} 沒有實際修改`);
    }

    // 12. 查詢更新後的問卷
    const updatedSurvey = await surveysCollection.findOne({
      _id: validatedParams.id,
    });

    // 13. 記錄操作日誌
    console.warn(
      `[UpdateSurvey] 用戶 ${user.userId} 更新問卷 ${validatedParams.id}，狀態: ${currentSurvey.status} -> ${updateData.status || currentSurvey.status}`
    );

    // 14. 回傳更新結果
    return {
      success: true,
      data: updatedSurvey,
      message: '問卷更新成功',
      meta: {
        modifiedCount: updateResult.modifiedCount,
        statusChanged: updateData.status && updateData.status !== currentSurvey.status,
        publishedAt: updateFields.publishedAt,
      },
    };
  } catch (error) {
    console.error('[UpdateSurvey] 更新問卷時發生錯誤:', error);

    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: firstError?.message || '請求資料格式錯誤',
        data: {
          field: firstError?.path?.join('.') || 'unknown',
          errors: error.errors,
        },
      });
    }

    // 其他已知錯誤
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // 未知錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});

/**
 * 驗證問卷狀態轉換是否合法
 */
function validateStatusTransition(currentStatus: SurveyStatus, newStatus: SurveyStatus): boolean {
  // 定義合法的狀態轉換
  const validTransitions: Record<SurveyStatus, SurveyStatus[]> = {
    [SurveyStatus.DRAFT]: [SurveyStatus.PUBLISHED, SurveyStatus.ARCHIVED],
    [SurveyStatus.PUBLISHED]: [SurveyStatus.PAUSED, SurveyStatus.CLOSED],
    [SurveyStatus.PAUSED]: [SurveyStatus.PUBLISHED, SurveyStatus.CLOSED],
    [SurveyStatus.CLOSED]: [SurveyStatus.ARCHIVED],
    [SurveyStatus.ARCHIVED]: [], // 封存後不能轉換到其他狀態
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * 驗證問卷是否可以發布
 */
function validateSurveyForPublish(
  currentSurvey: Survey,
  updateData: any
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 檢查問卷標題
  const title = updateData.title || currentSurvey.title;
  if (!title || title.trim().length === 0) {
    errors.push('問卷標題不能為空');
  }

  // 檢查問卷題目
  const questions = updateData.questions || currentSurvey.questions;
  if (!questions || questions.length === 0) {
    errors.push('問卷至少需要包含一個題目');
  }

  // 檢查題目完整性
  if (questions && questions.length > 0) {
    questions.forEach((question: Question, index: number) => {
      if (!question.title || question.title.trim().length === 0) {
        errors.push(`第 ${index + 1} 個題目的標題不能為空`);
      }

      // 檢查選擇題的選項
      if (['single_choice', 'multiple_choice', 'dropdown'].includes(question.type)) {
        const options = (question.config as any)?.options;
        if (!options || options.length < 2) {
          errors.push(`第 ${index + 1} 個題目至少需要 2 個選項`);
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
