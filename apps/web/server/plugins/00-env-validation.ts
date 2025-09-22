/**
 * 環境變數驗證 Plugin
 * 在 Nitro 伺服器啟動時驗證所有必要的環境變數
 * 如果驗證失敗，直接中斷伺服器啟動
 */

import { env } from '../utils/env-manager';

export default defineNitroPlugin(async () => {
  console.info('🔍 開始環境變數驗證...');

  try {
    // 在伺服器啟動時驗證所有必要環境變數
    env.validateRequired();

    // 額外驗證資料庫配置是否完整
    const dbConfig = env.getDatabaseConfig();

    if (!dbConfig.mongoUri) {
      throw new Error('MONGODB_URI 環境變數為空');
    }

    if (!dbConfig.dbName) {
      throw new Error('MONGODB_DB_NAME 環境變數為空');
    }

    // 驗證 JWT 配置
    const jwtConfig = env.getJwtConfig();
    if (!jwtConfig.accessTokenSecret || !jwtConfig.refreshTokenSecret) {
      throw new Error('JWT 密鑰配置不完整');
    }

    console.info('✅ 環境變數驗證完成');
    console.info(`📊 資料庫配置: ${dbConfig.dbName}`);
    console.info(`🔐 JWT 配置: 存取 Token 過期時間 ${jwtConfig.accessTokenExpiry}`);
  } catch (error) {
    console.error('❌ 環境變數驗證失敗，伺服器無法啟動');
    console.error('錯誤詳情:', error instanceof Error ? error.message : error);
    console.error('');
    console.error('🔧 請檢查以下項目:');
    console.error('1. .env.local 檔案是否存在且設定正確');
    console.error('2. 必要的環境變數是否都已設定');
    console.error('3. MongoDB 連接字串格式是否正確');
    console.error('');

    // 直接中斷啟動，避免伺服器在無效配置下運行
    process.exit(1);
  }
});
