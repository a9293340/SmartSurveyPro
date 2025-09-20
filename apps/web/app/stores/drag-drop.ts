/**
 * 拖放狀態管理 Store
 * 管理問卷建構器中的拖放操作，包括題型拖放、題目重排等功能
 */

import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { QuestionType } from '@smartsurvey/shared';
import { useQuestionsStore } from './questions';

// ============================================================================
// 拖放相關型別定義
// ============================================================================

/** 拖放項目類型 */
export enum DragItemType {
  QUESTION_TYPE = 'question_type', // 從題型面板拖放新題型
  EXISTING_QUESTION = 'existing_question', // 拖放現有題目重排
}

/** 拖放項目資料 */
export interface DragItem {
  type: DragItemType;
  data: QuestionTypeDragData | ExistingQuestionDragData;
}

/** 題型拖放資料 */
export interface QuestionTypeDragData {
  questionType: (typeof QuestionType)[keyof typeof QuestionType];
  displayName: string;
  icon: string;
}

/** 現有題目拖放資料 */
export interface ExistingQuestionDragData {
  questionId: string;
  title: string;
  currentIndex: number;
}

/** 放置區域類型 */
export enum DropZoneType {
  QUESTION_LIST = 'question_list', // 題目列表區域
  TRASH = 'trash', // 垃圾桶區域
}

/** 放置區域資料 */
export interface DropZone {
  type: DropZoneType;
  index?: number; // 在題目列表中的插入位置
  element?: HTMLElement; // DOM 元素引用
}

/** 拖放操作結果 */
export interface DragDropResult {
  success: boolean;
  message: string;
  action: 'add' | 'move' | 'delete' | 'cancel';
  questionId?: string;
}

// ============================================================================
// 拖放狀態管理 Store
// ============================================================================

