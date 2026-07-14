import type { KnipConfig } from 'knip'

export default {
  entry: [
    'scripts/copy-fonts.ts',
    'scripts/rss.ts',
    'scripts/copy-sponsors.ts',
    'scripts/redirects.ts',
    'scripts/copy-dist-redirects.ts',
    'scripts/img-compress-staged.ts',
    'scripts/photos-manage.ts',

    // TODO: It's included in tsconfig.app.json, but knip doesn't seem to pick it up
    '*.d.ts',
  ],
  ignoreFiles: [
    'temp/**',
    'taze.config.ts',
  ],
  ignoreDependencies: [
    // Build tools
    'premove',

    // Frontend libraries
    '@iconify/json',
    '@octokit/core',
    '@unhead/vue',
    'uno.css',

    // Check tools
    '@lumirelle/oxlint-config',
    '@seepine/vue-tsc',

    // Dependencies manager
    'taze',

  ],
} satisfies KnipConfig
