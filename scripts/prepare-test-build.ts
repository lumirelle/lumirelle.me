/**
 * Make a production build possible from the checked-in tree alone.
 *
 * `mise run build` clones the external asset repository into `temp/`, and three
 * of the artefacts the build reads are `.gitignore`d:
 *
 *   - `temp/sponsors.json`             input for `scripts/sponsors-circles.ts`
 *   - `public/sponsors.svg`            imported by `src/components/SponsorsView.vue`
 *   - `src/data/sponsors-circles.json` produced by `scripts/copy-sponsors.ts`
 *
 * The browser suite must not depend on that repository, so this script stubs
 * anything missing with an empty but structurally valid value and then runs the
 * real generator. A machine that already cloned `temp/` is left untouched.
 */

import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'

const SPONSORS_JSON = 'temp/sponsors.json'
const SPONSORS_SVG = 'public/sponsors.svg'
const EMPTY_SPONSORS_JSON = '[]\n'
const EMPTY_SPONSORS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>\n'

if (!existsSync(SPONSORS_JSON)) {
  await fs.mkdir('temp', { recursive: true })
  await fs.writeFile(SPONSORS_JSON, EMPTY_SPONSORS_JSON)
  console.info(`[test-build] stubbed ${SPONSORS_JSON}`)
}

if (!existsSync(SPONSORS_SVG)) {
  await fs.mkdir('public', { recursive: true })
  await fs.writeFile(SPONSORS_SVG, EMPTY_SPONSORS_SVG)
  console.info(`[test-build] stubbed ${SPONSORS_SVG}`)
}

await import('./copy-sponsors.ts')
