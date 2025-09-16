/**
 * 權限系統相關類型定義
 * 包含權限、角色、ABAC 模型等相關介面
 */

import { BaseEntity, EntityId } from './common';

// === 權限資源類型 ===
export type PermissionResource = 'survey' | 'analytics' | 'team' | 'role' | 'group';

// === 權限操作類型 ===
export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'publish'
  | 'duplicate'
  | 'export'
  | 'invite'
  | 'remove'
  | 'assign';

// === 權限範圍類型 ===
export type PermissionScope = 'own' | 'assigned' | 'group' | 'all';

// === 權限分類類型 ===
export type PermissionCategory = 'survey' | 'analytics' | 'team' | 'role';

// === 原子化權限介面 ===
export interface Permission {
  /** 權限 ID (如: survey.create) */
  id: string;
  /** 資源類型 */
  resource: PermissionResource;
  /** 操作類型 */
  action: PermissionAction;
  /** 權限範圍 */
  scope: PermissionScope;
  /** 權限描述 */
  description: string;
  /** 權限分類 (用於 UI 顯示分組) */
  category: PermissionCategory;
  /** 創建時間 */
  createdAt: Date;
}

// === 角色介面 ===
export interface Role extends BaseEntity {
  /** 所屬群組 ID */
  groupId: EntityId;
  /** 角色名稱 */
  name: string;
  /** 角色描述 */
  description?: string;
  /** 權限 ID 列表 */
  permissions: string[];

  // === 角色屬性 ===
  /** 是否為系統預設角色 */
  isSystemRole: boolean;
  /** 是否可以刪除 */
  isDeletable: boolean;
  /** 是否可以編輯權限 */
  isEditable: boolean;
  /** 角色顏色標識 */
  color?: string;

  // === 統計資訊 ===
  /** 使用此角色的成員數量 */
  memberCount?: number;
}

// === 角色摘要 (用於下拉選單等) ===
export interface RoleSummary {
  id: EntityId;
  name: string;
  description?: string;
  color?: string;
  isSystemRole: boolean;
  memberCount: number;
}

// === 權限檢查上下文 ===
export interface PermissionContext {
  /** 用戶 ID */
  userId: EntityId;
  /** 群組 ID */
  groupId: EntityId;
  /** 資源 ID (可選) */
  resourceId?: EntityId;
  /** 額外屬性 */
  attributes?: Record<string, unknown>;
}

// === 權限檢查結果 ===
export interface PermissionCheckResult {
  /** 是否有權限 */
  granted: boolean;
  /** 檢查原因 */
  reason?: string;
  /** 用戶角色 */
  userRole?: string;
  /** 匹配的權限 */
  matchedPermissions?: string[];
}

// === 角色相關 DTO ===
export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[];
  color?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
  color?: string;
}

export interface AssignRoleData {
  userId: EntityId;
  roleId: EntityId;
}

// === 角色查詢和過濾 ===
export interface RoleQuery {
  /** 搜尋關鍵字（角色名稱或描述） */
  search?: string;
  /** 是否只顯示系統角色 */
  systemRolesOnly?: boolean;
  /** 是否只顯示自定義角色 */
  customRolesOnly?: boolean;
  /** 是否只顯示可編輯的角色 */
  editableOnly?: boolean;
  /** 包含特定權限的角色 */
  hasPermissions?: string[];
  /** 創建時間範圍 */
  createdAfter?: Date;
  createdBefore?: Date;
}

// === 權限模板介面 ===
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  category: string;
  isRecommended: boolean;
}

