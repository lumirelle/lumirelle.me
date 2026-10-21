<script setup lang="ts">
import { formatDate } from '~/logics'
import { scrollToHash, useInPageLinks } from '~/logics/in-page-links.ts'

const { frontmatter } = defineProps<{
  frontmatter: Record<string, any>
}>()

const content = ref<HTMLDivElement>()

useInPageLinks(content)

onMounted(() => {
  useEventListener(globalThis, 'hashchange', scrollToHash)

  // A link into the middle of the page (`/posts/x#section`) has to land after the
  // content has laid out, which is why the retry exists.
  setTimeout(() => {
    if (!scrollToHash()) {
      setTimeout(scrollToHash, 1000)
    }
  }, 1)
})
</script>

<template>
  <div
    v-if="frontmatter.display ?? frontmatter.title"
    class="prose m-auto mb-8"
    :lang="frontmatter.lang"
    :class="[frontmatter.wrapperClass]"
  >
    <h1 class="mb-0 slide-enter-50">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-50 slide-enter-50 !-mt-6">
      First post on {{ formatDate(frontmatter.date, false) }}
      <span v-if="frontmatter.update">· Last edit on {{ formatDate(frontmatter.update, false) }}</span>
      <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p v-if="frontmatter.place" class="mt--4!">
      <span op50>at </span>
      <a v-if="frontmatter.placeLink" :href="frontmatter.placeLink" target="_blank">
        {{ frontmatter.place }}
      </a>
      <span v-else font-bold>
        {{ frontmatter.place }}
      </span>
    </p>
    <p v-if="frontmatter.subtitle" class="slide-enter opacity-50 italic !-mt-6">
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter"

      border="l-3 orange-4"

      bg-orange-4:10 text-orange-4 px4 py2
    >
      This is a draft post, the content may be incomplete. Please check back later.
    </p>
  </div>
  <article
    ref="content"
    :lang="frontmatter.lang"
    :class="[frontmatter.tocAlwaysOn ? 'toc-always-on' : '', frontmatter.class]"
  >
    <slot />
  </article>
</template>
