import fs from 'node:fs/promises'

async function run() {
  await fs.cp('public/assets/fonts', 'dist/assets/fonts', { recursive: true, force: true })
}

await run()
