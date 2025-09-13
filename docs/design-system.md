# SmartSurvey Pro - UI/UX Design System 完整指南

> 📅 文件版本：v1.0  
> 📝 最後更新：2025-01-10  
> 🎨 設計風格：Modern Minimal with Soft Depth  
> 🎯 目標：提供精確的視覺規範與實作指引

---

## 🎨 設計理念

### 核心設計原則

```
1. Clarity over Cleverness（清晰勝於聰明）
2. Consistency is Key（一致性是關鍵）
3. Progressive Disclosure（漸進式揭露）
4. Delightful Details（愉悅的細節）
5. Accessible by Default（預設無障礙）
```

### 品牌個性

- **Professional 專業** - 但不死板
- **Modern 現代** - 但不追流行
- **Intelligent 智慧** - 但不炫技
- **Friendly 友善** - 但不幼稚

---

## 🎨 色彩系統

### 主色盤（Primary Palette）

```scss
// 主色 - 信任藍（Trust Blue）
$primary: (
  50: #eff6ff,
  100: #dbeafe,
  200: #bfdbfe,
  300: #93c5fd,
  400: #60a5fa,
  500: #3b82f6,
  // 主要使用
  600: #2563eb,
  700: #1d4ed8,
  800: #1e40af,
  900: #1e3a8a,
  950: #172e5c,
);

// 實際使用
.primary-button {
  background: #3b82f6;
  hover: #2563eb;
  active: #1d4ed8;
  disabled: #93c5fd;
}
```

### 次要色盤（Secondary Palette）

```scss
// 次要色 - 創意紫（Creative Purple）
$secondary: (
  50: #faf5ff,
  100: #f3e8ff,
  200: #e9d5ff,
  300: #d8b4fe,
  400: #c084fc,
  500: #a855f7,
  // 主要使用
  600: #9333ea,
  700: #7e22ce,
  800: #6b21a8,
  900: #581c87,
);

// AI 功能專用色 - 智慧綠（AI Green）
$ai-accent: (
  400: #4ade80,
  500: #22c55e,
  // 主要使用
  600: #16a34a,
);
```

### 語意色彩（Semantic Colors）

```scss
// 狀態色彩
$semantic: (
  success: #10b981,
  // 翡翠綠
  success-light: #d1fae5,
  success-dark: #059669,

  warning: #f59e0b,
  // 琥珀黃
  warning-light: #fef3c7,
  warning-dark: #d97706,

  error: #ef4444,
  // 珊瑚紅
  error-light: #fee2e2,
  error-dark: #dc2626,

  info: #0ea5e9,
  // 天空藍
  info-light: #e0f2fe,
  info-dark: #0284c7,
);
```

### 中性色（Neutral Colors）

```scss
// 溫暖灰階（不是純灰）
$gray: (
  0: #ffffff,
  // 純白
  50: #fafafa,
  // 背景
  100: #f4f4f5,
  // 卡片背景
  200: #e4e4e7,
  // 邊框
  300: #d4d4d8,
  // 禁用邊框
  400: #a1a1aa,
  // 佔位符
  500: #71717a,
  // 次要文字
  600: #52525b,
  // 正常文字
  700: #3f3f46,
  // 重要文字
  800: #27272a,
  // 標題
  900: #18181b,
  // 最深
  950: #0a0a0b, // 幾乎黑
);
```

### 深色模式色彩對照表

```scss
// 深色模式調整
$dark-mode: (
  // 背景（反轉但不是純黑）
  bg-primary: #0f0f11,
  bg-secondary: #1a1a1e,
  bg-tertiary: #242429,

  // 文字（提高對比度）
  text-primary: #f4f4f5,
  text-secondary: #a1a1aa,
  text-tertiary: #71717a,

  // 主色（提高亮度）
  primary: #60a5fa,
  primary-hover: #3b82f6,

  // 邊框（降低對比）
  border: #2e2e35,
  border-hover: #3e3e47
);
```

### 色彩使用指南

```css
/* 實際應用範例 */
.survey-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.survey-card:hover {
  border-color: #d4d4d8;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.primary-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
}

.ai-badge {
  background: linear-gradient(135deg, #a855f7 0%, #22c55e 100%);
  color: #ffffff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}
```

