<script setup lang="ts">
import { useRoute } from 'vue-router'
import { chineseOnly } from '../logics'

const inactiveStyle = 'opacity-20 hover:opacity-50'
const activeStyle = 'opacity-100 underline'

const route = useRoute()
</script>

<template>
  <div class="prose m-auto mb-8 select-none animate-none! op100!">
    <button flex="~ gap1" mb2 items-center text-sm op30 @click="chineseOnly = !chineseOnly">
      <div :i="chineseOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />
      Chinese Only
    </button>

    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-3xl>
      <RouterLink
        to="/posts"
        class="!border-none"
        :class="route.path === '/posts' ? activeStyle : inactiveStyle"
      >
        All Posts
      </RouterLink>
      <RouterLink
        to="/blog"
        class="!border-none"
        :class="route.path === '/blog' ? activeStyle : inactiveStyle"
      >
        Blog
      </RouterLink>
      <RouterLink
        to="/notes"
        class="!border-none"
        :class="route.path === '/notes' ? activeStyle : inactiveStyle"
      >
        Notes
      </RouterLink>
      <RouterLink
        to="/manuals"
        class="!border-none"
        :class="route.path === '/manuals' ? activeStyle : inactiveStyle"
      >
        Manuals
      </RouterLink>
    </div>
  </div>
</template>
