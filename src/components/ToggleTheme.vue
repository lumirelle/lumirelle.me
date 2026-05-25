<script setup lang="ts">
import { toggleDark } from '~/logics'
</script>

<template>
  <!-- eslint-disable vue-a11y/anchor-has-content -->
  <a class="select-none" title="Toggle Color Scheme" role="button" tabindex="0" @click="toggleDark" @keydown="toggleDark">
    <div i-ri-sun-line dark:i-ri-moon-line />
  </a>
</template>
