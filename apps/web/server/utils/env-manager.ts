/**
 * 環境變數管理器
 * 根據 /docs/design/environment-variables-management.md 實作
 * 統一管理機敏資料與配置資料的存取
 *
 * 重要：改用 runtimeConfig 來存取機敏資料，確保：
 * 1. 開發環境可以正確讀取 .env.local
 * 2. 生產環境支援 Cloud Run + Secret Manager
 * 3. 機敏資料不會在 build time 固定
 */

/**
 * 環境變數管理器
 * 負責統一管理所有環境變數的存取
 */
export class EnvManager {
  private static instance: EnvManager;
  private validated = false;

  /**
   * 取得 EnvManager 單例實例
   */
  static getInstance(): EnvManager {
    if (!this.instance) {
      this.instance = new EnvManager();
    }
    return this.instance;
  }

  /**
   * 取得機敏資料（Secrets）
   * 用於 JWT_SECRET、API_KEYS、DATABASE_PASSWORD 等
   *
   * 使用 useRuntimeConfig() 確保：
   * - 開發環境：從 .env.local 讀取
   * - 生產環境：從 Cloud Run 環境變數讀取
   *
   * @param key - 環境變數名稱
   * @returns 環境變數值
   * @throws 當環境變數不存在時拋出錯誤
   */
  getSecret(key: string): string {
    try {
      const config = useRuntimeConfig();

      // 根據 key 映射到對應的 runtimeConfig 屬性
      const secretMap: Record<string, string> = {
        JWT_SECRET: config.jwtSecret,
        JWT_REFRESH_SECRET: config.jwtRefreshSecret,
        MONGODB_URI: config.mongodbUri,
        MONGODB_DB_NAME: config.mongodbDbName,
        REDIS_URL: config.redisUrl || '',
        SESSION_SECRET: config.sessionSecret,
      };

      const value = secretMap[key];
      if (!value) {
        throw new Error(`缺少必要的環境變數: ${key}`);
      }
      return value;
    } catch (error) {
      // 如果 useRuntimeConfig 失敗，說明不在 Nuxt context 中
      throw new Error(`無法存取環境變數 ${key}：請確保在 Nuxt server context 中使用`);
    }
  }

  /**
   * 安全取得機敏資料（不拋出錯誤）
   * @param key - 環境變數名稱
   * @param defaultValue - 預設值
   * @returns 環境變數值或預設值
   */
  getSecretSafe(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  /**
   * 取得配置資料（Configs）
   * 用於 API_BASE、APP_NAME、FEATURE_FLAGS 等
   * 注意：此方法需要在 Nuxt context 中使用
   * @param key - 配置名稱
   * @returns 配置值
   */
  getConfig(key: string): string {
    // 注意：useRuntimeConfig 需要在 Nuxt context 中使用
    // 這裡我們直接使用 process.env 作為 fallback
    // 實際使用時應該在 API 路由或中間件中使用 useRuntimeConfig
    return (
      process.env[`NUXT_${key.toUpperCase()}`] ||
      process.env[`NUXT_PUBLIC_${key.toUpperCase()}`] ||
      ''
    );
  }

  /**
   * 啟動時驗證必要環境變數
   * 應在應用程式啟動時呼叫一次
   * 現在改用 runtimeConfig 來驗證
   */
  validateRequired(): void {
    if (this.validated) return;

    try {
      const config = useRuntimeConfig();

      // 必要的機敏資料
      const requiredSecrets = [
        { key: 'JWT_SECRET', value: config.jwtSecret },
        { key: 'JWT_REFRESH_SECRET', value: config.jwtRefreshSecret },
        { key: 'MONGODB_URI', value: config.mongodbUri },
        { key: 'MONGODB_DB_NAME', value: config.mongodbDbName },
      ];

      // 生產環境額外需要的
      const isDevelopment = config.nodeEnv === 'development';
      if (!isDevelopment) {
        requiredSecrets.push({ key: 'SESSION_SECRET', value: config.sessionSecret });
      }

      // 驗證所有必要環境變數
      const missingVars: string[] = [];
      for (const secret of requiredSecrets) {
        if (!secret.value) {
          missingVars.push(secret.key);
        }
      }

      if (missingVars.length > 0) {
        throw new Error(
          `缺少必要的環境變數:\n${missingVars.join('\n')}\n請檢查 .env.local 檔案或環境設定`
        );
      }

      this.validated = true;
      console.warn('✅ 環境變數驗證完成');
    } catch (error) {
      throw new Error(`環境變數驗證失敗：${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * 取得 JWT 相關設定
   * 集中管理所有 JWT 相關的環境變數
   * 現在改用 runtimeConfig 來讀取
   */
  getJwtConfig() {
    try {
      const config = useRuntimeConfig();
      return {
        accessTokenSecret: config.jwtSecret,
        refreshTokenSecret: config.jwtRefreshSecret,
        accessTokenExpiry: config.jwtAccessTokenExpiry || '15m',
        refreshTokenExpiry: config.jwtRefreshTokenExpiry || '7d',
      };
    } catch (error) {
      throw new Error(`無法取得 JWT 配置：請確保在 Nuxt server context 中使用`);
    }
  }

  /**
   * 取得資料庫連接設定
   * 現在改用 runtimeConfig 來讀取
   */
  getDatabaseConfig() {
    try {
      const config = useRuntimeConfig();
      return {
        mongoUri: config.mongodbUri,
        dbName: config.mongodbDbName || 'smartsurvey-dev',
        redisUrl: config.redisUrl || '',
      };
    } catch (error) {
      throw new Error(`無法取得資料庫配置：請確保在 Nuxt server context 中使用`);
    }
  }

  /**
   * 判斷是否為開發環境
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * 判斷是否為生產環境
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}

// 匯出單例實例
export const env = EnvManager.getInstance();

// 預設匯出 class（用於測試）
export default EnvManager;
