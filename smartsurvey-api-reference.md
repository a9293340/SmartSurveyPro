# SmartSurvey Pro - API Reference 📡

> API 端點詳細規格與資料格式速查表  
> 最後更新：2025-01-10  
> API 版本：v1  
> Base URL: `https://api.smartsurvey.com/v1`

---

## 📋 目錄

- [認證規範](#認證規範)
- [通用規則](#通用規則)
- [錯誤處理](#錯誤處理)
- [API 端點詳細](#api-端點詳細)
  - [認證 APIs](#認證-apis)
  - [用戶 APIs](#用戶-apis)
  - [問卷 APIs](#問卷-apis)
  - [回應 APIs](#回應-apis)
  - [分析 APIs](#分析-apis)
  - [團隊 APIs](#團隊-apis)
- [資料模型](#資料模型)
- [WebSocket Events](#websocket-events)

---

## 🔐 認證規範

### JWT Token
```typescript
// Request Header
Authorization: Bearer <jwt_token>

// Token Payload
{
  userId: string
  email: string
  role: 'user' | 'admin'
  teams: string[]
  exp: number
  iat: number
}

// Token 有效期
Access Token: 1 hour
Refresh Token: 7 days
```

### Session Cookie
```typescript
// Cookie 設定
survey_session: {
  httpOnly: true
  secure: true  // production only
  sameSite: 'lax'
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
}
```

---

## 📐 通用規則

### Request Headers
```http
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>  // 選擇性，用於追蹤
```

### Response Format
```typescript
// 成功回應
{
  success: true,
  data: T,
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

// 錯誤回應
{
  success: false,
  error: {
    code: string      // 錯誤代碼
    message: string   // 用戶可讀訊息
    details?: any     // 詳細錯誤資訊
    field?: string    // 欄位錯誤
  }
}
```

### 分頁參數
```typescript
// Query Parameters
?page=1&limit=20&sort=-createdAt&search=keyword

// sort: 
//   fieldName (升序)
//   -fieldName (降序)
```

### Rate Limiting
```yaml
匿名用戶: 60 requests/minute
認證用戶: 300 requests/minute
Pro 用戶: 1000 requests/minute

Headers:
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1609459200
```

---

## ❌ 錯誤處理

### HTTP 狀態碼
| Code | 說明 | 使用場景 |
|------|------|----------|
| 200 | OK | 成功取得資料 |
| 201 | Created | 成功建立資源 |
| 204 | No Content | 成功刪除 |
| 400 | Bad Request | 請求格式錯誤 |
| 401 | Unauthorized | 未認證 |
| 403 | Forbidden | 無權限 |
| 404 | Not Found | 資源不存在 |
| 409 | Conflict | 資源衝突（如 email 重複）|
| 422 | Unprocessable | 驗證失敗 |
| 429 | Too Many Requests | 超過限流 |
| 500 | Server Error | 伺服器錯誤 |

### 錯誤代碼
```typescript
enum ErrorCode {
  // 認證相關
  AUTH_INVALID_CREDENTIALS = 'AUTH001',
  AUTH_TOKEN_EXPIRED = 'AUTH002',
  AUTH_EMAIL_EXISTS = 'AUTH003',
  
  // 驗證相關
  VALIDATION_FAILED = 'VAL001',
  VALIDATION_REQUIRED = 'VAL002',
  VALIDATION_FORMAT = 'VAL003',
  
  // 資源相關
  RESOURCE_NOT_FOUND = 'RES001',
  RESOURCE_LIMIT_EXCEEDED = 'RES002',
  
  // 權限相關
  PERMISSION_DENIED = 'PERM001',
  SUBSCRIPTION_REQUIRED = 'PERM002'
}
```

---

## 📚 API 端點詳細

## 認證 APIs

### 註冊 `POST /auth/register`
```typescript
// Request
{
  email: string         // required, email format
  password: string      // required, min 8 chars
  firstName: string     // required
  lastName: string      // required
  timezone?: string     // optional, default: 'Asia/Taipei'
  language?: string     // optional, default: 'zh-TW'
}

// Response (201)
{
  success: true,
  data: {
    user: User,
    accessToken: string,
    refreshToken: string
  }
}

// Validation Rules
- email: 唯一, 有效格式
- password: 8-50字元, 至少1大寫+1小寫+1數字
- firstName/lastName: 1-50字元
```

### 登入 `POST /auth/login`
```typescript
// Request
{
  email: string
  password: string
  rememberMe?: boolean  // default: false
}

// Response (200)
{
  success: true,
  data: {
    user: User,
    accessToken: string,
    refreshToken: string
  }
}
```

### 登出 `POST /auth/logout`
```typescript
// Request
{
  refreshToken?: string  // 用於撤銷 token
}

// Response (200)
{
  success: true,
  data: { message: 'Logged out successfully' }
}
```

### 重新整理 Token `POST /auth/refresh`
```typescript
// Request
{
  refreshToken: string
}

// Response (200)
{
  success: true,
  data: {
    accessToken: string,
    refreshToken: string  // 新的 refresh token
  }
}
```

### 忘記密碼 `POST /auth/forgot-password`
```typescript
// Request
{
  email: string
}

// Response (200)
{
  success: true,
  data: { message: 'Reset email sent' }
}
```

### 重設密碼 `POST /auth/reset-password`
```typescript
// Request
{
  token: string         // from email
  newPassword: string
}

// Response (200)
{
  success: true,
  data: { message: 'Password reset successfully' }
}
```

---

## 用戶 APIs

### 取得當前用戶 `GET /users/me`
```typescript
// Response (200)
{
  success: true,
  data: {
    id: string
    email: string
    profile: {
      firstName: string
      lastName: string
      displayName: string
      avatarUrl?: string
      timezone: string
      language: string
    }
    subscription: {
      plan: 'free' | 'pro' | 'team' | 'enterprise'
      validUntil: Date
      usage: {
        surveys: number
        responses: number
        aiCredits: number
      }
      limits: {
        surveys: number
        responsesPerSurvey: number
        aiCredits: number
      }
    }
    teams: Array<{
      teamId: string
      role: string
    }>
    createdAt: Date
    lastLoginAt: Date
  }
}
```

### 更新個人資料 `PATCH /users/me`
```typescript
// Request (Partial Update)
{
  profile?: {
    firstName?: string
    lastName?: string
    displayName?: string
    timezone?: string
    language?: string
  }
  notificationPreferences?: {
    email?: boolean
    surveyResponses?: boolean
    teamUpdates?: boolean
  }
}

// Response (200)
{
  success: true,
  data: User
}
```

### 更改密碼 `POST /users/me/change-password`
```typescript
// Request
{
  currentPassword: string
  newPassword: string
}

// Response (200)
{
  success: true,
  data: { message: 'Password changed successfully' }
}
```

### 刪除帳號 `DELETE /users/me`
```typescript
// Request
{
  password: string      // 確認密碼
  reason?: string       // 刪除原因
}

// Response (204)
// No Content
```

---

## 問卷 APIs

### 取得問卷列表 `GET /surveys`
```typescript
// Query Parameters
?page=1
&limit=20
&status=draft,published  // 多選用逗號分隔
&search=keyword
&sort=-createdAt        // -表示降序
&teamId=xxx            // 篩選團隊

// Response (200)
{
  success: true,
  data: Survey[],
  meta: {
    page: 1,
    limit: 20,
    total: 100,
    hasMore: true
  }
}
```

### 建立問卷 `POST /surveys`
```typescript
// Request
{
  title: string                    // required, 1-200 chars
  description?: string             // optional, max 1000 chars
  teamId?: string                  // optional
  questions: Question[]            // can be empty initially
  theme?: Theme                    // optional
  settings?: SurveySettings        // optional
}

// Response (201)
{
  success: true,
  data: Survey
}

// Default Values
{
  status: 'draft',
  visibility: 'private',
  questions: [],
  theme: defaultTheme,
  settings: defaultSettings
}
```

### 取得問卷詳情 `GET /surveys/:id`
```typescript
// Path Parameters
:id - Survey ID or Slug

// Query Parameters
?include=responses,analytics  // 包含額外資料

// Response (200)
{
  success: true,
  data: {
    ...Survey,
    responses?: ResponseSummary,    // if include=responses
    analytics?: AnalyticsSummary    // if include=analytics
  }
}
```

### 更新問卷 `PUT /surveys/:id`
```typescript
// Request (Complete Update)
{
  title: string
  description?: string
  questions: Question[]
  theme: Theme
  settings: SurveySettings
  logic?: LogicRule[]
}

// Response (200)
{
  success: true,
  data: Survey
}

// Validation
- 只能更新 status='draft' 的問卷
- published 問卷只能更新部分欄位
```

### 部分更新問卷 `PATCH /surveys/:id`
```typescript
// Request (Partial Update)
{
  title?: string
  description?: string
  theme?: Partial<Theme>
  settings?: Partial<SurveySettings>
}

// Response (200)
{
  success: true,
  data: Survey
}
```

### 刪除問卷 `DELETE /surveys/:id`
```typescript
// Query Parameters
?permanent=false  // true: 永久刪除, false: 軟刪除

// Response (204)
// No Content

// Rules
- draft: 可直接刪除
- published: 軟刪除，保留 30 天
- 有回應的問卷: 只能軟刪除
```

### 發布問卷 `POST /surveys/:id/publish`
```typescript
// Request
{
  startDate?: Date      // optional, 立即開始
  endDate?: Date        // optional, 無結束
  password?: string     // optional, 密碼保護
}

// Response (200)
{
  success: true,
  data: {
    ...Survey,
    status: 'published',
    publishedAt: Date,
    publicUrl: string
  }
}

// Validation
- 至少要有 1 個問題
- 必要問題要有驗證規則
```

### 關閉問卷 `POST /surveys/:id/close`
```typescript
// Response (200)
{
  success: true,
  data: {
    ...Survey,
    status: 'closed',
    closedAt: Date
  }
}
```

### 複製問卷 `POST /surveys/:id/duplicate`
```typescript
// Request
{
  title?: string        // optional, 預設: "Copy of {原標題}"
  includeResponses?: boolean  // default: false
}

// Response (201)
{
  success: true,
  data: Survey  // 新問卷
}
```

### 更新問題 `PUT /surveys/:id/questions`
```typescript
// Request
{
  questions: Question[]  // 完整問題陣列
}

// Response (200)
{
  success: true,
  data: Question[]
}

// 注意事項
- 會完全取代現有問題
- 保留問題 ID 以維持回應關聯
```

### 新增單一問題 `POST /surveys/:id/questions`
```typescript
// Request
{
  type: QuestionType
  title: string
  description?: string
  required?: boolean
  options?: Option[]      // for choice questions
  validation?: Validation
  position?: number       // insert position
}

// Response (201)
{
  success: true,
  data: Question
}
```

### 更新單一問題 `PATCH /surveys/:id/questions/:questionId`
```typescript
// Request (Partial Update)
{
  title?: string
  description?: string
  required?: boolean
  options?: Option[]
  validation?: Validation
}

// Response (200)
{
  success: true,
  data: Question
}
```

### 刪除問題 `DELETE /surveys/:id/questions/:questionId`
```typescript
// Response (204)
// No Content

// 注意
- 已有回應的問題會標記為 deleted，不會真正刪除
```

### 問題排序 `POST /surveys/:id/questions/reorder`
```typescript
// Request
{
  questionIds: string[]  // 新的順序
}

// Response (200)
{
  success: true,
  data: Question[]
}
```

---

## 回應 APIs

### 取得回應列表 `GET /surveys/:id/responses`
```typescript
// Query Parameters
?page=1
&limit=50
&status=completed,in_progress
&startDate=2025-01-01
&endDate=2025-01-31
&export=csv,excel      // 匯出格式

// Response (200)
{
  success: true,
  data: Response[],
  meta: {
    page: 1,
    limit: 50,
    total: 500,
    hasMore: true
  }
}

// Export Response (200)
// Content-Type: text/csv 或 application/vnd.ms-excel
// 直接回傳檔案
```

### 取得單一回應 `GET /responses/:id`
```typescript
// Response (200)
{
  success: true,
  data: {
    id: string
    surveyId: string
    surveyVersion: number
    respondent: {
      userId?: string
      sessionId: string
      ipHash: string
      country: string
      deviceType: string
      browser: string
    }
    answers: Answer[]
    status: 'completed' | 'in_progress' | 'abandoned'
    startedAt: Date
    submittedAt?: Date
    totalTime: number  // seconds
  }
}
```

### 開始填寫問卷 `POST /surveys/:id/responses/start`
```typescript
// Request
{
  password?: string      // 如果問卷需要密碼
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

// Response (201)
{
  success: true,
  data: {
    responseId: string
    sessionId: string
    survey: Survey,       // 公開版本的問卷資料
    progress: {
      currentPage: 1,
      totalPages: number,
      percentage: 0
    }
  }
}
```

### 提交回應 `POST /surveys/:id/responses`
```typescript
// Request
{
  responseId?: string    // 續填用
  sessionId: string
  answers: Array<{
    questionId: string
    value: any          // 根據題型
    timeSpent?: number  // seconds
  }>
  completed: boolean    // true: 完成, false: 暫存
}

// Response (201/200)
{
  success: true,
  data: {
    id: string
    status: 'completed' | 'in_progress',
    completionMessage?: string,    // 完成訊息
    redirectUrl?: string           // 跳轉連結
  }
}

// Validation
- 必填題目檢查
- 資料格式驗證
- 邏輯跳轉驗證
- 重複提交檢查（根據設定）
```

### 儲存進度 `PATCH /responses/:id`
```typescript
// Request
{
  answers: Partial<Answer>[]
  currentPage: number
}

// Response (200)
{
  success: true,
  data: {
    saved: true,
    progress: Progress
  }
}

// Auto-save every 30 seconds
```

### 刪除回應 `DELETE /responses/:id`
```typescript
// Response (204)
// No Content

// 權限
- 問卷擁有者可刪除任何回應
- 填寫者只能刪除自己的回應（需登入）
```

---

## 分析 APIs

### 取得問卷統計 `GET /surveys/:id/analytics`
```typescript
// Query Parameters
?startDate=2025-01-01
&endDate=2025-01-31
&groupBy=day,question  // day|week|month|question

// Response (200)
{
  success: true,
  data: {
    summary: {
      totalViews: number
      uniqueViews: number
      starts: number
      completions: number
      completionRate: number      // percentage
      avgCompletionTime: number   // seconds
      abandons: number
      abandonRate: number
    },
    
    questionStats: Array<{
      questionId: string
      title: string
      type: QuestionType
      
      // 選擇題統計
      choices?: Array<{
        optionId: string
        text: string
        count: number
        percentage: number
      }>
      
      // 評分題統計
      rating?: {
        min: number
        max: number
        avg: number
        median: number
        distribution: Record<number, number>
      }
      
      // 文字題統計
      text?: {
        totalResponses: number
        wordCloud: Array<{word: string, count: number}>
        samples: string[]  // 前 5 筆
      }
      
      skipRate: number
      avgTimeSpent: number
    }>,
    
    // 趨勢資料
    trends: Array<{
      date: string
      views: number
      starts: number
      completions: number
    }>,
    
    // 設備分佈
    deviceStats: {
      desktop: number
      mobile: number
      tablet: number
    },
    
    // 地理分佈
    geoStats: Array<{
      country: string
      count: number
      percentage: number
    }>
  }
}
```

### 取得即時統計 `GET /surveys/:id/analytics/realtime`
```typescript
// Response (200)
{
  success: true,
  data: {
    activeUsers: number
    currentResponses: number
    last5Minutes: {
      views: number
      submissions: number
    },
    activeSessions: Array<{
      sessionId: string
      currentPage: number
      progress: number
      duration: number
    }>
  }
}

// WebSocket 訂閱即時更新
ws://api.smartsurvey.com/surveys/:id/realtime
```

### 匯出分析報告 `GET /surveys/:id/analytics/export`
```typescript
// Query Parameters
?format=pdf,excel,csv
&startDate=2025-01-01
&endDate=2025-01-31
&includeRawData=true

// Response (200)
// Content-Type: 根據 format
// 直接回傳檔案下載
```

---

## 團隊 APIs (Phase 3+)

### 取得團隊列表 `GET /teams`
```typescript
// Response (200)
{
  success: true,
  data: Team[]
}
```

### 建立團隊 `POST /teams`
```typescript
// Request
{
  name: string
  description?: string
}

// Response (201)
{
  success: true,
  data: Team
}
```

### 邀請成員 `POST /teams/:id/members`
```typescript
// Request
{
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

// Response (201)
{
  success: true,
  data: {
    invitationId: string,
    invitationUrl: string
  }
}
```

---

## 📊 資料模型

### User Model
```typescript
interface User {
  id: string
  email: string
  profile: {
    firstName: string
    lastName: string
    displayName: string
    avatarUrl?: string
    timezone: string
    language: string
    notificationPreferences: {
      email: boolean
      push: boolean
      surveyResponses: boolean
      teamUpdates: boolean
    }
  }
  subscription: {
    plan: 'free' | 'pro' | 'team' | 'enterprise'
    status: 'active' | 'cancelled' | 'expired'
    validUntil: Date
    limits: SubscriptionLimits
    usage: SubscriptionUsage
  }
  teams: Array<{
    teamId: string
    role: TeamRole
    joinedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
  isActive: boolean
}
```

### Survey Model
```typescript
interface Survey {
  id: string
  title: string
  description?: string
  slug: string                    // URL-friendly unique ID
  createdBy: string              // User ID
  teamId?: string
  
  status: 'draft' | 'published' | 'closed' | 'archived'
  visibility: 'public' | 'private' | 'password' | 'token'
  
  questions: Question[]
  theme: Theme
  settings: SurveySettings
  logic?: LogicRule[]
  
  statsSummary: {
    views: number
    starts: number
    completions: number
    avgCompletionTime: number
    lastResponseAt?: Date
  }
  
  version: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  closedAt?: Date
}
```

### Question Model
```typescript
interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  placeholder?: string
  required: boolean
  order: number
  
  // 選擇題選項
  options?: Array<{
    id: string
    text: string
    value: string
    imageUrl?: string
    order: number
  }>
  
  // 驗證規則
  validation?: {
    min?: number              // 最小值/長度
    max?: number              // 最大值/長度
    pattern?: string          // RegExp
    customError?: string
    
    // 特定類型驗證
    email?: boolean
    url?: boolean
    number?: boolean
    dateRange?: {
      start?: Date
      end?: Date
    }
  }
  
  // 進階設定
  settings?: {
    randomizeOptions?: boolean
    allowOther?: boolean
    multipleColumns?: number
    ratingScale?: {
      min: number
      max: number
      minLabel?: string
      maxLabel?: string
    }
  }
  
  // 邏輯跳轉
  logic?: {
    conditions: LogicCondition[]
    action: 'show' | 'hide' | 'skip_to'
    target?: string          // Question ID or Page
  }
}
```

### QuestionType Enum
```typescript
type QuestionType = 
  // 基礎題型
  | 'single_choice'      // 單選題
  | 'multiple_choice'    // 多選題
  | 'dropdown'          // 下拉選單
  | 'text_short'        // 簡答題
  | 'text_long'         // 詳答題
  | 'number'            // 數字題
  | 'email'             // Email
  | 'phone'             // 電話
  | 'date'              // 日期
  | 'time'              // 時間
  
  // 進階題型
  | 'rating'            // 評分題
  | 'scale'             // 量表題
  | 'matrix'            // 矩陣題
  | 'ranking'           // 排序題
  | 'slider'            // 滑桿題
  | 'file_upload'       // 檔案上傳
  | 'signature'         // 簽名
  | 'location'          // 地理位置
  | 'yes_no'            // 是非題
  | 'nps'               // NPS 分數
```

### Response Model
```typescript
interface Response {
  id: string
  surveyId: string
  surveyVersion: number
  userId?: string                // 登入用戶
  
  respondent: {
    sessionId: string
    ipHash: string              // 隱私保護
    country: string
    deviceType: 'desktop' | 'mobile' | 'tablet'
    browser: string
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
  
  answers: Array<{
    questionId: string
    value: any                  // 根據題型
    text?: string               // 其他選項文字
    skipped: boolean
    answeredAt: Date
    timeSpent: number          // seconds
  }>
  
  status: 'in_progress' | 'completed' | 'abandoned'
  
  progress: {
    currentPage: number
    totalPages: number
    percentage: number
  }
  
  startedAt: Date
  updatedAt: Date
  submittedAt?: Date
  totalTime: number            // seconds
  
  qualityFlags?: string[]      // ['speeding', 'straight_lining']
  isTest: boolean
}
```

### Theme Model
```typescript
interface Theme {
  id?: string
  name?: string
  
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    error: string
    success: string
  }
  
  typography: {
    fontFamily: string
    fontSize: {
      small: string
      base: string
      large: string
      xl: string
    }
    fontWeight: {
      normal: number
      medium: number
      bold: number
    }
  }
  
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  
  borderRadius: string
  boxShadow: string
  
  customCss?: string
}
```

### SurveySettings Model
```typescript
interface SurveySettings {
  // 存取控制
  allowMultipleResponses: boolean
  requireLogin: boolean
  collectIp: boolean
  password?: string
  
  // 時間控制
  startDate?: Date
  endDate?: Date
  timezone: string
  
  // 回應限制
  responseLimit?: number
  dailyResponseLimit?: number
  
  // 頁面設定
  showProgressBar: boolean
  showQuestionNumbers: boolean
  randomizeQuestions: boolean
  oneQuestionPerPage: boolean
  preventGoBack: boolean
  
  // 自動化
  autoSave: boolean
  autoAdvance: boolean
  timeLimit?: number            // minutes
  
  // 完成設定
  showCompletionPage: boolean
  completionMessage?: string
  redirectUrl?: string
  
  // 通知
  emailNotification: boolean
  notificationEmails?: string[]
  
  // 語言
  language: string
  multiLanguage: boolean
  languages?: string[]
}
```

---

## 🔌 WebSocket Events

### 連接
```typescript
// 連接 URL
ws://api.smartsurvey.com/ws

// 認證
{
  type: 'auth',
  token: string
}
```

### 事件類型

#### 問卷編輯協作
```typescript
// 訂閱問卷編輯
{
  type: 'subscribe',
  channel: 'survey:edit',
  surveyId: string
}

// 接收更新
{
  type: 'survey:updated',
  data: {
    surveyId: string,
    userId: string,
    changes: any,
    timestamp: Date
  }
}

// 游標位置
{
  type: 'cursor:move',
  data: {
    userId: string,
    position: { x: number, y: number },
    selection?: any
  }
}
```

#### 即時分析
```typescript
// 訂閱即時統計
{
  type: 'subscribe',
  channel: 'survey:analytics',
  surveyId: string
}

// 接收統計更新
{
  type: 'analytics:update',
  data: {
    activeUsers: number,
    newResponse: {
      responseId: string,
      progress: number
    }
  }
}
```

#### 系統通知
```typescript
// 接收通知
{
  type: 'notification',
  data: {
    id: string,
    title: string,
    message: string,
    level: 'info' | 'warning' | 'error',
    action?: {
      label: string,
      url: string
    }
  }
}
```

---

## 📝 備註

### 開發環境差異
```yaml
Development:
  Base URL: http://localhost:3000/api
  CORS: Allow all origins
  Rate Limit: Disabled
  Debug: Enabled

Production:
  Base URL: https://api.smartsurvey.com/v1
  CORS: Whitelist only
  Rate Limit: Enabled
  Debug: Disabled
```

### API 版本管理
- 當前版本：v1
- 版本支援期：至少 6 個月通知
- Breaking changes：新版本號
- 向下相容：盡可能維持

### 待實作功能 (標記為 📅)
- AI 相關 APIs (Phase 3)
- 團隊協作 APIs (Phase 3)
- Webhook APIs (Phase 4)
- 第三方整合 APIs (Phase 5)
- GraphQL 端點 (Future)

---

*最後更新：2025-01-10*  
*此文件會隨開發進度持續更新*