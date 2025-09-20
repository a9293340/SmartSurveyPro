/**
 * 速率限制中間件
 * 防止 API 濫用和 DDoS 攻擊
 * 檔名前綴 02 確保在日誌後、認證前執行
 */
import type { H3Event } from 'h3';

/**
 * 速率限制配置
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
// TODO(future): Rate Limit Redis 升級 [Phase 1 記憶體版本已足夠] [詳見 /docs/TODO.md]
const requestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * 取得客戶端識別符
 * 優先級：userId > IP + User-Agent > IP
 */
function getClientIdentifier(event: H3Event): string {
  // 優先使用 userId（已認證用戶）
  if (event.context.user?.userId) {
    return `user:${event.context.user.userId}`;
  }

  // 取得客戶端 IP
  const forwarded = getHeader(event, 'x-forwarded-for');
  const ip =
    forwarded && typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim() || 'unknown'
      : event.node.req.socket.remoteAddress || 'unknown';

  // 取得 User-Agent 作為輔助識別
  const userAgent = getHeader(event, 'user-agent') || 'unknown';

  // 為匿名用戶提供更精確的識別（防止 IP 共用影響）
  // 使用 User-Agent 的前 50 字元作為 fingerprint
  const fingerprint = userAgent.slice(0, 50);

  return `ip:${ip}:${fingerprint}`;
}

/**
 * 檢查並更新請求計數
 * 使用滑動窗口演算法
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
 * 防止記憶體洩漏
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

/**
 * 根據路徑和用戶類型取得速率限制配置
 * 未來可以實作不同的限制策略
 */
function getRateLimitConfig(event: H3Event, defaultConfig: RateLimitConfig): RateLimitConfig {
  const path = event.node.req.url || '';
  const isAuthenticated = !!event.context.user;

  // 認證 API 更嚴格的限制
  if (path.startsWith('/api/auth/')) {
    return {
      ...defaultConfig,
      windowMs: 15 * 60 * 1000, // 15 分鐘
      max: isAuthenticated ? 20 : 10, // 已認證：20次，未認證：10次
      message: 'Too many authentication attempts, please try again later.',
    };
  }

  // 已認證用戶更寬鬆的限制
  if (isAuthenticated) {
    return {
      ...defaultConfig,
      max: defaultConfig.max * 2, // 雙倍限制
    };
  }

  // 其他路徑使用預設配置
  return defaultConfig;
}

export default defineEventHandler(async (event: H3Event) => {
  // 只處理 API 路徑
  const path = event.node.req.url || '';
  if (!path.startsWith('/api/')) {
    return;
  }

  // 跳過不需要限制的路徑
  if (DEFAULT_CONFIG.skipPaths?.some(skipPath => path.startsWith(skipPath))) {
    return;
  }

  // 取得客戶端識別符並檢查限制
  const identifier = getClientIdentifier(event);

  // 取得適用的配置（未來可以根據路徑和用戶類型調整）
  const config = getRateLimitConfig(event, DEFAULT_CONFIG);

  const allowed = checkRateLimit(identifier, config);

  if (!allowed) {
    // 設定速率限制標頭
    const record = requestCounts.get(identifier);
    if (record) {
      setHeader(event, 'X-RateLimit-Limit', config.max.toString());
      setHeader(event, 'X-RateLimit-Remaining', '0');
      setHeader(event, 'X-RateLimit-Reset', record.resetTime.toString());
    }

    // 返回 429 Too Many Requests
    throw createError({
      statusCode: 429,
      statusMessage: config.message,
    });
  }

  // 設定速率限制標頭
  const record = requestCounts.get(identifier);
  if (record) {
    setHeader(event, 'X-RateLimit-Limit', config.max.toString());
    setHeader(event, 'X-RateLimit-Remaining', (config.max - record.count).toString());
    setHeader(event, 'X-RateLimit-Reset', record.resetTime.toString());
  }
});
