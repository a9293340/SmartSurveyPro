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

  // TODO(human): 實作連接邏輯的核心部分
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

  // 取得客戶端實例
  getClient(): MongoClient {
    if (!this.client) {
      throw new Error('客戶端未連接，請先呼叫 connect()');
    }
    return this.client;
  }
}

// 單例模式：全專案共用一個連接實例
export const dbConnection = new DatabaseConnection();

// 便捷函數
export async function connectToDatabase(uri?: string): Promise<Db> {
  return dbConnection.connect(uri);
}

// 取得客戶端連接（用於交易等）
export function getClient(): MongoClient {
  return dbConnection.getClient();
}

export function getDatabase(): Db {
  return dbConnection.getDatabase();
}
