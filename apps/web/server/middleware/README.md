# Server Middleware 中間件說明

## 執行順序

Nuxt 3 的中間件按照檔名字母順序執行，我們使用數字前綴來控制執行順序：

1. `00-cors.ts` - CORS 跨域設定（最先執行）
2. `01-logger.ts` - 請求日誌記錄
3. `02-rate-limit.ts` - 速率限制
4. `auth.ts` - JWT 認證驗證（最後執行）

## 中間件功能

### 00-cors.ts

- 處理跨域請求
- 設定 CORS 相關標頭
- 處理 OPTIONS 預檢請求
- 開發環境較寬鬆，生產環境嚴格

### 01-logger.ts

- 記錄所有 API 請求
- 包含請求方法、路徑、響應時間、狀態碼
- 記錄客戶端 IP 和 User-Agent
- 根據狀態碼使用不同日誌級別

### 02-rate-limit.ts

- 防止 API 濫用
- 預設限制：每分鐘 100 次請求
- 認證用戶和匿名用戶分別計算
- 返回速率限制相關標頭

### auth.ts

- 驗證 JWT Token
- 將用戶資訊注入 context
- 提供輔助函數：
  - `requireAuth()` - 強制要求認證
  - `getUser()` - 獲取當前用戶
  - `hasPermission()` - 檢查權限

## 使用方式

### 在 API 路由中使用認證

```typescript
// server/api/protected/profile.get.ts
import { requireAuth } from '../middleware/auth';

export default defineEventHandler(async event => {
  // 要求必須認證
  const user = requireAuth(event);

  // 使用 user.userId 查詢資料
  return {
    userId: user.userId,
    email: user.email,
  };
});
```

### 可選認證

```typescript
// server/api/surveys/[id].get.ts
import { getUser } from '../middleware/auth';

export default defineEventHandler(async event => {
  const user = getUser(event); // 可能為 null

  if (user) {
    // 返回用戶專屬資料
    return await getSurveyWithUserData(surveyId, user.userId);
  } else {
    // 返回公開資料
    return await getPublicSurvey(surveyId);
  }
});
```

## 公開路徑

以下路徑不需要認證（在 `auth.ts` 中定義）：

- `/api/auth/login` - 登入
- `/api/auth/register` - 註冊
- `/api/auth/refresh` - 刷新 Token
- `/api/auth/forgot-password` - 忘記密碼
- `/api/health` - 健康檢查
- `/api/version` - 版本資訊

## 開發注意事項

### 新增公開路徑

在 `auth.ts` 的 `PUBLIC_PATHS` 陣列中新增路徑。

### 調整速率限制

修改 `02-rate-limit.ts` 的 `DEFAULT_CONFIG`。

### 自訂 CORS 設定

修改 `00-cors.ts` 的 `CORS_CONFIG`。

## TODO 項目

### Phase 1（當前）

- [x] 基礎認證中間件
- [x] CORS 處理
- [x] 請求日誌
- [x] 記憶體速率限制
- [ ] 完整的路徑匹配邏輯
- [ ] 資料庫用戶驗證

### Phase 2（未來）

- [ ] Redis 速率限制
- [ ] 權限系統整合
- [ ] 專業日誌系統（Pino/Winston）
- [ ] API Key 認證
- [ ] 請求簽名驗證

## 測試

```bash
# 測試未認證請求
curl http://localhost:3000/api/protected/profile
# 預期：401 Unauthorized

# 測試認證請求
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/protected/profile
# 預期：200 OK

# 測試速率限制
for i in {1..101}; do curl http://localhost:3000/api/test; done
# 第 101 次應返回 429
```
