/**
 * 題目管理專用 Store
 * 專門處理題目的 CRUD 操作、驗證、複製等功能
 */

import type { Question, QuestionOption } from '@smartsurvey/shared';
import {
  QuestionType,
  cloneQuestion,
  getSupportedQuestionTypes,
  validateQuestion,
} from '@smartsurvey/shared';
import { defineStore } from 'pinia';
import { computed, readonly, ref } from 'vue';
import { useBuilderStore } from './builder';

// ============================================================================
// 題目操作相關型別
// ============================================================================

/** 題目操作結果 */
interface QuestionOperationResult {
  success: boolean;
  message: string;
  question?: Question;
}

/** 批量操作結果 */
interface BatchOperationResult {
  success: boolean;
  successCount: number;
  failureCount: number;
  errors: string[];
}

/** 題目搜尋條件 */
interface QuestionSearchCriteria {
  type?: (typeof QuestionType)[keyof typeof QuestionType];
  required?: boolean;
  titleContains?: string;
}

// ============================================================================
// 題目管理 Store
// ============================================================================

export const useQuestionsStore = defineStore('questions', () => {
  // ============================================================================
  // 依賴的 Store
  // ============================================================================

  const builderStore = useBuilderStore();

  // ============================================================================
  // 狀態
  // ============================================================================

  /** 剪貼簿中的題目 */
  const clipboard = ref<Question | null>(null);

  /** 最後操作的題目 ID */
  const lastOperatedQuestionId = ref<string | null>(null);

  /** 題目操作歷史記錄 */
  const operationHistory = ref<string[]>([]);

  // 批量操作相關狀態

  /** 批量選擇的題目 ID 列表 */
  const selectedQuestionIds = ref<Set<string>>(new Set());

  /** 是否處於批量操作模式 */
  const isBatchMode = ref(false);

  // ============================================================================
  // 計算屬性
  // ============================================================================

  /** 當前問卷的所有題目 */
  const allQuestions = computed((): Question[] => {
    return builderStore.currentSurvey?.questions || [];
  });

  /** 支援的題型列表 */
  const supportedQuestionTypes = computed(() => {
    return getSupportedQuestionTypes();
  });

  /** 題目統計資訊 */
  const questionStats = computed(() => {
    const questions = allQuestions.value;
    const typeCount = new Map<(typeof QuestionType)[keyof typeof QuestionType], number>();
    let requiredCount = 0;

    questions.forEach(question => {
      // 統計題型數量
      const currentCount = typeCount.get(question.type) || 0;
      typeCount.set(question.type, currentCount + 1);

      // 統計必填題數量
      if (question.required) {
        requiredCount++;
      }
    });

    return {
      total: questions.length,
      required: requiredCount,
      optional: questions.length - requiredCount,
      typeDistribution: Object.fromEntries(typeCount),
    };
  });

  /** 選中的題目列表 */
  const selectedQuestions = computed((): Question[] => {
    return allQuestions.value.filter(q => selectedQuestionIds.value.has(q.id));
  });

  /** 題目驗證統計 */
  const validationStats = computed(() => {
    const questions = allQuestions.value;
    let validCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];

    questions.forEach((question, index) => {
      const validation = validateQuestion(question);
      if (validation.isValid) {
        validCount++;
      } else {
        invalidCount++;
        errors.push(`題目 ${index + 1}: ${validation.errors.join(', ')}`);
      }
    });

    return {
      valid: validCount,
      invalid: invalidCount,
      total: questions.length,
      errors,
    };
  });

  // ============================================================================
  // 基礎 CRUD 操作
  // ============================================================================

  /**
   * 新增題目到指定位置
   */
  function addQuestionAt(
    type: (typeof QuestionType)[keyof typeof QuestionType],
    position: number
  ): QuestionOperationResult {
    try {
      const question = builderStore.addQuestion(type, position);
      lastOperatedQuestionId.value = question.id;
      addToOperationHistory(`新增${getQuestionTypeName(type)}`);

      return {
        success: true,
        message: `成功新增${getQuestionTypeName(type)}`,
        question,
      };
    } catch (error) {
      return {
        success: false,
        message: `新增題目失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
      };
    }
  }

  /**
   * 在末尾新增題目
   */
  function addQuestion(
    type: (typeof QuestionType)[keyof typeof QuestionType]
  ): QuestionOperationResult {
    return addQuestionAt(type, allQuestions.value.length);
  }

  /**
   * 在選中題目後新增題目
   */
  function addQuestionAfterSelected(
    type: (typeof QuestionType)[keyof typeof QuestionType]
  ): QuestionOperationResult {
    const selectedId = builderStore.selectedQuestionId;
    if (!selectedId) {
      return addQuestion(type);
    }

    const selectedIndex = allQuestions.value.findIndex(q => q.id === selectedId);
    if (selectedIndex === -1) {
      return addQuestion(type);
    }

    return addQuestionAt(type, selectedIndex + 1);
  }

  /**
   * 複製題目
   */
  function duplicateQuestion(questionId: string): QuestionOperationResult {
    const question = allQuestions.value.find(q => q.id === questionId);
    if (!question) {
      return {
        success: false,
        message: '找不到要複製的題目',
      };
    }

    try {
      const clonedQuestion = cloneQuestion(question);
      const questionIndex = allQuestions.value.findIndex(q => q.id === questionId);
      const newQuestion = builderStore.addQuestion(clonedQuestion.type, questionIndex + 1);

      // 複製配置到新題目
      builderStore.updateQuestion(newQuestion.id, {
        title: clonedQuestion.title,
        description: clonedQuestion.description,
        required: clonedQuestion.required,
        config: clonedQuestion.config,
        validation: clonedQuestion.validation,
      });

      lastOperatedQuestionId.value = newQuestion.id;
      addToOperationHistory(`複製題目: ${question.title}`);

      return {
        success: true,
        message: '成功複製題目',
        question: newQuestion,
      };
    } catch (error) {
      return {
        success: false,
        message: `複製題目失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
      };
    }
  }

  /**
   * 刪除題目
   */
  function deleteQuestion(questionId: string): QuestionOperationResult {
    const question = allQuestions.value.find(q => q.id === questionId);
    if (!question) {
      return {
        success: false,
        message: '找不到要刪除的題目',
      };
    }

    const success = builderStore.deleteQuestion(questionId);
    if (success) {
      lastOperatedQuestionId.value = null;
      addToOperationHistory(`刪除題目: ${question.title}`);

      return {
        success: true,
        message: '成功刪除題目',
      };
    } else {
      return {
        success: false,
        message: '刪除題目失敗',
      };
    }
  }

  // ============================================================================
  // 題目移動和排序
  // ============================================================================

  /**
   * 移動題目到指定位置
   */
  function moveQuestion(questionId: string, newPosition: number): QuestionOperationResult {
    if (!builderStore.currentSurvey) {
      return {
        success: false,
        message: '沒有載入問卷',
      };
    }

    const questions = builderStore.currentSurvey.questions;
    const currentIndex = questions.findIndex((q: Question) => q.id === questionId);

    if (currentIndex === -1) {
      return {
        success: false,
        message: '找不到要移動的題目',
      };
    }

    if (newPosition < 0 || newPosition >= questions.length) {
      return {
        success: false,
        message: '移動位置無效',
      };
    }

    if (currentIndex === newPosition) {
      return {
        success: true,
        message: '題目位置未變更',
      };
    }

    // 直接使用 builder store 的方法，它會處理所有的狀態更新
    const success = builderStore.deleteQuestion(questionId);
    if (!success) {
      return {
        success: false,
        message: '移動失敗：無法刪除原題目',
      };
    }

    // 檢查題目是否存在
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) {
      return { success: false, message: '找不到要移動的題目' };
    }

    // 在新位置添加題目
    const movedQuestion = builderStore.addQuestion(currentQuestion.type, newPosition);

    // 恢復題目內容
    builderStore.updateQuestion(movedQuestion.id, {
      title: currentQuestion.title,
      description: currentQuestion.description,
      required: currentQuestion.required,
      config: currentQuestion.config,
      validation: currentQuestion.validation,
    });

    lastOperatedQuestionId.value = movedQuestion.id;
    addToOperationHistory(`移動題目: ${currentQuestion.title}`);

    return {
      success: true,
      message: '成功移動題目',
      question: movedQuestion,
    };
  }

  /**
   * 向上移動題目
   */
  function moveQuestionUp(questionId: string): QuestionOperationResult {
    const currentIndex = allQuestions.value.findIndex(q => q.id === questionId);
    if (currentIndex <= 0) {
      return {
        success: false,
        message: '題目已在最上方',
      };
    }
    return moveQuestion(questionId, currentIndex - 1);
  }

  /**
   * 向下移動題目
   */
  function moveQuestionDown(questionId: string): QuestionOperationResult {
    const currentIndex = allQuestions.value.findIndex(q => q.id === questionId);
    if (currentIndex === -1 || currentIndex >= allQuestions.value.length - 1) {
      return {
        success: false,
        message: '題目已在最下方',
      };
    }
    return moveQuestion(questionId, currentIndex + 1);
  }

  // ============================================================================
  // 剪貼簿操作
  // ============================================================================

  /**
   * 複製題目到剪貼簿
   */
  function copyToClipboard(questionId: string): QuestionOperationResult {
    const question = allQuestions.value.find(q => q.id === questionId);
    if (!question) {
      return {
        success: false,
        message: '找不到要複製的題目',
      };
    }

    clipboard.value = cloneQuestion(question);
    addToOperationHistory(`複製題目到剪貼簿: ${question.title}`);

    return {
      success: true,
      message: '題目已複製到剪貼簿',
    };
  }

  /**
   * 從剪貼簿貼上題目
   */
  function pasteFromClipboard(position?: number): QuestionOperationResult {
    if (!clipboard.value) {
      return {
        success: false,
        message: '剪貼簿為空',
      };
    }

    try {
      const insertPosition = position ?? allQuestions.value.length;
      const newQuestion = builderStore.addQuestion(clipboard.value.type, insertPosition);

      // 應用剪貼簿中的配置
      builderStore.updateQuestion(newQuestion.id, {
        title: clipboard.value.title,
        description: clipboard.value.description,
        required: clipboard.value.required,
        config: clipboard.value.config,
        validation: clipboard.value.validation,
      });

      lastOperatedQuestionId.value = newQuestion.id;
      addToOperationHistory(`從剪貼簿貼上: ${clipboard.value.title}`);

      return {
        success: true,
        message: '成功從剪貼簿貼上題目',
        question: newQuestion,
      };
    } catch (error) {
      return {
        success: false,
        message: `貼上失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
      };
    }
  }

  /**
   * 清空剪貼簿
   */
  function clearClipboard(): void {
    clipboard.value = null;
    addToOperationHistory('清空剪貼簿');
  }

  // ============================================================================
  // 批量操作
  // ============================================================================

  /**
   * 切換批量模式
   */
  function toggleBatchMode(): void {
    isBatchMode.value = !isBatchMode.value;
    if (!isBatchMode.value) {
      clearSelection();
    }
  }

  /**
   * 選擇/取消選擇題目
   */
  function toggleQuestionSelection(questionId: string): void {
    if (selectedQuestionIds.value.has(questionId)) {
      selectedQuestionIds.value.delete(questionId);
    } else {
      selectedQuestionIds.value.add(questionId);
    }
  }

  /**
   * 選擇所有題目
   */
  function selectAllQuestions(): void {
    selectedQuestionIds.value.clear();
    allQuestions.value.forEach(question => {
      selectedQuestionIds.value.add(question.id);
    });
  }

  /**
   * 清除選擇
   */
  function clearSelection(): void {
    selectedQuestionIds.value.clear();
  }

  /**
   * 批量刪除選中的題目
   */
  function deleteSelectedQuestions(): BatchOperationResult {
    const questionIds = Array.from(selectedQuestionIds.value);
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    questionIds.forEach(questionId => {
      const result = deleteQuestion(questionId);
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
        errors.push(result.message);
      }
    });

    clearSelection();
    addToOperationHistory(`批量刪除 ${successCount} 個題目`);

    return {
      success: failureCount === 0,
      successCount,
      failureCount,
      errors,
    };
  }

  /**
   * 批量更新選中題目的屬性
   */
  function batchUpdateSelectedQuestions(updates: {
    required?: boolean;
    visible?: boolean;
  }): BatchOperationResult {
    const questionIds = Array.from(selectedQuestionIds.value);
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // 儲存原始狀態以便回滾
    const originalStates = new Map<string, any>();

    questionIds.forEach(questionId => {
      const question = allQuestions.value.find(q => q.id === questionId);
      if (question) {
        originalStates.set(questionId, {
          required: question.required,
          visible: question.visible,
        });
      }
    });

    try {
      // 執行批量更新
      questionIds.forEach(questionId => {
        const success = builderStore.updateQuestion(questionId, updates);
        if (success) {
          successCount++;
        } else {
          failureCount++;
          errors.push(`更新題目 ${questionId} 失敗`);
        }
      });

      // 如果有失敗，回滾所有變更
      if (failureCount > 0) {
        console.warn('[BatchUpdate] 部分更新失敗，正在回滾');
        originalStates.forEach((state, questionId) => {
          builderStore.updateQuestion(questionId, state);
        });

        return {
          success: false,
          successCount: 0,
          failureCount: questionIds.length,
          errors: ['批量更新失敗，已回滾所有變更'],
        };
      }

      addToOperationHistory(`批量更新 ${successCount} 個題目`);

      return {
        success: true,
        successCount,
        failureCount: 0,
        errors: [],
      };
    } catch (error) {
      // 發生異常，回滾所有變更
      console.error('[BatchUpdate] 批量更新異常:', error);
      originalStates.forEach((state, questionId) => {
        builderStore.updateQuestion(questionId, state);
      });

      return {
        success: false,
        successCount: 0,
        failureCount: questionIds.length,
        errors: [`批量更新異常: ${error instanceof Error ? error.message : '未知錯誤'}`],
      };
    }
  }

  /**
   * 批量複製選中的題目
   */
  function batchDuplicateSelectedQuestions(): BatchOperationResult {
    const questionIds = Array.from(selectedQuestionIds.value);
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];
    const newQuestionIds: string[] = [];

    try {
      questionIds.forEach(questionId => {
        const result = duplicateQuestion(questionId);
        if (result.success) {
          successCount++;
          if (result.question) {
            newQuestionIds.push(result.question.id);
          }
        } else {
          failureCount++;
          errors.push(result.message);
        }
      });

      // 如果成功，選中新複製的題目
      if (successCount > 0) {
        clearSelection();
        newQuestionIds.forEach(id => {
          selectedQuestionIds.value.add(id);
        });
      }

      addToOperationHistory(`批量複製 ${successCount} 個題目`);

      return {
        success: failureCount === 0,
        successCount,
        failureCount,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        successCount,
        failureCount: questionIds.length - successCount,
        errors: [`批量複製異常: ${error instanceof Error ? error.message : '未知錯誤'}`],
      };
    }
  }

  // ============================================================================
  // 搜尋和篩選
  // ============================================================================

  /**
   * 搜尋題目
   */
  function searchQuestions(criteria: QuestionSearchCriteria): Question[] {
    return allQuestions.value.filter(question => {
      // 按題型篩選
      if (criteria.type && question.type !== criteria.type) {
        return false;
      }

      // 按必填狀態篩選
      if (criteria.required !== undefined && question.required !== criteria.required) {
        return false;
      }

      // 按標題內容篩選
      if (criteria.titleContains) {
        const title = question.title.toLowerCase();
        const searchTerm = criteria.titleContains.toLowerCase();
        if (!title.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * 獲取特定題型的題目
   */
  function getQuestionsByType(type: (typeof QuestionType)[keyof typeof QuestionType]): Question[] {
    return allQuestions.value.filter(question => question.type === type);
  }

  /**
   * 獲取必填題目
   */
  function getRequiredQuestions(): Question[] {
    return allQuestions.value.filter(question => question.required);
  }

  /**
   * 獲取無效的題目
   */
  function getInvalidQuestions(): Question[] {
    return allQuestions.value.filter(question => {
      const validation = validateQuestion(question);
      return !validation.isValid;
    });
  }

  // ============================================================================
  // 選項管理（針對選擇題）
  // ============================================================================

  /**
   * 為選擇題新增選項
   */
  function addOptionToQuestion(
    questionId: string,
    label: string,
    value?: string
  ): QuestionOperationResult {
    const question = allQuestions.value.find(q => q.id === questionId);
    if (!question) {
      return {
        success: false,
        message: '找不到題目',
      };
    }

    // 檢查是否為選擇題
    if (
      ![QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE, QuestionType.DROPDOWN].includes(
        question.type
      )
    ) {
      return {
        success: false,
        message: '此題型不支援選項操作',
      };
    }

    // 確保是選擇題的配置類型，才有 options 屬性
    const config = question.config as { options?: QuestionOption[] };
    if (!config.options) {
      config.options = [];
    }

    const newOption: QuestionOption = {
      id: `option_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      label: label.trim(),
      value: value || label.toLowerCase().replace(/\s+/g, '_'),
    };

    config.options.push(newOption);
    builderStore.updateQuestion(questionId, { config });
    addToOperationHistory(`新增選項: ${label}`);

    return {
      success: true,
      message: '成功新增選項',
    };
  }

  /**
   * 刪除選擇題的選項
   */
  function removeOptionFromQuestion(questionId: string, optionId: string): QuestionOperationResult {
    const question = allQuestions.value.find(q => q.id === questionId);
    if (!question) {
      return {
        success: false,
        message: '找不到題目',
      };
    }

    // 確保是選擇題的配置類型，才有 options 屬性
    const config = question.config as { options?: QuestionOption[] };
    if (!config.options || !Array.isArray(config.options)) {
      return {
        success: false,
        message: '題目沒有選項',
      };
    }

    const optionIndex = config.options.findIndex(
      (option: QuestionOption) => option.id === optionId
    );
    if (optionIndex === -1) {
      return {
        success: false,
        message: '找不到要刪除的選項',
      };
    }

    // 確保至少保留兩個選項
    if (config.options.length <= 2) {
      return {
        success: false,
        message: '選擇題至少需要兩個選項',
      };
    }

    const removedOption = config.options[optionIndex];
    config.options.splice(optionIndex, 1);
    builderStore.updateQuestion(questionId, { config });
    if (removedOption) {
      addToOperationHistory(`刪除選項: ${removedOption.label}`);
    }

    return {
      success: true,
      message: '成功刪除選項',
    };
  }

  // ============================================================================
  // 工具方法
  // ============================================================================

  /**
   * 獲取題型顯示名稱
   */
  function getQuestionTypeName(type: (typeof QuestionType)[keyof typeof QuestionType]): string {
    const typeNames: Record<(typeof QuestionType)[keyof typeof QuestionType], string> = {
      [QuestionType.SINGLE_CHOICE]: '單選題',
      [QuestionType.MULTIPLE_CHOICE]: '多選題',
      [QuestionType.TEXT_SHORT]: '短文字',
      [QuestionType.TEXT_LONG]: '長文字',
      [QuestionType.RATING]: '評分題',
      [QuestionType.EMAIL]: '電子郵件',
      [QuestionType.NUMBER]: '數字',
      [QuestionType.URL]: '網址',
      [QuestionType.DROPDOWN]: '下拉選單',
      [QuestionType.SCALE]: '量表',
      [QuestionType.NET_PROMOTER_SCORE]: 'NPS',
      [QuestionType.DATE]: '日期',
      [QuestionType.TIME]: '時間',
      [QuestionType.DATETIME]: '日期時間',
      [QuestionType.FILE_UPLOAD]: '檔案上傳',
      [QuestionType.IMAGE_CHOICE]: '圖片選擇',
      [QuestionType.MATRIX]: '矩陣題',
      [QuestionType.RANKING]: '排序題',
    };
    return typeNames[type] || '未知題型';
  }

  /**
   * 新增操作記錄
   */
  function addToOperationHistory(operation: string): void {
    operationHistory.value.push(`${new Date().toLocaleTimeString()}: ${operation}`);

    // 限制歷史記錄長度
    if (operationHistory.value.length > 100) {
      operationHistory.value.shift();
    }
  }

  /**
   * 驗證題目配置
   */
  function validateQuestionConfig(question: Question): { isValid: boolean; errors: string[] } {
    return validateQuestion(question);
  }

  // ============================================================================
  // 返回公開介面
  // ============================================================================

  return {
    // 狀態
    clipboard: readonly(clipboard),
    lastOperatedQuestionId: readonly(lastOperatedQuestionId),
    operationHistory: readonly(operationHistory),
    selectedQuestionIds: readonly(selectedQuestionIds),
    isBatchMode: readonly(isBatchMode),

    // 計算屬性
    allQuestions,
    supportedQuestionTypes,
    questionStats,
    selectedQuestions,
    validationStats,

    // 基礎 CRUD
    addQuestion,
    addQuestionAt,
    addQuestionAfterSelected,
    duplicateQuestion,
    deleteQuestion,

    // 移動和排序
    moveQuestion,
    moveQuestionUp,
    moveQuestionDown,

    // 剪貼簿操作
    copyToClipboard,
    pasteFromClipboard,
    clearClipboard,

    // 批量操作
    toggleBatchMode,
    toggleQuestionSelection,
    selectAllQuestions,
    clearSelection,
    deleteSelectedQuestions,
    batchUpdateSelectedQuestions,
    batchDuplicateSelectedQuestions,

    // 搜尋和篩選
    searchQuestions,
    getQuestionsByType,
    getRequiredQuestions,
    getInvalidQuestions,

    // 選項管理
    addOptionToQuestion,
    removeOptionFromQuestion,

    // 工具方法
    getQuestionTypeName,
    validateQuestionConfig,
  };
});
