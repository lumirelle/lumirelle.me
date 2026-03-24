import fs from 'node:fs/promises'

async function run(): Promise<void> {
  await fs.cp('_dist_redirects', 'dist/_redirects', { force: true })
}

await run()