// === 預定義權限清單 ===
export const PERMISSIONS: Record<string, Omit<Permission, 'createdAt'>> = {
  // === 問卷相關權限 ===
  'survey.create': {
    id: 'survey.create',
    resource: 'survey',
    action: 'create',
    scope: 'group',
    description: '創建問卷',
    category: 'survey',
  },
  'survey.read.own': {
    id: 'survey.read.own',
    resource: 'survey',
    action: 'read',
    scope: 'own',
    description: '查看自己的問卷',
    category: 'survey',
  },
  'survey.read.group': {
    id: 'survey.read.group',
    resource: 'survey',
    action: 'read',
    scope: 'group',
    description: '查看群組問卷',
    category: 'survey',
  },
  'survey.update.own': {
    id: 'survey.update.own',
    resource: 'survey',
    action: 'update',
    scope: 'own',
    description: '編輯自己的問卷',
    category: 'survey',
  },
  'survey.update.assigned': {
    id: 'survey.update.assigned',
    resource: 'survey',
    action: 'update',
    scope: 'assigned',
    description: '編輯分配的問卷',
    category: 'survey',
  },
  'survey.update.all': {
    id: 'survey.update.all',
    resource: 'survey',
    action: 'update',
    scope: 'all',
    description: '編輯所有問卷',
    category: 'survey',
  },
  'survey.delete.own': {
    id: 'survey.delete.own',
    resource: 'survey',
    action: 'delete',
    scope: 'own',
    description: '刪除自己的問卷',
    category: 'survey',
  },
  'survey.delete.all': {
    id: 'survey.delete.all',
    resource: 'survey',
    action: 'delete',
    scope: 'all',
    description: '刪除任何問卷',
    category: 'survey',
  },
  'survey.publish.own': {
    id: 'survey.publish.own',
    resource: 'survey',
    action: 'publish',
    scope: 'own',
    description: '發布自己的問卷',
    category: 'survey',
  },
  'survey.duplicate': {
    id: 'survey.duplicate',
    resource: 'survey',
    action: 'duplicate',
    scope: 'group',
    description: '複製問卷',
    category: 'survey',
  },

  // === 分析相關權限 ===
  'analytics.read.own': {
    id: 'analytics.read.own',
    resource: 'analytics',
    action: 'read',
    scope: 'own',
    description: '查看自己的分析數據',
    category: 'analytics',
  },
  'analytics.read.assigned': {
    id: 'analytics.read.assigned',
    resource: 'analytics',
    action: 'read',
    scope: 'assigned',
    description: '查看分配的分析數據',
    category: 'analytics',
  },
  'analytics.read.all': {
    id: 'analytics.read.all',
    resource: 'analytics',
    action: 'read',
    scope: 'all',
    description: '查看所有分析數據',
    category: 'analytics',
  },
  'analytics.export': {
    id: 'analytics.export',
    resource: 'analytics',
    action: 'export',
    scope: 'group',
    description: '匯出分析數據',
    category: 'analytics',
  },

  // === 團隊管理權限 ===
  'team.invite': {
    id: 'team.invite',
    resource: 'team',
    action: 'invite',
    scope: 'group',
    description: '邀請成員',
    category: 'team',
  },
  'team.member.remove': {
    id: 'team.member.remove',
    resource: 'team',
    action: 'remove',
    scope: 'group',
    description: '移除成員',
    category: 'team',
  },
  'team.member.manage': {
    id: 'team.member.manage',
    resource: 'team',
    action: 'manage',
    scope: 'group',
    description: '管理成員設定',
    category: 'team',
  },
  'team.settings': {
    id: 'team.settings',
    resource: 'team',
    action: 'manage',
    scope: 'group',
    description: '管理群組設定',
    category: 'team',
  },

  // === 角色管理權限 ===
  'role.create': {
    id: 'role.create',
    resource: 'role',
    action: 'create',
    scope: 'group',
    description: '創建自定義角色',
    category: 'role',
  },
  'role.edit': {
    id: 'role.edit',
    resource: 'role',
    action: 'update',
    scope: 'group',
    description: '編輯角色權限',
    category: 'role',
  },
  'role.assign': {
    id: 'role.assign',
    resource: 'role',
    action: 'assign',
    scope: 'group',
    description: '分配角色給成員',
    category: 'role',
  },
  'role.delete': {
    id: 'role.delete',
    resource: 'role',
    action: 'delete',
    scope: 'group',
    description: '刪除自定義角色',
    category: 'role',
  },
};

