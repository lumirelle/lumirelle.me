<script setup lang="ts">
function toTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const { y: scroll } = useWindowScroll()
const route = useRoute()

/** The Shell's voice: five destinations, lowercase, mono. */
const links = [
  { label: 'posts', to: '/posts' },
  { label: 'projects', to: '/projects' },
  { label: 'use', to: '/use' },
  { label: 'photos', to: '/photos' },
  { label: 'demos', to: '/demos' },
]

// `/posts/manual-git` is still `posts`: the section owns its children, so the
// active mark survives every route deeper in the tree.
function isCurrent(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <!-- eslint-disable vue-a11y/anchor-has-content -->
  <header class="z-40">
    <div
      class="text-[12px] font-mono mx-auto px-[var(--shell-gutter)] py-5 flex flex-wrap gap-x-8 gap-y-3 max-w-[var(--shell-measure)] items-center justify-between"
    >
      <RouterLink class="text-ink-strong shrink-0 h-6 w-6 select-none" to="/" focusable="false">
        <Logo />
      </RouterLink>
      <nav class="text-ink-faint flex flex-wrap gap-x-7 gap-y-2 items-center" print:op0>
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link transition-colors"
          :class="isCurrent(link.to) ? 'text-ink-strong' : 'hover:text-ink-strong'"
          :aria-current="isCurrent(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
        <a href="/feed.xml" target="_blank" title="RSS feed" aria-label="RSS feed">
          <div i-la-rss-square />
        </a>
        <a
          href="https://github.com/lumirelle"
          target="_blank"
          title="Source on GitHub"
          aria-label="Source on GitHub"
        >
          <div i-uil-github-alt />
        </a>
        <ToggleTheme />
      </nav>
    </div>
    <button
      title="Scroll to top"

      rounded-full h-10 w-10 transition duration-300 bottom-3 right-3 fixed z-100 hover-bg-hex-8883 hover:op100 print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
  </header>
</template>

<style scoped>
/* Interaction answers the pointer in the token layer's time, not a fork-era
   literal. #11 owns the focus outline and the toggle's own states. */
.nav-link {
  transition-duration: var(--duration-interaction);
  transition-timing-function: var(--ease-interaction);
}

nav a:hover,
nav a:focus-visible {
  color: var(--color-ink-strong);
}
</style>
