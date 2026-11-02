import type { Options } from '@lumirelle/linter-config'

/**
 * Linter options shared by ESLint and Oxlint.
 */
export const options = {
  unocss: true,
  vue: { a11y: true },
  // `.agents` and `.claude` vendor skills, and `pages` holds site content whose code blocks quote
  // deliberately broken examples.
  ignores: ['.agents/**', '.claude/**', 'pages/**'],
  overrides: {
    javascript: {
      rules: {
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'prefer-rest-params': 'off',
        'symbol-description': 'off',
      },
    },
    node: {
      rules: {
        'node/prefer-global/buffer': 'off',
        'node/prefer-global/process': 'off',
      },
    },
    typescript: {
      rules: {
        'prefer-rest-params': 'off',
        'ts/no-empty-object-type': 'off',
        'ts/no-unnecessary-type-constraint': 'off',
      },
    },
    // oxfmt lowercases hexadecimal digits, so the formatter owns this choice.
    // Upstream: https://github.com/oxc-project/oxc/issues/21949 (expected; disable the rule),
    // https://github.com/oxc-project/oxc/issues/27398 (lowercase option request).
    unicorn: {
      rules: {
        'unicorn/number-literal-case': 'off',
      },
    },
    // Formatting belongs to oxfmt; these template rules disagree with its Vue output.
    // Upstream: https://github.com/oxc-project/oxc/issues/18275 (expected; disable the rules).
    vue: {
      rules: {
        'vue/html-closing-bracket-newline': 'off',
        'vue/html-indent': 'off',
        'vue/html-self-closing': 'off',
        'vue/singleline-html-element-content-newline': 'off',
      },
    },
  },
} satisfies Options

/**
 * The per-file override both Emissions share: `plugins/` scripts are allowed to log.
 */
export const pluginsOverride = {
  name: 'project/plugins',
  files: ['plugins/**'],
  rules: {
    'no-console': 'off' as const,
  },
}
