import type { ConsoleMessage, Locator, Page } from '@playwright/test'
import type { RouteArtifact } from './support/artifacts'
import { expect, test } from '@playwright/test'
import dayjs from 'dayjs'
import { readAllHtml, readBundle, readPages, routes } from './support/artifacts'
import { firstCommitOf, historyAvailability, lastCommitOf } from './support/history'

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
    const header = document.querySelector('header nav[aria-label="Primary"]')
    const link = header?.querySelector('a')
    const footer = document.querySelector('footer')
    if (!link || !footer) {
      throw new Error('the Shell is missing one of the elements the palette is read from')
    }

    const [thumb = '', track = ''] = root.scrollbarColor.match(/(?:rgba?|color)\([^)]*\)/g) ?? []
    return {
      canvas: root.backgroundColor,
      surface: thumb,
      scrollbarTrack: track,
      stroke: getComputedStyle(footer).borderTopColor,
      ink: getComputedStyle(document.body).color,
      // The header reads at the secondary ink by design, so the primary level is
      // read from a page title and the faint level from the footer.
      inkStrong: getComputedStyle(document.querySelector('.masthead-title')!).color,
      inkFaint: getComputedStyle(footer).color,
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
  // Every test starts as a *returning* visitor, so the Splash cannot slow down or
  // obscure an assertion that is not about it. The Splash tests remove the flag
  // again with their own init script, which runs after this one.
  await page.addInitScript(() => {
    sessionStorage.setItem('lumirelle-splash-seen', '1')
  })

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
  const nav = header.getByRole('navigation', { name: 'Primary' })

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

  // The theme toggle closes the row, as a real button with a state-following name.
  const toggles = nav.getByRole('button')
  await expect(toggles).toHaveCount(1)
  await expect(toggles.first()).toHaveAccessibleName(/switch to (dark|light) theme/i)
  expect(await nav.locator('a, button').last().evaluate(el => el.tagName)).toBe('BUTTON')

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
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

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

test('a route change keeps the outgoing page and moves both', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  // On first load there is only ever one page on screen.
  await expect(page.locator('.route-frame')).toHaveCount(1)

  await page.getByRole('banner')
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'projects', exact: true })
    .click()

  // The old page is still there while it leaves, which is what makes the change
  // read as a scroll rather than a swap.
  await expect.poll(() => page.locator('.route-frame').count()).toBe(2)

  // And it is a slow, viewport-scale move rather than a 24 px nudge.
  const moving = await page.locator('.route-frame').last().evaluate((el) => {
    const style = getComputedStyle(el)
    return { duration: style.transitionDuration, property: style.transitionProperty }
  })
  expect(moving.duration).toContain('0.6s')
  expect(moving.property).toContain('transform')

  // And once it is done, nothing is left behind: no lingering transform that
  // would turn the wrapper into a containing block for the fixed rail.
  await expect.poll(() => page.locator('.route-frame').count()).toBe(1)
  await expect
    .poll(() => page.locator('.route-frame').evaluate(el => getComputedStyle(el).transform))
    .toBe('none')
})

test('reduced motion strips the route move and the cascade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/posts', { waitUntil: 'load' })

  // Ask the stylesheet what it would do, rather than racing the transition: put
  // the move classes on the page and read what they resolve to.
  const effect = await page.locator('.route-frame').evaluate((el) => {
    el.classList.add('route-down-enter-from', 'route-down-enter-active')
    const style = getComputedStyle(el)
    const resolved = { transform: style.transform, duration: style.transitionDuration }
    el.classList.remove('route-down-enter-from', 'route-down-enter-active')
    return resolved
  })

  expect(effect.transform).toBe('none')
  expect(effect.duration).toBe('0s')

  // The entrance cascade is off by media query too.
  expect(
    await page.evaluate(() =>
      [...document.querySelectorAll('.slide-enter, .slide-enter-content > *')]
        .map(el => getComputedStyle(el).animationName)
        .filter(name => name !== 'none'),
    ),
  ).toEqual([])
})

test('every segment of the breadcrumb is its own route', async ({ page }) => {
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })

  // The identity and the shell's `~` both lead home.
  await expect(crumbs.getByRole('link', { name: 'lumirelle@me' })).toHaveAttribute('href', '/')
  await expect(crumbs.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/')

  // Every path segment links to itself.
  await expect(crumbs.getByRole('link', { name: 'posts' })).toHaveAttribute('href', '/posts')

  // The page you are already on is marked, not a link to itself.
  const current = crumbs.locator('[aria-current="page"]')
  await expect(current).toHaveText('tutorial-git')
  await expect(crumbs.getByRole('link', { name: 'tutorial-git' })).toHaveCount(0)

  // The prompt `lumirelle@me` sits one level above the path: `~`, the slashes and
  // the segments are all the faint level, and nothing changes colour for state.
  const inks = await crumbs.evaluate((el) => {
    const prompt = el.querySelector('.const:not(.tilde)')!
    const path = [...el.querySelectorAll('.tilde, .sep, .crumb, [aria-current]')]
    return {
      prompt: getComputedStyle(prompt).color,
      path: [...new Set(path.map(node => getComputedStyle(node).color))],
    }
  })
  expect(toChannels(inks.prompt)).toEqual([58, 58, 58])
  expect(inks.path).toEqual(['rgb(118, 118, 118)'])

  // And an ancestor segment really navigates.
  await crumbs.getByRole('link', { name: 'posts' }).click()
  await expect(page).toHaveURL(/\/posts$/)
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText('posts')

  // The line tracks a shallower route too.
  await page.goto('/use', { waitUntil: 'load' })
  await expect(crumbs.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/')
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText('use')
})

test('the theme toggle names its destination and reuses the site reveal', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/', { waitUntil: 'load' })

  const toggle = page.getByRole('banner').getByRole('button')
  await expect(toggle).toHaveAccessibleName('Switch to dark theme')

  await toggle.click()

  // The reveal runs a View Transition, so the class lands a beat later.
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
    .toBe(true)
  await expect(toggle).toHaveAccessibleName('Switch to light theme')
})

test('the theme toggle still works under reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'load' })

  const toggle = page.getByRole('banner').getByRole('button')
  await toggle.click()
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
    .toBe(true)
})

test('scroll to top is inert until the reader has scrolled', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  const control = page.getByRole('button', { name: 'Scroll to top', includeHidden: true })
  await expect(control).toHaveCount(1)

  // Absent from the accessibility tree and the tab order while hidden — not
  // merely transparent.
  await expect(control).toHaveAttribute('inert', '')
  expect(await control.evaluate(el => (el as HTMLButtonElement).matches(':enabled') && el.hasAttribute('inert'))).toBe(true)

  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }))
  await expect
    .poll(() => control.evaluate(el => el.hasAttribute('inert')))
    .toBe(false)
  await expect(control).toBeVisible()

  // Inverts on hover: ink fill, canvas glyph. Polled, because the control
  // transitions colour over 120 ms and an immediate read lands mid-flight.
  await control.hover()
  await expect
    .poll(async () => {
      const painted = await control.evaluate(el => ({
        background: getComputedStyle(el).backgroundColor,
        colour: getComputedStyle(el).color,
      }))
      return { background: toRgb(painted.background), colour: toRgb(painted.colour) }
    })
    .toEqual({ background: 'rgb(17, 17, 17)', colour: 'rgb(255, 255, 255)' })

  // And it returns the reader to the top.
  await control.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('cd .. sits in the gutter outside the routed content and keeps the query', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 900 })
  await page.goto('/posts?page=2', { waitUntil: 'load' })

  const cdUp = page.getByRole('link', { name: /cd \.\./ })
  await expect(cdUp).toBeVisible()

  // Outside the routed content: it is not inside the page's article.
  const insideContent = await cdUp.evaluate(el => Boolean(el.closest('article, main')))
  expect(insideContent).toBe(false)

  await expect(cdUp).toHaveAttribute('href', '/?page=2')
})

