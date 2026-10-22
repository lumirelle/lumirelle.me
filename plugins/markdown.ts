import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { basename, dirname, relative } from 'node:path'
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
const ISO_OFFSET_REGEX = /([+-]\d{2}:\d{2})$/

/** What history knows about one file, as author dates in the offsets they were written in. */
interface FileHistory {
  /** The commit that introduced the file; the publication-date check consumes it. */
  firstCommit: string
  /** The commit that last touched it. */
  lastCommit: string
}

interface History {
  /** Absolute path of the repository root, which is the base of every key below. */
  root: string
  /** Repo-relative path, as `git log --name-only` prints it, to what is known of it. */
  byFile: Map<string, FileHistory>
}

let history: History | undefined

/**
 * The calendar day an instant falls on, read in a given offset.
 *
 * The comparison below is a calendar-day comparison *in the offset the commit
 * carries*, not in the machine's zone and not in UTC: a file committed at
 * 09:00 +08:00 was committed on that day, whatever the build machine thinks.
 * YAML has already turned the authored `date` into a `Date`, which is an
 * instant with no offset of its own, so the day has to be reconstructed.
 */
function dayInOffset(value: string | Date, offset: string): string {
  const instant = value instanceof Date ? value.getTime() : new Date(value).getTime()
  const sign = offset.startsWith('-') ? -1 : 1
  const [hours = 0, minutes = 0] = offset.slice(1).split(':').map(Number)
  const shifted = new Date(instant + sign * (hours * 60 + minutes) * 60_000)
  return shifted.toISOString().slice(0, 10)
}

/**
 * Author dates of every file the repository has ever known, from one walk.
 *
 * Memoised because Post frontmatter asks once per page: the build must pay for
 * one pass over history, not one `git` per file, so adding Posts does not add
 * build time.
 *
 * `undefined` when git cannot be asked at all — an export, a container without
 * git, a clone whose history was stripped. The site then shows no edit dates,
 * exactly as it does for a Post that has never been committed, so a checkout
 * always builds.
 */
function fileHistory(): History | undefined {
  history ??= readHistory()
  return history
}

/** What history knows of one file, keyed the way `git log --name-only` prints it. */
function historyOf(file: string): FileHistory | undefined {
  const known = fileHistory()
  if (!known)
    return undefined
  return known.byFile.get(relative(known.root, file).split('\\').join('/'))
}

function readHistory(): History | undefined {
  try {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
    // A NUL marks a commit, so no path can be mistaken for one. Commits arrive
    // newest first, which makes a path's first sighting its last edit and its
    // last sighting the commit that introduced it.
    const walk = execFileSync(
      'git',
      ['log', '--no-renames', '--name-only', '--pretty=format:%x00%aI'],
      { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    )

    const byFile = new Map<string, FileHistory>()
    let commit: string | undefined
    for (const line of walk.split('\n')) {
      const path = line.trim()
      if (line.startsWith('\0')) {
        commit = line.slice(1).trim()
      }
      else if (path !== '' && commit) {
        const known = byFile.get(path)
        byFile.set(path, { firstCommit: commit, lastCommit: known?.lastCommit ?? commit })
      }
    }

    return { root, byFile }
  }
  catch (error) {
    const message = (error as Error).message.split('\n')[0]
    console.warn(`[history] no edit dates: git history is unavailable (${message})`)
    return undefined
  }
}

/**
 * The masthead's edit date: the author date of the commit that last touched
 * `file`, or nothing at all.
 *
 * Nothing at all when history has never seen the file, when git could not be
 * asked, or when that commit falls on the Post's own publication day — a Post
 * committed only on the day it was published shows one date, not two. There is
 * no fallback to the file's modification time: a checkout changes that, so it
 * would produce a date that means nothing.
 */
function derivedUpdate(file: string, date: unknown): string | undefined {
  if (typeof date !== 'string' && !(date instanceof Date))
    return undefined
  const entry = historyOf(file)
  if (!entry)
    return undefined
  const offset = ISO_OFFSET_REGEX.exec(entry.lastCommit)?.[1] ?? '+00:00'
  return dayInOffset(entry.lastCommit, offset) === dayInOffset(date, offset) ? undefined : entry.lastCommit
}

/**
 * Warn, never fail, when a Post is published after the commit that introduced it.
 *
 * That date is not stale, it is impossible: nothing exists before the commit that
 * added it, so the value is a typo. A warning surfaces it without making the site
 * depend on history — a tree without git, or a Post never committed, simply has
 * nothing to compare. The check reuses the walk the edit dates already took: one
 * pass over history per bundle, however many questions are asked of it.
 */
function warnOnImpossibleDate(file: string, date: unknown): void {
  if (typeof date !== 'string' && !(date instanceof Date))
    return
  const entry = historyOf(file)
  if (!entry)
    return
  const offset = ISO_OFFSET_REGEX.exec(entry.firstCommit)?.[1] ?? '+00:00'
  const published = dayInOffset(date, offset)
  const first = dayInOffset(entry.firstCommit, offset)
  if (published > first) {
    console.warn(
      `[history] ${basename(file, '.md')}: publication date ${published} is later than its first commit (${first})`,
    )
  }
}

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
      // The outline's container carries the list and nothing else: the control
      // that opens it below 1400 px is Shell chrome (`ShellOutline.vue`), not
      // markup injected into every Post.
      md.use(MarkdownItTOC, {
        includeLevel: [1, 2, 3, 4],
        slugify,
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
      if (id.includes('/pages/posts/')) {
        frontmatter.duration = readingTime(readFileSync(id, 'utf8'))
        // Derived, never authored: the field is set or removed, so a stale
        // hand-written `update:` cannot reach the page.
        const update = derivedUpdate(id, frontmatter.date)
        if (update)
          frontmatter.update = update
        else
          delete frontmatter.update
        warnOnImpossibleDate(id, frontmatter.date)
      }
      const head = defaults(frontmatter, options)
      return { head, frontmatter }
    },
  })
}
