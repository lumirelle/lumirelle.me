<script setup lang="ts">
/**
 * `cd ..` — the one terminal affordance the Shell itself owns.
 *
 * It sits in the left gutter, above where the outline rail appears, and links to
 * the parent path with the query string carried over, so a filtered list stays
 * filtered when the reader walks back up.
 *
 * It belongs to the Shell, not to the routed content: the outline rail below it
 * is generated inside the Post body by the markdown pipeline, and putting this
 * inside that element would put it back into the content.
 */
const route = useRoute()

const parent = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.length ? `/${segments.slice(0, -1).join('/')}` : ''
})
</script>

<template>
  <RouterLink
    v-if="parent"
    :to="{ path: parent, query: route.query }"
    class="shell-cd-up"
    :title="`Back to ${parent}`"
  >
    <span class="text-ink-strong">$</span>
    <span class="text-ink-faint">cd ..</span>
  </RouterLink>
</template>

<style scoped>
/*
 * Gutter only, and only where the gutter is wide enough to hold it without
 * touching the column: the same 1400 px line the outline rail uses.
 */
.shell-cd-up {
  display: none;
  position: fixed;
  top: 72px;
  left: max(16px, calc(50% - 626px));
  width: 224px;

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  line-height: 1.6;
  gap: 0.5ch;
  align-items: baseline;
}

@media (min-width: 1400px) {
  .shell-cd-up {
    display: flex;
  }
}

@media print {
  .shell-cd-up {
    display: none;
  }
}
</style>
