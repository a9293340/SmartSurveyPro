# Surveys API 問卷管理服務目錄

> 📁 **目錄作用**：問卷 CRUD 操作相關的 API 端點
>
> 📅 **最後更新**：2025-01-20
>
> 🎯 **負責功能**：問卷的建立、查詢、更新、刪除等核心業務邏輯

## 📋 API 端點清單

| 檔案名稱         | HTTP 方法 | 路由               | 功能說明     | 狀態      |
| ---------------- | --------- | ------------------ | ------------ | --------- |
| `index.post.ts`  | POST      | `/api/surveys`     | 建立新問卷   | ✅ 已完成 |
| `index.get.ts`   | GET       | `/api/surveys`     | 問卷列表查詢 | ✅ 已完成 |
| `[id].get.ts`    | GET       | `/api/surveys/:id` | 單一問卷查詢 | 🔄 計劃中 |
| `[id].put.ts`    | PUT       | `/api/surveys/:id` | 更新問卷     | 🔄 計劃中 |
| `[id].delete.ts` | DELETE    | `/api/surveys/:id` | 刪除問卷     | 🔄 計劃中 |

## 🔧 詳細 API 說明

### 1. POST /api/surveys - 建立新問卷 ✅

**功能**：建立新的問卷記錄 **認證**：需要 JWT Token **請求體**：

```typescript
{
  title: string;           // 問卷標題（必填，1-200字）
  description?: string;    // 問卷描述（可選，最大1000字）
  type?: SurveyType;      // 問卷類型（預設：STANDARD）
  workspaceId?: string;   // 工作空間ID（可選）
  questions?: Question[]; // 初始題目列表（預設：空陣列）
}
```

**回應**：

```typescript
{
  success: true;
  data: {
    _id: string; // 問卷ID
    title: string; // 問卷標題
    description: string; // 問卷描述
    type: SurveyType; // 問卷類型
    status: SurveyStatus; // 問卷狀態（DRAFT）
    createdAt: Date; // 建立時間
  }
  message: '問卷建立成功';
}
```

**關鍵業務邏輯**：

1. **身份驗證**：驗證 JWT Token 有效性
2. **訂閱限制檢查**：
   - Free 方案：最多 3 個非歸檔問卷
   - 超過限制返回 403 錯誤
3. **預設設定初始化**：
   - 狀態：DRAFT
   - 可見性：PRIVATE
   - 外觀：預設藍色主題
   - 完成訊息：感謝文字

**效能優化**：

- 提前檢查數量限制，避免無效物件建立
- 並行查詢計數和插入操作

### 2. GET /api/surveys - 問卷列表查詢 ✅

**功能**：分頁查詢用戶的問卷列表 **認證**：需要 JWT Token **查詢參數**：

```typescript
{
  page?: number;          // 頁碼（預設：1）
  limit?: number;         // 每頁筆數（預設：20，最大：100）
  status?: string;        // 狀態篩選（逗號分隔）
  search?: string;        // 關鍵字搜尋（標題或描述）
  sort?: string;          // 排序欄位（預設：-createdAt）
}
```

**回應**：

```typescript
{
  success: true;
  data: Array<{
    _id: string;
    title: string;
    description: string;
    type: SurveyType;
    status: SurveyStatus;
    questionCount: number; // 題目數量
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
    total: number; // 總筆數
    totalPages: number; // 總頁數
    hasMore: boolean; // 是否有更多資料
  }
}
```

**查詢特性**：

1. **安全性**：只能查詢自己的問卷（ownerId 過濾）
2. **高效篩選**：
   - 狀態篩選：支援多選（如：`draft,published`）
   - 關鍵字搜尋：標題和描述的正規表達式匹配
   - 靈活排序：支援多欄位（createdAt, updatedAt, title, status）
3. **效能優化**：
   - 平行執行資料查詢和計數查詢
   - 欄位投影：只回傳前端需要的欄位
   - 聚合計算：用 `$size` 計算題目數量

### 3. GET /api/surveys/:id - 單一問卷查詢 🔄

**功能**：查詢特定問卷的完整資訊 **認證**：需要 JWT Token **路徑參數**：

```typescript
{
  id: string; // 問卷 ID
}
```

**回應**：完整的 Survey 物件 **業務邏輯**：

