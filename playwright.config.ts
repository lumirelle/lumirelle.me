import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * One seam for the whole redesign: a browser suite against a production build.
 *
 * It runs against `vite preview` over `dist/`, never the dev server — dev mode
 * sets `no-sliding` on `<html>`, which disables the entrance cascade, so any
 * motion assertion made there would be vacuous.
 *
 * `mise run test` prepares the build, builds it, then runs this config.
 */

const PORT = 4173
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: 'test',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `vite preview --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
