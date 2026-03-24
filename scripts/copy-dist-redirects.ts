import fs from 'node:fs/promises'

async function run(): Promise<void> {
  await fs.copyFile('_dist_redirects', 'dist/_redirects')
}

await run()
