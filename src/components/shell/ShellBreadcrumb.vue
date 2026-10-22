<script setup lang="ts">
/**
 * The Shell's identity line: where the reader is, in the system voice, with every
 * segment of the path being its own way out.
 *
 * `lumirelle@me` and `~` both lead home — the first is the identity, the second
 * is the shell's own home shorthand — and every path segment links to itself, so
 * `~/posts/tutorial-git` offers three routes: the site, the list and (here) the
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
/*
 * The line may shrink, but only by as much as its one shrinkable child gives up —
 * there is no clipping on the container, so a long path can never eat the prompt
 * or the parents above it.
 */
.breadcrumb {
  display: flex;
  align-items: baseline;
  flex: 0 1 auto;
  min-width: 0;

  font-family: var(--font-mono, monospace);
  font-size: 12px;
}

/*
 * The prompt (`lumirelle@me ~`) sits at the secondary ink; the path segments and
 * the slashes between them drop to the faint level, because they are the part
 * that changes and the part you can click.
 *
 * Nothing here changes colour on hover or on the active route: position is
 * carried by `aria-current` and by the focus outline.
 */
.const {
  flex: none;
  color: var(--color-ink);
}

/* `~` is part of the path, not part of the prompt: it is a link, and it reads
   with the segments it prefixes. */
.const.tilde {
  flex: none;
  color: var(--color-ink-faint);
}

/* Parent segments are never truncated: where you came from stays readable. */
.crumb {
  flex: none;

  white-space: nowrap;

  border-bottom: none;
  text-decoration: none;
  color: var(--color-ink-faint);
}

/* A space between the identity and the path, as in a shell prompt. */
.gap::before {
  content: ' ';
  white-space: pre;
}

.sep {
  flex: none;
  color: var(--color-ink-faint);
}

/*
 * The page you are on is the one that gives way. A slug like
 * `test-recursive-mono-nbsp-rendering` is the longest thing in the header, so it
 * gets a ceiling and an ellipsis, and it can shrink to nothing if it has to —
 * the header never wraps and the parents above it never collapse.
 */
.current {
  flex: 0 1 auto;
  /* Enough for the ellipsis itself: a collapsed segment should read as truncated,
     not as a bare trailing slash. */
  min-width: 2ch;
  max-width: 32ch;
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;

  color: var(--color-ink-faint);
}

@media (max-width: 30rem) {
  .breadcrumb {
    font-size: 11px;
  }
}
</style>
