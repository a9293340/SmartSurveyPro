<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// 應用程式根組件
useHead({
  htmlAttrs: {
    lang: 'zh-TW',
  },
});
</script>
