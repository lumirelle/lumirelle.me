<script setup lang="ts">
import { transitionKind } from './logics/route-transition.ts'

const route = useRoute()

/** Section changes type the command line; everything else cross-fades. */
const kind = transitionKind

const imageModel = ref<HTMLImageElement>()
const imageAlt = ref<string>()

function setImageModel(img: HTMLImageElement): void {
  imageModel.value = img
  imageAlt.value = img.alt
  const figure = img.closest('figure')
  if (figure) {
    const caption = figure.querySelector('figcaption')
    if (caption?.textContent) {
      imageAlt.value ||= caption.textContent
    }
  }
}

useEventListener('click', async (e) => {
  const path = [...e.composedPath()]
  const first = path[0] as HTMLImageElement
  if (!(first instanceof HTMLElement)) {
    return
  }
  if (first.tagName !== 'IMG') {
    return
  }
  if (first.classList.contains('no-preview')) {
    return
  }
  if (path.some(el => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName))) {
    return
  }
  if (
    !path.some(
      el =>
        el instanceof HTMLElement
        && (el.classList.contains('prose') || el.classList.contains('photos')),
    )
  ) {
    return
  }

  // Do not open image when they are moving. Mainly for mobile to avoid conflict with hovering behavior.
  const pos = first.getBoundingClientRect()
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
  const newPos = first.getBoundingClientRect()
  if (pos.left !== newPos.left || pos.top !== newPos.top) {
    return
  }

  setImageModel(first)
})

onKeyStroke('ArrowRight', (e) => {
  if (!imageModel.value || imageModel.value.dataset.photoIndex == null) {
    return
  }

  const index = Number.parseInt(imageModel.value.dataset.photoIndex)
  const nextIndex = index + 1
  const nextImg = document.querySelector(
    `img[data-photo-index="${nextIndex}"]`,
  ) as HTMLImageElement | null
  if (nextImg) {
    setImageModel(nextImg)
    e.preventDefault()
  }
})

onKeyStroke('ArrowLeft', (e) => {
  if (!imageModel.value || imageModel.value.dataset.photoIndex == null) {
    return
  }

  const index = Number.parseInt(imageModel.value.dataset.photoIndex)
  const prevIndex = index - 1
  const prevImg = document.querySelector(
    `img[data-photo-index="${prevIndex}"]`,
  ) as HTMLImageElement | null
  if (prevImg) {
    setImageModel(prevImg)
    e.preventDefault()
  }
})

onKeyStroke('Escape', (e) => {
  if (imageModel.value) {
    imageModel.value = undefined
    e.preventDefault()
  }
})
</script>

<template>
  <!--
    The Frame.

    It belongs to the Shell, not to the page: the column and its rhythm are
    rendered once, outside `RouterView`, so a route change replaces only what is
    inside `<main>` and never shifts the measure a reader is anchored to.

    There are no vertical Rails. The column is held by its own 820 px measure and
    by hairline rules, and the left margin column carries the structure instead.
    A hairline here is only ever a row divider — never a border around content.
  -->
  <NavBar />
  <!--
    The column. It carries the measure and the gutter, and it holds both the
    content and the footer — so the closing rule is the column's width while the
    space above it belongs to `main`'s own bottom padding.
  -->
  <div class="mx-auto px-[var(--shell-gutter)] max-w-[var(--shell-measure)] of-x-hidden">
    <main class="pb-28 pt-12">
      <!--
        Keyed on the route so the incoming content replays `route-in` (200 ms,
        opacity only — see main.css). Scroll stays the router's business.
      -->
      <div
        :key="route.fullPath"
        :class="kind === 'type' ? '' : ['route-in', `route-${kind === 'route-up' ? 'up' : 'down'}`]"
      >
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
  <Transition name="fade">
    <div
      v-if="imageModel"
      bottom-0 left-0 right-0 top-0 fixed z-500 backdrop-blur-7
      role="button"
      tabindex="0"
      @click="imageModel = undefined"
      @keydown="imageModel = undefined"
    >
      <div bg-black:50 bottom-0 left-0 right-0 top-0 absolute z--1 />
      <img
        :src="imageModel.src"
        :alt="imageModel.alt"
        :class="imageModel.className"

        h-full max-h-screen max-w-screen w-full object-contain
      >
      <div
        v-if="imageAlt"

        text-white px2 py1 bg-black:50 flex items-center bottom-5 right-5 justify-center absolute
      >
        {{ imageAlt }}
      </div>
    </div>
  </Transition>
</template>
