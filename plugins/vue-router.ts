import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import matter from 'gray-matter'
import _VueRouter from 'vue-router/vite'

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
        const { data } = matter(readFileSync(path, 'utf8'))
        route.addToMeta({
          frontmatter: data,
        })
      }
    },
  })
}
