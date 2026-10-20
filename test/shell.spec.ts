import type { ConsoleMessage } from '@playwright/test'
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
