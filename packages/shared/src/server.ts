/**
 * SmartSurvey Pro - 伺服器端專用導出
 * 此檔案只能在 Node.js 伺服器環境中使用
 */

// 重新導出所有客戶端安全的內容
export * from './index';

// === 伺服器端專用功能 ===

// 資料庫連接
export { connectToDatabase, getDatabase, dbConnection } from './db/connection';

// Redis 連接和 Key 管理
export {
  connectToRedis,
  getRedisClient,
  redisConnection,
  RedisHelper,
  getRedisHelper,
} from './db/redis';

export { RedisKeyBuilder, RedisKeys, RedisKeyUtils } from './db/redis-keys';

// 健康檢查系統
export {
  performHealthCheck,
  quickHealthCheck,
  detailedHealthCheck,
  type HealthCheckResult,
  type ServiceHealth,
  type HealthCheckConfig,
} from './health/database-health';
