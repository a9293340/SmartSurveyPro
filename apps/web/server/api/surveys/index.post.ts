/**
 * 建立新問卷 API
 * POST /api/surveys
 *
 * 功能：
 * 1. 驗證用戶身份
 * 2. 檢查訂閱限制
 * 3. 驗證請求資料
 * 4. 建立問卷記錄
 * 5. 回傳問卷 ID 和基本資訊
 */

import { z } from 'zod';
import type { Survey, Question } from '@smartsurvey/shared';
import { SurveyStatus, SurveyType, SurveyVisibility } from '@smartsurvey/shared';
import { requireAuth } from '../../middleware/auth';
import { connectToDatabase } from '@smartsurvey/shared/server';
import { ObjectId } from 'mongodb';

// 建立問卷請求 Schema
const createSurveyRequestSchema = z.object({
  title: z.string().min(1, '問卷標題不能為空').max(200, '問卷標題不能超過 200 字'),
  description: z.string().max(1000, '問卷描述不能超過 1000 字').optional(),
  type: z.nativeEnum(SurveyType).optional().default(SurveyType.STANDARD),
  workspaceId: z.string().optional(),
  questions: z.array(z.any()).optional().default([]),
});

export default defineEventHandler(async event => {
  try {
    // 1. 驗證用戶身份
    const user = requireAuth(event);

    // 2. 解析請求資料
    const body = await readBody(event);
    const validatedData = createSurveyRequestSchema.parse(body);

    // TODO(feature): 真實訂閱限制檢查 - 整合付費方案限制 (Phase 3)
    // TODO(feature): 問卷範本系統 - 從範本建立問卷 (Phase 2)
    // TODO(feature): 工作區驗證 - 檢查工作區權限和存在性 (Phase 3)
    // TODO(feature): 問卷標籤支援 - 建立時設置分類標籤 (Phase 2)

    // 3. 連接資料庫（提前連接以進行檢查）
    const db = await connectToDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    // 4. 檢查用戶問卷數量限制（提前檢查，避免無謂的物件建立）
    const userSurveyCount = await surveysCollection.countDocuments({
      ownerId: user.userId,
      status: { $ne: SurveyStatus.ARCHIVED },
    });

    // Free 方案限制 3 個問卷
    const maxSurveys = 3;
    if (userSurveyCount >= maxSurveys) {
      throw createError({
        statusCode: 403,
        statusMessage: `您的方案最多只能建立 ${maxSurveys} 個問卷，請升級方案或刪除舊問卷`,
      });
    }

    // 5. 所有驗證通過後，才建立問卷物件
    const now = new Date();
    const newSurvey: Omit<Survey, '_id'> = {
      title: validatedData.title,
      description: validatedData.description || '',
      type: validatedData.type,
      status: SurveyStatus.DRAFT,
      ownerId: user.userId,
      workspaceId: validatedData.workspaceId || user.userId, // 預設使用 userId 作為 workspace
      questions: validatedData.questions as Question[],

      // 預設發布設定
      publishSettings: {
        visibility: SurveyVisibility.PRIVATE,
        allowAnonymous: true,
        allowMultipleResponses: false,
      },

      // 預設外觀
      appearance: {
        primaryColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
        fontFamily: 'system-ui',
      },

      // 初始統計資料
      stats: {
        totalResponses: 0,
        completedResponses: 0,
        avgCompletionTime: 0,
        abandonmentRate: 0,
      },

      // 完成訊息
      completionMessage: '感謝您填寫本問卷！',

      // 基礎設定
      settings: {
        allowAnonymous: true,
        collectIP: false,
        allowMultipleSubmissions: false,
      },

      // 時間戳記
      createdAt: now,
      updatedAt: now,
    };

    // 6. 插入資料庫（使用已連接的 collection）
    const result = await surveysCollection.insertOne({
      _id: new ObjectId().toString(),
      ...newSurvey,
    });

    if (!result.insertedId) {
      throw createError({
        statusCode: 500,
        statusMessage: '建立問卷失敗，請稍後再試',
      });
    }

    // 7. 建立回應物件
    const createdSurvey: Survey = {
      _id: result.insertedId.toString(),
      ...newSurvey,
    };

    // 8. 回傳成功結果
    return {
      success: true,
      data: {
        _id: createdSurvey._id,
        title: createdSurvey.title,
        description: createdSurvey.description,
        type: createdSurvey.type,
        status: createdSurvey.status,
        createdAt: createdSurvey.createdAt,
      },
      message: '問卷建立成功',
    };
  } catch (error) {
    console.error('[CreateSurvey] 建立問卷時發生錯誤:', error);

    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: firstError?.message || '請求資料格式錯誤',
        data: { field: firstError?.path?.join('.') || 'unknown' },
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
