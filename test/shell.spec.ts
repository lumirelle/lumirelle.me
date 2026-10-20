import type { ConsoleMessage, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { routes } from './support/artifacts'

/**
 * Baseline seam for the site redesign.
 *
 * Only externally observable behaviour is asserted here: what the prerendered
 * HTML contains, what a visitor can read, and what the browser logs. Later
 * tickets add their own assertions to this file rather than inventing a second
 * seam; that is the point of it existing first.
 */

/** Whitespace-free form of a text run, used on both sides of the content check. */
function squash(text: string): string {
  return text.replaceAll(/\s+/g, '')
}

/**
 * The published palette, as it must *render*.
 *
 * Only these greys are contractual. The custom properties that carry them are
 * an implementation detail a later ticket may rename, so nothing here reads a
 * `--token` by name; it reads what the browser computed for an element a
 * visitor can actually see.
 */
const PALETTE = {
  canvas: { light: 'rgb(255, 255, 255)', dark: 'rgb(0, 0, 0)' },
  surface: { light: 'rgb(246, 246, 246)', dark: 'rgb(13, 13, 13)' },
  stroke: { light: 'rgb(226, 226, 226)', dark: 'rgb(38, 38, 38)' },
  ink: { light: 'rgb(58, 58, 58)', dark: 'rgb(196, 196, 196)' },
  inkStrong: { light: 'rgb(17, 17, 17)', dark: 'rgb(242, 242, 242)' },
  inkFaint: { light: 'rgb(118, 118, 118)', dark: 'rgb(110, 110, 110)' },
} as const

type Scheme = keyof (typeof PALETTE)['canvas']

/** The navigation's text links, in the order the design reference fixes. */
const NAV_LABELS = ['posts', 'projects', 'use', 'photos', 'demos']

interface RenderedChrome {
  canvas: string
  surface: string
  scrollbarTrack: string
  stroke: string
  ink: string
  inkStrong: string
  inkFaint: string
}

/**
 * Every token, read back from an element that visibly uses it.
 *
 * Deliberately spread over four surfaces, because a token layer only counts if
 * it reaches all of them: the document canvas, the scrollbar (the only surface
 * the chrome paints before the code window exists), the footer hairline, and
 * the ink ramp of the header row — where the active route is the strong level
 * and its siblings are the faint one.
 */
async function readChrome(page: Page): Promise<RenderedChrome> {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const nav = document.querySelector('header nav')
    const links = [...(nav?.querySelectorAll('a') ?? [])]
    const current = links.find(link => link.getAttribute('aria-current') === 'page')
    const idle = links.find(link => link !== current && (link.textContent ?? '').trim() !== '')
    const footer = document.querySelector('footer')
    if (!current || !idle || !footer) {
      throw new Error('the Shell is missing one of the elements the palette is read from')
    }

    const [thumb = '', track = ''] = root.scrollbarColor.match(/(?:rgba?|color)\([^)]*\)/g) ?? []
    return {
      canvas: root.backgroundColor,
      surface: thumb,
      scrollbarTrack: track,
      stroke: getComputedStyle(footer).borderTopColor,
      ink: getComputedStyle(document.body).color,
      inkStrong: getComputedStyle(current).color,
      inkFaint: getComputedStyle(idle).color,
    }
  })
}

function expectedChrome(scheme: Scheme): RenderedChrome {
  return {
    canvas: PALETTE.canvas[scheme],
    surface: PALETTE.surface[scheme],
    scrollbarTrack: PALETTE.canvas[scheme],
    stroke: PALETTE.stroke[scheme],
    ink: PALETTE.ink[scheme],
    inkStrong: PALETTE.inkStrong[scheme],
    inkFaint: PALETTE.inkFaint[scheme],
  }
}

/**
 * `getComputedStyle` serialises the same colour in more than one form: a plain
 * `rgb(r, g, b)` for most properties, but `color(srgb r g b)` where a colour
 * travelled through a `color()` context. Both describe the identical value, so
 * comparison happens on normalised channels rather than on the serialisation.
 */
function toChannels(colour: string): [number, number, number] {
  const srgb = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(colour)
  if (srgb) {
    const scale = (value: string): number => Math.round(Number(value) * 255)
    return [scale(srgb[1]!), scale(srgb[2]!), scale(srgb[3]!)]
  }

  const [r = 0, g = 0, b = 0] = (colour.match(/[\d.]+/g) ?? []).map(Number)
  return [Math.round(r), Math.round(g), Math.round(b)]
}

function toRgb(colour: string): string {
  return `rgb(${toChannels(colour).join(', ')})`
}

/** Normalise every colour in a reading taken from the page. */
function toRgbChrome(chrome: RenderedChrome): RenderedChrome {
  return Object.fromEntries(
    Object.entries(chrome).map(([name, colour]) => [name, toRgb(colour)]),
  ) as unknown as RenderedChrome
}

/** `rgb(r, g, b)` is monochrome only when all three channels agree. */
function isGrey(colour: string): boolean {
  const [r, g, b] = toChannels(colour)
  return r === g && g === b
}

