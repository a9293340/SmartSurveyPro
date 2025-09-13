# Scripts - 自動化腳本目錄 🔧

> 📅 最後更新：2025-01-13
> 🎯 用途：存放開發、部署、維護相關的自動化腳本 🚀 執行方式：透過 npm
> scripts 或直接執行

---

## 📁 目錄結構

```
scripts/
├── setup/           # 環境設置腳本
│   ├── init.sh     # 專案初始化
│   ├── install-deps.sh # 依賴安裝
│   └── create-env.sh # 環境變數設置
│
├── dev/            # 開發輔助腳本
│   ├── clean.sh    # 清理快取和建構
│   ├── reset-db.sh # 重置資料庫
│   └── seed-data.ts # 填充測試資料
│
├── build/          # 建構相關腳本
│   ├── prebuild.sh # 建構前處理
│   ├── build-all.sh # 建構所有應用
│   └── postbuild.sh # 建構後處理
│
├── deploy/         # 部署腳本
│   ├── deploy-staging.sh # 部署到測試環境
│   ├── deploy-prod.sh # 部署到生產環境
│   └── rollback.sh # 版本回滾
│
├── migration/      # 資料遷移腳本
│   ├── migrate.ts  # 執行遷移
│   └── migrations/ # 遷移檔案
│
└── utils/          # 工具腳本
    ├── check-deps.sh # 檢查依賴版本
    ├── update-version.sh # 更新版本號
    └── generate-types.ts # 生成類型定義
```

---

## 🚀 常用腳本

### 初始化專案

```bash
# 完整初始化（安裝依賴、設置環境、初始化資料庫）
./scripts/setup/init.sh

# 只安裝依賴
./scripts/setup/install-deps.sh

# 設置環境變數
./scripts/setup/create-env.sh
```

### 開發輔助

```bash
# 清理所有快取和建構產物
./scripts/dev/clean.sh

# 重置資料庫到初始狀態
./scripts/dev/reset-db.sh

# 填充測試資料
pnpm tsx scripts/dev/seed-data.ts
```

### 建構與部署

```bash
# 建構所有應用
./scripts/build/build-all.sh

# 部署到測試環境
./scripts/deploy/deploy-staging.sh

# 部署到生產環境（需要確認）
./scripts/deploy/deploy-prod.sh

# 緊急回滾
./scripts/deploy/rollback.sh <version>
```

---

## 📝 腳本開發規範

### Shell 腳本規範

```bash
#!/bin/bash
# 腳本描述：簡要說明腳本用途
# 作者：開發者名稱
# 更新：YYYY-MM-DD

set -e  # 遇到錯誤立即退出
set -u  # 使用未定義變數時報錯

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 輔助函數
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 主要邏輯
main() {
    log_info "開始執行..."
    # 腳本邏輯
    log_info "執行完成！"
}

# 執行主函數
main "$@"
```

### TypeScript 腳本規範

```typescript
#!/usr/bin/env tsx
/**
 * 腳本描述：簡要說明腳本用途
 * 作者：開發者名稱
 * 更新：YYYY-MM-DD
 */

import { program } from 'commander';
import chalk from 'chalk';

// 設定命令列參數
program
  .name('script-name')
  .description('腳本說明')
  .option('-v, --verbose', '詳細輸出')
  .parse();

const options = program.opts();

// 輔助函數
function logInfo(message: string) {
  console.log(chalk.green('[INFO]'), message);
}

function logError(message: string) {
  console.error(chalk.red('[ERROR]'), message);
  process.exit(1);
}

// 主要邏輯
async function main() {
  try {
    logInfo('開始執行...');
    // 腳本邏輯
    logInfo('執行完成！');
  } catch (error) {
    logError(`執行失敗：${error.message}`);
  }
}

// 執行
main();
```

---

## 🔧 腳本配置

### package.json scripts

```json
{
  "scripts": {
    "setup": "./scripts/setup/init.sh",
    "clean": "./scripts/dev/clean.sh",
    "seed": "tsx scripts/dev/seed-data.ts",
    "migrate": "tsx scripts/migration/migrate.ts",
    "deploy:staging": "./scripts/deploy/deploy-staging.sh",
    "deploy:prod": "./scripts/deploy/deploy-prod.sh"
  }
}
```

### 執行權限設定

```bash
# 給予腳本執行權限
chmod +x scripts/**/*.sh

# 批量設定
find scripts -type f -name "*.sh" -exec chmod +x {} \;
```

---

## 💡 最佳實踐

### 1. 錯誤處理

- 使用 `set -e` 確保錯誤時退出
- 提供清晰的錯誤訊息
- 記錄執行日誌

### 2. 可維護性

- 腳本保持簡單，複雜邏輯抽取成函數
- 添加充足的註解
- 使用有意義的變數名

### 3. 安全性

- 不要在腳本中硬編碼密碼
- 使用環境變數傳遞敏感資訊
- 驗證輸入參數

### 4. 跨平台相容

- 優先使用 Node.js 腳本（跨平台）
- Shell 腳本註明依賴（bash, zsh）
- 避免使用平台特定命令

---

## 📋 待開發腳本

### Phase 1

- [ ] init.sh - 專案初始化腳本
- [ ] create-env.sh - 環境變數設置助手
- [ ] seed-data.ts - 測試資料生成器

### Phase 2

- [ ] generate-types.ts - 從 Schema 生成 TypeScript 類型
- [ ] backup-db.sh - 資料庫備份腳本
- [ ] health-check.ts - 健康檢查腳本

### Phase 3

- [ ] deploy-docker.sh - Docker 部署腳本
- [ ] performance-test.ts - 效能測試腳本
- [ ] security-audit.sh - 安全審計腳本

---

## 🔗 相關文件

- [開發指南](../CLAUDE.md)
- [部署文件](../docs/deployment.md)
- [環境配置](../.env.example)

---

_腳本是提高開發效率的重要工具，請保持腳本的簡潔和可維護性_
