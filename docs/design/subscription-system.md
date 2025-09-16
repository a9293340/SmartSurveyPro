# 訂閱系統 - 設計文件

> 📅 文件版本：v1.1 📝 最後更新：2025-01-16 👥 設計團隊：Claude + Human
> 🎯 狀態：設計階段

## 概述

SmartSurvey
Pro 訂閱系統採用月付制，結合自然月計算與每日限額控制，確保服務品質與用戶體驗平衡。測試期間預設 Enterprise 等級，支援動態調整企業客戶需求。

## 🔴 重要架構原則

**訂閱綁定對象：Group（團隊），非 User（個人）**

- ✅ **Group 擁有訂閱方案**：每個 Group 有自己的 planType 和使用限制
- ✅ **User 透過 Group 繼承權限**：User 加入 Group 後共享該 Group 的訂閱權益
- ✅ **限制檢查以 Group 為單位**：檢查整個 Group 的總使用量，而非個人使用量
- ✅ **多 Group 場景**：User 可加入多個 Group，每個 Group 有獨立的訂閱方案

### 架構邏輯

```
User ─┐
      ├─ belongs to ─> Group ─> has ─> Subscription Plan
User ─┘                              └─> Usage Limits
```

### 實際應用場景

- **企業 A 的 Group**：Enterprise 方案，無限問卷 + 1000 AI 調用/日
- **個人 User**：同時屬於企業 A (Enterprise) 和朋友的小團隊 (Free)
- **限制檢查**：在企業 A 的 Group 中可無限建問卷，在朋友 Group 中只能建 3 個問卷

## 核心設計原則

### 1. 月付自然月制

- **計費週期**：每自然月（1號-月底）
- **重置時間**：台北時間每日 00:00 重置每日額度
- **簡化邏輯**：避免複雜的按日計算，降低系統複雜度

### 2. 每日限額控制

- **目的**：防止用戶在月初大量消耗資源，確保整月服務品質
- **超量處理**：直接阻擋，不提供降級服務
- **用戶體驗**：清楚提示剩餘額度和重置時間

### 3. 企業級彈性

- **測試預設**：Enterprise 等級，無需額外建立
- **動態調整**：根據企業需求即時調整限額
- **擴展性**：為未來附加服務預留架構空間

## 訂閱方案設計

### 方案架構

| 方案       | 月費 | 問卷數限制 | 每日問卷建立 | 月回應數 | 每日 AI 調用 | 團隊成員 |
| ---------- | ---- | ---------- | ------------ | -------- | ------------ | -------- |
| Free       | $0   | 3個        | 1個          | 100      | 5次          | 1人      |
| Pro        | $29  | 無限       | 20個         | 10,000   | 50次         | 5人      |
| Team       | $99  | 無限       | 50個         | 50,000   | 200次        | 20人     |
| Enterprise | 客製 | 無限       | 100個\*      | 無限\*   | 1000次\*     | 無限\*   |

> \*Enterprise 設定高上限，可依客戶需求動態調整

### 每日限額邏輯

```typescript
interface DailyLimits {
  surveysCreated: number; // 每日可建立問卷數
  aiCallsUsed: number; // 每日 AI 調用次數
  responsesCollected: number; // 每日回應收集數（Enterprise 無限）
}

interface MonthlyLimits {
  totalSurveys: number; // 總問卷數限制
  totalResponses: number; // 月總回應數
  teamMembers: number; // 團隊成員數
}
```

## 系統架構

### 1. 訂閱狀態管理（Group-based）

```typescript
enum SubscriptionStatus {
  ACTIVE = 'active', // 正常使用
  PAST_DUE = 'past_due', // 逾期未付
  CANCELED = 'canceled', // 已取消
  TRIALING = 'trialing', // 試用期
  INCOMPLETE = 'incomplete', // 付款不完整
}

enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
}

// 🔴 重要：訂閱資訊綁定在 Group 上
interface GroupSubscription {
  groupId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  // ...其他訂閱欄位
}
```

### 2. 使用量追蹤系統

```typescript
interface UsageTracking {
  userId: string;
  planType: PlanType;

  // 月度統計
  currentMonth: {
    surveysCreated: number;
    responsesReceived: number;
    aiCallsUsed: number;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
  };

  // 每日統計
  dailyUsage: {
    date: string; // YYYY-MM-DD
    surveysCreated: number;
    aiCallsUsed: number;
    responsesReceived: number;
    resetAt: Date; // 台北時間 00:00
  };

  // 總計
  totalStats: {
    activeSurveys: number;
    totalResponses: number;
    teamMemberCount: number;
  };
}
```

### 3. 限額檢查邏輯

```typescript
interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  remainingDaily?: number;
  remainingMonthly?: number;
  resetTime?: Date;
}

class SubscriptionService {
  async checkSurveyCreationLimit(userId: string): Promise<LimitCheckResult>;
  async checkAICallLimit(userId: string): Promise<LimitCheckResult>;
  async checkResponseLimit(userId: string): Promise<LimitCheckResult>;
  async resetDailyUsage(userId: string): Promise<void>;
}
```

## 資料庫設計

### 1. Subscriptions Collection

```typescript
interface Subscription {
  _id: ObjectId;
  userId: ObjectId;
  planType: PlanType;
  status: SubscriptionStatus;

  // 計費資訊
  billing: {
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    nextBillingDate: Date;
    amount: number;
    currency: string;
  };

  // Enterprise 客製配置
  customLimits?: {
    dailySurveys?: number;
    dailyAICalls?: number;
    monthlyResponses?: number;
    teamMemberLimit?: number;
  };

  // 元資料
  createdAt: Date;
  updatedAt: Date;
  canceledAt?: Date;
  trialEndsAt?: Date;
}
```

