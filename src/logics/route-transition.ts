import type { Router } from 'vue-router'

/**
 * Which transition a navigation gets.
 *
 * Most navigations answer with the page-level `route-in` cross-fade. A move
 * between the sections of one list* does not: `/posts`, `/blog`, `/notes` and
 * `/manuals` are the same page with a different filter, so fading the whole page
 * would announce a change of place that has not happened. Those navigations get
 * the command line retyping itself instead, which is where the difference
 * actually lives.
 */

const SECTIONS = ['/posts', '/blog', '/notes', '/manuals']

/**
 * `route-up` / `route-down` are the page-level cross-fade with a vertical move,
 * borrowed from a terminal: going deeper prints downwards, going back up the
 * tree prints upwards.
 */
export type TransitionKind = 'route-up' | 'route-down' | 'type'

export function isSection(path: string): boolean {
  return SECTIONS.includes(path)
}

/** Read by `App.vue` to decide the wrapper's class, and by the list to type. */
export const transitionKind = ref<TransitionKind>('route-down')

/** Depth of a path, so a parent reads as shallower than its children. */
function depth(path: string): number {
  return path.split('/').filter(Boolean).length
}

export function installRouteTransition(router: Router): void {
  // `beforeEach` rather than `afterEach`: both paths are known before the route
  // swaps, so the class is right on the very first render of the new page.
  router.beforeEach((to, from) => {
    if (isSection(to.path) && isSection(from.path)) {
      transitionKind.value = 'type'
      return
    }

    // Deeper, or sideways to a sibling at the same depth, arrives from below —
    // the direction a terminal prints. Going back up the tree arrives from above.
    transitionKind.value = depth(to.path) < depth(from.path) ? 'route-up' : 'route-down'
  })
}
