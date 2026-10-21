import type { MarkdownExit, StateInline } from 'markdown-exit'

/**
 * Inline code blocks for contexts that cannot hold a fence — table cells, mostly.
 *
 * A table cell is parsed as inline content, so a ``` fence inside one is either
 * kept as literal text (and tears the row apart line by line) or silently splits
 * the cell. This rule renders the snippet through the very same Shiki hook the
 * fences use (`md.options.highlight`), so the theme, the CSS variables and the
 * annotations stay identical.
 *
 * The bracket holds a comma-separated spec: the language first, then optional
 * flags. Blocks wear the same terminal window as the fences — one look for code
 * everywhere — and `plain` drops the window for a bare, chrome-less block.
 *
 * A table row is a single source line, and the row is split on pipes before
 * inline parsing, hence the escapes — `\n` for a line break, `\|` for a literal
 * pipe:
 *
 * ```md
 * | Chezmoi | :code[powershell]{winget add twpayne.chezmoi}      | window  |
 * | Winutil | :code[powershell,plain]{irm "…" \| iex}            | plain   |
 * | Multi   | :code[bash]{echo a\necho b}                        | `\n`    |
 * ```
 *
 * `\\`, `\{` and `\}` are escapes too; anything else after a backslash is left
 * alone, so `\d` in a regex or `C:\Users` survives untouched.
 */
const INLINE_CODE_RE = /^:code\[([^\]]*)\]\{([^}]*)\}/

const ESCAPES: Record<string, string> = {
  '\\': '\\',
  'n': '\n',
  '{': '{',
  '}': '}',
  '|': '|',
}

function unescapeCell(source: string): string {
  return source.replace(/\\([\s\S])/g, (raw, char: string) => ESCAPES[char] ?? raw)
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, char => `&#${char.charCodeAt(0)};`)
}

export function InlineCodeBlockPlugin(md: MarkdownExit): void {
  md.inline.ruler.before('backticks', 'inline_code_block', (state: StateInline, silent: boolean) => {
    const match = state.src.slice(state.pos).match(INLINE_CODE_RE)
    if (!match)
      return false

    if (!silent) {
      const spec = (match[1] ?? '').split(',').map(part => part.trim()).filter(Boolean)
      const [lang = '', ...flags] = spec
      const token = state.push('inline_code_block', '', 0)
      token.info = lang || 'text'
      token.content = unescapeCell(match[2] ?? '')
      // `md.options.highlight` forwards these attrs to Shiki as `meta.__raw`,
      // where `codeWindow()` looks for `no-window`.
      token.meta = flags.includes('plain') ? 'no-window' : ''
    }

    state.pos += match[0].length
    return true
  })

  // `renderAsync()` awaits render rules, so the async highlighter is usable here.
  md.renderer.rules.inline_code_block = async (tokens, idx, _options, env) => {
    const token = tokens[idx]
    if (!token)
      return ''

    const highlight = md.options.highlight
    if (!highlight)
      return `<code>${escapeHtml(token.content)}</code>`

    return await highlight(token.content, token.info, token.meta ?? '', env)
  }
}
