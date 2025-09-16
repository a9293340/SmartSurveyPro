/**
 * 關聯表相關類型定義
 * 包含用戶-群組-角色關聯、成員管理等相關介面
 */

import { BaseEntity, EntityId } from './common';

// === 用戶群組狀態 ===
export enum UserGroupStatus {
  /** 活躍成員 */
  ACTIVE = 'active',
  /** 待處理（通過邀請加入，等待確認） */
  PENDING = 'pending',
  /** 已封鎖 */
  BLOCKED = 'blocked',
  /** 已移除 */
  REMOVED = 'removed',
}

// === 用戶群組角色關聯表 ===
export interface UserGroupRole extends BaseEntity {
  /** 用戶 ID */
  userId: EntityId;
  /** 群組 ID */
  groupId: EntityId;
  /** 角色 ID */
  roleId: EntityId;

  // === 狀態資訊 ===
  /** 成員狀態 */
  status: UserGroupStatus;
  /** 加入時間 */
  joinedAt: Date;
  /** 邀請人 ID (如果是通過邀請加入) */
  invitedBy?: EntityId;

  // === 額外資訊 ===
  /** 最後活動時間 */
  lastActivityAt?: Date;
  /** 移除時間 */
  removedAt?: Date;
  /** 移除者 ID */
  removedBy?: EntityId;
  /** 移除原因 */
  removeReason?: string;

  // === 元數據 ===
  /** 加入來源 */
  joinSource?: 'invitation' | 'direct' | 'import' | 'system';
  /** 額外元數據 */
  metadata?: Record<string, unknown>;
}

// === 成員詳細資訊 (包含用戶和角色資訊) ===
export interface MemberDetails {
  // === 關聯資訊 ===
  relationshipId: EntityId;
  userId: EntityId;
  groupId: EntityId;
  roleId: EntityId;
  status: UserGroupStatus;
  joinedAt: Date;
  lastActivityAt?: Date;

  // === 用戶資訊 ===
  user: {
    id: EntityId;
    name: string;
    email: string;
    avatar?: string;
    emailVerified: boolean;
    lastLoginAt?: Date;
  };

  // === 角色資訊 ===
  role: {
    id: EntityId;
    name: string;
    description?: string;
    color?: string;
    isSystemRole: boolean;
    permissions: string[];
  };

  // === 邀請資訊 ===
  invitedBy?: {
    id: EntityId;
    name: string;
    email: string;
  };

  // === 統計資訊 ===
  stats?: {
    surveysCreated: number;
    responsesReceived: number;
    lastSurveyAt?: Date;
    activityScore: number;
  };
}

// === 成員摘要 (用於列表顯示) ===
export interface MemberSummary {
  relationshipId: EntityId;
  userId: EntityId;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  roleName: string;
  roleColor?: string;
  status: UserGroupStatus;
  joinedAt: Date;
  lastActivityAt?: Date;
  isOnline?: boolean;
}

// === 成員管理相關 DTO ===
export interface AddMemberData {
  /** 用戶 ID */
  userId: EntityId;
  /** 角色 ID */
  roleId: EntityId;
  /** 加入來源 */
  joinSource?: 'invitation' | 'direct' | 'import' | 'system';
  /** 邀請人 ID */
  invitedBy?: EntityId;
  /** 額外元數據 */
  metadata?: Record<string, unknown>;
}

export interface UpdateMemberRoleData {
  /** 成員關聯 ID */
  relationshipId: EntityId;
  /** 新角色 ID */
  newRoleId: EntityId;
  /** 更新原因 */
  reason?: string;
}

export interface UpdateMemberStatusData {
  /** 成員關聯 ID */
  relationshipId: EntityId;
  /** 新狀態 */
  newStatus: UserGroupStatus;
  /** 狀態變更原因 */
  reason?: string;
  /** 額外元數據 */
  metadata?: Record<string, unknown>;
}

