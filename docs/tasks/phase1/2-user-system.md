# 2. 用戶認證系統

## 📊 概覽

- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: 🟨 進行中
- **預估工時**: 28h （原 24h + 4h Nuxt3 初始化）
- **實際工時**: 8h
- **進度**: 29% ██████░░░░░░░░░░░░░░
- **開始日期**: 2025-01-16
- **完成日期**: -

## 🔗 依賴關係

- **前置任務**: 1.基礎架構設置、**0.Nuxt3 主應用初始化**（待補充）
- **阻塞任務**: 3.問卷建構器, 4.資料收集系統
- **相關文件**:
  - [業務邏輯規則](../../../smartsurvey-business-logic.md#訂閱方案與限制)
  - [API 參考手冊](../../../smartsurvey-api-reference.md#認證-apis)
  - [資料庫結構](../../smartsurvey-db-structure.md#1-users-collection)

## 📚 學習目標

- [ ] 理解 JWT 認證機制和最佳實踐
- [ ] 掌握密碼加密和安全性考量
- [ ] 學會 Nuxt3 中的 Session 管理
- [ ] 理解訂閱方案和使用限制邏輯
- [ ] 掌握 Zod 資料驗證的實作模式

## 🏗️ 任務分解

### 2.0 Nuxt3 主應用初始化 [4h] ✅

**狀態**: ✅ **優先級**: 🔴 **前置條件**

#### 2.0.1 建立 Nuxt3 應用

- **預估**: 2h | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-16

**任務說明**: 在 apps/web 初始化 Nuxt3 應用

**執行步驟**:

```bash
# 在專案根目錄執行
cd apps
pnpm dlx nuxi@latest init web
cd web

# 修改 package.json name 為 @smartsurvey/web
# 安裝必要依賴
pnpm add @smartsurvey/shared
```

**驗收標準**:

- [x] Nuxt3 應用成功建立在 apps/web
- [x] 可以執行 pnpm dev 啟動開發伺服器
- [x] 正確引用 @smartsurvey/shared 套件

#### 2.0.2 配置 Nuxt3 基礎設定

- **預估**: 2h | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-16

**任務說明**: 設定 nuxt.config.ts 和基礎結構

**配置項目**:

- TypeScript 設定 ✅
- Nitro 伺服器設定 ✅
- 環境變數配置 ✅
- API 路由結構 ✅
- Tailwind CSS 整合 ✅
- Pinia 狀態管理 ✅
- 健康檢查 API ✅

### 2.1 資料模型設計 [6h] ✅

**狀態**: ✅ **優先級**: 🔴

#### 2.1.1 User Schema 定義

- **預估**: 3h | **實際**: 4h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成日期**: 2025-01-16

**任務說明**: 根據業務需求設計 User 資料結構和 Zod 驗證

**已完成內容**:

✅ 完整的 TypeScript 介面系統：

- `packages/shared/src/types/user.ts` - 用戶相關所有類型
- `packages/shared/src/types/group.ts` - 群組和訂閱相關類型
- `packages/shared/src/types/permission.ts` - ABAC 權限系統類型
- `packages/shared/src/types/invitation.ts` - 邀請系統類型
- `packages/shared/src/types/relationship.ts` - 用戶群組角色關聯類型

✅ 完整的 Zod 驗證 schemas：

- `packages/shared/src/schemas/user.ts` - 用戶驗證規則
- `packages/shared/src/schemas/group.ts` - 群組驗證規則
- `packages/shared/src/schemas/permission.ts` - 權限驗證規則
- `packages/shared/src/schemas/invitation.ts` - 邀請驗證規則
- `packages/shared/src/schemas/relationship.ts` - 關聯表驗證規則

✅ 系統常數和配置：

- `packages/shared/src/constants/index.ts` - 完整的系統常數定義

**驗收標準**:

- [x] User interface 包含所有必要欄位 (User, AuthUser, UserProfile 等)
- [x] Zod schema 定義完整的驗證規則 (含中文錯誤訊息)
- [x] 密碼相關欄位正確處理 (passwordHash, 重設 token 等)
- [x] 企業級多租戶 ABAC 權限系統設計
- [x] 完整邀請流程和成員管理系統
- [x] 訂閱方案限制和功能開關設計

#### 2.1.2 訂閱方案 Schema

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 定義訂閱方案的資料結構和限制邏輯，建立獨立的訂閱系統設計文件

**TODO(human)**: 需要建立 `docs/design/subscription-system.md` 包含：

- 訂閱方案詳細規格
- 計費邏輯設計
- 限制檢查機制
- 升級降級流程

#### 2.1.3 MongoDB Collection 結構

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 根據新的 ABAC 權限系統更新 MongoDB 資料庫設計

**TODO(human)**: 需要更新 `docs/smartsurvey-db-structure.md` 包含：

- 新的權限系統 Collections
- 邀請系統資料結構
- 索引策略優化
- 查詢效能考量

### 2.2 認證 API 實作 [12h]

**狀態**: ⬜ **優先級**: 🔴

#### 2.2.1 註冊功能

- **預估**: 4h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 實作用戶註冊 API，包含資料驗證和密碼加密

**學習重點**: bcrypt 密碼加密、email 唯一性檢查、預設訂閱方案設定

**TODO(human)**:

```typescript
// 在 apps/web/server/api/auth/register.post.ts
// 實作註冊邏輯的核心部分

export default defineEventHandler(async event => {
  // TODO(human): 實作以下邏輯
  // 1. 驗證輸入資料
  // 2. 檢查 email 唯一性
  // 3. 密碼加密處理
  // 4. 建立用戶記錄
  // 5. 回傳適當回應
});
```

#### 2.2.2 登入功能

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作登入驗證和 JWT Token 生成

**TODO(human)**:

```typescript
// 登入驗證邏輯
// 思考：如何安全地驗證密碼？JWT payload 應該包含什麼資訊？
```

#### 2.2.3 Token 管理

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 實作 JWT Token 生成、驗證和刷新機制

#### 2.2.4 登出與 Session 清理

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

### 2.3 認證中間件 [6h]

**狀態**: ⬜ **優先級**: 🔴

#### 2.3.1 JWT 驗證中間件

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 建立 Nuxt3 認證中間件，保護需要登入的路由

**TODO(human)**:

```typescript
// 在 apps/web/middleware/auth.ts
// 實作認證檢查邏輯
export default defineNuxtRouteMiddleware((to, from) => {
  // TODO(human):
  // 1. 檢查 token 是否存在
  // 2. 驗證 token 有效性
  // 3. 決定是否允許訪問或重導向
});
```

#### 2.3.2 權限檢查中間件

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

#### 2.3.3 訂閱限制中間件

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 檢查用戶訂閱方案限制

## 🧪 測試計劃

### 單元測試

- [ ] User Schema 驗證測試
- [ ] 密碼加密/驗證測試
- [ ] JWT Token 生成/驗證測試

### 整合測試

- [ ] 註冊流程完整測試
- [ ] 登入流程完整測試
- [ ] 認證中間件保護測試

### 安全測試

- [ ] SQL Injection 防護
- [ ] 密碼暴力破解防護
- [ ] Token 安全性測試

## 📝 API 端點清單

| Method | Endpoint                    | 功能         | 狀態 |
| ------ | --------------------------- | ------------ | ---- |
| POST   | `/api/auth/register`        | 用戶註冊     | ⬜   |
| POST   | `/api/auth/login`           | 用戶登入     | ⬜   |
| POST   | `/api/auth/logout`          | 用戶登出     | ⬜   |
| POST   | `/api/auth/refresh`         | Token 刷新   | ⬜   |
| GET    | `/api/auth/me`              | 獲取當前用戶 | ⬜   |
| POST   | `/api/auth/forgot-password` | 忘記密碼     | ⬜   |
| POST   | `/api/auth/reset-password`  | 重設密碼     | ⬜   |

## 💡 實作要點

### 安全考量

1. **密碼安全**
   - 使用 bcrypt 進行密碼 hash
   - 最少 8 字元，包含大小寫字母和數字
   - 避免常見密碼

2. **Token 安全**
   - JWT secret 使用強隨機字串
   - Access token 短期有效（1小時）
   - Refresh token 長期有效（7天）

3. **資料驗證**
   - 前後端都要進行資料驗證
   - 使用 Zod schema 確保一致性
   - 適當的錯誤訊息回傳

### 效能考量

- Redis 快取用戶 session
- 資料庫查詢優化
- 避免 N+1 查詢問題

## 🔄 狀態變更歷史

- 2025-01-13: 任務建立，狀態設為未開始
- 2025-01-16: 開始執行，完成 Nuxt3 主應用初始化（任務 2.0）
- 2025-01-16: 完成基礎介面工程（任務 2.1），建立完整的 TypeScript 類型系統和 Zod 驗證架構

## 💡 給 Claude 的上下文

**任務位置**: Phase 1 > 用戶認證系統 **當前進度**: 依賴基礎架構完成
**技術要點**: JWT + bcrypt + Zod + Nuxt3 middleware
**安全要求**: 遵循 OWASP 認證最佳實踐 **相關檔案**:

- `packages/shared/src/types/user.ts`
- `apps/web/server/api/auth/*.ts`
- `apps/web/middleware/auth.ts`
