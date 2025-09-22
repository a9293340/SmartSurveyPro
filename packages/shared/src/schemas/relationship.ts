/**
 * 關聯表相關 Zod 驗證 schemas
 * 包含用戶-群組-角色關聯、成員管理等相關驗證規則
 */

import { z } from 'zod';
import { BaseEntitySchema, EntityIdSchema, EmailSchema, UrlSchema } from './common.js';

// === 用戶群組狀態 schema ===
export const UserGroupStatusSchema = z.enum(['active', 'pending', 'blocked', 'removed'], {
  errorMap: () => ({ message: '無效的用戶群組狀態' }),
});

// === 加入來源 schema ===
export const JoinSourceSchema = z.enum(['invitation', 'direct', 'import', 'system'], {
  errorMap: () => ({ message: '無效的加入來源' }),
});

// === 用戶群組角色關聯表 schema ===
export const UserGroupRoleSchema = BaseEntitySchema.extend({
  userId: EntityIdSchema,
  groupId: EntityIdSchema,
  roleId: EntityIdSchema,

  // 狀態資訊
  status: UserGroupStatusSchema,
  joinedAt: z.date(),
  invitedBy: EntityIdSchema.optional(),

  // 額外資訊
  lastActivityAt: z.date().optional(),
  removedAt: z.date().optional(),
  removedBy: EntityIdSchema.optional(),
  removeReason: z.string().max(200, '移除原因長度不能超過 200 字元').optional(),

  // 元數據
  joinSource: JoinSourceSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

// === 成員詳細資訊 schema ===
export const MemberDetailsSchema = z.object({
  // 關聯資訊
  relationshipId: EntityIdSchema,
  userId: EntityIdSchema,
  groupId: EntityIdSchema,
  roleId: EntityIdSchema,
  status: UserGroupStatusSchema,
  joinedAt: z.date(),
  lastActivityAt: z.date().optional(),

  // 用戶資訊
  user: z.object({
    id: EntityIdSchema,
    name: z.string().min(1, '用戶名稱不能為空'),
    email: EmailSchema,
    avatar: UrlSchema.optional(),
    emailVerified: z.boolean(),
    lastLoginAt: z.date().optional(),
  }),

  // 角色資訊
  role: z.object({
    id: EntityIdSchema,
    name: z.string().min(1, '角色名稱不能為空'),
    description: z.string().optional(),
    color: z.string().optional(),
    isSystemRole: z.boolean(),
    permissions: z.array(z.string()),
  }),

  // 邀請資訊
  invitedBy: z
    .object({
      id: EntityIdSchema,
      name: z.string().min(1, '邀請人姓名不能為空'),
      email: EmailSchema,
    })
    .optional(),

  // 統計資訊
  stats: z
    .object({
      surveysCreated: z.number().min(0, '創建問卷數不能為負數').int('創建問卷數必須是整數'),
      responsesReceived: z.number().min(0, '收到回應數不能為負數').int('收到回應數必須是整數'),
      lastSurveyAt: z.date().optional(),
      activityScore: z.number().min(0, '活動分數不能為負數').max(100, '活動分數不能超過 100'),
    })
    .optional(),
});

// === 成員摘要 schema ===
export const MemberSummarySchema = z.object({
  relationshipId: EntityIdSchema,
  userId: EntityIdSchema,
  userName: z.string().min(1, '用戶名稱不能為空'),
  userEmail: EmailSchema,
  userAvatar: UrlSchema.optional(),
  roleName: z.string().min(1, '角色名稱不能為空'),
  roleColor: z.string().optional(),
  status: UserGroupStatusSchema,
  joinedAt: z.date(),
  lastActivityAt: z.date().optional(),
  isOnline: z.boolean().optional(),
});

// === 成員管理相關 DTO schemas ===
export const AddMemberDataSchema = z.object({
  userId: EntityIdSchema,
  roleId: EntityIdSchema,
  joinSource: JoinSourceSchema.optional(),
  invitedBy: EntityIdSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const UpdateMemberRoleDataSchema = z.object({
  relationshipId: EntityIdSchema,
  newRoleId: EntityIdSchema,
  reason: z.string().max(200, '更新原因長度不能超過 200 字元').optional(),
});

export const UpdateMemberStatusDataSchema = z.object({
  relationshipId: EntityIdSchema,
  newStatus: UserGroupStatusSchema,
  reason: z.string().max(200, '狀態變更原因長度不能超過 200 字元').optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const RemoveMemberDataSchema = z.object({
  relationshipId: EntityIdSchema,
  reason: z.string().max(200, '移除原因長度不能超過 200 字元').optional(),
  softDelete: z.boolean().optional(),
});

export const BulkMemberOperationDataSchema = z.object({
  relationshipIds: z
    .array(EntityIdSchema)
    .min(1, '至少需要選擇一個成員')
    .max(100, '批次操作不能超過 100 個成員'),
  operation: z.enum(['update_role', 'update_status', 'remove'], {
    errorMap: () => ({ message: '無效的批次操作類型' }),
  }),
  params: z.object({
    newRoleId: EntityIdSchema.optional(),
    newStatus: UserGroupStatusSchema.optional(),
    reason: z.string().max(200, '操作原因長度不能超過 200 字元').optional(),
  }),
});

// === 成員查詢和過濾 schema ===
export const MemberQuerySchema = z.object({
  search: z.string().optional(),
  roleIds: z.array(EntityIdSchema).optional(),
  status: z.array(UserGroupStatusSchema).optional(),
  onlineOnly: z.boolean().optional(),
  joinedAfter: z.date().optional(),
  joinedBefore: z.date().optional(),
  lastActivityAfter: z.date().optional(),
  lastActivityBefore: z.date().optional(),
  joinSources: z.array(JoinSourceSchema).optional(),
  invitedBy: EntityIdSchema.optional(),
  includeRemoved: z.boolean().optional(),
});

// === 批次操作結果 schema ===
export const BulkMemberOperationResultSchema = z.object({
  total: z.number().min(0, '總數不能為負數').int('總數必須是整數'),
  success: z.number().min(0, '成功數不能為負數').int('成功數必須是整數'),
  failed: z.number().min(0, '失敗數不能為負數').int('失敗數必須是整數'),
  skipped: z.number().min(0, '跳過數不能為負數').int('跳過數必須是整數'),
  successful: z.array(EntityIdSchema),
  failures: z.array(
    z.object({
      relationshipId: EntityIdSchema,
      error: z.string().min(1, '錯誤訊息不能為空'),
      code: z.string().optional(),
    })
  ),
  skipped_records: z.array(
    z.object({
      relationshipId: EntityIdSchema,
      reason: z.string().min(1, '跳過原因不能為空'),
    })
  ),
});

// === 成員活動記錄 schema ===
export const MemberActivitySchema = z.object({
  id: EntityIdSchema,
  relationshipId: EntityIdSchema,
  userId: EntityIdSchema,
  groupId: EntityIdSchema,
  type: z.enum(
    ['join', 'leave', 'role_change', 'status_change', 'activity', 'login', 'survey_action'],
    {
      errorMap: () => ({ message: '無效的成員活動類型' }),
    }
  ),
  description: z.string().min(1, '活動描述不能為空').max(500, '活動描述長度不能超過 500 字元'),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  resourceId: EntityIdSchema.optional(),
  actorId: EntityIdSchema.optional(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

// === 成員統計 schema ===
export const MemberStatsSchema = z.object({
  total: z.number().min(0, '總數不能為負數').int('總數必須是整數'),
  active: z.number().min(0, '活躍數不能為負數').int('活躍數必須是整數'),
  pending: z.number().min(0, '待處理數不能為負數').int('待處理數必須是整數'),
  blocked: z.number().min(0, '封鎖數不能為負數').int('封鎖數必須是整數'),
  newThisMonth: z.number().min(0, '本月新增數不能為負數').int('本月新增數必須是整數'),
  byRole: z.record(z.string(), z.number().min(0).int()),
  byJoinSource: z.record(z.string(), z.number().min(0).int()),
  averageDaysActive: z.number().min(0, '平均活躍天數不能為負數'),
  activeRate: z.number().min(0, '活躍率不能為負數').max(1, '活躍率不能超過 1'),
});

// === 成員權限摘要 schema ===
export const MemberPermissionSummarySchema = z.object({
  relationshipId: EntityIdSchema,
  userId: EntityIdSchema,
  groupId: EntityIdSchema,
  roleId: EntityIdSchema,
  roleName: z.string().min(1, '角色名稱不能為空'),
  permissions: z.array(z.string()),
  isOwner: z.boolean(),
  isAdmin: z.boolean(),
  permissionLevel: z
    .number()
    .min(0, '權限等級不能為負數')
    .max(100, '權限等級不能超過 100')
    .int('權限等級必須是整數'),
  canManageMembers: z.array(EntityIdSchema),
});

// === 角色轉移 schema ===
export const RoleTransferDataSchema = z.object({
  fromRelationshipId: EntityIdSchema,
  toRelationshipId: EntityIdSchema,
  roleId: EntityIdSchema,
  reason: z.string().max(200, '轉移原因長度不能超過 200 字元').optional(),
  immediate: z.boolean().optional(),
});

// === 成員邀請統計 schema ===
export const MemberInviteStatsSchema = z.object({
  totalInvites: z.number().min(0, '總邀請數不能為負數').int('總邀請數必須是整數'),
  successfulJoins: z.number().min(0, '成功加入數不能為負數').int('成功加入數必須是整數'),
  pendingInvites: z.number().min(0, '待處理邀請數不能為負數').int('待處理邀請數必須是整數'),
  successRate: z.number().min(0, '成功率不能為負數').max(1, '成功率不能超過 1'),
  byInviter: z.array(
    z.object({
      inviterId: EntityIdSchema,
      inviterName: z.string().min(1, '邀請人姓名不能為空'),
      inviteCount: z.number().min(0, '邀請數不能為負數').int('邀請數必須是整數'),
      successCount: z.number().min(0, '成功數不能為負數').int('成功數必須是整數'),
      successRate: z.number().min(0, '成功率不能為負數').max(1, '成功率不能超過 1'),
    })
  ),
});

// === 成員操作日誌 schema ===
export const MemberOperationLogSchema = z.object({
  id: EntityIdSchema,
  relationshipId: EntityIdSchema,
  operation: z.enum(['add', 'remove', 'role_change', 'status_change', 'permission_change'], {
    errorMap: () => ({ message: '無效的操作類型' }),
  }),
  operatorId: EntityIdSchema,
  operatorName: z.string().min(1, '操作者名稱不能為空'),
  targetUserId: EntityIdSchema,
  targetUserName: z.string().min(1, '目標用戶名稱不能為空'),
  details: z.string().min(1, '操作詳情不能為空').max(1000, '操作詳情長度不能超過 1000 字元'),
  beforeState: z.record(z.unknown()).optional(),
  afterState: z.record(z.unknown()).optional(),
  timestamp: z.date(),
  ipAddress: z.string().ip('無效的 IP 地址').optional(),
  userAgent: z.string().optional(),
});

// === 快速操作 schema ===
export const QuickMemberActionSchema = z.enum(
  ['promote_to_admin', 'demote_to_editor', 'demote_to_viewer', 'block', 'unblock', 'remove'],
  {
    errorMap: () => ({ message: '無效的快速操作類型' }),
  }
);

export const QuickMemberActionDataSchema = z.object({
  relationshipId: EntityIdSchema,
  action: QuickMemberActionSchema,
  reason: z.string().max(200, '操作原因長度不能超過 200 字元').optional(),
});

// === 預設配置 schemas ===
export const DefaultMemberQuerySchema = z.object({
  status: z.array(z.literal('active')),
  includeRemoved: z.literal(false),
  onlineOnly: z.literal(false),
});

// === 成員等級配置 schema ===
export const MemberPermissionLevelsSchema = z.object({
  OWNER: z.literal(100),
  ADMIN: z.literal(80),
  EDITOR: z.literal(60),
  VIEWER: z.literal(20),
  CUSTOM: z.literal(50),
});

// === 驗證輔助函數 ===
export const validateMemberAddition = (data: unknown) => {
  return AddMemberDataSchema.safeParse(data);
};

export const validateMemberRoleUpdate = (data: unknown) => {
  return UpdateMemberRoleDataSchema.safeParse(data);
};

export const validateMemberStatusUpdate = (data: unknown) => {
  return UpdateMemberStatusDataSchema.safeParse(data);
};

export const validateMemberRemoval = (data: unknown) => {
  return RemoveMemberDataSchema.safeParse(data);
};

export const validateBulkMemberOperation = (data: unknown) => {
  return BulkMemberOperationDataSchema.safeParse(data);
};

export const validateQuickMemberAction = (data: unknown) => {
  return QuickMemberActionDataSchema.safeParse(data);
};

// === 成員業務驗證 ===
export const canUpdateMemberRole = (
  operatorPermissionLevel: number,
  targetPermissionLevel: number,
  newPermissionLevel: number
): { allowed: boolean; reason?: string } => {
  // 操作者權限等級必須高於目標成員
  if (operatorPermissionLevel <= targetPermissionLevel) {
    return { allowed: false, reason: '權限不足：無法操作權限等級相同或更高的成員' };
  }

  // 不能將成員提升到比自己更高的等級
  if (newPermissionLevel >= operatorPermissionLevel) {
    return { allowed: false, reason: '權限不足：無法將成員提升到更高的權限等級' };
  }

  return { allowed: true };
};

export const canRemoveMember = (
  operatorPermissionLevel: number,
  targetPermissionLevel: number,
  isOwner: boolean
): { allowed: boolean; reason?: string } => {
  // Owner 不能被移除
  if (isOwner) {
    return { allowed: false, reason: '群組所有者不能被移除' };
  }

  // 操作者權限等級必須高於目標成員
  if (operatorPermissionLevel <= targetPermissionLevel) {
    return { allowed: false, reason: '權限不足：無法移除權限等級相同或更高的成員' };
  }

  return { allowed: true };
};

// === 活動分數計算 ===
export const calculateActivityScore = (stats: {
  surveysCreated: number;
  responsesReceived: number;
  lastSurveyAt?: Date;
  lastActivityAt?: Date;
}): number => {
  let score = 0;

  // 問卷創建分數 (最高 40 分)
  score += Math.min(stats.surveysCreated * 5, 40);

  // 回應收集分數 (最高 30 分)
  score += Math.min(stats.responsesReceived * 0.1, 30);

  // 最近活動加分 (最高 30 分)
  const now = new Date();
  const lastActivity = stats.lastActivityAt || new Date(0);
  const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceActivity <= 7) {
    score += 30;
  } else if (daysSinceActivity <= 30) {
    score += 20;
  } else if (daysSinceActivity <= 90) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
};

// === 成員狀態轉換驗證 ===
export const validateStatusTransition = (
  currentStatus: z.infer<typeof UserGroupStatusSchema>,
  newStatus: z.infer<typeof UserGroupStatusSchema>
): { valid: boolean; reason?: string } => {
  const validTransitions: Record<
    z.infer<typeof UserGroupStatusSchema>,
    z.infer<typeof UserGroupStatusSchema>[]
  > = {
    pending: ['active', 'blocked', 'removed'],
    active: ['blocked', 'removed'],
    blocked: ['active', 'removed'],
    removed: [], // 已移除的成員不能變更狀態
  };

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    return {
      valid: false,
      reason: `無效的狀態轉換：無法從 ${currentStatus} 變更為 ${newStatus}`,
    };
  }

  return { valid: true };
};
