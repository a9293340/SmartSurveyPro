# @smartsurvey/config

SmartSurvey
Pro 的統一配置管理套件，提供 TypeScript、tsup、ESLint 等工具的標準配置。

## 📁 配置結構

```
packages/config/
├── tsconfig/              # TypeScript 配置
│   ├── base.json         # 基礎配置
│   ├── package.json      # 套件配置
│   └── web.json          # Web 應用配置
├── tsup/                 # 建構配置
│   ├── base.ts           # 基礎配置
│   ├── package.ts        # 套件配置
│   └── web.ts            # Web 配置
└── eslint/               # ESLint 配置（未來）
```

## 🚀 使用方式

### TypeScript 配置

#### 套件專用 (packages/\*)

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

#### Web 應用專用 (apps/web)

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

### tsup 配置

#### 套件專用

```ts
import { packageConfig } from '../config/tsup/package.js';

// 使用預設配置
export default packageConfig;

// 或覆蓋特定選項
export default {
  ...packageConfig,
  entry: ['src/index.ts', 'src/cli.ts'],
  external: [...packageConfig.external, 'custom-dep'],
};
```

#### 自訂配置

```ts
import { createBaseConfig } from '../config/tsup/base.js';

export default createBaseConfig({
  entry: ['src/index.ts'],
  dts: true, // 覆蓋預設值
  external: ['react', 'react-dom'],
});
```

## 🔧 配置特點

### TypeScript

- **嚴格模式**: 啟用所有嚴格檢查
- **現代標準**: 目標 ES2022，使用最新語法
- **最佳實踐**: 包含推薦的編譯選項

### tsup

- **ESM 優先**: 預設輸出 ES 模組
- **效能優化**: 啟用 tree shaking 和 source map
- **外部依賴**: 自動排除常見的外部套件

## ✅ 優勢

1. **統一標準**: 所有專案使用相同的配置標準
2. **集中管理**: 一處修改，全專案生效
3. **易於維護**: 減少重複配置，降低維護成本
4. **靈活擴展**: 支援繼承和覆蓋機制

## 📝 新增專案配置

1. **繼承基礎配置**: 使用 `extends` 引用對應配置
2. **覆蓋必要選項**: 根據專案需求調整路徑等
3. **保持一致性**: 遵循既定的配置模式