/**
 * A row's size, rounded past subpixel noise.
 *
 * Size rather than position: the entrance cascade animates a `translateY`, which
 * moves a bounding box without changing layout, and scrolling moves it again.
 * Height is what a wrap-point change would alter, so height is what "layout
 * inert" actually means here.
 */
async function roundedSize(locator: Locator): Promise<Record<string, number>> {
  const box = await locator.boundingBox()
  if (!box) {
    throw new Error('the element has no box')
  }
  return { height: Math.round(box.height * 100) / 100, width: Math.round(box.width * 100) / 100 }
}

/** The ledger rows, as list items: the only list on the pilot page. */
function ledgerRows(page: Page) {
  return page.getByRole('main').getByRole('listitem')
}

test('the Post list is a ledger with one row per Post', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  const expected = routes.filter(route => route.path.startsWith('/posts/')).length
  expect(expected).toBeGreaterThan(20)
  await expect(ledgerRows(page)).toHaveCount(expected)

  // The group label is a real heading in the margin column, right-aligned and
  // mono — not an oversized numeral floating above the rows.
  const group = page.getByRole('main').getByRole('heading', { level: 2 }).first()
  await expect(group).toBeVisible()
  const label = await group.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      text: (el.textContent ?? '').trim(),
      align: style.textAlign,
      family: style.fontFamily,
    }
  })
  expect(label.text).toMatch(/^\d{4}$/)
  expect(label.align).toBe('right')
  expect(label.family).toMatch(/mono/i)

  // Rows are separated by rhythm, not by rules: the prototype's list carries no
  // per-row hairline at all.
  const rowRules = await page.getByRole('main').getByRole('listitem').evaluateAll(els =>
    els.map(el => getComputedStyle(el).borderBottomWidth),
  )
  expect([...new Set(rowRules)]).toEqual(['0px'])
})

test('dates are a monospaced, tabular column', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  const dates = ledgerRows(page).locator('time')
  await expect(dates.first()).toBeVisible()

  const painted = await dates.evaluateAll(els => els.map(el => ({
    variant: getComputedStyle(el).fontVariantNumeric,
    family: getComputedStyle(el).fontFamily,
  })))
  expect(painted.length).toBeGreaterThan(20)
  for (const date of painted) {
    expect(date.variant).toContain('tabular-nums')
    expect(date.family).toMatch(/mono/i)
  }
})

/**
 * The two formats the masthead prints a Post's date in: `MMM D` inside the
 * current year, `MMM D, YYYY` outside it.
 *
 * Mirrored rather than imported, because the suite has one seam — the build —
 * and never reaches into `src/`.
 */
function renderedDate(value: string): string {
  const date = dayjs(value)
  return date.year() === dayjs().year() ? date.format('MMM D') : date.format('MMM D, YYYY')
}

/** The offset an ISO-8601 timestamp carries, or UTC when it carries none. */
function offsetOf(value: string | undefined): string {
  return /([+-]\d{2}:\d{2})$/.exec(value ?? '')?.[1] ?? '+00:00'
}

/**
 * The calendar day an instant falls on, read in a given offset.
 *
 * This is the comparison the site makes: calendar days in *the offset the commit
 * carries*. The page receives the authored `date` as a `Date` — an instant with
 * no offset of its own — so the day is reconstructed rather than read off the
 * string.
 */
function dayInOffset(value: string, offset: string): string {
  const sign = offset.startsWith('-') ? -1 : 1
  const [hours = 0, minutes = 0] = offset.slice(1).split(':').map(Number)
  const shifted = new Date(new Date(value).getTime() + sign * (hours * 60 + minutes) * 60_000)
  return shifted.toISOString().slice(0, 10)
}

/** A text run with its whitespace collapsed, so a wrapped template compares as one sentence. */
function onOneLine(text: string): string {
  return text.replaceAll(/\s+/g, ' ').trim()
}

/** A Markdown source's frontmatter block, without its fences. */
function frontmatterBlock(source: string): string {
  return /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? ''
}

/** A frontmatter field's raw value, taken from the source file rather than the page. */
function frontmatterField(source: string, key: string): string | undefined {
  const value = new RegExp(`^${key}:[ \\t]*(.*)$`, 'm').exec(frontmatterBlock(source))?.[1]?.trim()
  return value === undefined || value === '' ? undefined : value
}

const history = historyAvailability()

test('every Post\'s last edit is the date of the commit that touched its file', async ({ page }) => {
  test.skip(!history.available, `history unavailable, nothing to compare against: ${history.reason}`)

  const sources = new Map(readPages().map(entry => [entry.file, entry.source]))
  const posts = routes
    .filter(route => /^\/posts\/[^/]+$/.test(route.path))
    .map(route => ({ route, file: `posts${route.path.slice('/posts'.length)}.md` }))
  expect(posts.length).toBeGreaterThan(20)

  for (const { route, file } of posts) {
    const source = sources.get(file)
    expect(source, `${file} is a page of the source tree`).toBeDefined()

    const published = frontmatterField(source!, 'date')
    const commit = lastCommitOf(`pages/${file}`)

    await page.goto(route.path, { waitUntil: 'load' })

    const mastheads = page.getByRole('main').locator('p').filter({ hasText: 'First post on' })
    const masthead = await mastheads.count()
    const text = masthead === 0 ? '' : onOneLine(await mastheads.first().textContent() ?? '')
    const segments = text.split('·').map(segment => segment.trim())

    if (!published) {
      expect(masthead, `${route.path} claims no date at all`).toBe(0)
      continue
    }

    expect(masthead, `${route.path}: one masthead line`).toBe(1)

    expect(segments[0], `${route.path}: publication date`).toBe(
      `First post on ${renderedDate(published)}`,
    )

    // The expected presence is computed the way the site computes it, so the
    // same-day rule is exercised the day a Post qualifies for it: a file whose
    // last commit lands on its publication day shows one date, not two.
    const offset = offsetOf(commit)
    const expectsEdit = commit !== undefined
      && dayInOffset(commit, offset) !== dayInOffset(published, offset)
    const edit = segments.find(segment => segment.startsWith('Last edit on '))

    if (expectsEdit) {
      expect(edit, `${route.path}: last edit (git ${commit})`).toBe(
        `Last edit on ${renderedDate(commit)}`,
      )
    }
    else {
      expect(edit, `${route.path}: no edit segment`).toBeUndefined()
    }

    // One date, not two: the publication date is stated once, whatever the edit
    // segment says.
    expect(
      text.split(`First post on ${renderedDate(published)}`).length - 1,
      `${route.path}: publication date stated once`,
    ).toBe(1)
  }
})

test('no Post carries a hand-written last-edit date', () => {
  // The field is derived from git now: the markdown plugin overwrites or deletes
  // `update:` before a Post renders, so an authored value would be discarded in
  // silence — and an author who keeps editing a field that does nothing is the
  // drift this work removed. The suite refuses the key instead, in the source
  // tree the build reads.
  const posts = readPages().filter(page => page.file.startsWith('posts/'))
  expect(posts.length).toBeGreaterThan(20)

  const authored = posts
    .filter(page => /^update:/m.test(frontmatterBlock(page.source)))
    .map(page => page.file)
  expect(authored, 'these Posts still author a last-edit date that git now owns').toEqual([])
})