---

## 📐 字型系統

### 字體選擇

```scss
// 主字體堆疊
$font-family-sans:
  'Inter',
  'Noto Sans TC',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  'PingFang TC',
  'Microsoft JhengHei',
  sans-serif;

// 程式碼字體
$font-family-mono:
  'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace;

// 特殊標題字體（選用）
$font-family-display: 'DM Sans', $font-family-sans;
```

### 字型大小規範

```scss
// 字型大小（使用 rem，基準 16px）
$font-sizes: (
  xs: 0.75rem,
  // 12px - 標籤、輔助文字
  sm: 0.875rem,
  // 14px - 次要內容、說明
  base: 1rem,
  // 16px - 正文
  lg: 1.125rem,
  // 18px - 重要內容
  xl: 1.25rem,
  // 20px - 小標題
  2xl: 1.5rem,
  // 24px - 標題
  3xl: 1.875rem,
  // 30px - 大標題
  4xl: 2.25rem,
  // 36px - 頁面標題
  5xl: 3rem,
  // 48px - Hero 標題
  6xl: 3.75rem, // 60px - 特大標題
);

// 行高配對
$line-heights: (
  xs: 1rem,
  // 16px
  sm: 1.25rem,
  // 20px
  base: 1.5rem,
  // 24px
  lg: 1.75rem,
  // 28px
  xl: 1.75rem,
  // 28px
  2xl: 2rem,
  // 32px
  3xl: 2.25rem,
  // 36px
  4xl: 2.5rem,
  // 40px
  5xl: 1.2,
  // 相對
  6xl: 1.2, // 相對
);
```

### 字重系統

```scss
$font-weights: (
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
);

// 使用建議
.heading-1 {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 2.5rem;
  letter-spacing: -0.02em;
}

.body-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0;
}

.caption {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.01em;
  color: #71717a;
}
```

---

## 📏 間距系統

### 基準間距（8px Grid System）

```scss
// 間距規範
$spacing: (
  0: 0,
  // 0px
  px: 1px,
  // 1px - 極細邊框
  0.5: 0.125rem,
  // 2px
  1: 0.25rem,
  // 4px
  1.5: 0.375rem,
  // 6px
  2: 0.5rem,
  // 8px - 基準
  2.5: 0.625rem,
  // 10px
  3: 0.75rem,
  // 12px
  3.5: 0.875rem,
  // 14px
  4: 1rem,
  // 16px
  5: 1.25rem,
  // 20px
  6: 1.5rem,
  // 24px
  7: 1.75rem,
  // 28px
  8: 2rem,
  // 32px
  9: 2.25rem,
  // 36px
  10: 2.5rem,
  // 40px
  12: 3rem,
  // 48px
  14: 3.5rem,
  // 56px
  16: 4rem,
  // 64px
  20: 5rem,
  // 80px
  24: 6rem,
  // 96px
  32: 8rem, // 128px
);

// 使用範例
.card {
  padding: 24px; // $spacing-6
  margin-bottom: 16px; // $spacing-4
}

.button {
  padding: 8px 16px; // $spacing-2 $spacing-4
}

.section {
  margin-top: 48px; // $spacing-12
}
```

### 組件間距規範

```scss
// 組件內部間距
$component-spacing: (
  button-padding-x: 16px,
  button-padding-y: 8px,

  input-padding-x: 12px,
  input-padding-y: 10px,

  card-padding: 24px,
  card-gap: 16px,

  modal-padding: 32px,
  modal-header-gap: 24px,

  list-item-gap: 8px,
  list-group-gap: 16px,

  form-field-gap: 20px,
  form-section-gap: 32px,
);
```

---

## 🎯 圓角系統