1. 驗證問卷存在性
2. 檢查用戶權限（ownerId 或共用權限）
3. 回傳完整問卷資料（包含完整題目列表）

### 4. PUT /api/surveys/:id - 更新問卷 🔄

**功能**：更新問卷資訊（部分更新） **認證**：需要 JWT Token
**請求體**：Survey 物件的部分欄位 **業務邏輯**：

1. 驗證問卷存在性和權限
2. 檢查狀態變更是否合法
3. 更新指定欄位
4. 記錄更新時間

### 5. DELETE /api/surveys/:id - 刪除問卷 🔄

**功能**：軟刪除問卷（設為 ARCHIVED 狀態） **認證**：需要 JWT Token
**業務邏輯**：

1. 檢查用戶權限
2. 設定狀態為 ARCHIVED
3. 同時歸檔相關回應資料

## 🔐 權限與安全

### 資料隔離

```typescript
// 每個 API 都包含的基本權限檢查
const filter = {
  ownerId: user.userId, // 強制用戶只能操作自己的資料
};
```

### 輸入驗證

```typescript
// 使用 Zod Schema 進行嚴格驗證
const createSurveyRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  // ... 其他欄位驗證
});
```

### 業務規則驗證

- **訂閱方案限制**：動態檢查用戶當前方案的問卷數量限制
- **狀態變更規則**：只允許合法的狀態轉換
- **權限檢查**：確保用戶只能操作自己的問卷

## 📊 資料結構設計

### Survey Collection Schema

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
  publishSettings: PublishSettings;
  appearance: AppearanceSettings;
  stats: SurveyStats;
  completionMessage: string;
  settings: SurveySettings;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
```

### 索引設計

```javascript
// 問卷 collection 索引
db.surveys.createIndex({ ownerId: 1, status: 1 }); // 用戶問卷列表查詢
db.surveys.createIndex({ ownerId: 1, createdAt: -1 }); // 時間排序查詢
db.surveys.createIndex({ status: 1, publishedAt: -1 }); // 公開問卷查詢
```

## 🚀 效能優化策略

### 查詢優化

1. **複合索引**：針對常見查詢組合建立複合索引
2. **欄位投影**：列表查詢只回傳必要欄位
3. **聚合管道**：使用 MongoDB 聚合減少網路傳輸
4. **平行查詢**：同時執行資料和計數查詢

### 快取策略（Phase 2）

```typescript
// Redis 快取設計
{
  `survey:${surveyId}`: "問卷完整資料快取",
  `survey:list:${userId}:${hash}`: "問卷列表快取",
  `survey:stats:${surveyId}`: "問卷統計快取",
}
```

## 📈 監控與分析

### 關鍵指標

- **API 回應時間**：目標 < 200ms
- **問卷建立成功率**：目標 > 99%
- **查詢準確性**：確保權限過濾正確
- **並發處理能力**：支援同時多用戶操作

### 錯誤監控

- **403 錯誤**：訂閱限制觸發頻率
- **500 錯誤**：伺服器錯誤追蹤
- **查詢效能**：慢查詢監控

## 🧪 測試策略

### 業務邏輯測試

- [ ] 訂閱方案限制檢查
- [ ] 問卷 CRUD 操作完整性
- [ ] 權限隔離驗證
- [ ] 查詢篩選邏輯驗證

### 效能測試

- [ ] 大量問卷列表查詢效能
- [ ] 並發建立問卷壓力測試
- [ ] 複雜篩選查詢效能
- [ ] 資料庫索引效果驗證

### 安全測試

- [ ] 跨用戶資料存取防護
- [ ] SQL/NoSQL 注入防護
- [ ] 輸入驗證完整性
- [ ] 權限提升攻擊防護

## 📝 Phase 2 擴展功能

### 高級查詢功能

- [ ] 全文搜尋整合
- [ ] 進階篩選器（日期範圍、標籤）
- [ ] 問卷範本功能
- [ ] 批量操作 API

### 協作功能

- [ ] 問卷共享和權限管理
- [ ] 協作編輯衝突解決
- [ ] 評論和審核系統
- [ ] 版本控制和歷史記錄

### 分析功能

- [ ] 問卷使用統計
- [ ] 用戶行為分析
- [ ] 效能分析儀表板
- [ ] 自動化報告生成

---

**最後更新者**：Claude AI Assistant **下次檢查**：完成剩餘 CRUD API 實作時
