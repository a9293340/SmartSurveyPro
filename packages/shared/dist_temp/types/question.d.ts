/**
 * 題目系統核心型別定義
 * 定義各種題型的資料結構和驗證規則
 */
/** 題目類型 */
export declare enum QuestionType {
  TEXT_SHORT = 'text_short', // 短文字輸入
  TEXT_LONG = 'text_long', // 長文字輸入（多行）
  EMAIL = 'email', // 電子郵件
  NUMBER = 'number', // 數字輸入
  URL = 'url', // 網址輸入
  SINGLE_CHOICE = 'single_choice', // 單選題
  MULTIPLE_CHOICE = 'multiple_choice', // 多選題
  DROPDOWN = 'dropdown', // 下拉選單
  RATING = 'rating', // 星級評分
  SCALE = 'scale', // 量表評分（1-10）
  NET_PROMOTER_SCORE = 'nps', // 淨推薦值（NPS）
  DATE = 'date', // 日期選擇
  TIME = 'time', // 時間選擇
  DATETIME = 'datetime', // 日期時間選擇
  FILE_UPLOAD = 'file_upload', // 檔案上傳
  IMAGE_CHOICE = 'image_choice', // 圖片選擇
  MATRIX = 'matrix', // 矩陣題
  RANKING = 'ranking',
}
/** 基礎驗證規則 */
export interface BaseValidationRule extends Record<string, unknown> {
  /** 是否必填 */
  required: boolean;
  /** 自訂錯誤訊息 */
  errorMessage?: string;
}
/** 文字輸入驗證規則 */
export interface TextValidationRule extends BaseValidationRule {
  /** 最小長度 */
  minLength?: number;
  /** 最大長度 */
  maxLength?: number;
  /** 正則表達式驗證 */
  pattern?: string;
  /** 正則表達式錯誤訊息 */
  patternErrorMessage?: string;
}
/** 數字輸入驗證規則 */
export interface NumberValidationRule extends BaseValidationRule {
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 是否允許小數 */
  allowDecimal?: boolean;
}
/** 選擇題驗證規則 */
export interface ChoiceValidationRule extends BaseValidationRule {
  /** 最少選擇數（多選題用） */
  minChoices?: number;
  /** 最多選擇數（多選題用） */
  maxChoices?: number;
}
/** 檔案上傳驗證規則 */
export interface FileValidationRule extends BaseValidationRule {
  /** 允許的檔案類型 */
  allowedTypes?: string[];
  /** 最大檔案大小（MB） */
  maxSizeInMB?: number;
  /** 最多檔案數量 */
  maxFiles?: number;
}
/** 選項介面（用於單選、多選、下拉等） */
export interface QuestionOption {
  /** 選項 ID */
  id: string;
  /** 選項文字 */
  label: string;
  /** 選項值（提交時的實際值） */
  value: string;
  /** 是否為預設選項 */
  isDefault?: boolean;
  /** 選項圖片 URL（圖片選擇題用） */
  imageUrl?: string;
  /** 是否為「其他」選項（允許自由輸入） */
  isOther?: boolean;
}
/** 評分題配置 */
export interface RatingConfig extends Record<string, unknown> {
  /** 最小分數 */
  min?: number;
  /** 最大分數 */
  max?: number;
  /** 最高評分 */
  maxRating?: number;
  /** 評分類型 */
  ratingType?: 'star' | 'number' | 'scale';
  /** 是否顯示標籤 */
  showLabels?: boolean;
  /** 最低分標籤 */
  minLabel?: string;
  /** 最高分標籤 */
  maxLabel?: string;
  /** 分數標籤（可選） */
  labels?: {
    min?: string;
    max?: string;
  };
  /** 評分圖示類型 */
  iconType?: 'star' | 'heart' | 'thumb' | 'number';
}
/** 量表題配置 */
export interface ScaleConfig extends Record<string, unknown> {
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步進值 */
  step?: number;
  /** 左側標籤 */
  leftLabel?: string;
  /** 右側標籤 */
  rightLabel?: string;
}
/** 題目基礎介面 */
export interface BaseQuestion {
  /** 題目唯一識別碼 */
  id: string;
  /** 題目類型 */
  type: QuestionType;
  /** 題目標題 */
  title: string;
  /** 題目描述（可選的補充說明） */
  description?: string;
  /** 題目在問卷中的順序 */
  order: number;
  /** 是否必填 */
  required: boolean;
  /** 題目是否可見（用於條件邏輯） */
  visible: boolean;
  /** 驗證規則 */
  validation: BaseValidationRule;
  /** 題目設定（根據題型不同會有不同的配置） */
  config: Record<string, unknown>;
}
/** 文字輸入題 */
export interface TextQuestion extends BaseQuestion {
  type: QuestionType.TEXT_SHORT | QuestionType.TEXT_LONG | QuestionType.EMAIL | QuestionType.URL;
  validation: TextValidationRule;
  config: {
    /** 佔位符文字 */
    placeholder?: string;
    /** 預設值 */
    defaultValue?: string;
    /** 輸入類型（短文字題用） */
    inputType?: 'text' | 'email' | 'url' | 'tel';
    /** 字數限制 */
    maxLength?: number;
    /** 顯示行數（長文字題用） */
    rows?: number;
    /** 是否顯示字數統計 */
    showWordCount?: boolean;
    /** 幫助文字 */
    helpText?: string;
  };
}
/** 數字輸入題 */
export interface NumberQuestion extends BaseQuestion {
  type: QuestionType.NUMBER;
  validation: NumberValidationRule;
  config: {
    /** 佔位符文字 */
    placeholder?: string;
    /** 預設值 */
    defaultValue?: number;
  };
}
/** 選擇題（單選/多選/下拉） */
export interface ChoiceQuestion extends BaseQuestion {
  type: QuestionType.SINGLE_CHOICE | QuestionType.MULTIPLE_CHOICE | QuestionType.DROPDOWN;
  validation: ChoiceValidationRule;
  config: {
    /** 選項列表 */
    options: QuestionOption[];
    /** 是否隨機排序選項 */
    randomizeOptions?: boolean;
    /** 其他選項的佔位符 */
    otherPlaceholder?: string;
    /** 是否允許其他選項 */
    allowOther?: boolean;
    /** 最少選擇數（多選題用） */
    minChoices?: number;
    /** 最多選擇數（多選題用） */
    maxChoices?: number;
  };
}
/** 評分題 */
export interface RatingQuestion extends BaseQuestion {
  type: QuestionType.RATING | QuestionType.SCALE | QuestionType.NET_PROMOTER_SCORE;
  validation: BaseValidationRule;
  config: RatingConfig | ScaleConfig;
}
/** 日期時間題 */
export interface DateTimeQuestion extends BaseQuestion {
  type: QuestionType.DATE | QuestionType.TIME | QuestionType.DATETIME;
  validation: BaseValidationRule;
  config: {
    /** 最小日期 */
    minDate?: string;
    /** 最大日期 */
    maxDate?: string;
    /** 預設值 */
    defaultValue?: string;
  };
}
/** 檔案上傳題 */
export interface FileUploadQuestion extends BaseQuestion {
  type: QuestionType.FILE_UPLOAD;
  validation: FileValidationRule;
  config: {
    /** 上傳提示文字 */
    uploadText?: string;
  };
}
/** 統一的題目類型（聯合類型） */
export type Question =
  | TextQuestion
  | NumberQuestion
  | ChoiceQuestion
  | RatingQuestion
  | DateTimeQuestion
  | FileUploadQuestion;