test.beforeEach(async ({ page, baseURL: base }) => {
  // Keep the suite hermetic: third-party embeds (widgets, remote avatars) are
  // answered locally so a network hiccup cannot fail a page-load assertion, and
  // so only this origin can produce a real 404.
  await page.route('**/*', async (route) => {
    if (base && route.request().url().startsWith(base)) {
      await route.fallback()
      return
    }
    await route.fulfill({ status: 200, body: '' })
  })
})

test('the build prerenders every route with its own content', () => {
  expect(routes.map(route => route.path)).toEqual(
    expect.arrayContaining(['/', '/posts', '/projects', '/use', '/photos', '/demos']),
  )

  // A route whose prerendered content landmark is empty is a route a crawler
  // sees as blank, regardless of what the client renders afterwards.
  const withoutContent = routes
    .filter(route => route.marker === '')
    .map(route => route.file)
  expect(withoutContent).toEqual([])
})

test('the header row is five mono text links, two named icons and the theme toggle', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  const header = page.getByRole('banner')
  const nav = header.getByRole('navigation')

  // The text links are the row's voice: lowercase, in this order, and no other
  // label smuggles itself in beside them.
  const textLabels = (await nav.getByRole('link').allInnerTexts())
    .map(label => label.trim())
    .filter(label => label !== '')
  expect(textLabels).toEqual(NAV_LABELS)
  for (const label of NAV_LABELS) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
  }

  // Feed and source are icon-only, so their accessible name is all a screen
  // reader gets; they sit between the text links and the theme toggle.
  await expect(nav.getByRole('link', { name: /rss|feed/i })).toBeVisible()
  await expect(nav.getByRole('link', { name: /github|source/i })).toBeVisible()

  // The theme toggle closes the row.
  const lastControl = nav.locator('a, button').last()
  await expect(lastControl).toHaveAttribute('role', 'button')
  await expect(lastControl).toHaveAccessibleName(/theme|toggle|scheme/i)

  // `one line, no rule beneath it`: the hairline belongs to the Frame (#5).
  expect(await header.evaluate(el => getComputedStyle(el).borderBottomWidth)).toBe('0px')
})

for (const scheme of ['light', 'dark'] as const) {
  test(`the chrome resolves the published palette in the ${scheme} scheme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/posts', { waitUntil: 'load' })

    const chrome = await readChrome(page)
    expect(toRgbChrome(chrome)).toEqual(expectedChrome(scheme))
    // Monochrome structure: no hue anywhere in the chrome (ADR-0002).
    expect(Object.entries(chrome).filter(([, colour]) => !isGrey(colour))).toEqual([])
  })
}

test('the dark palette follows the dark class, not the media query alone', async ({ page }) => {
  // Dark mode is resolved once per scheme through the class on <html>, so a
  // visitor whose system is light still gets the dark palette when the class
  // says so — and the class is what the site's own toggle writes.
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/posts', { waitUntil: 'load' })
  await page.evaluate(() => document.documentElement.classList.add('dark'))

  // The class flip is what a visitor's theme toggle does, and the Shell
  // transitions colour over 120 ms, so poll until the paint settles rather than
  // reading a mid-transition `oklab(…)` value.
  await expect
    .poll(async () => toRgbChrome(await readChrome(page)))
    .toEqual(expectedChrome('dark'))
})

test('bookmarks are reachable from the use page', async ({ page }) => {
  await page.goto('/use', { waitUntil: 'load' })

  const bookmarks = page.getByRole('link', { name: /bookmarks page/i })
  await expect(bookmarks).toBeVisible()
  await bookmarks.click()
  await expect(page).toHaveURL(/\/bookmarks$/)
})

test('the sponsors list is reachable from the footer', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })

  const sponsors = page.locator('footer').getByRole('link', { name: /sponsors/i })
  await expect(sponsors).toBeVisible()
  await expect(sponsors).toHaveAttribute('href', '/sponsors-list')
})

for (const route of routes) {
  test(`${route.path} renders its own content and the Shell`, async ({ page }) => {
    const problems: string[] = []
    page.on('console', (message: ConsoleMessage) => {
      if (message.type() === 'error') {
        problems.push(message.text())
      }
    })
    page.on('pageerror', error => problems.push(error.message))

    await page.goto(route.path, { waitUntil: 'load' })

    const content = page.getByRole('main')
    await expect(content).toBeVisible()

    // The prerendered HTML is minified, so block boundaries carry no whitespace
    // there while the hydrated DOM inserts some. Compare with whitespace
    // removed entirely, which is the only stable common denominator.
    expect(squash((await content.textContent()) ?? '')).toContain(squash(route.marker))

    // The Shell is chrome: it must be present on every route, with a way back
    // into the writing. Asserted by role and accessible name, never by class.
    const shell = page.getByRole('banner')
    await expect(shell).toBeVisible()
    await expect(shell.getByRole('link', { name: /posts/i }).first()).toBeVisible()

    expect(problems).toEqual([])
  })
}
