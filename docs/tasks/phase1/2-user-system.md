# 2. 用戶認證系統

## 📊 概覽
- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: ⬜ 未開始
- **預估工時**: 24h
- **實際工時**: 0h
- **進度**: 0% ░░░░░░░░░░░░░░░░░░░░
- **開始日期**: -
- **完成日期**: -

## 🔗 依賴關係
- **前置任務**: 1.基礎架構設置
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

### 2.1 資料模型設計 [6h]
**狀態**: ⬜ **優先級**: 🔴

#### 2.1.1 User Schema 定義
- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 根據業務需求設計 User 資料結構和 Zod 驗證

**TODO(human)**:
```typescript
// 在 packages/shared/src/types/user.ts 中定義
// 思考：用戶基本資料包含哪些欄位？
// 訂閱資訊如何設計？團隊關聯如何處理？

export interface User {
  // 你來定義完整的 User interface
  id: string
  // ... 其他欄位
}
```

**驗收標準**:
- [ ] User interface 包含所有必要欄位
- [ ] Zod schema 定義完整的驗證規則
- [ ] 密碼相關欄位正確處理

#### 2.1.2 訂閱方案 Schema
- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 定義訂閱方案的資料結構和限制邏輯

#### 2.1.3 MongoDB Collection 結構
- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 設計 MongoDB Users Collection 的索引和結構

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

export default defineEventHandler(async (event) => {
  // TODO(human): 實作以下邏輯
  // 1. 驗證輸入資料
  // 2. 檢查 email 唯一性
  // 3. 密碼加密處理
  // 4. 建立用戶記錄
  // 5. 回傳適當回應
})
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
})
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

| Method | Endpoint | 功能 | 狀態 |
|--------|----------|------|------|
| POST | `/api/auth/register` | 用戶註冊 | ⬜ |
| POST | `/api/auth/login` | 用戶登入 | ⬜ |
| POST | `/api/auth/logout` | 用戶登出 | ⬜ |
| POST | `/api/auth/refresh` | Token 刷新 | ⬜ |
| GET | `/api/auth/me` | 獲取當前用戶 | ⬜ |
| POST | `/api/auth/forgot-password` | 忘記密碼 | ⬜ |
| POST | `/api/auth/reset-password` | 重設密碼 | ⬜ |

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

## 💡 給 Claude 的上下文

**任務位置**: Phase 1 > 用戶認證系統
**當前進度**: 依賴基礎架構完成
**技術要點**: JWT + bcrypt + Zod + Nuxt3 middleware
**安全要求**: 遵循 OWASP 認證最佳實踐
**相關檔案**:
- `packages/shared/src/types/user.ts`
- `apps/web/server/api/auth/*.ts`
- `apps/web/middleware/auth.ts`