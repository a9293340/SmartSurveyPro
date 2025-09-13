# 📋 配置管理指南

SmartSurvey Pro 使用統一的配置管理架構，確保全專案的配置標準化和易維護性。

## 🎯 核心原則

### 1. 配置優先順序

1. 🔍 **檢查共享配置** - 先查看 `packages/config` 是否有合適模板
2. 📏 **繼承標準配置** - 使用 `extends` 繼承基礎設定
3. ⚙️ **最小化覆蓋** - 僅覆蓋專案特定的必要設定
4. 🔄 **統一維護** - 通用修改在 config 套件中進行

### 2. 配置分類

| 配置類型                | 位置         | 適用範圍     |
| ----------------------- | ------------ | ------------ |
| `tsconfig/base.json`    | 基礎 TS 配置 | 所有專案     |
| `tsconfig/package.json` | 套件 TS 配置 | `packages/*` |
| `tsconfig/web.json`     | Web TS 配置  | `apps/web`   |
| `tsup/base.ts`          | 基礎建構配置 | 所有套件     |
| `tsup/package.ts`       | 套件建構配置 | `packages/*` |

## 📝 使用範例

### TypeScript 配置

#### 新建套件 (packages/\*)

```json
{
  "extends": "../config/tsconfig/package.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"]
}
```

#### Web 應用 (apps/web)

```json
{
  "extends": "../../packages/config/tsconfig/web.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"]
    }
  }
}
```

### 建構配置

#### 標準套件

```ts
// tsup.config.ts
import { packageConfig } from '../config/tsup/package.js';

export default packageConfig;
```

#### 自訂需求

```ts
import { createBaseConfig } from '../config/tsup/base.js';

export default createBaseConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  dts: true,
  external: ['react', 'react-dom'],
});
```

## 🚀 快速開始

### 建立新套件

1. **建立目錄**: `packages/your-package/`
2. **複製配置**:

   ```bash
   # tsconfig.json
   cp packages/shared/tsconfig.json packages/your-package/

   # tsup.config.ts
   cp packages/shared/tsup.config.ts packages/your-package/
   ```

3. **調整路徑**: 確認相對路徑正確
4. **測試建構**: `pnpm turbo build --filter=your-package`

### 建立新應用

1. **建立目錄**: `apps/your-app/`
2. **使用 web 配置**: `extends: "../../packages/config/tsconfig/web.json"`
3. **設定路徑別名**: 在 compilerOptions.paths 中定義
4. **配置建構**: 根據需求選擇合適的 tsup 配置

## 🔧 維護指南

### 修改共享配置

1. **評估影響**: 確認修改不會破壞現有專案
2. **更新模板**: 在 `packages/config` 中修改
3. **測試驗證**: 執行 `pnpm turbo build` 確認所有專案正常
4. **更新文件**: 同步更新使用說明

### 新增配置模板

1. **確認需求**: 至少 2+ 專案會使用
2. **建立模板**: 在對應分類下新增檔案
3. **更新 exports**: 在 config/package.json 中新增匯出
4. **撰寫說明**: 更新 config/README.md

## ❓ 常見問題

**Q: 為什麼不直接複製配置檔案？**
A: 統一配置確保標準一致，修改一次全專案生效，減少維護成本。

**Q: 如何覆蓋特定設定？** A: 在繼承配置後，在 `compilerOptions` 中覆蓋特定選項。

**Q: 新配置需要所有專案都遷移嗎？**
A: 不一定，可以漸進式遷移，新專案優先使用新配置。

**Q: 配置出錯怎麼辦？**
A: 檢查相對路徑、確認 include/exclude 設定、查看建構錯誤訊息。