test('no Post is published after the commit that introduced it', () => {
  test.skip(!history.available, `history unavailable, nothing to compare against: ${history.reason}`)

  // A Post dated later than its own first commit is not stale, it is impossible:
  // nothing exists before the commit that introduced it. The build warns about
  // that rather than failing (a typo must not make the site depend on history),
  // so the tree itself must not need the warning — every Post that ships is dated
  // at or before its first commit.
  const posts = readPages()
    .filter(page => /^posts\/[^/]+\.md$/.test(page.file) && page.file !== 'posts/index.md')
    .map(page => ({ file: page.file, published: frontmatterField(page.source, 'date') }))
    .filter(post => post.published !== undefined)
  expect(posts.length).toBeGreaterThan(20)

  const impossible = posts.flatMap(({ file, published }) => {
    const first = firstCommitOf(`pages/${file}`)
    // A Post history has never seen cannot contradict itself yet.
    if (!first) {
      return []
    }
    const offset = offsetOf(first)
    const days = { published: dayInOffset(published!, offset), first: dayInOffset(first, offset) }
    // Compared the way the site compares: calendar days in the commit's offset.
    return days.published > days.first ? [{ file, ...days }] : []
  })

  expect(impossible).toEqual([])
})

test('the post sections read as `posts` in the header', async ({ page }) => {
  for (const path of ['/blog', '/tutorials', '/guides', '/manuals']) {
    await page.goto(path, { waitUntil: 'load' })

    const nav = page.getByRole('banner').getByRole('navigation', { name: 'Primary' })
    const posts = nav.getByRole('link', { name: 'posts', exact: true })

    // Visually current, and announced as *this section* rather than as "the
    // current page", which `/blog` is not.
    expect(
      toChannels(await posts.evaluate(el => getComputedStyle(el).color)),
      path,
    ).toEqual([118, 118, 118])
    await expect(posts, path).toHaveAttribute('aria-current', 'true')

    // And no other item claims to be current.
    await expect(nav.locator('[aria-current="page"]'), path).toHaveCount(0)
  }
})

test('the list has no chinese-only control', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })
  await expect(page.getByRole('main')).not.toContainText('chinese only')
  await expect(page.getByRole('button', { name: /chinese/i })).toHaveCount(0)
})

test('moving between sections types the flag instead of fading the page', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  const command = page.locator('.command-line')
  await expect(command).toContainText('ls posts --sort=date')

  await page.getByRole('main').getByRole('link', { name: 'manuals', exact: true }).click()
  await expect(page).toHaveURL(/\/manuals$/)

  // Not a change of place: no page-level move, so the old page is never kept
  // alongside the new one.
  await expect(page.locator('.route-frame')).toHaveCount(1)
  expect(
    await page.locator('.route-frame').evaluate(el => getComputedStyle(el).transform),
  ).toBe('none')

  // The flag is what changed, so the flag is what gets typed.
  await expect
    .poll(() => command.evaluate(el => (el.textContent ?? '').replaceAll(/\s+/g, ' ').trim()))
    .toBe('ls posts --type=manual --sort=date')
})

test('the leaving page keeps its column while it goes', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/posts', { waitUntil: 'load' })

  const boxes = () => page.evaluate(() =>
    [...document.querySelectorAll('.route-frame')].map((el) => {
      const box = el.getBoundingClientRect()
      return { x: Math.round(box.x), width: Math.round(box.width) }
    }))

  const [rest] = await boxes()

  await page.getByRole('banner')
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'projects', exact: true })
    .click()
  await expect.poll(() => page.locator('.route-frame').count()).toBe(2)

  // Both pages share one grid cell, so neither may drift sideways or widen while
  // it moves. Both used to: the shared column took the wider page's content width
  // and pushed the leaving list past the column's right edge.
  for (const box of await boxes()) {
    expect(box).toEqual(rest)
  }
})

test('a navigation from elsewhere keeps the outgoing page', async ({ page }) => {
  await page.goto('/projects', { waitUntil: 'load' })
  await page.getByRole('banner')
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'posts', exact: true })
    .click()
  await expect(page).toHaveURL(/\/posts$/)

  // Two frames mid-flight: the old page scrolling out, the new one arriving.
  await expect.poll(() => page.locator('.route-frame').count()).toBe(2)
})

test('the outline rail follows the Post you navigate to', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  const rail = () => page.evaluate(() => {
    const toc = document.querySelector('.table-of-contents')
    if (!toc) {
      return null
    }
    return {
      owner: (toc as HTMLElement).dataset.owner ?? '',
      first: toc.querySelector('a')?.textContent?.trim() ?? '',
      active: toc.querySelector('a.toc-active')?.textContent?.trim() ?? '',
      x: Math.round(toc.getBoundingClientRect().x),
    }
  })

  const git = await rail()
  expect(git?.owner).toBe('/posts/tutorial-git')
  expect(git?.first).toBe('What Is Git?')
  // The first section is marked at the top, so the rail is never blank.
  expect(git?.active).toBe('What Is Git?')

  // Navigate to a different Post: the rail must be that Post's, not the last one.
  await page.goto('/posts', { waitUntil: 'load' })
  await page.getByRole('main')
    .getByRole('link')
    .filter({ hasText: 'Tutorial: Vue Advanced Grammar' })
    .first()
    .click()

  await expect.poll(async () => (await rail())?.owner).toBe('/posts/tutorial-vue-advanced-grammar')
  const vue = await rail()
  expect(vue?.first).not.toBe(git?.first)
  // And it is still in the gutter, not dragged into the column by the transition.
  expect(vue?.x).toBe(git?.x)
})

test('a rail link scrolls instead of moving the page', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  // The rail is adopted into `<body>`, which puts it outside the Post body's own
  // link handling. Left to the browser, the hash reached the router as a new
  // location and re-keyed the route frame: the rail played the page transition
  // while the headings it points at only scrolled.
  await page.locator('.route-frame').evaluate(el => el.setAttribute('data-kept', ''))

  await page.locator('.table-of-contents a[href="#basic-usage-of-git"]').click()

  // The move is the smooth scroll the body's own heading links make, so the
  // heading comes to rest under the header rather than at the top edge.
  const heading = page.locator('.route-frame[data-kept] #basic-usage-of-git')
  const top = () => heading.evaluate(el => Math.round(el.getBoundingClientRect().top))
  await expect.poll(top).toBeLessThan(60)

  // The frame the visitor was reading is still the frame on screen. A re-keyed
  // one would have been swapped out within `--duration-route` (600 ms).
  await page.waitForTimeout(700)
  await expect(page.locator('.route-frame[data-kept]')).toHaveCount(1)
  await expect(page).toHaveURL(/#basic-usage-of-git$/)
})

test('the outline rail lists h4 sections as subdivisions', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-computer-network', { waitUntil: 'load' })

  // h4 is a real section level in the Manuals, so the rail carries it. (`#### TLS/SSL`
  // in the Manual; the heading was renamed after this test was written.)
  const deep = page.locator('.table-of-contents a[href="#tls-ssl"]')
  await expect(deep).toBeVisible()

  // Smaller than the level above it, so a subdivision never reads as a peer.
  const sizes = await page.evaluate(() => {
    const rail = document.querySelector('.table-of-contents')!
    const size = (href: string) =>
      Number.parseFloat(getComputedStyle(rail.querySelector(`a[href="${href}"]`)!).fontSize)
    return { h3: size('#session-layer'), h4: size('#tls-ssl') }
  })
  expect(sizes.h4).toBeLessThan(sizes.h3)

  // And it is tracked like any other level.
  await deep.click()
  await expect(deep).toHaveClass(/toc-active/)
})

