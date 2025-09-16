# SmartSurvey Pro - 用戶權限系統設計文件

> 📅 文件版本：v1.0 📝 最後更新：2025-01-16
> 👥 設計團隊：架構討論成果 🎯 狀態：Phase 1-2 設計階段

---

## 📋 概述

SmartSurvey Pro 採用**企業級多租戶權限管理系統**，基於 **ABAC (Attribute-Based
Access Control)** 模型，支援複雜的群組協作和細粒度權限控制。

### 🎯 核心設計原則

- **多租戶架構**：一個用戶可以參與多個群組，每個群組獨立管理
- **ABAC 權限模型**：基於角色和權限的屬性控制
- **靈活的角色系統**：預設角色 + 自定義角色
- **完整的邀請機制**：支援 Email 邀請和角色預分配
- **訂閱系統預留**：為未來的付費功能預留擴展接口

---

## 🏗️ 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    SmartSurvey Pro                         │
│                 多租戶權限架構系統                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────────────────────────┐
│    User     │    │             Group               │
│  (個人用戶)   │    │          (工作群組)              │
├─────────────┤    ├─────────────────────────────────┤
│ id          │    │ id                              │
│ email       │◄──►│ ownerId (User.id)               │
│ name        │    │ name                            │
│ avatar      │    │ subscriptionTier (預留)          │
│ emailVerified│   │ limits (預留訂閱限制)            │
│ createdAt   │    │ stats (統計資料)                 │
│ updatedAt   │    │ createdAt                       │
└─────────────┘    └─────────────────────────────────┘
       │                         │
       │            ┌─────────────────────────────────┐
       │            │         Invitation              │
       │            │        (邀請機制)                │
       │            ├─────────────────────────────────┤
       │            │ id                              │
       │            │ groupId (Group.id)              │
       │            │ inviterId (User.id)             │
       │            │ email (被邀請人)                 │
       │            │ roleId (Role.id)                │
       │            │ token                           │
       │            │ status                          │
       │            │ expiresAt                       │
       │            └─────────────────────────────────┘
       │                         │
       └──────┬─────────────┬────┘
              │             │
    ┌─────────▼─────────────▼─────────┐
    │        UserGroupRole           │
    │      (用戶群組角色關聯表)         │
    ├─────────────────────────────────┤
    │ userId (User.id)                │
    │ groupId (Group.id)              │
    │ roleId (Role.id)                │
    │ joinedAt                        │
    │ invitedBy (User.id)             │
    │ status (active/pending/blocked) │
    └─────────────────────────────────┘
                      │
                      │
    ┌─────────────────▼─────────────────┐
    │              Role                 │
    │        (角色：預設+自定義)           │
    ├───────────────────────────────────┤
    │ id                                │
    │ groupId (Group.id)                │
    │ name (Owner/Admin/Editor/...)     │
    │ description                       │
    │ permissions[] (Permission.id[])   │
    │ isSystemRole (預設角色標記)        │
    │ isDeletable                       │
    │ isEditable                        │
    │ createdBy (User.id)               │
    │ createdAt                         │
    └───────────────────────────────────┘
                      │
                      │
    ┌─────────────────▼─────────────────┐
    │           Permission              │
    │          (原子化權限)              │
    ├───────────────────────────────────┤
    │ id                                │
    │ resource (survey/analytics/team)  │
    │ action (create/read/update/delete)│
    │ scope (own/group/assigned/all)    │
    │ description                       │
    │ category (用於權限分組顯示)        │
    └───────────────────────────────────┘
