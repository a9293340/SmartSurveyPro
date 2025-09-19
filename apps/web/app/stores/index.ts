/**
 * 問卷建構器 Stores 統一匯出
 * 提供統一的入口點匯出所有狀態管理模組
 */

// 主要 Stores
export { useBuilderStore } from './builder';
export { useQuestionsStore } from './questions';
export { useDragDropStore } from './drag-drop';

// 型別定義
export type {
  DragItemType,
  DragItem,
  QuestionTypeDragData,
  ExistingQuestionDragData,
  DropZoneType,
  DropZone,
  DragDropResult,
} from './drag-drop';

// 工具類型
export interface SurveyBuilderStores {
  builder: ReturnType<typeof useBuilderStore>;
  questions: ReturnType<typeof useQuestionsStore>;
  dragDrop: ReturnType<typeof useDragDropStore>;
}

/**
 * 組合函數：獲取所有問卷建構器相關的 stores
 */
export async function useSurveyBuilderStores(): Promise<SurveyBuilderStores> {
  // 動態 import 避免循環引用
  const { useBuilderStore } = await import('./builder');
  const { useQuestionsStore } = await import('./questions');
  const { useDragDropStore } = await import('./drag-drop');

  return {
    builder: useBuilderStore(),
    questions: useQuestionsStore(),
    dragDrop: useDragDropStore(),
  };
}