test('a long outline scrolls inside the rail, not off the page', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-js-advanced-grammar', { waitUntil: 'load' })

  const list = page.locator('.table-of-contents > ul')
  const box = await list.boundingBox()
  expect(box!.y + box!.height).toBeLessThanOrEqual(950)
  expect(await list.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true)

  // The section the visitor is in is shown inside the rail's own window, wherever
  // the page was scrolled to.
  const mark = page.locator('.table-of-contents a[href="#unhandled-rejections"]')
  await page.evaluate(() => {
    const heading = document.querySelector('#unhandled-rejections')!
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY)
  })
  await expect(mark).toHaveClass(/toc-active/)

  const inRail = await mark.evaluate((el) => {
    const rail = document.querySelector('.table-of-contents > ul')!.getBoundingClientRect()
    const entry = el.parentElement!.getBoundingClientRect()
    return {
      shown: entry.top >= rail.top - 1 && entry.bottom <= rail.bottom + 1,
      scrolled: document.querySelector<HTMLElement>('.table-of-contents > ul')!.scrollTop > 0,
    }
  })
  expect(inRail.shown).toBe(true)
  expect(inRail.scrolled).toBe(true)
})

test('the Shell owns the outline at both widths and never duplicates it', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-js-advanced-grammar', { waitUntil: 'load' })

  const outline = page.locator('.table-of-contents')
  await expect(outline).toHaveCount(1)

  // The wide-viewport rail is adopted out of the routed content, so a route
  // transition's transform cannot break its fixed position.
  expect(await outline.evaluate(el => Boolean(el.closest('.route-frame')))).toBe(false)

  const firstEntry = () => outline.evaluate(el => el.querySelector('a')?.textContent?.trim() ?? '')
  const wideEntry = await firstEntry()

  // Below 1400 px the same node stays Shell-owned: the panel ticket hands it a
  // host instead of leaving it in the Post or appending it straight to `<body>`.
  await page.setViewportSize({ width: 1200, height: 950 })
  await expect(outline).toHaveCount(1)
  expect(await outline.evaluate(el => Boolean(el.closest('.route-frame')))).toBe(false)
  await expect(page.locator('body > .table-of-contents')).toHaveCount(0)

  // Crossing back leaves exactly one outline and the same Post's list, not a
  // second one from the narrow presentation: the first section a reader can read
  // is the one they were reading before the width changed.
  await page.setViewportSize({ width: 1500, height: 950 })
  await expect(outline).toHaveCount(1)
  expect(await firstEntry()).toBe(wideEntry)
  expect(await outline.evaluate(el => Boolean(el.closest('.route-frame')))).toBe(false)
})

/**
 * Scroll the page to a position, re-asserted until it holds.
 *
 * The router restores the incoming page's scroll position as the navigation
 * commits, so a scroll taken while the page is still hydrating can be undone a
 * beat later — which would leave the test reading a page nobody scrolled.
 */
async function scrollPageTo(page: Page, top: number): Promise<void> {
  await expect.poll(async () => {
    await page.evaluate((y) => {
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo({ top: y, behavior: 'instant' })
    }, top)
    return page.evaluate(() => Math.round(window.scrollY))
  }).toBe(top)
}

/** The same, for a heading that has to come to rest at the top of the viewport. */
async function scrollToHeading(page: Page, selector: string): Promise<void> {
  await expect.poll(async () => {
    await page.evaluate((hash) => {
      document.documentElement.style.scrollBehavior = 'auto'
      const heading = document.querySelector(hash)!
      window.scrollTo({
        top: heading.getBoundingClientRect().top + window.scrollY,
        behavior: 'instant',
      })
    }, selector)
    return page.evaluate(
      hash => Math.round(document.querySelector(hash)!.getBoundingClientRect().top) === 0,
      selector,
    )
  }).toBe(true)
}

test('resizing across 1400 px keeps the reader\'s place in the outline', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-js-advanced-grammar', { waitUntil: 'load' })

  const mark = page.locator('.table-of-contents a[href="#unhandled-rejections"]')
  await scrollToHeading(page, '#unhandled-rejections')
  await expect(mark).toHaveClass(/toc-active/)

  const cdUp = page.getByRole('link', { name: /cd \.\./ })
  const cdTop = await cdUp.evaluate(el => Math.round(el.getBoundingClientRect().top))

  const readPlace = () => page.evaluate(() => {
    const outline = document.querySelector('.table-of-contents')!
    const list = outline.querySelector('ul')!
    const active = outline.querySelector('a.toc-active')
    const listBox = list.getBoundingClientRect()
    const entry = active?.parentElement!.getBoundingClientRect()
    return {
      active: active?.textContent?.trim() ?? '',
      shown: Boolean(entry && entry.top >= listBox.top - 1 && entry.bottom <= listBox.bottom + 1),
      scrolled: list.scrollTop > 0,
    }
  })

  const place = { active: 'Unhandled Rejections', shown: true, scrolled: true }
  expect(await readPlace()).toEqual(place)

  // The rail's tracking and its own scroll window survive the move into the
  // narrow presentation, and the move back out of it.
  await page.setViewportSize({ width: 1200, height: 950 })
  await expect.poll(readPlace).toEqual(place)

  await page.setViewportSize({ width: 1500, height: 950 })
  await expect.poll(readPlace).toEqual(place)

  // `cd ..` did not move either: it still sits in the gutter above the rail.
  expect(await cdUp.evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(cdTop)
})

test('below 1400 px a route change hands the outline to the new Post', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 950 })
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  const readOutline = () => page.evaluate(() => {
    const outline = document.querySelector('.table-of-contents')
    return {
      count: document.querySelectorAll('.table-of-contents').length,
      first: outline?.querySelector('a')?.textContent?.trim() ?? '',
      inFrame: Boolean(outline?.closest('.route-frame')),
    }
  })

  expect(await readOutline()).toEqual({
    count: 1,
    first: 'What Is Git?',
    inFrame: false,
  })

  // Leaving the Post takes its outline with it, rather than leaving a stale one
  // behind for the list page.
  await page.getByRole('banner')
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'posts', exact: true })
    .click()
  await expect(page).toHaveURL(/\/posts$/)
  await expect.poll(() => page.locator('.table-of-contents').count()).toBe(0)

  await page.getByRole('main')
    .getByRole('link')
    .filter({ hasText: 'Tutorial: Vue Advanced Grammar' })
    .first()
    .click()

  await expect.poll(readOutline).toEqual({
    count: 1,
    first: 'Introduction to Vue.js',
    inFrame: false,
  })
})

/*
 * The outline panel: below 1400 px the outline is opened, never revealed.
 *
 * The phone frame is the 390 × 844 the Frame row uses — the width at which the
 * old hover reveal painted a transparent column of section links over the
 * article the reader was in the middle of.
 */
const PHONE = { width: 390, height: 844 }

/** The `outline` control, reachable or not. */
function outlineControl(page: Page) {
  return page.getByRole('button', { name: 'outline', exact: true })
}

/**
 * The same control including the window where it is *absent*: while the panel is
 * open it is `inert`, which drops it from the tab order and the accessible tree.
 */
function outlineControlAnyState(page: Page) {
  return page.getByRole('button', { name: 'outline', exact: true, includeHidden: true })
}

/**
 * Open the outline panel on a Post, at the phone frame.
 *
 * The control shares the scroll control's threshold — it is `inert` until the
 * reader has moved 320 px — so the page is scrolled before it is pressed.
 */
