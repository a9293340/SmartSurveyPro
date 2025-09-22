/**
 * 資料庫初始化 Plugin
 * 在 Nitro 伺服器啟動時建立資料庫連接
 * 使用統一的環境變數管理，確保 Singleton 連接在啟動時就建立
 */

import { env } from '../utils/env-manager';
import { dbConnection } from '@smartsurvey/shared/server';

export default defineNitroPlugin(async () => {
  console.info('🗄️ 開始資料庫連接初始化...');

  try {
    // 從 EnvManager 取得統一的資料庫配置
    const dbConfig = env.getDatabaseConfig();

    console.info(`📊 正在連接到資料庫: ${dbConfig.dbName}`);

    // 在伺服器啟動時就建立 MongoDB 連接
    // 這樣首次 API 請求時不需要等待連接建立
    await dbConnection.connect(dbConfig.mongoUri, dbConfig.dbName);

    console.info('✅ 資料庫連接初始化完成');
    console.info('🚀 MongoDB Connection Pool 已就緒');

    // 驗證連接狀態
    if (dbConnection.isConnected()) {
      console.info('🔗 資料庫連接狀態: 已連接');
    } else {
      throw new Error('資料庫連接狀態驗證失敗');
    }
  } catch (error) {
    console.error('❌ 資料庫連接初始化失敗');
    console.error('錯誤詳情:', error instanceof Error ? error.message : error);
    console.error('');
    console.error('🔧 可能的解決方案:');
    console.error('1. 檢查 MongoDB Atlas 連接字串是否正確');
    console.error('2. 確認網路連接是否正常');
    console.error('3. 檢查 MongoDB Atlas IP 白名單設定');
    console.error('4. 驗證資料庫使用者權限');
    console.error('');

    // 資料庫連接失敗時的處理策略
    if (env.isDevelopment()) {
      console.warn('⚠️ 開發環境: 伺服器將以降級模式啟動');
      console.warn('📝 部分功能可能無法使用，請修復資料庫連接');
      // 開發環境允許降級啟動，方便除錯
    } else {
      console.error('💥 生產環境: 資料庫連接為必要服務，伺服器無法啟動');
      // 生產環境必須有資料庫連接，直接中斷
      process.exit(1);
    }
  }
});
