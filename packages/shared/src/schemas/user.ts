/**
 * 用戶相關 Zod 驗證 schemas
 * 包含用戶實體、認證、設定等相關驗證規則
 */

import { z } from 'zod';
import {
  BaseEntitySchema,
  EntityIdSchema,
  EmailSchema,
  PasswordSchema,
  TimezoneSchema,
  LanguageCodeSchema,
  ContactInfoSchema,
  SettingsSchema,
  NotificationPreferencesSchema,
  UrlSchema,
} from './common';

// === 用戶狀態 schema ===
export const UserStatusSchema = z.enum(['active', 'unverified', 'suspended', 'deleted'], {
  errorMap: () => ({ message: '無效的用戶狀態' }),
});

// === 系統角色 schema ===
export const SystemRoleSchema = z.enum(['admin', 'user'], {
  errorMap: () => ({ message: '無效的系統角色' }),
});

// === 用戶偏好設定 schema ===
export const UserPreferencesSchema = z.object({
  language: LanguageCodeSchema,
  timezone: TimezoneSchema,
  dateFormat: z.string().min(1, '日期格式不能為空'),
  timeFormat: z.enum(['12h', '24h'], {
    errorMap: () => ({ message: '時間格式只能是 12h 或 24h' }),
  }),
  theme: z.enum(['light', 'dark', 'auto'], {
    errorMap: () => ({ message: '主題只能是 light、dark 或 auto' }),
  }),
  notifications: NotificationPreferencesSchema,
  showOnboarding: z.boolean(),
  sidebarCollapsed: z.boolean(),
});

// === 用戶統計 schema ===
export const UserStatsSchema = z.object({
  groupCount: z.number().min(0, '群組數量不能為負數'),
  surveyCount: z.number().min(0, '問卷數量不能為負數'),
  responseCount: z.number().min(0, '回應數量不能為負數'),
  lastLoginAt: z.date().optional(),
  lastActivityAt: z.date().optional(),
  loginCount: z.number().min(0, '登入次數不能為負數'),
});

// === 用戶安全設定 schema ===
export const UserSecuritySchema = z.object({
  twoFactorEnabled: z.boolean(),
  twoFactorSecret: z.string().optional(),
  backupCodes: z.array(z.string()).optional(),
  passwordChangedAt: z.date().optional(),
  trustedDevices: z
    .array(
      z.object({
        id: z.string().min(1, '設備 ID 不能為空'),
        name: z.string().min(1, '設備名稱不能為空'),
        lastUsed: z.date(),
        userAgent: z.string().min(1, 'User Agent 不能為空'),
      })
    )
    .optional(),
});

// === 完整用戶實體 schema ===
export const UserSchema = BaseEntitySchema.extend({
  email: EmailSchema,
  name: z.string().min(1, '用戶名稱不能為空').max(100, '用戶名稱長度不能超過 100 字元'),
  passwordHash: z.string().min(1, '密碼雜湊不能為空'),
  avatar: UrlSchema.optional(),
  status: UserStatusSchema,
  systemRole: SystemRoleSchema,

  // Email 驗證相關
  emailVerified: z.boolean(),
  emailVerificationToken: z.string().optional(),
  emailVerificationExpires: z.date().optional(),

  // 密碼重設相關
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),

  // 用戶資料
  bio: z.string().max(500, '個人簡介長度不能超過 500 字元').optional(),
  contactInfo: ContactInfoSchema.optional(),
  preferences: UserPreferencesSchema,
  stats: UserStatsSchema,
  security: UserSecuritySchema,

  // 擴展欄位
  customSettings: SettingsSchema.optional(),
  tosVersion: z.string().optional(),
  privacyVersion: z.string().optional(),
});

// === 公開用戶資訊 schema ===
export const PublicUserSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1, '用戶名稱不能為空'),
  avatar: UrlSchema.optional(),
  bio: z.string().max(500, '個人簡介長度不能超過 500 字元').optional(),
  createdAt: z.date(),
});

// === 用戶個人檔案 schema ===
export const UserProfileSchema = UserSchema.omit({
  passwordHash: true,
  emailVerificationToken: true,
  resetPasswordToken: true,
  security: true,
});

// === 認證用戶 schema ===
export const AuthUserSchema = z.object({
  id: EntityIdSchema,
  email: EmailSchema,
  name: z.string().min(1, '用戶名稱不能為空'),
  avatar: UrlSchema.optional(),
  status: UserStatusSchema,
  systemRole: SystemRoleSchema,
  emailVerified: z.boolean(),
  preferences: UserPreferencesSchema,
  stats: UserStatsSchema,

  // 當前 session 相關
  currentGroupId: EntityIdSchema.optional(),
  permissions: z.array(z.string()).optional(),
  lastActivity: z.date(),
});

// === 認證相關 DTO schemas ===
export const LoginCredentialsSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, '密碼不能為空'),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z.string().length(6, '雙因子認證碼必須是 6 位數字').optional(),
});

export const RegisterDataSchema = z
  .object({
    email: EmailSchema,
    name: z.string().min(1, '用戶名稱不能為空').max(100, '用戶名稱長度不能超過 100 字元'),
    password: PasswordSchema,
    invitationToken: z.string().optional(),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: '必須同意服務條款',
    }),
    agreeToPrivacy: z.boolean().refine(val => val === true, {
      message: '必須同意隱私政策',
    }),
  })
  .refine(
    data => {
      // 檢查密碼不能包含 email 或姓名
      const lowerPassword = data.password.toLowerCase();
      const lowerEmail = data.email.toLowerCase();
      const lowerName = data.name.toLowerCase();

      if (lowerPassword.includes(lowerEmail.split('@')[0]!) || lowerPassword.includes(lowerName)) {
        return false;
      }
      return true;
    },
    {
      message: '密碼不能包含 email 或姓名',
      path: ['password'],
    }
  );

