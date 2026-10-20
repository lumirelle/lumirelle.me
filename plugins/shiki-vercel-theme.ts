/**
 * Shiki themes built from the palette in lumirelle/vercel.nvim, so code on the
 * site and code in the editor speak the same colour language.
 *
 * The site keeps its monochrome structure — canvas, hairlines, ink levels — and
 * allows hue only where it carries meaning: syntax, and severity.
 *
 * Values are the `[900]` step of each scale, which is what vercel.nvim uses for
 * foreground accents (`colors.palette.<scale>[900]`).
 */

interface Palette {
  foreground: string
  comment: string
  blue: string
  green: string
  purple: string
  pink: string
  red: string
  amber: string
  teal: string
}

const light: Palette = {
  foreground: '#171717',
  comment: '#7d7d7d',
  blue: '#0068d6',
  green: '#297a3a',
  purple: '#7820bc',
  pink: '#bd2864',
  red: '#cb2a2f',
  amber: '#a35200',
  teal: '#067a6e',
}

const dark: Palette = {
  foreground: '#ededed',
  comment: '#7d7d7d',
  blue: '#52a8ff',
  green: '#62c073',
  purple: '#bf7af0',
  pink: '#f75f8f',
  red: '#ff6166',
  amber: '#f2a20d',
  teal: '#0ac7b4',
}

function theme(name: string, type: 'light' | 'dark', palette: Palette, background: string) {
  const { foreground: fg, comment, blue, green, purple, pink, red, teal, amber } = palette
  return {
    name,
    type,
    colors: {
      'editor.background': background,
      'editor.foreground': fg,
    },
    settings: [
      { settings: { foreground: fg, background } },
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: comment },
      },
      {
        // Strings read as values, so they get the value colour.
        scope: ['string', 'string.template', 'punctuation.definition.string', 'markup.inline.raw'],
        settings: { foreground: green },
      },
      {
        // Interpolations inside template strings are code again, not text.
        scope: ['meta.embedded.line.ts', 'punctuation.section.embedded'],
        settings: { foreground: fg },
      },
      {
        scope: ['constant.numeric', 'constant.language', 'constant.character.escape', 'support.constant'],
        settings: { foreground: blue },
      },
      {
        scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator', 'keyword.control'],
        settings: { foreground: pink },
      },
      {
        scope: [
          'entity.name.function',
          'support.function',
          'meta.function-call',
          'entity.name.type',
          'entity.name.class',
          'entity.name.namespace',
          'support.type',
          'support.class',
          'entity.other.inherited-class',
        ],
        settings: { foreground: purple },
      },
      {
        scope: [
          'meta.object-literal.key',
          'variable.other.property',
          'support.variable.property',
          'meta.property-name',
          'entity.name.tag.css',
        ],
        settings: { foreground: blue },
      },
      {
        scope: ['variable', 'variable.other', 'variable.parameter', 'identifier', 'punctuation', 'meta.brace'],
        settings: { foreground: fg },
      },
      {
        scope: ['entity.name.tag', 'punctuation.definition.tag', 'meta.tag'],
        settings: { foreground: green },
      },
      {
        scope: ['keyword.other.unit', 'constant.other.color.rgb-value', 'entity.name.tag.reference'],
        settings: { foreground: teal },
      },
      {
        scope: ['invalid', 'invalid.illegal', 'message.error'],
        settings: { foreground: red },
      },
      {
        scope: ['markup.deleted', 'punctuation.definition.deleted'],
        settings: { foreground: red },
      },
      {
        scope: ['markup.inserted', 'punctuation.definition.inserted'],
        settings: { foreground: green },
      },
      {
        scope: ['markup.changed', 'punctuation.definition.changed', 'markup.warning', 'message.warning'],
        settings: { foreground: amber },
      },
      {
        scope: ['entity.other.attribute-name'],
        settings: { foreground: amber },
      },
      {
        scope: ['support.type.property-name.json', 'support.type.property-name'],
        settings: { foreground: blue },
      },
      {
        scope: ['storage.type.function.arrow', 'keyword.control.directive'],
        settings: { foreground: pink },
      },
    ],
  }
}

export const vercelLight = theme('vercel-light', 'light', light, '#F6F6F6')
export const vercelDark = theme('vercel-dark', 'dark', dark, '#0D0D0D')
