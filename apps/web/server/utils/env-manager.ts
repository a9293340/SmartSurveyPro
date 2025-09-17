/**
 * 環境變數管理器
 * 根據 /docs/design/environment-variables-management.md 實作
 * 統一管理機敏資料與配置資料的存取
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
   * @param key - 環境變數名稱
   * @returns 環境變數值
   * @throws 當環境變數不存在時拋出錯誤
   */
  getSecret(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`缺少必要的環境變數: ${key}`);
    }
    return value;
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
   */
  validateRequired(): void {
    if (this.validated) return;

    // 根據環境決定必要的環境變數
    const isDevelopment = process.env.NODE_ENV === 'development';

    // 必要的機敏資料
    const requiredSecrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGODB_URI'];

    // 生產環境額外需要的
    if (!isDevelopment) {
      requiredSecrets.push(
        'SESSION_SECRET'
        // 其他生產環境必要的 secrets
      );
    }

    // 驗證所有必要環境變數
    const missingVars: string[] = [];
    for (const key of requiredSecrets) {
      if (!process.env[key]) {
        missingVars.push(key);
      }
    }

    if (missingVars.length > 0) {
      throw new Error(
        `缺少必要的環境變數:\n${missingVars.join('\n')}\n` + `請檢查 .env.local 檔案或環境設定`
      );
    }

    this.validated = true;
    console.warn('✅ 環境變數驗證完成');
  }

  /**
   * 取得 JWT 相關設定
   * 集中管理所有 JWT 相關的環境變數
   */
  getJwtConfig() {
    return {
      accessTokenSecret: this.getSecret('JWT_SECRET'),
      refreshTokenSecret: this.getSecret('JWT_REFRESH_SECRET'),
      accessTokenExpiry: this.getSecretSafe('JWT_ACCESS_TOKEN_EXPIRY', '15m'),
      refreshTokenExpiry: this.getSecretSafe('JWT_REFRESH_TOKEN_EXPIRY', '7d'),
    };
  }

  /**
   * 取得資料庫連接設定
   */
  getDatabaseConfig() {
    return {
      mongoUri: this.getSecret('MONGODB_URI'),
      redisUrl: this.getSecretSafe('REDIS_URL'),
    };
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
