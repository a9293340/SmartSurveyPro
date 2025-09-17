# 5. Workspace 基礎架構

## 📊 概覽

- **階段**: Phase 1
- **優先級**: 🟡 Important
- **狀態**: ⬜ 未開始
- **預估工時**: 8h
- **實際工時**: 0h
- **進度**: 0% ░░░░░░░░░░░░░░░░░░░░
- **開始日期**: -
- **完成日期**: -

## 🔗 依賴關係

- **前置任務**: 2.用戶認證系統
- **阻塞任務**: Phase 2 Task 10.Workspace 完善重構
- **相關文件**:
  - [TODO.md Workspace 項目](../../TODO.md#workspace-工作區架構重構)
  - [me.get.ts API](../../../apps/web/server/api/auth/me.get.ts)

## 📚 學習目標

- [ ] 理解 Workspace 選擇模式與全域權限模式的差異
- [ ] 掌握工作區隔離的基礎設計原理
- [ ] 學會 session 狀態中的工作區管理
- [ ] 理解工作區權限邊界的基礎實作

## 🏗️ 任務分解

### 5.1 Workspace 基礎架構設計 [3h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.1.1 Workspace Session 管理

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 在用戶 session 中加入當前選擇的工作區資訊

**學習重點**: Session 狀態管理、工作區上下文設計

**TODO(human)**:

```typescript
// apps/web/server/api/auth/me.get.ts
// 擴展 session 回應，加入工作區選擇邏輯
interface UserSession {
  // 現有欄位...
  currentWorkspace?: {
    groupId: string;
    groupName: string;
    role: string;
    permissions: string[];
  };
  availableWorkspaces: WorkspaceInfo[];
}
```

#### 5.1.2 工作區選擇 API

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 建立工作區切換的 API 端點

**學習重點**: API 設計、狀態驗證、權限檢查

**TODO(human)**:

```typescript
// apps/web/server/api/auth/switch-workspace.post.ts
// 實作工作區切換邏輯
export default defineEventHandler(async event => {
  // 驗證用戶身份
  // 檢查工作區存取權限
  // 更新 session 狀態
  // 回傳新的工作區資訊
});
```

### 5.2 前端工作區選擇 UI [3h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.2.1 工作區選擇器組件

- **預估**: 2h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 建立工作區選擇的下拉選單組件

**學習重點**: Vue 組件設計、狀態同步、UX 體驗

**TODO(human)**:

```vue
<!-- apps/web/components/workspace/WorkspaceSelector.vue -->
<template>
  <div class="workspace-selector">
    <!-- 當前工作區顯示 -->
    <!-- 工作區列表下拉 -->
    <!-- 切換動畫效果 -->
  </div>
</template>
```

#### 5.2.2 導航整合

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 將工作區選擇器整合到主導航中

**學習重點**: 全域狀態管理、路由整合

### 5.3 資料存取邊界基礎 [2h]

**狀態**: ⬜ **優先級**: 🟡

#### 5.3.1 API 權限中間件擴展

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 擴展現有權限中間件支援工作區檢查

**學習重點**: 中間件設計、權限邊界控制

**TODO(human)**:

```typescript
// apps/web/server/middleware/auth.ts
// 擴展 requireWorkspaceAccess 中間件
export function requireWorkspaceAccess(requiredPermission: string) {
  // 檢查當前工作區權限
  // 驗證存取邊界
}
```

#### 5.3.2 資料查詢隔離

- **預估**: 1h | **實際**: -
- **狀態**: ⬜
- **負責**: Claude + Human

**任務說明**: 確保問卷查詢只返回當前工作區的資料

**學習重點**: 資料隔離、查詢過濾

## 🎯 成功標準

### 功能標準

- [ ] 用戶登入後可以選擇工作區
- [ ] 可以在不同工作區之間切換
- [ ] 工作區切換後只能存取該工作區的資料
- [ ] 沒有選擇工作區時引導用戶選擇

### 技術標準

- [ ] API 回應時間 < 200ms
- [ ] 工作區切換無頁面重新載入
- [ ] 權限檢查覆蓋所有敏感操作
- [ ] 錯誤處理和使用者提示完整

### 程式碼品質

- [ ] TypeScript 類型定義完整
- [ ] 單元測試覆蓋率 > 80%
- [ ] ESLint 和 Prettier 檢查通過
- [ ] 程式碼審查完成

## 📈 Phase 2 升級規劃

此任務為 Phase 2 Task 10 "Workspace 完善重構" 的基礎：

### 預留的擴展點

- **進階權限系統**: 基礎架構支援細粒度權限控制
- **跨工作區資源**: 預留共享資源的存取介面
- **無縫切換體驗**: 基礎切換機制支援進階 UX 優化
- **Redis 快取整合**: Session 結構設計考慮快取需求

### 架構考量

- 避免過度設計，保持 Phase 1 的簡潔性
- 確保 Phase 2 重構時可以平滑升級
- 資料結構設計考慮向後兼容性

## 🔄 測試策略

### 單元測試

- [ ] API 端點功能測試
- [ ] 權限檢查邏輯測試
- [ ] 組件狀態管理測試

### 整合測試

- [ ] 工作區切換完整流程
- [ ] 權限邊界驗證
- [ ] 錯誤情境處理

### 使用者測試

- [ ] 工作區選擇 UX 流程
- [ ] 權限提示和錯誤訊息
- [ ] 多工作區使用情境

---

## 📝 實作注意事項

1. **漸進式實作**: 先實作基礎功能，避免一次性大重構
2. **向後兼容**: 確保現有的全域權限模式在過渡期仍可運作
3. **使用者體驗**: 工作區選擇應該直觀且快速
4. **效能考量**: 工作區切換不應影響整體系統效能
5. **錯誤處理**: 提供清楚的錯誤訊息和恢復建議

---

_此任務為 Workspace 架構的基礎建設，為 Phase 2 的完整重構做準備_
