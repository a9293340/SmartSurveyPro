import { connectToDatabase, connectToRedis } from '@smartsurvey/shared/server';
import type { Db } from 'mongodb';
import type { RedisClientType } from 'redis';
import { env } from '../utils/env-manager';

/**
 * 健康檢查 API
 * GET /api/health
 */
export default defineEventHandler(async event => {
  // 檢查 MongoDB 連線狀態
  let databaseStatus = 'unhealthy';
  let databaseError = null;

  // 使用 env-manager 檢查環境變數（機敏資料）
  let mongoUri: string | undefined;
  try {
    mongoUri = env.getSecretSafe('MONGODB_URI');
    console.log('mongoUri', mongoUri);
  } catch (error) {
    console.error('無法讀取 MONGODB_URI:', error);
  }

  if (!mongoUri) {
    databaseStatus = 'error';
    databaseError = 'MONGODB_URI 環境變數未設定';
  } else {
    try {
      const db = (await connectToDatabase()) as unknown as Db;
      if (db) {
        // 執行 ping 測試
        await db.admin().ping();
        databaseStatus = 'operational';
      } else {
        throw new Error('資料庫連線返回 null');
      }
    } catch (error) {
      databaseStatus = 'error';
      databaseError = error instanceof Error ? error.message : 'Unknown error';
      console.error('MongoDB health check failed:', error);
    }
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
