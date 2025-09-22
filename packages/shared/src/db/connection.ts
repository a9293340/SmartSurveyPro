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

  /**
   * 連接到 MongoDB 資料庫
   * @param uri - MongoDB 連接字串（必要參數，由外部提供）
   * @param dbName - 資料庫名稱（必要參數，由外部提供）
   * @returns Promise<Db> - MongoDB 資料庫實例
   */
  async connect(uri?: string, dbName?: string): Promise<Db> {
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
      // 驗證必要參數
      if (!uri) {
        throw new Error('MongoDB URI 參數為必要，請提供有效的連接字串');
      }

      if (!dbName) {
        throw new Error('資料庫名稱參數為必要，請提供有效的資料庫名稱');
      }

      this.client = new MongoClient(uri, this.getConnectionOptions());
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
export async function connectToDatabase(uri?: string, dbName?: string): Promise<Db> {
  return dbConnection.connect(uri, dbName);
}

// 取得客戶端連接（用於交易等）
export function getClient(): MongoClient {
  return dbConnection.getClient();
}

export function getDatabase(): Db {
  return dbConnection.getDatabase();
}
