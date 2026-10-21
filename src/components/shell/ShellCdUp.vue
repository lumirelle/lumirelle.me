<script setup lang="ts">
/**
 * The outline rail, and the `cd ..` that sits above it.
 *
 * The TOC markup itself comes from the markdown pipeline — this only restyles it
 * (see `src/styles/markdown.css`) and tracks which section is in view. Tracking
 * is scroll arithmetic rather than `IntersectionObserver`, which went stale and
 * never advanced during the prototype.
 *
 * It is a Shell element: the rail is in the gutter, outside the routed content,
 * and `cd ..` belongs above it rather than inside the Post body.
 */
const route = useRoute()

const parent = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.length ? `/${segments.slice(0, -1).join('/')}` : ''
})

interface Heading {
  id: string
  top: number
}

let headings: Heading[] = []
let frame: number | undefined

function measure(): void {
  headings = [...document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]')]
    .map(heading => ({ id: heading.id, top: heading.getBoundingClientRect().top + window.scrollY }))
}

function track(): void {
  frame = undefined
  const marks = document.querySelectorAll<HTMLAnchorElement>('.table-of-contents a[href^="#"]')
  if (!marks.length || !headings.length)
    return

  // A heading becomes active once its top passes a third of the viewport down.
  const line = window.scrollY + window.innerHeight / 3
  const passed = headings.filter(heading => heading.top <= line)
  const activeId = passed.length ? passed.at(-1)!.id : ''

  for (const mark of marks) {
    mark.classList.toggle('toc-active', mark.getAttribute('href') === `#${activeId}`)
  }
}

function onScroll(): void {
  if (frame === undefined)
    frame = requestAnimationFrame(track)
}

function refresh(): void {
  measure()
  track()
}

onMounted(() => {
  refresh()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', refresh, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', refresh)
  if (frame !== undefined)
    cancelAnimationFrame(frame)
})

// The TOC is generated per Post, so remeasure once the new page has committed.
watch(() => route.fullPath, () => nextTick(refresh))
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
