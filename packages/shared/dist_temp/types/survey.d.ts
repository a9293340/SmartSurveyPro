/**
 * 問卷系統核心型別定義
 * 定義問卷、題目、邏輯規則等基礎資料結構
 */
import type { EntityId } from './common';
/** 問卷狀態 */
export declare enum SurveyStatus {
  DRAFT = 'draft', // 草稿：編輯中，未發布
  PUBLISHED = 'published', // 已發布：可以收集回應
  PAUSED = 'paused', // 暫停：暫時停止收集回應
  CLOSED = 'closed', // 已關閉：停止收集，可查看統計
  ARCHIVED = 'archived',
}
/** 問卷類型 */
export declare enum SurveyType {
  STANDARD = 'standard', // 標準問卷
  QUIZ = 'quiz', // 測驗問卷
  POLL = 'poll', // 投票問卷
  FORM = 'form',
}
/** 問卷可見性 */
export declare enum SurveyVisibility {
  PUBLIC = 'public', // 公開：任何人都可填寫
  PRIVATE = 'private', // 私人：僅邀請連結可填寫
  PASSWORD = 'password', // 密碼保護
  MEMBERS_ONLY = 'members',
}
/** 問卷發布設定 */
export interface SurveyPublishSettings {
  /** 問卷可見性 */
  visibility: SurveyVisibility;
  /** 密碼保護（當 visibility 為 PASSWORD 時） */
  password?: string;
  /** 開始時間（可選，設定問卷開放填寫時間） */
  startDate?: Date;
  /** 結束時間（可選，設定問卷關閉時間） */
  endDate?: Date;
  /** 回應數量限制（可選，達到上限後自動關閉） */
  responseLimit?: number;
  /** 是否允許匿名回應 */
  allowAnonymous: boolean;
  /** 是否允許重複填寫（同一用戶多次填寫） */
  allowMultipleResponses: boolean;
  /** 填寫完成後的跳轉 URL */
  redirectUrl?: string;
  /** 自訂感謝頁面內容 */
  thankYouMessage?: string;
}
/** 問卷外觀設定 */
export interface SurveyAppearance {
  /** 主題色彩 */
  primaryColor: string;
  /** 背景色彩 */
  backgroundColor: string;
  /** 封面圖片 URL */
  coverImageUrl?: string;
  /** 自訂 CSS */
  customCss?: string;
  /** 字體設定 */
  fontFamily?: string;
}
/** 問卷統計資料 */
export interface SurveyStats {
  /** 總回應數 */
  totalResponses: number;
  /** 完成回應數 */
  completedResponses: number;
  /** 平均完成時間（秒） */
  avgCompletionTime?: number;
  /** 放棄率 */
  abandonmentRate?: number;
  /** 最後回應時間 */
  lastResponseAt?: Date;
}
/** 問卷主要介面 */
export interface Survey {
  /** 問卷唯一識別碼 */
  _id: EntityId;
  /** 問卷標題 */
  title: string;
  /** 問卷描述 */
  description?: string;
  /** 問卷狀態 */
  status: SurveyStatus;
  /** 問卷類型 */
  type: SurveyType;
  /** 問卷擁有者 ID */
  ownerId: EntityId;
  /** 所屬工作區 ID */
  workspaceId: EntityId;
  /** 問卷題目列表 */
  questions: Question[];
  /** 發布設定 */
  publishSettings: SurveyPublishSettings;
  /** 外觀設定 */
  appearance: SurveyAppearance;
  /** 統計資料 */
  stats: SurveyStats;
  /** 完成訊息（便利屬性，對應 publishSettings.thankYouMessage） */
  completionMessage?: string;
  /** 基礎設定（便利屬性，對應 publishSettings 部分內容） */
  settings?: {
    allowAnonymous?: boolean;
    collectIP?: boolean;
    allowMultipleSubmissions?: boolean;
  };
  /** 建立時間 */
  createdAt: Date;
  /** 最後更新時間 */
  updatedAt: Date;
  /** 發布時間 */
  publishedAt?: Date;
}
/** 問卷建構器狀態 */
export interface SurveyBuilderState {
  /** 當前編輯的問卷 */
  currentSurvey: Survey | null;
  /** 選中的題目 ID */
  selectedQuestionId: string | null;
  /** 是否處於預覽模式 */
  isPreviewMode: boolean;
  /** 是否有未儲存的變更 */
  hasUnsavedChanges: boolean;
  /** 拖拽狀態 */
  dragState: {
    isDragging: boolean;
    draggedQuestionType?: string;
    dropZoneIndex?: number;
  };
}
import type { Question } from './question';
