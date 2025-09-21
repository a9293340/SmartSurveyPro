# 開發故障排除指南

> 📅 建立日期：2025-01-20
> 🎯 用途：記錄開發過程中遇到的重大技術問題與解決方案 👥 維護者：開發團隊

---

## 概述

本文件收集開發過程中遇到的棘手技術問題及其突破性解決方案，作為未來遇到類似問題時的參考依據。每個問題都包含完整的症狀描述、根源分析、解決步驟和預防措施。

---

## 🔴 重大問題記錄

### 1. TypeScript 模組解析不一致問題 (2025-01-20)

> **🔄 更新 (2025-09-21)**: **已完全移除 tsup 依賴**
> 經過深入分析，tsup 的模組打包機制是導致模組解析問題的根本原因。我們已將 shared 套件完全遷移至純 tsc 建構，徹底解決了模組解析不一致的問題。相關配置和解決方案已不再適用。

#### 問題描述

**症狀**：

- `pnpm dev` 顯示 68 個 TypeScript 錯誤
- `pnpm type-check` 顯示 0 個錯誤
- 錯誤主要關於 `@smartsurvey/shared` 包中的類型無法解析

**典型錯誤訊息**：

```
Cannot find module '@smartsurvey/shared' or its corresponding type declarations
Type 'Survey' is not assignable to type 'Survey'
Property 'Question' does not exist on type...
```

**環境信息**：

- Nuxt 4.1.2
- TypeScript 5.9.2
- Monorepo 結構 (pnpm workspace)
- tsup 8.5.0 作為共享包建構工具

#### 根源分析

**核心問題**：Nuxt 開發環境與獨立 TypeScript 檢查使用不同的模組解析策略

1. **tsup DTS 束包問題**：
   - tsup 將 TypeScript 宣告檔案進行束包
   - 產生類型別名：`p as Question`, `f as Survey`
   - 導致類型名稱在不同檢查環境中不一致

2. **Nuxt 路徑映射缺失**：
   - Nuxt 自動生成的 tsconfig 缺少 workspace 包路徑映射
   - 開發環境無法正確解析 monorepo 包

3. **建構策略不當**：
   - 開發模式下缺少 TypeScript 宣告檔案生成
   - 僅依賴 tsup 的 DTS 輸出

#### 解決方案

**步驟一：修正 tsup 配置**

_檔案_：`packages/shared/tsup.config.ts`

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  target: 'es2022',
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  splitting: false, // 禁用代碼分割，避免 chunk 檔案
  dts: false, // 🔑 關鍵：禁用 tsup DTS 生成
  external: ['mongodb', 'redis', 'crypto', 'util', 'fs', 'path'],
});
```

**步驟二：建立混合建構策略**

_檔案_：`packages/shared/package.json`

```json
{
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly --declaration --outDir dist",
    "dev": "tsup --watch & tsc --emitDeclarationOnly --declaration --outDir dist --watch & wait"
  }
}
```

**步驟三：配置 Nuxt TypeScript 路徑映射**

_檔案_：`apps/web/nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          '@smartsurvey/shared': ['../../packages/shared/dist/index.d.ts'],
          '@smartsurvey/shared/*': ['../../packages/shared/dist/*'],
          '@smartsurvey/shared/server': [
            '../../packages/shared/dist/server.d.ts',
          ],
        },
      },
    },
  },
  // ... 其他配置
});
```

**步驟四：修正類型導入順序**

_檔案_：`packages/shared/src/types/survey.ts`

```typescript
// 將相依型別的 import 移到檔案頂部
import type { EntityId } from './common';
import type { Question } from './question'; // 移到最前面

