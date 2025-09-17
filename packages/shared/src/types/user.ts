/**
 * 用戶相關類型定義
 * 包含用戶實體、認證、設定等相關介面
 */

import {
  type BaseEntity,
  type EntityId,
  type NotificationPreferences,
  type ContactInfo,
  type Settings,
} from './common';

// === 用戶狀態 ===
export enum UserStatus {
  /** 啟用 */
  ACTIVE = 'active',
  /** 未驗證 email */
  UNVERIFIED = 'unverified',
  /** 已暫停 */
  SUSPENDED = 'suspended',
  /** 已刪除 */
  DELETED = 'deleted',
}

// === 訂閱相關類型已移至 group.ts ===
// 🔴 重要：PlanType、PlanLimits 等訂閱相關類型現在定義在 group.ts 中
// 因為訂閱是以 Group 為單位，而非個人用戶

// === 用戶角色（系統層級，非群組層級） ===
export enum SystemRole {
  /** 系統管理員 */
  ADMIN = 'admin',
  /** 一般用戶 */
  USER = 'user',
}

// === 用戶偏好設定 ===
export interface UserPreferences {
  /** 語言偏好 */
  language: string;
  /** 時區 */
  timezone: string;
  /** 日期格式 */
  dateFormat: string;
  /** 時間格式 */
  timeFormat: '12h' | '24h';
  /** 主題偏好 */
  theme: 'light' | 'dark' | 'auto';
  /** 通知偏好 */
  notifications: NotificationPreferences;
  /** 是否顯示新手導引 */
  showOnboarding: boolean;
  /** 側邊欄是否收合 */
  sidebarCollapsed: boolean;
}

// === 用戶統計資訊 ===
export interface UserStats {
  /** 參與的群組數量 */
  groupCount: number;
  /** 創建的問卷數量 */
  surveyCount: number;
  /** 收到的回應數量 */
  responseCount: number;
  /** 最後登入時間 */
  lastLoginAt?: Date;
  /** 最後活動時間 */
  lastActivityAt?: Date;
  /** 登入次數 */
  loginCount: number;
}

// === 用戶安全設定 ===
export interface UserSecurity {
  /** 是否啟用雙因子認證 */
  twoFactorEnabled: boolean;
  /** 雙因子認證密鑰 */
  twoFactorSecret?: string;
  /** 備份恢復碼 */
  backupCodes?: string[];
  /** 上次密碼變更時間 */
  passwordChangedAt?: Date;
  /** 信任的設備列表 */
  trustedDevices?: Array<{
    id: string;
    name: string;
    lastUsed: Date;
    userAgent: string;
  }>;
}

// === 完整用戶實體 ===
export interface User extends BaseEntity {
  /** Email 地址（唯一） */
  email: string;
  /** 用戶名稱 */
  name: string;
  /** 密碼雜湊 */
  passwordHash: string;
  /** 頭像 URL */
  avatar?: string;
  /** 用戶狀態 */
  status: UserStatus;
  /** 系統角色 */
  systemRole: SystemRole;

  // === 訂閱相關已移除 ===
  // 🔴 重要：訂閱資訊已移至 Group，User 不再直接擁有 planType
  // User 透過加入 Group 來獲得訂閱權益

  // === Email 驗證相關 ===
  /** Email 是否已驗證 */
  emailVerified: boolean;
  /** Email 驗證 token */
  emailVerificationToken?: string;
  /** Email 驗證 token 過期時間 */
  emailVerificationExpires?: Date;

  // === 密碼重設相關 ===
  /** 密碼重設 token */
  resetPasswordToken?: string;
  /** 密碼重設 token 過期時間 */
  resetPasswordExpires?: Date;

  // === 用戶資料 ===
  /** 個人簡介 */
  bio?: string;
  /** 聯絡資訊 */
  contactInfo?: ContactInfo;
  /** 用戶偏好設定 */
  preferences: UserPreferences;
  /** 用戶統計 */
  stats: UserStats;
  /** 安全設定 */
  security: UserSecurity;

  // === 擴展欄位 ===
  /** 自定義設定 */
  customSettings?: Settings;
  /** 最後同意的服務條款版本 */
  tosVersion?: string;
  /** 最後同意的隱私政策版本 */
  privacyVersion?: string;
}

