<script setup lang="ts">
import raw from '../../../photos/data'
import { galleryView } from '../../logics'

const props = defineProps<{
  limit?: number
}>()

const photos = computed(() => {
  if (props.limit)
    return raw.slice(0, props.limit)
  return raw
})
</script>

<template>
  <div flex="~ gap-1 col items-center justify-center" absolute sm:fixed left-6 top-24>
    <button title="Switch to cover view" rounded-full p2 hover="op100 bg-#8881" :class="galleryView === 'cover' ? 'op40' : 'op20'" @click="galleryView = 'cover'">
      <div i-ri-grid-line />
    </button>
    <button title="Switch to contain view" rounded-full p2 hover="op100 bg-#8881" :class="galleryView === 'contain' ? 'op40' : 'op20'" @click="galleryView = 'contain'">
      <div i-ri-layout-masonry-line />
    </button>
  </div>
  <PhotoGrid :photos="photos" :view="galleryView" />
</template>
