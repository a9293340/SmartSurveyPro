/**
 * 群組和訂閱相關 Zod 驗證 schemas
 * 包含群組實體、訂閱方案、使用限制等相關驗證規則
 */

import { z } from 'zod';
import { BaseEntitySchema, EntityIdSchema, SettingsSchema, UrlSchema } from './common';

// === 訂閱方案層級 schema ===
export const SubscriptionTierSchema = z.enum(['free', 'pro', 'team', 'enterprise'], {
  errorMap: () => ({ message: '無效的訂閱方案' }),
});

// === 群組限制配置 schema ===
export const GroupLimitsSchema = z.object({
  maxMembers: z.number().min(-1, '成員上限不能小於 -1').int('成員上限必須是整數'),
  maxSurveys: z.number().min(-1, '問卷上限不能小於 -1').int('問卷上限必須是整數'),
  maxResponses: z.number().min(-1, '回應上限不能小於 -1').int('回應上限必須是整數'),
  maxStorage: z.number().min(-1, '儲存空間不能小於 -1').int('儲存空間必須是整數'),
  features: z.array(z.string().min(1, '功能名稱不能為空')),

  // AI 功能限制 (Phase 1 新增)
  maxAiCallsPerDay: z
    .number()
    .min(-1, '每日 AI 調用上限不能小於 -1')
    .int('每日 AI 調用上限必須是整數'),

  // 高級功能限制
  maxCustomRoles: z.number().min(-1, '自定義角色上限不能小於 -1').int('自定義角色上限必須是整數'),
  maxApiCalls: z.number().min(-1, 'API 調用上限不能小於 -1').int('API 調用上限必須是整數'),
  exportFormats: z.array(z.string().min(1, '匯出格式不能為空')),
  advancedAnalytics: z.boolean(),
  whiteLabel: z.boolean(),
});

// === 群組使用統計 schema ===
export const GroupStatsSchema = z.object({
  memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數'),
  surveyCount: z.number().min(0, '問卷數量不能為負數').int('問卷數量必須是整數'),
  monthlyResponses: z.number().min(0, '月回應數不能為負數').int('月回應數必須是整數'),
  storageUsed: z.number().min(0, '已使用儲存空間不能為負數'),
  apiCallsThisMonth: z.number().min(0, 'API 調用數不能為負數').int('API 調用數必須是整數'),

  // AI 功能統計 (Phase 1 新增)
  aiCallsToday: z.number().min(0, '今日 AI 調用數不能為負數').int('今日 AI 調用數必須是整數'),
  aiCallsDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'AI 調用統計日期格式必須是 YYYY-MM-DD'),

  // 統計週期
  statsMonth: z.string().regex(/^\d{4}-\d{2}$/, '統計月份格式必須是 YYYY-MM'),
  lastUpdated: z.date(),
});

// === 群組設定 schema ===
export const GroupSettingsSchema = z.object({
  allowMemberInvites: z.boolean(),
  isPublic: z.boolean(),
  defaultSurveyPublic: z.boolean(),
  requireApprovalForSurveys: z.boolean(),
  defaultTheme: z.string().optional(),
  customDomain: z
    .string()
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      '無效的域名格式'
    )
    .optional(),
  customSettings: SettingsSchema.optional(),
});

// === 完整群組實體 schema ===
export const GroupSchema = BaseEntitySchema.extend({
  name: z.string().min(1, '群組名稱不能為空').max(100, '群組名稱長度不能超過 100 字元'),
  ownerId: EntityIdSchema,

  // 訂閱相關
  subscriptionTier: SubscriptionTierSchema,
  subscriptionId: z.string().optional(),

  // 限制和統計
  limits: GroupLimitsSchema,
  stats: GroupStatsSchema,

  // 基本資訊
  description: z.string().max(500, '群組描述長度不能超過 500 字元').optional(),
  avatar: UrlSchema.optional(),
  settings: GroupSettingsSchema,
});

// === 公開群組資訊 schema ===
export const PublicGroupSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1, '群組名稱不能為空'),
  description: z.string().max(500, '群組描述長度不能超過 500 字元').optional(),
  avatar: UrlSchema.optional(),
  memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數'),
  isPublic: z.boolean(),
  subscriptionTier: SubscriptionTierSchema,
  createdAt: z.date(),
});

