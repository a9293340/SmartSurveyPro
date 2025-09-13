# @survey/shared - 共享基礎包 🔧

> 📅 最後更新：2025-01-13
> 🎯 用途：提供跨專案共享的類型、驗證、常數和工具
> 📦 套件名稱：@survey/shared
> 🚀 開發階段：Phase 1 (進行中)

---

## 📋 功能概述

這個套件提供 SmartSurvey Pro 專案中所有應用和服務共享的基礎程式碼，包括：
- **TypeScript 類型定義**：確保類型一致性
- **Zod 驗證模式**：資料驗證規則
- **共用常數**：系統常數和配置
- **工具函數**：通用輔助函數

---

## 📁 目錄結構

```
src/
├── types/                 # TypeScript 類型定義
│   ├── survey.ts         # 問卷相關類型
│   ├── question.ts       # 題目相關類型
│   ├── response.ts       # 回應相關類型
│   ├── user.ts          # 用戶相關類型
│   ├── team.ts          # 團隊相關類型
│   ├── analytics.ts     # 分析相關類型
│   └── index.ts         # 統一匯出
│
├── schemas/              # Zod 驗證模式
│   ├── survey.schema.ts # 問卷驗證
│   ├── question.schema.ts # 題目驗證
│   ├── response.schema.ts # 回應驗證
│   ├── user.schema.ts   # 用戶驗證
│   └── index.ts         # 統一匯出
│
├── constants/            # 共用常數
│   ├── question-types.ts # 題型定義
│   ├── plans.ts         # 訂閱方案
│   ├── limits.ts        # 系統限制
│   ├── errors.ts        # 錯誤碼
│   ├── status.ts        # 狀態定義
│   └── index.ts         # 統一匯出
│
├── utils/                # 工具函數
│   ├── validation.ts    # 驗證工具
│   ├── format.ts        # 格式化工具
│   ├── date.ts          # 日期處理
│   ├── crypto.ts        # 加密工具
│   ├── helpers.ts       # 通用輔助函數
│   └── index.ts         # 統一匯出
│
└── index.ts             # 套件主入口
```

---

## 🚀 使用指南

### 安裝與引用

```typescript
// 在其他套件的 package.json 中添加依賴
{
  "dependencies": {
    "@survey/shared": "workspace:*"
  }
}
```

### 引用類型

```typescript
// 引用類型定義
import { Survey, Question, Response } from '@survey/shared/types'

// 使用類型
const survey: Survey = {
  id: 'survey_123',
  title: '客戶滿意度調查',
  questions: [],
  status: 'draft'
}
```

### 使用驗證模式

```typescript
import { SurveySchema, QuestionSchema } from '@survey/shared/schemas'
import { z } from 'zod'

// 驗證資料
try {
  const validatedSurvey = SurveySchema.parse(surveyData)
  console.log('驗證成功', validatedSurvey)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('驗證失敗', error.errors)
  }
}
```

### 使用常數

```typescript
import { QuestionTypes, Plans, ErrorCodes } from '@survey/shared/constants'

// 使用題型常數
const questionType = QuestionTypes.SINGLE_CHOICE

// 使用訂閱方案常數
const currentPlan = Plans.PRO

// 使用錯誤碼
throw new Error(ErrorCodes.SURVEY_NOT_FOUND)
```

### 使用工具函數

```typescript
import { formatDate, validateEmail, generateId } from '@survey/shared/utils'

// 格式化日期
const formatted = formatDate(new Date(), 'YYYY-MM-DD')

// 驗證 Email
if (validateEmail(email)) {
  console.log('Email 格式正確')
}

// 生成 ID
const newId = generateId('survey')
```

---

## 📝 API 文件

### Types (類型定義)

#### Survey
```typescript
interface Survey {
  id: string
  title: string
  description?: string
  questions: Question[]
  status: 'draft' | 'published' | 'closed' | 'archived'
  createdBy: string
  createdAt: Date
  updatedAt: Date
  // ... 更多欄位
}
```

#### Question
```typescript
interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: Option[]
  validation?: ValidationRule
  logic?: LogicRule[]
  // ... 更多欄位
}
```

### Schemas (驗證模式)

所有驗證模式都是基於 Zod 建立：

```typescript
const SurveySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  questions: z.array(QuestionSchema),
  // ... 更多規則
})
```

### Constants (常數定義)

```typescript
// 題型定義
export const QuestionTypes = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  TEXT_SHORT: 'text_short',
  TEXT_LONG: 'text_long',
  // ... 更多題型
} as const

// 訂閱方案
export const Plans = {
  FREE: { name: 'free', surveyLimit: 3, responseLimit: 100 },
  PRO: { name: 'pro', surveyLimit: -1, responseLimit: 10000 },
  // ... 更多方案
} as const
```

### Utils (工具函數)

```typescript
// 日期格式化
formatDate(date: Date, format: string): string

// Email 驗證
validateEmail(email: string): boolean

// ID 生成
generateId(prefix?: string): string

// 深度複製
deepClone<T>(obj: T): T

// 防抖函數
debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T
```

---

## 🧪 測試

```bash
# 運行測試
pnpm test

# 測試覆蓋率
pnpm test:coverage

# 監聽模式
pnpm test:watch
```

---

## 🔄 版本管理

### 版本號規則
- **Major (x.0.0)**：不相容的 API 變更
- **Minor (0.x.0)**：向後相容的功能新增
- **Patch (0.0.x)**：向後相容的錯誤修復

### 發布流程
```bash
# 1. 更新版本
pnpm version patch/minor/major

# 2. 執行測試
pnpm test

# 3. 建構
pnpm build

# 4. 提交
git add .
git commit -m "chore: release @survey/shared v1.0.0"
```

---

## 💡 開發規範

### 類型定義原則
1. **完整性**：所有欄位都要有類型
2. **可選性**：正確標記可選欄位
3. **聯合類型**：使用 union types 而非 enum
4. **註解**：複雜類型需要加註解

### 工具函數原則
1. **純函數**：避免副作用
2. **單一職責**：一個函數只做一件事
3. **錯誤處理**：適當的錯誤處理
4. **測試覆蓋**：每個函數都要有測試

### 命名規範
- 類型：PascalCase (e.g., `Survey`, `QuestionType`)
- 常數：UPPER_SNAKE_CASE (e.g., `MAX_QUESTIONS`)
- 函數：camelCase (e.g., `validateEmail`)
- 檔案：kebab-case (e.g., `question-types.ts`)

---

## 🔗 相關資源

- [TypeScript 文件](https://www.typescriptlang.org/)
- [Zod 文件](https://zod.dev/)
- [專案整體架構](../../docs/monorepo-architecture.md)

---

## 📋 待辦事項

- [ ] 完成所有基礎類型定義
- [ ] 實作 Zod 驗證模式
- [ ] 新增更多工具函數
- [ ] 撰寫單元測試
- [ ] 建立 API 文件生成器

---

*@survey/shared 是整個專案的基礎，請確保所有變更都經過充分測試*