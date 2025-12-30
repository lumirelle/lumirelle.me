import {
  createLocalFontProcessor,
} from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'bg-base': 'bg-white dark:bg-black',
      'color-base': 'text-black dark:text-white',
      'border-base': 'border-[#8884]',
    },
    [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
  ],
  rules: [
    [/^slide-enter-(\d+)$/, ([_, n]) => ({
      '--enter-stage': n,
    })],
    ['font-60%em', {
      'font-family': '\'Recursive\', \'Maple Mono CN\'',
      'font-variation-settings': '"MONO" 1, "CASL" 0, "wght" 400, "slnt" 0, "CRSV" 0.5',
    }],
  ],
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
        'sans': 'Inter',
        'mono': 'DM Mono',
        'condensed': 'Roboto Condensed',
        'wisper': 'Bad Script',
        '50%em': ['M PLUS Code Latin', 'Source Han Sans TC'],
        '_60%em': ['Maple Mono CN'],
      },
      processors: [
        createLocalFontProcessor(),
      ],
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  safelist: [
    'i-ri-menu-2-fill',
  ],
})