// ... 其他型別定義
```

**步驟五：完善 server.ts 導出**

_檔案_：`packages/shared/src/server.ts`

```typescript
// 確保所有需要的型別都有導出
export type * from './types/survey';
export type * from './types/question';
export type * from './types/common';
// ... 完整的型別導出列表
```

#### 驗證步驟

1. **清理並重建**：

   ```bash
   cd packages/shared
   pnpm clean && pnpm build
   ```

2. **清理 Nuxt 快取**：

   ```bash
   cd apps/web
   rm -rf .nuxt node_modules/.cache
   ```

3. **重啟開發伺服器**：

   ```bash
   pnpm dev
   ```

4. **等待 10 秒確認無錯誤**：
   - TypeScript 錯誤應從 68 個降至 0 個
   - `pnpm type-check` 應保持 0 錯誤

#### 關鍵洞察

`★ Insight ─────────────────────────────────────`

- **tsup 束包機制**：束包工具可能改變型別名稱，導致不同環境間類型不一致
- **混合建構策略**：JavaScript 使用高效的 tsup，TypeScript 宣告使用原生 tsc 確保準確性
- **Nuxt 模組解析**：開發環境需明確配置 monorepo 包的路徑映射才能正確解析
  `─────────────────────────────────────────────────`

#### 預防措施

1. **定期驗證**：每次修改 tsup 或 TypeScript 配置後都要執行完整驗證
2. **自動化檢查**：在 CI/CD 中同時運行 `pnpm dev` 建構檢查和 `pnpm type-check`
3. **文件同步**：配置變更必須同步更新相關文件

#### 相關提交記錄

- **Commit b168c36**: `fix: 修復 Survey 類型導入順序與 server.ts 導出`
- **Commit 95b661d**: `fix: 修復 TypeScript 模組解析問題 - tsup 配置優化`
- **Commit ddd830b**: `fix: 新增 Nuxt TypeScript 模組解析配置`
- **Commit d440ac5**: `refactor: 遷移至 Nuxt 4 標準目錄結構`

### 2. Nuxt Icon 401 遠程API錯誤問題 (2025-09-21)

#### 問題描述

**症狀**：

- 瀏覽器控制台出現 401 錯誤：`GET /api/_nuxt_icon/heroicons.json?icons=star 401 (Unauthorized)`
- Icon 組件可能無法正常顯示，特別是 `heroicons:star` 等圖示
- 錯誤通常出現在使用評分組件等包含星星圖示的功能中

**典型錯誤訊息**：

```
GET http://localhost:3000/api/_nuxt_icon/heroicons.json?icons=star 401 (Unauthorized)
```

**環境信息**：

- Nuxt 4.1.2
- @nuxt/icon 2.0.0
- 開發環境 (localhost:3000)

#### 根源分析

**核心問題**：@nuxt/icon
2.x 默認啟用遠程圖示獲取機制，嘗試從 API 端點動態載入圖示

1. **遠程獲取機制**：
   - Nuxt Icon 會嘗試從 `/api/_nuxt_icon/` 端點動態獲取圖示
   - 開發環境中這個端點可能沒有正確的認證配置
   - 導致 401 Unauthorized 錯誤

2. **配置不完整**：
   - 只設定 `serverBundle.collections` 不足以完全本地化圖示處理
   - 缺少 `remote: false` 配置禁用遠程獲取
   - 客戶端 bundle 配置缺失

#### 解決方案

**步驟一：完善 Nuxt Icon 配置**

_檔案_：`apps/web/nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  // ... 其他配置

  // Nuxt Icon 配置
  icon: {
    serverBundle: {
      collections: ['heroicons'], // 明確指定使用的圖示集合
      remote: false, // 🔑 關鍵：禁用遠程圖示獲取，只使用本地預載的圖示
    },
    // 增加客戶端配置
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  // ... 其他配置
});
```

**步驟二：重建 shared 套件 (如果有依賴)**

```bash
pnpm --filter @smartsurvey/shared build
```

**步驟三：重新啟動開發伺服器**

```bash
# 清理快取並重啟
rm -rf apps/web/.nuxt
pnpm --filter @smartsurvey/web dev
```

#### 驗證步驟

1. **確認圖示 bundle 載入**：開發伺服器啟動時應看到：

   ```
   ℹ Nuxt Icon client bundle consist of 45 icons with 17.01KB(uncompressed) in size
   ```

2. **測試圖示顯示**：
   - 訪問包含圖示的頁面 (如 `/test-survey`)
   - 確認星星評分組件正常顯示
   - 瀏覽器控制台不應有 401 錯誤

3. **HTTP 狀態檢查**：
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/test-survey
   # 應返回 200
   ```