export const useDragDropStore = defineStore('dragDrop', () => {
  // ============================================================================
  // 拖放狀態
  // ============================================================================

  /** 是否正在拖放 */
  const isDragging = ref(false);

  /** 當前拖放的項目 */
  const draggedItem = ref<DragItem | null>(null);

  /** 拖放開始的位置 */
  const dragStartPosition = ref<{ x: number; y: number } | null>(null);

  /** 當前懸浮的放置區域 */
  const hoveredDropZone = ref<DropZone | null>(null);

  /** 是否可以放置到當前懸浮區域 */
  const canDropToCurrent = ref(false);

  /** 拖放預覽元素的位置 */
  const previewPosition = ref<{ x: number; y: number } | null>(null);

  /** 插入指示器的位置（在題目列表中） */
  const insertIndicatorIndex = ref<number | null>(null);

  // 拖放體驗優化設計

  /** 拖放操作設定 */
  const dragSettings = ref({
    /** 是否啟用自動滾動 */
    enableAutoScroll: true,
    /** 自動滾動靈敏度 */
    scrollSensitivity: 50,
    /** 拖放預覽偏移 */
    previewOffset: { x: 10, y: 10 },
    /** 插入指示器樣式 */
    insertIndicatorClass: 'drag-insert-indicator',
  });

  // ============================================================================
  // 計算屬性
  // ============================================================================

  /** 當前拖放的題型（如果是題型拖放） */
  const draggedQuestionType = computed(
    (): (typeof QuestionType)[keyof typeof QuestionType] | null => {
      if (!draggedItem.value || draggedItem.value.type !== DragItemType.QUESTION_TYPE) {
        return null;
      }
      return (draggedItem.value.data as QuestionTypeDragData).questionType;
    }
  );

  /** 當前拖放的題目 ID（如果是題目重排） */
  const draggedQuestionId = computed((): string | null => {
    if (!draggedItem.value || draggedItem.value.type !== DragItemType.EXISTING_QUESTION) {
      return null;
    }
    return (draggedItem.value.data as ExistingQuestionDragData).questionId;
  });

  /** 是否正在拖放題型 */
  const isDraggingQuestionType = computed((): boolean => {
    return isDragging.value && draggedItem.value?.type === DragItemType.QUESTION_TYPE;
  });

  /** 是否正在拖放現有題目 */
  const isDraggingExistingQuestion = computed((): boolean => {
    return isDragging.value && draggedItem.value?.type === DragItemType.EXISTING_QUESTION;
  });

  /** 拖放狀態摘要（用於 builder state） */
  const dragState = computed(() => ({
    isDragging: isDragging.value,
    draggedQuestionType: draggedQuestionType.value,
    dropZoneIndex: insertIndicatorIndex.value,
  }));

  // ============================================================================
  // 拖放開始方法
  // ============================================================================

  /**
   * 開始拖放題型
   */
  function startDragQuestionType(
    questionType: (typeof QuestionType)[keyof typeof QuestionType],
    displayName: string,
    icon: string,
    startPosition: { x: number; y: number }
  ): void {
    if (isDragging.value) return;

    const dragData: QuestionTypeDragData = {
      questionType,
      displayName,
      icon,
    };

    draggedItem.value = {
      type: DragItemType.QUESTION_TYPE,
      data: dragData,
    };

    isDragging.value = true;
    dragStartPosition.value = startPosition;
    previewPosition.value = startPosition;

    // 添加全局事件監聽
    addGlobalEventListeners();
  }

  /**
   * 開始拖放現有題目
   */
  function startDragExistingQuestion(
    questionId: string,
    title: string,
    currentIndex: number,
    startPosition: { x: number; y: number }
  ): void {
    if (isDragging.value) return;

    const dragData: ExistingQuestionDragData = {
      questionId,
      title,
      currentIndex,
    };

    draggedItem.value = {
      type: DragItemType.EXISTING_QUESTION,
      data: dragData,
    };

    isDragging.value = true;
    dragStartPosition.value = startPosition;
    previewPosition.value = startPosition;

    // 添加全局事件監聽
    addGlobalEventListeners();
  }

  // ============================================================================
  // 拖放過程方法
  // ============================================================================

  /**
   * 更新拖放位置
   */
  function updateDragPosition(position: { x: number; y: number }): void {
    if (!isDragging.value) return;

    previewPosition.value = {
      x: position.x + dragSettings.value.previewOffset.x,
      y: position.y + dragSettings.value.previewOffset.y,
    };

    // 自動滾動處理
    if (dragSettings.value.enableAutoScroll) {
      handleAutoScroll(position);
    }
  }

  /**
   * 設置懸浮的放置區域
   */
  function setHoveredDropZone(dropZone: DropZone | null): void {
    console.log('🎯 setHoveredDropZone:', dropZone);
    hoveredDropZone.value = dropZone;
    canDropToCurrent.value = dropZone ? validateDropZone(dropZone) : false;

    console.log('📊 Drop zone validation:', {
      canDrop: canDropToCurrent.value,
      dropZoneType: dropZone?.type,
      dropZoneIndex: dropZone?.index,
    });

    // 更新插入指示器
    if (dropZone?.type === DropZoneType.QUESTION_LIST && dropZone.index !== undefined) {
      insertIndicatorIndex.value = dropZone.index;
    } else {
      insertIndicatorIndex.value = null;
    }
  }

  /**
   * 清除懸停的放置區域
   */
  function clearHoveredDropZone(): void {
    setHoveredDropZone(null);
  }

  /**
   * 驗證放置區域是否有效
   */
  function validateDropZone(dropZone: DropZone): boolean {
    if (!draggedItem.value) return false;

    switch (dropZone.type) {
      case DropZoneType.QUESTION_LIST:
        // 題目列表始終可以接受拖放
        return true;

      case DropZoneType.TRASH:
        // 垃圾桶只能接受現有題目
        return draggedItem.value.type === DragItemType.EXISTING_QUESTION;

      default:
        return false;
    }
  }

  // ============================================================================
  // 拖放結束方法
  // ============================================================================

  /**
   * 完成拖放操作
   */
  function completeDragDrop(): DragDropResult {
    if (!isDragging.value || !draggedItem.value) {
      return {
        success: false,
        message: '沒有進行中的拖放操作',
        action: 'cancel',
      };
    }

    let result: DragDropResult;

    if (!hoveredDropZone.value || !canDropToCurrent.value) {
      result = {
        success: false,
        message: '無效的放置位置',
        action: 'cancel',
      };
    } else {
      result = executeDrop();
    }

    // 清理拖放狀態
    cleanupDragState();

    return result;
  }

  /**
   * 取消拖放操作
   */
  function cancelDragDrop(): DragDropResult {
    if (!isDragging.value) {
      return {
        success: true,
        message: '沒有進行中的拖放操作',
        action: 'cancel',
      };
    }

    cleanupDragState();

    return {
      success: true,
      message: '拖放操作已取消',
      action: 'cancel',
    };
  }

  /**
   * 執行放置操作
   */
  function executeDrop(): DragDropResult {
    if (!draggedItem.value || !hoveredDropZone.value) {
      return {
        success: false,
        message: '拖放資料不完整',
        action: 'cancel',
      };
    }

    const dropZone = hoveredDropZone.value;

    try {
      switch (draggedItem.value.type) {
        case DragItemType.QUESTION_TYPE:
          return handleQuestionTypeDrop(draggedItem.value.data as QuestionTypeDragData, dropZone);

        case DragItemType.EXISTING_QUESTION:
          return handleExistingQuestionDrop(
            draggedItem.value.data as ExistingQuestionDragData,
            dropZone
          );

        default:
          return {
            success: false,
            message: '未知的拖放類型',
            action: 'cancel',
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `拖放操作失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
        action: 'cancel',
      };
    }
  }

  /**
   * 處理題型拖放
   */
  function handleQuestionTypeDrop(
    dragData: QuestionTypeDragData,
    dropZone: DropZone
  ): DragDropResult {
    switch (dropZone.type) {
      case DropZoneType.QUESTION_LIST: {
        const questionsStore = useQuestionsStore();
        const result = questionsStore.addQuestionAt(
          dragData.questionType,
          dropZone.index ?? questionsStore.allQuestions.length
        );

        if (result.success) {
          console.log('✅ Question created:', dragData.questionType);
        } else {
          console.warn('❌ Failed to create question:', result.message);
        }

        return {
          success: result.success,
          message: result.message,
          action: 'add',
          questionId: result.question?.id,
        };
      }

      default:
        return {
          success: false,
          message: '題型不能放置到此區域',
          action: 'cancel',
        };
    }
  }

  /**
   * 處理現有題目拖放
   */
  function handleExistingQuestionDrop(
    dragData: ExistingQuestionDragData,
    dropZone: DropZone
  ): DragDropResult {
    switch (dropZone.type) {
      case DropZoneType.QUESTION_LIST: {
        if (dropZone.index === undefined) {
          return {
            success: false,
            message: '放置位置無效',
            action: 'cancel',
          };
        }

        const questionsStore = useQuestionsStore();
        const result = questionsStore.moveQuestion(dragData.questionId, dropZone.index);

        return {
          success: result.success,
          message: result.message,
          action: 'move',
          questionId: dragData.questionId,
        };
      }

      case DropZoneType.TRASH: {
        const questionsStore = useQuestionsStore();
        const result = questionsStore.deleteQuestion(dragData.questionId);

        return {
          success: result.success,
          message: result.message,
          action: 'delete',
          questionId: dragData.questionId,
        };
      }

      default:
        return {
          success: false,
          message: '題目不能放置到此區域',
          action: 'cancel',
        };
    }
  }

  // ============================================================================
  // 輔助方法
  // ============================================================================

  /**
   * 處理自動滾動
   */
  function handleAutoScroll(position: { x: number; y: number }): void {
    // 實作自動滾動邏輯
    const sensitivity = dragSettings.value.scrollSensitivity;
    const scrollSpeed = 10;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY,
      scrollX: window.scrollX,
    };

    // 垂直滾動
    if (position.y < sensitivity) {
      // 靠近頂部，向上滾動
      const speed = Math.min(scrollSpeed, (sensitivity - position.y) / 5);
      window.scrollBy(0, -speed);
    } else if (position.y > viewport.height - sensitivity) {
      // 靠近底部，向下滾動
      const speed = Math.min(scrollSpeed, (position.y - (viewport.height - sensitivity)) / 5);
      window.scrollBy(0, speed);
    }

    // 水平滾動（如果有水平滾動條）
    if (position.x < sensitivity) {
      // 靠近左邊，向左滾動
      const speed = Math.min(scrollSpeed, (sensitivity - position.x) / 5);
      window.scrollBy(-speed, 0);
    } else if (position.x > viewport.width - sensitivity) {
      // 靠近右邊，向右滾動
      const speed = Math.min(scrollSpeed, (position.x - (viewport.width - sensitivity)) / 5);
      window.scrollBy(speed, 0);
    }

    // 對於可滾動容器的處理（如果需要）
    const scrollableContainer = findScrollableParent(position);
    if (scrollableContainer) {
      handleContainerAutoScroll(scrollableContainer, position);
    }
  }

  /**
   * 添加全局事件監聽
   */
  function addGlobalEventListeners(): void {
    // 滑鼠移動事件
    document.addEventListener('mousemove', handleGlobalMouseMove);
    // 滑鼠釋放事件
    document.addEventListener('mouseup', handleGlobalMouseUp);
    // ESC 鍵取消
    document.addEventListener('keydown', handleGlobalKeyDown);
    // 防止預設拖放行為
    document.addEventListener('dragstart', preventDefaultDrag);
  }

  /**
   * 移除全局事件監聽
   */
  function removeGlobalEventListeners(): void {
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('keydown', handleGlobalKeyDown);
    document.removeEventListener('dragstart', preventDefaultDrag);
  }

  /**
   * 全局滑鼠移動處理
   */
  function handleGlobalMouseMove(event: MouseEvent): void {
    if (!isDragging.value) return;

    updateDragPosition({ x: event.clientX, y: event.clientY });

    // 檢測放置區域
    const elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
    if (elementUnderMouse) {
      detectDropZone(elementUnderMouse);
    }
  }

  /**
   * 全局滑鼠釋放處理
   */
  function handleGlobalMouseUp(event: MouseEvent): void {
    if (!isDragging.value) return;

    event.preventDefault();
    event.stopPropagation();

    // 給更多時間讓 DropZone mouseenter 事件觸發
    setTimeout(() => {
      completeDragDrop();
    }, 50);
  }

  /**
   * 全局鍵盤事件處理
   */
  function handleGlobalKeyDown(event: KeyboardEvent): void {
    if (!isDragging.value) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelDragDrop();
    }
  }

  /**
   * 防止預設拖放行為
   */
  function preventDefaultDrag(event: DragEvent): void {
    if (isDragging.value) {
      event.preventDefault();
    }
  }

  /**
   * 檢測放置區域
   */
  function detectDropZone(element: Element): void {
    // 實作放置區域檢測邏輯
    let current: Element | null = element;
    let closestDropZone: DropZone | null = null;
    let minDistance = Infinity;

    while (current) {
      if (current instanceof HTMLElement) {
        const dropZoneType = current.dataset.dropZone;

        if (dropZoneType) {
          // 計算鼠標與放置區域的距離（用於優先級判斷）
          const rect = current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(centerX - previewPosition.value!.x, 2) +
              Math.pow(centerY - previewPosition.value!.y, 2)
          );

          if (distance < minDistance) {
            minDistance = distance;

            switch (dropZoneType) {
              case 'question-list': {
                // 計算插入位置
                const index = calculateInsertIndex(current, previewPosition.value!);
                closestDropZone = {
                  type: DropZoneType.QUESTION_LIST,
                  index,
                  element: current,
                };
                break;
              }

              case 'trash': {
                closestDropZone = {
                  type: DropZoneType.TRASH,
                  element: current,
                };
                break;
              }
            }
          }
        }
      }

      current = current.parentElement;
    }

    setHoveredDropZone(closestDropZone);
  }

  /**
   * 清理拖放狀態
   */
  function cleanupDragState(): void {
    isDragging.value = false;
    draggedItem.value = null;
    dragStartPosition.value = null;
    hoveredDropZone.value = null;
    canDropToCurrent.value = false;
    previewPosition.value = null;
    insertIndicatorIndex.value = null;

    // 移除全局事件監聽
    removeGlobalEventListeners();
  }

  // ============================================================================
  // 輔助函數（新增）
  // ============================================================================

  /**
   * 查找可滾動的父元素
   */
  function findScrollableParent(position: { x: number; y: number }): HTMLElement | null {
    const element = document.elementFromPoint(position.x, position.y);
    if (!element) return null;

    let parent = element.parentElement;
    while (parent) {
      if (parent instanceof HTMLElement) {
        const style = window.getComputedStyle(parent);
        const overflow = style.overflow + style.overflowY + style.overflowX;

        if (overflow.includes('auto') || overflow.includes('scroll')) {
          return parent;
        }
      }
      parent = parent.parentElement;
    }

    return null;
  }

  /**
   * 處理容器的自動滾動
   */
  function handleContainerAutoScroll(
    container: HTMLElement,
    position: { x: number; y: number }
  ): void {
    const rect = container.getBoundingClientRect();
    const sensitivity = dragSettings.value.scrollSensitivity;
    const scrollSpeed = 8;

    // 容器內的相對位置
    const relativeY = position.y - rect.top;
    const relativeX = position.x - rect.left;

    // 垂直滾動
    if (relativeY < sensitivity && container.scrollTop > 0) {
      container.scrollTop -= scrollSpeed;
    } else if (
      relativeY > rect.height - sensitivity &&
      container.scrollTop < container.scrollHeight - rect.height
    ) {
      container.scrollTop += scrollSpeed;
    }

    // 水平滾動
    if (relativeX < sensitivity && container.scrollLeft > 0) {
      container.scrollLeft -= scrollSpeed;
    } else if (
      relativeX > rect.width - sensitivity &&
      container.scrollLeft < container.scrollWidth - rect.width
    ) {
      container.scrollLeft += scrollSpeed;
    }
  }

  /**
   * 計算插入位置索引
   */
  function calculateInsertIndex(
    container: HTMLElement,
    position: { x: number; y: number }
  ): number {
    const questionElements = container.querySelectorAll('[data-question-index]');
    if (questionElements.length === 0) return 0;

    let insertIndex = questionElements.length;

    for (let i = 0; i < questionElements.length; i++) {
      const element = questionElements[i] as HTMLElement;
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      // 如果鼠標在題目中心之上，則插入在此題目之前
      if (position.y < centerY) {
        insertIndex = i;
        break;
      }
    }

    return insertIndex;
  }

  // ============================================================================
  // 設定方法
  // ============================================================================

  /**
   * 更新拖放設定
   */
  function updateDragSettings(settings: Partial<typeof dragSettings.value>): void {
    Object.assign(dragSettings.value, settings);
  }

  /**
   * 重置拖放設定
   */
  function resetDragSettings(): void {
    dragSettings.value = {
      enableAutoScroll: true,
      scrollSensitivity: 50,
      previewOffset: { x: 10, y: 10 },
      insertIndicatorClass: 'drag-insert-indicator',
    };
  }

  // ============================================================================
  // 返回公開介面
  // ============================================================================

  return {
    // 狀態
    isDragging,
    draggedItem,
    hoveredDropZone,
    canDropToCurrent,
    previewPosition,
    insertIndicatorIndex,
    dragSettings,

    // 計算屬性
    draggedQuestionType,
    draggedQuestionId,
    isDraggingQuestionType,
    isDraggingExistingQuestion,
    dragState,

    // 拖放開始
    startDragQuestionType,
    startDragExistingQuestion,

    // 拖放過程
    updateDragPosition,
    setHoveredDropZone,
    clearHoveredDropZone,

    // 拖放結束
    completeDragDrop,
    cancelDragDrop,

    // 設定
    updateDragSettings,
    resetDragSettings,
  };
});
