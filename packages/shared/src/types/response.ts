/**
 * 問卷回應相關類型定義
 * 定義問卷填寫、提交和儲存的資料結構
 */

import type { ObjectId } from 'mongodb';

// ============================================================================
// 基礎回應類型
// ============================================================================

/** 問卷回應狀態 */
export type ResponseStatus = 'draft' | 'submitted' | 'completed';

/** 題目答案資料 */
export interface QuestionAnswerData {
  /** 題目 ID */
  questionId: string;
  /** 題目類型 */
  questionType: string;
  /** 答案值（根據題型不同而不同） */
  value: any;
  /** 回答時間 */
  answeredAt: Date;
}

/** 回應元資料 */
export interface ResponseMetadata {
  /** 用戶代理字串 */
  userAgent?: string;
  /** IP 地址 */
  ipAddress?: string;
  /** 推薦來源 */
  referrer?: string;
  /** 螢幕解析度 */
  screenResolution?: string;
  /** 時區 */
  timezone?: string;
  /** 語言偏好 */
  language?: string;
}

/** 提交統計資料 */
export interface SubmissionStats {
  /** 開始填寫時間 */
  startTime: Date;
  /** 完成填寫時間 */
  endTime: Date;
  /** 總填寫時間（秒） */
  duration: number;
  /** 頁面停留時間統計 */
  pageTimings?: Record<string, number>;
}

// ============================================================================
// MongoDB 回應文檔
// ============================================================================

/** 問卷回應文檔（MongoDB） */
export interface ResponseDocument {
  /** 文檔 ID */
  _id?: ObjectId;
  /** 問卷 ID */
  surveyId: ObjectId;
  /** 回應 ID（公開的唯一識別碼） */
  responseId: string;
  /** 回應狀態 */
  status: ResponseStatus;
  /** 題目答案陣列 */
  answers: QuestionAnswerData[];
  /** 填寫統計 */
  stats: SubmissionStats;
  /** 元資料 */
  metadata: ResponseMetadata;
  /** 創建時間 */
  createdAt: Date;
  /** 更新時間 */
  updatedAt: Date;
  /** 提交時間（如果已提交） */
  submittedAt?: Date;
}

// ============================================================================
// API 請求/回應介面
// ============================================================================

/** 提交回應請求 */
export interface SubmitResponseRequest {
  /** 問卷 ID */
  surveyId: string;
  /** 題目答案（以題目 ID 為鍵的物件） */
  answers: Record<string, any>;
  /** 開始填寫時間 */
  startTime: Date;
  /** 完成填寫時間 */
  endTime: Date;
  /** 元資料 */
  metadata?: ResponseMetadata;
}

/** 提交回應回應 */
export interface SubmitResponseResponse {
  /** 提交成功標誌 */
  success: boolean;
  /** 回應 ID */
  responseId: string;
  /** 提交時間 */
  submittedAt: Date;
  /** 訊息 */
  message?: string;
}

/** 儲存進度請求 */
export interface SaveProgressRequest {
  /** 問卷 ID */
  surveyId: string;
  /** 目前答案 */
  answers: Record<string, any>;
  /** 當前題目索引 */
  currentQuestionIndex: number;
  /** 最後修改時間 */
  lastModified: Date;
}

/** 儲存進度回應 */
export interface SaveProgressResponse {
  /** 儲存成功標誌 */
  success: boolean;
  /** 進度 ID */
  progressId: string;
  /** 訊息 */
  message?: string;
}

// ============================================================================
// 驗證和處理相關
// ============================================================================

/** 答案驗證結果 */
export interface AnswerValidationResult {
  /** 是否有效 */
  isValid: boolean;
  /** 錯誤訊息 */
  errors: string[];
  /** 警告訊息 */
  warnings: string[];
}

/** 問卷回應驗證結果 */
export interface ResponseValidationResult {
  /** 整體是否有效 */
  isValid: boolean;
  /** 各題目驗證結果 */
  questionResults: Record<string, AnswerValidationResult>;
  /** 整體錯誤訊息 */
  globalErrors: string[];
}

/** 重複提交檢查結果 */
export interface DuplicateCheckResult {
  /** 是否為重複提交 */
  isDuplicate: boolean;
  /** 現有回應 ID（如果重複） */
  existingResponseId?: string;
  /** 檢查依據 */
  checkCriteria: {
    /** IP 地址匹配 */
    ipMatch?: boolean;
    /** 用戶代理匹配 */
    userAgentMatch?: boolean;
    /** 答案相似度 */
    answerSimilarity?: number;
    /** 時間間隔（分鐘） */
    timeInterval?: number;
  };
}

// ============================================================================
// 統計和分析
// ============================================================================

/** 問卷統計資料 */
export interface SurveyStatistics {
  /** 問卷 ID */
  surveyId: string;
  /** 總回應數 */
  totalResponses: number;
  /** 完成回應數 */
  completedResponses: number;
  /** 草稿回應數 */
  draftResponses: number;
  /** 平均完成時間（秒） */
  averageCompletionTime: number;
  /** 最後更新時間 */
  lastUpdated: Date;
}

/** 題目統計資料 */
export interface QuestionStatistics {
  /** 題目 ID */
  questionId: string;
  /** 題目類型 */
  questionType: string;
  /** 回應總數 */
  responseCount: number;
  /** 跳過總數 */
  skipCount: number;
  /** 回應率 */
  responseRate: number;
  /** 具體統計資料（根據題型不同） */
  stats: any;
}

// ============================================================================
// 匯出說明
// ============================================================================
// 所有類型已在定義時直接 export，此處不需要重複匯出
