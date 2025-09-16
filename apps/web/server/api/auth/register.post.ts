/**
 * 用戶註冊 API - 模板版本
 * 處理新用戶註冊，包含資料驗證、密碼加密、預設群組建立
 */

import { z } from 'zod';

// 註冊請求驗證 schema
const RegisterRequestSchema = z.object({
  email: z.string().email('請提供有效的 email 地址'),
  password: z.string().min(8, '密碼長度至少 8 字元'),
  name: z.string().min(1, '姓名不能為空').max(100, '姓名長度不能超過 100 字元'),
  acceptTerms: z.boolean().refine(val => val === true, '必須同意服務條款'),
});

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'POST');

    const body = await readBody(event);

    // 1. 驗證輸入資料
    const validationResult = RegisterRequestSchema.safeParse(body);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '輸入資料格式錯誤',
        data: validationResult.error.flatten(),
      });
    }

    // TODO(human): 實作完整註冊邏輯
    // 以下功能需要依序實作：

    // 2. Email 唯一性檢查
    // 學習重點：MongoDB 大小寫不敏感查詢
    // 提示：使用 $regex 和 'i' flag

    // 3. 密碼加密
    // 學習重點：bcrypt saltRounds 選擇
    // 提示：使用 hashPassword 工具函數

    // 4. 建立用戶記錄
    // 學習重點：User Schema 的必要欄位
    // 提示：設定預設值和時間戳

    // 5. 建立預設個人群組
    // 學習重點：Group-based 訂閱架構
    // 提示：subscriptionTier 設為 'free'

    // 6. 建立用戶-群組關聯
    // 學習重點：RBAC 角色系統
    // 提示：roleId 設為 'owner'

    // 7. 生成 JWT tokens
    // 學習重點：Access vs Refresh token 差異
    // 提示：使用 JWT 工具函數

    // 8. 回傳安全的用戶資訊
    // 學習重點：避免敏感資料洩露
    // 提示：不要回傳密碼或內部 ID

    // 暫時回傳開發中訊息
    throw createError({
      statusCode: 501,
      statusMessage: '註冊功能開發中 - 請按順序實作上述 TODO 項目',
    });
  } catch (error: any) {
    console.error('註冊 API 錯誤:', error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
