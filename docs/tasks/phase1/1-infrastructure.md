# 1. 基礎架構設置

## 📊 概覽
- **階段**: Phase 1
- **優先級**: 🔴 Critical
- **狀態**: 🟡 進行中
- **預估工時**: 20h
- **實際工時**: 6h
- **進度**: 50% ██████░░░░░░░░░░░░░░
- **開始日期**: 2025-01-13
- **完成日期**: -

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
- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 設定 Redis Cloud 連接和基礎快取策略

#### 1.2.3 資料庫健康檢查
- **預估**: 3h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

**任務說明**: 實作資料庫連接狀態檢查和監控

### 1.3 開發環境完善 [4h]
**狀態**: ⬜ **優先級**: 🟡

#### 1.3.1 ESLint + Prettier 配置
- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

#### 1.3.2 Git Hooks 設置
- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Human

#### 1.3.3 VS Code 開發環境
- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude

## 📈 時間追蹤

| 日期 | 任務 | 預估 | 實際 | 備註 |
|------|------|------|------|------|
| - | - | - | - | - |

## 🐛 問題與解決

### 預期問題
1. **PNPM Workspace 路徑解析問題**
   - 可能出現套件引用路徑錯誤
   - 解決方案：檢查 pnpm-workspace.yaml 配置

2. **TypeScript 路徑映射**
   - 可能出現 @survey/* 路徑無法解析
   - 解決方案：確認 tsconfig.json paths 配置

## 💡 給 Claude 的上下文

**任務位置**: Phase 1 > 基礎架構設置
**當前進度**: 未開始
**技術棧**: Monorepo + Turborepo + PNPM + TypeScript
**參考文件**:
- [Monorepo 架構規劃](../../monorepo-architecture.md#phase-1-2-結構)
- [技術棧指南](../../tech-stack-guide.md#安裝指南)

**重要提醒**:
- 採用教學導向開發模式
- Human 負責核心邏輯實作，Claude 負責架構設計和 Review
- 每個 TODO(human) 都要有清晰的學習目標和實作指引