// oxlint-disable no-console

import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { load } from 'exifreader'
import { basename, join, parse } from 'pathe'
import sharp from 'sharp'
import { glob } from 'tinyglobby'
import { compressSharp } from './img-compress'

const folder = fileURLToPath(new URL('../photos', import.meta.url))

const files = (
  await glob('**/*.{jpg,png,jpeg}', {
    caseSensitiveMatch: false,
    absolute: true,
    cwd: fileURLToPath(new URL('../photos', import.meta.url)),
    expandDirectories: false,
  })
).toSorted((a, b) => a.localeCompare(b))

for (const filepath of files) {
  if (basename(filepath).startsWith('p-')) {
    continue
  }
  let writepath = filepath
  let { ext } = parse(filepath.toLowerCase())
  if (ext === '.jpeg') {
    ext = '.jpg'
  }
  const buffer = await fs.readFile(filepath)
  const img = sharp(buffer)
  const exif = load(buffer)

  let dateRaw = exif.DateTimeOriginal?.value ?? exif.DateTime?.value ?? exif.DateCreated.value
  dateRaw ||= new Date(await fs.stat(filepath).then(stat => stat.birthtime)).toISOString()
  if (Array.isArray(dateRaw)) {
    dateRaw = dateRaw[0] as string
  }
  // oxlint-disable-next-line typescript/no-base-to-string
  dateRaw = String(dateRaw)

  // convert 2025:02:02 10:07:10 to date object
  let date = new Date(
    dateRaw.replaceAll(':', (x, idx) => {
      if (idx < 10) {
        return '-'
      }
      return x
    }),
  )
  if (Number.isNaN(Number(date))) {
    date = new Date()
  }

  const timeDiff = Date.now() - Number(date)
  // 1 hour
  if (timeDiff < 1000 * 60 * 60) {
    console.warn(`Date of ${filepath} is too recent: ${dateRaw}`)
    continue
  }

  const base = `p-${date.toISOString().replaceAll(/[:.a-z]+/gi, '-')}`
  let index = 1
  while (existsSync(join(folder, `${base}${index}${ext}`.toLowerCase()))) {
    index++
  }
  writepath = join(folder, `${base}${index}${ext}`.toLowerCase())

  const { outBuffer, percent, outFile } = await compressSharp(img, buffer, filepath, writepath)
  if (outFile !== filepath || percent > -0.1) {
    await fs.writeFile(outFile, outBuffer)
  }
  if (outFile !== filepath) {
    await fs.unlink(filepath)
  }
}