```

---

## 🔐 權限模型設計 (ABAC)

### 權限結構

```typescript
interface Permission {
  id: string;
  resource: string; // 資源類型: survey, analytics, team, role
  action: string; // 操作類型: create, read, update, delete, manage
  scope: string; // 範圍: own, group, assigned, all
  description: string; // 權限描述
  category: string; // 分類: 用於 UI 顯示分組
}
```

### 預定義權限清單

```typescript
const PERMISSIONS = {
  // 問卷相關權限
  'survey.create': {
    resource: 'survey',
    action: 'create',
    scope: 'group',
    description: '創建問卷',
    category: 'survey',
  },
  'survey.read.own': {
    resource: 'survey',
    action: 'read',
    scope: 'own',
    description: '查看自己的問卷',
    category: 'survey',
  },
  'survey.read.group': {
    resource: 'survey',
    action: 'read',
    scope: 'group',
    description: '查看群組問卷',
    category: 'survey',
  },
  'survey.update.own': {
    resource: 'survey',
    action: 'update',
    scope: 'own',
    description: '編輯自己的問卷',
    category: 'survey',
  },
  'survey.update.assigned': {
    resource: 'survey',
    action: 'update',
    scope: 'assigned',
    description: '編輯分配的問卷',
    category: 'survey',
  },
  'survey.update.all': {
    resource: 'survey',
    action: 'update',
    scope: 'all',
    description: '編輯所有問卷',
    category: 'survey',
  },
  'survey.delete.own': {
    resource: 'survey',
    action: 'delete',
    scope: 'own',
    description: '刪除自己的問卷',
    category: 'survey',
  },
  'survey.delete.all': {
    resource: 'survey',
    action: 'delete',
    scope: 'all',
    description: '刪除任何問卷',
    category: 'survey',
  },
  'survey.publish.own': {
    resource: 'survey',
    action: 'publish',
    scope: 'own',
    description: '發布自己的問卷',
    category: 'survey',
  },
  'survey.duplicate': {
    resource: 'survey',
    action: 'duplicate',
    scope: 'group',
    description: '複製問卷',
    category: 'survey',
  },

  // 分析相關權限
  'analytics.read.own': {
    resource: 'analytics',
    action: 'read',
    scope: 'own',
    description: '查看自己的分析數據',
    category: 'analytics',
  },
  'analytics.read.assigned': {
    resource: 'analytics',
    action: 'read',
    scope: 'assigned',
    description: '查看分配的分析數據',
    category: 'analytics',
  },
  'analytics.read.all': {
    resource: 'analytics',
    action: 'read',
    scope: 'all',
    description: '查看所有分析數據',
    category: 'analytics',
  },
  'analytics.export': {
    resource: 'analytics',
    action: 'export',
    scope: 'group',
    description: '匯出分析數據',
    category: 'analytics',
  },

  // 團隊管理權限
  'team.invite': {
    resource: 'team',
    action: 'invite',
    scope: 'group',
    description: '邀請成員',
    category: 'team',
  },
  'team.member.remove': {
    resource: 'team',
    action: 'remove',
    scope: 'group',
    description: '移除成員',
    category: 'team',
  },
  'team.member.manage': {
    resource: 'team',
    action: 'manage',
    scope: 'group',
    description: '管理成員設定',
    category: 'team',
  },
  'team.settings': {
    resource: 'team',
    action: 'manage',
    scope: 'group',
    description: '管理群組設定',
    category: 'team',
  },

  // 角色管理權限
  'role.create': {
    resource: 'role',
    action: 'create',
    scope: 'group',
    description: '創建自定義角色',
    category: 'role',
  },
  'role.edit': {
    resource: 'role',
    action: 'update',
    scope: 'group',
    description: '編輯角色權限',
    category: 'role',
  },
  'role.assign': {
    resource: 'role',
    action: 'assign',
    scope: 'group',
    description: '分配角色給成員',
    category: 'role',
  },
  'role.delete': {
    resource: 'role',
    action: 'delete',
    scope: 'group',
    description: '刪除自定義角色',
    category: 'role',
  },
};
```

### 權限檢查邏輯

```typescript
class PermissionService {
  /**
   * 檢查用戶是否有特定權限
   */
  async hasPermission(
    userId: string,
    groupId: string,
    permission: string,
    resourceId?: string
  ): Promise<boolean> {
    const group = await this.getGroup(groupId);
    const user = await this.getUser(userId);

    // 1. 檢查是否為 Group Owner (擁有所有權限)
    if (group.ownerId === userId) {
      return true;
    }

    // 2. 獲取用戶在該群組的角色
    const userRole = await this.getUserRoleInGroup(userId, groupId);
    if (!userRole || userRole.status !== 'active') {
      return false;
    }

    // 3. 檢查角色是否有該權限
    const role = await this.getRole(userRole.roleId);

    // 4. 萬用權限檢查
    if (role.permissions.includes('*')) {
      return true;
    }

    // 5. 具體權限檢查
    if (role.permissions.includes(permission)) {
      return this.checkScope(permission, userId, resourceId);
    }

    return false;
  }

