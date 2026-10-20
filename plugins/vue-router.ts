import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import matter from 'gray-matter'
import _VueRouter from 'vue-router/vite'
import { readingTime } from '../scripts/reading-time.ts'

export function VueRouter(): Plugin<any> | Plugin<any>[] {
  return _VueRouter({
    extensions: ['.vue', '.md'],
    routesFolder: 'pages',
    // logs: true,
    extendRoute(route) {
      const path = route.components.get('default')
      if (!path)
        return
      if (!path.includes('projects.md') && path.endsWith('.md')) {
        const raw = readFileSync(path, 'utf8')
        const { data } = matter(raw)
        if (path.includes('/pages/posts/'))
          data.duration = readingTime(raw)
        route.addToMeta({
          frontmatter: data,
        })
      }
    },
  })
}
