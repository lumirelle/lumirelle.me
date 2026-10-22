<script setup lang="ts">
/**
 * Scroll to top.
 *
 * A control that is only sometimes on screen must be *absent* when it is off,
 * not merely transparent: `inert` takes it out of the tab order and the
 * accessibility tree, where `opacity: 0` on a focusable button would leave a
 * keyboard user tabbing into nothing.
 */
import { useControlReachable } from '~/logics/scroll-threshold.ts'

const visible = useControlReachable()
const reduced = usePreferredReducedMotion()

function toTop(): void {
  window.scrollTo({ top: 0, behavior: reduced.value === 'reduce' ? 'auto' : 'smooth' })
}
</script>

<template>
  <button
    type="button"
    class="shell-to-top shell-control shell-control--bottom shell-control--square"
    :inert="visible ? undefined : true"
    aria-label="Scroll to top"
    @click="toTop"
  >
    <span aria-hidden="true">↑</span>
  </button>
</template>
