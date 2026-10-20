import type { Token } from 'markdown-exit'
import matter from 'gray-matter'
import { MarkdownExit } from 'markdown-exit'

const WORDS_PER_MINUTE = 200
const CJK_CHARS_PER_MINUTE = 400

const WORD_REGEX = /[A-Z0-9][\w'’.-]*/gi
const CJK_REGEX = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g

// A bare instance on purpose: the site's markdown instance contributes tokens from its own
// plugins, which would make the count depend on which caller asked for it.
const markdown = new MarkdownExit()

interface Fragments {
  prose: string[]
  code: string[]
}

function collect(tokens: Token[], fragments: Fragments): void {
  for (const token of tokens) {
    if (token.type === 'inline')
      collect(token.children ?? [], fragments)
    else if (token.type === 'text')
      fragments.prose.push(token.content)
    else if (token.type === 'fence' || token.type === 'code_block' || token.type === 'code_inline')
      fragments.code.push(token.content)
  }
}

function count(fragment: string): { words: number, cjk: number } {
  return {
    words: fragment.match(WORD_REGEX)?.length ?? 0,
    cjk: fragment.match(CJK_REGEX)?.length ?? 0,
  }
}

/**
 * Estimated reading time of a markdown file, formatted as the `duration` frontmatter value.
 * Prose and code are both counted at `WORDS_PER_MINUTE`, CJK characters at `CJK_CHARS_PER_MINUTE`.
 */
export function readingTime(raw: string): string {
  const fragments: Fragments = { prose: [], code: [] }
  collect(markdown.parse(matter(raw).content, {}), fragments)

  const prose = count(fragments.prose.join(' '))
  const code = count(fragments.code.join(' '))
  const minutes = Math.max(
    1,
    Math.ceil(
      (prose.words + code.words) / WORDS_PER_MINUTE
      + (prose.cjk + code.cjk) / CJK_CHARS_PER_MINUTE,
    ),
  )

  return `${minutes}min`
}
