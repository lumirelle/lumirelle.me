<script setup lang="ts">
/**
 * Hover decode-glitch for a list row's title.
 *
 * The row owns the hover state (a `mouseenter` on a nested span would never
 * fire — it does not bubble), and passes it in as `active`, so keyboard focus
 * can drive the same effect.
 *
 * Layout-inert by construction: random ASCII glyphs are wider or narrower than
 * the real ones, so they must never participate in layout. The real string stays
 * in flow as an invisible spacer, and the animated copy is painted over it in an
 * absolutely positioned, clipped box — the row cannot change height or move its
 * wrap points whatever the random characters turn out to be.
 */
const props = defineProps<{ text: string, active?: boolean }>()

const reduced = usePreferredReducedMotion()
const display = ref(props.text)

const DURATION = 260
const GLYPHS = '#%&@$\\_/<>[]{}()=+*'

let frame: number | undefined

function stop(): void {
  if (frame !== undefined) {
    cancelAnimationFrame(frame)
  }
  frame = undefined
}

function run(): void {
  if (reduced.value === 'reduce') {
    return
  }

  const source = props.text
  const started = performance.now()

  const tick = (now: number): void => {
    const progress = Math.min(1, (now - started) / DURATION)
    const revealed = Math.floor(progress * source.length)
    display.value = [...source]
      .map((glyph, i) =>
        i < revealed || glyph === ' '
          ? glyph
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      )
      .join('')

    if (progress < 1) {
      frame = requestAnimationFrame(tick)
    }
    else {
      display.value = source
      frame = undefined
    }
  }

  stop()
  frame = requestAnimationFrame(tick)
}

watch(() => props.active, (isActive) => {
  if (isActive) {
    run()
  }
})

watch(() => props.text, (text) => {
  display.value = text
})

onUnmounted(stop)
</script>

<template>
  <span class="block relative">
    <span class="invisible" aria-hidden="true">{{ text }}</span>
    <span class="inset-0 absolute overflow-hidden" aria-hidden="true">{{ display }}</span>
    <!-- The real string, unscrambled, for assistive tech and for copy. -->
    <span class="sr-only">{{ text }}</span>
  </span>
</template>
