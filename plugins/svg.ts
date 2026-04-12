import type { Plugin } from 'vite'
import _Svg from 'vite-svg-loader'

export function Svg(): Plugin<any> | Plugin<any>[] {
  return _Svg({
    svgo: false,
    defaultImport: 'url',
  })
}
