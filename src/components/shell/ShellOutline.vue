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
 *   goes into the panel this component presents it in; it is never
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
 *
 * ## The panel
 *
 * Below 1400 px the outline is *opened*, never revealed: `outline` is a control
 * in the bottom-right column, above `↑`, and the list lives in a dialog that
 * slides in from the right edge. A hover reveal had no meaning on a touch screen
 * — the first tap stuck a transparent column of links over the article — and two
 * presentations of one behaviour meant two things to fix. Above 1400 px the Rail
 * is untouched, because it was never the problem.
 *
 * Closed means off-canvas and `inert`, not `display: none`: the slide stays
 * possible and no hidden link is focusable or announced. The panel element
 * itself is permanent so that the outline always has a host to be adopted into,
 * even before this route is known to have one; on a route without an outline it
 * is empty, closed and unreachable.
 *
 * The control goes the same way while the panel is open. The panel covers it, but
 * covered is not absent: Tab would still land on a control the reader cannot see.
 * So the open state is `inert`, which takes it out of the tab order and the
 * accessible tree in one move — `aria-hidden` on top of that is redundant, and
 * the linter is right to refuse it on something focusable. Closing hands focus
 * back only once that has been undone: focusing an `inert` element is a no-op,
 * which is why the return call waits for `nextTick`.
 */
import { isFocusedElementEditable } from '@vueuse/core'
import { useImageLightbox } from '~/logics/image-lightbox.ts'
import { useInPageLinks } from '~/logics/in-page-links.ts'

const route = useRoute()

/** The rail's own breakpoint: the gutter can hold 224 px without touching the column. */
const wide = useMediaQuery('(min-width: 1400px)')

/** Below 1400 px the outline lives here, inside the panel. */
const host = useTemplateRef<HTMLDivElement>('host')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const panel = useTemplateRef<HTMLDivElement>('panel')

const lightbox = useImageLightbox()

const PANEL_ID = 'outline-panel'
const PANEL_TITLE_ID = 'outline-panel-title'

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

/** A route with no outline gets no control, and a panel with nothing in it. */
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

/** Whether the reader has moved far enough for the bottom-right column to be useful. */
const { y } = useWindowScroll()
const reachable = computed(() => y.value > 320)

const open = ref(false)

/**
 * The document's own scroller. `main.css` gives `html` its own overflow, so a
 * lock on `body` would leave the window scrolling behind the panel.
 */
const locked = useScrollLock(computed(() => (typeof document === 'undefined' ? null : document.documentElement)))

function openPanel(): void {
  if (open.value)
    return
  open.value = true
  locked.value = true
  // Into the panel, not onto a link: the reader asked for the outline, and Tab
  // from here reaches the first section.
  void nextTick(() => panel.value?.focus())
}

function closePanel(returnFocus = true): void {
  if (!open.value)
    return
  open.value = false
  locked.value = false
  // Focus goes back after the DOM has caught up: the control is `inert` for as
  // long as the panel is open, and focusing an `inert` element does nothing. So
  // the call is deferred past the patch that clears it.
  if (returnFocus)
    void nextTick(() => trigger.value?.focus())
}

/**
 * Choosing a section dismisses the panel.
 *
 * Captured, so the panel is closed — and the page unlocked — before the in-page
 * link rule scrolls to the heading it was asked for. Only a link counts: the
 * panel's own surface is not a dismiss target.
 */
