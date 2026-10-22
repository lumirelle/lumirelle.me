<script setup lang="ts">
/**
 * The outline panel: the surface, its two chrome lines, and the dialog semantics.
 *
 * It owns nothing about *which* outline it shows — `ShellOutline.vue` adopts the
 * list out of the Post and hands it to the host below; this file only presents
 * it. The split is what keeps one component from changing for adoption, for
 * tracking and for the panel at the same time.
 *
 * Closed means off-canvas and `inert`, not `display: none`: the slide stays
 * possible, and no hidden link is focusable or announced. The panel element is
 * permanent so the outline always has a host to be adopted into, even before
 * this route is known to have one; on a route without an outline it is empty,
 * closed and unreachable.
 */
import { OUTLINE_PANEL_ID, OUTLINE_PANEL_TITLE_ID } from '~/logics/outline-panel.ts'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  /** A link was chosen, or the backdrop was pressed: the owner decides. */
  close: []
}>()

const panel = useTemplateRef<HTMLDivElement>('panel')
const host = useTemplateRef<HTMLDivElement>('host')

/**
 * Into the panel, not onto a link: the reader asked for the outline, and Tab
 * from here reaches the first section.
 */
watch(() => props.open, (open) => {
  if (open)
    void nextTick(() => panel.value?.focus())
})

/** The element the adopted outline is appended to, for the owner to fill. */
function outlineHost(): HTMLElement | null {
  return host.value
}

defineExpose({ outlineHost })

/**
 * Choosing a section dismisses the panel.
 *
 * The click is claimed in the capture phase so the panel is closed — and the page
 * unlocked — before the in-page link rule scrolls to the heading it was asked
 * for. Only a link counts: the panel's own surface is not a dismiss target.
 */
function onPanelClick(event: MouseEvent): void {
  if ((event.target as HTMLElement | null)?.closest('a'))
    emit('close')
}
</script>

<template>
  <div class="outline-layer" :inert="open ? undefined : true">
    <!--
      The backdrop is a pointer convenience, not a control: the keyboard path out
      is `Esc`. It is hidden from assistive technology because there is nothing
      for it to announce — the dialog above it already says what is on screen.
    -->
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -->
    <div class="outline-backdrop" aria-hidden="true" @click="emit('close')" />
    <!--
      A dialog named by its header. `aria-modal` because the column behind it is
      dimmed and cannot scroll while it is open: there is one thing to read here.
    -->
    <div
      :id="OUTLINE_PANEL_ID"
      ref="panel"
      class="outline-panel"
      role="dialog"
      :aria-modal="open ? 'true' : undefined"
      tabindex="-1"
      :aria-labelledby="OUTLINE_PANEL_TITLE_ID"
      :aria-hidden="open ? undefined : 'true'"
      @click.capture="onPanelClick"
    >
      <p :id="OUTLINE_PANEL_TITLE_ID" class="outline-title">
        <span class="prompt">$</span> cat outline
      </p>
      <!-- The adopted outline lands here; see `markdown.css` for its geometry. -->
      <div ref="host" class="outline-host" />
      <p class="outline-foot">
        <span>esc</span>
        <span>o</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/*
 * The layer holds the dimmed column and the panel. It is not a layout box: it is
 * fixed to the viewport so the panel is too, whatever the page transition is
 * doing underneath. Above the content and the Rail, below the image lightbox.
 */
.outline-layer {
  position: fixed;
  inset: 0;
  z-index: 300;
}

/* Closed: nothing here answers the pointer, and nothing in it is reachable. */
.outline-layer[inert] {
  pointer-events: none;
}

.outline-backdrop {
  position: absolute;
  inset: 0;

  /* A wash of the canvas, so the column reads as inactive — no hex, no hue, and
   * the same value in either scheme. */
  background-color: color-mix(in srgb, var(--color-canvas) 55%, transparent);

  opacity: 0;
  transition: opacity 200ms var(--ease-interaction);
}

.outline-layer:not([inert]) .outline-backdrop {
  opacity: 1;
}

/*
 * The panel: a terminal surface at the right edge, square corners, no shadow.
 * A little over a third of a laptop's width — the Rail's labels need the room —
 * and never more than 86% of a phone.
 */
.outline-panel {
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

.outline-layer:not([inert]) .outline-panel {
  transform: none;
}

.outline-title,
.outline-foot {
  display: flex;
  gap: 1ch;
  align-items: baseline;
  justify-content: space-between;

  margin: 0;
  padding: 12px 14px;
}

.outline-title {
  justify-content: flex-start;
}

/* The prompt reads at full ink, as it does in the masthead and in `cd ..`. */
.prompt {
  color: var(--color-ink-strong);
}

.outline-foot {
  padding-bottom: 14px;
}

/*
 * No box of its own: the host is only where the outline is adopted below
 * 1400 px, and the outline keeps its own geometry. `display: contents` lets the
 * list be the panel's flex child, so the list is what scrolls.
 */
.outline-host {
  display: contents;
}

@media (prefers-reduced-motion: reduce) {
  .outline-backdrop,
  .outline-panel {
    transition: none;
  }
}

/* The Rail owns the outline from here, and it needs no panel. */
@media (min-width: 1400px) {
  .outline-layer {
    display: none;
  }
}

@media print {
  .outline-layer {
    display: none;
  }
}
</style>
