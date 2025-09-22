/**
 * 權限系統相關 Zod 驗證 schemas
 * 包含權限、角色、ABAC 模型等相關驗證規則
 */

import { z } from 'zod';
import { BaseEntitySchema, EntityIdSchema, ColorCodeSchema } from './common.js';

// === 權限相關 schemas ===
export const PermissionResourceSchema = z.enum(['survey', 'analytics', 'team', 'role', 'group'], {
  errorMap: () => ({ message: '無效的權限資源類型' }),
});

export const PermissionActionSchema = z.enum(
  [
    'create',
    'read',
    'update',
    'delete',
    'manage',
    'publish',
    'duplicate',
    'export',
    'invite',
    'remove',
    'assign',
  ],
  {
    errorMap: () => ({ message: '無效的權限操作類型' }),
  }
);

export const PermissionScopeSchema = z.enum(['own', 'assigned', 'group', 'all'], {
  errorMap: () => ({ message: '無效的權限範圍' }),
});

export const PermissionCategorySchema = z.enum(['survey', 'analytics', 'team', 'role'], {
  errorMap: () => ({ message: '無效的權限分類' }),
});

// === 原子化權限 schema ===
export const PermissionSchema = z.object({
  id: z
    .string()
    .min(1, '權限 ID 不能為空')
    .regex(/^[a-z]+\.[a-z]+(\.[a-z]+)?$/, '權限 ID 格式錯誤'),
  resource: PermissionResourceSchema,
  action: PermissionActionSchema,
  scope: PermissionScopeSchema,
  description: z.string().min(1, '權限描述不能為空').max(200, '權限描述長度不能超過 200 字元'),
  category: PermissionCategorySchema,
  createdAt: z.date(),
});

// === 角色 schema ===
export const RoleSchema = BaseEntitySchema.extend({
  groupId: EntityIdSchema,
  name: z.string().min(1, '角色名稱不能為空').max(50, '角色名稱長度不能超過 50 字元'),
  description: z.string().max(200, '角色描述長度不能超過 200 字元').optional(),
  permissions: z.array(z.string().min(1, '權限 ID 不能為空')),

  // 角色屬性
  isSystemRole: z.boolean(),
  isDeletable: z.boolean(),
  isEditable: z.boolean(),
  color: ColorCodeSchema.optional(),

  // 統計資訊
  memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數').optional(),
});

// === 角色摘要 schema ===
export const RoleSummarySchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1, '角色名稱不能為空'),
  description: z.string().max(200, '角色描述長度不能超過 200 字元').optional(),
  color: ColorCodeSchema.optional(),
  isSystemRole: z.boolean(),
  memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數'),
});

// === 權限檢查上下文 schema ===
export const PermissionContextSchema = z.object({
  userId: EntityIdSchema,
  groupId: EntityIdSchema,
  resourceId: EntityIdSchema.optional(),
  attributes: z.record(z.unknown()).optional(),
});

// === 權限檢查結果 schema ===
export const PermissionCheckResultSchema = z.object({
  granted: z.boolean(),
  reason: z.string().optional(),
  userRole: z.string().optional(),
  matchedPermissions: z.array(z.string()).optional(),
});

// === 角色相關 DTO schemas ===
export const CreateRoleDataSchema = z.object({
  name: z
    .string()
    .min(1, '角色名稱不能為空')
    .max(50, '角色名稱長度不能超過 50 字元')
    .regex(/^[^<>{}]*$/, '角色名稱不能包含特殊字符'),
  description: z.string().max(200, '角色描述長度不能超過 200 字元').optional(),
  permissions: z
    .array(z.string().min(1, '權限 ID 不能為空'))
    .min(1, '至少需要選擇一個權限')
    .max(50, '權限數量不能超過 50 個'),
  color: ColorCodeSchema.optional(),
});

export const UpdateRoleDataSchema = z.object({
  name: z
    .string()
    .min(1, '角色名稱不能為空')
    .max(50, '角色名稱長度不能超過 50 字元')
    .regex(/^[^<>{}]*$/, '角色名稱不能包含特殊字符')
    .optional(),
  description: z.string().max(200, '角色描述長度不能超過 200 字元').optional(),
  permissions: z
    .array(z.string().min(1, '權限 ID 不能為空'))
    .min(1, '至少需要選擇一個權限')
    .max(50, '權限數量不能超過 50 個')
    .optional(),
  color: ColorCodeSchema.optional(),
});

export const AssignRoleDataSchema = z.object({
  userId: EntityIdSchema,
  roleId: EntityIdSchema,
});

// === 角色查詢和過濾 schema ===
export const RoleQuerySchema = z.object({
  search: z.string().optional(),
  systemRolesOnly: z.boolean().optional(),
  customRolesOnly: z.boolean().optional(),
  editableOnly: z.boolean().optional(),
  hasPermissions: z.array(z.string()).optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
});

// === 權限模板 schema ===
export const PermissionTemplateSchema = z.object({
  id: z.string().min(1, '模板 ID 不能為空'),
  name: z.string().min(1, '模板名稱不能為空').max(50, '模板名稱長度不能超過 50 字元'),
  description: z.string().min(1, '模板描述不能為空').max(200, '模板描述長度不能超過 200 字元'),
  permissions: z.array(z.string().min(1, '權限 ID 不能為空')),
  category: z.string().min(1, '模板分類不能為空'),
  isRecommended: z.boolean(),
});

