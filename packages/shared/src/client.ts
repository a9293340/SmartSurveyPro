/**
 * SmartSurvey Pro - 客戶端安全的共享套件入口點
 * 只匯出類型和常數，不包含伺服器端依賴
 */

// 基礎版本資訊
export const VERSION = '0.0.1';

// === 問卷系統類型 ===
export * from './types/survey.js';
export * from './types/question.js';
export * from './types/response.js';

// === 基礎類型定義 ===
export * from './types/common.js';
export * from './types/user.js';
export * from './types/group.js';
export * from './types/permission.js';
export * from './types/invitation.js';
export * from './types/relationship.js';

// === 驗證 Schemas (客戶端安全) ===
export * from './schemas/survey.js';
export * from './schemas/response.js';
export * from './schemas/common.js';
export * from './schemas/user.js';
export * from './schemas/group.js';
export * from './schemas/permission.js';
export * from './schemas/invitation.js';
export * from './schemas/relationship.js';

// === 系統常數 ===
export * from './constants/index.js';

// === 客戶端安全的工具函數 ===
// TODO(future): 可以在這裡加入客戶端可使用的工具函數

// 套件準備狀態
export const SHARED_CLIENT_READY = true;