```scss
$border-radius: (
  none: 0,
  sm: 0.125rem,
  // 2px - 小標籤
  base: 0.25rem,
  // 4px - 小按鈕、徽章
  md: 0.375rem,
  // 6px - 輸入框內元素
  lg: 0.5rem,
  // 8px - 按鈕、輸入框（標準）
  xl: 0.75rem,
  // 12px - 卡片
  2xl: 1rem,
  // 16px - 模態框、大卡片
  3xl: 1.5rem,
  // 24px - 特殊容器
  full: 9999px, // 完全圓形
);

// 組件圓角規範
.button {
  border-radius: 8px; // $border-radius-lg
}

.input {
  border-radius: 8px; // $border-radius-lg
}

.card {
  border-radius: 12px; // $border-radius-xl
}

.modal {
  border-radius: 16px; // $border-radius-2xl
}

.avatar {
  border-radius: 9999px; // $border-radius-full
}

.tag {
  border-radius: 4px; // $border-radius-base
}
```

---

## 🌟 陰影系統

### 陰影層級

```scss
// 陰影定義（從輕到重）
$shadows: (
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl:
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
);

// 彩色陰影（用於按鈕）
$color-shadows: (
  primary: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
  secondary: '0 4px 14px 0 rgba(168, 85, 247, 0.25)',
  success: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
  error: '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
);

// Soft UI 風格陰影
$soft-shadows: (
  raised:
    '6px 6px 12px rgba(0, 0, 0, 0.05), -6px -6px 12px rgba(255, 255, 255, 0.8)',
  pressed:
    'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
  floating: '0 20px 40px rgba(0, 0, 0, 0.08)',
);
```

### 陰影使用場景

```scss
// 不同元素的陰影應用
.card {
  box-shadow: $shadow-sm;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.dropdown {
  box-shadow: $shadow-lg;
}

.modal {
  box-shadow: $shadow-2xl;
}

.button-primary {
  box-shadow: $color-shadow-primary;

  &:active {
    box-shadow: $soft-shadow-pressed;
  }
}

.floating-action-button {
  box-shadow: $soft-shadow-floating;
}
```

---

## 💫 動畫系統

### 緩動函數

```scss
$easing: (
  linear: linear,
  ease: ease,
  ease-in: cubic-bezier(0.4, 0, 1, 1),
  ease-out: cubic-bezier(0, 0, 0.2, 1),
  ease-in-out: cubic-bezier(0.4, 0, 0.2, 1),
  smooth: cubic-bezier(0.4, 0, 0.2, 1),
  // 最常用
  bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55),
  elastic: cubic-bezier(0.68, -0.55, 0.32, 1.55),
  sharp: cubic-bezier(0.4, 0, 0.6, 1),
);
```

### 動畫時長

```scss
$duration: (
  instant: 0ms,
  fast: 150ms,
  // 快速回饋
  normal: 300ms,
  // 標準過渡
  slow: 500ms,
  // 複雜動畫
  slower: 700ms,
  // 頁面轉場
  slowest: 1000ms, // 特殊效果
);
```

### 常用動畫預設

```scss
// 懸停效果
.hover-lift {
  transition: all 300ms $easing-smooth;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
}

// 點擊效果
.click-scale {
  transition: transform 150ms $easing-smooth;

  &:active {
    transform: scale(0.98);
  }
}

// 淡入效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 脈動效果（用於載入、提示）
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 漣漪效果（Material Design 風格）
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

// 滑入效果
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

### 微互動動畫

```scss
// 拖拽狀態
.dragging {
  opacity: 0.5;
  transform: scale(1.05) rotate(2deg);
  transition: all 300ms $easing-bounce;
  cursor: grabbing;
}

