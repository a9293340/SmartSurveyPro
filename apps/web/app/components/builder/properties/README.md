# Properties 屬性編輯組件目錄

> 📁 **目錄作用**：問卷和題目屬性編輯相關組件
>
> 📅 **最後更新**：2025-01-20
>
> 🎯 **負責功能**：提供問卷設定和題目屬性的詳細編輯界面

## 📋 包含檔案清單

| 檔案名稱                 | 作用說明         | 編輯對象      | 主要功能                   |
| ------------------------ | ---------------- | ------------- | -------------------------- |
| `SurveyProperties.vue`   | 問卷全局屬性編輯 | Survey 對象   | 標題、描述、設定、狀態顯示 |
| `QuestionProperties.vue` | 題目屬性編輯     | Question 對象 | 題目標題、選項、驗證規則   |

## 🔧 SurveyProperties.vue 詳細功能

### 編輯區塊

1. **基本資訊**
   - 問卷標題：即時編輯與更新
   - 問卷描述：多行文本編輯

2. **設定選項**
   - 允許匿名填寫：checkbox 控制
   - 收集 IP 地址：隱私設定選項
   - 允許重複填寫：行為控制選項

3. **完成頁面**
   - 感謝訊息：自定義完成提示

4. **問卷狀態**（唯讀顯示）
   - 當前狀態：草稿/已發布/已關閉/已歸檔
   - 題目數量：動態計算顯示
   - 建立時間：格式化日期顯示

### 數據流

```
User Input → Local State → Blur/Enter Event → Builder Store → Survey Object
```

## 🔧 QuestionProperties.vue 詳細功能

### 編輯邏輯

1. **動態組件渲染**
   - 根據題型顯示對應編輯界面
   - 支援未來題型擴展

2. **表單驗證**
   - 即時驗證用戶輸入
   - 錯誤狀態視覺提示

3. **數據同步**
   - 雙向綁定題目屬性
   - 自動保存機制

### 支援題型

- 單選題：選項管理、預設值設定
- 多選題：選項管理、最大選擇限制
- 文字題：字數限制、格式驗證
- _（未來擴展更多題型）_

## 🎯 組件通信模式

### Props 傳遞

```typescript
// QuestionProperties 接收
interface Props {
  questionId: string | null;
}
```

### Store 操作

```typescript
// 共同使用的 Store 方法
builderStore.updateSurveyInfo(updates); // 更新問卷資訊
builderStore.updateQuestion(id, updates); // 更新題目資訊
builderStore.selectedQuestionId; // 取得選中題目
```

## 🔄 生命週期管理

### SurveyProperties

1. **初始化**：從 Store 同步資料到本地狀態
2. **監聽變更**：Watch currentSurvey 變化
3. **自動保存**：失焦或按 Enter 時觸發保存

### QuestionProperties

1. **動態載入**：根據 questionId 載入對應題目
2. **類型切換**：題型變更時重新渲染編輯界面
3. **驗證機制**：即時驗證並顯示錯誤狀態

## 🎨 UI/UX 設計原則

### 視覺一致性

- 統一的 section 標題樣式
- 一致的 input/textarea 樣式
- 標準的 checkbox 和 label 配置

### 交互體驗

- **即時反饋**：輸入變更立即在畫布反映
- **保存提示**：明確的保存時機（失焦/Enter）
- **錯誤處理**：友善的錯誤訊息和恢復機制

### 響應式設計

- 小螢幕優化：更緊湊的間距和字體
- 觸控友善：適當的點擊區域大小

## 🚀 開發擴展指南

### 新增題型屬性編輯

1. 在 `QuestionProperties.vue` 新增對應的編輯組件
2. 更新題型判斷邏輯
3. 新增對應的驗證規則
4. 更新此 README 的支援題型清單

### 新增問卷屬性

1. 在 `SurveyProperties.vue` 新增編輯欄位
2. 更新 `updateSurveyInfo` 調用
3. 確保數據同步和驗證
4. 更新此 README 的功能說明

## 📝 測試要點

### 數據一致性測試

- [ ] 屬性變更是否正確反映到 Store
- [ ] 多個組件同時編輯的競態條件
- [ ] 瀏覽器刷新後的狀態恢復

### 用戶體驗測試

- [ ] 輸入驗證的即時性和準確性
- [ ] 錯誤狀態的清除機制
- [ ] 長文本的處理和顯示

### 性能測試

- [ ] 大量題目時的渲染性能
- [ ] 頻繁切換題目的響應速度
- [ ] 內存泄漏檢查

---

**最後更新者**：Claude AI Assistant **下次檢查**：新增題型或屬性時
