/**
 * The image lightbox's state, and who is allowed to read it.
 *
 * The lightbox is *opened* from the page content — `App.vue` listens for a click
 * on a figure — but other parts of the Shell need to know whether it is showing:
 * the outline panel must not take the keyboard behind it. One state, two readers,
 * so it lives here rather than in either component.
 */
const shown = ref<HTMLImageElement>()

export function useImageLightbox() {
  return shown
}
