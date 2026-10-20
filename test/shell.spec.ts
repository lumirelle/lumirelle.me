import type { ConsoleMessage, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { readAllHtml, readBundle, readPages, routes } from './support/artifacts'

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

/** The content column's box, which is what the Frame's measure amounts to. */
async function readColumn(page: Page): Promise<{ left: number, width: number }> {
  const box = await page.getByRole('main').boundingBox()
  if (!box) {
    throw new Error('the content column has no box')
  }
  return { left: Math.round(box.x), width: Math.round(box.width) }
}

for (const viewport of [
  { name: 'a wide screen', width: 1440, height: 900 },
  { name: 'a laptop', width: 1024, height: 800 },
  { name: 'a phone', width: 390, height: 844 },
]) {
  test(`the Frame holds one bounded column on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/posts', { waitUntil: 'load' })

    const column = await readColumn(page)

    // The measure never exceeds 820 px, and on a screen too narrow to hold it the
    // column simply takes what is left — it never overflows the viewport.
    expect(column.width).toBeLessThanOrEqual(820)
    expect(column.width).toBeLessThanOrEqual(viewport.width)
    expect(column.left).toBeGreaterThanOrEqual(0)
    expect(column.left + column.width).toBeLessThanOrEqual(viewport.width)

    // Centred on every screen wide enough to centre it.
    if (viewport.width > 820) {
      const rightGutter = viewport.width - (column.left + column.width)
      expect(Math.abs(rightGutter - column.left)).toBeLessThanOrEqual(1)
    }

    // No horizontal scrolling is introduced by the Frame's own geometry.
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(overflows).toBe(false)

    // Row dividers survive every breakpoint: the footer rule is the one row the
    // Frame always has, whether or not the page has a list.
    const footerRule = await page
      .locator('footer')
      .evaluate(el => getComputedStyle(el).borderTopWidth)
    expect(footerRule).toBe('1px')
  })
}

test('the Frame does not move when only the page changes', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })
  const before = await readColumn(page)
  const headerBefore = await page.getByRole('banner').boundingBox()

  await page.getByRole('banner').getByRole('link', { name: 'projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)

  expect(await readColumn(page)).toEqual(before)
  expect(await page.getByRole('banner').boundingBox()).toEqual(headerBefore)
})

for (const scheme of ['light', 'dark'] as const) {
  test(`a keyboard-focused control paints its outline in the ${scheme} scheme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/posts', { waitUntil: 'load' })

    // Tab until a navigation link holds focus, so this is real keyboard focus
    // rather than a `:focus` style a mouse click would also trigger.
    let focused = ''
    for (let i = 0; i < 12 && focused !== 'projects'; i++) {
      await page.keyboard.press('Tab')
      focused = await page.evaluate(
        () => (document.activeElement?.textContent ?? '').trim(),
      )
    }
    expect(focused).toBe('projects')

    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const style = getComputedStyle(el)
      return {
        style: style.outlineStyle,
        width: style.outlineWidth,
        offset: style.outlineOffset,
        colour: style.outlineColor,
        canvas: getComputedStyle(document.documentElement).backgroundColor,
      }
    })

    expect(outline.style).toBe('solid')
    expect(outline.width).toBe('1px')
    expect(outline.offset).toBe('2px')

    // Visible in both schemes: the outline must not be the canvas colour.
    const [or = 0, og = 0, ob = 0] = (outline.colour.match(/[\d.]+/g) ?? []).map(Number)
    const [cr = 0, cg = 0, cb = 0] = (outline.canvas.match(/[\d.]+/g) ?? []).map(Number)
    expect(Math.abs(or - cr) + Math.abs(og - cg) + Math.abs(ob - cb)).toBeGreaterThan(60)
  })
}

test('the build carries nothing the redesign retired', () => {
  // `pixi.js` and `simplex-noise` drew the per-page canvases; `nprogress` drew
  // the 2 px route bar. None of them may survive in a shipped chunk.
  // Case-sensitive: Floating Vue keeps a `$_hideInProgress` flag, and a
  // case-insensitive search for `nprogress` would match it.
  const bundle = readBundle()
  for (const retired of ['pixi', 'simplex-noise', 'nprogress', 'NProgress']) {
    expect(bundle).not.toContain(retired)
  }

  // No page selects a canvas background any more, and no prerendered page
  // carries a canvas from one.
  const withArt = readPages().filter(page => /^art:/m.test(page.source))
  expect(withArt.map(page => page.file)).toEqual([])
  expect(readAllHtml()).not.toMatch(/<canvas/i)
})

test('the entrance cascade plays once, capped at six stages', async ({ page }) => {
  // A Post is the page with many top-level blocks; the list has one component.
  await page.goto('/posts/manual-git', { waitUntil: 'load' })

  // A page with many top-level blocks: everything past the sixth must inherit
  // the sixth stage's delay rather than queueing behind its own index.
  const delays = await page.evaluate(() => {
    const blocks = [...document.querySelectorAll('.slide-enter-content > *')]
    return blocks.slice(0, 10).map(el => getComputedStyle(el).animationDelay)
  })
  expect(delays.length).toBeGreaterThan(6)
  expect(new Set(delays.slice(6)).size).toBe(1)
  expect(delays[9]).toBe(delays[5])
})

test('a route change is one opacity keyframe and never replays the cascade', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  const cascadeOnFirstLoad = await page.evaluate(
    () => document.documentElement.classList.contains('no-sliding'),
  )
  expect(cascadeOnFirstLoad).toBe(false)

  const wrapper = page.locator('.route-in')
  const name = await wrapper.evaluate(el => getComputedStyle(el).animationName)
  const duration = await wrapper.evaluate(el => getComputedStyle(el).animationDuration)
  expect(name).toBe('route-in')
  expect(duration).toBe('0.2s')

  // Opacity only: a filled `transform` would leave an identity transform behind
  // and turn the wrapper into a containing block.
  expect(await wrapper.evaluate(el => getComputedStyle(el).transform)).toBe('none')

  await page.getByRole('banner').getByRole('link', { name: 'projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)

  // From the first route change on, the cascade is retired for good.
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('no-sliding')),
  ).toBe(true)
})

test('reduced motion strips the route keyframe and the cascade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/posts', { waitUntil: 'load' })

  expect(
    await page.locator('.route-in').evaluate(el => getComputedStyle(el).animationName),
  ).toBe('none')
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
