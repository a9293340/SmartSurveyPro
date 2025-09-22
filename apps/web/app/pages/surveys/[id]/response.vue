<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 問卷渲染器 - 讓它處理所有載入和顯示邏輯 -->
    <SurveyRenderer
      :survey-id="surveyId"
      @submit="handleSubmit"
      @save-progress="handleSaveProgress"
    />
  </div>
</template>

<script setup lang="ts">
import type { SubmitResponseRequest, SaveProgressRequest } from '@smartsurvey/shared';
import SurveyRenderer from '../../../components/response/SurveyRenderer.vue';

// 頁面設定
// eslint-disable-next-line no-undef
definePageMeta({
  layout: 'default',
});

// 設置頁面標題
useHead({
  title: '填寫問卷 - SmartSurvey Pro',
});

// 獲取路由參數
const route = useRoute();
const surveyId = route.params.id as string;

/**
 * 處理問卷提交
 */
async function handleSubmit(submitData: SubmitResponseRequest) {
  try {
    console.log('提交問卷回應:', submitData);

    const response = await $fetch<any>(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      body: submitData,
    });

    console.log('提交成功:', response);

    // 導向成功頁面
    await navigateTo(`/surveys/${surveyId}/success`);
  } catch (error) {
    console.error('提交失敗:', error);
    throw error;
  }
}

/**
 * 處理進度儲存
 */
async function handleSaveProgress(progressData: SaveProgressRequest) {
  try {
    console.log('儲存問卷進度:', progressData);

    // Phase 1 暫時只記錄，不實際儲存
    console.warn('Phase 1: 進度儲存功能暫未實作');

    return {
      success: true,
      progressId: 'temp-progress-id',
      message: '進度已儲存（Phase 1 模擬）',
    };
  } catch (error) {
    console.error('儲存進度失敗:', error);
    throw error;
  }
}
</script>