export interface RemoveMemberData {
  /** 成員關聯 ID */
  relationshipId: EntityId;
  /** 移除原因 */
  reason?: string;
  /** 是否為軟刪除 (保留記錄但標記為 removed) */
  softDelete?: boolean;
}

export interface BulkMemberOperationData {
  /** 成員關聯 ID 列表 */
  relationshipIds: EntityId[];
  /** 操作類型 */
  operation: 'update_role' | 'update_status' | 'remove';
  /** 操作參數 */
  params: {
    newRoleId?: EntityId;
    newStatus?: UserGroupStatus;
    reason?: string;
  };
}

// === 成員查詢和過濾 ===
export interface MemberQuery {
  /** 搜尋關鍵字（姓名或 email） */
  search?: string;
  /** 角色 ID 過濾 */
  roleIds?: EntityId[];
  /** 狀態過濾 */
  status?: UserGroupStatus[];
  /** 是否只顯示在線成員 */
  onlineOnly?: boolean;
  /** 加入時間範圍 */
  joinedAfter?: Date;
  joinedBefore?: Date;
  /** 最後活動時間範圍 */
  lastActivityAfter?: Date;
  lastActivityBefore?: Date;
  /** 加入來源過濾 */
  joinSources?: ('invitation' | 'direct' | 'import' | 'system')[];
  /** 邀請人過濾 */
  invitedBy?: EntityId;
  /** 是否包含已移除成員 */
  includeRemoved?: boolean;
}

// === 批次操作結果 ===
export interface BulkMemberOperationResult {
  /** 總處理數量 */
  total: number;
  /** 成功數量 */
  success: number;
  /** 失敗數量 */
  failed: number;
  /** 跳過數量 */
  skipped: number;
  /** 成功的記錄 */
  successful: EntityId[];
  /** 失敗的記錄 */
  failures: Array<{
    relationshipId: EntityId;
    error: string;
    code?: string;
  }>;
  /** 跳過的記錄 */
  skipped_records: Array<{
    relationshipId: EntityId;
    reason: string;
  }>;
}

// === 成員活動記錄 ===
export interface MemberActivity {
  id: EntityId;
  relationshipId: EntityId;
  userId: EntityId;
  groupId: EntityId;
  /** 活動類型 */
  type: 'join' | 'leave' | 'role_change' | 'status_change' | 'activity' | 'login' | 'survey_action';
  /** 活動描述 */
  description: string;
  /** 舊值 (如角色變更) */
  oldValue?: string;
  /** 新值 (如角色變更) */
  newValue?: string;
  /** 相關資源 ID */
  resourceId?: EntityId;
  /** 操作者 ID */
  actorId?: EntityId;
  /** 活動時間 */
  timestamp: Date;
  /** 額外資料 */
  metadata?: Record<string, unknown>;
}

// === 成員統計資訊 ===
export interface MemberStats {
  /** 總成員數 */
  total: number;
  /** 活躍成員數 */
  active: number;
  /** 待處理成員數 */
  pending: number;
  /** 封鎖成員數 */
  blocked: number;
  /** 本月新增成員數 */
  newThisMonth: number;
  /** 按角色分布 */
  byRole: Record<string, number>;
  /** 按加入來源分布 */
  byJoinSource: Record<string, number>;
  /** 平均加入天數 */
  averageDaysActive: number;
  /** 活躍成員比例 */
  activeRate: number;
}

// === 成員權限摘要 ===
export interface MemberPermissionSummary {
  relationshipId: EntityId;
  userId: EntityId;
  groupId: EntityId;
  roleId: EntityId;
  roleName: string;
  /** 用戶在此群組的所有權限 */
  permissions: string[];
  /** 是否為群組所有者 */
  isOwner: boolean;
  /** 是否為管理員 */
  isAdmin: boolean;
  /** 權限等級 (數字越高權限越大) */
  permissionLevel: number;
  /** 可管理的成員 */
  canManageMembers: EntityId[];
}