export const UpdateProfileDataSchema = z.object({
  name: z.string().min(1, '用戶名稱不能為空').max(100, '用戶名稱長度不能超過 100 字元').optional(),
  bio: z.string().max(500, '個人簡介長度不能超過 500 字元').optional(),
  avatar: UrlSchema.optional(),
  contactInfo: ContactInfoSchema.partial().optional(),
  preferences: UserPreferencesSchema.partial().optional(),
});

export const ChangePasswordDataSchema = z
  .object({
    currentPassword: z.string().min(1, '當前密碼不能為空'),
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1, '確認密碼不能為空'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '新密碼與確認密碼不一致',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: '新密碼不能與當前密碼相同',
    path: ['newPassword'],
  });

export const ForgotPasswordDataSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordDataSchema = z
  .object({
    token: z.string().min(1, '重設 token 不能為空'),
    password: PasswordSchema,
    confirmPassword: z.string().min(1, '確認密碼不能為空'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '密碼與確認密碼不一致',
    path: ['confirmPassword'],
  });

// === JWT Token 相關 schemas ===
export const TokenPayloadSchema = z.object({
  userId: EntityIdSchema,
  email: EmailSchema,
  systemRole: SystemRoleSchema,
  currentGroupId: EntityIdSchema.optional(),
  type: z.enum(['access', 'refresh'], {
    errorMap: () => ({ message: 'Token 類型只能是 access 或 refresh' }),
  }),
  iat: z.number().min(0, '簽發時間必須是正數'),
  exp: z.number().min(0, '過期時間必須是正數'),
});

export const AuthTokensSchema = z.object({
  accessToken: z.string().min(1, 'Access token 不能為空'),
  refreshToken: z.string().min(1, 'Refresh token 不能為空'),
  expiresIn: z.number().min(0, '過期時間必須是正數'),
  tokenType: z.literal('Bearer'),
});

// === 用戶查詢和過濾 schemas ===
export const UserQuerySchema = z.object({
  search: z.string().optional(),
  status: z.array(UserStatusSchema).optional(),
  systemRole: z.array(SystemRoleSchema).optional(),
  emailVerified: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  lastLoginAfter: z.date().optional(),
  lastLoginBefore: z.date().optional(),
});

// === 用戶活動記錄 schema ===
export const UserActivitySchema = z.object({
  id: EntityIdSchema,
  userId: EntityIdSchema,
  type: z.enum(
    [
      'login',
      'logout',
      'profile_update',
      'password_change',
      'email_verify',
      'group_join',
      'group_leave',
    ],
    {
      errorMap: () => ({ message: '無效的活動類型' }),
    }
  ),
  description: z.string().min(1, '活動描述不能為空'),
  resourceId: EntityIdSchema.optional(),
  resourceType: z.string().optional(),
  ipAddress: z.string().ip('無效的 IP 地址').optional(),
  userAgent: z.string().optional(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

// === 預設值 schemas ===
export const DefaultUserPreferencesSchema = z.object({
  language: z.literal('zh-TW'),
  timezone: z.literal('Asia/Taipei'),
  dateFormat: z.literal('YYYY-MM-DD'),
  timeFormat: z.literal('24h'),
  theme: z.literal('auto'),
  notifications: z.object({
    email: z.literal(true),
    browser: z.literal(true),
    mobile: z.literal(true),
  }),
  showOnboarding: z.literal(true),
  sidebarCollapsed: z.literal(false),
});

export const DefaultUserStatsSchema = z.object({
  groupCount: z.literal(0),
  surveyCount: z.literal(0),
  responseCount: z.literal(0),
  loginCount: z.literal(0),
});

export const DefaultUserSecuritySchema = z.object({
  twoFactorEnabled: z.literal(false),
});

// === 驗證輔助函數 ===
export const validateUserRegistration = (data: unknown) => {
  return RegisterDataSchema.safeParse(data);
};

export const validateUserLogin = (data: unknown) => {
  return LoginCredentialsSchema.safeParse(data);
};

export const validatePasswordChange = (data: unknown) => {
  return ChangePasswordDataSchema.safeParse(data);
};

export const validateProfileUpdate = (data: unknown) => {
  return UpdateProfileDataSchema.safeParse(data);
};

// === 密碼強度檢查 ===
export const checkPasswordStrength = (password: string): { score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;

  // 長度檢查
  if (password.length >= 8) score += 1;
  else feedback.push('密碼至少需要 8 個字元');

  if (password.length >= 12) score += 1;

  // 字符類型檢查
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('需要包含小寫字母');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('需要包含大寫字母');

  if (/\d/.test(password)) score += 1;
  else feedback.push('需要包含數字');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('建議包含特殊字符');

  // 常見密碼檢查
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score -= 2;
    feedback.push('避免使用常見密碼');
  }

  return { score: Math.max(0, score), feedback };
};

// === Email 驗證輔助 ===
export const isValidEmailDomain = (email: string): boolean => {
  const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !blockedDomains.includes(domain) : false;
};
