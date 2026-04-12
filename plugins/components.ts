import type { Plugin } from 'vite'
import IconsResolver from 'unplugin-icons/resolver'
import _Components from 'unplugin-vue-components/vite'

const COMPONENTS_INCLUDE = [/\.vue$/, /\.vue\?vue/, /\.md$/]

export function Components(): Plugin<any> | Plugin<any>[] {
  return _Components({
    extensions: ['vue', 'md'],
    dts: true,
    include: COMPONENTS_INCLUDE,
    resolvers: [
      IconsResolver({
        componentPrefix: '',
      }),
    ],
  })
}
