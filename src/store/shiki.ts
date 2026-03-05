import type { HighlighterCore } from 'shiki/core'
import { defineStore } from 'pinia'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { isDark } from '../logics'

export const useShikiStore = defineStore('pinia', async () => {
  const highlighter = shallowRef<HighlighterCore>()
  const theme = computed(() => (isDark.value ? 'vitesse-dark' : 'vitesse-light'))

  if (typeof globalThis !== 'undefined') {
    const h = await createHighlighterCore({
      themes: [import('shiki/themes/vitesse-dark.mjs'), import('shiki/themes/vitesse-light.mjs')],
      langs: [import('shiki/langs/vue.mjs')],
      engine: createJavaScriptRegexEngine(),
    })
    highlighter.value = h
  }

  return {
    highlighter,
    theme,
  }
})
