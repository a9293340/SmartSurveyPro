# 問卷系統 API

> 📅 最後更新：2025-01-20 🎯 狀態：Phase 1 完成 🏗️ 架構：RESTful +
> MongoDB + 軟刪除

---

## 📋 概述

SmartSurvey
Pro 問卷系統提供完整的問卷生命週期管理，包含建立、編輯、發布、統計等功能，支援智能狀態轉換、樂觀鎖定、許可權控制等企業級特性。

### 核心特色

- **📝 完整 CRUD 操作**：問卷建立、查詢、更新、軟刪除
- **🔄 智能狀態管理**：Draft → Published → Paused/Closed → Archived
- **🛡️ 樂觀鎖定機制**：防止併發編輯衝突
- **📊 分頁與篩選**：支援多維度搜尋和排序
- **🏢 工作區隔離**：多租戶資料安全

---

## 🗂️ API 端點總覽

| 端點                | 方法   | 功能         | 狀態    |
| ------------------- | ------ | ------------ | ------- |
| `/api/surveys`      | GET    | 取得問卷列表 | ✅ 完成 |
| `/api/surveys`      | POST   | 建立新問卷   | ✅ 完成 |
| `/api/surveys/[id]` | GET    | 取得單一問卷 | ✅ 完成 |
| `/api/surveys/[id]` | PUT    | 更新問卷     | ✅ 完成 |
| `/api/surveys/[id]` | DELETE | 刪除問卷     | ✅ 完成 |

---

## 🔧 API 詳細說明

### 1. 問卷列表查詢 - `index.get.ts`

**功能**：取得當前用戶的問卷列表，支援分頁、篩選、排序、搜尋

**查詢參數**：

```typescript
{
  page?: number;        // 頁碼 (預設: 1)
  limit?: number;       // 每頁筆數 (預設: 20, 最大: 100)
  status?: string;      // 狀態篩選 (逗號分隔)
  search?: string;      // 關鍵字搜尋 (標題、描述)
  sort?: string;        // 排序欄位 (預設: -createdAt)
}
```

**回應格式**：

```typescript
{
  success: true;
  data: Array<{
    _id: string;
    title: string;
    description: string;
    type: SurveyType;
    status: SurveyStatus;
    questionCount: number;
    stats: {
      totalResponses: number;
      completedResponses: number;
      completionRate: number;
    };
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }
}
```

**核心邏輯**：

- 只查詢當前用戶擁有的問卷
- 支援狀態多選篩選 (`draft,published`)
- 標題和描述的不區分大小寫搜尋
- 白名單驗證排序欄位
- 使用 MongoDB projection 優化效能

### 2. 建立問卷 - `index.post.ts`

**功能**：建立新問卷並返回基本資訊

**請求格式**：

```typescript
{
  title: string;              // 問卷標題 (1-200字)
  description?: string;       // 問卷描述 (最大1000字)
  type?: SurveyType;         // 問卷類型 (預設: STANDARD)
  workspaceId?: string;      // 工作區ID (預設: userId)
  questions?: Question[];    // 初始題目 (預設: [])
}
```

**回應格式**：

```typescript
{
  success: true;
  data: {
    _id: string;
    title: string;
    description: string;
    type: SurveyType;
    status: SurveyStatus.DRAFT;
    createdAt: Date;
  }
  message: string;
}
```

**核心邏輯**：

- 檢查用戶問卷數量限制 (Free: 3個)
- 自動設定預設值和初始狀態
- 建立完整的問卷物件結構
- 樂觀性能：先檢查限制再建立物件

### 3. 單一問卷查詢 - `[id].get.ts`

**功能**：取得指定問卷的完整資訊，用於編輯器載入

**路徑參數**：

```typescript
{
  id: string; // 問卷ID
}
```

**回應格式**：

```typescript
{
  success: true;
  data: Survey; // 完整問卷物件
}
```

**核心邏輯**：

- 驗證用戶權限 (只能查詢自己的問卷)
- 返回完整問卷資料包含所有題目
- 404 錯誤處理

### 4. 問卷更新 - `[id].put.ts`

