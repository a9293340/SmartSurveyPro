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
  type ChoiceValidationRule,
  type TextValidationRule,
} from '../types/question';

// ============================================================================
// Phase 1 支援的題型定義
// ============================================================================

/** Phase 1 基礎題型定義 */
const PHASE1_QUESTION_TYPES: QuestionTypeDefinition[] = [
  {
    type: QuestionType.SINGLE_CHOICE,
    name: '單選題',
    description: '讓受訪者從多個選項中選擇一個答案',
    icon: 'radio-button',
    category: 'choice',
    defaultConfig: {
      options: [
        { id: '1', label: '選項 1', value: 'option1' },
        { id: '2', label: '選項 2', value: 'option2' },
      ],
      randomizeOptions: false,
    },
    defaultValidation: {
      required: false,
    },
    isSupported: true,
  },
  {
    type: QuestionType.MULTIPLE_CHOICE,
    name: '多選題',
    description: '讓受訪者從多個選項中選擇一個或多個答案',
    icon: 'checkbox',
    category: 'choice',
    defaultConfig: {
      options: [
        { id: '1', label: '選項 1', value: 'option1' },
        { id: '2', label: '選項 2', value: 'option2' },
        { id: '3', label: '選項 3', value: 'option3' },
      ],
      randomizeOptions: false,
    },
    defaultValidation: {
      required: false,
      minChoices: 1,
    } as ChoiceValidationRule,
    isSupported: true,
  },
  {
    type: QuestionType.TEXT_SHORT,
    name: '短文字輸入',
    description: '單行文字輸入框，適合姓名、email 等短文字',
    icon: 'text-input',
    category: 'text',
    defaultConfig: {
      placeholder: '請輸入您的答案',
    },
    defaultValidation: {
      required: false,
      maxLength: 200,
    } as TextValidationRule,
    isSupported: true,
  },
  {
    type: QuestionType.TEXT_LONG,
    name: '長文字輸入',
    description: '多行文字輸入框，適合意見、建議等長文字',
    icon: 'textarea',
    category: 'text',
    defaultConfig: {
      placeholder: '請輸入您的詳細意見',
    },
    defaultValidation: {
      required: false,
      maxLength: 1000,
    } as TextValidationRule,
    isSupported: true,
  },
  {
    type: QuestionType.RATING,
    name: '評分題',
    description: '星級評分，適合滿意度調查',
    icon: 'star',
    category: 'rating',
    defaultConfig: {
      min: 1,
      max: 5,
      iconType: 'star',
      labels: {
        min: '非常不滿意',
        max: '非常滿意',
      },
    },
    defaultValidation: {
      required: false,
    },
    isSupported: true,
  },
];

// ============================================================================
// 題型註冊系統類別
// ============================================================================

class QuestionTypeRegistry implements QuestionBuilder {
  private registry = new Map<QuestionType, QuestionTypeDefinition>();

  constructor() {
    // 註冊 Phase 1 支援的題型
    this.registerPhase1QuestionTypes();
  }

  /**
   * 註冊 Phase 1 基礎題型
   */
  private registerPhase1QuestionTypes(): void {
    PHASE1_QUESTION_TYPES.forEach(definition => {
      this.registry.set(definition.type, definition);
    });
  }

  /**
   * 註冊新的題型定義
   */
  registerQuestionType(definition: QuestionTypeDefinition): void {
    this.registry.set(definition.type, definition);
  }

  /**
   * 獲取所有已註冊的題型
   */
  getAllQuestionTypes(): QuestionTypeDefinition[] {
    return Array.from(this.registry.values());
  }

  /**
   * 獲取所有支援的題型（Phase 1）
   */
  getSupportedQuestionTypes(): QuestionTypeDefinition[] {
    return this.getAllQuestionTypes().filter(def => def.isSupported);
  }

  /**
   * 根據分類獲取題型
   */
  getQuestionTypesByCategory(category: string): QuestionTypeDefinition[] {
    return this.getAllQuestionTypes().filter(def => def.category === category);
  }

  /**
   * 獲取特定題型定義
   */
  getQuestionTypeDefinition(type: QuestionType): QuestionTypeDefinition | undefined {
    return this.registry.get(type);
  }

  /**
   * 檢查題型是否已註冊
   */
  isQuestionTypeRegistered(type: QuestionType): boolean {
    return this.registry.has(type);
  }

  /**
   * 檢查題型是否在 Phase 1 支援
   */
  isQuestionTypeSupported(type: QuestionType): boolean {
    const definition = this.registry.get(type);
    return definition?.isSupported ?? false;
  }

  // ============================================================================
  // QuestionBuilder 介面實作
  // ============================================================================

