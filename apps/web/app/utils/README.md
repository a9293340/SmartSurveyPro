# 🛠️ Utils 目錄

> 📁 **目錄作用**：前端工具函數庫，提供可重用的通用功能
>
> 📅 **最後更新**：2025-01-21
>
> 🎯 **負責功能**：封裝常用邏輯，提高代碼重用性和開發效率

## 📋 包含檔案清單

| 檔案名稱                   | 功能說明         | 狀態      | 主要功能               |
| -------------------------- | ---------------- | --------- | ---------------------- |
| `question-type-helpers.ts` | 題型相關工具函數 | ✅ 已完成 | 圖示映射、預設配置生成 |
| _(待新增)_                 | 日期格式化工具   | ⏳ 計劃中 | 日期時間處理           |
| _(待新增)_                 | 表單驗證工具     | ⏳ 計劃中 | 輸入驗證、錯誤處理     |
| _(待新增)_                 | API 請求工具     | ⏳ 計劃中 | HTTP 請求封裝          |

## 🔍 現有工具函數詳解

### 📝 question-type-helpers.ts

**功能**：問卷題型相關的工具函數集合

```typescript
// 🎨 題型圖示映射
export function getQuestionTypeIcon(type: QuestionType): string {
  // 返回對應的 Heroicons 圖示名稱
}

// ⚙️ 預設配置生成
export function getDefaultQuestionConfig(type: QuestionType): QuestionConfig {
  // 根據題型生成預設配置
}

// 🏷️ 題型顯示名稱
export function getQuestionTypeLabel(type: QuestionType): string {
  // 返回使用者友善的題型名稱
}
```

**使用場景**：

- 🎯 題型面板顯示圖示和標籤
- 🆕 新增題目時生成預設配置
- 🎨 題目卡片顯示對應圖示

**依賴**：

- `@smartsurvey/shared` - QuestionType 類型定義
- `@heroicons/vue` - 圖示庫

## 🎯 工具函數設計原則

### 🔧 函數分類策略

1. **純函數優先**：無副作用，相同輸入總是產生相同輸出
2. **單一職責**：每個函數只負責一個特定功能
3. **類型安全**：完整的 TypeScript 類型定義
4. **可測試性**：易於編寫單元測試

### 📦 模組組織方式

```
utils/
├── question-type-helpers.ts    # 題型相關工具
├── date-helpers.ts            # 日期時間工具 (計劃中)
├── validation-helpers.ts      # 表單驗證工具 (計劃中)
├── api-helpers.ts            # API 請求工具 (計劃中)
├── format-helpers.ts         # 格式化工具 (計劃中)
└── README.md                 # 本檔案
```

### 🔄 命名規範

- **檔案命名**：`功能-helpers.ts` 格式
- **函數命名**：動詞開頭，駝峰命名法
- **常數命名**：全大寫，底線分隔
- **類型命名**：PascalCase 格式

## 🚀 開發指引

### 📝 新增工具函數流程

1. **確定功能類別**：選擇或建立適當的檔案
2. **定義函數接口**：明確輸入輸出類型
3. **實作函數邏輯**：遵循純函數原則
4. **添加類型定義**：完整的 TypeScript 支援
5. **撰寫測試用例**：確保功能正確性
6. **更新文檔**：同步更新本 README

### 🔧 工具函數模板

````typescript
/**
 * 函數功能描述
 * @param param1 參數1說明
 * @param param2 參數2說明
 * @returns 返回值說明
 * @example
 * ```typescript
 * const result = utilFunction(input1, input2);
 * console.log(result); // 預期輸出
 * ```
 */
export function utilFunction<T>(param1: string, param2: T): ReturnType {
  // 實作邏輯
  return result;
}
````

### 🧪 測試策略

1. **輸入驗證**：測試各種輸入情況
2. **邊界條件**：測試極端值和空值
3. **錯誤處理**：驗證錯誤情況的處理
4. **性能測試**：確保函數執行效率
5. **類型檢查**：驗證 TypeScript 類型正確性

## 📈 常用工具函數類型

### 🎨 UI 相關工具

```typescript
// 🎨 樣式類別生成
export function classNames(...classes: (string | undefined | false)[]): string;

// 🎯 響應式斷點檢查
export function isBreakpoint(breakpoint: 'sm' | 'md' | 'lg' | 'xl'): boolean;

// 🌈 顏色工具
export function hexToRgb(hex: string): { r: number; g: number; b: number };
```

### 📊 資料處理工具

```typescript
// 🔍 陣列工具
export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]>;

// 📏 深度複製
export function deepClone<T>(obj: T): T;

// 🔄 防抖節流
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T;
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): T;
```

### 🔗 URL 和路由工具

```typescript
// 🔗 URL 參數解析
export function parseQueryParams(url: string): Record<string, string>;

// 📝 路由生成
export function buildRoute(path: string, params: Record<string, any>): string;
```

### 📅 日期時間工具

```typescript
// 📅 日期格式化
export function formatDate(date: Date, format: string): string;

// ⏰ 相對時間
export function timeAgo(date: Date): string;

// 📆 日期計算
export function addDays(date: Date, days: number): Date;
```

## 💡 最佳實踐

### ✅ 推薦做法

```typescript
// ✅ 純函數，易於測試
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 完整的類型定義
export function formatCurrency(
  amount: number,
  currency: 'USD' | 'EUR' | 'TWD' = 'TWD'
): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ✅ 錯誤處理
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
```

### ❌ 應避免的做法

```typescript
// ❌ 有副作用，不是純函數
export function badFunction(items: Item[]): number {
  console.log('Processing items...'); // 副作用
  localStorage.setItem('lastItems', JSON.stringify(items)); // 副作用
  return items.length;
}

// ❌ 缺少類型定義
export function poorTyping(data: any): any {
  return data.someProperty;
}

// ❌ 函數職責過多
export function doEverything(input: string): any {
  // 同時處理驗證、格式化、儲存等多個職責
}
```

## 📝 更新規範

### 🔄 何時更新本 README

- ✅ 新增工具函數時：添加到檔案清單
- ✅ 修改函數功能時：更新功能說明
- ✅ 新增工具類別時：更新分類說明
- ✅ 變更使用方式時：更新使用範例
- ✅ 新增最佳實踐時：更新指引內容

### 📋 維護檢查清單

- [ ] 檔案清單是否反映所有工具函數？
- [ ] 功能說明是否準確且完整？
- [ ] 使用範例是否可執行且正確？
- [ ] 最佳實踐是否符合當前標準？
- [ ] 類型定義是否完整且正確？

## 🎓 學習資源

### 📚 相關文檔

- [TypeScript 工具類型](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [函數式程式設計](https://en.wikipedia.org/wiki/Functional_programming)
- [JavaScript 最佳實踐](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

### 🔗 專案相關

- [共享工具函數](/packages/shared/src/utils/)
- [類型定義](/packages/shared/src/types/)
- [測試指南](/docs/testing-guide.md) (計劃中)

---

**最後更新者**：Claude **下次檢查**：新增工具函數時
