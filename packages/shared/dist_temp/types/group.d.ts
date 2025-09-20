/**
 * 群組和訂閱相關類型定義
 * 包含群組實體、訂閱方案、使用限制等相關介面
 */
import { BaseEntity, EntityId, Settings } from './common';
export declare enum SubscriptionTier {
  /** 免費方案 */
  FREE = 'free',
  /** 專業方案 */
  PRO = 'pro',
  /** 團隊方案 */
  TEAM = 'team',
  /** 企業方案 */
  ENTERPRISE = 'enterprise',
}
export interface GroupLimits {
  /** 成員上限 */
  maxMembers: number;
  /** 問卷上限 */
  maxSurveys: number;
  /** 月回應上限 */
  maxResponses: number;
  /** 儲存空間上限 (MB) */
  maxStorage: number;
  /** 可用功能列表 */
  features: string[];
  /** 每日 AI 調用上限 */
  maxAiCallsPerDay: number;
  /** 自定義角色上限 */
  maxCustomRoles: number;
  /** API 調用上限 */
  maxApiCalls: number;
  /** 支援的匯出格式 */
  exportFormats: string[];
  /** 進階分析功能 */
  advancedAnalytics: boolean;
  /** 白標功能 */
  whiteLabel: boolean;
}
export interface GroupStats {
  /** 成員數量 */
  memberCount: number;
  /** 問卷數量 */
  surveyCount: number;
  /** 本月回應數 */
  monthlyResponses: number;
  /** 已使用儲存空間 (MB) */
  storageUsed: number;
  /** 本月 API 調用數 */
  apiCallsThisMonth: number;
  /** 今日 AI 調用數 */
  aiCallsToday: number;
  /** AI 調用統計日期 (YYYY-MM-DD) */
  aiCallsDate: string;
  /** 統計月份 (YYYY-MM 格式) */
  statsMonth: string;
  /** 最後更新時間 */
  lastUpdated: Date;
}
export interface GroupSettings {
  /** 是否允許成員邀請他人 */
  allowMemberInvites: boolean;
  /** 是否公開群組資訊 */
  isPublic: boolean;
  /** 問卷預設為公開 */
  defaultSurveyPublic: boolean;
  /** 是否需要管理員審核新問卷 */
  requireApprovalForSurveys: boolean;
  /** 預設問卷主題 */
  defaultTheme?: string;
  /** 自定義域名 (企業版功能) */
  customDomain?: string;
  /** 額外配置 */
  customSettings?: Settings;
}
export interface Group extends BaseEntity {
  /** 群組名稱 */
  name: string;
  /** 群組所有者 ID */
  ownerId: EntityId;
  /** 訂閱方案層級 */
  subscriptionTier: SubscriptionTier;
  /** 外部訂閱 ID (預留給付費系統) */
  subscriptionId?: string;
  /** 限制配置 (根據訂閱層級設定) */
  limits: GroupLimits;
  /** 當前使用統計 */
  stats: GroupStats;
  /** 群組描述 */
  description?: string;
  /** 群組頭像 URL */
  avatar?: string;
  /** 群組設定 */
  settings: GroupSettings;
}
export interface PublicGroup {
  id: EntityId;
  name: string;
  description?: string;
  avatar?: string;
  memberCount: number;
  isPublic: boolean;
  subscriptionTier: SubscriptionTier;
  createdAt: Date;
}
export interface GroupSummary {
  id: EntityId;
  name: string;
  description?: string;
  avatar?: string;
  ownerId: EntityId;
  subscriptionTier: SubscriptionTier;
  memberCount: number;
  surveyCount: number;
  userRole: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateGroupData {
  name: string;
  description?: string;
  settings?: Partial<GroupSettings>;
}
export interface UpdateGroupData {
  name?: string;
  description?: string;
  avatar?: string;
  settings?: Partial<GroupSettings>;
}
export interface UpdateGroupLimitsData {
  limits: Partial<GroupLimits>;
  subscriptionTier?: SubscriptionTier;
}
export interface GroupQuery {
  /** 搜尋關鍵字（群組名稱或描述） */
  search?: string;
  /** 訂閱方案過濾 */
  subscriptionTier?: SubscriptionTier[];
  /** 只顯示我擁有的群組 */
  ownedByMe?: boolean;
  /** 只顯示公開群組 */
  publicOnly?: boolean;
  /** 成員數量範圍 */
  minMembers?: number;
  maxMembers?: number;
  /** 創建時間範圍 */
  createdAfter?: Date;
  createdBefore?: Date;
}
export interface GroupMember {
  userId: EntityId;
  groupId: EntityId;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  roleName: string;
  roleColor?: string;
  status: 'active' | 'pending' | 'blocked';
  joinedAt: Date;
  invitedBy?: EntityId;
  lastActivity?: Date;
}
export interface GroupMemberQuery {
  /** 搜尋關鍵字（姓名或 email） */
  search?: string;
  /** 角色過濾 */
  roles?: string[];
  /** 成員狀態過濾 */
  status?: ('active' | 'pending' | 'blocked')[];
  /** 加入時間範圍 */
  joinedAfter?: Date;
  joinedBefore?: Date;
}
export interface LimitCheckResult {
  /** 是否允許操作 */
  allowed: boolean;
  /** 當前使用量 */
  current: number;
  /** 限制上限 (-1 表示無限制) */
  limit: number;
  /** 使用率 (0-1) */
  usage: number;
  /** 警告訊息 */
  warning?: string;
  /** 建議升級的方案 */
  suggestedTier?: SubscriptionTier;
}
export interface GroupUsageSummary {
  groupId: EntityId;
  subscriptionTier: SubscriptionTier;
  limits: GroupLimits;
  usage: GroupStats;
  warnings: string[];
  recommendations: string[];
  memberUsage: LimitCheckResult;
  surveyUsage: LimitCheckResult;
  responseUsage: LimitCheckResult;
  storageUsage: LimitCheckResult;
  apiUsage: LimitCheckResult;
}
export declare const DEFAULT_GROUP_SETTINGS: GroupSettings;
export declare const DEFAULT_GROUP_STATS: GroupStats;
export declare const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, GroupLimits>;
/** Phase 1 測試環境預設方案 */
export declare const DEFAULT_SUBSCRIPTION_TIER = SubscriptionTier.ENTERPRISE;
/** 新建 Group 的預設限制配置 */
export declare const DEFAULT_GROUP_LIMITS: GroupLimits;
export type FeatureFlag =
  | 'basic_surveys'
  | 'basic_analytics'
  | 'all_question_types'
  | 'logic_branching'
  | 'themes'
  | 'collaboration'
  | 'approval_workflow'
  | 'team_analytics'
  | 'sso'
  | 'custom_domain'
  | 'dedicated_support';
export interface GroupActivity {
  id: EntityId;
  groupId: EntityId;
  userId: EntityId;
  /** 活動類型 */
  type:
    | 'member_join'
    | 'member_leave'
    | 'member_invite'
    | 'survey_create'
    | 'survey_publish'
    | 'role_assign'
    | 'settings_update';
  /** 活動描述 */
  description: string;
  /** 相關資源 ID */
  resourceId?: EntityId;
  /** 資源類型 */
  resourceType?: string;
  /** 活動時間 */
  timestamp: Date;
  /** 額外資料 */
  metadata?: Record<string, unknown>;
}
