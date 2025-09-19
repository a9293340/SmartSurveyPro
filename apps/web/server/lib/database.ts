/**
 * MongoDB 資料庫連接管理
 * 僅供 server 端使用
 */

import { MongoClient, Db, type MongoClientOptions } from 'mongodb';

// MongoDB 連接管理類
class DatabaseConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnecting = false;

  // 取得連接配置
  private getConnectionOptions(): MongoClientOptions {
    return {
      maxPoolSize: 50,
      minPoolSize: 10,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    };
  }

  async connect(uri?: string): Promise<Db> {
    // 如果已經連接，直接返回
    if (this.db && this.client) {
      return this.db;
    }

    // 防止重複連接
    if (this.isConnecting) {
      // 等待現有連接完成
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.db) return this.db;
    }

    this.isConnecting = true;

    try {
      const connectionUri = uri || process.env.MONGODB_URI;
      const dbName = process.env.MONGODB_DB_NAME || 'smartsurvey_dev';

      if (!connectionUri) {
        throw new Error('MongoDB URI 未設定');
      }

      this.client = new MongoClient(connectionUri, this.getConnectionOptions());
      await this.client.connect();
      this.db = this.client.db(dbName);

      console.warn(`✅ MongoDB 連接成功：${dbName}`);
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB 連接失敗:', error);
      // 清理失敗的連接
      if (this.client) {
        try {
          await this.client.close();
        } catch (closeError) {
          console.error('關閉連接時發生錯誤:', closeError);
        }
        this.client = null;
      }
      this.db = null;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  // 關閉連接
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  // 檢查連接狀態
  isConnected(): boolean {
    return !!this.db && !!this.client;
  }

  // 取得資料庫實例
  getDatabase(): Db {
    if (!this.db) {
      throw new Error('資料庫未連接，請先呼叫 connect()');
    }
    return this.db;
  }
}

// 單例模式：全專案共用一個連接實例
export const dbConnection = new DatabaseConnection();

// 便捷函數
export async function connectToDatabase(uri?: string): Promise<Db> {
  return dbConnection.connect(uri);
}

export function getDatabase(): Db {
  return dbConnection.getDatabase();
}

// ============================================================================
// Redis 連接管理
// ============================================================================

import { createClient, type RedisClientType } from 'redis';

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

      // 設置錯誤處理
      this.client.on('error', err => {
        console.error('❌ Redis 連接錯誤:', err);
      });

      this.client.on('connect', () => {
        console.warn('⏳ Redis 連接中...');
      });

      this.client.on('ready', () => {
        console.warn('✅ Redis 連接成功');
      });

      this.client.on('end', () => {
        console.warn('🔌 Redis 連接已關閉');
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('❌ Redis 連接失敗:', error);
      this.client = null;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  // 關閉連接
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  // 檢查連接狀態
  isConnected(): boolean {
    return !!this.client && this.client.isOpen;
  }

  // 取得客戶端實例
  getClient(): RedisClientType {
    if (!this.client || !this.client.isOpen) {
      throw new Error('Redis 未連接，請先呼叫 connect()');
    }
    return this.client;
  }

  // 健康檢查
  async healthCheck(): Promise<{
    status: 'ok' | 'error';
    latency?: number;
    error?: string;
  }> {
    try {
      if (!this.client || !this.client.isOpen) {
        throw new Error('Redis 未連接');
      }

      const start = Date.now();
      await this.client.ping();
      const latency = Date.now() - start;

      return { status: 'ok', latency };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// 單例模式：全專案共用一個連接實例
export const redisConnection = new RedisConnection();

// 便捷函數
export async function connectToRedis(): Promise<RedisClientType> {
  return redisConnection.connect();
}

export function getRedisClient(): RedisClientType {
  return redisConnection.getClient();
}
