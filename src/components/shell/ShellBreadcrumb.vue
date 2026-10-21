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

/* The constant half of the prompt: faint, because it never changes. */
.const,
.crumb {
  border-bottom: none;
  text-decoration: none;
  transition: color var(--duration-interaction) var(--ease-interaction);
}

.const {
  color: var(--color-ink-faint);
}

.const:hover,
.crumb:hover {
  color: var(--color-ink-strong);
}

/* A space between the identity and the path, as in a shell prompt. */
.gap::before {
  content: ' ';
  white-space: pre;
}

.sep {
  color: var(--color-ink-faint);
}

.crumb {
  color: var(--color-ink-strong);
}

/* Where you already are: marked, but not a link. */
.current {
  color: var(--color-ink-strong);
}

@media (max-width: 30rem) {
  .breadcrumb {
    font-size: 11px;
  }
}
</style>
