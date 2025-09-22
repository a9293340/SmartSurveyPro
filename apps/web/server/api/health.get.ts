import { dbConnection, connectToRedis } from '@smartsurvey/shared/server';
import type { RedisClientType } from 'redis';
import { env } from '../utils/env-manager';

/**
 * 健康檢查 API
 * GET /api/health
 * 使用統一的環境變數管理和預先建立的資料庫連接
 */
export default defineEventHandler(async event => {
  // 檢查 MongoDB 連線狀態
  let databaseStatus = 'unhealthy';
  let databaseError: string | null = null;

  try {
    // 使用統一的環境變數管理取得資料庫配置
    const dbConfig = env.getDatabaseConfig();

    // 檢查環境變數是否正確載入
    if (!dbConfig.mongoUri || !dbConfig.dbName) {
      throw new Error('資料庫配置不完整');
    }

    // 檢查預先建立的資料庫連接狀態
    if (dbConnection.isConnected()) {
      // 使用已建立的連接進行 ping 測試
      const db = dbConnection.getDatabase();
      await db.admin().ping();
      databaseStatus = 'operational';
    } else {
      throw new Error('資料庫連接未建立');
    }
  } catch (error) {
    databaseStatus = 'error';
    databaseError = error instanceof Error ? error.message : 'Unknown error';
    console.error('MongoDB health check failed:', error);
  }

  // 檢查 Redis 連線狀態（如果啟用）
  let redisStatus = 'not_configured';
  const redisUrl = env.getSecretSafe('REDIS_URL');
  const enableRedis = env.getSecretSafe('ENABLE_REDIS_CACHE', 'false');

  if (enableRedis === 'true' && redisUrl) {
    try {
      const client = (await connectToRedis()) as unknown as RedisClientType;
      if (client) {
        await client.ping();
        redisStatus = 'operational';
      } else {
        throw new Error('Redis 連線返回 null');
      }
    } catch (error) {
      redisStatus = 'error';
      console.error('Redis health check failed:', error);
    }
  }

  // 基本健康狀態
  const status = {
    status: databaseStatus === 'operational' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    app: {
      name: process.env.APP_NAME || 'SmartSurvey Pro',
      version: '0.0.1',
      environment: process.env.NODE_ENV || 'development',
    },
    services: {
      api: 'operational',
      database: databaseStatus,
      redis: redisStatus,
    },
    errors: databaseError ? { database: databaseError } : undefined,
  };

  return status;
});
