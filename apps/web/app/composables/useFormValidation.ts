/**
 * 問卷表單驗證系統
 * 提供統一的驗證邏輯，支援即時驗證、錯誤提示、視覺化狀態
 *
 * TODO(feature): 條件式驗證規則 - 支援基於其他欄位值的動態驗證規則 (Phase 2)
 * TODO(feature): 自訂驗證規則 - 允許動態注入自訂驗證邏輯 (Phase 2)
 * TODO(feature): 跨欄位驗證 - 支援欄位間的相依性驗證 (Phase 2)
 * TODO(feature): 異步驗證 - 支援需要 API 檢查的驗證規則 (Phase 3)
 */

import { ref, computed, watch, type Ref } from 'vue';
import type { Question, QuestionType } from '@smartsurvey/shared';

// ============================================================================
// 類型定義
// ============================================================================

/** 單一題目驗證結果 */
export interface ValidationResult {
  /** 是否有效 */
  isValid: boolean;
  /** 錯誤訊息列表 */
  errors: string[];
  /** 警告訊息列表 */
  warnings: string[];
  /** 驗證級別 */
  level: 'error' | 'warning' | 'success';
}

/** 驗證規則函數 */
export type ValidationRule = (value: any, question: Question) => ValidationResult;

/** 驗證規則配置 */
export interface ValidationRuleConfig {
  /** 規則名稱 */
  name: string;
  /** 規則函數 */
  rule: ValidationRule;
  /** 是否即時驗證 */
  realtime?: boolean;
  /** 驗證觸發條件 */
  trigger?: 'input' | 'blur' | 'focus' | 'submit';
}

/** 題目驗證狀態 */
export interface QuestionValidationState {
  /** 題目ID */
  questionId: string;
  /** 當前值 */
  value: any;
  /** 驗證結果 */
  result: ValidationResult;
  /** 是否已經觸摸（用戶有過交互） */
  touched: boolean;
  /** 是否正在驗證中 */
  validating: boolean;
  /** 最後驗證時間 */
  lastValidated: Date | null;
}

/** 全域驗證狀態 */
export interface FormValidationState {
  /** 所有題目的驗證狀態 */
  fields: Record<string, QuestionValidationState>;
  /** 是否整個表單有效 */
  isValid: boolean;
  /** 是否有任何錯誤 */
  hasErrors: boolean;
  /** 是否有任何警告 */
  hasWarnings: boolean;
  /** 錯誤數量 */
  errorCount: number;
  /** 警告數量 */
  warningCount: number;
}

// ============================================================================
// 驗證規則實作
// ============================================================================

/** 必填驗證規則 */
const requiredRule: ValidationRule = (value: any, question: Question): ValidationResult => {
  if (!question.required) {
    return { isValid: true, errors: [], warnings: [], level: 'success' };
  }

  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    return {
      isValid: false,
      errors: [question.validation?.errorMessage || '此題目為必填'],
      warnings: [],
      level: 'error',
    };
  }

  return { isValid: true, errors: [], warnings: [], level: 'success' };
};

