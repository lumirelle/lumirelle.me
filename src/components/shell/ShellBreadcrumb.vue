<script setup lang="ts">
/**
 * The Shell's identity line: where the reader is, in the system voice, with every
 * segment of the path being its own way out.
 *
 * `lumirelle@me` and `~` both lead home — the first is the identity, the second
 * is the shell's own home shorthand — and every path segment links to itself, so
 * `~/posts/manual-git` offers three routes: the site, the list and (here) the
 * post you are already reading, which is text rather than a link.
 */
const route = useRoute()

interface Crumb {
  label: string
  to: string
  current: boolean
}

const crumbs = computed<Crumb[]>(() => {
  const parts = route.path.split('/').filter(Boolean)
  return parts.map((part, index) => ({
    label: part,
    to: `/${parts.slice(0, index + 1).join('/')}`,
    current: index === parts.length - 1,
  }))
})
</script>

<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <RouterLink to="/" class="const">
      lumirelle@me
    </RouterLink>
    <span class="gap" aria-hidden="true" />
    <RouterLink to="/" class="const tilde" aria-label="Home">
      ~
    </RouterLink>

    <template v-for="crumb in crumbs" :key="crumb.to">
      <span class="sep" aria-hidden="true">/</span>
      <span v-if="crumb.current" class="crumb current" aria-current="page">{{ crumb.label }}</span>
      <RouterLink v-else :to="crumb.to" class="crumb">
        {{ crumb.label }}
      </RouterLink>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;

  font-family: var(--font-mono, monospace);
  font-size: 12px;
}

/*
 * The whole header reads at one ink level — the secondary one — so it sits behind
 * the titles it frames. State is carried by `aria-current` and by the focus
 * outline, not by a colour that makes half the row look disabled: nothing here
 * changes colour on hover, on the active route, or between the constant half and
 * the path.
 */
.const,
.crumb {
  border-bottom: none;
  text-decoration: none;
  color: var(--color-ink);
}

/* A space between the identity and the path, as in a shell prompt. */
.gap::before {
  content: ' ';
  white-space: pre;
}

.sep,
.current {
  color: var(--color-ink);
}

@media (max-width: 30rem) {
  .breadcrumb {
    font-size: 11px;
  }
}
</style>