// 載入骨架屏
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// 成功動畫
.success-checkmark {
  animation: checkmark 500ms $easing-bounce;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

---

## 🧩 組件設計規範

### 按鈕（Buttons）

```scss
// 按鈕基礎樣式
.btn {
  // 尺寸
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  // 圓角
  border-radius: 8px;

  // 過渡
  transition: all 150ms $easing-smooth;

  // 其他
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  // 狀態
  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

// 按鈕變體
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.35);
  }
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;

  &:hover {
    background: #eff6ff;
    border-color: #2563eb;
  }
}

.btn-ghost {
  background: transparent;
  color: #52525b;
  border: none;

  &:hover {
    background: #f4f4f5;
    color: #27272a;
  }
}

// 按鈕尺寸
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-lg {
  padding: 12px 28px;
  font-size: 16px;
}

// 圖標按鈕
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 輸入框（Inputs）

```scss
// 輸入框基礎樣式
.input {
  // 尺寸
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 20px;

  // 外觀
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 8px;

  // 過渡
  transition: all 150ms $easing-smooth;

  // 狀態
  &:hover {
    border-color: #d4d4d8;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #fafafa;
    border-color: #e4e4e7;
    color: #a1a1aa;
    cursor: not-allowed;
  }

  &.error {
    border-color: #ef4444;

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  // 佔位符
  &::placeholder {
    color: #a1a1aa;
  }
}

// 輸入組
.input-group {
  position: relative;

  // 標籤
  .input-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #27272a;
  }

  // 說明文字
  .input-help {
    margin-top: 6px;
    font-size: 12px;
    color: #71717a;
  }

  // 錯誤訊息
  .input-error {
    margin-top: 6px;
    font-size: 12px;
    color: #ef4444;
  }

  // 圖標
  .input-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #71717a;

    &.icon-left {
      left: 12px;
    }

    &.icon-right {
      right: 12px;
    }
  }

  // 有圖標的輸入框
  .input-with-icon-left {
    padding-left: 36px;
  }

  .input-with-icon-right {
    padding-right: 36px;
  }
}

// 文字區域
.textarea {
  min-height: 100px;
  resize: vertical;
}

// 選擇框
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M6 9L2 5h8z' fill='%2371717A'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}
```

### 卡片（Cards）

```scss
// 卡片基礎樣式
.card {
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 300ms $easing-smooth;

  // 懸停效果
  &.card-hover:hover {
    border-color: #d4d4d8;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }

  // 可點擊卡片
  &.card-clickable {
    cursor: pointer;

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
  }

  // 卡片頭部
  .card-header {
    margin: -24px -24px 24px;
    padding: 20px 24px;
    border-bottom: 1px solid #e4e4e7;
    border-radius: 12px 12px 0 0;

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #27272a;
      margin: 0;
    }

    .card-subtitle {
      font-size: 14px;
      color: #71717a;
      margin-top: 4px;
    }
  }

  // 卡片內容
  .card-body {
    // 內容區域
  }

  // 卡片底部
  .card-footer {
    margin: 24px -24px -24px;
    padding: 16px 24px;
    border-top: 1px solid #e4e4e7;
    border-radius: 0 0 12px 12px;
    background: #fafafa;
  }
}

// 卡片變體
.card-outlined {
  box-shadow: none;
}

.card-elevated {
  border: none;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;

  .card-title,
  .card-subtitle {
    color: white;
  }
}
```

### 模態框（Modals）

```scss
// 模態框遮罩
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 150ms $easing-smooth;
}

// 模態框容器
.modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideUp 300ms $easing-smooth;

  // 模態框頭部
  .modal-header {
    padding: 24px;
    border-bottom: 1px solid #e4e4e7;

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #27272a;
      margin: 0;
    }

    .modal-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 150ms $easing-smooth;

      &:hover {
        background: #f4f4f5;
      }
    }
  }

  // 模態框內容
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    max-height: calc(90vh - 140px);
  }

  // 模態框底部
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e4e4e7;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .btn {
      min-width: 80px;
    }
  }
}

// 模態框動畫
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 模態框尺寸
.modal-sm {
  max-width: 400px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1200px;
}

.modal-fullscreen {
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}
```

---

## 🎯 特殊組件設計

### 拖拽元素樣式

```scss
// 可拖拽元素
.draggable {
  cursor: grab;
  user-select: none;

  // 拖拽把手
  .drag-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: #a1a1aa;

    &:hover {
      color: #71717a;
    }
  }

  // 拖拽中狀態
  &.dragging {
    opacity: 0.5;
    cursor: grabbing;
    transform: scale(1.02) rotate(1deg);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  }

  // 拖拽懸停區域
  &.drag-over {
    background: #eff6ff;
    border: 2px dashed #3b82f6;
  }
}

