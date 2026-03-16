<script setup lang="ts">
import type { Photo } from '../../../photos/data'

defineProps<{
  photos: Photo[]
  view?: 'cover' | 'contain'
}>()
</script>

<template>
  <div
    class="photos grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4"

    mx-auto max-w-500
  >
    <div v-for="(photo, idx) in photos" :key="idx">
      <img
        :src="photo.url"
        :alt="photo.text"
        :data-photo-index="idx"
        loading="lazy"
        w-full
        :class="
          view === 'contain' ? 'object-contain sm:aspect-square' : 'object-cover aspect-square'
        "
      >
    </div>
  </div>
</template>
