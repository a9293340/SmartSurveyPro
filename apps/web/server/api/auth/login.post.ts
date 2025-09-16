/**
 * 用戶登入 API - 模板版本
 * 處理用戶登入驗證，生成 JWT tokens
 */

import { z } from 'zod';

// 登入請求驗證 schema
const LoginRequestSchema = z.object({
  email: z.string().email('請提供有效的 email 地址'),
  password: z.string().min(1, '密碼不能為空'),
  rememberMe: z.boolean().optional().default(false),
});

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'POST');

    const body = await readBody(event);

    // 1. 驗證輸入資料
    const validationResult = LoginRequestSchema.safeParse(body);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '輸入資料格式錯誤',
        data: validationResult.error.flatten(),
      });
    }

    // TODO(human): 實作完整登入邏輯
    // 以下功能需要依序實作：

    // 2. 查詢用戶記錄
    // 學習重點：MongoDB 條件查詢、索引優化
    // 提示：檢查 email 和 isActive 狀態

    // 3. 密碼驗證
    // 學習重點：bcrypt 比對原理
    // 提示：使用 verifyPassword 工具函數

    // 4. 檢查用戶狀態
    // 學習重點：用戶狀態管理（驗證、封鎖等）
    // 提示：isVerified, isActive 檢查

    // 5. 更新最後登入時間
    // 學習重點：MongoDB updateOne 操作
    // 提示：lastLoginAt, updatedAt 欄位

    // 6. 生成 JWT tokens
    // 學習重點：Payload 設計、過期時間設定
    // 提示：rememberMe 影響 token 壽命

    // 7. 查詢用戶群組資訊
    // 學習重點：MongoDB aggregation pipeline
    // 提示：用戶所屬的 active 群組

    // 8. 回傳安全的用戶資訊
    // 學習重點：資料過濾、隱私保護
    // 提示：排除敏感欄位

    throw createError({
      statusCode: 501,
      statusMessage: '登入功能開發中 - 請按順序實作上述 TODO 項目',
    });
  } catch (error: any) {
    console.error('登入 API 錯誤:', error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
