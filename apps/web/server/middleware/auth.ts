/**
 * 認證中間件
 * 負責驗證 JWT Token 並將用戶資訊注入 context
 */
import type { H3Event } from 'h3';
import { extractTokenFromHeader, verifyAccessToken } from '../utils/jwt';

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
  '/api/surveys', // 暫時開放問卷相關路徑用於測試
];

/**
 * 判斷路徑是否需要認證
 */
function isProtectedPath(path: string): boolean {
  // 移除查詢參數，只檢查路徑本身
  const [pathname] = path.split('?');
  if (!pathname) return false; // 如果沒有路徑，視為不受保護

  // 檢查是否為公開路徑（精確匹配或前綴匹配）
  if (PUBLIC_PATHS.includes(pathname)) {
    return false;
  }

  // 檢查是否匹配帶有子路徑的公開路徑
  if (PUBLIC_PATHS.some(path => pathname.startsWith(`${path}/`))) {
    return false;
  }

  // 檢查是否為 API 路徑（需要保護）
  if (pathname.startsWith('/api/')) {
    return true;
  }

  // 其他路徑不需要認證（如靜態資源、頁面路由）
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

    // 2. 驗證 token 並取得 payload
    const payload = verifyAccessToken(token);

    if (!payload) {
      // token 無效或過期
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid or expired token',
      });
    }

    // 3. 檢查 token 是否即將過期（剩餘不到 5 分鐘）
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = (payload.exp || 0) - currentTime;

    if (timeUntilExpiry < 300) {
      // 5 分鐘 = 300 秒
      // 設定響應標頭提醒客戶端 token 即將過期
      setHeader(event, 'X-Token-Expires-Soon', 'true');
      setHeader(event, 'X-Token-Expires-In', timeUntilExpiry.toString());
    }

    // 4. 將用戶資訊注入 context
    event.context.user = {
      userId: payload.userId,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
    };

    // Phase 2 將實作額外的安全檢查：
    // - 檢查用戶是否存在於資料庫
    // - 檢查用戶是否被禁用
    // - 檢查 token 是否在黑名單中（登出後的 token）
    // - 記錄可疑的訪問行為
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
 * 輔助函數：檢查用戶權限（Phase 1 基礎版本）
 * Phase 2 將實作完整的 RBAC 系統
 */
export function hasPermission(event: H3Event, _permission: string): boolean {
  const user = getUser(event);
  if (!user) {
    return false;
  }

  // Phase 1: 所有已認證用戶都有基礎權限
  // Phase 2 將實作：
  // - 從資料庫載入用戶角色和權限
  // - RBAC (Role-Based Access Control)
  // - 權限繼承（Admin 包含 Editor 權限）
  // - 權限快取以提升效能
  // - 資源級權限（如特定問卷的編輯權限）
  return true;
}

/**
 * 輔助函數：檢查管理員權限（Phase 1 基礎版本）
 * Phase 2 將實作角色驗證
 */
export function requireAdmin(event: H3Event) {
  const user = requireAuth(event);

  // Phase 1: 暫時允許所有認證用戶
  // Phase 2 將實作：
  // - 檢查用戶角色是否為 admin 或 owner
  // - 從資料庫載入用戶角色資訊
  // - 支援組織層級的管理員權限
  return user;
}
