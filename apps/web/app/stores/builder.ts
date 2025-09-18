/**
 * 問卷建構器主要狀態管理
 * 管理編輯器的核心狀態，包括當前問卷、編輯模式、歷史記錄等
 */

import { defineStore } from 'pinia';
import { ref, computed, watch, readonly } from 'vue';
import { ObjectId } from 'mongodb';
import type { Survey, SurveyBuilderState, Question } from '@smartsurvey/shared';
import { SurveyStatus, SurveyType, QuestionType } from '@smartsurvey/shared';
import { createQuestion, validateQuestion } from '@smartsurvey/shared';

// ============================================================================
// 題目更新相關型別
// ============================================================================

/** 題目通用更新介面 - 只包含所有題型共有的可更新屬性 */
interface QuestionUpdateData {
  title?: string;
  description?: string;
  required?: boolean;
  visible?: boolean;
  order?: number;
  config?: object; // 接受任何物件類型
  validation?: object; // 接受任何物件類型
}

// ============================================================================
// 歷史記錄相關型別
// ============================================================================

/** 歷史記錄項目 */
interface HistoryRecord {
  /** 記錄 ID */
  id: string;
  /** 記錄時間 */
  timestamp: Date;
  /** 操作描述 */
  description: string;
  /** 問卷快照 */
  surveySnapshot: Survey;
}

/** 操作類型 */
enum ActionType {
  ADD_QUESTION = 'add_question',
  DELETE_QUESTION = 'delete_question',
  UPDATE_QUESTION = 'update_question',
  REORDER_QUESTIONS = 'reorder_questions',
  UPDATE_SURVEY = 'update_survey',
}

// ============================================================================
// 建構器主要 Store
// ============================================================================

