import { connectToDatabase, dbConnection } from '../db/connection.js';
import { redisConnection } from '../db/redis.js';

// 健康檢查結果介面
export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  error?: string;
  details?: Record<string, unknown> | undefined;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    mongodb: ServiceHealth;
    redis: ServiceHealth;
  };
  timestamp: string;
  overallLatency: number;
}

// 健康檢查配置
export interface HealthCheckConfig {
  timeoutMs: number;
  includeDetails: boolean;
}

const DEFAULT_CONFIG: HealthCheckConfig = {
  timeoutMs: 5000,
  includeDetails: false,
};

// MongoDB 健康檢查
async function checkMongoDBHealth(config: HealthCheckConfig): Promise<ServiceHealth> {
  try {
    const start = Date.now();

    // 檢查連接狀態
    if (!dbConnection.isConnected()) {
      await connectToDatabase();
    }

    // 執行簡單查詢測試
    const db = dbConnection.getDatabase();
    await db.admin().ping();

    const latency = Date.now() - start;

    return {
      status: latency > 1000 ? 'degraded' : 'healthy',
      latency,
      details: config.includeDetails
        ? {
            databaseName: db.databaseName,
            connected: true,
          }
        : undefined,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : '未知錯誤',
      details: config.includeDetails ? { connected: false } : undefined,
    };
  }
}

// Redis 健康檢查
async function checkRedisHealth(config: HealthCheckConfig): Promise<ServiceHealth> {
  try {
    const start = Date.now();

    // 如果未連接，嘗試重新連接
    if (!redisConnection.isConnected()) {
      await redisConnection.connect();
    }

    // 使用現有的健康檢查方法
    const result = await redisConnection.healthCheck();

    if (result.status === 'error') {
      return {
        status: 'unhealthy',
        error: result.error!,
        details: config.includeDetails ? { connected: false } : undefined,
      };
    }

    const latency = result.latency || Date.now() - start;

    return {
      status: latency > 500 ? 'degraded' : 'healthy',
      latency,
      details: config.includeDetails ? { connected: true } : undefined,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : '未知錯誤',
      details: config.includeDetails ? { connected: false } : undefined,
    };
  }
}

// 整合健康檢查邏輯
export async function performHealthCheck(
  config: HealthCheckConfig = DEFAULT_CONFIG
): Promise<HealthCheckResult> {
  const overallStart = Date.now();

  // 平行執行 MongoDB 和 Redis 健康檢查
  const [mongodbResult, redisResult] = await Promise.allSettled([
    checkMongoDBHealth(config),
    checkRedisHealth(config),
  ]);

  const overallStatus =
    mongodbResult.status === 'fulfilled' && redisResult.status === 'fulfilled'
      ? mongodbResult.value.status === 'healthy' && redisResult.value.status === 'healthy'
        ? 'healthy'
        : 'degraded'
      : 'unhealthy';

  return {
    status: overallStatus,
    services: {
      mongodb: mongodbResult.status === 'fulfilled' ? mongodbResult.value : { status: 'unhealthy' },
      redis: redisResult.status === 'fulfilled' ? redisResult.value : { status: 'unhealthy' },
    },
    timestamp: new Date().toISOString(),
    overallLatency: Date.now() - overallStart,
  };
}

// 便捷函數：快速健康檢查
export async function quickHealthCheck(): Promise<boolean> {
  try {
    const result = await performHealthCheck({ timeoutMs: 3000, includeDetails: false });
    return result.status !== 'unhealthy';
  } catch {
    return false;
  }
}

// 便捷函數：詳細健康檢查
export async function detailedHealthCheck(): Promise<HealthCheckResult> {
  return performHealthCheck({ timeoutMs: 10000, includeDetails: true });
}
