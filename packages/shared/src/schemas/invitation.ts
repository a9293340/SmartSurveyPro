/**
 * 邀請系統相關 Zod 驗證 schemas
 * 包含邀請實體、邀請流程、邀請狀態等相關驗證規則
 */

import { z } from 'zod';
import { BaseEntitySchema, EntityIdSchema, EmailSchema, UrlSchema } from './common';

// === 邀請狀態 schema ===
export const InvitationStatusSchema = z.enum(
  ['pending', 'accepted', 'rejected', 'expired', 'cancelled'],
  {
    errorMap: () => ({ message: '無效的邀請狀態' }),
  }
);

// === 邀請類型 schema ===
export const InvitationTypeSchema = z.enum(['email', 'link', 'internal'], {
  errorMap: () => ({ message: '無效的邀請類型' }),
});

// === 完整邀請實體 schema ===
export const InvitationSchema = BaseEntitySchema.extend({
  groupId: EntityIdSchema,
  inviterId: EntityIdSchema,
  email: EmailSchema,
  roleId: EntityIdSchema,

  // 邀請資訊
  token: z.string().uuid('邀請 token 必須是有效的 UUID'),
  status: InvitationStatusSchema,
  type: InvitationTypeSchema,
  message: z.string().max(500, '邀請訊息長度不能超過 500 字元').optional(),

  // 時間相關
  expiresAt: z.date(),
  acceptedAt: z.date().optional(),
  rejectedAt: z.date().optional(),
  cancelledAt: z.date().optional(),

  // 額外資料
  source: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// === 邀請摘要 schema ===
export const InvitationSummarySchema = z.object({
  id: EntityIdSchema,
  groupId: EntityIdSchema,
  groupName: z.string().min(1, '群組名稱不能為空'),
  inviterName: z.string().min(1, '邀請人姓名不能為空'),
  inviterAvatar: UrlSchema.optional(),
  email: EmailSchema,
  roleName: z.string().min(1, '角色名稱不能為空'),
  roleColor: z.string().optional(),
  status: InvitationStatusSchema,
  type: InvitationTypeSchema,
  message: z.string().max(500, '邀請訊息長度不能超過 500 字元').optional(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

// === 邀請詳細資訊 schema ===
export const InvitationDetailsSchema = z.object({
  id: EntityIdSchema,
  token: z.string().uuid('邀請 token 必須是有效的 UUID'),
  status: InvitationStatusSchema,

  // 群組資訊
  group: z.object({
    id: EntityIdSchema,
    name: z.string().min(1, '群組名稱不能為空'),
    description: z.string().optional(),
    avatar: UrlSchema.optional(),
    memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數'),
    subscriptionTier: z.string().min(1, '訂閱方案不能為空'),
  }),

  // 邀請人資訊
  inviter: z.object({
    id: EntityIdSchema,
    name: z.string().min(1, '邀請人姓名不能為空'),
    email: EmailSchema,
    avatar: UrlSchema.optional(),
  }),

  // 角色資訊
  role: z.object({
    id: EntityIdSchema,
    name: z.string().min(1, '角色名稱不能為空'),
    description: z.string().optional(),
    color: z.string().optional(),
    permissions: z.array(z.string()),
  }),

  // 邀請資訊
  email: EmailSchema,
  message: z.string().max(500, '邀請訊息長度不能超過 500 字元').optional(),
  expiresAt: z.date(),
  createdAt: z.date(),

  // 被邀請人資訊
  invitee: z
    .object({
      id: EntityIdSchema,
      name: z.string().min(1, '用戶姓名不能為空'),
      avatar: UrlSchema.optional(),
      isRegistered: z.boolean(),
    })
    .optional(),
});

// === 邀請相關 DTO schemas ===
export const SendInvitationDataSchema = z.object({
  email: EmailSchema,
  roleId: EntityIdSchema,
  message: z.string().max(500, '邀請訊息長度不能超過 500 字元').optional(),
  type: InvitationTypeSchema.optional(),
  expiresAt: z
    .date()
    .refine(date => date > new Date(), {
      message: '過期時間必須是未來時間',
    })
    .optional(),
});

export const BulkInvitationDataSchema = z.object({
  invitations: z
    .array(
      z.object({
        email: EmailSchema,
        roleId: EntityIdSchema,
        message: z.string().max(500, '邀請訊息長度不能超過 500 字元').optional(),
      })
    )
    .min(1, '至少需要一個邀請')
    .max(50, '批次邀請不能超過 50 個'),
  defaultRoleId: EntityIdSchema.optional(),
  defaultMessage: z.string().max(500, '預設訊息長度不能超過 500 字元').optional(),
  type: InvitationTypeSchema.optional(),
});

export const AcceptInvitationDataSchema = z.object({
  token: z.string().uuid('邀請 token 必須是有效的 UUID'),
  userId: EntityIdSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const RejectInvitationDataSchema = z.object({
  token: z.string().uuid('邀請 token 必須是有效的 UUID'),
  reason: z.string().max(200, '拒絕原因長度不能超過 200 字元').optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const ResendInvitationDataSchema = z.object({
  invitationId: EntityIdSchema,
  newExpiresAt: z
    .date()
    .refine(date => date > new Date(), {
      message: '新過期時間必須是未來時間',
    })
    .optional(),
  newMessage: z.string().max(500, '新訊息長度不能超過 500 字元').optional(),
});

// === 邀請查詢和過濾 schema ===
export const InvitationQuerySchema = z.object({
  search: z.string().optional(),
  groupId: EntityIdSchema.optional(),
  inviterId: EntityIdSchema.optional(),
  status: z.array(InvitationStatusSchema).optional(),
  type: z.array(InvitationTypeSchema).optional(),
  roleIds: z.array(EntityIdSchema).optional(),
  includeExpired: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  expiresAfter: z.date().optional(),
  expiresBefore: z.date().optional(),
});

// === 邀請統計 schema ===
export const InvitationStatsSchema = z.object({
  total: z.number().min(0, '總數不能為負數').int('總數必須是整數'),
  pending: z.number().min(0, '待處理數不能為負數').int('待處理數必須是整數'),
  accepted: z.number().min(0, '已接受數不能為負數').int('已接受數必須是整數'),
  rejected: z.number().min(0, '已拒絕數不能為負數').int('已拒絕數必須是整數'),
  expired: z.number().min(0, '已過期數不能為負數').int('已過期數必須是整數'),
  cancelled: z.number().min(0, '已取消數不能為負數').int('已取消數必須是整數'),
  acceptanceRate: z.number().min(0, '接受率不能為負數').max(1, '接受率不能超過 1'),
  responseRate: z.number().min(0, '回應率不能為負數').max(1, '回應率不能超過 1'),
});

// === 批次邀請結果 schema ===
export const BulkInvitationResultSchema = z.object({
  total: z.number().min(0, '總數不能為負數').int('總數必須是整數'),
  success: z.number().min(0, '成功數不能為負數').int('成功數必須是整數'),
  failed: z.number().min(0, '失敗數不能為負數').int('失敗數必須是整數'),
  skipped: z.number().min(0, '跳過數不能為負數').int('跳過數必須是整數'),
  successful: z.array(InvitationSchema),
  failures: z.array(
    z.object({
      email: EmailSchema,
      error: z.string().min(1, '錯誤訊息不能為空'),
      code: z.string().optional(),
    })
  ),
  skipped_records: z.array(
    z.object({
      email: EmailSchema,
      reason: z.string().min(1, '跳過原因不能為空'),
    })
  ),
});

// === 邀請處理結果 schema ===
export const InvitationActionResultSchema = z.object({
  success: z.boolean(),
  message: z.string().min(1, '結果訊息不能為空'),
  redirectUrl: UrlSchema.optional(),
  data: z.record(z.unknown()).optional(),
});

// === 邀請驗證結果 schema ===
export const InvitationValidationResultSchema = z.object({
  valid: z.boolean(),
  reason: z.string().optional(),
  errorCode: z
    .enum([
      'EXPIRED',
      'NOT_FOUND',
      'ALREADY_ACCEPTED',
      'ALREADY_REJECTED',
      'CANCELLED',
      'INVALID_TOKEN',
    ])
    .optional(),
  invitation: InvitationDetailsSchema.optional(),
});

// === 邀請設定 schema ===
export const InvitationSettingsSchema = z.object({
  defaultExpirationDays: z
    .number()
    .min(1, '預設過期天數至少為 1 天')
    .max(365, '預設過期天數不能超過 365 天')
    .int('過期天數必須是整數'),
  maxExpirationDays: z
    .number()
    .min(1, '最大過期天數至少為 1 天')
    .max(365, '最大過期天數不能超過 365 天')
    .int('過期天數必須是整數'),
  allowResend: z.boolean(),
  resendIntervalHours: z
    .number()
    .min(1, '重新發送間隔至少為 1 小時')
    .max(168, '重新發送間隔不能超過 168 小時')
    .int('間隔小時必須是整數'),
  requireMessage: z.boolean(),
  maxMessageLength: z
    .number()
    .min(50, '訊息最大長度至少為 50 字元')
    .max(1000, '訊息最大長度不能超過 1000 字元')
    .int('長度必須是整數'),
  autoCleanupExpired: z.boolean(),
  cleanupAfterDays: z
    .number()
    .min(1, '清理天數至少為 1 天')
    .max(365, '清理天數不能超過 365 天')
    .int('清理天數必須是整數'),
});

// === 邀請模板 schema ===
export const InvitationTemplateSchema = z.object({
  id: z.string().min(1, '模板 ID 不能為空'),
  name: z.string().min(1, '模板名稱不能為空').max(100, '模板名稱長度不能超過 100 字元'),
  description: z.string().min(1, '模板描述不能為空').max(200, '模板描述長度不能超過 200 字元'),
  messageTemplate: z
    .string()
    .min(1, '訊息模板不能為空')
    .max(1000, '訊息模板長度不能超過 1000 字元'),
  subjectTemplate: z.string().min(1, '主題模板不能為空').max(200, '主題模板長度不能超過 200 字元'),
  applicableRoles: z.array(z.string()).optional(),
  isDefault: z.boolean(),
  category: z.enum(['general', 'role_specific', 'onboarding', 'collaboration'], {
    errorMap: () => ({ message: '無效的模板分類' }),
  }),
});

// === 邀請事件 schema ===
export const InvitationEventSchema = z.object({
  type: z.enum(
    [
      'invitation_sent',
      'invitation_accepted',
      'invitation_rejected',
      'invitation_expired',
      'invitation_cancelled',
    ],
    {
      errorMap: () => ({ message: '無效的邀請事件類型' }),
    }
  ),
  invitationId: EntityIdSchema,
  userId: EntityIdSchema.optional(),
  timestamp: z.date(),
  data: z.record(z.unknown()),
});

// === 邀請限制檢查 schema ===
export const InvitationLimitCheckSchema = z.object({
  allowed: z.boolean(),
  currentCount: z.number().min(0, '當前數量不能為負數').int('當前數量必須是整數'),
  limit: z.number().min(0, '限制數量不能為負數').int('限制數量必須是整數'),
  resetAt: z.date().optional(),
  reason: z.string().optional(),
});

// === 預設配置 schemas ===
export const DefaultInvitationSettingsSchema = z.object({
  defaultExpirationDays: z.literal(7),
  maxExpirationDays: z.literal(30),
  allowResend: z.literal(true),
  resendIntervalHours: z.literal(24),
  requireMessage: z.literal(false),
  maxMessageLength: z.literal(500),
  autoCleanupExpired: z.literal(true),
  cleanupAfterDays: z.literal(30),
});

export const DefaultInvitationTemplatesSchema = z.array(InvitationTemplateSchema);

// === 驗證輔助函數 ===
export const validateInvitationSending = (data: unknown) => {
  return SendInvitationDataSchema.safeParse(data);
};

export const validateBulkInvitation = (data: unknown) => {
  return BulkInvitationDataSchema.safeParse(data);
};

export const validateInvitationAcceptance = (data: unknown) => {
  return AcceptInvitationDataSchema.safeParse(data);
};

export const validateInvitationRejection = (data: unknown) => {
  return RejectInvitationDataSchema.safeParse(data);
};

// === 邀請業務驗證 ===
export const isInvitationExpired = (invitation: { expiresAt: Date }): boolean => {
  return new Date() > invitation.expiresAt;
};

export const canResendInvitation = (
  invitation: { status: string; createdAt: Date },
  settings: { allowResend: boolean; resendIntervalHours: number }
): boolean => {
  if (!settings.allowResend) return false;
  if (invitation.status !== 'pending') return false;

  const hoursSinceCreated = (Date.now() - invitation.createdAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreated >= settings.resendIntervalHours;
};

export const validateInvitationEmail = (
  email: string,
  existingEmails: string[]
): { valid: boolean; reason?: string } => {
  // 檢查 email 格式
  const emailResult = EmailSchema.safeParse(email);
  if (!emailResult.success) {
    return { valid: false, reason: 'Email 格式錯誤' };
  }

  // 檢查是否已存在
  if (existingEmails.includes(email.toLowerCase())) {
    return { valid: false, reason: '該 Email 已被邀請或已是成員' };
  }

  // 檢查域名黑名單
  const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && blockedDomains.includes(domain)) {
    return { valid: false, reason: '不允許使用臨時郵箱' };
  }

  return { valid: true };
};

// === 邀請模板變數替換 ===
export const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string>
): string => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

// === 邀請統計計算 ===
export const calculateInvitationStats = (
  invitations: Array<{ status: string }>
): z.infer<typeof InvitationStatsSchema> => {
  const total = invitations.length;
  const statusCounts = invitations.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pending = statusCounts.pending || 0;
  const accepted = statusCounts.accepted || 0;
  const rejected = statusCounts.rejected || 0;
  const expired = statusCounts.expired || 0;
  const cancelled = statusCounts.cancelled || 0;

  const responded = accepted + rejected;
  const acceptanceRate = responded > 0 ? accepted / responded : 0;
  const responseRate = total > 0 ? responded / total : 0;

  return {
    total,
    pending,
    accepted,
    rejected,
    expired,
    cancelled,
    acceptanceRate,
    responseRate,
  };
};