// 拖放區域
.dropzone {
  border: 2px dashed #e4e4e7;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 300ms $easing-smooth;

  &.dropzone-active {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &.dropzone-reject {
    border-color: #ef4444;
    background: #fee2e2;
  }

  .dropzone-icon {
    font-size: 48px;
    color: #a1a1aa;
    margin-bottom: 16px;
  }

  .dropzone-text {
    color: #52525b;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .dropzone-hint {
    color: #a1a1aa;
    font-size: 14px;
  }
}

// 拖拽佔位符
.drag-placeholder {
  background: #f4f4f5;
  border: 2px dashed #d4d4d8;
  border-radius: 8px;
  height: 80px;
  margin: 8px 0;
  position: relative;

  &::before {
    content: '放置到這裡';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #a1a1aa;
    font-size: 14px;
  }
}
```

### AI 功能視覺提示

```scss
// AI 標識
.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #a855f7 0%, #22c55e 100%);
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 12px;

  .ai-icon {
    width: 12px;
    height: 12px;
  }
}

// AI 生成內容邊框
.ai-generated {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #a855f7, #22c55e, #3b82f6);
    border-radius: 12px;
    opacity: 0.2;
    z-index: -1;
    animation: pulse 2s infinite;
  }
}

// AI 載入動畫
.ai-thinking {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .ai-dots {
    display: flex;
    gap: 4px;

    span {
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #a855f7 0%, #22c55e 100%);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
```

### 數據視覺化樣式

```scss
// 圖表容器
.chart-container {
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 24px;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: #27272a;
    }

    .chart-controls {
      display: flex;
      gap: 8px;
    }
  }

  .chart-body {
    position: relative;
    height: 300px;
  }

  .chart-footer {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f4f4f5;

    .chart-legend {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #71717a;

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
      }
    }
  }
}

// 統計卡片
.stat-card {
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 20px;

  .stat-label {
    font-size: 12px;
    font-weight: 500;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #27272a;
    line-height: 1;

    .stat-unit {
      font-size: 16px;
      font-weight: 400;
      color: #71717a;
      margin-left: 4px;
    }
  }

  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;

    &.stat-increase {
      background: #d1fae5;
      color: #059669;
    }

    &.stat-decrease {
      background: #fee2e2;
      color: #dc2626;
    }
  }
}
```

---

## 🌓 深色模式實現

### 深色模式變數

```scss
// CSS 變數定義
:root {
  // 淺色模式
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-bg-tertiary: #f4f4f5;

  --color-text-primary: #27272a;
  --color-text-secondary: #52525b;
  --color-text-tertiary: #71717a;

  --color-border: #e4e4e7;
  --color-border-hover: #d4d4d8;

  // ... 其他變數
}

[data-theme='dark'] {
  // 深色模式
  --color-bg-primary: #0f0f11;
  --color-bg-secondary: #1a1a1e;
  --color-bg-tertiary: #242429;

  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-tertiary: #71717a;

  --color-border: #2e2e35;
  --color-border-hover: #3e3e47;

  // 調整主色亮度
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;

  // 調整陰影
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

// 使用 CSS 變數
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}
```

### 深色模式切換動畫

```scss
// 主題切換過渡
* {
  transition:
    background-color 300ms $easing-smooth,
    border-color 300ms $easing-smooth,
    color 300ms $easing-smooth;
}

// 主題切換按鈕
.theme-toggle {
  position: relative;
  width: 56px;
  height: 28px;
  background: #e4e4e7;
  border-radius: 14px;
  cursor: pointer;
  transition: background 300ms $easing-smooth;

  &[data-theme='dark'] {
    background: #3b82f6;
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 12px;
    transition: transform 300ms $easing-smooth;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &[data-theme='dark'] {
      transform: translateX(28px);
    }
  }

  .toggle-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.sun {
      left: 6px;
      color: #f59e0b;
    }

    &.moon {
      right: 6px;
      color: white;
    }
  }
}
```

---

## 📱 響應式設計

### 斷點系統

```scss
// 斷點定義
$breakpoints: (
  xs: 0,
  // 手機豎屏
  sm: 640px,
  // 手機橫屏
  md: 768px,
  // 平板豎屏
  lg: 1024px,
  // 平板橫屏 / 小筆電
  xl: 1280px,
  // 桌面
  2xl: 1536px, // 大螢幕
);

