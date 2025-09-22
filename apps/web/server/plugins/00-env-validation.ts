/**
 * 環境變數驗證 Plugin
 * 在 Nitro 伺服器啟動時驗證所有必要的環境變數
 * 如果驗證失敗，直接中斷伺服器啟動
 */

import { env } from '../utils/env-manager';

export default defineNitroPlugin(async () => {
  console.info('🔍 開始環境變數驗證...');

  try {
    // 使用 runtimeConfig 驗證環境變數
    env.validateRequired();

    // 驗證資料庫配置
    const dbConfig = env.getDatabaseConfig();
    console.info(`📊 資料庫配置: ${dbConfig.dbName}`);

    // 驗證 JWT 配置
    const jwtConfig = env.getJwtConfig();
    console.info(`🔐 JWT 配置: 存取 Token 過期時間 ${jwtConfig.accessTokenExpiry}`);

    console.info('✅ 環境變數驗證完成 - 伺服器可安全啟動');
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
