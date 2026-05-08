<script setup lang="ts">
defineProps<{
  repo: string
  name?: string
}>()
</script>

<template>
  <span ws-nowrap>
    <CarbonLogoGithub class="inline-block" />
    <a class="font-mono ml-1 opacity-70" :href="`https://github.com/${repo}`" target="_blank">{{
      name || (repo.startsWith('lumirelle/') ? repo.slice(8) : repo)
    }}</a>
  </span>
</template>