  /**
   * 檢查權限範圍 (own, assigned, group, all)
   */
  private async checkScope(
    permission: string,
    userId: string,
    resourceId?: string
  ): Promise<boolean> {
    const [resource, action, scope] = permission.split('.');

    if (!scope || scope === 'group' || scope === 'all') {
      return true;
    }

    if (scope === 'own' && resourceId) {
      // 檢查資源是否屬於該用戶
      return await this.isResourceOwner(resource, resourceId, userId);
    }

    if (scope === 'assigned' && resourceId) {
      // 檢查資源是否分配給該用戶
      return await this.isResourceAssigned(resource, resourceId, userId);
    }

    return false;
  }
}
```

---

## 👥 預設角色系統

### 系統預設角色

```typescript
const DEFAULT_ROLES = {
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
};
```

### 角色管理策略

1. **Owner 特權**：
   - 自動擁有所有權限 (`permissions: ['*']`)
   - 不可被移除或降級
   - 可以編輯所有其他角色的權限

2. **系統角色保護**：
   - 預設角色不可刪除 (`isDeletable: false`)
   - Owner 角色不可編輯權限 (`isEditable: false`)
   - 其他系統角色權限可由 Owner 調整

3. **自定義角色**：
   - 由 Admin+ 權限用戶創建
   - 可自由編輯權限組合
   - 可刪除（如無人使用）

---

## 📧 邀請流程設計

### 邀請實體結構

```typescript
interface Invitation {
  id: string;
  groupId: string; // 目標群組
  inviterId: string; // 邀請人 ID
  email: string; // 被邀請人 email
  roleId: string; // 預分配角色
  token: string; // 唯一邀請 token (UUID)
  status: InvitationStatus; // 邀請狀態
  message?: string; // 邀請訊息
  expiresAt: Date; // 過期時間 (7天)
  createdAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

enum InvitationStatus {
  PENDING = 'pending', // 待處理
  ACCEPTED = 'accepted', // 已接受
  REJECTED = 'rejected', // 已拒絕
  EXPIRED = 'expired', // 已過期
  CANCELLED = 'cancelled', // 已取消
}
```

### 邀請流程步驟

```
1. 發送邀請
   ├─ 檢查邀請人權限 (team.invite)
   ├─ 檢查群組成員限制 (訂閱相關)
   ├─ 檢查 email 是否已在群組中
   ├─ 生成邀請記錄和 token
   ├─ 發送邀請 email
   └─ 記錄邀請日誌

2. 接收邀請
   ├─ 用戶點擊 email 中的邀請連結
   ├─ 驗證 token 有效性和過期時間
   ├─ 顯示邀請詳情 (群組名稱、角色、邀請人)
   └─ 提供接受/拒絕選項

3. 處理接受
   ├─ 檢查用戶是否已註冊
   ├─ 未註冊：引導註冊流程
   ├─ 已註冊：直接處理加入
   ├─ 在群組中創建 UserGroupRole 記錄
   ├─ 更新邀請狀態為 accepted
   ├─ 發送歡迎通知
   └─ 重定向到群組頁面

4. 處理拒絕
   ├─ 更新邀請狀態為 rejected
   ├─ 通知邀請人
   └─ 記錄拒絕原因 (可選)
```

### 邀請服務實作

```typescript
class InvitationService {
  /**
   * 發送邀請
   */
  async sendInvitation(
    inviterId: string,
    groupId: string,
    email: string,
    roleId: string,
    message?: string
  ): Promise<Invitation> {
    // 1. 權限檢查
    await this.checkPermission(inviterId, groupId, 'team.invite');

    // 2. 業務規則檢查
    await this.validateInvitation(groupId, email);

    // 3. 創建邀請記錄
    const invitation = await this.createInvitation({
      groupId,
      inviterId,
      email,
      roleId,
      message,
      token: this.generateToken(),
      expiresAt: this.getExpirationDate(), // 7天後
    });

    // 4. 發送邀請 email
    await this.emailService.sendInvitation(invitation);

    // 5. 記錄操作日誌
    await this.logService.logInvitation(invitation);

    return invitation;
  }

  /**
   * 接受邀請
   */
  async acceptInvitation(
    token: string,
    userId?: string
  ): Promise<{ success: boolean; redirectUrl: string }> {
    // 1. 驗證邀請
    const invitation = await this.validateInvitationToken(token);

    // 2. 處理用戶狀態
    if (!userId) {
      // 引導到註冊頁面，保持 token
      return {
        success: false,
        redirectUrl: `/auth/register?invitation=${token}`,
      };
    }

    // 3. 加入群組
    await this.addUserToGroup(
      userId,
      invitation.groupId,
      invitation.roleId,
      invitation.inviterId
    );

    // 4. 更新邀請狀態
    await this.updateInvitationStatus(invitation.id, 'accepted');

    // 5. 發送通知
    await this.notificationService.notifyInvitationAccepted(invitation);

    return {
      success: true,
      redirectUrl: `/groups/${invitation.groupId}`,
    };
  }
}
```

---

## 💰 訂閱系統預留設計

### 群組限制結構

```typescript
interface Group {
  id: string;
  name: string;
  ownerId: string;