// === 群組摘要 schema ===
export const GroupSummarySchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1, '群組名稱不能為空'),
  description: z.string().max(500, '群組描述長度不能超過 500 字元').optional(),
  avatar: UrlSchema.optional(),
  ownerId: EntityIdSchema,
  subscriptionTier: SubscriptionTierSchema,
  memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數'),
  surveyCount: z.number().min(0, '問卷數量不能為負數').int('問卷數量必須是整數'),
  userRole: z.string().min(1, '用戶角色不能為空'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// === 群組相關 DTO schemas ===
export const CreateGroupDataSchema = z.object({
  name: z
    .string()
    .min(1, '群組名稱不能為空')
    .max(100, '群組名稱長度不能超過 100 字元')
    .regex(/^[^<>{}]*$/, '群組名稱不能包含特殊字符'),
  description: z.string().max(500, '群組描述長度不能超過 500 字元').optional(),
  settings: GroupSettingsSchema.partial().optional(),
});

export const UpdateGroupDataSchema = z.object({
  name: z
    .string()
    .min(1, '群組名稱不能為空')
    .max(100, '群組名稱長度不能超過 100 字元')
    .regex(/^[^<>{}]*$/, '群組名稱不能包含特殊字符')
    .optional(),
  description: z.string().max(500, '群組描述長度不能超過 500 字元').optional(),
  avatar: UrlSchema.optional(),
  settings: GroupSettingsSchema.partial().optional(),
});

export const UpdateGroupLimitsDataSchema = z.object({
  limits: GroupLimitsSchema.partial(),
  subscriptionTier: SubscriptionTierSchema.optional(),
});

// === 群組查詢和過濾 schema ===
export const GroupQuerySchema = z.object({
  search: z.string().optional(),
  subscriptionTier: z.array(SubscriptionTierSchema).optional(),
  ownedByMe: z.boolean().optional(),
  publicOnly: z.boolean().optional(),
  minMembers: z.number().min(0, '最小成員數不能為負數').int('最小成員數必須是整數').optional(),
  maxMembers: z.number().min(0, '最大成員數不能為負數').int('最大成員數必須是整數').optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
});

// === 群組成員相關 schema ===
export const GroupMemberSchema = z.object({
  userId: EntityIdSchema,
  groupId: EntityIdSchema,
  userName: z.string().min(1, '用戶名稱不能為空'),
  userEmail: z.string().email('無效的 email 格式'),
  userAvatar: UrlSchema.optional(),
  roleName: z.string().min(1, '角色名稱不能為空'),
  roleColor: z.string().optional(),
  status: z.enum(['active', 'pending', 'blocked'], {
    errorMap: () => ({ message: '無效的成員狀態' }),
  }),
  joinedAt: z.date(),
  invitedBy: EntityIdSchema.optional(),
  lastActivity: z.date().optional(),
});

export const GroupMemberQuerySchema = z.object({
  search: z.string().optional(),
  roles: z.array(z.string()).optional(),
  status: z.array(z.enum(['active', 'pending', 'blocked'])).optional(),
  joinedAfter: z.date().optional(),
  joinedBefore: z.date().optional(),
});

// === 群組限制檢查結果 schema ===
export const LimitCheckResultSchema = z.object({
  allowed: z.boolean(),
  current: z.number().min(0, '當前使用量不能為負數'),
  limit: z.number().min(-1, '限制值不能小於 -1'),
  usage: z.number().min(0, '使用率不能為負數').max(1, '使用率不能超過 1'),
  warning: z.string().optional(),
  suggestedTier: SubscriptionTierSchema.optional(),
});

// === 群組使用情況摘要 schema ===
export const GroupUsageSummarySchema = z.object({
  groupId: EntityIdSchema,
  subscriptionTier: SubscriptionTierSchema,
  limits: GroupLimitsSchema,
  usage: GroupStatsSchema,
  warnings: z.array(z.string()),
  recommendations: z.array(z.string()),

  // 各項使用率
  memberUsage: LimitCheckResultSchema,
  surveyUsage: LimitCheckResultSchema,
  responseUsage: LimitCheckResultSchema,
  storageUsage: LimitCheckResultSchema,
  apiUsage: LimitCheckResultSchema,
  aiUsage: LimitCheckResultSchema, // Phase 1 新增：AI 調用使用率檢查
});

// === 功能檢查輔助 schema ===
export const FeatureFlagSchema = z.enum(
  [
    'basic_surveys',
    'basic_analytics',
    'all_question_types',
    'logic_branching',
    'themes',
    'collaboration',
    'approval_workflow',
    'team_analytics',
    'sso',
    'custom_domain',
    'dedicated_support',
  ],
  {
    errorMap: () => ({ message: '無效的功能標識' }),
  }
);

// === 群組活動記錄 schema ===
export const GroupActivitySchema = z.object({
  id: EntityIdSchema,
  groupId: EntityIdSchema,
  userId: EntityIdSchema,
  type: z.enum(
    [
      'member_join',
      'member_leave',
      'member_invite',
      'survey_create',
      'survey_publish',
      'role_assign',
      'settings_update',
    ],
    {
      errorMap: () => ({ message: '無效的活動類型' }),
    }
  ),
  description: z.string().min(1, '活動描述不能為空'),
  resourceId: EntityIdSchema.optional(),
  resourceType: z.string().optional(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

// === 預設配置 schemas ===
export const DefaultGroupSettingsSchema = z.object({
  allowMemberInvites: z.literal(false),
  isPublic: z.literal(false),
  defaultSurveyPublic: z.literal(false),
  requireApprovalForSurveys: z.literal(false),
});

export const DefaultGroupStatsSchema = z.object({
  memberCount: z.literal(1),
  surveyCount: z.literal(0),
  monthlyResponses: z.literal(0),
  storageUsed: z.literal(0),
  apiCallsThisMonth: z.literal(0),
  aiCallsToday: z.literal(0), // Phase 1 新增
  aiCallsDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  statsMonth: z.string().regex(/^\d{4}-\d{2}$/),
  lastUpdated: z.date(),
});

// === 訂閱方案限制配置 schema ===
export const SubscriptionLimitsSchema = z.record(SubscriptionTierSchema, GroupLimitsSchema);

// === 驗證輔助函數 ===
export const validateGroupCreation = (data: unknown) => {
  return CreateGroupDataSchema.safeParse(data);
};

export const validateGroupUpdate = (data: unknown) => {
  return UpdateGroupDataSchema.safeParse(data);
};

export const validateGroupLimitsUpdate = (data: unknown) => {
  return UpdateGroupLimitsDataSchema.safeParse(data);
};

// === 群組名稱唯一性檢查 ===
export const validateGroupNameUniqueness = async (
  _name: string,
  _ownerId: string,
  _excludeGroupId?: string
): Promise<boolean> => {
  // 這裡應該實際查詢資料庫檢查名稱唯一性
  // 暫時返回 true，實際實作時需要查詢資料庫
  return true;
};

// === 限制檢查函數 ===
export const checkMemberLimit = (
  currentCount: number,
  limit: number
): z.infer<typeof LimitCheckResultSchema> => {
  const isUnlimited = limit === -1;
  const allowed = isUnlimited || currentCount < limit;
  const usage = isUnlimited ? 0 : Math.min(currentCount / limit, 1);

  return {
    allowed,
    current: currentCount,
    limit,
    usage,
    warning: !isUnlimited && usage > 0.8 ? '成員數量接近上限' : undefined,
    suggestedTier: !allowed ? 'pro' : undefined,
  };
};

export const checkStorageLimit = (
  currentUsage: number,
  limit: number
): z.infer<typeof LimitCheckResultSchema> => {
  const isUnlimited = limit === -1;
  const allowed = isUnlimited || currentUsage < limit;
  const usage = isUnlimited ? 0 : Math.min(currentUsage / limit, 1);

  return {
    allowed,
    current: currentUsage,
    limit,
    usage,
    warning: !isUnlimited && usage > 0.9 ? '儲存空間即將用完' : undefined,
    suggestedTier: !allowed ? 'team' : undefined,
  };
};

// === 功能可用性檢查 ===
export const hasFeature = (
  subscriptionTier: z.infer<typeof SubscriptionTierSchema>,
  feature: string
): boolean => {
  // 根據訂閱方案檢查功能是否可用
  // 這裡應該對應實際的 SUBSCRIPTION_LIMITS 配置
  const tierFeatures: Record<z.infer<typeof SubscriptionTierSchema>, string[]> = {
    free: ['basic_surveys', 'basic_analytics'],
    pro: ['basic_surveys', 'basic_analytics', 'all_question_types', 'logic_branching', 'themes'],
    team: [
      'basic_surveys',
      'basic_analytics',
      'all_question_types',
      'logic_branching',
      'themes',
      'collaboration',
      'approval_workflow',
      'team_analytics',
    ],
    enterprise: [
      'basic_surveys',
      'basic_analytics',
      'all_question_types',
      'logic_branching',
      'themes',
      'collaboration',
      'approval_workflow',
      'team_analytics',
      'sso',
      'custom_domain',
      'dedicated_support',
    ],
  };

  return tierFeatures[subscriptionTier]?.includes(feature) ?? false;
};
