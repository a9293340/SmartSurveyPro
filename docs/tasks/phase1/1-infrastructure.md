# 1. 基礎架構設置

## 📊 概覽

- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: ✅ 已完成
- **預估工時**: 20h
- **實際工時**: 14.5h
- **進度**: 100% ████████████████████
- **開始日期**: 2025-01-13
- **完成日期**: 2025-01-14

## 🔗 依賴關係

- **前置任務**: 無（專案起始任務）
- **阻塞任務**: 2.用戶系統, 3.問卷建構器, 4.資料收集系統
- **相關文件**:
  - [Monorepo 架構](../../monorepo-architecture.md)
  - [技術棧指南](../../tech-stack-guide.md)

## 📚 學習目標

- [ ] 理解 Monorepo 的組織架構和優勢
- [ ] 掌握 PNPM Workspace 的配置和使用
- [ ] 掌握 Turborepo 的並行構建機制
- [ ] 學會基礎的 TypeScript 專案配置
- [ ] 理解資料庫連接池和最佳實踐

## 🏗️ 任務分解

### 1.1 Monorepo 初始化 [8h]

**狀態**: ✅ **優先級**: 🔴

#### 1.1.1 根目錄 Package.json 設置

- **預估**: 2h | **實際**: 1h
- **狀態**: ✅
- **負責**: Human

**任務說明**: 建立專案根目錄的 package.json，設定 Monorepo 基礎配置

**驗收標準**:

- [ ] package.json 包含正確的專案資訊
- [ ] scripts 包含常用命令 (dev, build, lint, clean)
- [ ] 設定 "private": true
- [ ] devDependencies 包含核心開發工具

**實作指引**:

```bash
# 在專案根目錄執行
pnpm init

# 編輯 package.json，參考以下結構：
{
  "name": "smartsurvey-pro",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  }
}
```

#### 1.1.2 Turborepo 配置

- **預估**: 3h | **實際**: 1.5h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 設定 Turborepo 配置檔案，定義 pipeline 和快取策略

**TODO(human)**:

```json
// 在 turbo.json 中設定 pipeline 配置
// 思考：dev、build、lint、test 這些任務的依賴關係是什麼？
// 哪些任務的輸出需要被快取？
```

#### 1.1.3 TypeScript 基礎配置

- **預估**: 2h | **實際**: 1h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 建立根目錄和各套件的 TypeScript 配置

**TODO(human)**:

```typescript
// 設定 tsconfig.json 的 compilerOptions
// 考慮：target 應該設為什麼？paths mapping 如何配置？
```

#### 1.1.4 共享套件初始化

- **預估**: 1h | **實際**: 0.5h
- **狀態**: ✅
- **負責**: Human

**任務說明**: 初始化 packages/shared 套件

#### 1.1.5 配置共享架構 [額外任務]

- **預估**: - | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 建立統一的配置管理架構

**完成內容**:

- 建立 `@smartsurvey/config` 套件
- 統一管理 TypeScript、tsup 配置
- 實作配置繼承和覆蓋機制
- 建立配置使用規範

**架構特點**:

- **集中管理**: 所有配置統一維護
- **靈活繼承**: 支援基礎配置 + 特定覆蓋
- **標準化**: 確保全專案配置一致性

### 1.2 資料庫連接設置 [8h]

**狀態**: 🟡 **優先級**: 🔴

#### 1.2.1 MongoDB 連接配置

- **預估**: 3h | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 建立 MongoDB Atlas 連接和基礎配置

**學習重點**: 連接池、錯誤處理、環境變數管理

**TODO(human)**:

```typescript
// 實作 MongoDB 連接邏輯
// 思考：如何處理連接失敗？連接池大小如何設定？
export async function connectToDatabase() {
  // 你的實作
}
```

#### 1.2.2 Redis 連接配置

- **預估**: 2h | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 設定 Redis Cloud 連接和基礎快取策略

**完成內容**:

- 實作 Redis 連接管理類和單例模式
- 建立 SSP 金鑰命名策略 (SSP:Service:Feature:Key)
- 實作 Redis 操作輔助類 (JSON 操作、TTL 管理)
- 建立健康檢查機制
- 完成連接測試和驗證

**學習重點**: 連接池、重連機制、金鑰命名規範

#### 1.2.3 資料庫健康檢查

- **預估**: 3h | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 實作資料庫連接狀態檢查和監控

**完成內容**:

- 建立統一的健康檢查介面和架構
- 實作 MongoDB 和 Redis 健康檢查功能
- 實作平行檢查和狀態聚合邏輯
- 提供快速、標準、詳細三種檢查模式
- 建立健全的錯誤處理和狀態分級機制

**學習重點**: 分散式系統監控、平行處理、狀態聚合

### 1.3 開發環境完善 [4h]

**狀態**: ✅ **優先級**: 🟡

#### 1.3.1 ESLint + Prettier 配置

- **預估**: 2h | **實際**: 1.5h
- **狀態**: ✅
- **負責**: Claude

**任務說明**: 建立企業級的代碼品質和格式化標準

**完成內容**:

- 建立 ESLint 配置，參考 Google/Microsoft 標準
- 設定適度嚴格的規則（any 為警告，console 允許 warn/error）
- 建立 Prettier 配置，採用現代化格式標準
- 統一配置架構，支援 ES module 專案
- 整合 lint-staged 和 husky 工作流程
- 自動修復和格式化功能

**規則特點**:

- **TypeScript**: 適度嚴格，允許 any 但給出警告
- **代碼品質**: 禁止危險語法，鼓勵最佳實踐
- **格式化**: 100 字元行寬，單引號，尾隨逗號
- **工作流程**: 提交前自動格式化和檢查

#### 1.3.2 Git Hooks 設置

- **預估**: 1h | **實際**: 2h
- **狀態**: ✅
- **負責**: Claude + Human

**任務說明**: 設定 Git Hooks 自動化檢查，確保代碼品質和提交規範

**完成內容**:

- 安裝和配置 Husky Git hooks 管理工具
- 建立 pre-commit hook：執行 lint-staged 和 TypeScript 檢查
- 建立 commit-msg hook：使用 commitlint 驗證提交訊息格式
- 配置 commitlint 規則，採用 Conventional Commits 標準
- 設定友好的錯誤訊息和使用指引

**Hook 功能**:

- **pre-commit**: 暫存文件檢查、TypeScript 類型檢查
- **commit-msg**: 提交訊息格式驗證、錯誤提示
- **規範**: 支援 feat/fix/docs 等標準類型，範圍可選
- **體驗**: 包含中文錯誤說明和格式範例

**學習重點**: Git hooks 工作流程、代碼品質自動化、團隊協作規範

#### 1.3.3 VS Code 開發環境

- **預估**: 1h | **實際**: 1h
- **狀態**: ✅
- **負責**: Claude

**任務說明**: 建立完整的 VS Code 開發環境配置，提升開發效率和體驗

**完成內容**:

- 建立工作區設定 (settings.json)：格式化、TypeScript、ESLint 整合
- 配置推薦擴充套件 (extensions.json)：Vue 3、TypeScript、開發工具
- 設定專案任務 (tasks.json)：開發、建置、測試、品質檢查
- 配置除錯器 (launch.json)：Node.js、瀏覽器、測試除錯
- 建立程式碼片段：Vue 3、TypeScript、SmartSurvey 專用模板

**配置特點**:

- **智慧感知**: 完整 TypeScript 和 Vue 3 支援
- **自動化**: 保存時自動格式化和修復
- **Monorepo**: 支援多套件工作區
- **除錯**: 前後端一鍵除錯配置
- **效率**: 豐富的程式碼片段和任務快捷方式

**學習重點**: VS Code 工作區配置、開發工具整合、團隊協作標準

## 📈 時間追蹤

| 日期 | 任務 | 預估 | 實際 | 備註 |
| ---- | ---- | ---- | ---- | ---- |
| -    | -    | -    | -    | -    |

## 🐛 問題與解決

### 預期問題

1. **PNPM Workspace 路徑解析問題**
   - 可能出現套件引用路徑錯誤
   - 解決方案：檢查 pnpm-workspace.yaml 配置

2. **TypeScript 路徑映射**
   - 可能出現 @survey/\* 路徑無法解析
   - 解決方案：確認 tsconfig.json paths 配置

## 💡 給 Claude 的上下文

**任務位置**: Phase 1 > 基礎架構設置 **當前進度**: 未開始 **技術棧**: Monorepo +
Turborepo + PNPM + TypeScript **參考文件**:

- [Monorepo 架構規劃](../../monorepo-architecture.md#phase-1-2-結構)
- [技術棧指南](../../tech-stack-guide.md#安裝指南)

**重要提醒**:

- 採用教學導向開發模式
- Human 負責核心邏輯實作，Claude 負責架構設計和 Review
- 每個 TODO(human) 都要有清晰的學習目標和實作指引
