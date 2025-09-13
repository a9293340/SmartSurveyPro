// SmartSurvey Pro - 共享套件入口點

// 基礎版本資訊
export const VERSION = '0.0.1'

// 資料庫連接
export { connectToDatabase, getDatabase, dbConnection } from './db/connection'

// Redis 連接和 Key 管理
export {
  connectToRedis,
  getRedisClient,
  redisConnection,
  RedisHelper,
  getRedisHelper
} from './db/redis'

export {
  RedisKeyBuilder,
  RedisKeys,
  RedisKeyUtils
} from './db/redis-keys'

// 暫時的基礎匯出，後續任務會擴展
export const SHARED_READY = true