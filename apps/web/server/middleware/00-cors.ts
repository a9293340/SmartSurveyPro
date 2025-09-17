/**
 * CORS 中間件
 * 處理跨域請求設定
 * 檔名前綴 00 確保此中間件最先執行
 */
import type { H3Event } from 'h3';

// CORS 配置
const CORS_CONFIG = {
  // 允許的來源
  allowedOrigins:
    process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', 'http://localhost:3001']
      : [process.env.NUXT_PUBLIC_APP_URL || 'https://smartsurvey.pro'],

  // 允許的方法
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // 允許的標頭
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
  ],

  // 暴露的標頭（客戶端可讀取）
  exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'X-Current-Page', 'X-Rate-Limit-Remaining'],

  // 是否允許憑證
  credentials: true,

  // 預檢請求快取時間（秒）
  maxAge: 86400, // 24 小時
};

export default defineEventHandler(async (event: H3Event) => {
  // 只處理 API 路徑
  const path = event.node.req.url || '';
  if (!path.startsWith('/api/')) {
    return;
  }

  const origin = getHeader(event, 'origin') || '';
  const method = event.node.req.method || '';

  // 檢查來源是否允許
  let allowedOrigin = '';
  if (CORS_CONFIG.allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  } else if (process.env.NODE_ENV === 'development') {
    // 開發環境下允許所有來源
    allowedOrigin = origin || '*';
  }

  if (allowedOrigin) {
    // 設定 CORS 標頭
    setHeader(event, 'Access-Control-Allow-Origin', allowedOrigin);
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');
    setHeader(event, 'Access-Control-Allow-Methods', CORS_CONFIG.allowedMethods.join(', '));
    setHeader(event, 'Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
    setHeader(event, 'Access-Control-Expose-Headers', CORS_CONFIG.exposedHeaders.join(', '));
    setHeader(event, 'Access-Control-Max-Age', CORS_CONFIG.maxAge);
  }

  // 處理 OPTIONS 預檢請求
  if (method === 'OPTIONS') {
    // 直接返回 204 No Content
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
});
