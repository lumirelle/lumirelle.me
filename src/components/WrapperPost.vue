<script setup lang="ts">
import { formatDate } from '~/logics'

const { frontmatter } = defineProps<{
  frontmatter: Record<string, any>
}>()

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

const base = 'https://lumirelle.me'
const tweetUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading @lumirelle's ${base}${route.path}\n\nI think...`)}`,
)
const elkUrl = computed(
  () =>
    `https://elk.zone/intent/post?text=${encodeURIComponent(`Reading @lumirelle@m.webtoo.ls's ${base}${route.path}\n\nI think...`)}`,
)
const blueskyUrl = computed(
  () =>
    `https://bsky.app/intent/compose?text=${encodeURIComponent(`Reading @lumirelle.me ${base}${route.path}\n\nI think...`)}`,
)

function navigate(): boolean {
  if (location.hash) {
    const el = document.querySelector(decodeURIComponent(location.hash))
    if (el) {
      const rect = el.getBoundingClientRect()
      const y = window.scrollY + rect.top - 40
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      })
      return true
    }
  }
  return false
}

onMounted(() => {
  const handleAnchors = (event: MouseEvent & { target: HTMLElement }): void => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== globalThis.location.origin) {
        return
      }

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        globalThis.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(globalThis, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  setTimeout(() => {
    if (!navigate()) {
      setTimeout(navigate, 1000)
    }
  }, 1)
})

const ArtComponent = computed(() => {
  let { art } = frontmatter
  if (art === 'random') {
    art = Math.random() > 0.5 ? 'plum' : 'dots'
  }
  if (typeof globalThis !== 'undefined') {
    if (art === 'plum') {
      return defineAsyncComponent(() => import('./ArtPlum.vue'))
    }
    else if (art === 'dots') {
      return defineAsyncComponent(() => import('./ArtDots.vue'))
    }
  }
  return null
})
</script>

<template>
  <ClientOnly v-if="ArtComponent">
    <component :is="ArtComponent" />
  </ClientOnly>
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
    <p v-if="frontmatter.subtitle" class="slide-enter italic opacity-50 !-mt-6">
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter"

      border="l-3 orange-4"

      bg-orange-4:10 px4 py2 text-orange-4
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
  <div
    v-if="route.path !== '/'"
    class="prose slide-enter m-auto mb-8 mt-8 animate-delay-500 print:hidden"
  >
    <template v-if="false && frontmatter.duration">
      <span font-mono op50>> </span>
      <span op50>comment on </span>
      <a :href="blueskyUrl" target="_blank" op50>bluesky</a>
      <span op25> / </span>
      <a :href="elkUrl" target="_blank" op50>mastodon</a>
      <span op25> / </span>
      <a :href="tweetUrl" target="_blank" op50>twitter</a>
    </template>
    <br>
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
    >
      cd ..
    </RouterLink>
  </div>
</template>