// === 公開用戶資訊（不包含敏感資料） ===
export interface PublicUser {
  id: EntityId;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

// === 用戶個人檔案（用戶自己可見） ===
export interface UserProfile
  extends Omit<
    User,
    'passwordHash' | 'emailVerificationToken' | 'resetPasswordToken' | 'security'
  > {
  // 移除敏感欄位的用戶檔案
}

// === 認證用戶（登入後的用戶資訊） ===
export interface AuthUser {
  id: EntityId;
  email: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  systemRole: SystemRole;
  emailVerified: boolean;
  preferences: UserPreferences;
  stats: UserStats;

  // === 訂閱相關已移除 ===
  // 🔴 重要：User 不再直接擁有訂閱資訊
  // 訂閱權益透過所屬的 Group 來確定

  // === 當前 session 相關 ===
  /** 當前所在的群組 ID */
  currentGroupId?: EntityId;
  /** session 中的權限快取 */
  permissions?: string[];
  /** 最後活動時間 */
  lastActivity: Date;
}

// === 認證相關 DTO ===
export interface LoginCredentials {
  email: string;
  password: string;
  /** 記住我 */
  rememberMe?: boolean;
  /** 雙因子認證碼 */
  twoFactorCode?: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  /** 邀請 token（如果是通過邀請註冊） */
  invitationToken?: string;
  /** 同意服務條款 */
  agreeToTerms: boolean;
  /** 同意隱私政策 */
  agreeToPrivacy: boolean;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
  contactInfo?: Partial<ContactInfo>;
  preferences?: Partial<UserPreferences>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// === JWT Token 相關 ===
export interface TokenPayload {
  /** 用戶 ID */
  userId: EntityId;
  /** 用戶 email */
  email: string;
  /** 系統角色 */
  systemRole: SystemRole;
  /** 當前群組 ID */
  currentGroupId?: EntityId;
  /** Token 類型 */
  type: 'access' | 'refresh';
  /** 簽發時間 */
  iat: number;
  /** 過期時間 */
  exp: number;
}

export interface AuthTokens {
  /** 存取 token */
  accessToken: string;
  /** 刷新 token */
  refreshToken: string;
  /** 存取 token 過期時間 */
  expiresIn: number;
  /** token 類型 */
  tokenType: 'Bearer';
}

// === 用戶查詢和過濾 ===
export interface UserQuery {
  /** 搜尋關鍵字（姓名或 email） */
  search?: string;
  /** 用戶狀態過濾 */
  status?: UserStatus[];
  /** 系統角色過濾 */
  systemRole?: SystemRole[];
  /** Email 驗證狀態 */
  emailVerified?: boolean;
  /** 創建時間範圍 */
  createdAfter?: Date;
  createdBefore?: Date;
  /** 最後登入時間範圍 */
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
}

// === 用戶活動記錄 ===
export interface UserActivity {
  id: EntityId;
  userId: EntityId;
  /** 活動類型 */
  type:
    | 'login'
    | 'logout'
    | 'profile_update'
    | 'password_change'
    | 'email_verify'
    | 'group_join'
    | 'group_leave';
  /** 活動描述 */
  description: string;
  /** 相關資源 ID */
  resourceId?: EntityId;
  /** 資源類型 */
  resourceType?: string;
  /** IP 地址 */
  ipAddress?: string;
  /** User Agent */
  userAgent?: string;
  /** 活動時間 */
  timestamp: Date;
  /** 額外資料 */
  metadata?: Record<string, unknown>;
}

// === 預設值 ===
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'zh-TW',
  timezone: 'Asia/Taipei',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  theme: 'auto',
  notifications: {
    email: true,
    browser: true,
    mobile: true,
  },
  showOnboarding: true,
  sidebarCollapsed: false,
};

export const DEFAULT_USER_STATS: UserStats = {
  groupCount: 0,
  surveyCount: 0,
  responseCount: 0,
  loginCount: 0,
};

export const DEFAULT_USER_SECURITY: UserSecurity = {
  twoFactorEnabled: false,
};

// === 訂閱相關配置已移至 group.ts ===
// 🔴 重要：SUBSCRIPTION_LIMITS 等配置現在定義在 group.ts 中
// 請使用 group.ts 中的 SUBSCRIPTION_LIMITS 和相關工具函數

// === 訂閱相關預設值已移至 Group ===
// 🔴 重要：訂閱預設值現在定義在 Group 相關類型中
// 這些配置將用於新建 Group 時的預設設定
