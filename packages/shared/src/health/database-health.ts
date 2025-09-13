import { connectToDatabase, dbConnection } from '../db/connection';
import { redisConnection } from '../db/redis';

// 健康檢查結果介面
export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  error?: string;
  details?: Record<string, any> | undefined;
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

// TODO(human): 實作整合健康檢查邏輯
export async function performHealthCheck(
  config: HealthCheckConfig = DEFAULT_CONFIG,
): Promise<HealthCheckResult> {
  const overallStart = Date.now();

  // 你的實作：
  // 1. 平行執行 MongoDB 和 Redis 健康檢查
  // 2. 根據個別服務狀態決定整體狀態
  // 3. 計算整體響應時間
  // 4. 回傳完整的健康檢查結果

  // 提示：使用 Promise.allSettled() 來平行執行檢查
  // 狀態邏輯：all healthy -> healthy, any unhealthy -> degraded, all unhealthy -> unhealthy
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
