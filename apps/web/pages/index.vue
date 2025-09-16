<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">SmartSurvey Pro</h1>
        <p class="text-xl text-gray-600 mb-8">智能問卷建構與分析平台</p>

        <div class="flex gap-4 justify-center">
          <NuxtLink to="/auth/register" class="btn btn-primary"> 開始使用 </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-secondary"> 登入 </NuxtLink>
        </div>
      </div>

      <!-- 功能介紹 -->
      <div class="grid md:grid-cols-3 gap-8 mt-16">
        <div class="card">
          <h3 class="text-lg font-semibold mb-2">🎨 自由畫布設計</h3>
          <p class="text-gray-600">業界唯一的自由畫布設計，突破傳統線性問卷限制</p>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold mb-2">🤖 AI 智能輔助</h3>
          <p class="text-gray-600">AI 全程參與，從創建到分析的智能化體驗</p>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold mb-2">📊 深度分析</h3>
          <p class="text-gray-600">超越簡單統計，提供深度洞察和智能建議</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 設定頁面 meta
useHead({
  title: 'SmartSurvey Pro - 首頁',
});
</script>
