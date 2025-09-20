/**
 * 取得問卷列表 API
 * GET /api/surveys
 *
 * 功能：
 * 1. 取得當前用戶的問卷列表
 * 2. 支援分頁、篩選、排序
 * 3. 支援關鍵字搜尋
 * 4. 回傳問卷摘要資訊
 */

import { z } from 'zod';
import type { Survey } from '@smartsurvey/shared';
import { SurveyStatus } from '@smartsurvey/shared';
import { requireAuth } from '../../middleware/auth';
import { connectToDatabase } from '@smartsurvey/shared/server';
import type { Filter } from 'mongodb';

// 查詢參數 Schema
const listSurveysQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => parseInt(val || '1', 10)),
  limit: z
    .string()
    .optional()
    .transform(val => parseInt(val || '20', 10)),
  status: z.string().optional(), // 多選用逗號分隔，如 "draft,published"
  search: z.string().optional(),
  sort: z.string().optional().default('-createdAt'), // 預設按建立時間降序
});

export default defineEventHandler(async event => {
  try {
    // 1. 驗證用戶身份
    const user = requireAuth(event);

    // 2. 解析查詢參數
    const query = getQuery(event);
    const params = listSurveysQuerySchema.parse(query);

    // 3. 驗證分頁參數
    const page = Math.max(1, params.page);
    const limit = Math.min(100, Math.max(1, params.limit)); // 限制最大 100 筆
    const skip = (page - 1) * limit;

    // 4. 建立查詢條件
    const filter: Filter<Survey> = {
      ownerId: user.userId, // 只查詢自己的問卷
    };

    // 4.1 狀態篩選
    if (params.status) {
      const statusList = params.status.split(',').map(s => s.trim());
      // 驗證狀態值是否合法
      const validStatuses = Object.values(SurveyStatus);
      const filteredStatuses = statusList.filter(s => validStatuses.includes(s as SurveyStatus));

      if (filteredStatuses.length > 0) {
        filter.status = { $in: filteredStatuses as SurveyStatus[] };
      }
    }

    // 4.2 關鍵字搜尋（標題或描述）
    if (params.search && params.search.trim()) {
      const searchRegex = new RegExp(params.search.trim(), 'i'); // 不區分大小寫
      filter.$or = [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
    }

    // 5. 建立排序條件
    const sort: Record<string, 1 | -1> = {};
    if (params.sort) {
      // 處理排序欄位和方向（-表示降序）
      const sortField = params.sort.startsWith('-') ? params.sort.substring(1) : params.sort;
      const sortDirection = params.sort.startsWith('-') ? -1 : 1;

      // 白名單驗證可排序欄位
      const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'status'];
      if (allowedSortFields.includes(sortField)) {
        sort[sortField] = sortDirection;
      } else {
        sort.createdAt = -1; // 預設排序
      }
    }

    // TODO(feature): Redis 快取支援 - 常用篩選結果快取 (Phase 2)
    // TODO(feature): 全文搜尋功能 - 支援問卷標題、描述搜尋 (Phase 2)
    // TODO(feature): 標籤系統 - 問卷分類標籤篩選 (Phase 2)
    // TODO(feature): 工作區篩選 - 支援多工作區問卷管理 (Phase 3)

    // 6. 連接資料庫
    const db = await connectToDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    // 7. 執行查詢（平行執行計數和資料查詢以提升效能）
    const [surveys, totalCount] = await Promise.all([
      surveysCollection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .project({
          // 只回傳必要欄位，減少網路傳輸
          _id: 1,
          title: 1,
          description: 1,
          type: 1,
          status: 1,
          questions: { $size: '$questions' }, // 只回傳題目數量
          stats: 1,
          createdAt: 1,
          updatedAt: 1,
          publishedAt: 1,
        })
        .toArray(),
      surveysCollection.countDocuments(filter),
    ]);

    // 8. 計算分頁資訊
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    // 9. 格式化回應資料
    const formattedSurveys = surveys.map(survey => ({
      _id: survey._id,
      title: survey.title,
      description: survey.description,
      type: survey.type,
      status: survey.status,
      questionCount: survey.questions as unknown as number, // 由 $size 產生的數字
      stats: {
        totalResponses: survey.stats?.totalResponses || 0,
        completedResponses: survey.stats?.completedResponses || 0,
        completionRate: survey.stats?.completionRate || 0,
      },
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      publishedAt: survey.publishedAt,
    }));

    // 10. 回傳結果
    return {
      success: true,
      data: formattedSurveys,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasMore,
      },
    };
  } catch (error) {
    console.error('[ListSurveys] 取得問卷列表時發生錯誤:', error);

    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: firstError?.message || '請求參數格式錯誤',
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
