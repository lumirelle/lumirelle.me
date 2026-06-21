import type { KnipConfig } from 'knip'

export default {
  entry: ['*.d.ts', 'data/**/*', 'demo/**/*', 'photos/**/*', 'scripts/**/*', 'src/**/*'],
  ignoreFiles: ['taze.config.ts'],
  ignoreDependencies: [
    '@iconify/json',
    '@lumirelle/oxlint-config',
    '@octokit/core',
    '@unhead/vue',
    'uno.css',
    'vue-tsc',
    'taze',
  ],
  ignoreUnresolved: [
    '~/types',
    '~/logics',
  ],
} satisfies KnipConfig
