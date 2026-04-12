import type { Plugin } from 'vite'
import _AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'vue-router/unplugin'

export function AutoImports(): Plugin<any> | Plugin<any>[] {
  return _AutoImport({
    imports: ['vue', VueRouterAutoImports, '@vueuse/core'],
  })
}