// === 角色轉移 ===
export interface RoleTransferData {
  /** 原成員關聯 ID */
  fromRelationshipId: EntityId;
  /** 目標成員關聯 ID */
  toRelationshipId: EntityId;
  /** 要轉移的角色 ID */
  roleId: EntityId;
  /** 轉移原因 */
  reason?: string;
  /** 是否立即生效 */
  immediate?: boolean;
}

// === 成員邀請統計 ===
export interface MemberInviteStats {
  /** 總邀請數 */
  totalInvites: number;
  /** 成功加入數 */
  successfulJoins: number;
  /** 待處理邀請數 */
  pendingInvites: number;
  /** 邀請成功率 */
  successRate: number;
  /** 按邀請人分組的統計 */
  byInviter: Array<{
    inviterId: EntityId;
    inviterName: string;
    inviteCount: number;
    successCount: number;
    successRate: number;
  }>;
}

// === 群組成員管理服務介面 ===
export interface IMembershipService {
  /** 添加成員 */
  addMember(groupId: EntityId, data: AddMemberData): Promise<UserGroupRole>;

  /** 移除成員 */
  removeMember(actorId: EntityId, data: RemoveMemberData): Promise<boolean>;

  /** 更新成員角色 */
  updateMemberRole(actorId: EntityId, data: UpdateMemberRoleData): Promise<UserGroupRole>;

  /** 更新成員狀態 */
  updateMemberStatus(actorId: EntityId, data: UpdateMemberStatusData): Promise<UserGroupRole>;

  /** 批次操作成員 */
  bulkMemberOperation(
    actorId: EntityId,
    data: BulkMemberOperationData
  ): Promise<BulkMemberOperationResult>;

  /** 獲取成員詳細資訊 */
  getMemberDetails(relationshipId: EntityId): Promise<MemberDetails>;

  /** 獲取群組成員列表 */
  getGroupMembers(groupId: EntityId, query?: MemberQuery): Promise<MemberSummary[]>;

  /** 獲取用戶參與的群組 */
  getUserGroups(userId: EntityId): Promise<
    Array<{
      groupId: EntityId;
      groupName: string;
      roleName: string;
      status: UserGroupStatus;
    }>
  >;

  /** 檢查用戶在群組中的權限 */
  checkMemberPermission(userId: EntityId, groupId: EntityId, permission: string): Promise<boolean>;

  /** 獲取成員統計 */
  getMemberStats(groupId: EntityId): Promise<MemberStats>;
}

// === 成員操作日誌 ===
export interface MemberOperationLog {
  id: EntityId;
  relationshipId: EntityId;
  /** 操作類型 */
  operation: 'add' | 'remove' | 'role_change' | 'status_change' | 'permission_change';
  /** 操作者 ID */
  operatorId: EntityId;
  /** 操作者名稱 */
  operatorName: string;
  /** 目標用戶 ID */
  targetUserId: EntityId;
  /** 目標用戶名稱 */
  targetUserName: string;
  /** 操作詳情 */
  details: string;
  /** 操作前狀態 */
  beforeState?: Record<string, unknown>;
  /** 操作後狀態 */
  afterState?: Record<string, unknown>;
  /** 操作時間 */
  timestamp: Date;
  /** 操作 IP */
  ipAddress?: string;
  /** User Agent */
  userAgent?: string;
}

// === 預設配置 ===
export const DEFAULT_MEMBER_QUERY: Partial<MemberQuery> = {
  status: [UserGroupStatus.ACTIVE],
  includeRemoved: false,
  onlineOnly: false,
};

// === 成員等級定義 ===
export const MEMBER_PERMISSION_LEVELS = {
  OWNER: 100,
  ADMIN: 80,
  EDITOR: 60,
  VIEWER: 20,
  CUSTOM: 50, // 自定義角色的預設等級
} as const;

// === 快速操作類型 ===
export type QuickMemberAction =
  | 'promote_to_admin'
  | 'demote_to_editor'
  | 'demote_to_viewer'
  | 'block'
  | 'unblock'
  | 'remove';

export interface QuickMemberActionData {
  relationshipId: EntityId;
  action: QuickMemberAction;
  reason?: string;
}