/** 文字長度驗證規則 */
const textLengthRule: ValidationRule = (value: any, question: Question): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof value !== 'string') {
    return { isValid: true, errors: [], warnings: [], level: 'success' };
  }

  const length = value.length;
  const validation = question.validation as any;

  // 最小長度檢查
  if (validation?.minLength && length > 0 && length < validation.minLength) {
    errors.push(`至少需要 ${validation.minLength} 個字元（目前：${length}）`);
  }

  // 最大長度檢查
  if (validation?.maxLength && length > validation.maxLength) {
    errors.push(`最多只能輸入 ${validation.maxLength} 個字元（目前：${length}）`);
  }

  // 警告：接近長度限制
  if (
    validation?.maxLength &&
    length > validation.maxLength * 0.8 &&
    length <= validation.maxLength
  ) {
    warnings.push(`已接近字數限制 (${length}/${validation.maxLength})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    level: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'success',
  };
};

/** 格式驗證規則 */
const formatRule: ValidationRule = (value: any, question: Question): ValidationResult => {
  const errors: string[] = [];

  if (typeof value !== 'string' || value === '') {
    return { isValid: true, errors: [], warnings: [], level: 'success' };
  }

  const validation = question.validation as any;

  // 正則表達式驗證
  if (validation?.pattern) {
    try {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        errors.push(validation.patternErrorMessage || '格式不正確');
      }
    } catch (error) {
      console.error('[Validation] 正則表達式錯誤:', error);
      errors.push('驗證規則設定錯誤');
    }
  }

  // 內建格式驗證
  switch (question.type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push('請輸入有效的電子郵件地址');
      }
      break;
    }

    case 'url':
      try {
        new URL(value);
      } catch {
        errors.push('請輸入有效的網址');
      }
      break;

    case 'number':
      if (isNaN(Number(value))) {
        errors.push('請輸入有效的數字');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
    level: errors.length > 0 ? 'error' : 'success',
  };
};

/** 數字範圍驗證規則 */
const numberRangeRule: ValidationRule = (value: any, question: Question): ValidationResult => {
  const errors: string[] = [];

  if (question.type !== 'number' && question.type !== 'rating') {
    return { isValid: true, errors: [], warnings: [], level: 'success' };
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return { isValid: true, errors: [], warnings: [], level: 'success' };
  }

  const validation = question.validation as any;
  const config = question.config as any;

  // 數字題範圍驗證
  if (question.type === 'number') {
    if (validation?.min !== undefined && numValue < validation.min) {
      errors.push(`數值不能小於 ${validation.min}`);
    }
    if (validation?.max !== undefined && numValue > validation.max) {
      errors.push(`數值不能大於 ${validation.max}`);
    }
    if (validation?.allowDecimal === false && numValue % 1 !== 0) {
      errors.push('請輸入整數');
    }
  }

  // 評分題範圍驗證
  if (question.type === 'rating') {
    const min = config?.min || 1;
    const max = config?.max || config?.maxRating || 5;
    if (numValue < min || numValue > max) {
      errors.push(`評分必須在 ${min} 到 ${max} 之間`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
    level: errors.length > 0 ? 'error' : 'success',
  };
};

/** 選擇數量驗證規則 */
const choiceCountRule: ValidationRule = (value: any, question: Question): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (question.type !== 'single_choice' && question.type !== 'multiple_choice') {
    return { isValid: true, errors: [], warnings: [], level: 'success' };
  }

  const validation = question.validation as any;
  const config = question.config as any;

  // 單選題：只能選擇一個
  if (question.type === 'single_choice') {
    if (Array.isArray(value) && value.length > 1) {
      errors.push('單選題只能選擇一個選項');
    }
    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      level: errors.length > 0 ? 'error' : 'success',
    };
  }

  // 多選題：檢查選擇數量
  if (question.type === 'multiple_choice' && Array.isArray(value)) {
    const count = value.length;

    // 最少選擇數檢查
    if (validation?.minChoices && count > 0 && count < validation.minChoices) {
      errors.push(`至少需要選擇 ${validation.minChoices} 個選項（目前：${count}）`);
    }

    // 最多選擇數檢查
    const maxChoices = validation?.maxChoices || config?.maxChoices;
    if (maxChoices && count > maxChoices) {
      errors.push(`最多只能選擇 ${maxChoices} 個選項（目前：${count}）`);
    }

    // 警告：接近選擇數量限制
    if (maxChoices && count === maxChoices - 1) {
      warnings.push(`還可以選擇 1 個選項`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    level: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'success',
  };
};

// ============================================================================
// 主要 Composable 函數
// ============================================================================

/**
 * 表單驗證 Composable
 * 提供統一的驗證邏輯和狀態管理
 */
export function useFormValidation(questions: Ref<Question[]>) {
  // ============================================================================
  // 狀態定義
  // ============================================================================

  /** 驗證狀態 */
  const validationState = ref<FormValidationState>({
    fields: {},
    isValid: true,
    hasErrors: false,
    hasWarnings: false,
    errorCount: 0,
    warningCount: 0,
  });

  /** 驗證規則列表 */
  const validationRules: ValidationRuleConfig[] = [
    { name: 'required', rule: requiredRule, realtime: true, trigger: 'blur' },
    { name: 'textLength', rule: textLengthRule, realtime: true, trigger: 'input' },
    { name: 'format', rule: formatRule, realtime: false, trigger: 'blur' },
    { name: 'numberRange', rule: numberRangeRule, realtime: true, trigger: 'input' },
    { name: 'choiceCount', rule: choiceCountRule, realtime: true, trigger: 'input' },
  ];

  // ============================================================================
  // 計算屬性
  // ============================================================================

  /** 獲取特定題目的驗證狀態 */
  const getFieldValidation = computed(() => {
    return (questionId: string): QuestionValidationState | null => {
      return validationState.value.fields[questionId] || null;
    };
  });

  /** 獲取特定題目的錯誤訊息 */
  const getFieldErrors = computed(() => {
    return (questionId: string): string[] => {
      const field = validationState.value.fields[questionId];
      return field?.result.errors || [];
    };
  });

  /** 獲取特定題目的警告訊息 */
  const getFieldWarnings = computed(() => {
    return (questionId: string): string[] => {
      const field = validationState.value.fields[questionId];
      return field?.result.warnings || [];
    };
  });

  /** 檢查特定題目是否有效 */
  const isFieldValid = computed(() => {
    return (questionId: string): boolean => {
      const field = validationState.value.fields[questionId];
      return field?.result.isValid ?? true;
    };
  });

  /** 檢查特定題目是否有錯誤 */
  const hasFieldError = computed(() => {
    return (questionId: string): boolean => {
      const field = validationState.value.fields[questionId];
      return (field?.result.errors.length || 0) > 0;
    };
  });

  /** 所有錯誤題目列表 */
  const errorFields = computed(() => {
    return Object.entries(validationState.value.fields)
      .filter(([_, field]) => !field.result.isValid)
      .map(([questionId, field]) => ({
        questionId,
        question: questions.value.find(q => q.id === questionId),
        errors: field.result.errors,
      }));
  });

  // ============================================================================
  // 核心方法
  // ============================================================================

  /**
   * 初始化題目驗證狀態
   */
  function initializeField(questionId: string, initialValue: any = null): void {
    if (!validationState.value.fields[questionId]) {
      validationState.value.fields[questionId] = {
        questionId,
        value: initialValue,
        result: { isValid: true, errors: [], warnings: [], level: 'success' },
        touched: false,
        validating: false,
        lastValidated: null,
      };
    }
  }

  /**
   * 驗證單一題目
   */
  function validateField(
    questionId: string,
    value: any,
    trigger: 'input' | 'blur' | 'focus' | 'submit' = 'input'
  ): ValidationResult {
    const question = questions.value.find(q => q.id === questionId);
    if (!question) {
      console.warn('[Validation] 找不到題目:', questionId);
      return { isValid: true, errors: [], warnings: [], level: 'success' };
    }

    // 初始化題目狀態
    initializeField(questionId, value);

    const fieldState = validationState.value.fields[questionId];
    if (!fieldState) {
      console.error('[Validation] 無法初始化題目狀態:', questionId);
      return { isValid: false, errors: ['初始化失敗'], warnings: [], level: 'error' };
    }

    if (fieldState) {
      fieldState.value = value;
      fieldState.validating = true;
    }

    // 執行所有適用的驗證規則
    let finalResult: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      level: 'success',
    };
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const ruleConfig of validationRules) {
      // 檢查是否應該執行此規則
      if (ruleConfig.trigger && ruleConfig.trigger !== trigger) {
        continue;
      }

      try {
        const result = ruleConfig.rule(value, question);
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
      } catch (error) {
        console.error(`[Validation] 規則 ${ruleConfig.name} 執行失敗:`, error);
        allErrors.push('驗證過程發生錯誤');
      }
    }

    // 組合最終結果
    finalResult = {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      level: allErrors.length > 0 ? 'error' : allWarnings.length > 0 ? 'warning' : 'success',
    };

    // 更新字段狀態
    if (fieldState) {
      fieldState.result = finalResult;
      fieldState.validating = false;
      fieldState.lastValidated = new Date();
    }

    // 更新全域狀態
    updateGlobalValidationState();

    return finalResult;
  }

  /**
   * 標記題目為已觸摸
   */
  function touchField(questionId: string): void {
    initializeField(questionId);
    const fieldState = validationState.value.fields[questionId];
    if (fieldState) {
      fieldState.touched = true;
    }
  }

  /**
   * 驗證所有題目
   */
  function validateAll(trigger: 'submit' | 'blur' | 'input' = 'submit'): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const question of questions.value) {
      const fieldState = validationState.value.fields[question.id];
      const value = fieldState?.value;

      const result = validateField(question.id, value, trigger);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);

      // 標記為已觸摸
      touchField(question.id);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      level: allErrors.length > 0 ? 'error' : allWarnings.length > 0 ? 'warning' : 'success',
    };
  }

  /**
   * 更新全域驗證狀態
   */
  function updateGlobalValidationState(): void {
    const fields = Object.values(validationState.value.fields);

    validationState.value.isValid = fields.every(field => field.result.isValid);
    validationState.value.hasErrors = fields.some(field => field.result.errors.length > 0);
    validationState.value.hasWarnings = fields.some(field => field.result.warnings.length > 0);
    validationState.value.errorCount = fields.reduce(
      (count, field) => count + field.result.errors.length,
      0
    );
    validationState.value.warningCount = fields.reduce(
      (count, field) => count + field.result.warnings.length,
      0
    );
  }

  /**
   * 重置所有驗證狀態
   */
  function resetValidation(): void {
    validationState.value = {
      fields: {},
      isValid: true,
      hasErrors: false,
      hasWarnings: false,
      errorCount: 0,
      warningCount: 0,
    };
  }

  /**
   * 清除特定題目的驗證狀態
   */
  function clearFieldValidation(questionId: string): void {
    if (validationState.value.fields[questionId]) {
      delete validationState.value.fields[questionId];
      updateGlobalValidationState();
    }
  }

  // ============================================================================
  // 監聽器設置
  // ============================================================================

  // 監聽題目列表變化，自動初始化新題目
  watch(
    questions,
    newQuestions => {
      for (const question of newQuestions) {
        initializeField(question.id);
      }
    },
    { immediate: true, deep: true }
  );

  // ============================================================================
  // 返回公開介面
  // ============================================================================

  return {
    // 狀態
    validationState: readonly(validationState),

    // 計算屬性
    getFieldValidation,
    getFieldErrors,
    getFieldWarnings,
    isFieldValid,
    hasFieldError,
    errorFields,

    // 方法
    validateField,
    validateAll,
    touchField,
    initializeField,
    resetValidation,
    clearFieldValidation,
  };
}

// ============================================================================
// 輔助工具函數
// ============================================================================

/**
 * 獲取驗證狀態對應的 CSS 類名
 */
export function getValidationCssClass(result: ValidationResult): string {
  switch (result.level) {
    case 'error':
      return 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500';
    case 'warning':
      return 'border-amber-500 ring-amber-500 focus:border-amber-500 focus:ring-amber-500';
    case 'success':
      return 'border-green-500 ring-green-500 focus:border-green-500 focus:ring-green-500';
    default:
      return 'border-gray-300 ring-blue-500 focus:border-blue-500 focus:ring-blue-500';
  }
}

/**
 * 獲取驗證狀態對應的圖示
 */
export function getValidationIcon(result: ValidationResult): string {
  switch (result.level) {
    case 'error':
      return 'exclamation-circle';
    case 'warning':
      return 'exclamation-triangle';
    case 'success':
      return 'check-circle';
    default:
      return '';
  }
}

/**
 * 防抖函數 - 用於減少驗證頻率
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
