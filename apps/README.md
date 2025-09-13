# Apps - 應用程式目錄 📱

> 📅 最後更新：2025-01-13 🎯 用途：存放所有前端應用程式 📦 管理方式：Turborepo +
> PNPM Workspace

---

## 📁 目錄結構

```
apps/
├── web/          # 主要前台應用 (Nuxt3) [Phase 1] ✅
└── admin/        # 管理後台 (Vite + Vue3) [Phase 3] 📅
```

---

## 🎯 應用說明

### 📱 web - 用戶前台應用

**技術棧**：Nuxt3 + Vue3 + TypeScript **用途**：問卷建立、填寫、分析的主要介面
**URL**：https://survey.example.com **開發階段**：Phase 1 (進行中)

**主要功能**：

- 問卷建構器（拖放式編輯）
- 問卷填寫頁面
- 資料分析儀表板
- 用戶個人中心

### 🔧 admin - 管理後台

**技術棧**：Vite + Vue3 + TypeScript **用途**：系統管理、用戶管理、資料監控
**URL**：https://admin.survey.example.com **開發階段**：Phase 3 (計劃中)

**主要功能**：

- 用戶管理
- 訂閱管理
- 系統監控
- 資料分析報表

---

## 🚀 開發指引

### 建立新應用

```bash
# 在 apps 目錄下建立新應用
cd apps
pnpm dlx nuxi@latest init app-name

# 或使用 Vite
pnpm create vite app-name --template vue-ts
```

### 共用資源

所有應用都可以引用 `packages/` 下的共享包：

```typescript
// 在應用中使用共享包
import { Survey } from '@survey/shared/types';
import { Button } from '@survey/ui';
import { validateEmail } from '@survey/core';
```

---

## 📋 開發規範

### 資料夾結構

每個應用都應該遵循以下結構：

```
app-name/
├── src/           # 原始碼
├── public/        # 靜態資源
├── tests/         # 測試檔案
├── README.md      # 應用說明
├── package.json   # 依賴管理
└── .env.example   # 環境變數範例
```

### 命名規範

- 應用名稱使用 kebab-case
- 保持簡短且具描述性
- 避免使用通用名稱

### 版本管理

- 每個應用維護獨立版本號
- 遵循 Semantic Versioning
- 重大更新需在 CHANGELOG 記錄

---

## 🔗 相關文件

- [Web 應用開發指南](./web/README.md)
- [Admin 應用開發指南](./admin/README.md)
- [Monorepo 架構說明](../docs/monorepo-architecture.md)

---

## 💡 注意事項

1. **獨立部署**：每個應用可以獨立部署
2. **共享依賴**：通過 workspace 共享依賴，避免重複安裝
3. **統一配置**：使用根目錄的 ESLint、Prettier 配置
4. **環境隔離**：每個應用有獨立的環境變數

---

_此目錄包含所有面向用戶的應用程式_
