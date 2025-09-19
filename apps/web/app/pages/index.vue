<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- 標題區域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">SmartSurvey Pro</h1>
        <p class="text-xl text-gray-600 mb-8">企業級智能問卷建構平台 - MVP 開發階段</p>

        <!-- 快速導航 -->
        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/builder"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🚀 進入問卷編輯器
          </NuxtLink>
          <NuxtLink
            to="/surveys"
            class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            📊 我的問卷
          </NuxtLink>
        </div>
      </div>

      <!-- 功能介紹 -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-2xl mb-4">🎨</div>
          <h3 class="text-lg font-semibold mb-2">自由畫布設計</h3>
          <p class="text-gray-600">業界唯一的拖放式問卷編輯器，讓你輕鬆建立專業問卷</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-2xl mb-4">🤖</div>
          <h3 class="text-lg font-semibold mb-2">AI 深度整合</h3>
          <p class="text-gray-600">智能問卷生成與分析，提供深度洞察而非僅是統計</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-2xl mb-4">👥</div>
          <h3 class="text-lg font-semibold mb-2">企業級協作</h3>
          <p class="text-gray-600">完整的團隊協作功能，支援多人即時編輯</p>
        </div>
      </div>

      <!-- Phase 1 狀態 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">📅 當前開發狀態：Phase 1 - MVP Foundation</h3>
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>基礎架構設置完成</span>
          </div>
          <div class="flex items-center">
            <span class="text-yellow-500 mr-2">🔄</span>
            <span>拖放式編輯器開發中（5種基礎題型）</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-400 mr-2">⏳</span>
            <span>用戶認證系統（計劃中）</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-400 mr-2">⏳</span>
            <span>問卷填寫與回應收集（計劃中）</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 頁面設定
useHead({
  title: 'SmartSurvey Pro - 企業級智能問卷平台',
  meta: [
    {
      name: 'description',
      content: '企業級智能問卷建構平台，提供自由畫布設計、AI 深度整合和企業級協作功能',
    },
  ],
});
</script>
