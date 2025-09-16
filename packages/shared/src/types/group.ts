/**
 * 群組和訂閱相關類型定義
 * 包含群組實體、訂閱方案、使用限制等相關介面
 */

import { BaseEntity, EntityId, Settings } from './common';

// === 訂閱方案層級 ===
export enum SubscriptionTier {
  /** 免費方案 */
  FREE = 'free',
  /** 專業方案 */
  PRO = 'pro',
  /** 團隊方案 */
  TEAM = 'team',
  /** 企業方案 */
  ENTERPRISE = 'enterprise',
}

// === 群組限制配置 ===
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

  // === 高級功能限制 ===
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

// === 群組使用統計 ===
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

  // === 統計週期 ===
  /** 統計月份 (YYYY-MM 格式) */
  statsMonth: string;
  /** 最後更新時間 */
  lastUpdated: Date;
}

// === 群組設定 ===
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

// === 完整群組實體 ===
export interface Group extends BaseEntity {
  /** 群組名稱 */
  name: string;
  /** 群組所有者 ID */
  ownerId: EntityId;

  // === 訂閱相關 ===
  /** 訂閱方案層級 */
  subscriptionTier: SubscriptionTier;
  /** 外部訂閱 ID (預留給付費系統) */
  subscriptionId?: string;

  // === 限制和統計 ===
  /** 限制配置 (根據訂閱層級設定) */
  limits: GroupLimits;
  /** 當前使用統計 */
  stats: GroupStats;

  // === 基本資訊 ===
  /** 群組描述 */
  description?: string;
  /** 群組頭像 URL */
  avatar?: string;
  /** 群組設定 */
  settings: GroupSettings;
}

// === 公開群組資訊 (不包含敏感資料) ===
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

// === 群組摘要 (用於列表顯示) ===
export interface GroupSummary {
  id: EntityId;
  name: string;
  description?: string;
  avatar?: string;
  ownerId: EntityId;
  subscriptionTier: SubscriptionTier;
  memberCount: number;
  surveyCount: number;
  userRole: string; // 當前用戶在此群組的角色
  createdAt: Date;
  updatedAt: Date;
}

// === 群組相關 DTO ===
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

// === 群組查詢和過濾 ===
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

// === 群組成員相關 ===
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

// === 群組限制檢查結果 ===
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

// === 群組使用情況摘要 ===
export interface GroupUsageSummary {
  groupId: EntityId;
  subscriptionTier: SubscriptionTier;
  limits: GroupLimits;
  usage: GroupStats;
  warnings: string[];
  recommendations: string[];

  // === 各項使用率 ===
  memberUsage: LimitCheckResult;
  surveyUsage: LimitCheckResult;
  responseUsage: LimitCheckResult;
  storageUsage: LimitCheckResult;
  apiUsage: LimitCheckResult;
}

// === 預設配置 ===
export const DEFAULT_GROUP_SETTINGS: GroupSettings = {
  allowMemberInvites: false,
  isPublic: false,
  defaultSurveyPublic: false,
  requireApprovalForSurveys: false,
};

export const DEFAULT_GROUP_STATS: GroupStats = {
  memberCount: 1, // 創建者
  surveyCount: 0,
  monthlyResponses: 0,
  storageUsed: 0,
  apiCallsThisMonth: 0,
  statsMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
  lastUpdated: new Date(),
};

// === 訂閱方案限制配置 ===
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, GroupLimits> = {
  [SubscriptionTier.FREE]: {
    maxMembers: 5,
    maxSurveys: 3,
    maxResponses: 100,
    maxStorage: 50, // 50MB
    maxCustomRoles: 1,
    maxApiCalls: 0,
    features: ['basic_surveys', 'basic_analytics'],
    exportFormats: ['csv'],
    advancedAnalytics: false,
    whiteLabel: false,
  },

  [SubscriptionTier.PRO]: {
    maxMembers: 20,
    maxSurveys: -1, // 無限制
    maxResponses: 10000,
    maxStorage: 1000, // 1GB
    maxCustomRoles: 5,
    maxApiCalls: 10000,
    features: ['all_question_types', 'logic_branching', 'themes'],
    exportFormats: ['csv', 'xlsx', 'pdf'],
    advancedAnalytics: true,
    whiteLabel: false,
  },

  [SubscriptionTier.TEAM]: {
    maxMembers: 100,
    maxSurveys: -1,
    maxResponses: 50000,
    maxStorage: 5000, // 5GB
    maxCustomRoles: 20,
    maxApiCalls: 50000,
    features: ['collaboration', 'approval_workflow', 'team_analytics'],
    exportFormats: ['csv', 'xlsx', 'pdf', 'pptx'],
    advancedAnalytics: true,
    whiteLabel: true,
  },

  [SubscriptionTier.ENTERPRISE]: {
    maxMembers: -1, // 無限制
    maxSurveys: -1,
    maxResponses: -1,
    maxStorage: -1,
    maxCustomRoles: -1,
    maxApiCalls: -1,
    features: ['sso', 'custom_domain', 'dedicated_support'],
    exportFormats: ['csv', 'xlsx', 'pdf', 'pptx', 'api'],
    advancedAnalytics: true,
    whiteLabel: true,
  },
};

// === 功能檢查輔助函數類型 ===
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

// === 群組活動記錄 ===
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
