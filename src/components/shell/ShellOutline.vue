<script setup lang="ts">
/**
 * The outline, and the one place that owns it.
 *
 * The outline's markup itself comes from the markdown pipeline — this only moves
 * it into the Shell, restyles it (see `src/styles/markdown.css`) and tracks which
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
 *   goes to the panel's host; it is never re-implemented and never left inside
 *   the routed content.
 *
 * The markdown pipeline generates the outline *inside* the Post body, under
 * whatever the page transition animates. A `transform` anywhere up that tree
 * becomes its containing block, so a `position: fixed` outline resolves against
 * the content column instead of the viewport and jumps into the text. Adopting
 * it out keeps it viewport-relative and makes the transition safe; keeping the
 * narrow presentation in the panel's host also means a route change cannot leave
 * the outgoing Post's outline behind.
 *
 * Adopting it also takes it out from under the Post body's link handling, so the
 * outline installs the same in-page rule itself (see `~/logics/in-page-links.ts`).
 * Without it an outline click reaches the router, changes the hash, re-keys the
 * route frame and plays the page transition for what is only a scroll.
 *
 * ## Below 1400 px
 *
 * The outline is *opened*, never revealed: `outline` is a control in the
 * bottom-right column, above `↑`, and the list lives in the dialog that
 * `ShellOutlinePanel.vue` presents. A hover reveal had no meaning on a touch
 * screen — the first tap stuck a transparent column of links over the article —
 * and two presentations of one behaviour meant two things to fix. Above 1400 px
 * the Rail is untouched, because it was never the problem.
 *
 * This file owns the control and the panel's state; the panel owns its own
 * surface, a11y attributes and the focus move into it.
 */
import { isFocusedElementEditable } from '@vueuse/core'
import { useImageLightbox } from '~/logics/image-lightbox.ts'
import { useInPageLinks } from '~/logics/in-page-links.ts'
import { OUTLINE_PANEL_ID } from '~/logics/outline-panel.ts'
import { useControlReachable } from '~/logics/scroll-threshold.ts'

const route = useRoute()

/** The rail's own breakpoint: the gutter can hold 224 px without touching the column. */
const wide = useMediaQuery('(min-width: 1400px)')

const trigger = useTemplateRef<HTMLButtonElement>('trigger')

/** The panel, present in the DOM whether or not it is open; it holds the host. */
const panel = useTemplateRef<{ outlineHost: () => HTMLElement | null }>('panel')

const lightbox = useImageLightbox()

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
  if (wide.value)
    return document.body
  return panel.value?.outlineHost() ?? document.body
}

const adopted = shallowRef<HTMLElement | null>(null)

useInPageLinks(adopted)

/** A route with no outline gets no control. */
const hasOutline = computed(() => adopted.value !== null)

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

/** The same threshold the scroll control uses: they are one column. */
const reachable = useControlReachable()

const open = ref(false)

/**
 * Where the reader was when this opened.
 *
 * `o` can open the panel from the top of the page, where the control below is
 * still `inert` — and focusing an inert element does nothing, so returning focus
 * to it would drop the reader at the top of the tab order. The opener is the
 * fallback that keeps them where they were.
 */
const opener = shallowRef<HTMLElement | null>(null)

/**
 * The document's own scroller. `main.css` gives `html` its own overflow, so a
 * lock on `body` would leave the window scrolling behind the panel.
 */
const locked = useScrollLock(computed(() => (typeof document === 'undefined' ? null : document.documentElement)))

function openPanel(): void {
  if (open.value)
    return
  const active = document.activeElement
  opener.value = active instanceof HTMLElement && active !== document.body ? active : null
  open.value = true
  locked.value = true
}

function closePanel(returnFocus = true): void {
  if (!open.value)
    return
  open.value = false
  locked.value = false
  if (!returnFocus)
    return

  // Looked up after the patch, because the control does not exist while the panel
  // is open: it is the control when the column is on screen, and otherwise
  // whatever opened the panel — `o` works at the top of the page, where there is
  // no control to hand focus back to.
  void nextTick(() => {
    const target = reachable.value ? trigger.value : opener.value
    if (target?.isConnected)
      target.focus()
  })
}

// `esc` closes, `o` toggles — one key, no chords, and only when the reader is
// not typing and the image lightbox does not already own the keyboard.
onKeyStroke('Escape', () => closePanel())

onKeyStroke('o', (event) => {
  if (!hasOutline.value || wide.value)
    return
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
    return
  if (lightbox.value || isFocusedElementEditable())
    return

  event.preventDefault()
  if (open.value)
    closePanel()
  else
    openPanel()
})

onMounted(() => {
  refreshAfterMove()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', refresh)
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
// A route change also ends the panel: it belonged to the Post that is leaving,
// and the reader did not ask for the new page to start behind it.
watch(() => route.fullPath, () => {
  closePanel(false)
  return nextTick(refreshAfterMove)
})

// Crossing the rail's breakpoint hands the same node to the other presentation,
// and ends the panel: it has no counterpart at 1400 px and wider.
watch(wide, () => {
  closePanel(false)
  refresh()
})
</script>

<template>
  <!--
    The control. Absent on a route with no outline, absent at 1400 px and wider
    where the Rail owns the job, absent in print, and absent while the panel is
    open — not merely covered by it. `inert` until the reader has scrolled: the
    same threshold, the same column and the same hairline box as the scroll
    control it sits above.
  -->
  <button
    v-if="hasOutline && !open"
    ref="trigger"
    type="button"
    class="shell-outline-trigger shell-control shell-control--labelled shell-control--stacked"
    :inert="reachable ? undefined : true"
    :aria-expanded="open ? 'true' : 'false'"
    :aria-controls="OUTLINE_PANEL_ID"
    @click="openPanel"
  >
    outline
  </button>
  <ShellOutlinePanel ref="panel" :open="open" @close="closePanel()" />
</template>

<style scoped>
/* The Rail owns the outline from here, and it needs no control. */
@media (min-width: 1400px) {
  .shell-outline-trigger {
    display: none;
  }
}
</style>
