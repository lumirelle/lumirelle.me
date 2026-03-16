// string.js slugify drops non ascii chars so we have to
// use a custom implementation here
import { remove } from 'diacritics'

// oxlint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001F]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g
const rContinuos = /-{2,}/g
const rTrim = /^-+|-+$/g
const rStartNum = /^(\d)/

export function slugify(str: string): string {
  return (
    remove(str)
      // Remove control characters
      .replaceAll(rControl, '')
      // Replace special characters
      .replaceAll(rSpecial, '-')
      // Remove continuos separators
      .replaceAll(rContinuos, '-')
      // Remove prefixing and trailing separtors
      .replaceAll(rTrim, '')
      // ensure it doesn't start with a number (#121)
      .replace(rStartNum, '_$1')
      // lowercase
      .toLowerCase()
  )
}
