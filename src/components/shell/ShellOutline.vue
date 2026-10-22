<script setup lang="ts">
/**
 * The outline, and the one place that owns it.
 *
 * The TOC markup itself comes from the markdown pipeline — this only moves it
 * into the Shell, restyles it (see `src/styles/markdown.css`) and tracks which
 * section is in view. Tracking is scroll arithmetic rather than
 * `IntersectionObserver`, which went stale and never advanced during the
 * prototype.
 *
 * Ownership answers two things:
 *
 * - **The route** — the outline belongs to the Post being rendered, not to the
 *   first match in the document. During a transition the outgoing page is still
 *   mounted, so a plain query would keep finding the old outline.
 * - **The width** — at 1400 px and wider the gutter can hold the rail, so it is
 *   adopted into `<body>` exactly as before. Below that line the same element
 *   goes to this component's host, where the panel will present it; it is never
 *   re-implemented and never left inside the routed content.
 *
 * The markdown pipeline generates the outline *inside* the Post body, under
 * whatever the page transition animates. A `transform` anywhere up that tree
 * becomes its containing block, so a `position: fixed` outline resolves against
 * the content column instead of the viewport and jumps into the text. Adopting
 * it out keeps it viewport-relative and makes the transition safe; keeping the
 * narrow presentation in this host also means a route change cannot leave the
 * outgoing Post's outline behind.
 *
 * Adopting it also takes it out from under the Post body's link handling, so the
 * outline installs the same in-page rule itself (see `~/logics/in-page-links.ts`).
 * Without it an outline click reaches the router, changes the hash, re-keys the
 * route frame and plays the page transition for what is only a scroll.
 */
import { useInPageLinks } from '~/logics/in-page-links.ts'

const route = useRoute()

/** The rail's own breakpoint: the gutter can hold 224 px without touching the column. */
const wide = useMediaQuery('(min-width: 1400px)')

/** Below 1400 px the outline lives here, ready for the panel to present it. */
const host = useTemplateRef<HTMLDivElement>('host')

interface Heading {
  id: string
  top: number
}

/** The frame that owns the route being rendered — during a transition there are two. */
function liveFrame(): HTMLElement | null {
  const frames = [...document.querySelectorAll<HTMLElement>('.route-frame')]
  return frames.find(frame => frame.dataset.route === route.fullPath) ?? null
}

/** Where this width's presentation keeps the outline. */
function outlineTarget(): HTMLElement {
  return wide.value ? document.body : (host.value ?? document.body)
}

const adopted = shallowRef<HTMLElement | null>(null)

useInPageLinks(adopted)

function adoptOutline(): void {
  const frame = liveFrame()

  if (!frame) {
    adopted.value?.remove()
    adopted.value = null
    return
  }

  const target = outlineTarget()
  const current = adopted.value

  // Already adopted for this route: only move it when the width changed which
  // presentation owns it. Reusing the node keeps its list, scroll and active
  // mark intact; removing and re-querying would lose them because the outline
  // is no longer inside the frame.
  if (current?.dataset.owner === route.fullPath) {
    if (current.parentElement !== target)
      target.appendChild(current)
    return
  }

  current?.remove()
  adopted.value = null

  const outline = frame.querySelector<HTMLElement>('.table-of-contents')
  if (outline) {
    outline.dataset.owner = route.fullPath
    target.appendChild(outline)
    adopted.value = outline
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
  adoptOutline()
  measure()
  track()
}

/**
 * A route change renders over two frames, so the incoming outline may not exist
 * yet when the route commits. Look again once the move has finished.
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

// The outline is generated per Post, so remeasure once the new page has committed.
watch(() => route.fullPath, () => nextTick(refreshAfterMove))

// Crossing the rail's breakpoint hands the same node to the other presentation.
watch(wide, refresh)
</script>

<template>
  <div ref="host" class="shell-outline-host" />
</template>

<style scoped>
/*
 * No box of its own: the host is only where the outline lives below 1400 px, and
 * the outline itself keeps its own fixed position. A box here would become a
 * layout row in the Shell and could change what the outline resolves against.
 */
.shell-outline-host {
  display: contents;
}
</style>
