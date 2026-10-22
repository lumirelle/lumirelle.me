<script setup lang="ts">
/**
 * `cd ..` — the command above the outline.
 *
 * The outline itself is owned by `ShellOutline.vue`; this stays a separate Shell
 * element because `cd ..` sits above the rail rather than inside the Post body.
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
    <span class="prompt">$</span>
    <span>cd ..</span>
  </RouterLink>
</template>

<style scoped>
/*
 * Gutter only, and only where the gutter is wide enough to hold the rail without
 * touching the column: the same 1400 px line the outline rail uses.
 */
.shell-cd-up {
  display: none;
  position: fixed;
  top: 72px;
  left: max(16px, calc(50% - 626px));
  width: 224px;

  padding: 0 0 8px 14px;
  border-left: 1px solid var(--color-stroke);

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  line-height: 1.5;
  /* The same gap the masthead puts between its `$` and its command. */
  gap: 1rem;
  align-items: baseline;

  color: var(--color-ink-faint);
  text-decoration: none;
  transition: color var(--duration-interaction) var(--ease-interaction);
}

/* As in the masthead's command line, the prompt reads at full ink. */
.prompt {
  color: var(--color-ink-strong);
}

.shell-cd-up:hover {
  color: var(--color-ink-strong);
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
