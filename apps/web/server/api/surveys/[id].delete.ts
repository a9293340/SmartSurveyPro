/**
 * DELETE /api/surveys/[id] - 刪除問卷 API
 *
 * 功能特色：
 * 1. 軟刪除（soft delete）- 將狀態改為 ARCHIVED，保留歷史資料
 * 2. 權限驗證 - 確保只有問卷擁有者能刪除
 * 3. 狀態檢查 - 只有 DRAFT 和 CLOSED 狀態的問卷可以刪除
 * 4. 統計更新 - 刪除時清空統計資料，保護隱私
 * 5. 樂觀鎖定 - 防止併發刪除衝突
 * 6. 完整錯誤處理 - 詳細的錯誤分類和訊息
 */

import { z } from 'zod';
import type { Survey } from '@smartsurvey/shared';
import { SurveyStatus } from '@smartsurvey/shared';
import { connectToDatabase } from '@smartsurvey/shared/server';

// 刪除請求驗證 schema
const DeleteSurveyRequestSchema = z.object({
  // 可選的最後修改時間，用於樂觀鎖定
  lastModified: z.string().datetime().optional(),
});

// 可刪除的狀態列表
const DELETABLE_STATUSES = [SurveyStatus.DRAFT, SurveyStatus.CLOSED];

// 路徑參數驗證
const paramsSchema = z.object({
  id: z.string().min(1, '問卷ID不能為空'),
});

export default defineEventHandler(async event => {
  try {
    // 限制只接受 DELETE 請求
    if (event.method !== 'DELETE') {
      throw createError({
        statusCode: 405,
        statusMessage: '方法不允許',
      });
    }

    // 1. 驗證用戶身份
    // TODO(future): 整合真實的身份驗證系統
    const mockUserId = getHeader(event, 'x-user-id') || 'user_1';
    if (!mockUserId) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授權：需要用戶登入',
      });
    }

    // 2. 驗證路徑參數
    const surveyId = getRouterParam(event, 'id');
    const validatedParams = paramsSchema.parse({ id: surveyId });

    // 3. 驗證請求主體（如果有的話）
    let requestData: z.infer<typeof DeleteSurveyRequestSchema> = {};
    try {
      const body = await readBody(event);
      if (body && Object.keys(body).length > 0) {
        requestData = DeleteSurveyRequestSchema.parse(body);
      }
    } catch (parseError) {
      throw createError({
        statusCode: 400,
        statusMessage: '請求資料格式錯誤',
      });
    }

    // TODO(feature): Redis 快取支援 - 問卷刪除時清除相關快取 (Phase 2)
    // TODO(feature): 真實硬刪除選項 - 提供完全刪除功能（管理員權限） (Phase 3)
    // TODO(feature): 批量刪除支援 - 支援一次刪除多個問卷 (Phase 2)
    // TODO(feature): 刪除確認機制 - 要求二次確認防止誤刪 (Phase 2)
    // TODO(feature): 垃圾桶功能 - 支援已刪除問卷恢復 (Phase 2)
    // TODO(feature): 協作權限檢查 - workspace 管理員可刪除成員問卷 (Phase 3)

    // 4. 連接資料庫
    const db = await connectToDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    // 5. 查詢並驗證問卷
    const currentSurvey = await surveysCollection.findOne({
      _id: validatedParams.id,
    });

    if (!currentSurvey) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到指定的問卷',
      });
    }

    // 6. 驗證權限：確保只有擁有者能刪除
    if (currentSurvey.ownerId !== mockUserId) {
      throw createError({
        statusCode: 403,
        statusMessage: '權限不足：您不是此問卷的擁有者',
      });
    }

    // 7. 驗證問卷狀態：只有特定狀態可以刪除
    if (!DELETABLE_STATUSES.includes(currentSurvey.status)) {
      const statusNames: Record<string, string> = {
        [SurveyStatus.PUBLISHED]: '已發布',
        [SurveyStatus.PAUSED]: '已暫停',
        [SurveyStatus.ARCHIVED]: '已封存',
      };

      const statusName = statusNames[currentSurvey.status] || '此狀態';
      throw createError({
        statusCode: 409,
        statusMessage: `無法刪除${statusName}的問卷，只能刪除草稿或已關閉的問卷`,
      });
    }

    // 8. 樂觀鎖定檢查
    if (requestData.lastModified) {
      const providedTime = new Date(requestData.lastModified);
      const currentTime = new Date(currentSurvey.updatedAt);

      if (Math.abs(providedTime.getTime() - currentTime.getTime()) > 1000) {
        throw createError({
          statusCode: 409,
          statusMessage: '問卷已被其他用戶修改，請重新載入後再試',
        });
      }
    }

    // 9. 執行軟刪除：將狀態改為 ARCHIVED
    const now = new Date();
    const updateResult = await surveysCollection.updateOne(
      { _id: validatedParams.id },
      {
        $set: {
          status: SurveyStatus.ARCHIVED,
          updatedAt: now,
          // 清空統計資料以保護隱私
          'stats.totalResponses': 0,
          'stats.completedResponses': 0,
          'stats.avgCompletionTime': undefined,
          'stats.abandonmentRate': undefined,
          'stats.lastResponseAt': undefined,
        },
      }
    );

    // 10. 檢查更新是否成功
    if (updateResult.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '問卷不存在或已被刪除',
      });
    }

    if (updateResult.modifiedCount === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: '刪除操作失敗',
      });
    }

    // 11. 查詢更新後的問卷（確保回傳最新狀態）
    const deletedSurvey = await surveysCollection.findOne({
      _id: validatedParams.id,
    });

    if (!deletedSurvey) {
      throw createError({
        statusCode: 500,
        statusMessage: '刪除操作異常',
      });
    }

    // 12. 記錄操作日誌
    console.warn(`問卷已刪除: ${validatedParams.id} by user ${mockUserId} at ${now.toISOString()}`);

    // 13. 回傳成功結果
    return {
      success: true,
      message: '問卷已成功刪除',
      data: {
        id: deletedSurvey._id,
        title: deletedSurvey.title,
        status: deletedSurvey.status,
        deletedAt: deletedSurvey.updatedAt,
        // 只回傳必要資訊，避免洩漏敏感資料
      },
    };
  } catch (error: unknown) {
    // 錯誤處理：區分不同類型的錯誤
    if (error && typeof error === 'object' && 'statusCode' in error) {
      // 已知的業務邏輯錯誤，直接拋出
      throw error;
    }

    // 記錄未預期的錯誤
    console.error('刪除問卷時發生未預期錯誤:', error);

    // 回傳通用錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
