import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import MarkdownItShiki from '@shikijs/markdown-exit'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItFootNote from 'markdown-it-footnote'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'
import MarkdownItMagicLink from 'markdown-it-magic-link'
// @ts-expect-error no types
import MarkdownItTOC from 'markdown-it-table-of-contents'
import sharp from 'sharp'
import _Markdown from 'unplugin-vue-markdown/vite'
import { readingTime } from '../scripts/reading-time.ts'
import { slugify } from '../scripts/slugify.ts'
import { PreviewPlugin } from './markdown-html-sandbox-preview.ts'
import { InlineCodeBlockPlugin } from './markdown-inline-code.ts'
import { vercelDark, vercelLight } from './shiki-vercel-theme.ts'

const ogSVg = readFileSync('./scripts/og-template.svg', 'utf8')

/** The smallest hast shapes this plugin touches, so it needs no extra types. */
interface HastNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

function element(tagName: string, className: string, children: HastNode[] = []): HastNode {
  return { type: 'element', tagName, properties: { class: className }, children }
}

function text(value: string): HastNode {
  return { type: 'text', value }
}

/** The language Shiki recorded on the `<code>` inside the block. */
function languageOf(pre: HastNode): string {
  const code = pre.children?.find(child => child.tagName === 'code')
  const className = code?.properties?.class
  const classes = Array.isArray(className)
    ? className.filter(part => typeof part === 'string').join(' ')
    : typeof className === 'string' ? className : ''
  const match = classes.match(/language-([\w-]+)/)
  return match?.[1] ?? 'text'
}

/**
 * Dress every fenced block as a terminal window.
 *
 * ```
 * ● ● ●   ts                                    copy
 * ```
 *
 * Done here, in the markdown pipeline, because this is where the language is
 * already known and because the chrome belongs in the prerendered HTML — the
 * alternative is client-side DOM surgery on markup that has already shipped.
 *
 * The dots keep their traffic-light hues: ADR-0002 bans colour on chrome, and
 * this is the one exception the design reference states outright.
 */
function codeWindow(): ShikiTransformer {
  return {
    name: 'code-window',
    root(node) {
      // Inline blocks (`:code[lang]{…}` in a table cell) opt out: the bar costs
      // more vertical space than a narrow cell can spare.
      if (this.options.meta?.__raw?.includes('no-window')) {
        return
      }

      const walk = (parent: HastNode): void => {
        if (!parent.children) {
          return
        }

        parent.children = parent.children.map((child) => {
          if (child.tagName === 'pre') {
            const language = languageOf(child)
            const bar = element('div', 'code-window-bar', [
              element('span', 'code-dot code-dot-red'),
              element('span', 'code-dot code-dot-yellow'),
              element('span', 'code-dot code-dot-green'),
              element('span', 'code-window-lang', [text(language === 'text' ? '' : language)]),
              {
                ...element('button', 'code-copy', [text('copy')]),
                properties: { 'class': 'code-copy', 'type': 'button', 'aria-label': 'Copy code' },
              },
            ])

            return element('div', 'code-window', [bar, child])
          }

          walk(child)
          return child
        })
      }

      walk(node as unknown as HastNode)
    },
  }
}

const EXTERNAL_LINK_REGEX = /^https?:\/\//
const FRONTMATTER_TITLE_REGEX = /\s-\s.*$/
const OPEN_COLLECTIVE_VITE_REGEX = /opencollective\.com\/vite/
const OPEN_COLLECTIVE_ELK_REGEX = /opencollective\.com\/elk/

