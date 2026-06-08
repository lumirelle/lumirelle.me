import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Exclude from 'vite-plugin-optimize-exclude'
import { AutoImports } from './plugins/auto-imports'
import { Await } from './plugins/await'
import { Components } from './plugins/components'
import { Icon } from './plugins/icon'
import { Markdown } from './plugins/markdown'
import { Svg } from './plugins/svg'
import { Vue } from './plugins/vue'
import { VueRouter } from './plugins/vue-router'

const promises: Promise<any>[] = []

const cert = resolve(import.meta.dirname, 'certs/localhost.pem')
const key = resolve(import.meta.dirname, 'certs/localhost-key.pem')

export default defineConfig({
  resolve: {
    alias: [{ find: '~/', replacement: `${resolve(import.meta.dirname, 'src')}/` }],
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', 'dayjs', 'dayjs/plugin/localizedFormat'],
  },
  plugins: [
    UnoCSS(),
    VueRouter(),
    Vue(),
    Markdown(promises),
    AutoImports(),
    Components(),
    Inspect(),
    Icon(),
    Svg(),
    Exclude(),
    Await(promises),
  ],

  server: existsSync(cert) && existsSync(key)
    ? { https: { cert, key } }
    : undefined,

  build: {
    rolldownOptions: {
      onwarn(warning, next) {
        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT') {
          next(warning)
        }
      },
    },
  },

  ssgOptions: {
    formatting: 'minify',
  },
})