async function openOutlinePanel(page: Page, path = '/posts/tutorial-git') {
  await page.setViewportSize(PHONE)
  await page.goto(path, { waitUntil: 'load' })
  await scrollPageTo(page, 900)
  const control = outlineControl(page)
  await expect(control).toBeVisible()
  await control.click()
  const panel = page.getByRole('dialog', { name: 'outline' })
  await expect(panel).toBeVisible()
  return panel
}

test('below 1400 px the outline is a control, never a hover reveal', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  // Where the reveal used to live: the outline's own left-hand column, over the
  // article. Hovering it no longer paints a list of sections on top of the text.
  await page.mouse.move(16, 160)
  await page.mouse.move(60, 300)
  await page.waitForTimeout(300)

  const outline = page.locator('.table-of-contents')
  await expect(outline).toHaveCount(1)
  // Still Shell-owned, but inside the closed panel rather than over the column.
  expect(await outline.evaluate(el => Boolean(el.closest('.route-frame')))).toBe(false)
  expect(await outline.evaluate(el => Boolean(el.closest('[inert]')))).toBe(true)
  // The Rail's active mark is generated content, so it is part of the link's
  // accessible name; here it is enough that no such link is reachable at all.
  await expect(page.getByRole('link', { name: 'What Is Git?' })).toHaveCount(0)

  // The control is present, says what it does in words, and reports collapsed.
  const control = page.getByRole('button', { name: 'outline', exact: true, includeHidden: true })
  await expect(control).toHaveCount(1)
  await expect(control).toHaveAttribute('aria-expanded', 'false')
  const controlled = await control.evaluate(el => el.getAttribute('aria-controls') ?? '')
  expect(controlled).not.toBe('')
  expect(await page.locator(`#${controlled}`).getAttribute('role')).toBe('dialog')

  // A laptop-width window is the same story: no width below the line has a
  // reveal left to hover.
  await page.setViewportSize({ width: 1200, height: 950 })
  await page.mouse.move(60, 300)
  await page.waitForTimeout(300)
  await expect(page.getByRole('link', { name: 'What Is Git?' })).toHaveCount(0)
})

test('the outline control opens the panel and Esc hands focus back', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  // The whole control, though it leaves the accessible tree while the panel is
  // open: that absence is what this test asserts.
  const control = outlineControlAnyState(page)
  await expect(control).toHaveCount(1)
  // Absent until the reader has moved, exactly like the scroll control below it.
  await expect(control).toHaveAttribute('inert', '')

  await scrollPageTo(page, 900)
  await expect.poll(() => control.evaluate(el => el.hasAttribute('inert'))).toBe(false)

  // Directly above the scroll control, right edges aligned in one column.
  const scroller = page.getByRole('button', { name: 'Scroll to top', includeHidden: true })
  const trigger = await control.boundingBox()
  const scroll = await scroller.boundingBox()
  expect(trigger!.y + trigger!.height).toBeLessThanOrEqual(scroll!.y)
  expect(Math.round(trigger!.x + trigger!.width)).toBe(Math.round(scroll!.x + scroll!.width))

  await expect(control).toHaveAttribute('aria-expanded', 'false')
  await control.click()

  const panel = page.getByRole('dialog', { name: 'outline' })
  await expect(panel).toBeVisible()

  // Open, the control is absent rather than merely covered: there is nothing
  // left to tab onto, nothing to announce, and nothing left to misreport state.
  await expect(outlineControlAnyState(page)).toHaveCount(0)

  // Opening moves focus into the panel…
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))))
    .toBe(true)

  // …and Tab walks the panel instead: the sections are the only stops there.
  for (let presses = 0; presses < 8; presses++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))))
      .toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  // …and closing brings the control back, focused and reporting collapsed, so
  // the reader's place in the tab order is restored rather than lost.
  await expect(control).toBeFocused()
  await expect(control).toHaveAttribute('aria-expanded', 'false')
  await expect(control).not.toHaveAttribute('inert', '')
})

test('the closed outline panel is off-canvas and out of the tab order', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  // Nothing inside it is announced while it is closed.
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)

  const closed = page.getByRole('dialog', { name: 'outline', includeHidden: true })
  await expect(closed).toHaveCount(1)
  expect(await closed.evaluate(el => el.closest('[inert]') !== null)).toBe(true)

  // The panel is the thing hidden while the panel is what is closed; the control
  // that opens it is not — its own absence belongs to the open state only.
  await expect(outlineControlAnyState(page)).toHaveCount(1)
  await expect(outlineControlAnyState(page)).toHaveAttribute('aria-expanded', 'false')

  // Off-canvas, past the right edge, rather than removed: it keeps the layout the
  // slide and the reader's place in the list both depend on.
  const box = await closed.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(PHONE.width)

  // And no Tab ever lands on a link the reader cannot see.
  for (let presses = 0; presses < 10; presses++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))))
      .toBe(false)
  }
})

