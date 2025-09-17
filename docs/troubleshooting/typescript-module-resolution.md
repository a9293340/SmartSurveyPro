# TypeScript 模組解析與類型定義問題解決指南

> 📅 建立日期：2025-01-17
> 🎯 目的：記錄 Monorepo 中 TypeScript 類型定義問題的根本解決方案 📋 狀態：✅ 已解決

---

## 🚨 問題描述

### 錯誤現象

```typescript
// IDE 和建構時出現的錯誤
找不到模組 '@smartsurvey/shared' 的宣告檔案。
'/home/erichong/SmartSurveyPro/packages/shared/dist/index.js' 隱含具有 'any' 類型。
如有 `npm i --save-dev @types/smartsurvey__shared`，請嘗試使用，
或新增包含 `declare module '@smartsurvey/shared';` 的宣告 (.d.ts) 檔案ts(7016)
```

### 問題影響

1. **開發體驗差**：IDE 無法提供類型提示和自動完成
2. **建構失敗**：TypeScript 編譯時報錯
3. **類型安全性喪失**：強制使用 `any` 類型，失去 TypeScript 優勢
4. **維護困難**：後續擴充 shared package 會持續遇到同樣問題

---

## 🔍 根本原因分析

### 1. tsup 配置錯誤

**錯誤配置**：

```typescript
// packages/config/tsup/package.ts
export const packageConfig = createBaseConfig({
  entry: ['src/index.ts'],
  dts: false, // ❌ 關鍵錯誤：沒有生成類型定義檔案
});
```

**結果**：只生成 `.js` 和 `.js.map`，沒有 `.d.ts` 檔案

### 2. TypeScript 配置衝突

**衝突配置**：

```json
// packages/config/tsconfig/base.json
{
  "compilerOptions": {
    "incremental": true // ❌ 與 tsup DTS 生成衝突
  }
}
```

**結果**：即使啟用 `dts: true`，仍然無法正確生成類型定義

### 3. 建構流程複雜化

**錯誤流程**：

```json
// packages/shared/package.json
{
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly" // ❌ 雙重建構，容易出錯
  }
}
```

**結果**：建構步驟複雜，容易在某個環節失敗

---

## ✅ 完整解決方案

### 1. 修復 tsup 配置

```typescript
// packages/config/tsup/package.ts
export const packageConfig = createBaseConfig({
  entry: ['src/index.ts'],
  dts: true, // ✅ 啟用 TypeScript 類型定義生成
  format: ['esm'],
  sourcemap: true,
});
```

### 2. 修復 TypeScript 基礎配置

```json
// packages/config/tsconfig/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    // "incremental": true, // ✅ 移除衝突選項
    "lib": ["ES2022"],
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 3. 簡化建構流程

```json
// packages/shared/package.json
{
  "scripts": {
    "build": "tsup", // ✅ 單一命令，一次性生成 JS 和 DTS
    "clean": "rm -rf dist *.tsbuildinfo"
  }
}
```

### 4. 確保 package.json 配置正確

```json
// packages/shared/package.json
{
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts", // ✅ 關鍵：指向類型定義檔案
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts" // ✅ ESM 環境下的類型定義
    }
  }
}
```

---

## 🎯 驗證解決方案

### 1. 檢查生成的檔案

```bash
cd packages/shared
pnpm clean && pnpm build

# 應該看到以下檔案
ls -la dist/
# ✅ index.js
# ✅ index.js.map
# ✅ index.d.ts    <- 關鍵檔案
```

### 2. 測試類型支援

```typescript
// 在其他套件中測試
import { connectToDatabase } from '@smartsurvey/shared'; // ✅ 不應該有類型錯誤

const db = await connectToDatabase(); // ✅ IDE 應該提供類型提示
```

### 3. 建構測試

```bash
# 整個專案應該能成功建構
pnpm run build
# ✅ 不應該有 TypeScript 錯誤
```

---

## 🚫 避免的錯誤做法

### 1. 使用 @ts-ignore 繞過問題

```typescript
// ❌ 錯誤做法：治標不治本
// @ts-ignore
import { connectToDatabase } from '@smartsurvey/shared';
```

**為什麼錯誤**：

- 失去類型安全性
- 隱藏真正問題
- 後續擴充會持續遇到同樣問題

### 2. 手動創建類型定義檔案

```typescript
// ❌ 錯誤做法：手動維護
declare module '@smartsurvey/shared' {
  export function connectToDatabase(): Promise<any>;
}
```

**為什麼錯誤**：

- 需要手動同步更新
- 容易遺漏或錯誤
- 無法享受自動生成的便利

### 3. 強制類型轉換

```typescript
// ❌ 錯誤做法：掩蓋問題
const db = (await connectToDatabase()) as any;
```

**為什麼錯誤**：

- 失去類型檢查
- 運行時可能出錯
- 開發體驗差

---

## 📋 預防檢查清單

### 新建 Package 時

- [ ] 確認 tsup 配置中 `dts: true`
- [ ] 確認 package.json 中 `types` 欄位正確
- [ ] 確認建構後有 `.d.ts` 檔案生成
- [ ] 測試其他套件是否能正確引入

### 修改現有 Package 時

- [ ] 修改後重新建構
- [ ] 檢查 `.d.ts` 檔案是否更新
- [ ] 測試依賴此套件的專案是否正常

### 建構失敗時

- [ ] 檢查是否有 TypeScript 配置衝突
- [ ] 確認 tsup 和 tsc 版本相容性
- [ ] 查看建構日誌中的具體錯誤訊息

---

## 🔧 相關配置檔案

### 主要配置檔案

```
packages/
├── config/
│   └── tsup/
│       ├── base.ts           # tsup 基礎配置
│       └── package.ts        # 套件專用配置
├── shared/
│   ├── package.json          # 套件定義
│   ├── tsconfig.json         # TypeScript 配置
│   └── tsup.config.ts        # 建構配置
```

### 關鍵配置要點

1. **tsup 配置**：必須啟用 `dts: true`
2. **package.json**：`types` 欄位必須指向正確路徑
3. **tsconfig.json**：避免與 tsup 衝突的選項
4. **建構命令**：使用單一 `tsup` 命令

---

## 📝 經驗總結

### 關鍵學習

1. **根本解決 vs 臨時繞過**：
   - 花時間解決根本問題，避免技術債務累積
   - 繞過問題只會讓問題變得更複雜

2. **工具配置的重要性**：
   - 正確的工具配置是專案成功的基礎
   - 配置錯誤會影響整個開發流程

3. **類型定義的價值**：
   - TypeScript 的類型安全是重要資產
   - 不應該輕易妥協或繞過

### 團隊協作

1. **文檔化問題**：重要問題必須記錄，避免重複踩坑
2. **配置標準化**：建立統一的配置模板和檢查流程
3. **知識分享**：技術問題解決後要及時分享給團隊

---

## 🔗 相關資源

- [tsup 官方文檔](https://tsup.egoist.dev/)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Monorepo TypeScript 最佳實踐](https://turbo.build/repo/docs/handbook/linting/typescript)

---

_記錄這個問題的解決過程，是為了讓團隊能夠更快地識別和解決類似問題，提升整體開發效率。_