**功能**：更新問卷內容，支援部分更新和狀態轉換

**請求格式**：

```typescript
{
  title?: string;
  description?: string;
  type?: SurveyType;
  status?: SurveyStatus;
  questions?: Question[];
  publishSettings?: {
    visibility?: SurveyVisibility;
    password?: string;
    startDate?: string;
    endDate?: string;
    responseLimit?: number;
    allowAnonymous?: boolean;
    allowMultipleResponses?: boolean;
    redirectUrl?: string;
    thankYouMessage?: string;
  };
  appearance?: {
    primaryColor?: string;
    backgroundColor?: string;
    coverImageUrl?: string;
    customCss?: string;
    fontFamily?: string;
  };
  completionMessage?: string;
  settings?: {
    allowAnonymous?: boolean;
    collectIP?: boolean;
    allowMultipleSubmissions?: boolean;
  };
  lastModified?: string;  // 樂觀鎖定
}
```

**回應格式**：

```typescript
{
  success: true;
  data: Survey;           // 更新後的完整問卷
  message: string;
  meta: {
    modifiedCount: number;
    statusChanged: boolean;
    publishedAt?: Date;
  };
}
```

**核心邏輯**：

- 樂觀鎖定防止併發修改 (`lastModified` 檢查)
- 狀態轉換驗證 (僅允許合法轉換)
- 發布前完整性驗證 (標題、題目檢查)
- 密碼保護模式驗證
- 巢狀物件更新支援

### 5. 問卷刪除 - `[id].delete.ts`

**功能**：軟刪除問卷 (狀態改為 ARCHIVED)

**請求格式**：

```typescript
{
  lastModified?: string;  // 樂觀鎖定 (可選)
}
```

**回應格式**：

```typescript
{
  success: true;
  message: string;
  data: {
    id: string;
    title: string;
    status: SurveyStatus.ARCHIVED;
    deletedAt: Date;
  }
}
```

**核心邏輯**：

- 只有 DRAFT 和 CLOSED 狀態可刪除
- 軟刪除：狀態改為 ARCHIVED
- 清空統計資料保護隱私
- 樂觀鎖定防止併發刪除
- 詳細的權限和狀態檢查

---

## 🔄 問卷狀態機

### 狀態轉換規則

```
DRAFT ────────┐
    │         ├─→ PUBLISHED ──┬─→ PAUSED ──┐
    │         │               │            │
    │         │               ↓            ↓
    ↓         │            CLOSED ─────────┤
ARCHIVED ←────┴─────────────────────────────┘
```

**狀態說明**：

- `DRAFT`: 草稿狀態，可編輯
- `PUBLISHED`: 已發布，可收集回應
- `PAUSED`: 暫停收集，可恢復發布
- `CLOSED`: 已關閉，不再收集回應
- `ARCHIVED`: 已封存，軟刪除狀態

**轉換限制**：

- ARCHIVED 狀態不可轉換到其他狀態
- 發布前需通過完整性驗證
- 只有草稿和已關閉問卷可以刪除

---

## 🛡️ 安全性設計

### 權限控制

- **擁有者權限**：只能操作自己的問卷
- **工作區隔離**：問卷屬於特定工作區
- **狀態驗證**：嚴格的狀態轉換控制

### 輸入驗證

```typescript
// 標題驗證
title: z.string().min(1).max(200);

// 描述驗證
description: z.string().max(1000).optional();

// 色彩驗證
primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i);

// URL 驗證
redirectUrl: z.string().url().optional();
```

### 併發控制

- **樂觀鎖定**：使用 `lastModified` 時間戳
- **原子操作**：MongoDB 原子更新
- **版本衝突檢測**：毫秒級時間比較

---

## 📊 資料庫設計

### Survey Collection

