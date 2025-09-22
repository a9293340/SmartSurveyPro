/**
 * SmartSurvey Pro - 伺服器端專用導出
 * 此檔案只能在 Node.js 伺服器環境中使用
 */

// 重新導出所有客戶端安全的內容（內聯以避免模組解析問題）
// 基礎版本資訊
export const VERSION = '0.0.1';

// === 問卷系統 ===
// 重新導出問卷和題目相關類型（內聯以避免模組解析問題）
export type {
  Survey,
  SurveyStatus,
  SurveyType,
  SurveyVisibility,
  SurveyPublishSettings,
  SurveyAppearance,
  SurveyStats,
  SurveyBuilderState,
} from './types/survey.js';

export type {
  Question,
  QuestionType,
  QuestionOption,
  BaseQuestion,
  TextQuestion,
  NumberQuestion,
  ChoiceQuestion,
  RatingQuestion,
  DateTimeQuestion,
  FileUploadQuestion,
  BaseValidationRule,
  TextValidationRule,
  NumberValidationRule,
  ChoiceValidationRule,
  FileValidationRule,
  RatingConfig,
  ScaleConfig,
  QuestionTypeDefinition,
  CreateQuestionParams,
  QuestionBuilder,
} from './types/question.js';

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

// 套件準備狀態
export const SHARED_READY = true;

// === 伺服器端專用功能 ===

// 資料庫連接
export { connectToDatabase, getDatabase, dbConnection } from './db/connection.js';

// Redis 連接和 Key 管理
export {
  connectToRedis,
  getRedisClient,
  redisConnection,
  RedisHelper,
  getRedisHelper,
} from './db/redis.js';

export { RedisKeyBuilder, RedisKeys, RedisKeyUtils } from './db/redis-keys.js';

// 健康檢查系統
export {
  performHealthCheck,
  quickHealthCheck,
  detailedHealthCheck,
  type HealthCheckResult,
  type ServiceHealth,
  type HealthCheckConfig,
} from './health/database-health.js';
