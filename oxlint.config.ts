// @ts-check
import { oxlint } from '@lumirelle/linter-config/oxlint'
import { options, pluginsOverride } from './linter.config.ts'

export default oxlint(options)
  .append(pluginsOverride)
  // eslint-plugin-unused-imports runs as a JS plugin, so it does not see template usage and would
  // report (and `--fix` remove) bindings that only a template uses. Oxlint's native rule does see
  // the template, so single-file components fall back to it.
  // Upstream: https://github.com/oxc-project/oxc/issues/15761 (Vue support),
  // https://github.com/oxc-project/oxc/issues/20465 (JS plugins only see the extracted script),
  // https://github.com/oxc-project/oxc/discussions/21936 (language plugins, the planned fix).
  .append({
    name: 'project/vue-unused-vars',
    files: ['**/*.vue'],
    rules: {
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  })
