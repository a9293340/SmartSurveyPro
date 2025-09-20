/**
 * 系統常數和預設配置
 * 匯出所有預設值、限制和系統配置
 */
export declare const USER_CONSTANTS: {
  /** 用戶名稱最小長度 */
  readonly MIN_NAME_LENGTH: 1;
  /** 用戶名稱最大長度 */
  readonly MAX_NAME_LENGTH: 100;
  /** 個人簡介最大長度 */
  readonly MAX_BIO_LENGTH: 500;
  /** 密碼最小長度 */
  readonly MIN_PASSWORD_LENGTH: 8;
  /** 密碼最大長度 */
  readonly MAX_PASSWORD_LENGTH: 128;
  /** Email 最大長度 */
  readonly MAX_EMAIL_LENGTH: 255;
  /** 雙因子認證碼長度 */
  readonly TWO_FACTOR_CODE_LENGTH: 6;
  /** 信任設備最大數量 */
  readonly MAX_TRUSTED_DEVICES: 10;
};
export declare const GROUP_CONSTANTS: {
  /** 群組名稱最小長度 */
  readonly MIN_NAME_LENGTH: 1;
  /** 群組名稱最大長度 */
  readonly MAX_NAME_LENGTH: 100;
  /** 群組描述最大長度 */
  readonly MAX_DESCRIPTION_LENGTH: 500;
  /** 預設成員上限 (FREE 方案) */
  readonly DEFAULT_MEMBER_LIMIT: 5;
  /** 預設問卷上限 (FREE 方案) */
  readonly DEFAULT_SURVEY_LIMIT: 3;
  /** 預設月回應上限 (FREE 方案) */
  readonly DEFAULT_RESPONSE_LIMIT: 100;
  /** 預設儲存空間上限 (FREE 方案, MB) */
  readonly DEFAULT_STORAGE_LIMIT: 50;
};
export declare const PERMISSION_CONSTANTS: {
  /** 角色名稱最小長度 */
  readonly MIN_ROLE_NAME_LENGTH: 1;
  /** 角色名稱最大長度 */
  readonly MAX_ROLE_NAME_LENGTH: 50;
  /** 角色描述最大長度 */
  readonly MAX_ROLE_DESCRIPTION_LENGTH: 200;
  /** 權限描述最大長度 */
  readonly MAX_PERMISSION_DESCRIPTION_LENGTH: 200;
  /** 單一角色最大權限數量 */
  readonly MAX_PERMISSIONS_PER_ROLE: 50;
  /** 萬用權限標識 */
  readonly WILDCARD_PERMISSION: '*';
};
export declare const INVITATION_CONSTANTS: {
  /** 預設過期天數 */
  readonly DEFAULT_EXPIRATION_DAYS: 7;
  /** 最大過期天數 */
  readonly MAX_EXPIRATION_DAYS: 30;
  /** 邀請訊息最大長度 */
  readonly MAX_MESSAGE_LENGTH: 500;
  /** 重新發送間隔 (小時) */
  readonly RESEND_INTERVAL_HOURS: 24;
  /** 批次邀請最大數量 */
  readonly MAX_BULK_INVITATIONS: 50;
  /** 自動清理過期邀請天數 */
  readonly AUTO_CLEANUP_DAYS: 30;
};
export declare const PAGINATION_CONSTANTS: {
  /** 預設每頁數量 */
  readonly DEFAULT_LIMIT: 20;
  /** 最大每頁數量 */
  readonly MAX_LIMIT: 100;
  /** 預設頁碼 */
  readonly DEFAULT_PAGE: 1;
  /** 預設排序方向 */
  readonly DEFAULT_SORT_ORDER: 'desc';
};
export declare const TIME_CONSTANTS: {
  /** JWT Access Token 過期時間 (秒) */
  readonly JWT_ACCESS_TOKEN_EXPIRES: 3600;
  /** JWT Refresh Token 過期時間 (秒) */
  readonly JWT_REFRESH_TOKEN_EXPIRES: 604800;
  /** Email 驗證 Token 過期時間 (秒) */
  readonly EMAIL_VERIFICATION_EXPIRES: 86400;
  /** 密碼重設 Token 過期時間 (秒) */
  readonly PASSWORD_RESET_EXPIRES: 3600;
};
export declare const SECURITY_CONSTANTS: {
  /** 密碼雜湊 rounds */
  readonly BCRYPT_ROUNDS: 12;
  /** 最大登入嘗試次數 */
  readonly MAX_LOGIN_ATTEMPTS: 5;
  /** 登入嘗試鎖定時間 (秒) */
  readonly LOGIN_LOCKOUT_TIME: 900;
  /** 被封鎖的 Email 域名 */
  readonly BLOCKED_EMAIL_DOMAINS: readonly [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
  ];
};
export declare const ERROR_CODES: {
  readonly UNKNOWN_ERROR: 'UNKNOWN_ERROR';
  readonly VALIDATION_ERROR: 'VALIDATION_ERROR';
  readonly NOT_FOUND: 'NOT_FOUND';
  readonly UNAUTHORIZED: 'UNAUTHORIZED';
  readonly FORBIDDEN: 'FORBIDDEN';
  readonly USER_NOT_FOUND: 'USER_NOT_FOUND';
  readonly EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS';
  readonly INVALID_CREDENTIALS: 'INVALID_CREDENTIALS';
  readonly EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED';
  readonly GROUP_NOT_FOUND: 'GROUP_NOT_FOUND';
  readonly MEMBER_LIMIT_EXCEEDED: 'MEMBER_LIMIT_EXCEEDED';
  readonly PERMISSION_DENIED: 'PERMISSION_DENIED';
  readonly ROLE_NOT_FOUND: 'ROLE_NOT_FOUND';
  readonly INVITATION_NOT_FOUND: 'INVITATION_NOT_FOUND';
  readonly INVITATION_EXPIRED: 'INVITATION_EXPIRED';
};
export declare const SYSTEM_DEFAULTS: {
  /** 預設語言 */
  readonly DEFAULT_LANGUAGE: 'zh-TW';
  /** 預設時區 */
  readonly DEFAULT_TIMEZONE: 'Asia/Taipei';
  /** 預設日期格式 */
  readonly DEFAULT_DATE_FORMAT: 'YYYY-MM-DD';
  /** 預設時間格式 */
  readonly DEFAULT_TIME_FORMAT: '24h';
  /** 預設主題 */
  readonly DEFAULT_THEME: 'auto';
  /** 預設訂閱方案 */
  readonly DEFAULT_SUBSCRIPTION_TIER: 'free';
};
export type UserConstants = typeof USER_CONSTANTS;
export type GroupConstants = typeof GROUP_CONSTANTS;
export type PermissionConstants = typeof PERMISSION_CONSTANTS;
export type InvitationConstants = typeof INVITATION_CONSTANTS;
export type PaginationConstants = typeof PAGINATION_CONSTANTS;
export type TimeConstants = typeof TIME_CONSTANTS;
export type SecurityConstants = typeof SECURITY_CONSTANTS;
export type ErrorCodes = typeof ERROR_CODES;
export type SystemDefaults = typeof SYSTEM_DEFAULTS;
