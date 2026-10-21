<script setup lang="ts">
/**
 * Scroll to top.
 *
 * A control that is only sometimes on screen must be *absent* when it is off,
 * not merely transparent: `inert` takes it out of the tab order and the
 * accessibility tree, where `opacity: 0` on a focusable button would leave a
 * keyboard user tabbing into nothing.
 */
const { y } = useWindowScroll()
const reduced = usePreferredReducedMotion()

const visible = computed(() => y.value > 320)

function toTop(): void {
  window.scrollTo({ top: 0, behavior: reduced.value === 'reduce' ? 'auto' : 'smooth' })
}
</script>

<template>
  <button
    type="button"
    class="shell-to-top"
    :inert="visible ? undefined : true"
    aria-label="Scroll to top"
    @click="toTop"
  >
    <span aria-hidden="true">↑</span>
  </button>
</template>

<style scoped>
.shell-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;

  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;

  appearance: none;
  cursor: pointer;

  font-family: var(--font-mono, monospace);
  font-size: 12px;
  line-height: 1;

  color: var(--color-ink-strong);
  background-color: var(--color-canvas);
  border: 1px solid var(--color-stroke);
  border-radius: var(--radius-control);

  /* Off until the reader has moved 320 px; `inert` above is what makes that real. */
  opacity: 0;
  transition: opacity var(--duration-interaction) var(--ease-interaction),
    background-color var(--duration-interaction) var(--ease-interaction),
    color var(--duration-interaction) var(--ease-interaction);
}

.shell-to-top:not([inert]) {
  opacity: 1;
}

/* Inverts like a selected line in a shell: ink fill, canvas glyph. */
.shell-to-top:hover {
  color: var(--color-canvas);
  background-color: var(--color-ink-strong);
}

@media (prefers-reduced-motion: reduce) {
  .shell-to-top {
    transition: none;
  }
}

@media print {
  .shell-to-top {
    display: none;
  }
}
</style>
