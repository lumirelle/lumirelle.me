/**
 * In-page links, and the one rule they all follow.
 *
 * A `#section` link is a move within the page you are already on, but the router
 * cannot know that: the route frame in `App.vue` is keyed on `route.fullPath`,
 * hash included, so a hash change arrives as a new location and re-keys the frame
 * — a whole page transition for what is only a scroll. So these links never reach
 * the router: the URL is updated with `replaceState` and the move is a scroll.
 *
 * The rule has to be installed wherever an in-page link can be clicked, and there
 * are two such places: the Post body, and the outline that `ShellOutline.vue`
 * adopts out of the Post — which is outside the body's own listener, and is exactly
 * how the rail came to behave differently from the headings it points at.
 */

/** How far below the viewport top a targeted heading comes to rest, clearing the header. */
const OFFSET = 40

/** Scroll to the current `location.hash`. Returns whether it found the target. */
export function scrollToHash(): boolean {
  if (!location.hash)
    return false

  const target = document.querySelector(decodeURIComponent(location.hash))
  if (!target)
    return false

  window.scrollTo({
    top: window.scrollY + target.getBoundingClientRect().top - OFFSET,
    behavior: 'smooth',
  })
  return true
}

/**
 * Handle every link click inside `target`.
 *
 * Only a plain left click on a same-origin link is claimed: the modifiers, a
 * `_blank` target, an external `rel` and a download all mean the visitor asked
 * the browser for something this rule must not take over.
 */
export function useInPageLinks(target: MaybeRefOrGetter<HTMLElement | null | undefined>): void {
  const router = useRouter()

  useEventListener(target, 'click', (event: MouseEvent) => {
    const link = (event.target as HTMLElement | null)?.closest('a')

    if (
      !link
      || event.defaultPrevented
      || event.button !== 0
      || link.target === '_blank'
      || link.rel === 'external'
      || link.download
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return
    }

    const url = new URL(link.href)
    if (url.origin !== location.origin)
      return

    const { pathname, hash } = url

    event.preventDefault()

    if (hash && (!pathname || pathname === location.pathname)) {
      globalThis.history.replaceState({}, '', hash)
      scrollToHash()
      return
    }

    void router.push({ path: pathname, hash })
  }, { passive: false })
}
