import dayjs from 'dayjs'

export const isDark = useDark()
export const chineseOnly = useLocalStorage('lumirelle-chinese-only', false)
export const galleryView = useLocalStorage<'cover' | 'contain'>('lumirelle-gallery-view', 'cover')

/**
 * Credit to [@hooray](https://github.com/hooray)
 * @param event The mouse event
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
export async function toggleDark(event: MouseEvent): Promise<void> {
  const isAppearanceTransition
    = 'startViewTransition' in document && !globalThis.matchMedia('(prefers-color-scheme)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  await transition.ready
  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
  document.documentElement.animate(
    {
      clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
    },
    {
      duration: 400,
      easing: 'ease-out',
      pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
    },
  )
}

export function formatDate(d: string | Date, onlyDate = true): string {
  const date = dayjs(d)
  if (onlyDate || date.year() === dayjs().year()) {
    return date.format('MMM D')
  }
  return date.format('MMM D, YYYY')
}
