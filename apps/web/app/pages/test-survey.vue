<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <!-- 測試標題 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🧪 問卷渲染引擎測試頁面</h1>
        <p class="text-gray-600 mt-2">測試完整的問卷填寫體驗，包含進度顯示功能</p>

        <!-- 測試說明 -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
          <h3 class="text-lg font-medium text-blue-800 mb-2">✨ 新功能測試</h3>
          <div class="text-sm text-blue-700 space-y-1">
            <p>• <strong>進度指示器</strong>：顯示填寫進度百分比和預估剩餘時間</p>
            <p>• <strong>題目進度概覽</strong>：可折疊的題目完成狀態列表</p>
            <p>• <strong>快速導航</strong>：一鍵跳轉到未完成或必填題目</p>
            <p>• <strong>單題/全部模式</strong>：支援兩種不同的填寫體驗</p>
          </div>
        </div>
      </div>

      <!-- 使用 SurveyRenderer 組件 -->
      <SurveyRenderer survey-id="demo-survey-123" />

      <!-- 開發者說明 -->
      <div class="mt-8 max-w-3xl mx-auto">
        <details class="bg-white rounded-lg shadow-sm border p-6">
          <summary class="cursor-pointer font-medium text-gray-700 text-lg">
            🛠️ 開發者資訊 & 測試指引
          </summary>
          <div class="mt-4 space-y-4 text-sm text-gray-600">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-2">🎯 測試重點</h4>
                <ul class="space-y-1 list-disc list-inside">
                  <li>填寫一些題目後觀察進度變化</li>
                  <li>點擊「顯示詳細」查看題目概覽</li>
                  <li>使用快速導航功能</li>
                  <li>切換單題/全部顯示模式</li>
                  <li>觀察預估完成時間的計算</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">🔧 技術特點</h4>
                <ul class="space-y-1 list-disc list-inside">
                  <li>完全組件化的進度追蹤系統</li>
                  <li>即時狀態更新和智能分析</li>
                  <li>響應式設計適配各種屏幕</li>
                  <li>漸進式增強的用戶體驗</li>
                  <li>與 Pinia Store 深度整合</li>
                </ul>
              </div>
            </div>
            <div class="pt-4 border-t border-gray-200">
              <p class="text-gray-500">
                <strong>注意：</strong> 這個測試頁面使用模擬資料，不會真正提交到伺服器。
                請查看瀏覽器控制台以獲取詳細的運行日誌。
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SurveyRenderer from '~/components/response/SurveyRenderer.vue';

// SEO 設定
useHead({
  title: '問卷渲染引擎測試 - SmartSurvey Pro',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>
