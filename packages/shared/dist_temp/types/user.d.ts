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
export declare enum UserStatus {
  /** 啟用 */
  ACTIVE = 'active',
  /** 未驗證 email */
  UNVERIFIED = 'unverified',
  /** 已暫停 */
  SUSPENDED = 'suspended',
  /** 已刪除 */
  DELETED = 'deleted',
}
export declare enum SystemRole {
  /** 系統管理員 */
  ADMIN = 'admin',
  /** 一般用戶 */
  USER = 'user',
}
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
  /** Email 是否已驗證 */
  emailVerified: boolean;
  /** Email 驗證 token */
  emailVerificationToken?: string;
  /** Email 驗證 token 過期時間 */
  emailVerificationExpires?: Date;
  /** 密碼重設 token */
  resetPasswordToken?: string;
  /** 密碼重設 token 過期時間 */
  resetPasswordExpires?: Date;
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
  /** 自定義設定 */
  customSettings?: Settings;
  /** 最後同意的服務條款版本 */
  tosVersion?: string;
  /** 最後同意的隱私政策版本 */
  privacyVersion?: string;
}
export interface PublicUser {
  id: EntityId;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}
export interface UserProfile
  extends Omit<
    User,
    'passwordHash' | 'emailVerificationToken' | 'resetPasswordToken' | 'security'
  > {}
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
  /** 當前所在的群組 ID */
  currentGroupId?: EntityId;
  /** session 中的權限快取 */
  permissions?: string[];
  /** 最後活動時間 */
  lastActivity: Date;
}
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
export declare const DEFAULT_USER_PREFERENCES: UserPreferences;
export declare const DEFAULT_USER_STATS: UserStats;
export declare const DEFAULT_USER_SECURITY: UserSecurity;
