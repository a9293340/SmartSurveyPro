# Auth API 認證服務目錄

> 📁 **目錄作用**：用戶認證與授權相關的 API 端點
>
> 📅 **最後更新**：2025-01-20
>
> 🎯 **負責功能**：處理用戶註冊、登入、登出、Token 管理等認證流程

## 📋 API 端點清單

| 檔案名稱           | HTTP 方法 | 路由                 | 功能說明     | 狀態      |
| ------------------ | --------- | -------------------- | ------------ | --------- |
| `register.post.ts` | POST      | `/api/auth/register` | 用戶註冊     | ✅ 已完成 |
| `login.post.ts`    | POST      | `/api/auth/login`    | 用戶登入     | ✅ 已完成 |
| `logout.post.ts`   | POST      | `/api/auth/logout`   | 用戶登出     | ✅ 已完成 |
| `me.get.ts`        | GET       | `/api/auth/me`       | 獲取用戶資訊 | ✅ 已完成 |
| `refresh.post.ts`  | POST      | `/api/auth/refresh`  | 刷新 Token   | ✅ 已完成 |

## 🔧 詳細 API 說明

### 1. POST /api/auth/register

**功能**：新用戶註冊 **請求體**：

```typescript
{
  email: string; // 用戶 Email（必填）
  password: string; // 密碼（必填）
  name: string; // 用戶名稱（必填）
}
```

**回應**：

```typescript
{
  success: true;
  data: {
    user: AuthUser; // 用戶基本資訊
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  }
}
```

**業務邏輯**：

1. 驗證 Email 格式和唯一性
2. 密碼加密存儲
3. 建立預設群組
4. 生成 JWT Token 對
5. 記錄註冊活動

### 2. POST /api/auth/login

**功能**：用戶登入驗證 **請求體**：

```typescript
{
  email: string; // 登入 Email
  password: string; // 登入密碼
}
```

**回應**：同註冊 API **業務邏輯**：

1. 驗證用戶存在性
2. 密碼比對驗證
3. 檢查用戶狀態（封禁、凍結等）
4. 生成新的 Token 對
5. 記錄登入活動和 IP

### 3. POST /api/auth/logout

**功能**：用戶登出 **請求**：需要 Authorization Header **回應**：

```typescript
{
  success: true;
  message: '登出成功';
}
```

**業務邏輯**：

1. 驗證 JWT Token 有效性
2. 記錄登出活動
3. _（未來）加入 Token 黑名單_

### 4. GET /api/auth/me

**功能**：獲取當前用戶完整資訊 **請求**：需要 Authorization Header **回應**：

```typescript
{
  success: true;
  data: {
    user: User;           // 完整用戶資訊
    groups: Group[];      // 用戶所屬群組
    permissions: string[]; // 用戶權限列表
  };
}
```

**業務邏輯**：

1. 驗證 JWT Token
2. 查詢用戶完整資料
3. 查詢用戶群組關係
4. 計算有效權限集合

### 5. POST /api/auth/refresh

**功能**：使用 Refresh Token 換取新的 Access Token **請求體**：

```typescript
{
  refreshToken: string;
}
```

**回應**：

```typescript
{
  success: true;
  data: {
    accessToken: string; // 新的 Access Token
    refreshToken: string; // 新的 Refresh Token（可選）
  }
}
```

**業務邏輯**：

1. 驗證 Refresh Token 有效性
2. 檢查用戶狀態
3. 生成新的 Access Token
4. _（未來）Token 黑名單檢查_

## 🔐 安全機制

### JWT Token 設計

```typescript
// Access Token (短期有效，15-30分鐘)
{
  userId: string;
  email: string;
  exp: number; // 過期時間
  iat: number; // 簽發時間
}

// Refresh Token (長期有效，7-30天)
{
  userId: string;
  tokenId: string; // Token 唯一標識
  exp: number;
}
```

### 密碼安全

- 使用 bcrypt 進行密碼哈希
- 預設 10 輪 Salt rounds
- 密碼強度驗證（前端 + 後端）

### 安全標頭

```typescript
// CORS 設定
{
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true
}

// 安全響應標頭
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}
```

## 📊 錯誤處理

### 標準錯誤回應

```typescript
{
  success: false;
  statusCode: number;
  statusMessage: string;
  data?: {
    field?: string;      // 驗證錯誤的欄位
    details?: any;       // 額外錯誤資訊
  };
}
```

### 常見錯誤碼

| 狀態碼 | 錯誤情境         | 處理建議                   |
| ------ | ---------------- | -------------------------- |
| 400    | 請求資料格式錯誤 | 檢查前端驗證邏輯           |
| 401    | Token 無效或過期 | 引導用戶重新登入           |
| 403    | 權限不足         | 顯示權限錯誤訊息           |
| 409    | Email 已存在     | 提示用戶使用其他 Email     |
| 429    | 請求過於頻繁     | 實作前端限流機制           |
| 500    | 伺服器內部錯誤   | 記錄錯誤日誌，顯示通用錯誤 |

## 🔄 資料庫操作

### 主要 Collections

- **users**: 用戶基本資料
- **groups**: 用戶群組資料
- **user_groups**: 用戶群組關係表
- **activity_logs**: 用戶活動記錄

### 索引設計

```javascript
// users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ status: 1 });

// activity_logs collection
db.activity_logs.createIndex({ userId: 1, createdAt: -1 });
db.activity_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90天過期
```

## 🚀 效能考量

### 快取策略

```typescript
// Redis 快取設計（未來實作）
{
  `user:${userId}`: "用戶基本資料快取",
  `user:permissions:${userId}`: "用戶權限快取",
  `blacklist:${tokenId}`: "Token 黑名單",
}
```

### 資料庫優化

- 用戶查詢使用 email 索引
- 活動日誌自動過期機制
- 群組權限查詢使用聚合管道

## 📝 Phase 2 待實作功能

### 高級安全功能

- [ ] Token 黑名單機制（Redis）
- [ ] 登入失敗限制和帳號鎖定
- [ ] 多設備管理和強制登出
- [ ] 可疑活動檢測

### 社交登入

- [ ] Google OAuth 整合
- [ ] GitHub OAuth 整合
- [ ] 第三方帳號綁定

### 進階功能

- [ ] 兩步驟驗證（2FA）
- [ ] 密碼重置流程
- [ ] Email 驗證機制
- [ ] 會話管理界面

## 🧪 測試策略

### 單元測試重點

- [ ] 密碼加密和驗證邏輯
- [ ] JWT Token 生成和驗證
- [ ] 請求參數驗證邏輯
- [ ] 錯誤處理完整性

### 整合測試重點

- [ ] 完整認證流程
- [ ] Token 過期和刷新流程
- [ ] 錯誤場景處理
- [ ] 併發請求處理

### 安全測試重點

- [ ] SQL/NoSQL 注入測試
- [ ] 暴力破解防護測試
- [ ] JWT Token 安全性測試
- [ ] 敏感資料洩漏檢查

---

**最後更新者**：Claude AI Assistant **下次檢查**：實作 Phase 2 功能時
