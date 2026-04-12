import type { Plugin } from 'vite'
import _Icons from 'unplugin-icons/vite'

export function Icon(): Plugin<any> | Plugin<any>[] {
  return _Icons({
    defaultClass: 'inline',
    defaultStyle: 'vertical-align: sub;',
  })
}
