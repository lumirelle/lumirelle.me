<script setup lang="ts">
import { toggleDark } from '~/logics'

/**
 * The theme toggle.
 *
 * It delegates to the site's existing `toggleDark`, so the circular reveal is
 * reused rather than reimplemented — and so the reveal disappears by itself
 * under reduced motion, which `toggleDark` already checks.
 *
 * The accessible name follows the state: a control called "Toggle theme" tells a
 * screen-reader user nothing about what pressing it will do.
 */
const isDark = useDark()
const label = computed(() => (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))
</script>

<template>
  <button
    type="button"
    class="text-ink-faint select-none"
    :aria-label="label"
    :title="label"
    @click="toggleDark($event)"
  >
    <div i-ri-sun-line dark:i-ri-moon-line />
  </button>
</template>