```typescript
interface Survey {
  _id: string;
  title: string;
  description: string;
  type: SurveyType;
  status: SurveyStatus;
  ownerId: string;
  workspaceId: string;
  questions: Question[];

  publishSettings: {
    visibility: SurveyVisibility;
    allowAnonymous: boolean;
    allowMultipleResponses: boolean;
    password?: string;
    startDate?: Date;
    endDate?: Date;
    responseLimit?: number;
    redirectUrl?: string;
    thankYouMessage?: string;
  };

  appearance: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    coverImageUrl?: string;
    customCss?: string;
  };

  stats: {
    totalResponses: number;
    completedResponses: number;
    avgCompletionTime: number;
    abandonmentRate: number;
    lastResponseAt?: Date;
  };

  settings: {
    allowAnonymous: boolean;
    collectIP: boolean;
    allowMultipleSubmissions: boolean;
  };

  completionMessage: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
```

### 索引策略

```javascript
// 複合索引：用戶 + 狀態 + 建立時間
{ ownerId: 1, status: 1, createdAt: -1 }

// 文字搜尋索引
{ title: "text", description: "text" }

// 工作區索引
{ workspaceId: 1, createdAt: -1 }
```

---

## 🔮 未來擴充計劃

### Phase 2 優化 (已規劃)

- **Redis 快取系統**：問卷列表和內容快取
- **全文搜尋功能**：MongoDB Atlas Search 整合
- **問卷範本系統**：預設範本和自訂範本
- **版本控制系統**：修改歷史和回滾功能
- **垃圾桶功能**：已刪除問卷恢復
- **批量操作**：批量刪除、狀態變更

### Phase 3 進階功能

- **Workspace 工作區整合**：真正的多租戶支援
- **即時協作同步**：WebSocket 多人編輯
- **真實訂閱限制**：付費方案整合

詳細規劃請參考 `/docs/TODO.md` 中的 Survey CRUD API 相關項目。

---

## 🧪 測試指引

### 完整測試流程

1. **建立問卷**：

   ```bash
   curl -X POST http://localhost:3000/api/surveys \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"測試問卷","description":"這是一個測試問卷"}'
   ```

2. **查詢問卷列表**：

   ```bash
   curl -X GET "http://localhost:3000/api/surveys?page=1&limit=10&status=draft" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **更新問卷**：

   ```bash
   curl -X PUT http://localhost:3000/api/surveys/SURVEY_ID \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"更新後的標題","status":"published"}'
   ```

4. **刪除問卷**：
   ```bash
   curl -X DELETE http://localhost:3000/api/surveys/SURVEY_ID \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### 常見錯誤碼

| 錯誤碼 | 說明               | 解決方法               |
| ------ | ------------------ | ---------------------- |
| 400    | 請求資料格式錯誤   | 檢查輸入欄位和驗證規則 |
| 401    | 未授權             | 檢查 JWT Token         |
| 403    | 權限不足           | 確認是問卷擁有者       |
| 404    | 問卷不存在         | 檢查問卷ID和擁有權     |
| 409    | 併發衝突或狀態錯誤 | 重新載入後重試         |

---

## 📈 效能優化

### 當前實作

- **分頁查詢**：避免大量資料載入
- **欄位投影**：列表查詢只回傳必要欄位
- **並行查詢**：同時執行計數和資料查詢
- **索引利用**：複合索引優化查詢

### 未來優化

- **Redis 快取**：熱門問卷和用戶列表快取
- **CDN 加速**：靜態資源和 API 快取
- **讀寫分離**：查詢和更新資料庫分離

---

## 📝 開發注意事項

### 依賴項目

- **認證中間件**：`requireAuth` 驗證用戶身份
- **資料庫連線**：`@smartsurvey/shared/server`
- **共享類型**：`@smartsurvey/shared` 的 Survey 類型

### 環境變數

```bash
# 資料庫連線
MONGODB_URI=mongodb://...

# JWT 驗證
JWT_SECRET=your-secret-key
```

### 程式碼規範

- TypeScript 嚴格模式
- Zod 輸入驗證
- 詳細錯誤處理
- 操作日誌記錄
- 中文註解說明

---

**相關文件**：

- [API 規格書](../../../../smartsurvey-api-reference.md)
- [認證系統文件](../auth/README.md)
- [資料庫結構文件](../../../../docs/smartsurvey-db-structure.md)
- [TODO 延後項目](../../../../docs/TODO.md)