  // 訂閱相關
  subscriptionTier: SubscriptionTier;
  subscriptionId?: string; // 外部訂閱 ID (預留)

  // 限制配置 (根據訂閱層級設定)
  limits: GroupLimits;

  // 當前使用統計
  stats: GroupStats;

  // 基本資訊
  description?: string;
  avatar?: string;
  settings: GroupSettings;
  createdAt: Date;
  updatedAt: Date;
}

enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
}

interface GroupLimits {
  maxMembers: number; // 成員上限
  maxSurveys: number; // 問卷上限
  maxResponses: number; // 月回應上限
  maxStorage: number; // 儲存空間上限 (MB)
  features: string[]; // 可用功能列表

  // 高級功能限制
  maxCustomRoles: number; // 自定義角色上限
  maxApiCalls: number; // API 調用上限
  exportFormats: string[]; // 支援的匯出格式
  advancedAnalytics: boolean; // 進階分析功能
  whiteLabel: boolean; // 白標功能
}

interface GroupStats {
  memberCount: number;
  surveyCount: number;
  monthlyResponses: number;
  storageUsed: number; // MB
  apiCallsThisMonth: number;

  // 統計週期
  statsMonth: string; // YYYY-MM 格式
  lastUpdated: Date;
}
```

### 訂閱層級配置

```typescript
const SUBSCRIPTION_LIMITS = {
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
```

### 限制檢查服務

```typescript
class SubscriptionLimitService {
  /**
   * 檢查是否可以添加新成員
   */
  async canAddMember(groupId: string): Promise<boolean> {
    const group = await this.getGroupWithStats(groupId);
    const limits = SUBSCRIPTION_LIMITS[group.subscriptionTier];

    if (limits.maxMembers === -1) return true; // 無限制

    return group.stats.memberCount < limits.maxMembers;
  }

  /**
   * 檢查是否可以創建新問卷
   */
  async canCreateSurvey(groupId: string): Promise<boolean> {
    const group = await this.getGroupWithStats(groupId);
    const limits = SUBSCRIPTION_LIMITS[group.subscriptionTier];

    if (limits.maxSurveys === -1) return true; // 無限制

    return group.stats.surveyCount < limits.maxSurveys;
  }

  /**
   * 檢查功能是否可用
   */
  async hasFeature(groupId: string, feature: string): Promise<boolean> {
    const group = await this.getGroup(groupId);
    const limits = SUBSCRIPTION_LIMITS[group.subscriptionTier];

    return limits.features.includes(feature);
  }

  /**
   * 獲取訂閱限制資訊
   */
  async getLimitsInfo(groupId: string): Promise<{
    limits: GroupLimits;
    usage: GroupStats;
    warnings: string[];
  }> {
    const group = await this.getGroupWithStats(groupId);
    const limits = SUBSCRIPTION_LIMITS[group.subscriptionTier];
    const warnings = [];

    // 生成警告訊息
    if (
      limits.maxMembers !== -1 &&
      group.stats.memberCount >= limits.maxMembers * 0.8
    ) {
      warnings.push('成員數量接近上限');
    }

    if (
      limits.maxSurveys !== -1 &&
      group.stats.surveyCount >= limits.maxSurveys * 0.8
    ) {
      warnings.push('問卷數量接近上限');
    }

    return {
      limits,
      usage: group.stats,
      warnings,
    };
  }
}
```

---

## 🗄️ 資料庫設計

### MongoDB Collections

```typescript
// users collection
{
  _id: ObjectId,
  email: string,              // 唯一索引
  name: string,
  avatar?: string,
  passwordHash: string,
  emailVerified: boolean,
  emailVerificationToken?: string,
  resetPasswordToken?: string,
  resetPasswordExpires?: Date,
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date
}

// groups collection
{
  _id: ObjectId,
  name: string,
  ownerId: ObjectId,          // 索引
  subscriptionTier: string,
  subscriptionId?: string,
  limits: GroupLimits,
  stats: GroupStats,
  description?: string,
  avatar?: string,
  settings: GroupSettings,
  createdAt: Date,
  updatedAt: Date
}

// user_group_roles collection
{
  _id: ObjectId,
  userId: ObjectId,           // 複合索引 (userId, groupId)
  groupId: ObjectId,          // 索引
  roleId: ObjectId,           // 索引
  status: string,             // active, pending, blocked
  joinedAt: Date,
  invitedBy?: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// roles collection
{
  _id: ObjectId,
  groupId: ObjectId,          // 索引
  name: string,
  description?: string,
  permissions: string[],      // 權限 ID 陣列
  isSystemRole: boolean,
  isDeletable: boolean,
  isEditable: boolean,
  color?: string,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// permissions collection (系統預設，不常變動)
{
  _id: string,                // 使用權限 ID 作為主鍵 如 'survey.create'
  resource: string,
  action: string,
  scope: string,
  description: string,
  category: string,
  createdAt: Date
}

// invitations collection
{
  _id: ObjectId,
  groupId: ObjectId,          // 索引
  inviterId: ObjectId,        // 索引
  email: string,              // 索引
  roleId: ObjectId,
  token: string,              // 唯一索引
  status: string,
  message?: string,
  expiresAt: Date,            // TTL 索引
  acceptedAt?: Date,
  rejectedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 索引策略

```typescript
// users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ emailVerificationToken: 1 });
db.users.createIndex({ resetPasswordToken: 1 });

// groups collection
db.groups.createIndex({ ownerId: 1 });
db.groups.createIndex({ subscriptionTier: 1 });

// user_group_roles collection
db.user_group_roles.createIndex({ userId: 1, groupId: 1 }, { unique: true });
db.user_group_roles.createIndex({ groupId: 1 });
db.user_group_roles.createIndex({ roleId: 1 });
db.user_group_roles.createIndex({ status: 1 });

// roles collection
db.roles.createIndex({ groupId: 1 });
db.roles.createIndex({ isSystemRole: 1 });

// invitations collection
db.invitations.createIndex({ token: 1 }, { unique: true });
db.invitations.createIndex({ email: 1 });
db.invitations.createIndex({ groupId: 1 });
db.invitations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
db.invitations.createIndex({ status: 1 });
```

---

## 🚀 實作策略

### 開發優先順序

1. **Phase 1-2 (當前)**：
   - ✅ 用戶基本認證 (註冊、登入、email 驗證)
   - ✅ 基礎群組管理
   - ✅ 預設角色系統
   - ⬜ 權限檢查核心邏輯

2. **Phase 2-3**：
   - ⬜ 邀請流程實作
   - ⬜ 自定義角色管理
   - ⬜ 完整的 ABAC 權限檢查

3. **Phase 3+**：
   - ⬜ 訂閱系統整合
   - ⬜ 使用限制檢查
   - ⬜ 高級協作功能

### 關鍵介面預留

```typescript
// 核心服務介面
interface IPermissionService {
  hasPermission(
    userId: string,
    groupId: string,
    permission: string
  ): Promise<boolean>;
  getUserPermissions(userId: string, groupId: string): Promise<string[]>;
  getRolePermissions(roleId: string): Promise<string[]>;
}

interface ISubscriptionService {
  checkLimit(groupId: string, limitType: string): Promise<boolean>;
  upgradeSubscription(
    groupId: string,
    newTier: SubscriptionTier
  ): Promise<void>;
  getUsageStats(groupId: string): Promise<GroupStats>;
}

interface IInvitationService {
  sendInvitation(params: InvitationParams): Promise<Invitation>;
  acceptInvitation(token: string, userId?: string): Promise<InvitationResult>;
  revokeInvitation(invitationId: string, revokerId: string): Promise<void>;
}
```

---

## 📊 總結

這個設計提供了：

✅ **靈活的多租戶架構** - 用戶可參與多個群組 ✅ **細粒度權限控制** -
ABAC 模型支援複雜場景 ✅ **完整的邀請機制** - 支援 email 邀請和角色預分配 ✅
**預設角色系統** - 開箱即用的角色模板 ✅
**訂閱系統預留** - 為付費功能預留完整接口 ✅ **可擴展架構** - 支援未來功能擴展

下一步：開始實作 TypeScript 介面和 Zod 驗證 schemas！

---

_設計文件將隨著實作進度持續更新_
