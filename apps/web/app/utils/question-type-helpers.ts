/**
 * 題型組件輔助工具
 * 提供類型安全的配置存取和操作
 */

import type { Question } from '@smartsurvey/shared';

// 文字題配置介面
export interface TextQuestionConfig {
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'email' | 'url' | 'tel';
  maxLength?: number;
  rows?: number;
  showWordCount?: boolean;
  helpText?: string;
}

// 選擇題配置介面
export interface ChoiceQuestionConfig {
  options?: Array<{
    id: string;
    label: string;
    value: string;
    isDefault?: boolean;
    isOther?: boolean;
  }>;
  randomizeOptions?: boolean;
  otherPlaceholder?: string;
  allowOther?: boolean;
  minChoices?: number;
  maxChoices?: number;
}

// 評分題配置介面
export interface RatingQuestionConfig {
  min?: number;
  max?: number;
  maxRating?: number;
  ratingType?: 'star' | 'number' | 'scale';
  showLabels?: boolean;
  minLabel?: string;
  maxLabel?: string;
  labels?: {
    min?: string;
    max?: string;
  };
  iconType?: 'star' | 'heart' | 'thumb' | 'number';
}

/**
 * 安全取得文字題配置
 */
export function getTextConfig(question: Question): TextQuestionConfig {
  return (question.config || {}) as TextQuestionConfig;
}

/**
 * 安全取得選擇題配置
 */
export function getChoiceConfig(question: Question): ChoiceQuestionConfig {
  return (question.config || {}) as ChoiceQuestionConfig;
}

/**
 * 安全取得評分題配置
 */
export function getRatingConfig(question: Question): RatingQuestionConfig {
  return (question.config || {}) as RatingQuestionConfig;
}

/**
 * 安全更新題目配置
 */
export function createConfigUpdate<T extends Record<string, unknown>>(
  currentConfig: Record<string, unknown>,
  updates: Partial<T>
): Record<string, unknown> {
  return {
    ...currentConfig,
    ...updates,
  };
}
