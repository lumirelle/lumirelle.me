import type { ConsoleMessage, Locator, Page } from '@playwright/test'
import type { RouteArtifact } from './support/artifacts'
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
    const nav = document.querySelector('header nav[aria-label="Primary"]')
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
  expect(name).toBe('route-in-down')
  expect(duration).toBe('0.2s')

  // The move is `backwards`-filled, so once the frame has played there is no
  // transform left: a lingering one would make the wrapper a containing block
  // and drag the fixed outline rail into the column.
  await expect
    .poll(() => wrapper.evaluate(el => getComputedStyle(el).transform))
    .toBe('none')

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

test('every segment of the breadcrumb is its own route', async ({ page }) => {
  await page.goto('/posts/manual-git', { waitUntil: 'load' })

  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })

  // The identity and the shell's `~` both lead home.
  await expect(crumbs.getByRole('link', { name: 'lumirelle@me' })).toHaveAttribute('href', '/')
  await expect(crumbs.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/')

  // Every path segment links to itself.
  await expect(crumbs.getByRole('link', { name: 'posts' })).toHaveAttribute('href', '/posts')

  // The page you are already on is marked, not a link to itself.
  const current = crumbs.locator('[aria-current="page"]')
  await expect(current).toHaveText('manual-git')
  await expect(crumbs.getByRole('link', { name: 'manual-git' })).toHaveCount(0)

  // The constant half is faint; the segment you are reading is at full ink.
  const inks = await crumbs.evaluate((el) => {
    const constant = el.querySelector('.const')!
    const mark = el.querySelector('[aria-current="page"]')!
    return { constant: getComputedStyle(constant).color, mark: getComputedStyle(mark).color }
  })
  expect(toChannels(inks.constant)).toEqual([118, 118, 118])
  expect(toChannels(inks.mark)).toEqual([17, 17, 17])

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
  await page.goto('/posts/manual-git', { waitUntil: 'load' })

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
  expect(label.text).toMatch(/^\d{4}$|^manuals/)
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

test('the post sections read as `posts` in the header', async ({ page }) => {
  for (const path of ['/blog', '/notes', '/manuals']) {
    await page.goto(path, { waitUntil: 'load' })

    const nav = page.getByRole('banner').getByRole('navigation', { name: 'Primary' })
    const posts = nav.getByRole('link', { name: 'posts', exact: true })

    // Visually current, and announced as *this section* rather than as "the
    // current page", which `/blog` is not.
    expect(
      toChannels(await posts.evaluate(el => getComputedStyle(el).color)),
      path,
    ).toEqual([17, 17, 17])
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

  // Not a change of place: no page-level keyframe on the wrapper.
  expect(
    await page.locator('main > div').first().evaluate(el => getComputedStyle(el).animationName),
  ).toBe('none')

  // The flag is what changed, so the flag is what gets typed.
  await expect
    .poll(() => command.evaluate(el => (el.textContent ?? '').replaceAll(/\s+/g, ' ').trim()))
    .toBe('ls posts --type=manual --sort=date')
})

test('a navigation from elsewhere still cross-fades', async ({ page }) => {
  await page.goto('/projects', { waitUntil: 'load' })
  await page.getByRole('banner').getByRole('link', { name: 'posts', exact: true }).click()
  await expect(page).toHaveURL(/\/posts$/)

  expect(
    await page.locator('main > div').first().evaluate(el => getComputedStyle(el).animationName),
  ).toBe('route-in-down')
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

test('STEP n. belongs to Manuals only', async ({ page }) => {
  await page.goto('/posts', { waitUntil: 'load' })
  await expect(page.getByRole('main')).not.toContainText('STEP ')

  await page.goto('/manuals', { waitUntil: 'load' })
  await expect(page.getByRole('main')).toContainText('STEP 1.')
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

    // No route animation and no entrance cascade, both by media query.
    const motion = await page.evaluate(() => ({
      route: getComputedStyle(document.querySelector('.route-in')!).animationName,
      cascade: [...document.querySelectorAll('.slide-enter, .slide-enter-content > *')]
        .map(el => getComputedStyle(el).animationName)
        .filter(name => name !== 'none'),
    }))
    expect(motion.route, `${route.path}: route animation`).toBe('none')
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

  for (const path of ['/posts', '/posts/manual-git']) {
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
