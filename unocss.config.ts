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
        sans: 'Inter',
        mono: 'DM Mono',
        condensed: 'Roboto Condensed',
        wisper: 'Bad Script',
        percent50: ['M PLUS Code Latin', 'Source Han Sans TC'],
        percent60: [
          /**
           * UnoCSS only supports WGHT property currently. It recognizes `Recursive:MONO@1` as `Recursive:wght@MONO@1` if it receives a plain string, and `Recursive` as the font family name.
           *
           * We use object syntax to avoid this behavior. As the cost, UnoCSS will use 'Recursive:MONO@1' as the font name.
           *
           * To fix this, we use a custom processor below to replace the font-family name in the generated CSS.
           *
           * @see {@link https://github.com/unocss/unocss/blob/main/packages-presets/preset-web-fonts/src/preset.ts#L26}
           */
          {
            name: 'Recursive:MONO@1',
          },
          'Maple Mono CN',
        ],
      },
      processors: [
        createLocalFontProcessor(),
        /**
         * Use a custom processor to replace the font-family name.
         */
        {
          transformCSS(css) {
            return Promise.resolve(css.replace(/font-family: 'Recursive'/g, 'font-family: \'Recursive:MONO@1\''))
          },
        },
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
