/**
 * 速率限制中間件 - 模板版本
 * 防止 API 濫用和 DDoS 攻擊
 * 檔名前綴 02 確保在日誌後、認證前執行
 */
import type { H3Event } from 'h3';

/**
 * 速率限制配置
 * TODO(human): 實作速率限制邏輯
 */
interface RateLimitConfig {
  windowMs: number; // 時間窗口（毫秒）
  max: number; // 最大請求數
  message: string; // 超限錯誤訊息
  skipPaths?: string[]; // 跳過的路徑
}

// 預設配置
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 分鐘
  max: 100, // 每分鐘 100 次請求
  message: 'Too many requests, please try again later.',
  skipPaths: ['/api/health', '/api/version'],
};

// 記憶體存儲（開發用）
// TODO(human): 實作 Redis 存儲
const requestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * 取得客戶端識別符
 * TODO(human): 實作客戶端識別邏輯
 */
function getClientIdentifier(event: H3Event): string {
  // TODO(human): 實作識別邏輯
  // 學習重點：
  // - 優先使用 userId（已認證用戶）
  // - 回退到 IP + User-Agent 組合
  // - 考慮使用 fingerprint

  // 優先使用 userId
  if (event.context.user?.userId) {
    return `user:${event.context.user.userId}`;
  }

  // 使用 IP 作為識別符
  const forwarded = getHeader(event, 'x-forwarded-for');
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : event.node.req.socket.remoteAddress || 'unknown';

  return `ip:${ip}`;
}

/**
 * 檢查並更新請求計數
 * TODO(human): 實作計數邏輯
 */
function checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    // 新的時間窗口
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true;
  }

  // 在當前時間窗口內
  if (record.count >= config.max) {
    // 超過限制
    return false;
  }

  // 增加計數
  record.count++;
  return true;
}

/**
 * 清理過期記錄
 * TODO(human): 實作定期清理
 */
function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// 定期清理（每5分鐘）
setInterval(cleanupExpiredRecords, 5 * 60 * 1000);

export default defineEventHandler(async (event: H3Event) => {
  // 只處理 API 路徑
  const path = event.node.req.url || '';
  if (!path.startsWith('/api/')) {
    return;
  }

  // 跳過不需要限制的路徑
  if (DEFAULT_CONFIG.skipPaths?.includes(path)) {
    return;
  }

  // TODO(human): 實作完整的速率限制
  // 學習重點：
  // - 不同路徑使用不同限制
  // - 認證用戶和匿名用戶的差異限制
  // - 整合 Redis 實現分散式限制

  const identifier = getClientIdentifier(event);
  const allowed = checkRateLimit(identifier, DEFAULT_CONFIG);

  if (!allowed) {
    // 設定速率限制標頭
    const record = requestCounts.get(identifier);
    if (record) {
      setHeader(event, 'X-RateLimit-Limit', DEFAULT_CONFIG.max.toString());
      setHeader(event, 'X-RateLimit-Remaining', '0');
      setHeader(event, 'X-RateLimit-Reset', record.resetTime.toString());
    }

    // 返回 429 Too Many Requests
    throw createError({
      statusCode: 429,
      statusMessage: DEFAULT_CONFIG.message,
    });
  }

  // 設定速率限制標頭
  const record = requestCounts.get(identifier);
  if (record) {
    setHeader(event, 'X-RateLimit-Limit', DEFAULT_CONFIG.max.toString());
    setHeader(event, 'X-RateLimit-Remaining', (DEFAULT_CONFIG.max - record.count).toString());
    setHeader(event, 'X-RateLimit-Reset', record.resetTime.toString());
  }
});
