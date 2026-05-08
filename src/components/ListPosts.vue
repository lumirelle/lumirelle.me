<script setup lang="ts">
import type { Post } from '~/types'
import { useRouter } from 'vue-router'
import { chineseOnly, formatDate } from '~/logics'

const props = defineProps<{
  type?: string
  posts?: Post[]
  extra?: Post[]
}>()

const router = useRouter()
const routes: Post[] = router
  .getRoutes()
  .filter(
    i => i.path.startsWith('/posts') && i.meta.frontmatter.date && !i.meta.frontmatter.draft,
  )
  .filter(
    i =>
      !i.path.endsWith('.html')
      && (!props.type || (i.meta.frontmatter.type || 'blog').split('+').includes(props.type)),
  )
  .map(i => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    lang: i.meta.frontmatter.lang,
    duration: i.meta.frontmatter.duration,
    recording: i.meta.frontmatter.recording,
    upcoming: i.meta.frontmatter.upcoming,
    redirect: i.meta.frontmatter.redirect,
    place: i.meta.frontmatter.place,
  }))

const posts = computed(() =>
  [...(props.posts || routes), ...(props.extra || [])]
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter(i => !chineseOnly.value || !i.lang || i.lang === 'zh'),
)

const getYear = (a: Date | string | number): number => new Date(a).getFullYear()
function isFuture(a?: Date | string | number): boolean {
  return a !== undefined && new Date(a) > new Date()
}
function isSameYear(a?: Date | string | number, b?: Date | string | number): boolean {
  return a !== undefined && b !== undefined && getYear(a) === getYear(b)
}
function isSameGroup(a: Post, b?: Post): boolean {
  return isFuture(a.date) === isFuture(b?.date) && isSameYear(a.date, b?.date)
}

function getGroupName(p: Post): number | string {
  if (isFuture(p.date)) {
    return 'Upcoming'
  }
  return getYear(p.date)
}
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>

    <template v-for="(route, idx) in posts" :key="route.path">
      <div
        v-if="!isSameGroup(route, posts[idx - 1])"
        slide-enter h20 pointer-events-none select-none relative
        :style="{
          '--enter-stage': idx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span

          text-8em color-transparent font-bold text-stroke-2 text-stroke-hex-aaa op10 left--3rem top--2rem absolute
        >{{ getGroupName(route) }}</span>
      </div>
      <div
        class="slide-enter"
        :style="{
          '--enter-stage': idx,
          '--enter-step': '60ms',
        }"
      >
        <component
          :is="route.path.includes('://') ? 'a' : 'RouterLink'"
          v-bind="
            route.path.includes('://')
              ? {
                href: route.path,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
              : {
                to: route.path,
              }
          "
          class="item font-normal mb-6 mt-2 no-underline block"
        >
          <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
            <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
              <span
                v-if="route.lang === 'zh'"
                align-middle flex-none
                class="text-zinc5 text-xs my-auto ml--12 mr2 px-1 py-0.5 rounded bg-zinc:15 hidden md:block"
              >中文 / CN</span>
              <span
                v-if="route.lang === 'en'"
                align-middle flex-none
                class="text-zinc5 text-xs my-auto ml--15 mr2 px-1 py-0.5 rounded bg-zinc:15 hidden md:block"
              >英语 / EN</span>
              <span align-middle>{{ route.title }}</span>
              <span
                v-if="route.redirect"

                i-carbon-arrow-up-right text-xs ml--1.5 align-middle op50 flex-none
                title="External"
              />
            </div>

            <div flex="~ gap-2 items-center">
              <span
                v-if="route.inperson"
                i-ri:group-2-line align-middle op50 flex-none
                title="In person"
              />
              <span
                v-if="route.recording || route.video"
                i-ri:film-line align-middle op50 flex-none
                title="Provided in video"
              />
              <span
                v-if="route.radio"
                i-ri:radio-line align-middle op50 flex-none
                title="Provided in radio"
              />

              <span text-sm op50 ws-nowrap>
                {{ formatDate(route.date, true) }}
              </span>
              <span v-if="route.duration" text-sm op40 ws-nowrap>· {{ route.duration }}</span>
              <span v-if="route.platform" text-sm op40 ws-nowrap>· {{ route.platform }}</span>
              <span v-if="route.place" text-sm op40 ws-nowrap md:hidden>· {{ route.place }}</span>
              <span
                v-if="route.lang === 'zh'"
                align-middle flex-none
                class="text-zinc5 text-xs my-auto px-1 py-0.5 rounded bg-zinc:15 md:hidden"
              >中文 / CN</span>
              <span
                v-if="route.lang === 'en'"
                align-middle flex-none
                class="text-zinc5 text-xs my-auto px-1 py-0.5 rounded bg-zinc:15 md:hidden"
              >英语 / EN</span>
            </div>
          </li>
          <div v-if="route.place" text-sm mt--2 op50 hidden md:block>
            {{ route.place }}
          </div>
        </component>
      </div>
    </template>
  </ul>
</template>
