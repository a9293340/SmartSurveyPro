/**
 * 請求日誌中間件
 * 記錄所有 API 請求的詳細資訊
 * 檔名前綴 01 確保在 CORS 後、認證前執行
 */
import type { H3Event } from 'h3';

/**
 * 取得客戶端 IP
 */
function getClientIP(event: H3Event): string {
  // 優先從代理標頭取得真實 IP
  const forwarded = getHeader(event, 'x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = getHeader(event, 'x-real-ip');
  if (realIP) {
    return realIP;
  }

  // 回退到直接連接的 IP
  return event.node.req.socket.remoteAddress || 'unknown';
}

/**
 * 格式化請求資訊
 */
function formatRequest(event: H3Event, responseTime: number, statusCode: number) {
  const method = event.node.req.method || '';
  const url = event.node.req.url || '';
  const ip = getClientIP(event);
  const userAgent = getHeader(event, 'user-agent') || 'unknown';
  const userId = event.context.user?.userId || 'anonymous';

  return {
    timestamp: new Date().toISOString(),
    method,
    url,
    statusCode,
    responseTime,
    ip,
    userAgent,
    userId,
  };
}

export default defineEventHandler(async (event: H3Event) => {
  // 只記錄 API 請求
  const path = event.node.req.url || '';
  if (!path.startsWith('/api/')) {
    return;
  }

  // 記錄請求開始時間
  const startTime = Date.now();

  // 監聽響應結束事件
  event.node.res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const statusCode = event.node.res.statusCode;

    const logData = formatRequest(event, responseTime, statusCode);

    // 根據狀態碼決定日誌級別
    if (statusCode >= 500) {
      console.error('API Error:', logData);
    } else if (statusCode >= 400) {
      console.warn('API Warning:', logData);
    } else if (process.env.LOG_LEVEL === 'debug') {
      // 只在 debug 模式下記錄成功請求
      console.warn('API Request:', logData);
    }

    // TODO(future): 整合專業日誌系統
    // - Pino 或 Winston
    // - 結構化日誌
    // - 日誌聚合服務（如 ELK Stack）
  });
});
