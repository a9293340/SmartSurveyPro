/**
 * JWT Token 管理工具
 * 負責 JWT 的生成、驗證和解析
 * 遵循 /docs/design/environment-variables-management.md 規範
 */
import jwt from 'jsonwebtoken';
import { env } from './env-manager';

// JWT Payload 介面定義
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}

// 在模組載入時一次性取得 JWT 設定
// 避免每次呼叫函數時重複檢查環境變數
let jwtConfig: ReturnType<typeof env.getJwtConfig> | null = null;

/**
 * 初始化 JWT 設定
 * 在第一次使用時載入，避免啟動時錯誤
 */
function initJwtConfig() {
  if (!jwtConfig) {
    try {
      jwtConfig = env.getJwtConfig();
    } catch (error) {
      console.error('JWT 環境變數初始化失敗:', error);
      throw new Error('JWT 環境變數未正確設定，請檢查 .env 檔案');
    }
  }
  return jwtConfig;
}

/**
 * 生成 Access Token
 * 用於 API 存取授權，有效期較短（預設 15 分鐘）
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    const config = initJwtConfig();

    return jwt.sign(payload, config.accessTokenSecret, {
      expiresIn: config.accessTokenExpiry,
      issuer: 'smartsurvey-pro',
      audience: 'api',
    } as jwt.SignOptions);
  } catch (error) {
    console.error('生成 Access Token 失敗:', error);
    throw new Error('生成 Access Token 失敗');
  }
}

/**
 * 生成 Refresh Token
 * 用於更新 Access Token，有效期較長（預設 7 天）
 * tokenId 用於追蹤和撤銷特定的 refresh token
 */
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  try {
    const config = initJwtConfig();

    return jwt.sign(payload, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiry,
      issuer: 'smartsurvey-pro',
      audience: 'refresh',
    } as jwt.SignOptions);
  } catch (error) {
    console.error('生成 Refresh Token 失敗:', error);
    throw new Error('生成 Refresh Token 失敗');
  }
}

/**
 * 驗證 Access Token
 * @returns JWTPayload 或 null（驗證失敗時）
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const config = initJwtConfig();

    const decoded = jwt.verify(token, config.accessTokenSecret, {
      issuer: 'smartsurvey-pro',
      audience: 'api',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    // 區分不同的錯誤類型，提供更好的除錯資訊
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('Access Token 已過期:', error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('Access Token 無效:', error.message);
    } else {
      console.error('驗證 Access Token 時發生未知錯誤:', error);
    }

    // 根據函數簽名，失敗時返回 null 而非拋出錯誤
    return null;
  }
}

/**
 * 驗證 Refresh Token
 * @returns RefreshTokenPayload 或 null（驗證失敗時）
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const config = initJwtConfig();

    const decoded = jwt.verify(token, config.refreshTokenSecret, {
      issuer: 'smartsurvey-pro',
      audience: 'refresh',
    }) as RefreshTokenPayload;

    // TODO(future): 實作 tokenId 的撤銷檢查
    // 可以在 Redis 中維護已撤銷的 tokenId 黑名單

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('Refresh Token 已過期:', error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('Refresh Token 無效:', error.message);
    } else {
      console.error('驗證 Refresh Token 時發生未知錯誤:', error);
    }

    return null;
  }
}

/**
 * 解析 token（不驗證簽名）
 * ⚠️ 警告：此方法不驗證 token 的有效性，只解析內容
 * 適用場景：
 * - 前端顯示用戶資訊（但不能信任其內容）
 * - 檢查 token 是否過期（在驗證前的快速檢查）
 * - 除錯和日誌記錄
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token, { complete: false });

    if (!decoded || typeof decoded !== 'object') {
      console.warn('無法解析 token，可能格式不正確');
      return null;
    }

    // 確保 decoded 包含必要的 JWTPayload 屬性
    const payload = decoded as JWTPayload;
    if (!payload.userId || !payload.email) {
      console.warn('Token payload 缺少必要的用戶資訊');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('解析 Token 失敗:', error);
    return null;
  }
}

/**
 * 從 Authorization header 中提取 token
 * 支援格式："Bearer <token>"
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;

  // 使用正則表達式匹配 Bearer token 格式
  // 允許 Bearer 後有多個空格
  const match = authHeader.match(/^Bearer\s+(.+)$/i);

  if (!match || !match[1]) {
    // 不是標準的 Bearer token 格式
    console.warn('Authorization header 格式不正確，預期格式: Bearer <token>');
    return null;
  }

  return match[1].trim();
}

/**
 * 生成 Token Pair（Access Token + Refresh Token）
 * 便利函數，同時生成兩種 token
 */
export function generateTokenPair(userId: string, email: string) {
  const tokenId = crypto.randomUUID(); // 用於追蹤 refresh token

  const accessToken = generateAccessToken({ userId, email });
  const refreshToken = generateRefreshToken({ userId, tokenId });

  return {
    accessToken,
    refreshToken,
    tokenId,
    expiresIn: 900, // 15 minutes in seconds
  };
}
