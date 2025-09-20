# 認證系統 API

> 📅 最後更新：2025-01-20 🎯 狀態：Phase 1 完成 🏗️ 架構：JWT + MongoDB Session

---

## 📋 概述

SmartSurvey
Pro 認證系統提供完整的用戶身份驗證和授權管理，支援 JWT 令牌、工作區權限、安全性防護等功能。

### 核心特色

- **🔐 JWT 雙令牌機制**：Access Token (15分鐘) + Refresh Token (7天)
- **👥 工作區權限管理**：支援多工作區協作和權限隔離
- **🛡️ 安全性防護**：樂觀鎖定、輸入驗證、密碼加密
- **📊 完整審計日誌**：操作記錄和錯誤追蹤

---

## 🗂️ API 端點總覽

| 端點                 | 方法 | 功能              | 狀態    |
| -------------------- | ---- | ----------------- | ------- |
| `/api/auth/register` | POST | 用戶註冊          | ✅ 完成 |
| `/api/auth/login`    | POST | 用戶登入          | ✅ 完成 |
| `/api/auth/logout`   | POST | 用戶登出          | ✅ 完成 |
| `/api/auth/me`       | GET  | 取得當前用戶資訊  | ✅ 完成 |
| `/api/auth/refresh`  | POST | 刷新 Access Token | ✅ 完成 |

---

## 🔧 API 詳細說明

### 1. 用戶註冊 - `register.post.ts`

**功能**：建立新用戶帳號並返回 JWT 令牌

**請求格式**：

```typescript
{
  name: string; // 用戶名稱 (1-50字)
  email: string; // 電子郵件 (唯一)
  password: string; // 密碼 (8-128字，至少包含英文和數字)
}
```

**回應格式**：

```typescript
{
  success: true;
  data: {
    user: User; // 用戶基本資訊
    accessToken: string; // JWT Access Token (15分鐘)
    refreshToken: string; // JWT Refresh Token (7天)
  }
  message: string;
}
```

**核心邏輯**：

- Email 唯一性檢查
- bcrypt 密碼加密 (10 rounds)
- 自動建立預設工作區
- 生成 JWT 雙令牌

### 2. 用戶登入 - `login.post.ts`

**功能**：驗證用戶憑證並返回 JWT 令牌

**請求格式**：

```typescript
{
  email: string; // 電子郵件
  password: string; // 明文密碼
}
```

**回應格式**：同註冊 API

**核心邏輯**：

- Email 存在性檢查
- bcrypt 密碼驗證
- 生成新的 JWT 雙令牌
- 更新用戶最後登入時間

### 3. 用戶登出 - `logout.post.ts`

**功能**：撤銷用戶令牌並清除會話

**請求格式**：

```typescript
{
  refreshToken?: string; // 可選的 Refresh Token
}
```

**回應格式**：

```typescript
{
  success: true;
  message: string;
}
```

**核心邏輯**：

- 驗證 Refresh Token（如果提供）
- 記錄登出操作日誌
- 客戶端負責清除本地令牌

### 4. 取得用戶資訊 - `me.get.ts`

**功能**：返回當前認證用戶的詳細資訊

**認證**：需要有效的 JWT Access Token

**回應格式**：

```typescript
{
  success: true;
  data: {
    user: User;                    // 用戶基本資訊
    currentWorkspace: Workspace;   // 當前工作區
    workspacePermissions: Permission[]; // 工作區權限列表
    allWorkspaces: Workspace[];    // 所有可存取工作區
  };
}
```

**核心邏輯**：

- JWT 令牌驗證和解析
- 用戶資訊查詢和工作區載入
- 權限聚合計算
- 高頻 API，優化效能

### 5. 刷新令牌 - `refresh.post.ts`

**功能**：使用 Refresh Token 獲取新的 Access Token

**請求格式**：

```typescript
{
  refreshToken: string; // 有效的 Refresh Token
}
```

**回應格式**：

```typescript
{
  success: true;
  data: {
    accessToken: string; // 新的 Access Token
    refreshToken: string; // 新的 Refresh Token (可選輪替)
  }
  message: string;
}
```

**核心邏輯**：

- Refresh Token 有效性驗證
- 生成新的 Access Token
- 可選的 Refresh Token 輪替
- 防止令牌重放攻擊

---

## 🛡️ 安全性設計

### JWT 配置

```typescript
// Access Token
{
  payload: {
    (userId, email, workspaceId);
  }
  expiresIn: '15m';
  algorithm: 'HS256';
}

// Refresh Token
{
  payload: {
    (userId, tokenFamily);
  }
  expiresIn: '7d';
  algorithm: 'HS256';
}
```

### 密碼安全

- **加密算法**：bcrypt (cost: 10)
- **密碼規則**：8-128字，至少包含英文和數字
- **存儲安全**：明文密碼即時銷毀

### 輸入驗證

- **Zod Schema**：嚴格型別驗證
- **XSS 防護**：輸入消毒處理
- **注入防護**：參數化查詢

---

## 📊 資料庫設計

### User Collection

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  defaultWorkspaceId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

### UserWorkspace Collection

```typescript
interface UserWorkspace {
  _id: string;
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
  isActive: boolean;
}
```

---

## 🔮 未來擴充計劃

### Phase 2 優化 (已規劃)

- **Redis Session 快取**：me.get.ts 效能優化
- **Token 黑名單機制**：登出時立即撤銷 Token
- **登入防護機制**：失敗計數與帳號鎖定
- **專業日誌系統**：結構化日誌與監控

### Phase 3 進階功能

- **多因素認證 (MFA)**：TOTP、SMS 驗證
- **OAuth 整合**：Google、GitHub 第三方登入
- **SSO 支援**：企業單點登入
- **細粒度權限**：RBAC 角色權限系統

詳細規劃請參考 `/docs/TODO.md` 中的認證系統相關項目。

---

## 🧪 測試指引

### 手動測試流程

1. **註冊測試**：

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"測試用戶","email":"test@example.com","password":"test1234"}'
   ```

2. **登入測試**：

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test1234"}'
   ```

3. **用戶資訊測試**：
   ```bash
   curl -X GET http://localhost:3000/api/auth/me \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

### 常見錯誤碼

| 錯誤碼 | 說明             | 解決方法             |
| ------ | ---------------- | -------------------- |
| 400    | 請求資料格式錯誤 | 檢查輸入欄位和類型   |
| 401    | 未授權或令牌無效 | 重新登入獲取令牌     |
| 409    | Email 已存在     | 使用不同的 Email     |
| 500    | 伺服器內部錯誤   | 檢查日誌和資料庫連線 |

---

## 📝 開發注意事項

### 中間件依賴

- **requireAuth**: 位於 `../middleware/auth.ts`，用於 Token 驗證
- **connectToDatabase**: 位於 `@smartsurvey/shared/server`，資料庫連線

### 環境變數需求

```bash
# JWT 設定
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 資料庫連線
MONGODB_URI=mongodb://...
```

### 程式碼風格

- 使用 TypeScript 嚴格模式
- Zod 進行輸入驗證
- 詳細的錯誤處理和日誌記錄
- 中文註解便於理解

---

**相關文件**：

- [API 規格書](../../../../smartsurvey-api-reference.md)
- [認證中間件文件](../middleware/README.md)
- [TODO 延後項目](../../../../docs/TODO.md)
