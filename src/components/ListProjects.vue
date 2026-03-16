<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>()

const SLUG_REGEX = /[\s\\/]+/g
function slug(name: string): string {
  return name.toLowerCase().replaceAll(SLUG_REGEX, '-')
}
</script>

<template>
  <div class="mx-auto max-w-300">
    <p mb5 mt--6 text-center text-lg italic op50>
      Projects that I created or maintaining.
    </p>
    <div class="prose mx-auto mt10 pb5 text-center">
      <div flex="~ gap-2 justify-center">
        <a href="https://github.com/lumirelle" target="_blank" class="group inline-block btn-blue">
          <div i-ph-github-logo-duotone group-hover="i-ph-github-logo-fill text-blue" />
          GitHub
        </a>
        <a
          href="https://releases.lumirelle.me"
          target="_blank"
          class="group inline-block btn-amber"
        >
          <div i-ph-rocket-launch-duotone group-hover="i-ph-rocket-launch-fill text-amber" />
          Recent Releases
        </a>
        <!-- <a
          href="https://yak.lumirelle.me"
          target="_blank"
          class="group btn-lime inline-block"
        >
          <div
            i-ph-cow-duotone
            group-hover="i-ph-cow-duotone-fill text-lime"
          />
          Yak Map
        </a> -->
      </div>
      <hr>
    </div>
    <div
      v-for="(key, cidx) in Object.keys(projects)"
      :key="key"
      slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <div
        :id="slug(key)"

        slide-enter pointer-events-none relative mt5 h18 select-none
        :style="{
          '--enter-stage': cidx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span

          absolute left--1rem top-0rem text-5em color-transparent font-bold leading-1em text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20
        >{{ key }}</span>
      </div>
      <div
        class="project-grid mx-auto max-w-500 w-max py-2"
        grid="~ cols-1 md:cols-2 gap-4 lg:cols-3"
      >
        <a
          v-for="(item, idx) in projects[key]"
          :key="idx"
          class="item relative flex items-center"
          :href="item.link"
          target="_blank"
          :title="item.name"
        >
          <div v-if="item.icon" class="pr-5 pt-2">
            <div class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
          </div>
          <div class="flex-auto">
            <div class="text-normal">{{ item.name }}</div>
            <div class="desc text-sm font-normal opacity-50" v-html="item.desc" />
          </div>
        </a>
      </div>
    </div>
    <div class="prose mx-auto mt10 pb5 text-center">
      <div mt-5 block>
        <a href="https://lumirelle.me/stars-rank" target="_blank" op50>All projects sort by Stars</a>
      </div>
      <hr>
      <SponsorButtons />
    </div>
  </div>
  <div>
    <div class="table-of-contents">
      <div class="table-of-contents-anchor">
        <div class="i-ri-menu-2-fill" />
      </div>
      <ul>
        <li v-for="key of Object.keys(projects)" :key="key">
          <a :href="`#${slug(key)}`">{{ key }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.project-grid a.item {
  background: transparent;
  font-size: 1.1rem;
  width: 350px;
  max-width: 100%;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 6px;
}

.project-grid a.item:hover {
  background: #88888811;
}
</style>
