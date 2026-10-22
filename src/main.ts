import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import FloatingVue from 'floating-vue'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { setupRouterScroller } from 'vue-router-better-scroller'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { installCodeCopy } from './logics/code-copy.ts'
import { installRouteTransition } from './logics/route-transition.ts'
import { runSplash } from './logics/splash.ts'
import '@unocss/reset/tailwind.css'

import 'floating-vue/dist/style.css'

import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'
import '@shikijs/twoslash/style-rich.css'
import '@shikijs/magic-move/style.css'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/splash.css'
import './styles/main.css'
import './styles/controls.css'
import './styles/prose.css'
import './styles/markdown.css'
import 'uno.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ router, app }) => {
    dayjs.extend(LocalizedFormat)

    app.use(FloatingVue)
    app.use(createPinia())

    if (!import.meta.env.SSR) {
      const html = document.querySelector('html')!

      // The entrance cascade is a first-load Effect. Dev mode disables it so
      // authoring is not fought by it; everywhere else it plays once, and the
      // first route change retires it for good so it can never run underneath
      // the route transition.
      if (import.meta.env.DEV)
        html.classList.add('no-sliding')

      let navigations = 0
      router.afterEach(() => {
        navigations += 1
        if (navigations > 1)
          html.classList.add('no-sliding')
      })

      // The Splash's end state. With JavaScript off the head script never adds
      // `has-splash`, so this is a no-op and nothing on the page depends on it.
      runSplash()

      installCodeCopy()

      // Section-to-section navigation is not a change of place, so it types the
      // command line instead of cross-fading the page.
      installRouteTransition(router)

      // The router owns navigation and scrolling; the incoming content animates
      // itself with one CSS keyframe. Nothing here touches the scroll position.
      setupRouterScroller(router, {
        selectors: { html: () => true },
        behavior: 'auto',
      })
    }
  },
)
