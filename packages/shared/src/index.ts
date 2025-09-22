// SmartSurvey Pro - 共享套件入口點

// 基礎版本資訊
export const VERSION = '0.0.1';

// === 問卷系統 ===
export * from './types/survey.js';
export * from './types/question.js';
export * from './types/response.js';
export * from './schemas/survey.js';
export * from './schemas/response.js';
export * from './survey/question-registry.js';

// === 類型定義 ===
// 共用類型
export * from './types/common.js';

// 用戶相關類型
export * from './types/user.js';

// 群組和訂閱相關類型
export * from './types/group.js';

// 權限系統相關類型
export * from './types/permission.js';

// 邀請系統相關類型
export * from './types/invitation.js';

// 關聯表相關類型
export * from './types/relationship.js';

// === 驗證 Schemas ===
// 共用驗證 schemas
export * from './schemas/common.js';

// 用戶驗證 schemas
export * from './schemas/user.js';

// 群組驗證 schemas
export * from './schemas/group.js';

// 權限驗證 schemas
export * from './schemas/permission.js';

// 邀請驗證 schemas
export * from './schemas/invitation.js';

// 關聯表驗證 schemas
export * from './schemas/relationship.js';

// === 系統常數 ===
export * from './constants/index.js';

// === 伺服器端工具 ===
export * from './server.js';
export { getClient } from './db/connection.js';

// 套件準備狀態
export const SHARED_READY = true;
