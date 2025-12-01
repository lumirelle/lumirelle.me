---
title: 'Project Engineering: Categorize Your Dependencies'
date: 2025-11-01T16:06+08:00
update: 2025-12-01T13:49+08:00
lang: en
duration: 3min
type: blog+note
---

[[toc]]

## Introduction

As we use PNPM as our Node.js project's package manager, we can now categorize the dependencies by using PNPM catalogs.

So, now we have `testing` dependencies which are meant to be used for testing, and `dev` dependencies which are used for development...

Here are two examples:

_A Vue frontend project:_

```yaml
catalogs:
  build:
    unocss: ^66.5.4
    unplugin-auto-import: ^20.2.0
    vite: ^7.1.12
    # ...
  dev:
    eslint: ^9.39.0
    lint-staged: ^16.2.6
    simple-git-hooks: ^2.13.1
    taze: ^19.9.0
    tsx: ^4.20.6
    typescript: ~5.9.3
    # ...
  frontend:
    '@antfu/utils': ^9.3.0
    dayjs: ^1.11.19
    vue: ^3.5.22
    vue-router: ^4.6.3
    # ...
  testing:
    '@vitest/coverage-v8': ^4.0.9
    '@vitest/ui': ^4.0.8
    '@vue/test-utils': ^2.4.6
    happy-dom: ^20.0.10
    playwright-core: ^1.56.1
    vitest: ^4.0.8
    # ...
  types:
    '@types/node': ^24.9.2
    # ...

# ...
```

_A TypeScript library project:_

```yaml
catalogs:
  dev:
    eslint: ^9.39.0
    lint-staged: ^16.2.6
    simple-git-hooks: ^2.13.1
    taze: ^19.9.0
    tsdown: ^0.15.12
    tsx: ^4.20.6
    typescript: ^5.9.3
    # ...
  docs:
    pinia: ^3.0.3
    unocss: ^66.5.4
    vitepress: ^2.0.0-alpha.12
    vue: ^3.5.22
    # ...
  inlined:
    '@antfu/utils': ^9.3.0
  prod:
    '@clack/prompts': ^0.11.0
    ansis: ^4.2.0
    c12: ^3.3.1
    cac: ^6.7.14
    consola: ^3.4.2
    # ...
  testing:
    '@vitest/coverage-v8': ^4.0.9
    '@vitest/ui': ^4.0.8
    vitest: ^4.0.8
    # ...
  types:
    '@types/node': ^24.9.2
    # ...

# ...
```

## What's the Best Practice?

The meaning of categorizing your dependencies is to simplify the dependency management, so we shouldn't spend a lot of time to categorize them clearly and exactly.

For example, you don't need to categorize dev dependencies into `linter`, `formatter`, and other more small pieces, just put them together in the `dev` catalog, and that's quit enough.

There are my personal opinions about the catalog names:

| Catalog Type                        | For Frontend Projects | For Library Projects |
| ----------------------------------- | --------------------- | -------------------- |
| builders/bundlers and their plugins | `build`               | `dev`                |
| development tools                   | `dev`                 | `dev`                |
| production dependencies             | `frontend`            | `prod`               |
| inlined dependencies                | --                    | `inlined`            |
| documentation                       | --                    | `docs`               |
| testing libraries                   | `testing`             | `testing`            |
| type definitions                    | `types`               | `types`              |

The difference is caused by the usage scenarios for those dependencies:

- **builders/bundlers and their plugins** are the ones who will modify the source code and produce the final output, such as Vite, Webpack, TSDown, etc.

  For frontend projects, the builder and related packages are a huge part of dependencies, which are worth to be categorized into a separate category.

  For library packages, the builder will be simply categorized as `dev` dependencies.

- **production dependencies** are the ones who will be used in the production environment.

  For frontend projects, it's the dependencies that will be used in the browser environment, so I call them `frontend` dependencies.

  For library packages, I call them `prod` dependencies.

- **inlined dependencies** and **documentation** are library-specific dependencies.

  Inlined dependencies are the ones that will be packed into the library package directly while building, and the users of the library package will not need to install them that's meaningless for frontend projects.

  What's more, no one will write documentation for frontend projects.
