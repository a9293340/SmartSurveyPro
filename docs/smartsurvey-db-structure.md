# SmartSurvey 資料庫結構設計文件

> MongoDB Atlas M5 (無分片) + Redis Cloud 架構設計  
> 版本：v1.0 | 更新日期：2025-01-10

---

## 📋 目錄

1. [資料庫架構總覽](#資料庫架構總覽)
2. [MongoDB 設計策略](#mongodb-設計策略)
3. [Collection 詳細設計](#collection-詳細設計)
4. [索引策略](#索引策略)
5. [Redis 快取架構](#redis-快取架構)
6. [資料分級與優化](#資料分級與優化)
7. [效能優化建議](#效能優化建議)

---

## 🏗️ 資料庫架構總覽

### 系統架構圖

```
┌─────────────────────────────────────────┐
│           應用層 (Nuxt3)                │
├─────────────────────────────────────────┤
│         快取層 (Redis Cloud)             │
│  - Session Store                        │
│  - Hot Data Cache                       │
│  - Rate Limiting                        │
├─────────────────────────────────────────┤
│      主資料庫 (MongoDB Atlas M5)        │
│  - Core Collections                     │
│  - Archival Collections                 │
└─────────────────────────────────────────┘
```

### MongoDB M5 限制與對策

- **限制**：
  - 最大儲存：512 GB
  - 無分片功能
  - IOPS 限制：3000
  - 連接數限制：500

- **對策**：
  - 資料分級儲存
  - 歷史資料歸檔
  - 熱數據快取
  - 連接池優化

---

## 🗄️ MongoDB 設計策略

### Database 架構

```javascript
// 資料庫分離策略（因 M5 無法分片，採用邏輯分離）
databases = {
  survey_core: {
    // 核心業務資料
    collections: ['users', 'surveys', 'teams', 'subscriptions'],
    size_estimate: '~50GB',
    access_pattern: 'high_frequency',
  },
  survey_responses: {
    // 回應資料（最大量）
    collections: ['responses', 'response_archives'],
    size_estimate: '~300GB',
    access_pattern: 'write_heavy',
  },
  survey_analytics: {
    // 分析資料
    collections: ['analytics_daily', 'analytics_monthly', 'realtime_stats'],
    size_estimate: '~100GB',
    access_pattern: 'read_heavy',
  },
  survey_system: {
    // 系統資料
    collections: ['audit_logs', 'notifications', 'jobs'],
    size_estimate: '~50GB',
    access_pattern: 'append_only',
  },
};
```

---

## 📚 Collection 詳細設計

### 1. Users Collection

```javascript
// 資料庫：survey_core
// 預估規模：10萬筆記錄，~1GB
{
  _id: ObjectId,

  // 認證資訊（常用，需索引）
  auth: {
    email: String,              // unique index
    password_hash: String,
    provider: String,           // 'local' | 'google' | 'github'
    provider_id: String,        // compound index with provider
    email_verified: Boolean,
    two_factor_enabled: Boolean,
    two_factor_secret: String   // encrypted
  },

  // 個人資料（內嵌以減少查詢）
  profile: {
    first_name: String,
    last_name: String,
    display_name: String,
    avatar_url: String,
    timezone: String,
    language: String,
    notification_preferences: {
      email: Boolean,
      push: Boolean,
      survey_responses: Boolean,
      team_updates: Boolean
    }
  },

  // 訂閱資訊（頻繁查詢）
  subscription: {
    plan: String,               // 'free' | 'pro' | 'team' | 'enterprise'
    status: String,             // 'active' | 'cancelled' | 'expired'
    valid_until: Date,
    limits: {
      surveys: Number,
      responses_per_survey: Number,
      team_members: Number,
      storage_mb: Number,
      ai_credits: Number
    },
    usage: {                    // 定期更新，考慮快取
      surveys: Number,
      responses: Number,
      storage_mb: Number,
      ai_credits_used: Number
    }
  },

  // 團隊關聯（陣列較小，內嵌）
  teams: [{
    team_id: ObjectId,
    role: String,
    joined_at: Date
  }],

  // 系統欄位
  created_at: Date,
  updated_at: Date,
  last_login_at: Date,
  is_active: Boolean,
  is_deleted: Boolean,         // 軟刪除
  deleted_at: Date
}

// 索引設計
db.users.createIndex({ "auth.email": 1 }, { unique: true })
db.users.createIndex({ "auth.provider": 1, "auth.provider_id": 1 })
db.users.createIndex({ "teams.team_id": 1 })
db.users.createIndex({ "subscription.plan": 1, "subscription.status": 1 })
db.users.createIndex({ created_at: -1 })
db.users.createIndex({ is_deleted: 1 }, { partialFilterExpression: { is_deleted: true }})
```

### 2. Surveys Collection

```javascript
// 資料庫：survey_core
// 預估規模：100萬筆記錄，~50GB
{
  _id: ObjectId,

  // 基本資訊
  title: String,
  description: String,
  slug: String,                 // unique index, URL-friendly

  // 擁有者資訊
  created_by: ObjectId,         // User ID
  team_id: ObjectId,            // 可選

  // 狀態管理
  status: String,               // 'draft' | 'published' | 'closed' | 'archived'
  visibility: String,           // 'public' | 'private' | 'password' | 'token'

  // 問題陣列（內嵌設計，避免 JOIN）
  questions: [{
    id: String,                 // nanoid，內部識別
    type: String,               // 題型
    title: String,
    description: String,
    required: Boolean,
    order: Number,

    // 選項（選擇題）
    options: [{
      id: String,
      text: String,
      value: String,
      order: Number
    }],

    // 驗證規則
    validation: {
      min: Number,
      max: Number,
      pattern: String,
      custom_error: String
    },

    // 邏輯跳轉
    logic: [{
      condition: String,
      action: String,
      target: String
    }]
  }],

  // 主題設定（內嵌）
  theme: {
    primary_color: String,
    background_color: String,
    font_family: String,
    custom_css: String
  },

  // 設定
  settings: {
    allow_multiple_responses: Boolean,
    require_login: Boolean,
    collect_ip: Boolean,
    password: String,           // 加密
    start_date: Date,
    end_date: Date,
    response_limit: Number,
    daily_response_limit: Number,

    // 頁面設定
    show_progress_bar: Boolean,
    show_question_numbers: Boolean,
    randomize_questions: Boolean,
    one_question_per_page: Boolean
  },

  // 統計摘要（快取用）
  stats_summary: {
    views: Number,
    starts: Number,
    completions: Number,
    avg_completion_time: Number,
    last_response_at: Date,
    updated_at: Date            // 統計更新時間
  },

  // 版本控制（簡化版）
  version: Number,
  last_major_update: Date,

  // 系統欄位
  created_at: Date,
  updated_at: Date,
  published_at: Date,
  archived_at: Date,
  is_deleted: Boolean
}

// 索引設計
db.surveys.createIndex({ slug: 1 }, { unique: true })
db.surveys.createIndex({ created_by: 1, status: 1 })
db.surveys.createIndex({ team_id: 1, status: 1 })
db.surveys.createIndex({ status: 1, published_at: -1 })
db.surveys.createIndex({ "stats_summary.completions": -1 })
db.surveys.createIndex({ created_at: -1 })
db.surveys.createIndex({ is_deleted: 1, archived_at: 1 }, {
  partialFilterExpression: { is_deleted: true }
})
```

### 3. Responses Collection

```javascript
// 資料庫：survey_responses
// 預估規模：1000萬筆記錄，~200GB
// 策略：熱數據保留，冷數據歸檔
{
  _id: ObjectId,

  // 關聯（需要索引）
  survey_id: ObjectId,
  survey_version: Number,
  user_id: ObjectId,            // 可選，登入用戶

  // 填寫者資訊（部分欄位可考慮分離）
  respondent: {
    session_id: String,         // 必要
    ip_hash: String,            // 隱私保護，hash 處理
    country: String,            // 從 IP 解析
    device_type: String,        // 'desktop' | 'mobile' | 'tablet'
    browser: String,
    referrer: String,
    utm_source: String,
    utm_medium: String,
    utm_campaign: String
  },

  // 答案資料（核心資料）
  answers: [{
    question_id: String,
    value: Mixed,               // 根據題型儲存
    text: String,               // 其他選項文字
    answered_at: Date,
    time_spent: Number          // 秒
  }],

  // 狀態
  status: String,               // 'in_progress' | 'completed' | 'abandoned'

  // 進度（in_progress 時使用）
  progress: {
    current_page: Number,
    total_pages: Number,
    percentage: Number
  },

  // 時間記錄
  started_at: Date,
  updated_at: Date,
  submitted_at: Date,
  total_time: Number,           // 總秒數

  // 資料品質標記
  quality_flags: [String],      // ['speeding', 'straight_lining', 'duplicate']
  is_test: Boolean,
  is_archived: Boolean,         // 歸檔標記

  // 分區鍵（用於查詢優化）
  partition_key: String         // YYYY-MM 格式，方便按月查詢
}

// 索引設計（注意：Response 數量大，索引要精簡）
db.responses.createIndex({ survey_id: 1, submitted_at: -1 })
db.responses.createIndex({ survey_id: 1, status: 1 })
db.responses.createIndex({ user_id: 1 }, {
  partialFilterExpression: { user_id: { $exists: true }}
})
db.responses.createIndex({ partition_key: 1, submitted_at: -1 })
db.responses.createIndex({ is_archived: 1 }, {
  partialFilterExpression: { is_archived: true }
})

// TTL 索引：自動刪除未完成的回應
db.responses.createIndex({ updated_at: 1 }, {
  expireAfterSeconds: 86400,  // 24小時
  partialFilterExpression: { status: "in_progress" }
})
```

### 4. Response Archives Collection

```javascript
// 資料庫：survey_responses
// 用途：儲存超過 90 天的回應資料
// 策略：壓縮儲存，減少索引
{
  _id: ObjectId,
  survey_id: ObjectId,

  // 壓縮的回應資料
  compressed_data: Binary,      // 使用 zlib 壓縮

  // 必要的查詢欄位
  submitted_at: Date,
  partition_key: String,        // YYYY-MM

  // 摘要資訊（供快速查詢）
  summary: {
    question_count: Number,
    completion_time: Number,
    device_type: String
  }
}

// 最小化索引
db.response_archives.createIndex({ survey_id: 1, partition_key: 1 })
db.response_archives.createIndex({ submitted_at: 1 })
```

### 5. Teams Collection

```javascript
// 資料庫：survey_core
// 預估規模：1萬筆記錄，~100MB
{
  _id: ObjectId,

  // 基本資訊
  name: String,
  slug: String,                 // unique, URL-friendly
  description: String,
  logo_url: String,

  // 擁有者
  owner_id: ObjectId,

  // 成員管理（陣列不會太大，內嵌）
  members: [{
    user_id: ObjectId,
    role: String,               // 'owner' | 'admin' | 'editor' | 'viewer'
    permissions: {
      create_survey: Boolean,
      edit_survey: Boolean,
      delete_survey: Boolean,
      view_responses: Boolean,
      export_data: Boolean,
      manage_team: Boolean
    },
    joined_at: Date,
    invited_by: ObjectId
  }],

  // 團隊設定
  settings: {
    default_survey_visibility: String,
    allow_public_surveys: Boolean,
    webhook_url: String,
    api_key: String             // 加密儲存
  },

  // 訂閱資訊
  subscription: {
    plan: String,
    seats: Number,
    valid_until: Date,
    usage: {
      surveys: Number,
      responses: Number,
      storage_mb: Number
    }
  },

  // 系統欄位
  created_at: Date,
  updated_at: Date,
  is_active: Boolean
}

// 索引設計
db.teams.createIndex({ slug: 1 }, { unique: true })
db.teams.createIndex({ owner_id: 1 })
db.teams.createIndex({ "members.user_id": 1 })
db.teams.createIndex({ is_active: 1 })
```

### 6. Analytics Collections

#### 6.1 Daily Analytics (預聚合)

```javascript
// 資料庫：survey_analytics
// 用途：儲存每日預聚合的分析資料
{
  _id: ObjectId,

  // 複合鍵
  survey_id: ObjectId,
  date: Date,                   // 僅日期，時間為 00:00:00

  // 流量統計
  metrics: {
    views: Number,
    unique_views: Number,
    starts: Number,
    completions: Number,
    abandons: Number,

    // 設備分佈
    device_stats: {
      desktop: Number,
      mobile: Number,
      tablet: Number
    },

    // 國家分佈 (Top 10)
    country_stats: [{
      country: String,
      count: Number
    }],

    // 問題統計
    question_stats: [{
      question_id: String,
      views: Number,
      answers: Number,
      skip_rate: Number,
      avg_time: Number
    }]
  },

  // 計算時間
  calculated_at: Date,
  is_final: Boolean             // 是否為最終版本
}

// 索引設計
db.analytics_daily.createIndex({ survey_id: 1, date: -1 }, { unique: true })
db.analytics_daily.createIndex({ date: -1 })
```

#### 6.2 Realtime Stats (即時統計)

```javascript
// 資料庫：survey_analytics
// 用途：儲存最近 1 小時的即時統計
{
  _id: ObjectId,
  survey_id: ObjectId,

  // 時間窗口
  window: {
    start: Date,
    end: Date
  },

  // 即時指標
  realtime: {
    active_users: Number,
    views: Number,
    submissions: Number,
    avg_progress: Number
  },

  // 5 分鐘間隔的趨勢資料
  trend: [{
    timestamp: Date,
    users: Number,
    events: Number
  }],

  updated_at: Date
}

// TTL 索引：自動清理舊資料
db.realtime_stats.createIndex({ "window.end": 1 }, {
  expireAfterSeconds: 3600    // 保留 1 小時
})
```

---

## 🔍 索引策略

### 索引設計原則

1. **選擇性高的欄位優先**
2. **複合索引順序：相等查詢 > 排序 > 範圍查詢**
3. **使用部分索引減少儲存空間**
4. **避免過多索引影響寫入效能**

### 關鍵索引列表

```javascript
// 執行順序建議（按重要性）

// 1. 唯一索引（必須）
db.users.createIndex({ 'auth.email': 1 }, { unique: true });
db.surveys.createIndex({ slug: 1 }, { unique: true });
db.teams.createIndex({ slug: 1 }, { unique: true });

// 2. 高頻查詢索引
db.surveys.createIndex({ created_by: 1, status: 1 });
db.responses.createIndex({ survey_id: 1, submitted_at: -1 });
db.responses.createIndex({ survey_id: 1, status: 1 });

// 3. 排序索引
db.surveys.createIndex({ created_at: -1 });
db.responses.createIndex({ submitted_at: -1 });

// 4. 部分索引（節省空間）
db.users.createIndex(
  { is_deleted: 1 },
  {
    partialFilterExpression: { is_deleted: true },
  }
);
db.responses.createIndex(
  { user_id: 1 },
  {
    partialFilterExpression: { user_id: { $exists: true } },
  }
);

// 5. TTL 索引（自動清理）
db.responses.createIndex(
  { updated_at: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { status: 'in_progress' },
  }
);
db.realtime_stats.createIndex(
  { 'window.end': 1 },
  {
    expireAfterSeconds: 3600,
  }
);

// 6. 文字搜尋索引（可選）
db.surveys.createIndex(
  {
    title: 'text',
    description: 'text',
  },
  {
    weights: { title: 10, description: 5 },
    default_language: 'none',
  }
);
```

---

## 🚀 Redis 快取架構

### Redis 資料結構設計

```javascript
// Redis 配置
const redisConfig = {
  provider: 'Redis Cloud',
  plan: '250MB', // 初期計劃
  databases: {
    0: 'sessions', // Session 儲存
    1: 'cache', // 一般快取
    2: 'rate_limit', // API 限流
    3: 'realtime', // 即時資料
    4: 'queue', // 工作佇列
  },
};
```

### 快取鍵設計與 TTL

```javascript
// 1. Session 管理 (DB 0)
{
  key: 'session:{sessionId}',
  value: {
    user_id: String,
    ip: String,
    user_agent: String,
    created_at: Number,
    last_activity: Number
  },
  ttl: 86400 * 7,              // 7 天
  type: 'hash'
}

// 2. 用戶快取 (DB 1)
{
  key: 'user:{userId}',
  value: JSON.stringify(userData),
  ttl: 3600,                   // 1 小時
  type: 'string'
}

// 3. 問卷快取 (DB 1)
{
  key: 'survey:{surveyId}',
  value: JSON.stringify(surveyData),
  ttl: 300,                    // 5 分鐘（熱數據）
  type: 'string'
}

// 4. 問卷列表快取 (DB 1)
{
  key: 'survey:list:{userId}:page:{page}',
  value: JSON.stringify(surveyList),
  ttl: 60,                     // 1 分鐘
  type: 'string'
}

// 5. 回應進度 (DB 1)
{
  key: 'response:progress:{sessionId}:{surveyId}',
  value: {
    answers: JSON.stringify(answers),
    current_page: Number,
    updated_at: Number
  },
  ttl: 86400,                  // 24 小時
  type: 'hash'
}

// 6. 統計快取 (DB 1)
{
  key: 'stats:survey:{surveyId}:daily:{date}',
  value: JSON.stringify(dailyStats),
  ttl: 3600,                   // 1 小時
  type: 'string'
}

// 7. 即時統計 (DB 3)
{
  key: 'realtime:survey:{surveyId}',
  value: {
    views: Number,
    active_users: Number,
    submissions: Number
  },
  ttl: 10,                     // 10 秒
  type: 'hash'
}

// 8. API 限流 (DB 2)
{
  key: 'rate:api:{ip}',
  value: requestCount,
  ttl: 60,                     // 1 分鐘滑動窗口
  type: 'string'
}

{
  key: 'rate:submit:{ip}:{surveyId}',
  value: submitCount,
  ttl: 3600,                   // 防止重複提交
  type: 'string'
}

// 9. 熱門問卷排行 (DB 1)
{
  key: 'trending:surveys',
  value: SortedSet,            // 使用 score 排序
  ttl: 600,                    // 10 分鐘
  type: 'zset'
}

// 10. WebSocket 連線追蹤 (DB 3)
{
  key: 'ws:survey:{surveyId}:editors',
  value: Set(userId),          // 編輯中的用戶
  ttl: 30,                     // 30 秒心跳
  type: 'set'
}
```

### Redis 快取策略

```javascript
// 快取更新策略
const cacheStrategies = {
  // 1. Cache-Aside (Lazy Loading)
  survey: {
    pattern: 'cache-aside',
    ttl: 300,
    fallback: 'database',
    invalidate_on: ['update', 'delete'],
  },

  // 2. Write-Through
  user_profile: {
    pattern: 'write-through',
    ttl: 3600,
    write_to: ['cache', 'database'],
  },

  // 3. Write-Behind (Async)
  analytics: {
    pattern: 'write-behind',
    batch_size: 100,
    flush_interval: 60,
    ttl: 10,
  },

  // 4. Refresh-Ahead
  trending: {
    pattern: 'refresh-ahead',
    ttl: 600,
    refresh_when_ttl_below: 60,
  },
};

// 快取失效策略
const invalidationRules = {
  survey_update: [
    'survey:{surveyId}',
    'survey:list:*',
    'stats:survey:{surveyId}:*',
  ],

  response_submit: [
    'stats:survey:{surveyId}:*',
    'realtime:survey:{surveyId}',
    'trending:surveys',
  ],

  user_update: ['user:{userId}', 'session:*:{userId}'],
};
```

---

## 📊 資料分級與優化

### 資料溫度分級

```javascript
const dataTemperature = {
  // 熱數據（< 7 天）
  hot: {
    storage: 'MongoDB + Redis',
    collections: ['responses', 'realtime_stats'],
    strategy: 'full_index',
    cache_ttl: 60,
    characteristics: ['頻繁讀寫', '需要即時查詢', '完整索引支援'],
  },

  // 溫數據（7-90 天）
  warm: {
    storage: 'MongoDB',
    collections: ['responses', 'analytics_daily'],
    strategy: 'partial_index',
    cache_ttl: 3600,
    characteristics: ['定期查詢', '聚合分析', '部分索引'],
  },

  // 冷數據（> 90 天）
  cold: {
    storage: 'MongoDB Archive',
    collections: ['response_archives', 'analytics_monthly'],
    strategy: 'minimal_index',
    cache_ttl: 86400,
    characteristics: ['稀少查詢', '壓縮儲存', '最小索引'],
  },
};
```

### 資料歸檔策略

```javascript
// 自動歸檔任務（每日執行）
async function archiveOldResponses() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);

  // 1. 查找需要歸檔的資料
  const toArchive = await db.responses
    .find({
      submitted_at: { $lt: cutoffDate },
      is_archived: false,
    })
    .limit(1000); // 批次處理

  // 2. 壓縮並寫入歸檔集合
  for (const response of toArchive) {
    const compressed = zlib.gzipSync(JSON.stringify(response));

    await db.response_archives.insertOne({
      _id: response._id,
      survey_id: response.survey_id,
      compressed_data: compressed,
      submitted_at: response.submitted_at,
      partition_key: getPartitionKey(response.submitted_at),
      summary: {
        question_count: response.answers.length,
        completion_time: response.total_time,
        device_type: response.respondent.device_type,
      },
    });

    // 3. 標記原始資料為已歸檔
    await db.responses.updateOne(
      { _id: response._id },
      { $set: { is_archived: true } }
    );
  }

  // 4. 清理已歸檔的原始資料（可選）
  await db.responses.deleteMany({
    is_archived: true,
    archived_at: { $lt: cutoffDate },
  });
}
```

---

## ⚡ 效能優化建議

### 1. 連接池優化

```javascript
// MongoDB 連接池配置
const mongoConfig = {
  maxPoolSize: 50, // M5 限制下的最佳值
  minPoolSize: 10,
  maxIdleTimeMS: 60000,
  socketTimeoutMS: 360000,
  serverSelectionTimeoutMS: 5000,
  family: 4, // 強制 IPv4
};

// Redis 連接池配置
const redisConfig = {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  maxLoadingRetryTime: 10000,
  connectionPool: {
    min: 5,
    max: 30,
  },
};
```

### 2. 查詢優化策略

```javascript
// 使用投影減少傳輸資料
const surveyList = await db.surveys
  .find(
    { created_by: userId },
    {
      projection: {
        title: 1,
        status: 1,
        'stats_summary.completions': 1,
        created_at: 1,
      },
    }
  )
  .limit(20);

// 使用聚合管道優化統計查詢
const stats = await db.responses.aggregate([
  {
    $match: {
      survey_id: surveyId,
      partition_key: currentMonth, // 利用分區鍵
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      completed: {
        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
      },
      avgTime: { $avg: '$total_time' },
    },
  },
  {
    $project: {
      _id: 0,
      total: 1,
      completed: 1,
      avgTime: { $round: ['$avgTime', 2] },
    },
  },
]);
```

### 3. 批次處理優化

```javascript
// 批次插入回應
const bulkOps = responses.map(response => ({
  insertOne: {
    document: {
      ...response,
      partition_key: getPartitionKey(response.submitted_at),
    },
  },
}));

await db.responses.bulkWrite(bulkOps, { ordered: false });

// 批次更新統計
const bulkUpdates = [];
for (const surveyId of surveyIds) {
  bulkUpdates.push({
    updateOne: {
      filter: { _id: surveyId },
      update: {
        $inc: { 'stats_summary.views': 1 },
        $set: { 'stats_summary.updated_at': new Date() },
      },
    },
  });
}

await db.surveys.bulkWrite(bulkUpdates);
```

### 4. 監控與告警

```javascript
// 監控指標
const monitoringMetrics = {
  // MongoDB 指標
  mongodb: {
    connections: 'currentOp.connections',
    slowQueries: 'system.profile',
    replicationLag: 'rs.status()',
    diskUsage: 'db.stats()',
    indexUsage: 'db.collection.aggregate([{ $indexStats: {} }])',
  },

  // Redis 指標
  redis: {
    memory: 'INFO memory',
    hitRate: 'INFO stats',
    slowlog: 'SLOWLOG GET',
    connectedClients: 'CLIENT LIST',
  },

  // 應用層指標
  application: {
    cacheHitRate: 'custom_metric',
    queryLatency: 'custom_metric',
    errorRate: 'custom_metric',
  },
};

// 告警閾值
const alertThresholds = {
  mongodbConnections: 400, // 80% of M5 limit
  redisMemory: 200, // 80% of 250MB
  queryLatency: 1000, // ms
  cacheHitRate: 0.7, // 70%
  errorRate: 0.01, // 1%
};
```

### 5. 定期維護任務

```javascript
// 每日維護任務
const maintenanceTasks = {
  daily: [
    'archiveOldResponses',
    'aggregateDailyAnalytics',
    'cleanExpiredSessions',
    'compactCollections',
  ],

  weekly: [
    'rebuildIndexes',
    'analyzeQueryPerformance',
    'cleanupOrphanedData',
    'updateStatsSummary',
  ],

  monthly: [
    'fullBackup',
    'securityAudit',
    'capacityPlanning',
    'indexOptimization',
  ],
};
```

---

## 📈 容量規劃

### 儲存空間預估（1年）

| Collection        | 記錄數 | 平均大小 | 總大小     | 成長率/月 |
| ----------------- | ------ | -------- | ---------- | --------- |
| users             | 100K   | 10KB     | 1GB        | 10%       |
| surveys           | 1M     | 50KB     | 50GB       | 20%       |
| responses         | 10M    | 20KB     | 200GB      | 30%       |
| response_archives | 5M     | 5KB      | 25GB       | 持平      |
| teams             | 10K    | 10KB     | 100MB      | 5%        |
| analytics_daily   | 365K   | 5KB      | 2GB        | 線性      |
| **總計**          | -      | -        | **~280GB** | -         |

### 擴展計劃

1. **Phase 1 (0-6月)**：MongoDB M5 + Redis 250MB
2. **Phase 2 (6-12月)**：考慮升級至 M10 + Redis 1GB
3. **Phase 3 (12月+)**：評估分片需求或採用 M30

---

## 🔒 安全建議

1. **加密敏感資料**
   - 密碼使用 bcrypt (rounds=12)
   - API Keys 使用 AES-256
   - 個人資料考慮欄位級加密

2. **存取控制**
   - 使用 MongoDB RBAC
   - 最小權限原則
   - 定期輪換認證

3. **審計日誌**
   - 記錄所有寫入操作
   - 敏感查詢追蹤
   - 定期審查異常活動

4. **備份策略**
   - MongoDB Atlas 自動備份
   - Redis 持久化 (AOF + RDB)
   - 定期測試還原流程

---

## 📚 參考文件

- [MongoDB 效能最佳實踐](https://docs.mongodb.com/manual/administration/production-notes/)
- [Redis 資料結構指南](https://redis.io/docs/data-types/)
- [MongoDB Atlas M5 限制](https://docs.atlas.mongodb.com/cluster-tier/)
- [索引策略指南](https://docs.mongodb.com/manual/indexes/)

---

_文件版本：v1.0 | 最後更新：2025-01-10_ _適用於：SmartSurvey MongoDB Atlas M5
(無分片) + Redis Cloud 架構_
