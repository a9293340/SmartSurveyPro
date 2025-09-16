/**
 * JWT Token 管理工具 - 模板版本
 * 負責 JWT 的生成、驗證和解析
 */

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

/**
 * 生成 Access Token
 * TODO(human): 實作 JWT 生成邏輯
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  // TODO(human): 實作 Access Token 生成
  // 學習重點：
  // - jwt.sign() 的參數設定
  // - 環境變數的安全讀取
  // - Token 過期時間設定

  throw new Error('generateAccessToken 尚未實作');
}

/**
 * 生成 Refresh Token
 * TODO(human): 實作 Refresh Token 生成邏輯
 */
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  // TODO(human): 實作 Refresh Token 生成
  // 學習重點：
  // - Refresh Token 與 Access Token 的差異
  // - 更長的過期時間設定
  // - tokenId 的作用

  throw new Error('generateRefreshToken 尚未實作');
}

/**
 * 驗證 Access Token
 * TODO(human): 實作 Access Token 驗證邏輯
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  // TODO(human): 實作 Access Token 驗證
  // 學習重點：
  // - jwt.verify() 的錯誤處理
  // - Token 過期和無效的區別
  // - 安全性考量

  throw new Error('verifyAccessToken 尚未實作');
}

/**
 * 驗證 Refresh Token
 * TODO(human): 實作 Refresh Token 驗證邏輯
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  // TODO(human): 實作 Refresh Token 驗證
  // 學習重點：
  // - 不同的 secret 和 audience
  // - TokenId 的驗證邏輯
  // - 撤銷機制

  throw new Error('verifyRefreshToken 尚未實作');
}

/**
 * 解析 token（不驗證）
 * TODO(human): 實作 Token 解析邏輯
 */
export function decodeToken(token: string): any {
  // TODO(human): 實作 Token 解析
  // 學習重點：
  // - jwt.decode() 與 jwt.verify() 的差異
  // - 何時使用不驗證的解析
  // - 安全性注意事項

  throw new Error('decodeToken 尚未實作');
}

/**
 * 從 Authorization header 中提取 token
 * TODO(human): 實作 Token 提取邏輯
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  // TODO(human): 實作 Header Token 提取
  // 學習重點：
  // - Bearer Token 格式
  // - 正則表達式使用
  // - 邊界情況處理

  if (!authHeader) return null;

  // 提示：使用正則表達式匹配 "Bearer <token>" 格式
  // const match = authHeader.match(/^Bearer (.+)$/);
  // return match ? match[1] : null;

  throw new Error('extractTokenFromHeader 尚未實作');
}
