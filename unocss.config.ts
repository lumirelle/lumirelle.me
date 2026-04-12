import type { PresetWind3Theme } from 'unocss'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import { defineConfig, presetAttributify, presetIcons, presetWebFonts, presetWind3, transformerDirectives } from 'unocss'

export default defineConfig<PresetWind3Theme>({
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
    presetWind3(),
    presetWebFonts({
      fonts: {
        sans: 'Caslon',
        condensed: 'Roboto Condensed',
        wisper: 'Bad Script',
        mplus: 'M PLUS Code Latin',
      },
      processors: [createLocalFontProcessor()],
    }),
  ],
  theme: {
    fontFamily: {
      'mono': 'Drafting* Mono',
      'source-hans': 'Source Han Sans TC',
      'maple-mono': 'Maple Mono CN',
    },
  },
  transformers: [transformerDirectives()],

  rules: [
    [/^slide-enter-(\d+)$/, ([_, n]): Record<string, any> => ({ '--enter-stage': n })],
    ['font-50%em', { 'font-family': '"M PLUS Code Latin", "Source Han Sans TC"' }],
    ['font-60%em', { 'font-family': '"Drafting* Mono", "Maple Mono CN"' }],
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
