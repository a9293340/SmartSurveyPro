# SmartSurvey Pro - 文件索引中心 📚

> 📅 最後更新：2025-01-13
> 🎯 用途：專案所有文件的索引與快速導航
> 📋 說明：此文件是 Claude 快速找到相關文件的重要索引

---

## 📋 文件分類索引

### 🎯 專案總覽與管理
| 文件名稱 | 路徑 | 用途 | 更新狀態 |
|---------|------|------|----------|
| **Claude 開發指南** | `/CLAUDE.md` | Claude AI 的協作指南和專案理解 | ✅ 最新 |
| **專案說明** | `/README.md` | 專案概述和快速開始指南 | ⚠️ 待更新 |
| **開發路線圖** | `/smartsurvey-roadmap.md` | 完整開發計劃和任務管理 | ✅ 最新 |

### 💼 業務邏輯與規範
| 文件名稱 | 路徑 | 用途 | 更新狀態 |
|---------|------|------|----------|
| **產品規格書** | `/docs/smart-survey-pro-spec.md` | 產品完整功能規格 | ✅ 最新 |
| **業務邏輯文檔** | `/smartsurvey-business-logic.md` | 業務規則、訂閱限制、狀態機 | ✅ 最新 |
| **API 參考手冊** | `/smartsurvey-api-reference.md` | API 端點詳細規格 | ✅ 最新 |

### 🏗️ 技術架構設計
| 文件名稱 | 路徑 | 用途 | 更新狀態 |
|---------|------|------|----------|
| **系統架構** | `/docs/system-architecture.md` | 高層系統架構和部署策略 | ✅ 最新 |
| **Monorepo 架構** | `/docs/monorepo-architecture.md` | 專案結構和開發指南 | ✅ 最新 |
| **資料庫結構** | `/docs/smartsurvey-db-structure.md` | MongoDB 和 Redis 設計 | ✅ 最新 |
| **技術棧指南** | `/docs/tech-stack-guide.md` | 技術選型和套件使用說明 | ✅ 最新 |

### 🎨 設計與 UI/UX
| 文件名稱 | 路徑 | 用途 | 更新狀態 |
|---------|------|------|----------|
| **設計系統** | `/docs/design-system.md` | UI/UX 設計規範和組件庫 | ✅ 最新 |
| **網路架構** | `/docs/network-architecture.md` | 網路拓撲和安全設計 | ✅ 最新 |

### 📋 開發管理
| 文件名稱 | 路徑 | 用途 | 更新狀態 |
|---------|------|------|----------|
| **任務管理中心** | `/docs/tasks/README.md` | 任務拆解和進度追蹤指南 | ✅ 最新 |
| **開發計劃** | `/docs/smartsurvey-dev-plan.md` | 詳細開發計劃 | ✅ 最新 |
| **技術實作標準** | `/docs/tech-implementation-standards.md` | 編碼規範和最佳實踐 | ✅ 最新 |
| **用戶故事** | `/docs/user-stories.md` | 使用者需求和場景描述 | ✅ 最新 |

### 📁 資料夾結構說明
| 資料夾 | README 路徑 | 用途 | 更新狀態 |
|--------|--------------|------|----------|
| **應用程式** | `/apps/README.md` | 前端應用開發指南 | ✅ 最新 |
| **共享套件** | `/packages/README.md` | 套件開發和管理 | ✅ 最新 |
| **共享基礎包** | `/packages/shared/README.md` | 類型、工具、常數說明 | ✅ 最新 |
| **自動化腳本** | `/scripts/README.md` | 腳本使用和開發指南 | ✅ 最新 |

---

## 🚀 快速查找指南

### 我想了解...

#### 📖 專案整體情況
```
👀 查看：/CLAUDE.md + /README.md + /smartsurvey-roadmap.md
```

#### 🏗️ 如何開始開發
```
👀 查看：/docs/monorepo-architecture.md + /apps/README.md
```

#### 💻 技術實作細節
```
👀 查看：/docs/tech-stack-guide.md + /packages/shared/README.md
```

#### 🗄️ 資料庫設計
```
👀 查看：/docs/smartsurvey-db-structure.md + /smartsurvey-business-logic.md
```

#### 📊 業務邏輯規則
```
👀 查看：/smartsurvey-business-logic.md + /docs/smart-survey-pro-spec.md
```

#### 🎨 UI/UX 設計
```
👀 查看：/docs/design-system.md
```

#### 🔌 API 開發
```
👀 查看：/smartsurvey-api-reference.md + /docs/system-architecture.md
```

#### 📋 當前任務
```
👀 查看：/docs/tasks/README.md + /smartsurvey-roadmap.md
```

---

## 🎯 Claude 使用指引

### 常用查詢模式

#### 查找業務邏輯
```
"查看 smartsurvey-business-logic.md 中關於訂閱限制的規則"
"從 API 參考手冊找到認證相關的端點"
```

#### 查找技術實作
```
"查看 monorepo-architecture.md 了解專案結構"
"從 tech-stack-guide.md 找到需要的套件版本"
```

#### 查找設計規範
```
"查看 design-system.md 了解色彩定義"
"從設計系統找到按鈕組件的規範"
```

---

## 📝 文件維護規範

### 文件更新責任
- **CLAUDE.md**: Claude 負責維護
- **README.md**: Human 負責維護
- **技術文檔**: 開發過程中共同維護
- **業務文檔**: 需求變更時更新

### 更新檢查清單
- [ ] 新增功能時更新相關技術文檔
- [ ] API 變更時更新 API 參考手冊
- [ ] 業務規則變更時更新業務邏輯文檔
- [ ] 資料庫結構變更時更新結構文檔
- [ ] 完成任務時更新路線圖和任務文檔

### 文件間連結維護
所有文件間的相互引用都需要保持準確：
- 相對路徑連結要正確
- 章節錨點要有效
- 交叉引用要同步更新

---

## 🔄 已知待處理問題

### ⚠️ 文件一致性問題
- [ ] README.md 中的專案結構需與 monorepo-architecture.md 一致
- [ ] 技術棧版本需與 tech-stack-guide.md 同步
- [ ] API 端點需與實際實作保持一致

### 📋 待完善文檔
- [ ] 部署指南 (deployment.md)
- [ ] 測試指南 (testing-guide.md)
- [ ] 貢獻指南 (CONTRIBUTING.md)
- [ ] 安全指南 (security.md)

---

## 💡 文件撰寫最佳實踐

### 結構化原則
1. **標題層級清晰**：使用一致的標題結構
2. **目錄導航**：長文檔提供目錄
3. **交叉引用**：相關文檔互相連結
4. **版本標記**：記錄最後更新時間

### 內容品質
1. **準確性**：確保技術細節正確
2. **完整性**：涵蓋所有必要資訊
3. **易讀性**：使用清晰的語言和格式
4. **實用性**：提供具體可行的指引

---

## 🔗 重要連結

- [專案 GitHub Repository](https://github.com/your-username/SmartSurveyPro) (待建立)
- [線上文檔站點](https://docs.smartsurvey.pro) (Phase 3 計劃)
- [API 文檔](https://api.smartsurvey.pro/docs) (Phase 2 計劃)

---

*此文檔是專案文件的中央索引，請保持即時更新*