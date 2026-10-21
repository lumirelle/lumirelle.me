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
import { useInPageLinks } from '~/logics/in-page-links.ts'

const route = useRoute()

const parent = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.length ? `/${segments.slice(0, -1).join('/')}` : ''
})

interface Heading {
  id: string
  top: number
}

/** The frame that owns the route being rendered — during a transition there are two. */
function liveFrame(): HTMLElement | null {
  const frames = [...document.querySelectorAll<HTMLElement>('.route-frame')]
  return frames.find(frame => frame.dataset.route === route.fullPath) ?? null
}

/**
 * The rail belongs to the Shell, not to the routed content.
 *
 * The markdown pipeline generates it *inside* the Post body, which means it lives
 * under whatever the page transition animates — and a `transform` anywhere up
 * that tree becomes its containing block, so a `position: fixed` rail resolves
 * against the content column instead of the viewport and jumps into the text.
 * Adopting it into `<body>` keeps it viewport-relative and makes the transition
 * safe.
 *
 * Ownership is by route, not by "first match in the document": during a
 * transition the outgoing page is still mounted, so a plain query would keep
 * finding the old rail and the new Post would never get one.
 *
 * Adopting it also takes it out from under the Post body's link handling, so the
 * rail installs the same in-page rule itself (see `~/logics/in-page-links.ts`).
 * Without it a rail click reaches the router, changes the hash, re-keys the route
 * frame and plays the page transition for what is only a scroll.
 */
const adopted = shallowRef<HTMLElement | null>(null)

useInPageLinks(adopted)

function adoptRail(): void {
  const frame = liveFrame()

  if (!frame) {
    adopted.value?.remove()
    adopted.value = null
    return
  }

  // Already adopted for this route: nothing to do (the rail is out of the frame).
  if (adopted.value?.dataset.owner === route.fullPath) {
    return
  }

  adopted.value?.remove()
  adopted.value = null

  const rail = frame.querySelector<HTMLElement>('.table-of-contents')
  if (rail) {
    rail.dataset.owner = route.fullPath
    document.body.appendChild(rail)
    adopted.value = rail
  }
}

let headings: Heading[] = []
let frameRequest: number | undefined
let adoptTimer: number | undefined

/** Measure the headings of the live page only, never the one that is leaving. */
function measure(): void {
  const live = liveFrame()
  const scope = live ?? document
  headings = [...scope.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id], .prose h4[id]')]
    .map(heading => ({ id: heading.id, top: heading.getBoundingClientRect().top + window.scrollY }))
}

function track(): void {
  frameRequest = undefined
  const marks = (adopted.value ?? document).querySelectorAll<HTMLAnchorElement>('.table-of-contents a[href^="#"]')
  if (!marks.length || !headings.length)
    return

  // A heading becomes active once its top passes a third of the viewport down; at
  // the very top of the page nobody has, so the first section is where you are.
  const line = window.scrollY + window.innerHeight / 3
  const passed = headings.filter(heading => heading.top <= line)
  const activeId = passed.length ? passed.at(-1)!.id : (headings[0]?.id ?? '')
  let active: HTMLAnchorElement | undefined

  for (const mark of marks) {
    const isActive = mark.getAttribute('href') === `#${activeId}`
    mark.classList.toggle('toc-active', isActive)
    if (isActive)
      active = mark
  }

  // The rail is a window on the outline, and with h4 in it a long Manual's mark
  // can fall outside that window. `nearest` moves the rail only when it has to,
  // so a reader who scrolled the rail themselves keeps their place.
  active?.scrollIntoView({ block: 'nearest' })
}

function onScroll(): void {
  if (frameRequest === undefined)
    frameRequest = requestAnimationFrame(track)
}

function refresh(): void {
  adoptRail()
  measure()
  track()
}

/**
 * A route change renders over two frames, so the incoming rail may not exist yet
 * when the route commits. Look again once the move has finished.
 */
function refreshAfterMove(): void {
  refresh()
  window.clearTimeout(adoptTimer)
  adoptTimer = window.setTimeout(refresh, 350)
}

onMounted(() => {
  refreshAfterMove()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', refresh, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', refresh)
  if (frameRequest !== undefined)
    cancelAnimationFrame(frameRequest)
  window.clearTimeout(adoptTimer)
  adopted.value?.remove()
  adopted.value = null
})

// The TOC is generated per Post, so remeasure once the new page has committed.
watch(() => route.fullPath, () => nextTick(refreshAfterMove))
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