// 響應式 mixin
@mixin responsive($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

// 使用範例
.container {
  padding: 16px;

  @include responsive(md) {
    padding: 24px;
  }

  @include responsive(lg) {
    padding: 32px;
  }
}
```

### 響應式網格系統

```scss
// 網格容器
.grid {
  display: grid;
  gap: 16px;

  // 響應式列數
  &.grid-cols-1 {
    grid-template-columns: repeat(1, 1fr);
  }
  &.grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  &.grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  &.grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  // 響應式調整
  @include responsive(md) {
    &.md\:grid-cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }
    &.md\:grid-cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @include responsive(lg) {
    &.lg\:grid-cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }
    &.lg\:grid-cols-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
```

---

## ♿ 無障礙設計

### 對比度要求

```scss
// WCAG 2.1 AA 標準
// 正常文字: 4.5:1
// 大文字(18px+): 3:1
// 圖形/UI組件: 3:1

// 確保對比度的色彩搭配
.text-on-primary {
  background: #3b82f6;
  color: #ffffff; // 對比度 7.5:1 ✅
}

.text-on-light {
  background: #f4f4f5;
  color: #27272a; // 對比度 15.8:1 ✅
}
```

### 焦點樣式

```scss
// 鍵盤焦點樣式
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

// 移除滑鼠焦點樣式
:focus:not(:focus-visible) {
  outline: none;
}

// 自定義焦點樣式
.custom-focus {
  position: relative;

  &:focus-visible::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid #3b82f6;
    border-radius: 10px;
    pointer-events: none;
  }
}
```

### 無障礙標籤

```html
<!-- 按鈕 -->
<button aria-label="刪除問題" aria-pressed="false" role="button" tabindex="0">
  <svg aria-hidden="true">...</svg>
</button>

<!-- 載入狀態 -->
<div role="status" aria-live="polite">
  <span class="sr-only">載入中...</span>
  <div class="spinner"></div>
</div>

<!-- 表單 -->
<div class="input-group">
  <label for="email" id="email-label">
    電子郵件
    <span aria-label="必填">*</span>
  </label>
  <input
    type="email"
    id="email"
    aria-labelledby="email-label"
    aria-describedby="email-error"
    aria-invalid="true"
    aria-required="true"
  />
  <span id="email-error" role="alert"> 請輸入有效的電子郵件 </span>
</div>
```

---

## 🎯 實際應用範例

### 問卷卡片完整樣式

```scss
// 問卷卡片組件
.survey-card {
  // 基礎樣式
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 300ms $easing-smooth;
  cursor: pointer;

  // 懸停效果
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);

    .survey-card-title {
      color: #3b82f6;
    }
  }

  // 頭部
  .survey-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .survey-card-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 6px;

      &.badge-draft {
        background: #fef3c7;
        color: #d97706;
      }

      &.badge-published {
        background: #d1fae5;
        color: #059669;
      }

      &.badge-closed {
        background: #f4f4f5;
        color: #71717a;
      }
    }
  }

  // 標題
  .survey-card-title {
    font-size: 18px;
    font-weight: 600;
    color: #27272a;
    margin-bottom: 8px;
    transition: color 150ms $easing-smooth;
  }

  // 描述
  .survey-card-description {
    font-size: 14px;
    color: #71717a;
    line-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  // 統計
  .survey-card-stats {
    display: flex;
    gap: 24px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f4f4f5;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .stat-icon {
        color: #a1a1aa;
        font-size: 16px;
      }

      .stat-value {
        font-size: 14px;
        font-weight: 500;
        color: #52525b;
      }
    }
  }

  // AI 標記
  &.ai-generated {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #a855f7, #22c55e, #3b82f6);
      animation: shimmer 3s infinite;
    }

    .ai-badge {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
}

