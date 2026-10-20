<script setup lang="ts">
/**
 * The Shell's identity line: where the reader is, in the system voice.
 *
 * `lumirelle@me` is faint because it is constant, the path is at full ink
 * because it is the only part that changes. The whole line links home, which is
 * why the Shell no longer needs a logo to keep `/` reachable.
 */
const route = useRoute()

const path = computed(() => (route.path === '/' ? '~' : `~${route.path}`))
</script>

<template>
  <RouterLink to="/" class="text-[12px] font-mono shrink-0 transition-colors">
    <span class="text-ink-faint hover:text-ink-strong">lumirelle@me</span>{{ ' ' }}<span class="text-ink-strong">{{ path }}</span>
  </RouterLink>
</template>