export function Markdown(promises: Promise<any>[]): Plugin<any> | Plugin<any>[] {
  return _Markdown({
    wrapperComponent: id => (id.includes('/demo/') ? 'WrapperDemo' : 'WrapperPost'),
    wrapperClasses: (_, code) =>
      code.includes('@layout-full-width') ? '' : 'prose m-auto slide-enter-content',
    headEnabled: true,
    exportFrontmatter: false,
    exposeFrontmatter: false,
    exposeExcerpt: false,
    markdownOptions: {
      quotes: '""\'\'',
    },
    async markdownSetup(md) {
      md.use(
        MarkdownItShiki({
          themes: {
            // Built from the palette in lumirelle/vercel.nvim — see plugins/shiki-vercel-theme.ts
            dark: vercelDark as any,
            light: vercelLight as any,
          },
          defaultColor: false,
          cssVariablePrefix: '--s-',
          transformers: [
            transformerTwoslash({
              explicitTrigger: true,
              renderer: rendererRich(),
            }),
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerNotationFocus(),
            codeWindow() as ShikiTransformer,
          ],
        }),
      )
      md.use(InlineCodeBlockPlugin)
      md.use(MarkdownItAnchor, {
        slugify,
        permalink: MarkdownItAnchor.permalink.linkInsideHeader({
          symbol: '#',
          renderAttrs: () => ({ 'aria-hidden': 'true' }),
        }),
      })
      md.use(MarkdownItLinkAttributes, {
        matcher: (link: string) => EXTERNAL_LINK_REGEX.test(link),
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
      })
      md.use(MarkdownItTOC, {
        includeLevel: [1, 2, 3, 4],
        slugify,
        containerHeaderHtml:
            '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
      })
      md.use(MarkdownItMagicLink, {
        linksMap: {
          'NuxtLabs': { link: 'https://nuxtlabs.com', imageUrl: 'https://nuxtlabs.com/nuxt.png' },
          'Vitest': 'https://github.com/vitest-dev/vitest',
          'Slidev': 'https://github.com/slidevjs/slidev',
          'VueUse': 'https://github.com/vueuse/vueuse',
          'UnoCSS': 'https://github.com/unocss/unocss',
          'Elk': 'https://github.com/elk-zone/elk',
          'Type Challenges': 'https://github.com/type-challenges/type-challenges',
          'Vue': 'https://github.com/vuejs/core',
          'Nuxt': 'https://github.com/nuxt/nuxt',
          'Vite': 'https://github.com/vitejs/vite',
          'Shiki': 'https://github.com/shikijs/shiki',
          'Twoslash': 'https://github.com/twoslashes/twoslash',
          'ESLint Stylistic': 'https://github.com/eslint-stylistic/eslint-stylistic',
          'Unplugin': 'https://github.com/unplugin',
          'Nuxt DevTools': 'https://github.com/nuxt/devtools',
          'Vite PWA': 'https://github.com/vite-pwa',
          'i18n Ally': 'https://github.com/lokalise/i18n-ally',
          'ESLint': 'https://github.com/eslint/eslint',
          'Astro': 'https://github.com/withastro/astro',
          'TwoSlash': 'https://github.com/twoslashes/twoslash',
          'Anthony Fu Collective': { link: 'https://opencollective.com/antfu', imageUrl: 'https://github.com/antfu-collective.png' },
          'Netlify': { link: 'https://netlify.com', imageUrl: 'https://github.com/netlify.png' },
          'Stackblitz': { link: 'https://stackblitz.com', imageUrl: 'https://github.com/stackblitz.png' },
          'Vercel': { link: 'https://vercel.com', imageUrl: 'https://github.com/vercel.png' },
        },
        imageOverrides: [
          ['https://github.com/vuejs/core', 'https://vuejs.org/logo.svg'],
          ['https://github.com/nuxt/nuxt', 'https://nuxt.com/assets/design-kit/icon-green.svg'],
          ['https://github.com/vitejs/vite', 'https://vitejs.dev/logo.svg'],
          ['https://github.com/sponsors', 'https://github.com/github.png'],
          ['https://github.com/sponsors/antfu', 'https://github.com/github.png'],
          ['https://nuxtlabs.com', 'https://github.com/nuxtlabs.png'],
          [OPEN_COLLECTIVE_VITE_REGEX, 'https://github.com/vitejs.png'],
          [OPEN_COLLECTIVE_ELK_REGEX, 'https://github.com/elk-zone.png'],
        ],
      })
      md.use(MarkdownItGitHubAlerts)
      md.use(MarkdownItFootNote)
      md.use(PreviewPlugin)
    },
    frontmatterPreprocess(frontmatter, options, id, defaults) {
      ((): void => {
        if (!id.endsWith('.md'))
          return
        const route = basename(id, '.md')
        if (route === 'index' || frontmatter.image || !frontmatter.title)
          return
        const path = `og/${route}.png`
        async function generateOg(title: string, output: string): Promise<void> {
          if (existsSync(output))
            return
          mkdirSync(dirname(output), { recursive: true })
          // breakline every 30 chars
          const lines = title
            .trim()
            .split(/(.{0,30})(?:\s|$)/g)
            .filter(Boolean)
          const data: Record<string, string> = {
            line1: lines[0] ?? '',
            line2: lines[1] ?? '',
            line3: lines[2] ?? '',
          }
          const svg = ogSVg.replaceAll(/\{\{([^}]+)\}\}/g, (_, name) => data[name] || '')
          console.info(
            `Generating ${output}. Notice you should install "Merriweather 18pt" font in your system.`,
          )
          try {
            await sharp(Buffer.from(svg))
              .resize(1200 * 1.1, 630 * 1.1)
              .png()
              .toFile(output)
          }
          catch (error) {
            console.error('Failed to generate og image', error)
          }
        }
        promises.push(
          existsSync(`${id.slice(0, -3)}.png`)
            ? cp(`${id.slice(0, -3)}.png`, `public/${path}`)
            : generateOg(frontmatter.title.replace(FRONTMATTER_TITLE_REGEX, '').trim(), `public/${path}`),
        )
        frontmatter.image = `https://lumirelle.me/${path}`
      })()
      if (id.includes('/pages/posts/'))
        frontmatter.duration = readingTime(readFileSync(id, 'utf8'))
      const head = defaults(frontmatter, options)
      return { head, frontmatter }
    },
  })
}
