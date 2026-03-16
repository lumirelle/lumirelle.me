<script setup lang="ts">
import { formatDate } from '~/logics'

const { frontmatter, video, date } = defineProps<{
  frontmatter: {
    link: string
  }
  video?: string
  date: string
}>()
</script>

<template>
  <div>
    <a
      border="~ base rounded-lg"

      class="group"
      hover="scale-101 shadow-xl z-10"

      relative block of-hidden bg-base transition-all duration-500
      :href="frontmatter.link"
      target="_blank"
    >
      <video v-if="video" :src="video" autoplay loop muted playsinline w-full border="b base" />

      <div class="prose prose-sm m0 p4 pb3">
        <slot />
        <div pt2 text-sm op50>{{ formatDate(date, false) }}</div>
      </div>
    </a>
  </div>
</template>
