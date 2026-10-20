/**
 * The Splash: one orchestrated opening moment, once per session.
 *
 * The markup lives in `index.html`, so it is in the prerendered HTML and paints
 * before hydration. Whether it runs at all is decided by the inline script in the
 * head — the same one that resolves dark mode — so a returning visitor never sees
 * a flash of it, and a visitor who asked for reduced motion never gets it.
 *
 * That means this module never decides *whether* to show the Splash; it only
 * decides *when to end* it. Every path ends it: the stages finishing, any click,
 * any keypress. With JavaScript off, the head script never adds the class and the
 * Splash stays hidden, so nothing here is load-bearing.
 */

const SESSION_KEY = 'lumirelle-splash-seen'
const ROOT_CLASS = 'has-splash'
const LIFT_CLASS = 'splash-lift'

/** When the stages have played: 300 ms fade + 300 ms type + 300 ms hold + 300 ms lift. */
const STAGE_END = 900
/** How long the overlay takes to lift once the end state is reached. */
const LIFT_TIME = 300

export function runSplash(): void {
  const root = document.documentElement
  if (!root.classList.contains(ROOT_CLASS)) {
    return
  }

  const splash = document.getElementById('splash')
  const timers: number[] = []
  let finished = false

  function cleanup(): void {
    for (const timer of timers) {
      clearTimeout(timer)
    }
    window.removeEventListener('click', finish, true)
    window.removeEventListener('keydown', finish, true)
  }

  /**
   * Jump to the end state. Idempotent, because the click, the keypress, the
   * natural end and the failsafe can all arrive within a few milliseconds of
   * each other.
   */
  function finish(): void {
    if (finished) {
      return
    }
    finished = true
    cleanup()

    // Remember for the rest of the session before the overlay leaves, so a
    // reload during the lift cannot replay it.
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    }
    catch {
      // Private mode and blocked storage: the Splash simply may run again.
    }

    root.classList.remove(ROOT_CLASS)
    if (splash) {
      splash.classList.add(LIFT_CLASS)
      timers.push(
        window.setTimeout(() => {
          splash.remove()
        }, LIFT_TIME),
      )
    }
  }

  // Pointer events are blocked by the overlay itself; scrolling is not, because
  // the page is never given `overflow: hidden`.
  window.addEventListener('click', finish, true)
  window.addEventListener('keydown', finish, true)

  timers.push(window.setTimeout(finish, STAGE_END))
}
