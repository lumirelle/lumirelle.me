<script setup lang="ts">
import { useRoute } from 'vue-router'
import { chineseOnly } from '../logics'

/**
 * The Post list's own filter, in the Shell's voice.
 *
 * It sits directly above the ledger, so it is set the way the ledger's chrome is
 * set: mono, small, faint until it is the current section. A page-level control
 * that shouted in 3xl serif made the pilot page look like two designs stacked.
 */
const sections = [
  { label: 'all', to: '/posts' },
  { label: 'blog', to: '/blog' },
  { label: 'notes', to: '/notes' },
  { label: 'manuals', to: '/manuals' },
]

const route = useRoute()
</script>

<template>
  <div class="text-[12px] font-mono mb-8 flex flex-wrap gap-x-4 gap-y-2 select-none items-baseline md:gap-x-6">
    <button
      type="button"
      class="text-ink-faint no-underline flex gap-1.5 transition-colors items-baseline hover:text-ink-strong"
      :aria-pressed="chineseOnly"
      @click="chineseOnly = !chineseOnly"
    >
      <span
        :class="chineseOnly ? 'i-carbon-checkbox-checked' : 'i-carbon-checkbox'"
        aria-hidden="true"
      />
      chinese only
    </button>

    <span class="text-ink-faint op40" aria-hidden="true">|</span>

    <RouterLink
      v-for="section in sections"
      :key="section.to"
      :to="section.to"
      class="section-link transition-colors hover:text-ink-strong"
      :class="route.path === section.to ? 'text-ink-strong' : 'text-ink-faint'"
      :aria-current="route.path === section.to ? 'page' : undefined"
    >
      {{ section.label }}
    </RouterLink>
  </div>
</template>

<style scoped>
/*
 * `.prose a` puts a hairline under every link on the page. That is the right
 * treatment for prose, where a link sits in a sentence; here the control is
 * chrome, and its current state is carried by ink, not by a rule. A utility
 * class cannot outrank `.prose a`; the scoped attribute can.
 */
.section-link,
.section-link:hover {
  border-bottom: none;
  text-decoration: none;
}
</style>
