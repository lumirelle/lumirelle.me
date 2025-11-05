---
title: 'Project Engineering: Categorize Your Dependencies'
date: 2025-11-01T16:06+08:00
update: 2025-11-01T16:06+08:00
lang: en
duration: 4min
type: blog+note
---

[[toc]]

## Introduction

As we use PNPM as our Node.js project's package manager, we can now categorize the dependencies by using PNPM catalogs.

So, now we have `testing` dependencies which are meant to be used for testing, and `dev` dependencies which are used for
development...

Here are two examples:

_A Vue frontend project:_

```yaml
catalogs:
  build:
    '@shikijs/markdown-it': ^3.14.0
    '@shikijs/transformers': ^3.14.0
    '@shikijs/twoslash': ^3.14.0
    '@unocss/preset-web-fonts': ^66.5.4
    '@vitejs/plugin-vue': ^6.0.1
    gray-matter: ^4.0.3
    markdown-it: ^14.1.0
    markdown-it-anchor: ^9.2.0
    markdown-it-footnote: ^4.0.0
    markdown-it-github-alerts: ^1.0.0
    markdown-it-link-attributes: ^4.0.1
    markdown-it-magic-link: ^0.1.4
    markdown-it-table-of-contents: ^1.1.0
    unocss: ^66.5.4
    unplugin-auto-import: ^20.2.0
    unplugin-icons: ^22.5.0
    unplugin-vue-components: ^30.0.0
    unplugin-vue-markdown: ^29.2.0
    unplugin-vue-router: ^0.16.1
    vite: ^7.1.12
    vite-plugin-inspect: ^11.3.3
    vite-plugin-optimize-exclude: ^0.0.1
    vite-ssg: ^28.2.2
    vite-svg-loader: ^5.1.0
  dev:
    '@antfu/eslint-config': ^6.2.0
    '@clack/prompts': ^0.11.0
    '@iconify/json': ^2.2.402
    '@octokit/core': ^7.0.6
    '@octokit/rest': ^22.0.1
    ansis: ^4.2.0
    czg: ^1.12.0
    degit: ^2.8.4
    diacritics: ^1.3.0
    eslint: ^9.39.0
    eslint-plugin-format: ^1.0.2
    exifreader: ^4.32.0
    fast-glob: ^3.3.3
    feed: ^5.1.0
    fs-extra: ^11.3.2
    lint-staged: ^16.2.6
    pathe: ^2.0.3
    pnpm: ^10.20.0
    rimraf: ^6.1.0
    sharp: 0.32.6
    simple-git: ^3.29.0
    simple-git-hooks: ^2.13.1
    taze: ^19.9.0
    tsx: ^4.20.6
    typescript: ~5.9.3
  frontend:
    '@antfu/utils': ^9.3.0
    '@unhead/vue': ^2.0.19
    '@unocss/reset': ^66.5.4
    '@vueuse/core': ^14.0.0
    d3-hierarchy: ^3.1.2
    d3-shape: ^3.2.0
    dayjs: ^1.11.19
    floating-vue: ^5.2.2
    matter-attractors: ^0.1.6
    matter-js: ^0.20.0
    nprogress: ^0.2.0
    pinia: ^3.0.3
    pixi.js: ^8.14.0
    shiki: ^3.14.0
    shiki-magic-move: ^1.2.1
    simplex-noise: ^4.0.3
    vue: ^3.5.22
    vue-router: ^4.6.3
    vue-router-better-scroller: ^0.0.0
  types:
    '@types/d3-hierarchy': ^3.1.7
    '@types/d3-shape': ^3.1.7
    '@types/degit': ^2.8.6
    '@types/diacritics': ^1.3.3
    '@types/fs-extra': ^11.0.4
    '@types/markdown-it': ^14.1.2
    '@types/markdown-it-link-attributes': ^3.0.5
    '@types/node': ^24.9.2
    '@types/nprogress': ^0.2.3

# ...
```

_A TypeScript library project:_

