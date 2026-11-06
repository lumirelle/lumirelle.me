import type { PresetWind4Theme } from 'unocss'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
} from 'unocss'

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
        'sans': 'Geist',
        'serif': 'Geist Serif',
        'mono': 'Geist Mono',
        // Strict 60%em Group
        'geist-mono': 'Geist Mono',
        'maple-mono-cn': {
          name: '"Maple Mono CN"',
          provider: 'none',
        },
        'recursive': {
          name: '"Recursive"',
          provider: 'none',
        },
      },
      processors: [createLocalFontProcessor()],
    }),
  ],
  transformers: [transformerDirectives()],

  // Colour and radius are published by `src/styles/tokens.css`: the utilities
  // resolve the custom property, so the value flips with the colour scheme
  // instead of being baked into every rule that mentions it.
  theme: {
    colors: {
      canvas: 'var(--color-canvas)',
      surface: 'var(--color-surface)',
      stroke: 'var(--color-stroke)',
      ink: {
        DEFAULT: 'var(--color-ink)',
        strong: 'var(--color-ink-strong)',
        faint: 'var(--color-ink-faint)',
      },
    },
    radius: {
      control: 'var(--radius-control)',
      window: 'var(--radius-window)',
    },
  },

  rules: [
    // Without nerd symbols
    ['font-code', { 'font-family': '"Geist Mono", "Maple Mono CN", monospace' }],
    [
      'font-recursive',
      {
        'font-family': '"Recursive", "Maple Mono CN"',
        'font-variation-settings': "'MONO' 1, 'CASL' 0, 'wght' 400, 'slnt' 0, 'CRSV' 0.5",
      },
    ],
    [
      'font-recursive-without-mono',
      {
        'font-family': '"Recursive", "Maple Mono CN"',
        'font-variation-settings': "'CASL' 0, 'wght' 400, 'slnt' 0, 'CRSV' 0.5",
      },
    ],
    // Animation rules
    [/^slide-enter-(\d+)$/, ([_, n]): Record<string, any> => ({ '--enter-stage': n })],
  ],
  shortcuts: [
    {
      // Thin aliases kept for existing templates: the value still comes from
      // the token layer, so there is exactly one place a scheme is resolved.
      'bg-base': 'bg-canvas',
      'color-base': 'text-ink-strong',
    },
    [
      /^btn-(\w+)$/,
      ([_, color]): string =>
        `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-stroke! rounded`,
    ],
  ],
})