for (const scheme of ['light', 'dark'] as const) {
  test(`the outline panel is the site's surface in the ${scheme} scheme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    const panel = await openOutlinePanel(page)

    const painted = await panel.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        surface: style.backgroundColor,
        edge: style.borderLeftColor,
        edgeWidth: style.borderLeftWidth,
        ink: style.color,
      }
    })

    // A surface of its own, with one hairline on the inner edge — the assertion
    // that would have caught a transparent list painted over the article.
    expect(toRgb(painted.surface)).toBe(PALETTE.surface[scheme])
    expect(painted.edgeWidth).toBe('1px')
    expect(toRgb(painted.edge)).toBe(PALETTE.stroke[scheme])
    expect([PALETTE.ink[scheme], PALETTE.inkStrong[scheme], PALETTE.inkFaint[scheme]])
      .toContain(toRgb(painted.ink))

    // Headed `$ cat outline` with the prompt at full ink, footed `esc`.
    await expect(panel).toContainText('cat outline')
    await expect(panel).toContainText('esc')
    const prompt = panel.getByText('$', { exact: true })
    await expect(prompt).toBeVisible()
    expect(toRgb(await prompt.evaluate(el => getComputedStyle(el).color)))
      .toBe(PALETTE.inkStrong[scheme])

    // The list itself, with the Rail's active mark: `>` in a reserved gutter, on
    // exactly the section the reader is in. Polled, because the mark fades in.
    const marked = () => panel.getByRole('link').evaluateAll(els => els.map(el => ({
      marker: getComputedStyle(el, '::before').content,
      shown: getComputedStyle(el, '::before').opacity,
      label: (el.textContent ?? '').trim(),
    })))
    await expect.poll(async () => (await marked()).filter(mark => mark.shown === '1')).toHaveLength(1)
    const marks = await marked()
    expect(marks.length).toBeGreaterThan(5)
    expect(marks.every(mark => mark.marker === '">"')).toBe(true)

    // Keyboard focus inside the panel keeps the site's one indicator: a 1 px
    // hairline, 2 px clear of the link, in an ink the panel's surface is not.
    // Tab lands on the first section, because that is what the reader came for.
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const style = getComputedStyle(el)
      return {
        inPanel: Boolean(el.closest('[role="dialog"]')),
        href: el.getAttribute('href') ?? '',
        style: style.outlineStyle,
        width: style.outlineWidth,
        offset: style.outlineOffset,
        colour: style.outlineColor,
      }
    })

    expect(focused.inPanel).toBe(true)
    expect(focused.href.startsWith('#')).toBe(true)
    expect(focused.style).toBe('solid')
    expect(focused.width).toBe('1px')
    expect(focused.offset).toBe('2px')

    // Visible in both schemes: the outline must not be the surface it sits on.
    const [or = 0, og = 0, ob = 0] = (focused.colour.match(/[\d.]+/g) ?? []).map(Number)
    const [sr = 0, sg = 0, sb = 0] = (painted.surface.match(/[\d.]+/g) ?? []).map(Number)
    expect(Math.abs(or - sr) + Math.abs(og - sg) + Math.abs(ob - sb)).toBeGreaterThan(60)
  })
}

test('the outline panel carries the same three levels as the Rail', async ({ page }) => {
  const panel = await openOutlinePanel(page, '/posts/tutorial-computer-network')

  const size = async (name: string) => Number.parseFloat(await panel
    .getByRole('link', { name })
    .first()
    .evaluate(el => getComputedStyle(el).fontSize))

  // h4 is a real section level in the Manuals, so the panel carries it — at
  // 10 px, one step below the level above it, never as another section.
  expect(await size('Session Layer')).toBe(11)
  expect(await size('TLS/SSL')).toBe(10)
})

test('a section in the outline panel scrolls without re-keying the route', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })
  await page.locator('.route-frame').evaluate(el => el.setAttribute('data-kept', ''))

  await scrollPageTo(page, 900)
  await outlineControl(page).click()
  const panel = page.getByRole('dialog', { name: 'outline' })
  await panel.getByRole('link', { name: 'Basic Usage of Git' }).click()

  // The move is a scroll, not a page: the heading comes to rest under the header
  // and the frame the reader was in is still the frame on screen.
  const heading = page.locator('.route-frame[data-kept] #basic-usage-of-git')
  const top = () => heading.evaluate(el => Math.round(el.getBoundingClientRect().top))
  await expect.poll(top).toBeLessThan(60)

  await page.waitForTimeout(700)
  await expect(page.locator('.route-frame[data-kept]')).toHaveCount(1)
  await expect(page).toHaveURL(/#basic-usage-of-git$/)

  // Choosing a section dismisses the panel it was chosen from.
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)
})

test('the outline panel scrolls its own list inside itself', async ({ page }) => {
  const panel = await openOutlinePanel(page, '/posts/tutorial-js-advanced-grammar')

  // The panel ends where the viewport does, however long the outline is.
  const panelBox = await panel.boundingBox()
  expect(panelBox!.y).toBeGreaterThanOrEqual(0)
  expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(PHONE.height)

  const before = await page.evaluate(() => window.scrollY)
  const deepest = panel.getByRole('link').last()
  await deepest.scrollIntoViewIfNeeded()
  await expect(deepest).toBeVisible()

  // What scrolled was the list inside the panel: the page behind it did not move.
  const [entry, port] = [await deepest.boundingBox(), await panel.boundingBox()]
  expect(entry!.y + entry!.height).toBeLessThanOrEqual(port!.y + port!.height + 1)
  expect(await page.evaluate(() => window.scrollY)).toBe(before)
})

test('the backdrop closes the outline panel', async ({ page }) => {
  await openOutlinePanel(page)

  // Anywhere outside the panel: the dimmed column is the dismiss target.
  await page.mouse.click(20, 400)
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)
  // Focus follows the panel out, back to the control.
  await expect(outlineControl(page)).toBeFocused()
  await expect(page.getByRole('dialog', { name: 'outline', includeHidden: true })).toHaveCount(1)
})

test('a route with no outline offers no control', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts', { waitUntil: 'load' })
  await scrollPageTo(page, 900)

  // Nothing to open, so nothing offered — not a control that opens an empty panel.
  await expect(page.locator('.table-of-contents')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'outline', exact: true, includeHidden: true }))
    .toHaveCount(0)
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)
})

test('the page behind the outline panel cannot scroll until it closes', async ({ page }) => {
  const panel = await openOutlinePanel(page)
  await expect(panel).toBeVisible()

  const before = await page.evaluate(() => window.scrollY)
  // Over the dimmed column, not the panel's own list.
  await page.mouse.move(20, 400)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => window.scrollY)).toBe(before)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)

  await page.mouse.move(20, 400)
  await page.mouse.wheel(0, 600)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before)
})

test('navigating away closes the outline panel', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-vue-advanced-grammar', { waitUntil: 'load' })

  // Two SPA moves, so that going back lands on another Post that has an outline
  // of its own rather than on a page with none.
  await page.getByRole('banner')
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'posts', exact: true })
    .click()
  await expect(page).toHaveURL(/\/posts$/)
  await page.getByRole('main')
    .getByRole('link')
    .filter({ hasText: 'Tutorial: Git' })
    .first()
    .click()
  await expect(page).toHaveURL(/\/posts\/tutorial-git$/)

  await scrollPageTo(page, 900)
  await outlineControl(page).click()
  await expect(page.getByRole('dialog', { name: 'outline' })).toBeVisible()

  // The backdrop owns the header while the panel is open, so the way out is the
  // one the browser offers — and the panel belongs to the Post being left.
  await page.evaluate(() => window.history.go(-2))
  await expect(page).toHaveURL(/\/posts\/tutorial-vue-advanced-grammar$/)
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)
  await expect
    .poll(() => page.locator('.table-of-contents a').first().textContent())
    .toBe('Introduction to Vue.js')
})

test('the outline control is absent where the Rail owns the outline', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 })
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  // The Rail, unchanged and in the gutter.
  await expect(page.getByRole('link', { name: 'What Is Git?' })).toBeVisible()

  // Nothing of the narrow presentation appears at 1500 px.
  await expect(outlineControl(page)).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'outline', exact: true, includeHidden: true }))
    .toBeHidden()
  await expect(page.getByRole('dialog', { name: 'outline', includeHidden: true })).toBeHidden()
})

test('the outline panel appears without sliding under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const panel = await openOutlinePanel(page)

  const moving = await panel.evaluate((el) => {
    const style = getComputedStyle(el)
    return { property: style.transitionProperty, duration: style.transitionDuration }
  })
  expect(moving.duration).toBe('0s')
  await expect(panel).toBeVisible()
})

test('o opens and closes the outline panel', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })
  await scrollPageTo(page, 900)

  const panel = page.getByRole('dialog', { name: 'outline' })
  await page.keyboard.press('o')
  await expect(panel).toBeVisible()
  // It says it is the only thing on screen: the column behind cannot scroll and
  // is dimmed, so assistive technology is told the page is modal.
  await expect(panel).toHaveAttribute('aria-modal', 'true')

  await page.keyboard.press('o')
  await expect(panel).toHaveCount(0)
})

test('o reaches the outline from the top of the page, where the control is not', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })

  // The control shares the scroll control's threshold, so at the top of the page
  // there is nothing to press. The keyboard still reaches the outline — and Esc
  // leaves the reader where they were instead of handing focus to a control that
  // is `inert` and could not take it.
  await expect(outlineControl(page)).toHaveAttribute('inert', '')
  await page.keyboard.press('o')
  await expect(page.getByRole('dialog', { name: 'outline' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'outline' })).toHaveCount(0)
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))))
    .toBe(false)
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)
})

test('neither the outline control nor the panel prints', async ({ page }) => {
  await page.setViewportSize(PHONE)
  await page.goto('/posts/tutorial-git', { waitUntil: 'load' })
  await scrollPageTo(page, 900)
  await page.emulateMedia({ media: 'print' })

  await expect(page.getByRole('button', { name: 'outline', exact: true, includeHidden: true }))
    .toBeHidden()
  await expect(page.getByRole('dialog', { name: 'outline', includeHidden: true })).toBeHidden()
})

test('a prerendered Post keeps its outline for a reader without JavaScript', () => {
  const html = readAllHtml()

  // The pipeline still generates the outline inside the page, so the Rail is
  // reachable at 1400 px and wider without a line of JavaScript…
  expect(html).toMatch(/<div class="table-of-contents">[\s\S]{0,4000}?<a href="#what-is-git">/)
  // …and the hamburger that used to sit on top of it is retired.
  expect(html).not.toContain('table-of-contents-anchor')
})

test('the header stays on one line and never collapses its parents', async ({ page }) => {
  // The longest slug on the site: the current segment is the only thing that may
  // give way.
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/posts/test-recursive-mono-nbsp-rendering', { waitUntil: 'load' })

  const read = () => page.evaluate(() => {
    const box = (el: Element) => {
      const rect = el.getBoundingClientRect()
      return { width: Math.round(rect.width), truncated: el.scrollWidth > el.clientWidth + 1 }
    }
    const crumb = document.querySelector('.breadcrumb')!.getBoundingClientRect()
    const nav = document.querySelector('nav[aria-label="Primary"]')!.getBoundingClientRect()
    return {
      prompt: box(document.querySelector('.const:not(.tilde)')!),
      parent: box(document.querySelector('.crumb:not(.current)')!),
      current: box(document.querySelector('.current')!),
      oneLine: Math.abs(crumb.y - nav.y) < 2,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }
  })

  const wide = await read()
  expect(wide.oneLine).toBe(true)
  expect(wide.overflow).toBe(false)
  // Parents keep their full width; the slug is the one that ellipsises.
  expect(wide.prompt.width).toBeGreaterThan(60)
  expect(wide.parent.width).toBeGreaterThan(20)
  expect(wide.parent.truncated).toBe(false)
  expect(wide.current.truncated).toBe(true)

  // On a phone the same holds: the row is one line, the parents are intact.
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/posts/test-recursive-mono-nbsp-rendering', { waitUntil: 'load' })
  const narrow = await read()
  expect(narrow.overflow).toBe(false)
  expect(narrow.prompt.width).toBe(wide.prompt.width)
  expect(narrow.parent.width).toBe(wide.parent.width)
})

test('code blocks are terminal windows with a copy control', async ({ page }) => {
  await page.goto('/posts/tutorial-js-pm', { waitUntil: 'load' })

  const window = page.locator('.code-window').first()
  await expect(window).toBeVisible()

  const chrome = await window.evaluate((el) => {
    const style = getComputedStyle(el)
    const bar = el.querySelector('.code-window-bar')!
    return {
      radius: style.borderTopLeftRadius,
      border: style.borderTopWidth,
      fill: style.backgroundColor,
      overflow: style.overflow,
      dots: bar.querySelectorAll('.code-dot').length,
      language: bar.querySelector('.code-window-lang')?.textContent?.trim() ?? '',
    }
  })

  // 8 px radius, one hairline, the surface fill, clipped to the frame.
  expect(chrome.radius).toBe('8px')
  expect(chrome.border).toBe('1px')
  expect(toChannels(chrome.fill)).toEqual([246, 246, 246])
  expect(chrome.overflow).toBe('hidden')
  expect(chrome.dots).toBe(3)
  expect(chrome.language).not.toBe('')

  // The window is prerendered, so the control works before anything hydrates it
  // per block: one delegated listener covers them all.
  const copy = window.getByRole('button', { name: 'Copy code' })
  await expect(copy).toHaveText('copy')
  await copy.click()
  await expect(copy).toHaveText(/copied|failed/)
})

test('the ledger keeps its ordering: newest year first, then newest date', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  // Read what a visitor reads: the group label in the margin, then the dates
  // beneath each title. `datetime` is the authored date, so the assertion does
  // not depend on how the meta line prints it.
  const groups = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('main section')]
    return sections.map(section => ({
      label: (section.querySelector('h2')?.textContent ?? '').trim(),
      stamps: [...section.querySelectorAll('time')]
        .map(time => time.getAttribute('datetime') ?? ''),
    }))
  })

  expect(groups.length).toBeGreaterThan(0)

  const years = groups
    .map(group => group.label)
    .filter(label => /^\d{4}$/.test(label))
    .map(Number)
  expect(years.length).toBeGreaterThan(0)
  expect([...years].sort((a, b) => b - a)).toEqual(years)

  for (const group of groups) {
    const stamps = group.stamps.map(stamp => Date.parse(stamp))
    expect(stamps.every(stamp => Number.isFinite(stamp)), group.label).toBe(true)
    expect([...stamps].sort((a, b) => b - a), group.label).toEqual(stamps)
  }
})

test('no middle-dot metadata strings remain in the list', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })

  const text = ((await page.getByRole('main').textContent()) ?? '').replaceAll(/\s+/g, ' ')
  expect(text).not.toContain('·')
})

test('STEP n. belongs to the sequences only', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })
  await expect(page.getByRole('main')).not.toContainText('STEP ')

  // Every sequence numbers its rows from one, per group.
  for (const path of ['/manuals', '/tutorials', '/guides']) {
    await page.goto(path, { waitUntil: 'load' })
    await expect(page.getByRole('main'), path).toContainText('STEP 1.')
  }

  // A Guide numbers inside its series, so `STEP 2.` starts over in the next one.
  await page.goto('/guides', { waitUntil: 'load' })
  await expect(page.getByRole('main')).toContainText('STEP 4.')
})

test('hovering a row inverts its date cell without moving the title', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/posts', { waitUntil: 'load' })
  // The mono face swaps in after first paint; measure once it has settled, or
  // the font's own metric change would be mistaken for a layout shift.
  await page.evaluate(() => document.fonts.ready)

  const row = ledgerRows(page).first()
  const date = row.locator('time')
  const restingColour = await date.evaluate(el => getComputedStyle(el).color)

  await row.hover()
  const during = await roundedSize(row)

  // Terminal selection: the date reads as a selected line, canvas on ink.
  await expect
    .poll(() => date.evaluate(el => getComputedStyle(el).color))
    .toBe('rgb(255, 255, 255)')
  expect(restingColour).not.toBe('rgb(255, 255, 255)')

  // The decode-glitch resolves the title in place: random glyphs are wider and
  // narrower than the real ones, so the row must not move while they swap.
  await expect.poll(() => roundedSize(row)).toEqual(during)
})

/**
 * The invariant every route shares: the prerendered content is on screen and the
 * Shell is around it. Used by the per-route walk and by both stripped-Effect
 * walks, so the three cannot drift apart.
 */
async function expectRouteRendered(page: Page, route: RouteArtifact): Promise<void> {
  const content = page.getByRole('main')
  await expect(content, `${route.path}: content`).toBeVisible()
  expect(squash((await content.textContent()) ?? ''), `${route.path}: prerendered text`)
    .toContain(squash(route.marker))

  const shell = page.getByRole('banner')
  await expect(shell, `${route.path}: Shell`).toBeVisible()
  await expect(
    shell
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'posts', exact: true }),
    `${route.path}: navigation`,
  ).toBeVisible()
}

/** Marks this test's session as cold, undoing the returning-visitor seed. */
async function coldSession(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.removeItem('lumirelle-splash-seen')
  })
}

const splash = '#splash'

test('the Splash plays once on a cold session and blocks the page beneath it', async ({ page }) => {
  await coldSession(page)
  await page.goto('/', { waitUntil: 'load' })

  const overlay = page.locator(splash)
  await expect(overlay).toBeVisible()

  // Opaque and on top: a click lands on the overlay, not on the page beneath,
  // while scrolling is untouched.
  const hit = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    return {
      insideSplash: Boolean(el?.closest('#splash')),
      scrollable: getComputedStyle(document.documentElement).overflowY !== 'hidden',
    }
  })
  expect(hit.insideSplash).toBe(true)
  expect(hit.scrollable).toBe(true)

  // The Splash is the first-load moment, so the entrance cascade does not also
  // run underneath it.
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('no-sliding')),
  ).toBe(true)

  // And it finishes by itself, in about a second, with nobody touching it.
  await expect(overlay).toBeHidden({ timeout: 2000 })
})

test('the Splash never paints when its stylesheet has not applied', async ({ page }) => {
  // The markup is in the prerendered HTML, so it exists before any CSS does. If
  // it were visible by default it would paint as raw ASCII in the corner of the
  // page — which is exactly what the dev server did, where styles arrive with
  // the module graph rather than as a render-blocking link.
  await page.route('**/*.css', route => route.abort())
  await coldSession(page)
  await page.goto('/', { waitUntil: 'load' })

  await expect(page.locator(splash)).toBeHidden()
  await expect(page.getByText('lumirelle.me $ ls posts --sort=date')).toBeHidden()
})

test('a click jumps the Splash to its end state', async ({ page }) => {
  await coldSession(page)
  await page.goto('/', { waitUntil: 'load' })
  await expect(page.locator(splash)).toBeVisible()

  await page.mouse.click(200, 200)

  await expect(page.locator(splash)).toBeHidden({ timeout: 1000 })
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem('lumirelle-splash-seen')))
    .toBe('1')
})

test('a returning visitor never sees the Splash', async ({ page }) => {
  // The default session is already seeded by `beforeEach`.
  await page.goto('/posts', { waitUntil: 'load' })
  await expect(page.locator(splash)).toBeHidden()
})

test('the Splash is not rendered under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await coldSession(page)
  await page.goto('/', { waitUntil: 'load' })

  await expect(page.locator(splash)).toBeHidden()
})

test('the Splash never replays on a route change', async ({ page }) => {
  await coldSession(page)
  await page.goto('/', { waitUntil: 'load' })
  await page.mouse.click(200, 200)
  await expect(page.locator(splash)).toBeHidden({ timeout: 1000 })

  await page.goto('/posts', { waitUntil: 'load' })
  await expect(page.locator(splash)).toBeHidden()

  await page.getByRole('banner').getByRole('link', { name: 'projects', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.locator(splash)).toBeHidden()
})

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('every page is readable and never shows the Splash', async ({ page }) => {
    for (const path of ['/', '/posts', '/use']) {
      await page.goto(path, { waitUntil: 'load' })
      await expect(page.locator(splash)).toBeHidden()
      await expect(page.getByRole('main')).toBeVisible()
      await expect(
        page.getByRole('banner').getByRole('link', { name: 'posts', exact: true }),
      ).toBeVisible()
    }
  })
})

/*
 * The exit audit.
 *
 * P1 promised that no Effect is load-bearing, so these walk *every* route with
 * the Effects stripped rather than sampling one page. Each loop names the route
 * it failed on, so a failure still points at a page.
 */

test('every route is complete with reduced motion and no Effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'load' })

    await expectRouteRendered(page, route)
    await expect(page.locator(splash), `${route.path}: Splash`).toBeHidden()

    // No route move and no entrance cascade, both by media query.
    const motion = await page.evaluate(() => ({
      route: getComputedStyle(document.querySelector('.route-frame')!).transform,
      cascade: [...document.querySelectorAll('.slide-enter, .slide-enter-content > *')]
        .map(el => getComputedStyle(el).animationName)
        .filter(name => name !== 'none'),
    }))
    expect(motion.route, `${route.path}: route transform`).toBe('none')
    expect(motion.cascade, `${route.path}: entrance cascade`).toEqual([])
  }
})

test('every surface keeps its hairlines and ink in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'load' })

    const paint = await page.evaluate(() => {
      const footer = document.querySelector('footer')
      const body = getComputedStyle(document.body)
      const root = getComputedStyle(document.documentElement)
      return {
        canvas: root.backgroundColor,
        ink: body.color,
        rule: footer ? getComputedStyle(footer).borderTopColor : 'rgb(38, 38, 38)',
      }
    })

    expect(toChannels(paint.canvas), `${route.path}: canvas`).toEqual([0, 0, 0])
    // A dark-mode hairline that disappears into the canvas is a lost structure.
    expect(toChannels(paint.rule), `${route.path}: hairline`).not.toEqual([0, 0, 0])
    // And body ink must clear the canvas by a wide margin.
    const [r, g, b] = toChannels(paint.ink)
    expect(r + g + b, `${route.path}: ink`).toBeGreaterThan(300)
  }
})

test('the Frame degrades below the breakpoint on both P1 pages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const path of ['/posts', '/posts/tutorial-git']) {
    await page.goto(path, { waitUntil: 'load' })

    const frame = await page.evaluate(() => ({
      overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      footerRule: getComputedStyle(document.querySelector('footer')!).borderTopWidth,
      mainWidth: document.querySelector('main')!.getBoundingClientRect().width,
    }))

    expect(frame.overflows, `${path}: horizontal scroll`).toBe(false)
    // Row dividers survive; only the vertical rails would have been dropped, and
    // the design has none.
    expect(frame.footerRule, `${path}: row divider`).toBe('1px')
    expect(frame.mainWidth, `${path}: column width`).toBeLessThanOrEqual(390)
  }
})

test('keyboard focus reaches the navigation and the rows, and is always painted', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/posts', { waitUntil: 'load' })

  // The Shell has to be interactive before the first Tab lands on anything;
  // pressing into a half-hydrated page leaves focus on `body`.
  await expect(
    page.getByRole('banner')
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'posts', exact: true }),
  ).toBeVisible()

  const seen: string[] = []
  let outlines = 0
  let rowLinks = 0
  let presses = 0

  // Enough stops to leave the header *and* the masthead's command and filter
  // rows behind, and land inside the ledger.
  while (presses < 48 && outlines < 20) {
    presses += 1
    await page.keyboard.press('Tab')

    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body) {
        return null
      }
      const style = getComputedStyle(el)
      return {
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24),
        style: style.outlineStyle,
        width: style.outlineWidth,
        offset: style.outlineOffset,
        colour: style.outlineColor,
        identity: `${el.tagName}.${(el.className || '').toString().slice(0, 20)}`,
        inRow: Boolean(el.closest('li')),
      }
    })

    // Nothing focused yet: the first presses can land before the page is
    // interactive, which is a timing artefact rather than a tab-order defect.
    if (!focused) {
      continue
    }

    seen.push(focused.label || focused.identity)
    expect(focused.style, `focus outline on ${focused.identity}`).toBe('solid')
    expect(focused.width, `focus outline width on ${focused.identity}`).toBe('1px')
    expect(focused.offset, `focus outline offset on ${focused.identity}`).toBe('2px')
    expect(toChannels(focused.colour), `focus outline colour on ${focused.identity}`)
      .toEqual([17, 17, 17])
    outlines += 1
    if (focused.inRow) {
      rowLinks += 1
    }
  }

  expect(outlines).toBeGreaterThanOrEqual(8)
  // The tab order leaves the header and reaches the ledger too.
  expect(rowLinks).toBeGreaterThanOrEqual(3)
  // Every text link plus the two icon controls plus the theme toggle, then rows.
  expect(seen).toEqual(expect.arrayContaining(['posts', 'projects', 'use', 'photos', 'demos']))
})

test.describe('with JavaScript disabled, every route', () => {
  test.use({ javaScriptEnabled: false })

  test('still prerenders its content and the Shell', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path, { waitUntil: 'load' })

      await expectRouteRendered(page, route)
      await expect(page.locator(splash), `${route.path}: Splash`).toBeHidden()
    }
  })
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

    await expectRouteRendered(page, route)

    expect(problems).toEqual([])
  })
}
