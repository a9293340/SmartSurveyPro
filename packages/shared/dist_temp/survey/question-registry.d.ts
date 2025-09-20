/**
 * 題型註冊系統
 * 管理所有可用的題型定義，提供題型註冊、查詢和工廠功能
 */
import {
  QuestionType,
  type QuestionTypeDefinition,
  type Question,
  type CreateQuestionParams,
  type QuestionBuilder,
} from '../types/question';
declare class QuestionTypeRegistry implements QuestionBuilder {
  private registry;
  constructor();
  /**
   * 註冊 Phase 1 基礎題型
   */
  private registerPhase1QuestionTypes;
  /**
   * 註冊新的題型定義
   */
  registerQuestionType(definition: QuestionTypeDefinition): void;
  /**
   * 獲取所有已註冊的題型
   */
  getAllQuestionTypes(): QuestionTypeDefinition[];
  /**
   * 獲取所有支援的題型（Phase 1）
   */
  getSupportedQuestionTypes(): QuestionTypeDefinition[];
  /**
   * 根據分類獲取題型
   */
  getQuestionTypesByCategory(category: string): QuestionTypeDefinition[];
  /**
   * 獲取特定題型定義
   */
  getQuestionTypeDefinition(type: QuestionType): QuestionTypeDefinition | undefined;
  /**
   * 檢查題型是否已註冊
   */
  isQuestionTypeRegistered(type: QuestionType): boolean;
  /**
   * 檢查題型是否在 Phase 1 支援
   */
  isQuestionTypeSupported(type: QuestionType): boolean;
  /**
   * 建立新題目
   */
  createQuestion(params: CreateQuestionParams): Question;
  /**
   * 複製題目
   */
  cloneQuestion(question: Question): Question;
  /**
   * 驗證題目資料
   */
  validateQuestion(question: Question): {
    isValid: boolean;
    errors: string[];
  };
  /**
   * 根據題型進行特定驗證
   */
  private validateQuestionByType;
  /**
   * 驗證選擇題
   */
  private validateChoiceQuestion;
  /**
   * 驗證文字題
   */
  private validateTextQuestion;
  /**
   * 驗證評分題
   */
  private validateRatingQuestion;
  /**
   * 生成題目唯一 ID
   */
  private generateQuestionId;
}
/** 題型註冊系統單例 */
export declare const questionRegistry: QuestionTypeRegistry;
/** 匯出類別供測試使用 */
export { QuestionTypeRegistry };
/** 便利函數：獲取所有支援的題型 */
export declare function getSupportedQuestionTypes(): QuestionTypeDefinition[];
/** 便利函數：建立新題目 */
export declare function createQuestion(params: CreateQuestionParams): Question;
/** 便利函數：複製題目 */
export declare function cloneQuestion(question: Question): Question;
/** 便利函數：驗證題目 */
export declare function validateQuestion(question: Question): {
  isValid: boolean;
  errors: string[];
};
