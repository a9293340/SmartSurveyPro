/**
 * 取得單一問卷 API
 * GET /api/surveys/[id]
 *
 * 功能：
 * 1. 查詢特定問卷的完整資訊
 * 2. 驗證用戶權限（只能查詢自己的問卷）
 * 3. 回傳完整的問卷物件（包含所有題目）
 * 4. 用於問卷編輯器的資料載入
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import type { Survey } from '@smartsurvey/shared';
import { requireAuth, getUser } from '../../middleware/auth';
import { connectToDatabase } from '@smartsurvey/shared/server';

// 路徑參數驗證 Schema
const paramsSchema = z.object({
  id: z.string().min(1, '問卷ID不能為空'),
});

export default defineEventHandler(async event => {
  try {
    // 1. 獲取用戶身份（可選，用於判斷權限模式）
    const user = getUser(event);

    // 2. 驗證路徑參數
    const surveyId = getRouterParam(event, 'id');
    const validatedParams = paramsSchema.parse({ id: surveyId });

    // TODO(feature): Redis 快取支援 - 問卷內容版本化快取 (Phase 2)
    // TODO(feature): 協作權限檢查 - 支援 workspace 成員讀取權限 (Phase 3)
    // TODO(feature): 問卷版本歷史 - 查詢特定版本的問卷 (Phase 2)

    // 3. 連接資料庫並查詢問卷資料
    const db = await connectToDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    let survey: Survey | null;

    // 將字串 ID 轉換為 ObjectId
    const objectId = new ObjectId(validatedParams.id);

    if (user) {
      // 已認證用戶：可以查詢自己的所有問卷（包含草稿）
      survey = await surveysCollection.findOne({
        _id: objectId,
        ownerId: new ObjectId(user.userId), // 確保用戶只能查詢自己的問卷
      } as any);
    } else {
      // 匿名用戶：只能查詢已發布的公開問卷
      survey = await surveysCollection.findOne({
        _id: objectId,
        status: 'published', // 只允許查詢已發布的問卷
      } as any);
    }

    // 4. 檢查問卷是否存在
    if (!survey) {
      throw createError({
        statusCode: 404,
        statusMessage: user ? '問卷不存在或無權限查詢' : '問卷不存在或尚未發布',
      });
    }

    // 5. 返回完整問卷資料
    return {
      success: true,
      data: survey,
    };
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: '請求參數格式錯誤',
        data: error.errors[0],
      });
    }

    // 其他已知錯誤
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // 未知錯誤
    console.error('查詢問卷失敗:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
