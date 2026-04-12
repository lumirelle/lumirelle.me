import type { Plugin } from 'vite'
import _Vue from '@vitejs/plugin-vue'

const VUE_INCLUDE = [/\.vue$/, /\.md$/]

export function Vue(): Plugin<any> | Plugin<any>[] {
  return _Vue({
    include: VUE_INCLUDE,
  })
}