/** 題型定義介面 */
export interface QuestionTypeDefinition {
  /** 題型 ID */
  type: QuestionType;
  /** 顯示名稱 */
  name: string;
  /** 題型描述 */
  description: string;
  /** 題型圖示（CSS class 或 SVG） */
  icon: string;
  /** 題型分類 */
  category: 'text' | 'choice' | 'rating' | 'datetime' | 'file' | 'advanced';
  /** 預設配置 */
  defaultConfig: Record<string, any>;
  /** 預設驗證規則 */
  defaultValidation: BaseValidationRule;
  /** 是否在 Phase 1 支援 */
  isSupported: boolean;
}
/** 建立新題目的工廠函數參數 */
export interface CreateQuestionParams {
  type: QuestionType;
  title?: string;
  order: number;
  config?: Record<string, any>;
}
/** 題目建構器介面 */
export interface QuestionBuilder {
  /** 建立新題目 */
  createQuestion(params: CreateQuestionParams): Question;
  /** 複製題目 */
  cloneQuestion(question: Question): Question;
  /** 驗證題目資料 */
  validateQuestion(question: Question): {
    isValid: boolean;
    errors: string[];
  };
}
/** 安全訪問配置屬性的工具函數 */
export declare function getConfigValue<T = unknown>(
  config: Record<string, unknown>,
  key: string,
  defaultValue?: T
): T;
/** 檢查是否為文字題配置 */
export declare function isTextConfig(
  config: Record<string, unknown>
): config is TextQuestion['config'];
/** 檢查是否為選擇題配置 */
export declare function isChoiceConfig(
  config: Record<string, unknown>
): config is ChoiceQuestion['config'];
/** 檢查是否為評分題配置 */
export declare function isRatingConfig(
  config: Record<string, unknown>
): config is RatingConfig | ScaleConfig;
