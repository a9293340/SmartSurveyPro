/**
 * 請求日誌中間件
 * 記錄所有 API 請求的詳細資訊
 * 檔名前綴 01 確保在 CORS 後、認證前執行
 */
import type { H3Event } from 'h3';
import { getClientIP } from '../utils/client-ip';

/**
 * 格式化請求資訊
 */
function formatRequest(event: H3Event, responseTime: number, statusCode: number) {
  const method = event.node.req.method || '';
  const url = event.node.req.url || '';
  const ip = getClientIP(event);
  const userAgent = getHeader(event, 'user-agent') || 'unknown';
  const userId = event.context.user?.userId || 'anonymous';

  // 解析請求路徑和查詢參數
  const [pathname, queryString] = url.split('?');

  // 取得請求 ID（用於追蹤請求鏈路）
  const requestId = getHeader(event, 'x-request-id') || crypto.randomUUID();

  // 取得請求來源
  const referer = getHeader(event, 'referer') || 'direct';

  return {
    timestamp: new Date().toISOString(),
    requestId,
    method,
    pathname,
    queryString: queryString || '',
    statusCode,
    responseTime: `${responseTime}ms`,
    ip,
    userAgent,
    referer,
    userId,
  };
}

/**
 * 格式化日誌輸出
 */
function formatLogMessage(logData: any): string {
  const { method, pathname, statusCode, responseTime, userId } = logData;
  return `${method} ${pathname} ${statusCode} ${responseTime} [${userId}]`;
}

/**
 * 判斷是否需要記錄請求體
 */
function shouldLogRequestBody(method: string, pathname: string): boolean {
  // 敏感路徑不記錄請求體
  const sensitiveRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/change-password'];
  if (sensitiveRoutes.includes(pathname)) {
    return false;
  }

  // 只記錄 POST/PUT/PATCH 請求的 body
  return ['POST', 'PUT', 'PATCH'].includes(method);
}

export default defineEventHandler(async (event: H3Event) => {
  // 只記錄 API 請求
  const path = event.node.req.url || '';
  if (!path.startsWith('/api/')) {
    return;
  }

  // 記錄請求開始時間
  const startTime = Date.now();

  // 生成或取得請求 ID
  const requestId = getHeader(event, 'x-request-id') || crypto.randomUUID();

  // 設定請求 ID 到響應標頭（方便客戶端追蹤）
  setHeader(event, 'X-Request-Id', requestId);

  // 將請求 ID 存入 context，供其他中間件使用
  event.context.requestId = requestId;

  // 記錄請求體（如果需要）
  let requestBody: any = null;
  const method = event.node.req.method || '';
  const [pathname] = path.split('?');

  if (shouldLogRequestBody(method, pathname)) {
    try {
      requestBody = await readBody(event);
      // 遮蔽敏感欄位
      if (requestBody?.password) requestBody.password = '[REDACTED]';
      if (requestBody?.token) requestBody.token = '[REDACTED]';
      if (requestBody?.apiKey) requestBody.apiKey = '[REDACTED]';
    } catch {
      // 忽略解析錯誤
    }
  }

  // 監聽響應結束事件
  event.node.res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const statusCode = event.node.res.statusCode;

    const logData = formatRequest(event, responseTime, statusCode);
    const logMessage = formatLogMessage(logData);

    // 根據狀態碼決定日誌級別
    if (statusCode >= 500) {
      console.error(`🔴 [ERROR] ${logMessage}`, {
        ...logData,
        requestBody,
        stack: event.context.error?.stack,
      });
    } else if (statusCode >= 400) {
      console.warn(`🟠 [WARN] ${logMessage}`, {
        ...logData,
        requestBody,
      });
    } else if (process.env.LOG_LEVEL === 'debug') {
      // 只在 debug 模式下記錄成功請求
      console.warn(`🟢 [INFO] ${logMessage}`, logData);
    }

    // 效能警告：響應時間超過 1 秒
    if (responseTime > 1000) {
      console.warn(`⚠️ [PERF] Slow API response: ${pathname} took ${responseTime}ms`);
    }

    // TODO(future): 專業日誌系統 [Phase 1 console 已足夠] [詳見 /docs/TODO.md]
    // 升級：Pino/Winston、結構化日誌、ELK Stack、APM 工具
  });
});
