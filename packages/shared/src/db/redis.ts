import { createClient, RedisClientType } from 'redis';

// Redis 連接管理類
class RedisConnection {
  private client: RedisClientType | null = null;
  private isConnecting = false;

  // 取得連接配置
  private getConnectionOptions() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL 環境變數未設定');
    }

    return {
      url: redisUrl,
      database: parseInt(process.env.REDIS_DB || '0'),
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            console.error('❌ Redis 重連次數超過限制，停止重連');
            return false;
          }
          // 指數退避策略：1s, 2s, 4s, 8s...
          const delay = Math.min(1000 * Math.pow(2, retries), 30000);
          console.warn(`⏳ Redis 重連中... (第 ${retries + 1} 次，${delay}ms 後重試)`);
          return delay;
        },
        connectTimeout: 10000,
        lazyConnect: true,
      },
    };
  }

  // TODO(human): 實作 Redis 連接邏輯的核心部分
  async connect(): Promise<RedisClientType> {
    // 如果已經連接，直接返回
    if (this.client && this.client.isOpen) {
      return this.client;
    }

    // 防止重複連接
    if (this.isConnecting) {
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.client && this.client.isOpen) return this.client;
    }

    this.isConnecting = true;

    try {
      const options = this.getConnectionOptions();

      this.client = createClient(options);
      await this.client.connect();
      console.warn('✅ Redis 連接成功');
      return this.client;
    } catch (error) {
      this.isConnecting = false;
      console.error('❌ Redis 連接失敗:', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  // 關閉連接
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        console.warn('🔌 Redis 連接已關閉');
      } catch (error) {
        console.error('關閉 Redis 連接時發生錯誤:', error);
        await this.client.disconnect();
      } finally {
        this.client = null;
      }
    }
  }

  // 檢查連接狀態
  isConnected(): boolean {
    return !!(this.client && this.client.isOpen);
  }

  // 取得 Redis 客戶端
  getClient(): RedisClientType {
    if (!this.client || !this.client.isOpen) {
      throw new Error('Redis 未連接，請先呼叫 connect()');
    }
    return this.client;
  }

  // 健康檢查
  async healthCheck(): Promise<{ status: 'ok' | 'error'; latency?: number; error?: string }> {
    try {
      if (!this.isConnected()) {
        return { status: 'error', error: '未連接' };
      }

      const start = Date.now();
      await this.client!.ping();
      const latency = Date.now() - start;

      return { status: 'ok', latency };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : '未知錯誤',
      };
    }
  }
}

// 單例模式：全專案共用一個 Redis 連接實例
export const redisConnection = new RedisConnection();

// 便捷函數
export async function connectToRedis(): Promise<RedisClientType> {
  return redisConnection.connect();
}

export function getRedisClient(): RedisClientType {
  return redisConnection.getClient();
}

// Redis 操作輔助類
export class RedisHelper {
  private client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  // 設定帶 TTL 的值
  async setWithTTL(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds || parseInt(process.env.REDIS_TTL_CACHE || '3600');
    await this.client.setEx(key, ttl, value);
  }

  // 設定 JSON 值
  async setJSON<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.setWithTTL(key, jsonValue, ttlSeconds);
  }

  // 取得 JSON 值
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`解析 JSON 失敗 (key: ${key}):`, error);
      return null;
    }
  }

  // 批次刪除 keys
  async deletePattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) return 0;
    return await this.client.del(keys);
  }

  // 檢查 key 是否存在
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // 設定 key 過期時間
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    return await this.client.expire(key, ttlSeconds);
  }
}

// 便捷函數：取得 Redis 輔助類
export async function getRedisHelper(): Promise<RedisHelper> {
  const client = await connectToRedis();
  return new RedisHelper(client);
}
