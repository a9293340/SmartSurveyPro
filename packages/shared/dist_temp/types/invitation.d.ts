/**
 * 邀請系統相關類型定義
 * 包含邀請實體、邀請流程、邀請狀態等相關介面
 */
import { BaseEntity, EntityId } from './common';
export declare enum InvitationStatus {
  /** 待處理 */
  PENDING = 'pending',
  /** 已接受 */
  ACCEPTED = 'accepted',
  /** 已拒絕 */
  REJECTED = 'rejected',
  /** 已過期 */
  EXPIRED = 'expired',
  /** 已取消 */
  CANCELLED = 'cancelled',
}
export declare enum InvitationType {
  /** 電子郵件邀請 */
  EMAIL = 'email',
  /** 連結分享邀請 */
  LINK = 'link',
  /** 系統內邀請 */
  INTERNAL = 'internal',
}
export interface Invitation extends BaseEntity {
  /** 目標群組 ID */
  groupId: EntityId;
  /** 邀請人 ID */
  inviterId: EntityId;
  /** 被邀請人 email */
  email: string;
  /** 預分配角色 ID */
  roleId: EntityId;
  /** 唯一邀請 token (UUID) */
  token: string;
  /** 邀請狀態 */
  status: InvitationStatus;
  /** 邀請類型 */
  type: InvitationType;
  /** 邀請訊息 */
  message?: string;
  /** 過期時間 (預設 7天) */
  expiresAt: Date;
  /** 接受時間 */
  acceptedAt?: Date;
  /** 拒絕時間 */
  rejectedAt?: Date;
  /** 取消時間 */
  cancelledAt?: Date;
  /** 邀請來源 */
  source?: string;
  /** 額外元數據 */
  metadata?: Record<string, unknown>;
}
export interface InvitationSummary {
  id: EntityId;
  groupId: EntityId;
  groupName: string;
  inviterName: string;
  inviterAvatar?: string;
  email: string;
  roleName: string;
  roleColor?: string;
  status: InvitationStatus;
  type: InvitationType;
  message?: string;
  expiresAt: Date;
  createdAt: Date;
}
export interface InvitationDetails {
  id: EntityId;
  token: string;
  status: InvitationStatus;
  group: {
    id: EntityId;
    name: string;
    description?: string;
    avatar?: string;
    memberCount: number;
    subscriptionTier: string;
  };
  inviter: {
    id: EntityId;
    name: string;
    email: string;
    avatar?: string;
  };
  role: {
    id: EntityId;
    name: string;
    description?: string;
    color?: string;
    permissions: string[];
  };
  email: string;
  message?: string;
  expiresAt: Date;
  createdAt: Date;
  invitee?: {
    id: EntityId;
    name: string;
    avatar?: string;
    isRegistered: boolean;
  };
}
export interface SendInvitationData {
  /** 被邀請人 email */
  email: string;
  /** 預分配角色 ID */
  roleId: EntityId;
  /** 邀請訊息 */
  message?: string;
  /** 邀請類型 */
  type?: InvitationType;
  /** 自定義過期時間 */
  expiresAt?: Date;
}
export interface BulkInvitationData {
  /** 邀請列表 */
  invitations: Array<{
    email: string;
    roleId: EntityId;
    message?: string;
  }>;
  /** 預設角色 ID (如果個別邀請沒指定) */
  defaultRoleId?: EntityId;
  /** 預設訊息 (如果個別邀請沒指定) */
  defaultMessage?: string;
  /** 邀請類型 */
  type?: InvitationType;
}
export interface AcceptInvitationData {
  /** 邀請 token */
  token: string;
  /** 接受者的用戶 ID (如果已登入) */
  userId?: EntityId;
  /** 額外資料 */
  metadata?: Record<string, unknown>;
}
export interface RejectInvitationData {
  /** 邀請 token */
  token: string;
  /** 拒絕原因 */
  reason?: string;
  /** 額外資料 */
  metadata?: Record<string, unknown>;
}
export interface ResendInvitationData {
  /** 邀請 ID */
  invitationId: EntityId;
  /** 新的過期時間 (可選) */
  newExpiresAt?: Date;
  /** 更新的訊息 (可選) */
  newMessage?: string;
}
export interface InvitationQuery {
  /** 搜尋關鍵字（email 或邀請人姓名） */
  search?: string;
  /** 群組 ID 過濾 */
  groupId?: EntityId;
  /** 邀請人 ID 過濾 */
  inviterId?: EntityId;
  /** 狀態過濾 */
  status?: InvitationStatus[];
  /** 類型過濾 */
  type?: InvitationType[];
  /** 角色過濾 */
  roleIds?: EntityId[];
  /** 是否包含已過期 */
  includeExpired?: boolean;
  /** 創建時間範圍 */
  createdAfter?: Date;
  createdBefore?: Date;
  /** 過期時間範圍 */
  expiresAfter?: Date;
  expiresBefore?: Date;
}
export interface InvitationStats {
  /** 總邀請數 */
  total: number;
  /** 待處理 */
  pending: number;
  /** 已接受 */
  accepted: number;
  /** 已拒絕 */
  rejected: number;
  /** 已過期 */
  expired: number;
  /** 已取消 */
  cancelled: number;
  /** 接受率 */
  acceptanceRate: number;
  /** 回應率 */
  responseRate: number;
}
export interface BulkInvitationResult {
  /** 總處理數量 */
  total: number;
  /** 成功數量 */
  success: number;
  /** 失敗數量 */
  failed: number;
  /** 跳過數量（如已存在） */
  skipped: number;
  /** 成功的邀請列表 */
  successful: Invitation[];
  /** 失敗的記錄 */
  failures: Array<{
    email: string;
    error: string;
    code?: string;
  }>;
  /** 跳過的記錄 */
  skipped_records: Array<{
    email: string;
    reason: string;
  }>;
}
export interface InvitationActionResult {
  /** 操作是否成功 */
  success: boolean;
  /** 結果訊息 */
  message: string;
  /** 重定向 URL (如果需要) */
  redirectUrl?: string;
  /** 額外資料 */
  data?: Record<string, unknown>;
}
export interface InvitationValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 無效原因 */
  reason?: string;
  /** 錯誤代碼 */
  errorCode?:
    | 'EXPIRED'
    | 'NOT_FOUND'
    | 'ALREADY_ACCEPTED'
    | 'ALREADY_REJECTED'
    | 'CANCELLED'
    | 'INVALID_TOKEN';
  /** 邀請詳細資訊 (如果有效) */
  invitation?: InvitationDetails;
}
export interface InvitationSettings {
  /** 預設過期天數 */
  defaultExpirationDays: number;
  /** 最大過期天數 */
  maxExpirationDays: number;
  /** 是否允許重新發送 */
  allowResend: boolean;
  /** 重新發送間隔 (小時) */
  resendIntervalHours: number;
  /** 是否需要邀請訊息 */
  requireMessage: boolean;
  /** 邀請訊息最大長度 */
  maxMessageLength: number;
  /** 是否自動清理過期邀請 */
  autoCleanupExpired: boolean;
  /** 自動清理天數 */
  cleanupAfterDays: number;
}
export interface InvitationTemplate {
  id: string;
  name: string;
  description: string;
  /** 邀請訊息模板 */
  messageTemplate: string;
  /** 邀請主題模板 */
  subjectTemplate: string;
  /** 適用的角色 */
  applicableRoles?: string[];
  /** 是否為預設模板 */
  isDefault: boolean;
  /** 模板分類 */
  category: 'general' | 'role_specific' | 'onboarding' | 'collaboration';
}
export interface IInvitationService {
  /** 發送邀請 */
  sendInvitation(
    inviterId: EntityId,
    groupId: EntityId,
    data: SendInvitationData
  ): Promise<Invitation>;
  /** 批次發送邀請 */
  sendBulkInvitations(
    inviterId: EntityId,
    groupId: EntityId,
    data: BulkInvitationData
  ): Promise<BulkInvitationResult>;
  /** 接受邀請 */
  acceptInvitation(data: AcceptInvitationData): Promise<InvitationActionResult>;
  /** 拒絕邀請 */
  rejectInvitation(data: RejectInvitationData): Promise<InvitationActionResult>;
  /** 取消邀請 */
  cancelInvitation(invitationId: EntityId, cancellerId: EntityId): Promise<InvitationActionResult>;
  /** 重新發送邀請 */
  resendInvitation(
    invitationId: EntityId,
    resenderId: EntityId,
    data?: ResendInvitationData
  ): Promise<Invitation>;
  /** 驗證邀請 token */
  validateInvitation(token: string): Promise<InvitationValidationResult>;
  /** 獲取邀請詳細資訊 */
  getInvitationDetails(token: string): Promise<InvitationDetails>;
  /** 獲取群組邀請統計 */
  getInvitationStats(groupId: EntityId): Promise<InvitationStats>;
}
export interface InvitationEvent {
  type:
    | 'invitation_sent'
    | 'invitation_accepted'
    | 'invitation_rejected'
    | 'invitation_expired'
    | 'invitation_cancelled';
  invitationId: EntityId;
  userId?: EntityId;
  timestamp: Date;
  data: Record<string, unknown>;
}
export declare const DEFAULT_INVITATION_SETTINGS: InvitationSettings;
export declare const DEFAULT_INVITATION_TEMPLATES: InvitationTemplate[];
export interface InvitationLimitCheck {
  /** 是否允許發送邀請 */
  allowed: boolean;
  /** 當前已發送邀請數 */
  currentCount: number;
  /** 限制數量 */
  limit: number;
  /** 限制重置時間 */
  resetAt?: Date;
  /** 不允許原因 */
  reason?: string;
}
