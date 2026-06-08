import type { KnipConfig } from 'knip'

export default {
  entry: ['*.d.ts', 'data/**/*', 'demo/**/*', 'photos/**/*', 'scripts/**/*', 'src/**/*'],
  ignoreDependencies: [
    '@iconify/json',
    '@lumirelle/oxlint-config',
    '@octokit/core',
    '@unhead/vue',
    'uno.css',
    'vue-tsc',
  ],
  ignoreBinaries: ['which', 'localhost', 'mkcert'],
  ignoreUnresolved: [
    '~/types',
    '~/logics',
  ],
} satisfies KnipConfig
