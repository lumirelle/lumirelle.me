<script setup lang="ts">
/**
 * The Shell's header row: identity, navigation, controls.
 *
 * Everything the old `NavBar` provided has to be re-earned here, so the row is
 * explicit about all of it: the breadcrumb, the five content links, feed and
 * source, the theme toggle, and the scroll control.
 */
const route = useRoute()

/** The Shell's voice: five destinations, lowercase, mono. */
const links = [
  // `/blog`, `/notes` and `/manuals` are the same list under another filter, so
  // they read as `posts` in the navigation — nothing else in the header would
  // tell a reader which section of the site they are in.
  { label: 'posts', to: '/posts', also: ['/blog', '/notes', '/manuals'] },
  { label: 'projects', to: '/projects', also: [] },
  { label: 'use', to: '/use', also: [] },
  { label: 'photos', to: '/photos', also: [] },
  { label: 'demos', to: '/demos', also: [] },
] as const

type Link = (typeof links)[number]

// `/posts/manual-git` is still `posts`: the section owns its children, so the
// active mark survives every route deeper in the tree.
function isCurrent(link: Link): boolean {
  const { to, also } = link as { to: string, also: readonly string[] }
  return route.path === to
    || route.path.startsWith(`${to}/`)
    || also.includes(route.path)
}

/**
 * `page` only when this is literally that page; a section that merely *contains*
 * the current route is `true`, so a screen reader does not announce `/blog` as
 * "posts, current page".
 */
function currentMark(link: Link): 'page' | 'true' | undefined {
  if (!isCurrent(link))
    return undefined
  return route.path === link.to ? 'page' : 'true'
}
</script>

<template>
  <header class="z-40">
    <div
      class="text-[11px] font-mono mx-auto px-[var(--shell-gutter)] py-5 flex flex-wrap gap-x-6 gap-y-2 max-w-[var(--shell-measure)] items-center justify-between md:text-[12px]"
    >
      <ShellBreadcrumb />
      <nav class="text-ink-faint flex flex-wrap gap-x-3 gap-y-2 items-center md:gap-x-7" print:op0>
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link transition-colors"
          :class="isCurrent(link) ? 'text-ink-strong' : 'hover:text-ink-strong'"
          :aria-current="currentMark(link)"
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
  </header>
  <ShellCdUp />
  <ShellScrollToTop />
</template>

<style scoped>
/* Interaction answers the pointer in the token layer's time, not a fork-era
   literal. */
.nav-link {
  transition-duration: var(--duration-interaction);
  transition-timing-function: var(--ease-interaction);
}

nav a:hover,
nav a:focus-visible {
  color: var(--color-ink-strong);
}
</style>
