/**
 * 系統常數和預設配置
 * 匯出所有預設值、限制和系統配置
 */

// === 用戶相關常數 ===
export const USER_CONSTANTS = {
  /** 用戶名稱最小長度 */
  MIN_NAME_LENGTH: 1,
  /** 用戶名稱最大長度 */
  MAX_NAME_LENGTH: 100,
  /** 個人簡介最大長度 */
  MAX_BIO_LENGTH: 500,
  /** 密碼最小長度 */
  MIN_PASSWORD_LENGTH: 8,
  /** 密碼最大長度 */
  MAX_PASSWORD_LENGTH: 128,
  /** Email 最大長度 */
  MAX_EMAIL_LENGTH: 255,
  /** 雙因子認證碼長度 */
  TWO_FACTOR_CODE_LENGTH: 6,
  /** 信任設備最大數量 */
  MAX_TRUSTED_DEVICES: 10,
} as const;

// === 群組相關常數 ===
export const GROUP_CONSTANTS = {
  /** 群組名稱最小長度 */
  MIN_NAME_LENGTH: 1,
  /** 群組名稱最大長度 */
  MAX_NAME_LENGTH: 100,
  /** 群組描述最大長度 */
  MAX_DESCRIPTION_LENGTH: 500,
  /** 預設成員上限 (FREE 方案) */
  DEFAULT_MEMBER_LIMIT: 5,
  /** 預設問卷上限 (FREE 方案) */
  DEFAULT_SURVEY_LIMIT: 3,
  /** 預設月回應上限 (FREE 方案) */
  DEFAULT_RESPONSE_LIMIT: 100,
  /** 預設儲存空間上限 (FREE 方案, MB) */
  DEFAULT_STORAGE_LIMIT: 50,
} as const;

// === 權限相關常數 ===
export const PERMISSION_CONSTANTS = {
  /** 角色名稱最小長度 */
  MIN_ROLE_NAME_LENGTH: 1,
  /** 角色名稱最大長度 */
  MAX_ROLE_NAME_LENGTH: 50,
  /** 角色描述最大長度 */
  MAX_ROLE_DESCRIPTION_LENGTH: 200,
  /** 權限描述最大長度 */
  MAX_PERMISSION_DESCRIPTION_LENGTH: 200,
  /** 單一角色最大權限數量 */
  MAX_PERMISSIONS_PER_ROLE: 50,
  /** 萬用權限標識 */
  WILDCARD_PERMISSION: '*',
} as const;

// === 邀請相關常數 ===
export const INVITATION_CONSTANTS = {
  /** 預設過期天數 */
  DEFAULT_EXPIRATION_DAYS: 7,
  /** 最大過期天數 */
  MAX_EXPIRATION_DAYS: 30,
  /** 邀請訊息最大長度 */
  MAX_MESSAGE_LENGTH: 500,
  /** 重新發送間隔 (小時) */
  RESEND_INTERVAL_HOURS: 24,
  /** 批次邀請最大數量 */
  MAX_BULK_INVITATIONS: 50,
  /** 自動清理過期邀請天數 */
  AUTO_CLEANUP_DAYS: 30,
} as const;

// === 分頁相關常數 ===
export const PAGINATION_CONSTANTS = {
  /** 預設每頁數量 */
  DEFAULT_LIMIT: 20,
  /** 最大每頁數量 */
  MAX_LIMIT: 100,
  /** 預設頁碼 */
  DEFAULT_PAGE: 1,
  /** 預設排序方向 */
  DEFAULT_SORT_ORDER: 'desc' as const,
} as const;

// === 時間相關常數 ===
export const TIME_CONSTANTS = {
  /** JWT Access Token 過期時間 (秒) */
  JWT_ACCESS_TOKEN_EXPIRES: 3600, // 1 小時
  /** JWT Refresh Token 過期時間 (秒) */
  JWT_REFRESH_TOKEN_EXPIRES: 604800, // 7 天
  /** Email 驗證 Token 過期時間 (秒) */
  EMAIL_VERIFICATION_EXPIRES: 86400, // 24 小時
  /** 密碼重設 Token 過期時間 (秒) */
  PASSWORD_RESET_EXPIRES: 3600, // 1 小時
} as const;

// === 安全相關常數 ===
export const SECURITY_CONSTANTS = {
  /** 密碼雜湊 rounds */
  BCRYPT_ROUNDS: 12,
  /** 最大登入嘗試次數 */
  MAX_LOGIN_ATTEMPTS: 5,
  /** 登入嘗試鎖定時間 (秒) */
  LOGIN_LOCKOUT_TIME: 900, // 15 分鐘
  /** 被封鎖的 Email 域名 */
  BLOCKED_EMAIL_DOMAINS: ['tempmail.com', '10minutemail.com', 'guerrillamail.com'] as const,
} as const;

// === 錯誤代碼 ===
export const ERROR_CODES = {
  // 通用錯誤
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // 用戶相關錯誤
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // 群組相關錯誤
  GROUP_NOT_FOUND: 'GROUP_NOT_FOUND',
  MEMBER_LIMIT_EXCEEDED: 'MEMBER_LIMIT_EXCEEDED',

  // 權限相關錯誤
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',

  // 邀請相關錯誤
  INVITATION_NOT_FOUND: 'INVITATION_NOT_FOUND',
  INVITATION_EXPIRED: 'INVITATION_EXPIRED',
} as const;

// === 系統預設值 ===
export const SYSTEM_DEFAULTS = {
  /** 預設語言 */
  DEFAULT_LANGUAGE: 'zh-TW',
  /** 預設時區 */
  DEFAULT_TIMEZONE: 'Asia/Taipei',
  /** 預設日期格式 */
  DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',
  /** 預設時間格式 */
  DEFAULT_TIME_FORMAT: '24h' as const,
  /** 預設主題 */
  DEFAULT_THEME: 'auto' as const,
  /** 預設訂閱方案 */
  DEFAULT_SUBSCRIPTION_TIER: 'free' as const,
} as const;

// === 匯出所有常數類型 ===
export type UserConstants = typeof USER_CONSTANTS;
export type GroupConstants = typeof GROUP_CONSTANTS;
export type PermissionConstants = typeof PERMISSION_CONSTANTS;
export type InvitationConstants = typeof INVITATION_CONSTANTS;
export type PaginationConstants = typeof PAGINATION_CONSTANTS;
export type TimeConstants = typeof TIME_CONSTANTS;
export type SecurityConstants = typeof SECURITY_CONSTANTS;
export type ErrorCodes = typeof ERROR_CODES;
export type SystemDefaults = typeof SYSTEM_DEFAULTS;