export const useBuilderStore = defineStore('builder', () => {
  // ============================================================================
  // 核心狀態
  // ============================================================================

  /** 當前編輯的問卷 */
  const currentSurvey = ref<Survey | null>(null);

  /** 選中的題目 ID */
  const selectedQuestionId = ref<string | null>(null);

  /** 是否處於預覽模式 */
  const isPreviewMode = ref(false);

  /** 是否有未儲存的變更 */
  const hasUnsavedChanges = ref(false);

  /** 是否正在載入 */
  const isLoading = ref(false);

  /** 是否正在儲存 */
  const isSaving = ref(false);

  /** 最後儲存時間 */
  const lastSavedAt = ref<Date | null>(null);

  // ============================================================================
  // 歷史記錄狀態
  // ============================================================================

  /** 歷史記錄堆疊 */
  const historyStack = ref<HistoryRecord[]>([]);

  /** 當前歷史記錄索引 */
  const historyIndex = ref(-1);

  /** 最大歷史記錄數量 */
  const MAX_HISTORY_SIZE = 50;

  // 編輯器設定狀態設計

  /** 編輯器設定 */
  const editorSettings = ref({
    /** 是否啟用自動儲存 */
    autoSave: true,
    /** 自動儲存間隔（毫秒） */
    autoSaveInterval: 30000, // 30 秒
    /** 是否顯示格線 */
    showGrid: false,
    /** 是否啟用鍵盤快捷鍵 */
    enableKeyboardShortcuts: true,
  });

  // ============================================================================
  // 計算屬性
  // ============================================================================

  /** 當前選中的題目 */
  const selectedQuestion = computed((): Question | null => {
    if (!currentSurvey.value || !selectedQuestionId.value) {
      return null;
    }
    return currentSurvey.value.questions.find(q => q.id === selectedQuestionId.value) || null;
  });

  /** 是否可以 Undo */
  const canUndo = computed((): boolean => {
    return historyIndex.value > 0;
  });

  /** 是否可以 Redo */
  const canRedo = computed((): boolean => {
    return historyIndex.value < historyStack.value.length - 1;
  });

  /** 問卷驗證狀態 */
  const surveyValidation = computed(() => {
    if (!currentSurvey.value) {
      return { isValid: false, errors: ['沒有載入問卷'] };
    }

    const errors: string[] = [];

    // 檢查問卷基本資訊
    if (!currentSurvey.value.title?.trim()) {
      errors.push('問卷標題不能為空');
    }

    // 檢查題目
    if (currentSurvey.value.questions.length === 0) {
      errors.push('問卷至少需要一個題目');
    }

    // 檢查每個題目的有效性
    currentSurvey.value.questions.forEach((question, index) => {
      const validation = validateQuestion(question);
      if (!validation.isValid) {
        errors.push(`題目 ${index + 1}: ${validation.errors.join(', ')}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  });

  /** 建構器狀態（符合介面定義） */
  const builderState = computed(
    (): SurveyBuilderState => ({
      currentSurvey: currentSurvey.value,
      selectedQuestionId: selectedQuestionId.value,
      isPreviewMode: isPreviewMode.value,
      hasUnsavedChanges: hasUnsavedChanges.value,
      dragState: {
        isDragging: false, // 將由拖放 store 管理
        draggedQuestionType: undefined,
        dropZoneIndex: undefined,
      },
    })
  );

  // ============================================================================
  // 問卷操作方法
  // ============================================================================

  /**
   * 建立新問卷
   */
  function createNewSurvey(params: {
    title: string;
    description?: string;
    type?: SurveyType;
    workspaceId: string;
  }): Survey {
    const newSurvey: Survey = {
      _id: new ObjectId() as any, // 暫時使用，實際會由後端生成
      title: params.title,
      description: params.description,
      status: SurveyStatus.DRAFT,
      type: params.type || SurveyType.STANDARD,
      ownerId: 'current-user-id' as any, // TODO: 從認證 store 獲取
      workspaceId: params.workspaceId as any,
      questions: [],
      publishSettings: {
        visibility: 'private' as any,
        allowAnonymous: true,
        allowMultipleResponses: false,
      },
      appearance: {
        primaryColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
      },
      stats: {
        totalResponses: 0,
        completedResponses: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    currentSurvey.value = newSurvey;
    clearHistory();
    addToHistory('建立新問卷', ActionType.UPDATE_SURVEY);
    markAsUnsaved();

    return newSurvey;
  }

  /**
   * 載入問卷
   */
  function loadSurvey(survey: Survey): void {
    currentSurvey.value = survey;
    selectedQuestionId.value = null;
    clearHistory();
    markAsSaved();
  }

  /**
   * 更新問卷基本資訊
   */
  function updateSurveyInfo(
    updates: Partial<Pick<Survey, 'title' | 'description' | 'type'>>
  ): void {
    if (!currentSurvey.value) return;

    Object.assign(currentSurvey.value, updates);
    currentSurvey.value.updatedAt = new Date();

    addToHistory('更新問卷資訊', ActionType.UPDATE_SURVEY);
    markAsUnsaved();
  }

  // ============================================================================
  // 題目操作方法（基礎版本）
  // ============================================================================

  /**
   * 新增題目
   */
  function addQuestion(type: QuestionType, position?: number): Question {
    if (!currentSurvey.value) {
      throw new Error('沒有載入問卷');
    }

    const insertIndex = position ?? currentSurvey.value.questions.length;

    // 使用 createQuestion 工廠函數建立新題目
    const newQuestion = createQuestion({
      type,
      order: insertIndex,
      title: `新題目 ${insertIndex + 1}`,
    });

    // 設定題目的預設屬性
    newQuestion.description = '';
    newQuestion.required = false;

    // 更新其他題目的順序
    currentSurvey.value.questions.forEach(q => {
      if (q.order >= insertIndex) {
        q.order += 1;
      }
    });

    currentSurvey.value.questions.splice(insertIndex, 0, newQuestion);
    currentSurvey.value.updatedAt = new Date();

    selectQuestion(newQuestion.id);
    addToHistory(`新增${getQuestionTypeName(type)}`, ActionType.ADD_QUESTION);
    markAsUnsaved();

    return newQuestion;
  }

  /**
   * 刪除題目
   */
  function deleteQuestion(questionId: string): boolean {
    if (!currentSurvey.value) return false;

    const questionIndex = currentSurvey.value.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return false;

    const deletedQuestion = currentSurvey.value.questions[questionIndex];
    currentSurvey.value.questions.splice(questionIndex, 1);

    // 重新排序剩餘題目
    currentSurvey.value.questions.forEach((q, index) => {
      q.order = index;
    });

    currentSurvey.value.updatedAt = new Date();

    // 如果刪除的是選中的題目，清除選擇
    if (selectedQuestionId.value === questionId) {
      selectedQuestionId.value = null;
    }

    if (deletedQuestion) {
      addToHistory(`刪除${getQuestionTypeName(deletedQuestion.type)}`, ActionType.DELETE_QUESTION);
    }
    markAsUnsaved();

    return true;
  }

  /**
   * 更新題目
   */
  function updateQuestion(questionId: string, updates: QuestionUpdateData): boolean {
    if (!currentSurvey.value) return false;

    const question = currentSurvey.value.questions.find(q => q.id === questionId);
    if (!question) return false;

    Object.assign(question, updates);
    currentSurvey.value.updatedAt = new Date();

    addToHistory(`更新題目`, ActionType.UPDATE_QUESTION);
    markAsUnsaved();

    return true;
  }

  // ============================================================================
  // 選擇和導航方法
  // ============================================================================

  /**
   * 選擇題目
   */
  function selectQuestion(questionId: string | null): void {
    selectedQuestionId.value = questionId;
  }

  /**
   * 選擇上一個題目
   */
  function selectPreviousQuestion(): void {
    if (!currentSurvey.value || currentSurvey.value.questions.length === 0) return;

    const currentIndex = selectedQuestionId.value
      ? currentSurvey.value.questions.findIndex(q => q.id === selectedQuestionId.value)
      : -1;

    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : currentSurvey.value.questions.length - 1;
    const previousQuestion = currentSurvey.value.questions[previousIndex];
    if (previousQuestion) {
      selectQuestion(previousQuestion.id);
    }
  }

  /**
   * 選擇下一個題目
   */
  function selectNextQuestion(): void {
    if (!currentSurvey.value || currentSurvey.value.questions.length === 0) return;

    const currentIndex = selectedQuestionId.value
      ? currentSurvey.value.questions.findIndex(q => q.id === selectedQuestionId.value)
      : -1;

    const nextIndex = (currentIndex + 1) % currentSurvey.value.questions.length;
    const nextQuestion = currentSurvey.value.questions[nextIndex];
    if (nextQuestion) {
      selectQuestion(nextQuestion.id);
    }
  }

  // ============================================================================
  // 預覽模式方法
  // ============================================================================

  /**
   * 切換預覽模式
   */
  function togglePreviewMode(): void {
    isPreviewMode.value = !isPreviewMode.value;
    if (isPreviewMode.value) {
      selectedQuestionId.value = null; // 預覽模式下不選擇題目
    }
  }

  /**
   * 退出預覽模式
   */
  function exitPreviewMode(): void {
    isPreviewMode.value = false;
  }

  // ============================================================================
  // 歷史記錄方法
  // ============================================================================

  /**
   * 新增歷史記錄
   */
  function addToHistory(description: string, _actionType: ActionType): void {
    if (!currentSurvey.value) return;

    const record: HistoryRecord = {
      id: `history_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      description,
      surveySnapshot: JSON.parse(JSON.stringify(currentSurvey.value)),
    };

    // 移除當前索引之後的記錄（如果用戶在歷史中間進行新操作）
    if (historyIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
    }

    historyStack.value.push(record);
    historyIndex.value = historyStack.value.length - 1;

    // 限制歷史記錄大小
    if (historyStack.value.length > MAX_HISTORY_SIZE) {
      historyStack.value.shift();
      historyIndex.value = historyStack.value.length - 1;
    }
  }

  /**
   * 撤銷操作
   */
  function undo(): boolean {
    if (!canUndo.value) return false;

    historyIndex.value -= 1;
    const record = historyStack.value[historyIndex.value];
    if (record) {
      currentSurvey.value = JSON.parse(JSON.stringify(record.surveySnapshot));
    }
    markAsUnsaved();

    return true;
  }

  /**
   * 重做操作
   */
  function redo(): boolean {
    if (!canRedo.value) return false;

    historyIndex.value += 1;
    const record = historyStack.value[historyIndex.value];
    if (record) {
      currentSurvey.value = JSON.parse(JSON.stringify(record.surveySnapshot));
    }
    markAsUnsaved();

    return true;
  }

  /**
   * 清除歷史記錄
   */
  function clearHistory(): void {
    historyStack.value = [];
    historyIndex.value = -1;
  }

  // ============================================================================
  // 儲存狀態管理
  // ============================================================================

  /**
   * 標記為已儲存
   */
  function markAsSaved(): void {
    hasUnsavedChanges.value = false;
    lastSavedAt.value = new Date();
  }

  /**
   * 標記為未儲存
   */
  function markAsUnsaved(): void {
    hasUnsavedChanges.value = true;
  }

  // ============================================================================
  // 工具方法
  // ============================================================================

  /**
   * 獲取題型顯示名稱
   */
  function getQuestionTypeName(type: QuestionType): string {
    const typeNames: Record<QuestionType, string> = {
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

  // ============================================================================
  // 生命週期和監聽
  // ============================================================================

  // 監聽問卷變更，自動標記為未儲存
  watch(
    currentSurvey,
    newSurvey => {
      if (newSurvey && lastSavedAt.value) {
        markAsUnsaved();
      }
    },
    { deep: true }
  );

  // 自動儲存功能實作
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 執行自動儲存
   */
  async function performAutoSave(): Promise<void> {
    if (!currentSurvey.value || !hasUnsavedChanges.value || isSaving.value) {
      return;
    }

    try {
      isSaving.value = true;

      // 呼叫 API 儲存問卷
      // TODO(future): 連接實際的 API
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 1000);
      }); // 模擬 API 呼叫

      console.warn('[AutoSave] 問卷已自動儲存', {
        surveyId: currentSurvey.value._id,
        timestamp: new Date().toISOString(),
      });

      markAsSaved();
    } catch (error) {
      console.error('[AutoSave] 自動儲存失敗:', error);
    } finally {
      isSaving.value = false;
    }
  }

  /**
   * 排程自動儲存
   */
  function scheduleAutoSave(): void {
    // 清除現有的計時器
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // 如果啟用自動儲存，則排程新的儲存
    if (editorSettings.value.autoSave && hasUnsavedChanges.value) {
      autoSaveTimer = setTimeout(() => {
        performAutoSave();
      }, editorSettings.value.autoSaveInterval);
    }
  }

  // 監聽問卷變更和自動儲存設定，觸發自動儲存
  watch(
    [
      currentSurvey,
      () => editorSettings.value.autoSave,
      () => editorSettings.value.autoSaveInterval,
    ],
    () => {
      if (currentSurvey.value && hasUnsavedChanges.value) {
        scheduleAutoSave();
      }
    },
    { deep: true }
  );

  // 監聽 hasUnsavedChanges 狀態變化
  watch(hasUnsavedChanges, newValue => {
    if (newValue) {
      scheduleAutoSave();
    } else if (autoSaveTimer) {
      // 如果已儲存，清除計時器
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
  });

  // ============================================================================
  // 返回公開介面
  // ============================================================================

  return {
    // 狀態 - 這些需要提供給其他 store 修改，所以不用 readonly
    currentSurvey,
    selectedQuestionId: readonly(selectedQuestionId),
    isPreviewMode: readonly(isPreviewMode),
    hasUnsavedChanges: readonly(hasUnsavedChanges),
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    lastSavedAt: readonly(lastSavedAt),
    editorSettings,

    // 計算屬性
    selectedQuestion,
    canUndo,
    canRedo,
    surveyValidation,
    builderState,

    // 方法
    createNewSurvey,
    loadSurvey,
    updateSurveyInfo,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    selectQuestion,
    selectPreviousQuestion,
    selectNextQuestion,
    togglePreviewMode,
    exitPreviewMode,
    undo,
    redo,
    markAsSaved,
    markAsUnsaved,
    performAutoSave, // 暴露手動儲存功能
  };
});
