<template>
  <div class="builder-page">
    <!-- 導航條 -->
    <nav class="builder-nav">
      <div class="nav-content">
        <div class="nav-left">
          <NuxtLink to="/" class="nav-logo"> SmartSurvey Pro </NuxtLink>
          <span class="nav-divider">|</span>
          <h1 class="nav-title">問卷編輯器</h1>
        </div>

        <div class="nav-right">
          <button type="button" class="nav-button">
            <Icon name="heroicons:eye" class="w-4 h-4" />
            預覽
          </button>
          <button type="button" class="nav-button nav-button-primary">
            <Icon name="heroicons:arrow-up-tray" class="w-4 h-4" />
            發布
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要編輯區域 -->
    <main class="builder-main">
      <SurveyCanvas />
    </main>
  </div>
</template>

<script setup lang="ts">
// 組件引入
import SurveyCanvas from '~/components/builder/SurveyCanvas.vue';

// 頁面設定
useHead({
  title: '問卷編輯器 - SmartSurvey Pro',
  meta: [
    {
      name: 'description',
      content: '使用拖放式編輯器建立專業問卷',
    },
  ],
});

// 阻止頁面離開時的警告（開發階段暫時關閉）
// onBeforeRouteLeave(() => {
//   // TODO: 檢查是否有未儲存的變更
//   return true;
// });
</script>

<style scoped>
.builder-page {
  @apply min-h-screen bg-gray-50 flex flex-col;
}

/* 導航條 */
.builder-nav {
  @apply bg-white border-b border-gray-200 flex-shrink-0;
  @apply shadow-sm;
}

.nav-content {
  @apply max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between;
}

.nav-left {
  @apply flex items-center space-x-4;
}

.nav-logo {
  @apply text-xl font-bold text-blue-600 hover:text-blue-700;
  @apply transition-colors;
}

.nav-divider {
  @apply text-gray-300;
}

.nav-title {
  @apply text-lg font-medium text-gray-900;
}

.nav-right {
  @apply flex items-center space-x-3;
}

.nav-button {
  @apply flex items-center space-x-2 px-4 py-2 rounded-lg font-medium;
  @apply text-gray-600 hover:text-gray-900 hover:bg-gray-100;
  @apply transition-colors;
}

.nav-button-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 hover:text-white;
}

/* 主要編輯區域 */
.builder-main {
  @apply flex-1 overflow-hidden;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .nav-content {
    @apply flex-col space-y-3;
  }

  .nav-left,
  .nav-right {
    @apply w-full justify-center;
  }
}
</style>
