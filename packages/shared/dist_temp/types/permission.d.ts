/**
 * 權限系統相關類型定義
 * 包含權限、角色、ABAC 模型等相關介面
 */
import { BaseEntity, EntityId } from './common';
export type PermissionResource = 'survey' | 'analytics' | 'team' | 'role' | 'group';
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
export type PermissionScope = 'own' | 'assigned' | 'group' | 'all';
export type PermissionCategory = 'survey' | 'analytics' | 'team' | 'role';
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
export interface Role extends BaseEntity {
  /** 所屬群組 ID */
  groupId: EntityId;
  /** 角色名稱 */
  name: string;
  /** 角色描述 */
  description?: string;
  /** 權限 ID 列表 */
  permissions: string[];
  /** 是否為系統預設角色 */
  isSystemRole: boolean;
  /** 是否可以刪除 */
  isDeletable: boolean;
  /** 是否可以編輯權限 */
  isEditable: boolean;
  /** 角色顏色標識 */
  color?: string;
  /** 使用此角色的成員數量 */
  memberCount?: number;
}
export interface RoleSummary {
  id: EntityId;
  name: string;
  description?: string;
  color?: string;
  isSystemRole: boolean;
  memberCount: number;
}
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
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  category: string;
  isRecommended: boolean;
}
export declare const PERMISSIONS: Record<string, Omit<Permission, 'createdAt'>>;
export declare const DEFAULT_ROLES: {
  readonly OWNER: {
    readonly name: 'Owner';
    readonly description: '群組所有者，擁有全部權限';
    readonly permissions: readonly ['*'];
    readonly isSystemRole: true;
    readonly isDeletable: false;
    readonly isEditable: false;
    readonly color: '#dc2626';
  };
  readonly ADMIN: {
    readonly name: 'Admin';
    readonly description: '管理員，可管理群組和成員';
    readonly permissions: readonly [
      'team.settings',
      'team.invite',
      'team.member.remove',
      'team.member.manage',
      'role.create',
      'role.edit',
      'role.assign',
      'role.delete',
      'survey.create',
      'survey.read.group',
      'survey.update.all',
      'survey.delete.all',
      'survey.publish.own',
      'survey.duplicate',
      'analytics.read.all',
      'analytics.export',
    ];
    readonly isSystemRole: true;
    readonly isDeletable: false;
    readonly isEditable: true;
    readonly color: '#ea580c';
  };
  readonly EDITOR: {
    readonly name: 'Editor';
    readonly description: '編輯者，可創建和編輯問卷';
    readonly permissions: readonly [
      'survey.create',
      'survey.read.group',
      'survey.update.own',
      'survey.update.assigned',
      'survey.publish.own',
      'survey.duplicate',
      'analytics.read.own',
      'analytics.read.assigned',
    ];
    readonly isSystemRole: true;
    readonly isDeletable: false;
    readonly isEditable: true;
    readonly color: '#2563eb';
  };
  readonly VIEWER: {
    readonly name: 'Viewer';
    readonly description: '觀察者，只能查看內容';
    readonly permissions: readonly ['survey.read.group', 'analytics.read.assigned'];
    readonly isSystemRole: true;
    readonly isDeletable: false;
    readonly isEditable: true;
    readonly color: '#16a34a';
  };
};
export declare const PERMISSION_TEMPLATES: PermissionTemplate[];
export interface PermissionBundle {
  /** 權限組合名稱 */
  name: string;
  /** 包含的權限列表 */
  permissions: string[];
  /** 是否為必需權限組合 */
  required: boolean;
}
export interface PermissionDependency {
  /** 權限 ID */
  permission: string;
  /** 依賴的權限列表 */
  dependencies: string[];
  /** 衝突的權限列表 */
  conflicts?: string[];
}
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