function onPanelClick(event: MouseEvent): void {
  if ((event.target as HTMLElement | null)?.closest('a'))
    closePanel()
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
    The panel's control. Absent on a route with no outline, hidden at 1400 px and
    wider where the Rail owns the job, and `inert` until the reader has scrolled —
    the same threshold, the same column and the same hairline box as the scroll
    control it sits above. While the panel is open it stays in the DOM but leaves
    the page: `inert` keeps Tab off it and takes it out of the accessible tree, so
    the panel is the only thing there is to reach.
  -->
  <button
    v-if="hasOutline"
    ref="trigger"
    type="button"
    class="shell-outline-trigger"
    :inert="reachable && !open ? undefined : true"
    :aria-expanded="open ? 'true' : 'false'"
    :aria-controls="PANEL_ID"
    @click="openPanel"
  >
    outline
  </button>
  <div class="shell-outline-layer" :inert="open ? undefined : true">
    <!--
      The backdrop is a pointer convenience, not a control: the keyboard path out
      is `Esc`, and the panel's own control is the only focusable way back. It is
      hidden from assistive technology because there is nothing for it to
      announce — the dialog above it already states what is on screen.
    -->
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -->
    <div class="shell-outline-backdrop" aria-hidden="true" @click="closePanel()" />
    <!--
      A dialog named by its header, reporting its state through the control above.
      Off-canvas and `inert` while closed, so the slide is possible and no link
      inside it is announced or reachable.
    -->
    <div
      :id="PANEL_ID"
      ref="panel"
      class="shell-outline-panel"
      role="dialog"
      tabindex="-1"
      :aria-labelledby="PANEL_TITLE_ID"
      :aria-hidden="open ? undefined : 'true'"
      @click.capture="onPanelClick"
    >
      <p :id="PANEL_TITLE_ID" class="shell-outline-title">
        <span class="prompt">$</span> cat outline
      </p>
      <!-- The adopted outline lands here; see `markdown.css` for its geometry. -->
      <div ref="host" class="shell-outline-host" />
      <p class="shell-outline-foot">
        <span>esc</span>
        <span>o</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/*
 * The control: the scroll control's box, one gap above it in the same column.
 * 24 px bottom + 32 px tall + 8 px = 64 px.
 */
.shell-outline-trigger {
  position: fixed;
  right: 24px;
  bottom: 64px;
  z-index: 100;

  height: 32px;
  padding: 0 10px;

  appearance: none;
  cursor: pointer;

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  line-height: 1;

  color: var(--color-ink-strong);
  background-color: var(--color-canvas);
  border: 1px solid var(--color-stroke);
  border-radius: var(--radius-control);

  /* Off until the reader has moved 320 px; `inert` in the template is what
   * makes that real. */
  opacity: 0;
  transition: opacity var(--duration-interaction) var(--ease-interaction),
    background-color var(--duration-interaction) var(--ease-interaction),
    color var(--duration-interaction) var(--ease-interaction);
}

.shell-outline-trigger:not([inert]) {
  opacity: 1;
}

/* Inverts like a selected line in a shell: ink fill, canvas glyph. */
.shell-outline-trigger:hover {
  color: var(--color-canvas);
  background-color: var(--color-ink-strong);
}

/*
 * The layer holds the dimmed column and the panel. It is not a layout box: it is
 * fixed to the viewport so the panel is too, whatever the page transition is
 * doing underneath. Above the content and the Rail, below the image lightbox.
 */
.shell-outline-layer {
  position: fixed;
  inset: 0;
  z-index: 300;
}

/* Closed: nothing here answers the pointer, and nothing in it is reachable. */
.shell-outline-layer[inert] {
  pointer-events: none;
}

.shell-outline-backdrop {
  position: absolute;
  inset: 0;

  /* A wash of the canvas, so the column reads as inactive — no hex, no hue, and
   * the same value in either scheme. */
  background-color: color-mix(in srgb, var(--color-canvas) 55%, transparent);

  opacity: 0;
  transition: opacity 200ms var(--ease-interaction);
}

.shell-outline-layer:not([inert]) .shell-outline-backdrop {
  opacity: 1;
}

/*
 * The panel: a terminal surface at the right edge, square corners, no shadow.
 * A little over a third of a laptop's width — the Rail's labels need the room —
 * and never more than 86% of a phone.
 */
.shell-outline-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 86vw);

  display: flex;
  flex-direction: column;

  background-color: var(--color-surface);
  border-left: 1px solid var(--color-stroke);

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-ink-faint);

  transform: translateX(100%);
  transition: transform 200ms var(--ease-interaction);
}

.shell-outline-layer:not([inert]) .shell-outline-panel {
  transform: none;
}

.shell-outline-title,
.shell-outline-foot {
  display: flex;
  gap: 1ch;
  align-items: baseline;
  justify-content: space-between;

  margin: 0;
  padding: 12px 14px;
}

.shell-outline-title {
  gap: 1ch;
  justify-content: flex-start;
}

/* The prompt reads at full ink, as it does in the masthead and in `cd ..`. */
.prompt {
  color: var(--color-ink-strong);
}

.shell-outline-foot {
  padding-bottom: 14px;
}

/*
 * No box of its own: the host is only where the outline is adopted below
 * 1400 px, and the outline keeps its own geometry. `display: contents` lets the
 * list be the panel's flex child, so the list is what scrolls.
 */
.shell-outline-host {
  display: contents;
}

@media (prefers-reduced-motion: reduce) {
  .shell-outline-trigger,
  .shell-outline-backdrop,
  .shell-outline-panel {
    transition: none;
  }
}

/* The Rail owns the outline from here, and it needs neither control nor panel. */
@media (min-width: 1400px) {
  .shell-outline-trigger,
  .shell-outline-layer {
    display: none;
  }
}

@media print {
  .shell-outline-trigger,
  .shell-outline-layer {
    display: none;
  }
}
</style>