  /**
   * 建立新題目
   */
  createQuestion(params: CreateQuestionParams): Question {
    const definition = this.getQuestionTypeDefinition(params.type);

    if (!definition) {
      throw new Error(`未註冊的題型: ${params.type}`);
    }

    if (!definition.isSupported) {
      throw new Error(`題型 ${params.type} 在當前版本不支援`);
    }

    // 生成唯一 ID
    const id = this.generateQuestionId();

    // 合併預設配置和自訂配置
    const config = {
      ...definition.defaultConfig,
      ...params.config,
    };

    // 建立基礎題目物件
    const baseQuestion: Question = {
      id,
      type: params.type,
      title: params.title || `新的${definition.name}`,
      order: params.order,
      required: definition.defaultValidation.required,
      visible: true,
      validation: { ...definition.defaultValidation },
      config,
    } as Question;

    return baseQuestion;
  }

  /**
   * 複製題目
   */
  cloneQuestion(question: Question): Question {
    const newId = this.generateQuestionId();

    return {
      ...question,
      id: newId,
      title: `${question.title} (副本)`,
      // 深拷貝配置物件
      config: JSON.parse(JSON.stringify(question.config)),
      validation: JSON.parse(JSON.stringify(question.validation)),
    };
  }

  /**
   * 驗證題目資料
   */
  validateQuestion(question: Question): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 檢查題型是否已註冊
    if (!this.isQuestionTypeRegistered(question.type)) {
      errors.push(`未註冊的題型: ${question.type}`);
    }

    // 檢查必要欄位
    if (!question.id) {
      errors.push('題目 ID 不能為空');
    }

    if (!question.title?.trim()) {
      errors.push('題目標題不能為空');
    }

    if (typeof question.order !== 'number' || question.order < 0) {
      errors.push('題目順序必須是非負數');
    }

    // 檢查題型特定的驗證
    this.validateQuestionByType(question, errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 根據題型進行特定驗證
   */
  private validateQuestionByType(question: Question, errors: string[]): void {
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.MULTIPLE_CHOICE:
        this.validateChoiceQuestion(question, errors);
        break;
      case QuestionType.TEXT_SHORT:
      case QuestionType.TEXT_LONG:
        this.validateTextQuestion(question, errors);
        break;
      case QuestionType.RATING:
        this.validateRatingQuestion(question, errors);
        break;
      // 其他題型的驗證...
    }
  }

  /**
   * 驗證選擇題
   */
  private validateChoiceQuestion(question: Question, errors: string[]): void {
    const config = question.config as any;
    const options = config.options;

    if (!Array.isArray(options) || options.length < 2) {
      errors.push('選擇題至少需要兩個選項');
    }

    if (options) {
      const duplicateValues = new Set();
      options.forEach((option: any, index: number) => {
        if (!option.label?.trim()) {
          errors.push(`選項 ${index + 1} 的標籤不能為空`);
        }
        if (!option.value?.trim()) {
          errors.push(`選項 ${index + 1} 的值不能為空`);
        }
        if (duplicateValues.has(option.value)) {
          errors.push(`選項值 "${option.value}" 重複`);
        }
        duplicateValues.add(option.value);
      });
    }
  }

  /**
   * 驗證文字題
   */
  private validateTextQuestion(question: Question, errors: string[]): void {
    const validation = question.validation as any;

    if (validation.maxLength && validation.maxLength <= 0) {
      errors.push('最大長度必須大於 0');
    }

    if (validation.minLength && validation.minLength < 0) {
      errors.push('最小長度不能小於 0');
    }

    if (
      validation.minLength &&
      validation.maxLength &&
      validation.minLength > validation.maxLength
    ) {
      errors.push('最小長度不能大於最大長度');
    }
  }

  /**
   * 驗證評分題
   */
  private validateRatingQuestion(question: Question, errors: string[]): void {
    const config = question.config as any;

    if (!config.min || !config.max) {
      errors.push('評分題必須設定最小值和最大值');
    }

    if (config.min >= config.max) {
      errors.push('最小值必須小於最大值');
    }

    if (config.min < 1) {
      errors.push('評分最小值不能小於 1');
    }
  }

  /**
   * 生成題目唯一 ID
   */
  private generateQuestionId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// ============================================================================
// 匯出單例實例
// ============================================================================

/** 題型註冊系統單例 */
export const questionRegistry = new QuestionTypeRegistry();

/** 匯出類別供測試使用 */
export { QuestionTypeRegistry };

/** 便利函數：獲取所有支援的題型 */
export function getSupportedQuestionTypes(): QuestionTypeDefinition[] {
  return questionRegistry.getSupportedQuestionTypes();
}

/** 便利函數：建立新題目 */
export function createQuestion(params: CreateQuestionParams): Question {
  return questionRegistry.createQuestion(params);
}

/** 便利函數：複製題目 */
export function cloneQuestion(question: Question): Question {
  return questionRegistry.cloneQuestion(question);
}

/** 便利函數：驗證題目 */
export function validateQuestion(question: Question): { isValid: boolean; errors: string[] } {
  return questionRegistry.validateQuestion(question);
}
