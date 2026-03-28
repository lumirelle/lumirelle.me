import fs from 'node:fs'
import { argv } from 'node:process'

const p = argv[2]

if (!p) {
  console.error('Usage: node trim-space-and-dash-md-table.ts <file>')
  process.exit(1)
}

const regSpace = /^(\s*)\|(.+)\|\s*$/
const regCell = /^:?-{2,}:?$/
const s = fs.readFileSync(p, 'utf8')
const out = s.split(/\r?\n/).map((line) => {
  const m = line.match(regSpace)
  if (m?.[1] == null || !m[2])
    return line
  const indent = m[1]
  const cells = m[2].split('|').map(c => c.trim()).map((c) => {
    if (regCell.test(c)) {
      const left = c.startsWith(':') ? ':' : ''
      const right = c.endsWith(':') ? ':' : ''
      return `${left}--${right}`
    }
    return c
  })
  return `${indent}| ${cells.join(' | ')} |`
}).join('\n')
fs.writeFileSync(p, out, 'utf8')
