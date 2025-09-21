# 4. 資料收集系統

## 📊 概覽

- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: 🟨 進行中
- **預估工時**: 20h
- **實際工時**: 8h
- **進度**: 40% ████████░░░░░░░░░░░░
- **開始日期**: 2025-01-21
- **完成日期**: -

## 🔗 依賴關係

- **前置任務**: 3.問卷建構器系統
- **阻塞任務**: 無（Phase 1 最後任務）
- **相關文件**:
  - [業務邏輯規則](../../../smartsurvey-business-logic.md#資料驗證規則)
  - [API 參考](../../../smartsurvey-api-reference.md#回應與分析)
  - [資料庫結構](../../smartsurvey-db-structure.md#3-responses-collection)

## 📚 學習目標

- [ ] 掌握動態表單渲染和驗證技術
- [ ] 理解大量資料的儲存和查詢優化
- [ ] 學會進度保存和斷點續填機制
- [ ] 掌握防作弊和資料品質控制
- [ ] 理解統計計算的效能考量

## 🏗️ 任務分解

### 4.1 公開填寫頁面 [8h]

**狀態**: ⬜ **優先級**: 🔴

#### 4.1.1 問卷渲染引擎

- **預估**: 4h | **實際**: 8h
- **狀態**: ✅
- **開始**: 2025-01-21
- **完成**: 2025-01-21
- **負責**: Claude + Human

**任務說明**: 根據問卷結構動態渲染填寫表單

**學習重點**: 動態組件載入、表單狀態管理、響應式佈局

**實作完成**:

✅ **核心組件**:

- `apps/web/stores/response.ts` - 完整的 Pinia 狀態管理 store
- `apps/web/components/response/SurveyRenderer.vue` - 主要問卷渲染組件
- `apps/web/components/response/QuestionRenderer.vue` - 動態題目組件渲染器
- `apps/web/pages/test-survey.vue` - 獨立測試頁面，包含必填驗證

✅ **輸入組件**:

- `TextShortInput.vue` - 短文字輸入
- `SingleChoiceInput.vue` - 單選題組件
- `RatingInput.vue` - 評分組件
- `MultipleChoiceInput.vue` - 多選題組件

✅ **關鍵功能**:

- 動態組件載入與類型映射
- 完整的狀態管理和答案追蹤
- 必填欄位驗證和錯誤提示
- 響應式佈局和 Tailwind CSS 樣式
- TypeScript 類型安全和介面定義

✅ **技術解決方案**:

- 使用 `defineAsyncComponent` 實現動態組件載入
- Pinia store 處理全域狀態管理
- 型別斷言解決 TypeScript 聯合型別問題
- Nuxt Icon 配置解決 401 錯誤問題

#### 4.1.2 進度顯示組件

- **預估**: 2h | **實際**: 4h
- **狀態**: ✅
- **負責**: Claude + Human
- **完成時間**: 2025-01-21

**任務說明**: 顯示問卷填寫進度和預估完成時間

**實作成果**:

✅ **ProgressIndicator.vue** - 進度指示器組件

- 進度百分比計算與顯示
- 預估剩餘時間計算（基於平均作答時間）
- 完成提示與必填題目提醒
- 響應式設計適配各種屏幕

✅ **QuestionProgress.vue** - 題目進度概覽組件

- 可折疊的題目完成狀態列表
- 題目狀態指示（已完成/進行中/未開始/必填缺失）
- 快速導航功能（跳轉到未完成或必填題目）
- 題目類型標籤與視覺狀態指示

✅ **SurveyRenderer.vue** - 主渲染器整合

- 使用 `storeToRefs` 正確處理 Pinia 響應式狀態
- 整合進度組件到問卷渲染流程
- 修復 TypeScript 類型檢查錯誤
- 測試模式支援完整功能驗證

**技術重點**:

- 解決 Pinia store 響應式狀態管理問題
- 實作智能進度計算算法（考慮必填題權重）
- 預估時間計算基於實際作答行為分析
- 完整的 TypeScript 類型安全支援

#### 4.1.3 響應式佈局優化

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 確保在各種設備上都有良好的填寫體驗

### 4.2 資料驗證與儲存 [6h]

**狀態**: ⬜ **優先級**: 🔴

#### 4.2.1 前端驗證邏輯

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作即時的答案驗證和錯誤提示

**TODO(human)**:

```typescript
// apps/web/composables/useFormValidation.ts
export function useFormValidation(questions: Question[]) {
  // TODO(human): 實作驗證邏輯
  // 1. 必填欄位檢查
  // 2. 格式驗證（email, 數字等）
  // 3. 自訂驗證規則
  // 4. 即時錯誤提示

  const validateAnswer = (questionId: string, answer: any) => {
    // 你的驗證邏輯
  };

  return {
    validateAnswer,
    // ... 其他方法
  };
}
```

#### 4.2.2 回應提交 API

- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 處理問卷回應的儲存和驗證

**TODO(human)**:

```typescript
// apps/web/server/api/surveys/[id]/responses.post.ts
export default defineEventHandler(async event => {
  // TODO(human): 實作回應處理邏輯
  // 1. 驗證問卷是否存在且可填寫
  // 2. 檢查重複提交
  // 3. 驗證答案格式
  // 4. 儲存回應資料
  // 5. 更新問卷統計

  const surveyId = getRouterParam(event, 'id');
  const answers = await readBody(event);

  // 你來實作儲存邏輯
});
```

#### 4.2.3 防重複提交機制

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作防止重複提交的機制

### 4.3 進度保存功能 [4h]

**狀態**: ⬜ **優先級**: 🟡

#### 4.3.1 自動儲存機制

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 定期自動儲存使用者填寫進度

**TODO(human)**:

```typescript
// 自動儲存的設計考量
// 1. 多久儲存一次？
// 2. 如何處理網路中斷？
// 3. localStorage 和 server 的同步策略？

export function useAutoSave(surveyId: string) {
  // TODO(human): 實作自動儲存邏輯
}
```

#### 4.3.2 斷點續填功能

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 允許使用者稍後繼續填寫問卷

### 4.4 基礎統計顯示 [2h]

**狀態**: ⬜ **優先級**: 🟡

#### 4.4.1 即時統計更新

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 每次有新回應時更新問卷統計

#### 4.4.2 統計頁面組件

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 顯示基礎的回應統計資訊

## 🎨 使用者體驗設計

### 填寫體驗優化

- **載入速度**: 首屏載入 < 2 秒
- **操作回饋**: 每個操作都有即時回饋
- **錯誤處理**: 友善的錯誤訊息和修復建議
- **進度提示**: 清楚的進度指示和預估時間

### 無障礙設計

- **鍵盤導航**: 支援 Tab 鍵瀏覽
- **螢幕閱讀器**: 適當的 ARIA 標籤
- **顏色對比**: 符合 WCAG 2.1 AA 標準
- **字體大小**: 可縮放的字體設定

### 行動裝置優化

- **觸控友善**: 按鈕大小適合觸控
- **輸入體驗**: 調用正確的虛擬鍵盤
- **離線支援**: 基礎的離線填寫能力

## 📊 效能考量

### 前端效能

- **懶載入**: 長問卷分頁載入
- **虛擬捲動**: 處理大量選項的題目
- **圖片優化**: 自動壓縮和 WebP 格式
- **快取策略**: 合理使用 localStorage

### 後端效能

- **資料庫優化**: 合適的索引和查詢策略
- **批次處理**: 大量回應的批次儲存
- **快取機制**: Redis 快取熱門問卷
- **分頁查詢**: 避免一次載入大量資料

## 🛡️ 安全與防作弊

### 資料驗證

```typescript
// 多層驗證策略
const validationLayers = {
  frontend: 'Zod schema 驗證',
  backend: 'Server-side 再次驗證',
  database: 'MongoDB schema 約束',
};
```

### 防作弊機制

- **IP 限制**: 同一 IP 限制填寫次數
- **時間檢查**: 填寫時間過短視為無效
- **行為分析**: 檢測異常填寫模式
- **Captcha**: 可選的驗證碼驗證

## 🧪 測試計劃

### 功能測試

- [ ] 各種題型的正確渲染
- [ ] 答案驗證邏輯
- [ ] 進度保存和恢復
- [ ] 提交成功流程

### 效能測試

- [ ] 100+ 題目的問卷載入速度
- [ ] 並發 100 人同時填寫
- [ ] 大型檔案上傳處理

### 安全測試

- [ ] XSS 攻擊防護
- [ ] CSRF 攻擊防護
- [ ] 惡意資料注入測試

## 📋 API 端點清單

| Method | Endpoint                      | 功能         | 狀態 |
| ------ | ----------------------------- | ------------ | ---- |
| GET    | `/api/surveys/[id]/form`      | 取得填寫表單 | ⬜   |
| POST   | `/api/surveys/[id]/responses` | 提交回應     | ⬜   |
| GET    | `/api/responses/[id]`         | 取得回應詳情 | ⬜   |
| PATCH  | `/api/responses/[id]/save`    | 儲存進度     | ⬜   |
| GET    | `/api/surveys/[id]/stats`     | 基礎統計     | ⬜   |

## 💡 給 Claude 的上下文

**任務位置**: Phase 1 > 資料收集系統（最終任務）
**技術挑戰**: 動態表單渲染、大量資料處理、即時驗證
**UX 重點**: 流暢的填寫體驗、清楚的進度提示、友善的錯誤處理
**效能要求**: 快速載入、即時回應、離線支援

**相關檔案**:

- `apps/web/pages/survey/[id].vue` - 填寫頁面
- `apps/web/components/response/` - 回應相關組件
- `apps/web/server/api/surveys/[id]/responses.post.ts` - 提交 API
- `packages/shared/src/types/response.ts` - 回應類型定義

**設計參考**:

- Google Forms 的簡潔填寫體驗
- Typeform 的互動式填寫流程
- SurveyMonkey 的進度提示設計
