import fs from 'node:fs/promises'
import { basename } from 'node:path'
import { glob } from 'tinyglobby'

async function run() {
  const files = await glob('temp/*.svg', {
    expandDirectories: false,
  })

  for (const file of files)
    await fs.copyFile(file, `public/${basename(file)}`)
}

await run()

await import('./sponsors-circles')