### 2. Usage Tracking Collection

```typescript
interface UsageRecord {
  _id: ObjectId;
  userId: ObjectId;
  planType: PlanType;

  // 時間標識
  month: string; // YYYY-MM
  date: string; // YYYY-MM-DD
  timezone: string; // Asia/Taipei

  // 使用量統計
  daily: {
    surveysCreated: number;
    aiCallsUsed: number;
    responsesReceived: number;
  };

  monthly: {
    totalSurveys: number;
    totalResponses: number;
    totalAICalls: number;
  };

  // 索引優化
  createdAt: Date;
  updatedAt: Date;
}

// 複合索引
// { userId: 1, date: 1 }
// { userId: 1, month: 1 }
```

## API 設計

### 1. 訂閱管理 API

```typescript
// GET /api/subscription/status
interface SubscriptionStatusResponse {
  planType: PlanType;
  status: SubscriptionStatus;
  limits: {
    daily: {
      surveys: { used: number; limit: number };
      aiCalls: { used: number; limit: number };
    };
    monthly: {
      responses: { used: number; limit: number };
      teamMembers: { used: number; limit: number };
    };
  };
  nextResetTime: Date;
  billingInfo: {
    nextBillingDate: Date;
    amount: number;
  };
}

// POST /api/subscription/upgrade
interface UpgradeRequest {
  targetPlan: PlanType;
  paymentMethodId?: string;
}

// POST /api/subscription/usage/check
interface UsageCheckRequest {
  action: 'create_survey' | 'ai_call' | 'collect_response';
}
```

### 2. 使用量追蹤 API

```typescript
// POST /api/usage/track
interface TrackUsageRequest {
  action: 'survey_created' | 'ai_call_used' | 'response_received';
  metadata?: {
    surveyId?: string;
    questionCount?: number;
    aiModel?: string;
  };
}

// GET /api/usage/analytics
interface UsageAnalyticsResponse {
  daily: Array<{
    date: string;
    surveys: number;
    responses: number;
    aiCalls: number;
  }>;
  monthly: {
    currentMonth: UsageStats;
    previousMonth: UsageStats;
  };
}
```

## 實作策略

### Phase 1: 核心訂閱邏輯

1. **建立資料模型**：Subscription 和 UsageRecord Schema
2. **限額檢查服務**：SubscriptionService 核心邏輯
3. **每日重置機制**：Cron job 台北時間 00:00 重置
4. **基礎 API**：訂閱狀態查詢、使用量檢查

### Phase 2: 使用量追蹤

1. **埋點系統**：在關鍵操作點加入使用量追蹤
2. **即時統計**：Redis 快取當日使用量
3. **分析介面**：使用量儀表板
4. **告警機制**：接近限額時提醒用戶

### Phase 3: 企業功能

1. **客製配置**：Enterprise 動態限額調整
2. **多租戶支援**：團隊成員管理
3. **計費整合**：Stripe 付款流程
4. **附加服務**：額度加購、專業支援

## 測試策略

### 1. 開發環境配置

- **預設方案**：所有帳號建立時自動設為 Enterprise
- **無限制模式**：移除所有限額檢查（環境變數控制）
- **時間模擬**：可手動觸發每日重置進行測試

### 2. 限額測試場景

```typescript
// 測試配置
const TEST_LIMITS = {
  enterprise: {
    dailySurveys: 100, // 高但有限的數字
    dailyAICalls: 1000, // 便於測試
    monthlyResponses: 999999, // 實際無限
    teamMembers: 999999, // 實際無限
  },
};
```

### 3. 邊界測試

- 每日限額達到時的阻擋行為
- 台北時間 00:00 重置邏輯
- 月底月初的計費週期切換
- Enterprise 客製限額調整

## 監控與告警

### 1. 關鍵指標

- 每日活躍用戶數（DAU）
- 各方案使用量分佈
- 限額觸及率
- 付費轉換率

### 2. 系統健康度

- 使用量追蹤延遲
- 限額檢查響應時間
- 每日重置任務成功率
- 計費系統同步狀態

## 擴展性考量

### 1. 附加服務架構

```typescript
interface AddonService {
  id: string;
  name: string;
  type: 'quota_boost' | 'feature_unlock' | 'support_tier';
  pricing: {
    model: 'per_unit' | 'flat_rate';
    amount: number;
  };
  limits?: {
    additionalSurveys?: number;
    additionalAICalls?: number;
  };
}

// 範例：問卷額度加購
const surveyBoostAddon: AddonService = {
  id: 'survey_boost_100',
  name: '問卷額度加購包（100份）',
  type: 'quota_boost',
  pricing: { model: 'per_unit', amount: 500 },
  limits: { additionalSurveys: 100 },
};
```

### 2. 多地區支援預備

- 時區配置彈性化
- 多貨幣計費支援
- 在地化限額規則

### 3. API 版本管理

- 向後相容性保證
- 漸進式功能發布
- 客戶端 SDK 更新策略

## 安全與合規

### 1. 資料保護

- 使用量資料加密儲存
- 個人識別資訊最小化
- GDPR 合規的資料保留政策

### 2. 計費安全

- 防刷量機制
- 異常使用量檢測
- 付費驗證雙重確認

## 總結

此訂閱系統設計以簡潔性和可擴展性為核心，通過月付自然月制和每日限額平衡用戶體驗與資源控制。Enterprise 等級的彈性配置滿足企業客戶多樣化需求，而完整的監控告警機制確保系統穩定性。

未來可通過附加服務模式實現商業模式創新，並支援多地區部署以服務全球用戶。