```yaml
catalogs:
  dev:
    '@antfu/eslint-config': ^6.2.0
    '@antfu/ni': ^27.0.1
    '@lumirelle/stylelint-config': ^1.0.4
    '@vitest/coverage-v8': ^4.0.6
    bumpp: ^10.3.1
    czg: ^1.12.0
    eslint: ^9.39.0
    eslint-plugin-format: ^1.0.2
    lint-staged: ^16.2.6
    simple-git-hooks: ^2.13.1
    stylelint: ^16.25.0
    taze: ^19.9.0
    tsdown: ^0.15.12
    tsx: ^4.20.6
    typescript: ^5.9.3
    vitest: ^4.0.6
  docs:
    '@iconify-json/svg-spinners': ^1.2.4
    '@shikijs/vitepress-twoslash': ^3.14.0
    '@unocss/reset': ^66.5.4
    '@vueuse/core': ^14.0.0
    floating-vue: ^5.2.2
    pinia: ^3.0.3
    unocss: ^66.5.4
    unplugin-vue-components: ^30.0.0
    vite-tsconfig-paths: ^5.1.4
    vitepress: ^2.0.0-alpha.12
    vitepress-plugin-group-icons: ^1.6.5
    vue: ^3.5.22
  inlined:
    '@antfu/utils': ^9.3.0
  prod:
    '@clack/prompts': ^0.11.0
    ansis: ^4.2.0
    c12: ^3.3.1
    cac: ^6.7.14
    consola: ^3.4.2
    defu: ^6.1.4
    pathe: ^2.0.3
    rc9: ^2.1.2
    tinyglobby: ^0.2.15
  testing:
    tinyexec: ^1.0.1
  types:
    '@types/node': ^24.9.2

# ...
```

## What's the best practice?

The meaning of categorizing your dependencies is to simplify the dependency management, so we shouldn't spend a lot of
time to categorize them clearly and exactly.

For example, you don't need to categorize dev dependencies into `linter`, `formatter`, and other more small pieces, just
put them together in the `dev` catalog, and that's quit enough.

But there are still some things worth to aware of:

- For a library project, we commonly categorize the dependencies into `dev`, `inlined`, `prod`, `testing`, `types` and
  `docs`.
- And for a frontend project, we are likely to categorize the dependencies into `dev`, `frontend`, `testing`, `types`
  and `build`.

The difference is caused by the usage scenarios for those dependencies.

For library projects:

- `inlined` dependencies are meant to be one of the `devDependencies`, and will be packed into our library package
  directly while building.
- `prod` dependencies are meant to be one of the `dependencies`, and will be installed by the users of our library
  package.
- `docs` dependencies are meant to be used for the documentation (which is a frontend sub-project inside our project) of
  our library package.

For frontend projects:

- `frontend` dependencies are the ones who will be used directly in the browser environment, such as Vue, React, etc.

  Production dependencies and inlined dependencies for library packages are more likely to be corresponding to this
  category.

- `build` dependencies are the ones who will modify the source code and produce the final output, such as Vite, Webpack,
  and their plugins, etc.

  For library packages, the builder will be recognized as `dev` dependencies, but for frontend projects, the builder and
  related packages are a huge part of dependencies, which are worth to be categorized into a separate category.

## Commonly `frontend` & `build` dependencies for frontend projects

Here are some commonly `frontend` & `build` dependencies for frontend projects:

`frontend` dependencies:

- UI Frameworks
  - `vue` and its ecosystem (e.g. `vue-router`, `pinia`, `vueuse`...)
  - `react` and its ecosystem (e.g. `react-router`...)
  - ...
- Business logic libraries
  - `dayjs`
  - `bignumber.js`
  - ...

`build` dependencies:

- Builders / Bundlers
  - `vite` and its ecosystem (e.g. `vite-plugin-inspect`, `vite-ssg`...)
  - `webpack` and its ecosystem (e.g. `webpack-dev-server`, `typescript-loader`...)
  - Unplugin ecosystem (common plugins for kinds of builders, e.g. `unplugin-auto-import`...)
  - ...
- Other ones who may modify the source
  - `nuxt` and its ecosystem (e.g. `@nuxt/image`, `@nuxtjs/i18n`...)
  - `unocss` and its ecosystem (e.g. `@unocss/preset-web-fonts`...)
  - `markdown-it` and its ecosystem (e.g. `markdown-it-anchor`, `markdown-it-footnote`...)
