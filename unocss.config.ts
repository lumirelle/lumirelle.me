import type { PresetWind4Theme } from 'unocss'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import { defineConfig, presetAttributify, presetIcons, presetWebFonts, presetWind4, transformerDirectives } from 'unocss'

export default defineConfig<PresetWind4Theme>({
  presets: [
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetAttributify(),
    presetWind4(),
    presetWebFonts({
      fonts: {
        // Standards
        'serif': 'Fraunces',
        'sans': 'Inter Tight',
        'mono': {
          name: '"Annotation Mono"',
          provider: 'none',
        },
        // Strict 62.5%em Group
        'maple-mono-wr-cn': {
          name: '"Maple Mono WR CN"',
          provider: 'none',
        },
        'annotation-mono': {
          name: '"Annotation Mono"',
          provider: 'none',
        },
        // Strict 62%em Group
        'maple-mono-wd-cn': {
          name: '"Maple Mono WD CN"',
          provider: 'none',
        },
        '0xproto': {
          name: '"0xProto"',
          provider: 'none',
        },
        // Strict 60%em Group
        'maple-mono-cn': {
          name: '"Maple Mono CN"',
          provider: 'none',
        },
        'geist-mono': 'Geist Mono',
        'drafting-mono': {
          name: '"Drafting* Mono"',
          provider: 'none',
        },
        'recursive': {
          name: '"Recursive"',
          provider: 'none',
        },
        // Strict 50%em Group
        'source-han-sans-tc': {
          name: '"Source Han Sans TC"',
          provider: 'none',
        },
        'm-plus-code-latin': 'M PLUS Code Latin',
      },
      processors: [createLocalFontProcessor()],
    }),
  ],
  transformers: [transformerDirectives()],

  rules: [
    // Font family rules, without nerd symbols
    ['font-62.5%em', { 'font-family': '"Annotation Mono", "Maple Mono WR CN", monospace' }],
    ['font-62%em', { 'font-family': '"0xProto", "Maple Mono WD CN", monospace' }],
    ['font-60%em', { 'font-family': '"Geist Mono", "Maple Mono CN", monospace' }],
    ['font-50%em', { 'font-family': '"M PLUS Code Latin", "Source Han Sans TC", monospace' }],
    ['font-casual', { 'font-family': '"Comic Mono", "Maple Mono CN", monospace' }],
    ['font-recursive', { 'font-family': '"Recursive", "Maple Mono CN"', 'font-variation-settings': '\'MONO\' 1, \'CASL\' 0, \'wght\' 400, \'slnt\' 0, \'CRSV\' 0.5' }],
    ['font-recursive-without-mono', { 'font-family': '"Recursive", "Maple Mono CN"', 'font-variation-settings': '\'CASL\' 0, \'wght\' 400, \'slnt\' 0, \'CRSV\' 0.5' }],
    // Animation rules
    [/^slide-enter-(\d+)$/, ([_, n]): Record<string, any> => ({ '--enter-stage': n })],
  ],
  safelist: ['i-ri-menu-2-fill'],
  shortcuts: [
    {
      'bg-base': 'bg-white dark:bg-black',
      'color-base': 'text-black dark:text-white',
      'border-base': 'border-[#8884]',
    },
    [
      /^btn-(\w+)$/,
      ([_, color]): string =>
        `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`,
    ],
  ],
})