// 深色模式調整
[data-theme='dark'] {
  .survey-card {
    background: var(--color-bg-secondary);
    border-color: var(--color-border);

    &:hover {
      border-color: #60a5fa;
      box-shadow: 0 4px 6px rgba(96, 165, 250, 0.2);
    }

    .survey-card-title {
      color: var(--color-text-primary);
    }

    .survey-card-description {
      color: var(--color-text-secondary);
    }
  }
}
```

---

## 📐 開發實用工具類

### Utility Classes

```scss
// 間距工具類
.p-0 {
  padding: 0;
}
.p-1 {
  padding: 4px;
}
.p-2 {
  padding: 8px;
}
.p-3 {
  padding: 12px;
}
.p-4 {
  padding: 16px;
}
.p-5 {
  padding: 20px;
}
.p-6 {
  padding: 24px;
}

.m-0 {
  margin: 0;
}
.m-1 {
  margin: 4px;
}
.m-2 {
  margin: 8px;
}
// ... 以此類推

// Flexbox 工具類
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}

// 文字工具類
.text-xs {
  font-size: 12px;
}
.text-sm {
  font-size: 14px;
}
.text-base {
  font-size: 16px;
}
.text-lg {
  font-size: 18px;
}
.text-xl {
  font-size: 20px;
}

.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}

.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}

// 顏色工具類
.text-primary {
  color: #3b82f6;
}
.text-secondary {
  color: #71717a;
}
.text-success {
  color: #10b981;
}
.text-error {
  color: #ef4444;
}

.bg-primary {
  background-color: #3b82f6;
}
.bg-secondary {
  background-color: #f4f4f5;
}
.bg-white {
  background-color: #ffffff;
}

// 顯示工具類
.hidden {
  display: none;
}
.block {
  display: block;
}
.inline {
  display: inline;
}
.inline-block {
  display: inline-block;
}

// 邊框工具類
.border {
  border: 1px solid #e4e4e7;
}
.border-0 {
  border: 0;
}
.border-t {
  border-top: 1px solid #e4e4e7;
}
.border-b {
  border-bottom: 1px solid #e4e4e7;
}

.rounded {
  border-radius: 4px;
}
.rounded-md {
  border-radius: 8px;
}
.rounded-lg {
  border-radius: 12px;
}
.rounded-full {
  border-radius: 9999px;
}

// 陰影工具類
.shadow-none {
  box-shadow: none;
}
.shadow-sm {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

// 游標工具類
.cursor-pointer {
  cursor: pointer;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}

// 過渡工具類
.transition {
  transition: all 150ms ease;
}
.transition-none {
  transition: none;
}
```

---

## 🚀 Vue3 組件實作指引

### 組件模板結構

```vue
<!-- SurveyCard.vue -->
<template>
  <div
    class="survey-card"
    :class="{
      'ai-generated': survey.isAiGenerated,
      'survey-card-hover': !isDisabled,
    }"
    @click="handleClick"
  >
    <div class="survey-card-header">
      <h3 class="survey-card-title">{{ survey.title }}</h3>
      <span class="survey-card-badge" :class="`badge-${survey.status}`">
        {{ statusLabel }}
      </span>
    </div>

    <p class="survey-card-description">
      {{ survey.description }}
    </p>

    <div class="survey-card-stats">
      <div class="stat-item">
        <Icon name="users" class="stat-icon" />
        <span class="stat-value">{{ survey.responses }}</span>
      </div>
      <div class="stat-item">
        <Icon name="chart" class="stat-icon" />
        <span class="stat-value">{{ completionRate }}%</span>
      </div>
    </div>

    <div v-if="survey.isAiGenerated" class="ai-badge">
      <Icon name="sparkles" />
      AI
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 引入設計系統
@import '@/styles/design-system';

// 組件樣式
.survey-card {
  // 使用設計系統變數
  @include card-base;

  &:hover {
    @include hover-lift;
  }
}
</style>
```

---

## 📋 檢查清單

開發時請確保：

- [ ] 使用正確的顏色變數
- [ ] 保持 8px 間距系統
- [ ] 添加適當的過渡動畫
- [ ] 實現懸停和點擊效果
- [ ] 支援深色模式
- [ ] 確保無障礙標準
- [ ] 響應式設計完整
- [ ] 保持視覺一致性

---

_本設計系統為 SmartSurvey Pro 的官方視覺規範，請嚴格遵循以確保產品體驗的一致性_
