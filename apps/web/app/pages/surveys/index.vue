<template>
  <div class="surveys-page">
    <!-- 頁面標題 -->
    <div class="page-header">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">我的問卷</h1>
            <p class="text-gray-600">管理您建立的所有問卷</p>
          </div>
          <NuxtLink
            to="/builder"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Icon name="heroicons:plus" class="w-5 h-5 inline mr-2" />
            建立新問卷
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 問卷列表 -->
    <div class="container mx-auto px-4 pb-8">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- 空狀態 -->
        <div class="text-center py-16">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">尚未建立任何問卷</h3>
          <p class="text-gray-600 mb-6">開始建立您的第一個問卷，體驗自由畫布設計的強大功能</p>
          <NuxtLink
            to="/builder"
            class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            建立第一個問卷
          </NuxtLink>
        </div>

        <!-- TODO: 問卷列表 (Phase 1 後期實作) -->
        <!--
        <div class="divide-y divide-gray-200">
          <div v-for="survey in surveys" :key="survey.id" class="p-6 hover:bg-gray-50">
            問卷項目模板
          </div>
        </div>
        -->
      </div>

      <!-- Phase 1 說明 -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start">
          <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h4 class="font-semibold text-blue-900 mb-1">Phase 1 開發狀態</h4>
            <p class="text-blue-800 text-sm">
              目前專注於問卷編輯器的核心功能開發。問卷儲存、列表管理等功能將在後續版本中實作。
              您可以先體驗拖放式編輯器的強大功能！
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 頁面設定
useHead({
  title: '我的問卷 - SmartSurvey Pro',
  meta: [
    {
      name: 'description',
      content: '管理您在 SmartSurvey Pro 中建立的所有問卷',
    },
  ],
});

// TODO: Phase 1 後期實作問卷資料載入
// const { data: surveys } = await useFetch('/api/surveys');
</script>

<style scoped>
.surveys-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply bg-white border-b border-gray-200;
}
</style>