// === 權限組合檢查 schema ===
export const PermissionBundleSchema = z.object({
  name: z.string().min(1, '權限組合名稱不能為空'),
  permissions: z.array(z.string().min(1, '權限 ID 不能為空')),
  required: z.boolean(),
});

// === 權限依賴關係 schema ===
export const PermissionDependencySchema = z.object({
  permission: z.string().min(1, '權限 ID 不能為空'),
  dependencies: z.array(z.string().min(1, '依賴權限 ID 不能為空')),
  conflicts: z.array(z.string().min(1, '衝突權限 ID 不能為空')).optional(),
});

// === 角色分析結果 schema ===
export const RoleAnalysisSchema = z.object({
  roleId: EntityIdSchema,
  roleName: z.string().min(1, '角色名稱不能為空'),
  permissionCount: z.number().min(0, '權限數量不能為負數').int('權限數量必須是整數'),
  memberCount: z.number().min(0, '成員數量不能為負數').int('成員數量必須是整數'),
  permissionsByCategory: z.record(PermissionCategorySchema, z.array(z.string())),
  missingRecommendedPermissions: z.array(z.string()),
  conflictingPermissions: z.array(z.string()),
  suggestedImprovements: z.array(z.string()),
});

// === 預設角色配置 schemas ===
export const DefaultRoleConfigSchema = z.object({
  name: z.string().min(1, '角色名稱不能為空'),
  description: z.string().min(1, '角色描述不能為空'),
  permissions: z.array(z.string()),
  isSystemRole: z.literal(true),
  isDeletable: z.boolean(),
  isEditable: z.boolean(),
  color: ColorCodeSchema,
});

export const DefaultRolesSchema = z.record(
  z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']),
  DefaultRoleConfigSchema
);

// === 權限定義 schemas ===
export const PermissionDefinitionSchema = z.record(
  z.string().regex(/^[a-z]+\.[a-z]+(\.[a-z]+)?$/),
  PermissionSchema.omit({ id: true, createdAt: true })
);

// === 權限模板定義 schemas ===
export const PermissionTemplatesSchema = z.array(PermissionTemplateSchema);

// === 驗證輔助函數 ===
export const validateRoleCreation = (data: unknown) => {
  return CreateRoleDataSchema.safeParse(data);
};

export const validateRoleUpdate = (data: unknown) => {
  return UpdateRoleDataSchema.safeParse(data);
};

export const validateRoleAssignment = (data: unknown) => {
  return AssignRoleDataSchema.safeParse(data);
};

export const validatePermissionContext = (data: unknown) => {
  return PermissionContextSchema.safeParse(data);
};

// === 權限驗證函數 ===
export const isValidPermissionId = (permissionId: string): boolean => {
  return /^[a-z]+\.[a-z]+(\.[a-z]+)?$/.test(permissionId);
};

export const parsePermissionId = (
  permissionId: string
): { resource: string; action: string; scope?: string } | null => {
  const parts = permissionId.split('.');
  if (parts.length < 2 || parts.length > 3) {
    return null;
  }

  const result: { resource: string; action: string; scope?: string } = {
    resource: parts[0]!,
    action: parts[1]!,
  };

  if (parts[2]) {
    result.scope = parts[2];
  }

  return result;
};

// === 權限檢查輔助函數 ===
export const hasWildcardPermission = (permissions: string[]): boolean => {
  return permissions.includes('*');
};

export const matchesPermissionPattern = (permission: string, patterns: string[]): boolean => {
  if (patterns.includes('*')) return true;
  if (patterns.includes(permission)) return true;

  // 檢查通配符模式 (例如: survey.*)
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return permission.startsWith(prefix);
    }
    return false;
  });
};

// === 權限衝突檢查 ===
export const checkPermissionConflicts = (permissions: string[]): string[] => {
  const conflicts: string[] = [];

  // 檢查範圍衝突 (例如: survey.read.own 和 survey.read.all 衝突)
  permissions.forEach((perm1, index) => {
    permissions.slice(index + 1).forEach(perm2 => {
      const parsed1 = parsePermissionId(perm1);
      const parsed2 = parsePermissionId(perm2);

      if (
        parsed1 &&
        parsed2 &&
        parsed1.resource === parsed2.resource &&
        parsed1.action === parsed2.action &&
        parsed1.scope !== parsed2.scope
      ) {
        // 如果有 'all' 範圍，其他範圍就是冗餘的
        if (parsed1.scope === 'all' || parsed2.scope === 'all') {
          conflicts.push(`權限衝突: ${perm1} 與 ${perm2}`);
        }
      }
    });
  });

  return conflicts;
};

// === 角色權限建議 ===
export const suggestRolePermissions = (roleName: string): string[] => {
  const suggestions: Record<string, string[]> = {
    Editor: [
      'survey.create',
      'survey.read.group',
      'survey.update.own',
      'survey.publish.own',
      'analytics.read.own',
    ],
    Viewer: ['survey.read.group', 'analytics.read.assigned'],
    Analyst: ['survey.read.group', 'analytics.read.all', 'analytics.export'],
  };

  return suggestions[roleName] || [];
};