#### 關鍵洞察

`★ Insight ─────────────────────────────────────`

- **本地優先策略**：現代 Icon 系統應優先使用本地 bundle 而非遠程 API，既提升性能又避免認證問題
- **配置完整性**：`remote: false`
  是關鍵配置，單純設定 collections 並不會禁用遠程獲取
- **客戶端 bundle**：適當配置客戶端 bundle 能確保圖示正確預載和渲染
  `─────────────────────────────────────────────────`

#### 預防措施

1. **優先本地配置**：新專案一開始就配置 `remote: false`
2. **監控 bundle 大小**：定期檢查圖示 bundle 大小，避免過度膨脹
3. **測試覆蓋**：包含圖示的組件都應有基本的渲染測試

#### 相關提交記錄

- **Commit [Hash]**:
  `fix: 修復 Nuxt Icon 401 錯誤 - 禁用遠程獲取並配置本地 bundle`

---

## 📋 問題分類索引

### TypeScript 相關

- [TypeScript 模組解析不一致問題](#1-typescript-模組解析不一致問題-2025-01-20)
  (已解決)

### 建構工具相關

- [tsup DTS 束包問題](#1-typescript-模組解析不一致問題-2025-01-20) (已解決)

### Nuxt/框架相關

- [Nuxt 4 模組路徑映射問題](#1-typescript-模組解析不一致問題-2025-01-20)
  (已解決)
- [Nuxt Icon 401 遠程API錯誤問題](#2-nuxt-icon-401-遠程api錯誤問題-2025-09-21)
  (已解決)

### 前端組件相關

- [Nuxt Icon 401 遠程API錯誤問題](#2-nuxt-icon-401-遠程api錯誤問題-2025-09-21)
  (已解決)

---

## 🔧 通用除錯指南

### TypeScript 問題除錯步驟

1. **確認環境一致性**：

   ```bash
   pnpm type-check  # 獨立 TypeScript 檢查
   pnpm dev         # 框架整合檢查
   ```

2. **檢查模組解析**：

   ```bash
   npx tsc --showConfig  # 顯示完整 TypeScript 配置
   ```

3. **清理快取**：
   ```bash
   rm -rf .nuxt node_modules/.cache dist *.tsbuildinfo
   pnpm install
   ```

### Monorepo 問題除錯步驟

1. **驗證 workspace 配置**：

   ```bash
   pnpm list --depth=0  # 檢查 workspace 包是否正確連結
   ```

2. **檢查路徑映射**：
   - 檢查 `tsconfig.json` 的 `paths` 配置
   - 驗證相對路徑是否正確

3. **確認依賴建構**：
   ```bash
   pnpm --filter @smartsurvey/shared build
   ```

---

## 📚 參考資源

### 官方文件

- [Nuxt TypeScript 配置指南](https://nuxt.com/docs/guide/concepts/typescript)
- [tsup 配置參考](https://tsup.egoist.dev/)
- [pnpm Workspace 文件](https://pnpm.io/workspaces)

### 相關問題追蹤

- [TypeScript Monorepo 最佳實踐](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Nuxt 4 遷移指南](https://nuxt.com/docs/getting-started/upgrade)

---

## 🔄 文件維護

### 新增問題記錄格式

每個新問題應包含：

1. **問題描述**：症狀、錯誤訊息、環境信息
2. **根源分析**：技術原因、影響範圍
3. **解決方案**：詳細步驟、配置變更
4. **驗證步驟**：確認修復的具體方法
5. **關鍵洞察**：技術學習點
6. **預防措施**：避免重複發生的方法
7. **相關提交**：版控記錄連結

### 更新時機

- 遇到新的重大技術問題時
- 解決方案有所改進時
- 預防措施需要補充時
- 每個月的技術回顧時

---

_本文件持續更新，記錄我們在 SmartSurvey Pro 開發過程中克服的技術挑戰_
