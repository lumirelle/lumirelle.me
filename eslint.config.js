// @ts-check
import { antfu } from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    unocss: true,
    vue: { a11y: true },
    toml: {
      overrides: {
        'toml/array-element-newline': ['error', 'consistent'],
        'toml/array-bracket-spacing': ['error', 'never'],
      },
    },
  },
  ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
)
  .removeRules(
    'no-labels',
    'no-lone-blocks',
    'no-restricted-syntax',
    'node/prefer-global/buffer',
    'node/prefer-global/process',
    'prefer-rest-params',
    'symbol-description',
    'ts/ban-types',
    'ts/no-empty-object-type',
    'ts/no-invalid-this',
    'ts/no-unnecessary-type-constraint',
  )
