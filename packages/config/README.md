# @smartsurvey/config

SmartSurvey Pro 的統一配置管理套件，提供 TypeScript、ESLint 等工具的標準配置。

## 📁 配置結構

```
packages/config/
├── tsconfig/              # TypeScript 配置
│   ├── base.json         # 基礎配置
│   ├── package.json      # 套件配置
│   └── web.json          # Web 應用配置
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

## 🔧 配置特點

### TypeScript

- **嚴格模式**: 啟用所有嚴格檢查
- **現代標準**: 目標 ES2022，使用最新語法
- **最佳實踐**: 包含推薦的編譯選項

## ✅ 優勢

1. **統一標準**: 所有專案使用相同的配置標準
2. **集中管理**: 一處修改，全專案生效
3. **易於維護**: 減少重複配置，降低維護成本
4. **靈活擴展**: 支援繼承和覆蓋機制

## 📝 新增專案配置

1. **繼承基礎配置**: 使用 `extends` 引用對應配置
2. **覆蓋必要選項**: 根據專案需求調整路徑等
3. **保持一致性**: 遵循既定的配置模式
