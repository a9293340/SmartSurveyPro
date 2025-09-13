# Packages - 共享套件目錄 📦

> 📅 最後更新：2025-01-13 🎯 用途：存放跨應用共享的程式碼包 🔧 管理方式：PNPM
> Workspace

---

## 📁 目錄結構

```
packages/
├── shared/       # 共享類型和工具 [Phase 1] ✅
├── ui/          # UI 組件庫 [Phase 2] 📅
└── core/        # 核心業務邏輯 [Phase 2] 📅
```

---

## 📦 套件說明

### 🔧 shared - 共享基礎包

**用途**：跨專案共享的類型定義、常數、工具函數 **開發階段**：Phase 1 (進行中)
**引用方式**：`@survey/shared`

**包含內容**：

```typescript
// 類型定義
types/
  ├── survey.ts      # 問卷相關類型
  ├── user.ts        # 用戶相關類型
  ├── response.ts    # 回應相關類型
  └── index.ts       # 統一匯出

// 驗證模式
schemas/
  ├── survey.schema.ts
  ├── user.schema.ts
  └── validation.ts

// 共用常數
constants/
  ├── question-types.ts
  ├── limits.ts
  └── errors.ts

// 工具函數
utils/
  ├── format.ts
  ├── validation.ts
  └── helpers.ts
```

### 🎨 ui - UI 組件庫

**用途**：可重用的 Vue 組件庫 **開發階段**：Phase 2 (計劃中)
**引用方式**：`@survey/ui`

**計劃包含**：

- 基礎組件（Button、Input、Modal）
- 表單組件（Form、Field、Validation）
- 數據展示（Table、Chart、Card）
- 佈局組件（Layout、Grid、Container）

### 💼 core - 核心業務邏輯

**用途**：業務邏輯、算法、資料處理 **開發階段**：Phase 2 (計劃中)
**引用方式**：`@survey/core`

**計劃包含**：

- 問卷引擎（Builder、Validator、Logic）
- 分析引擎（Statistics、Reports）
- 資料處理（Transform、Export、Import）

---

## 🚀 開發指引

### 建立新套件

```bash
# 1. 建立套件目錄
mkdir packages/new-package
cd packages/new-package

# 2. 初始化 package.json
pnpm init

# 3. 設定套件名稱（必須使用 @survey/ 前綴）
# package.json
{
  "name": "@survey/new-package",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}

# 4. 建立基礎結構
mkdir src
echo 'export {}' > src/index.ts
```

### 在應用中使用套件

```typescript
// 在 apps/web 中使用
import { Survey, Question } from '@survey/shared/types';
import { validateEmail } from '@survey/shared/utils';
import { Button } from '@survey/ui';
import { SurveyEngine } from '@survey/core';
```

### 套件依賴管理

```json
// apps/web/package.json
{
  "dependencies": {
    "@survey/shared": "workspace:*",
    "@survey/ui": "workspace:*",
    "@survey/core": "workspace:*"
  }
}
```

---

## 📋 開發規範

### 套件設計原則

1. **單一職責**：每個套件專注於一個領域
2. **零副作用**：純函數和類型定義，避免全局修改
3. **Tree-shaking 友好**：使用 ES Modules 匯出
4. **完整類型**：所有匯出都要有 TypeScript 類型

### 檔案組織結構

```
package-name/
├── src/
│   ├── index.ts        # 主入口，統一匯出
│   ├── types.ts        # 類型定義
│   └── [功能模組]/     # 功能分組
├── tests/              # 單元測試
├── README.md           # 套件說明
├── package.json        # 套件配置
└── tsconfig.json       # TypeScript 配置
```

### 版本發布流程

```bash
# 1. 更新版本號
pnpm version patch/minor/major

# 2. 建構套件
pnpm build

# 3. 運行測試
pnpm test

# 4. 提交變更
git add .
git commit -m "chore: release @survey/package-name v1.0.0"
```

---

## 🧪 測試要求

每個套件都應該有對應的測試：

```typescript
// tests/example.test.ts
import { describe, it, expect } from 'vitest';
import { someFunction } from '../src';

describe('someFunction', () => {
  it('should work correctly', () => {
    expect(someFunction()).toBe(expected);
  });
});
```

測試覆蓋率目標：

- 工具函數：>= 90%
- 業務邏輯：>= 80%
- UI 組件：>= 70%

---

## 📝 文件要求

每個套件必須包含：

1. **README.md**：套件說明和使用指南
2. **CHANGELOG.md**：版本更新記錄
3. **API 文件**：所有公開 API 的說明
4. **範例程式碼**：使用範例

---

## 🔗 相關文件

- [Shared 套件文件](./shared/README.md)
- [UI 套件文件](./ui/README.md)
- [Core 套件文件](./core/README.md)
- [TypeScript 配置](../tsconfig.json)

---

## 💡 最佳實踐

1. **避免循環依賴**：套件間保持單向依賴
2. **最小化依賴**：只安裝必要的第三方套件
3. **保持向後相容**：遵循語意化版本控制
4. **充分測試**：每次修改都要運行測試
5. **文件同步**：API 變更必須更新文件

---

_此目錄包含所有可重用的共享程式碼包_
