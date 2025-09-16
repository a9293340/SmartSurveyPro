/**
 * 獲取當前用戶資訊 API - 模板版本
 * 透過 JWT token 驗證身份並回傳用戶資料
 */

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'GET');

    // TODO(human): 實作用戶資訊查詢功能
    // 以下功能需要實作：

    // 1. 從 Authorization header 提取 JWT token
    // 學習重點：Bearef token 格式處理
    // 提示：使用 getHeader 和 extractTokenFromHeader

    // 2. 驗證 JWT token 有效性
    // 學習重點：JWT 簽名驗證、過期檢查
    // 提示：使用 verifyAccessToken 工具函數

    // 3. 查詢用戶記錄
    // 學習重點：MongoDB ObjectId 轉換、用戶狀態檢查
    // 提示：檢查 isActive 狀態

    // 4. 回傳安全的用戶資訊
    // 學習重點：資料過濾、隱私保護
    // 提示：排除 passwordHash 等敵感欄位

    throw createError({
      statusCode: 501,
      statusMessage: '獲取用戶資訊功能開發中 - 請實作上述 TODO 項目',
    });
  } catch (error: any) {
    console.error('獲取用戶資訊失敗:', error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
