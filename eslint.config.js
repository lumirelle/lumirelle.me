// @ts-check
import { antfu } from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    stylistic: false,
  },
  ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
)
  .override('antfu/perfectionist/setup', {
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          environment: 'bun',
          groups: [
            'type-import',
            ['type-parent', 'type-sibling', 'type-index', 'type-internal'],
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect',
            'ts-equals-import',
            'unknown',
          ],
          newlinesBetween: 'ignore',
          newlinesInside: 'ignore',
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  })
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

    // ...
    'unicorn/number-literal-case',
    'vue/html-indent',
    'vue/html-closing-bracket-newline',
    'vue/html-self-closing',
    'vue/singleline-html-element-content-newline',
  )
