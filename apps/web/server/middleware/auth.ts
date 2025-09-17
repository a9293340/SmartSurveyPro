/**
 * 認證中間件
 * 負責驗證 JWT Token 並將用戶資訊注入 context
 */
import type { H3Event } from 'h3';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { env } from '../utils/env-manager';

// 擴展 H3Event 的 context 類型
declare module 'h3' {
  interface H3EventContext {
    user?: {
      userId: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  }
}

/**
 * 不需要認證的路徑白名單
 * 這些路徑可以匿名訪問
 */
const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/health',
  '/api/version',
];

/**
 * 判斷路徑是否需要認證
 * TODO(human): 實作路徑匹配邏輯
 */
function isProtectedPath(path: string): boolean {
  // TODO(human): 實作路徑匹配邏輯
  // 學習重點：
  // - 使用 startsWith 檢查路徑前綴
  // - 處理動態路由（如 /api/surveys/:id）
  // - 考慮正則表達式匹配

  // 檢查是否為公開路徑
  if (PUBLIC_PATHS.includes(path)) {
    return false;
  }

  // 檢查是否為 API 路徑（需要保護）
  if (path.startsWith('/api/')) {
    return true;
  }

  // 其他路徑不需要認證（如靜態資源）
  return false;
}

/**
 * 認證中間件主函數
 * 在每個請求前執行，驗證用戶身份
 */
export default defineEventHandler(async (event: H3Event) => {
  const path = event.node.req.url || '';

  // 跳過不需要認證的路徑
  if (!isProtectedPath(path)) {
    return;
  }

  try {
    // TODO(human): 實作 token 提取和驗證
    // 學習重點：
    // - 從 header 提取 token
    // - 使用 jwt.ts 的驗證函數
    // - 處理驗證失敗的情況

    // 1. 從請求頭提取 token
    const authHeader = getHeader(event, 'authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // 沒有提供 token
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No token provided',
      });
    }

    // 2. 驗證 token
    const payload = verifyAccessToken(token);

    if (!payload) {
      // token 無效或過期
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid or expired token',
      });
    }

    // 3. 將用戶資訊注入 context
    event.context.user = {
      userId: payload.userId,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
    };

    // TODO(human): 實作額外的安全檢查
    // 學習重點：
    // - 檢查用戶是否存在於資料庫
    // - 檢查用戶是否被禁用
    // - 記錄訪問日誌
  } catch (error) {
    // 處理認證錯誤
    if (error instanceof Error && 'statusCode' in error) {
      // 已經是 H3Error，直接拋出
      throw error;
    }

    // 其他錯誤，統一返回 401
    console.error('認證中間件錯誤:', error);
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
});

/**
 * 輔助函數：要求必須認證
 * 在 API 路由中使用，確保用戶已登入
 */
export function requireAuth(event: H3Event) {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    });
  }
  return event.context.user;
}

/**
 * 輔助函數：獲取當前用戶（可選）
 * 在 API 路由中使用，獲取用戶資訊（如果有）
 */
export function getUser(event: H3Event) {
  return event.context.user || null;
}

/**
 * 輔助函數：檢查用戶權限
 * TODO(human): 實作權限檢查邏輯
 */
export function hasPermission(event: H3Event, permission: string): boolean {
  const user = getUser(event);
  if (!user) {
    return false;
  }

  // TODO(human): 實作權限檢查
  // 學習重點：
  // - 從資料庫載入用戶權限
  // - 實作角色-權限映射
  // - 快取權限資料

  return true; // 暫時返回 true
}
