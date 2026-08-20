import type { MarkdownExit, StateBlock } from 'markdown-exit'

const PREVIEW_RE = /^preview(?:[ \t]+(\S.*))?$/

export function PreviewPlugin(md: MarkdownExit): void {
  md.block.ruler.before('fence', 'preview', (state: StateBlock, startLine: number, endLine: number, silent: boolean) => {
    const start = state.bMarks[startLine]! + state.tShift[startLine]!
    const lineEnd = state.eMarks[startLine]!

    if (state.src.charCodeAt(start) !== 0x3A)
      return false

    let pos = start
    for (let i = 0; i < 3; i++) {
      if (state.src.charCodeAt(pos) !== 0x3A)
        return false
      pos++
    }

    const params = state.src.slice(pos, lineEnd).trim()
    const match = params.match(PREVIEW_RE)
    if (!match)
      return false

    if (silent)
      return true

    const style = match[1]?.trim() ?? ''
    const openTag = style
      ? `<CodePreview head-style="${style}">`
      : '<CodePreview>'

    let nextLine = startLine + 1
    let depth = 1

    while (nextLine < endLine) {
      const nextStart = state.bMarks[nextLine]! + state.tShift[nextLine]!
      const nextEnd = state.eMarks[nextLine]!
      const nextContent = state.src.slice(nextStart, nextEnd).trim()

      if (/^:::preview(?:[ \t]+(?:\S.*)?)?$/.test(nextContent)) {
        depth++
      }
      else if (nextContent === ':::') {
        depth--
        if (depth === 0)
          break
      }
      nextLine++
    }

    if (depth !== 0)
      return false

    const contentStart = state.bMarks[startLine + 1]
    const contentEnd = state.bMarks[nextLine]

    const token = state.push('html_block', '', 0)
    token.map = [startLine, nextLine + 1]
    token.content = `${openTag}\n${state.src.slice(contentStart, contentEnd).trimEnd()}\n</CodePreview>`

    state.line = nextLine + 1
    return true
  })
}