// === 系統預設角色 ===
export const DEFAULT_ROLES = {
  OWNER: {
    name: 'Owner',
    description: '群組所有者，擁有全部權限',
    permissions: ['*'], // 萬用權限
    isSystemRole: true,
    isDeletable: false,
    isEditable: false, // Owner 角色不可編輯
    color: '#dc2626', // 紅色標識
  },

  ADMIN: {
    name: 'Admin',
    description: '管理員，可管理群組和成員',
    permissions: [
      // 群組管理
      'team.settings',
      'team.invite',
      'team.member.remove',
      'team.member.manage',

      // 角色管理
      'role.create',
      'role.edit',
      'role.assign',
      'role.delete',

      // 問卷全權限
      'survey.create',
      'survey.read.group',
      'survey.update.all',
      'survey.delete.all',
      'survey.publish.own',
      'survey.duplicate',

      // 分析全權限
      'analytics.read.all',
      'analytics.export',
    ],
    isSystemRole: true,
    isDeletable: false,
    isEditable: true, // 可由 Owner 調整權限
    color: '#ea580c', // 橙色標識
  },

  EDITOR: {
    name: 'Editor',
    description: '編輯者，可創建和編輯問卷',
    permissions: [
      // 問卷編輯權限
      'survey.create',
      'survey.read.group',
      'survey.update.own',
      'survey.update.assigned',
      'survey.publish.own',
      'survey.duplicate',

      // 分析查看權限
      'analytics.read.own',
      'analytics.read.assigned',
    ],
    isSystemRole: true,
    isDeletable: false,
    isEditable: true,
    color: '#2563eb', // 藍色標識
  },

  VIEWER: {
    name: 'Viewer',
    description: '觀察者，只能查看內容',
    permissions: [
      // 只讀權限
      'survey.read.group',
      'analytics.read.assigned',
    ],
    isSystemRole: true,
    isDeletable: false,
    isEditable: true,
    color: '#16a34a', // 綠色標識
  },
} as const;

// === 權限模板定義 ===
export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: 'survey_creator',
    name: '問卷創建者',
    description: '可以創建和管理問卷，查看分析結果',
    permissions: [
      'survey.create',
      'survey.read.group',
      'survey.update.own',
      'survey.publish.own',
      'survey.duplicate',
      'analytics.read.own',
    ],
    category: 'survey',
    isRecommended: true,
  },
  {
    id: 'data_analyst',
    name: '數據分析師',
    description: '專注於數據分析和報告',
    permissions: ['survey.read.group', 'analytics.read.all', 'analytics.export'],
    category: 'analytics',
    isRecommended: true,
  },
  {
    id: 'team_manager',
    name: '團隊管理者',
    description: '管理團隊成員和權限分配',
    permissions: [
      'team.invite',
      'team.member.manage',
      'role.assign',
      'survey.read.group',
      'analytics.read.all',
    ],
    category: 'team',
    isRecommended: true,
  },
  {
    id: 'content_reviewer',
    name: '內容審核者',
    description: '審核和編輯他人創建的問卷',
    permissions: ['survey.read.group', 'survey.update.all', 'analytics.read.assigned'],
    category: 'survey',
    isRecommended: false,
  },
];

// === 權限組合檢查輔助類型 ===
export interface PermissionBundle {
  /** 權限組合名稱 */
  name: string;
  /** 包含的權限列表 */
  permissions: string[];
  /** 是否為必需權限組合 */
  required: boolean;
}

// === 權限依賴關係 ===
export interface PermissionDependency {
  /** 權限 ID */
  permission: string;
  /** 依賴的權限列表 */
  dependencies: string[];
  /** 衝突的權限列表 */
  conflicts?: string[];
}

// === 權限檢查服務介面 ===
export interface IPermissionService {
  /** 檢查用戶是否有特定權限 */
  hasPermission(context: PermissionContext, permission: string): Promise<boolean>;
  /** 獲取用戶在群組中的所有權限 */
  getUserPermissions(userId: EntityId, groupId: EntityId): Promise<string[]>;
  /** 獲取角色的所有權限 */
  getRolePermissions(roleId: EntityId): Promise<string[]>;
  /** 檢查權限組合 */
  checkPermissionBundle(
    context: PermissionContext,
    bundle: PermissionBundle
  ): Promise<PermissionCheckResult>;
}

// === 角色分析結果 ===
export interface RoleAnalysis {
  roleId: EntityId;
  roleName: string;
  permissionCount: number;
  memberCount: number;
  permissionsByCategory: Record<PermissionCategory, string[]>;
  missingRecommendedPermissions: string[];
  conflictingPermissions: string[];
  suggestedImprovements: string[];
}
