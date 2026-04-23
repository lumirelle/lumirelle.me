---
title: 'Project Engineering: Categorize Your Dependencies'
date: 2025-11-01T16:06+08:00
update: 2026-04-23T00:12+08:00
lang: en
duration: 3min
type: note
---

[[toc]]

## Introduction

In Node.js world, we use `dependencies` to declare the dependencies which are required for running our package, and `devDependencies` to declare the dependencies which are only required for development.

With the project size is growing up, simple `devDependencies` and `dependencies` are not enough to fit our needs to categorize them.

Thanks to the modern [JavaScript package managers](manual-js-pm), we have "catalogs" to handle this situation: We can categorize them by why we use them: We have `test` dependencies which are meant to be used for testing, and `dev` dependencies which are used for development...

Here are two examples (with Bun):

_A TypeScript library project:_

```json
{
  // ...

  "workspaces": {
    "catalogs": {
      // Production dependencies
      "prod": {
        // ...
      },
      // A devDependency which will be inlined into the final build output
      "inlined": {
        "@antfu/utils": "^9.3.0"
      },

      // Development dependencies
      "dev": {
        "bumpp": "^11.0.1",
        "simple-git-hooks": "git+https://github.com/toplenboren/simple-git-hooks.git#7625657"
      },
      // Type system support
      "types": {
        "@lumirelle/tsconfig": "^0.1.2",
        "@types/node": "^25.6.0",
        "bun-types": "^1.3.12",
        "typescript": "^6.0.2"
      },
      // Build tools
      "build": {
        "bunup": "^0.16.31"
      },
      // Code quality check tools
      "check": {
        "@antfu/eslint-config": "^8.2.0",
        "@arethetypeswrong/cli": "^0.18.2",
        "@lumirelle/oxlint-config": "^0.2.2",
        "eslint": "^10.2.0",
        "eslint-plugin-oxlint": "^1.60.0",
        "knip": "^6.4.1",
        "nano-staged": "^1.0.2",
        "oxlint": "^1.60.0",
        "oxlint-tsgolint": "^0.21.0",
        "publint": "^0.3.18"
      },
      // Testing tools
      "test": {
        "tsnapi": "^0.2.0"
      },

      // Documentation dependencies
      "docs": {
        "@iconify-json/svg-spinners": "^1.2.4",
        "@shikijs/vitepress-twoslash": "^4.0.2",
        "@unocss/reset": "^66.6.8",
        "@vueuse/core": "^14.2.1",
        "floating-vue": "^5.2.2",
        "pinia": "^3.0.4",
        "unocss": "^66.6.8",
        "unplugin-vue-components": "^32.0.0",
        "vite-tsconfig-paths": "^6.1.1",
        "vitepress": "^2.0.0-alpha.17",
        "vitepress-plugin-group-icons": "^1.7.5"
      }
    }
  }

  // ...
}
```

_A Nuxt application project:_

```jsonc
{
  // ...

  "workspaces": {
    "catalogs": {
      // Production dependencies
      // Used in browser, so we call it "frontend"
      "frontend": {
        "@antfu/utils": "^9.3.0",
        "@takumi-rs/core": "^1.0.16",
        "@vueuse/core": "^14.2.1",
        "pinia": "^3.0.4"
      },
      // Icons...
      "icons": {
        "@iconify-json/carbon": "^1.2.20",
        "@iconify-json/twemoji": "^1.2.5",
        "@iconify/utils": "^3.1.0"
      },

      // Development dependencies
      "dev": {
        "simple-git-hooks": "git+https://github.com/toplenboren/simple-git-hooks.git#7625657"
      },
      // Type system support
      "types": {
        "typescript": "^6.0.3"
      },
      // Build tools & it's modules
      "build": {
        "@nuxt/a11y": "^1.0.0-alpha.1",
        "@nuxt/eslint": "^1.15.2",
        "@nuxt/fonts": "^0.14.0",
        "@nuxt/hints": "^1.0.3",
        "@nuxt/image": "npm:@nuxt/image-nightly@2.0.1-20260305-121439-fd87f7d",
        "@nuxt/scripts": "^1.0.1",
        "@nuxt/test-utils": "^4.0.2",
        "@nuxtjs/color-mode": "^4.0.0",
        "@nuxtjs/i18n": "^10.2.4",
        "@nuxtjs/seo": "^5.1.3",
        "@pinia/nuxt": "^0.11.3",
        "@unocss/nuxt": "^66.6.8",
        "@vite-pwa/nuxt": "^1.1.1",
        "@vueuse/nuxt": "^14.2.1",
        "nuxt": "npm:nuxt-nightly@4.4.3-29608489.ff42fe25",
        "unocss": "^66.6.8"
      },
      // Code quality check tools
      "check": {
        "@antfu/eslint-config": "^8.2.0",
        "@lumirelle/oxlint-config": "^0.2.2",
        "@unocss/eslint-config": "^66.6.8",
        "eslint": "^10.2.1",
        "eslint-plugin-oxlint": "^1.61.0",
        "knip": "^6.6.1",
        "nano-staged": "^1.0.2",
        "oxlint": "^1.61.0",
        "oxlint-tsgolint": "^0.21.1",
        "vue-tsc": "^3.2.7"
      },
      // Testing tools
      "test": {
        "@vitest/coverage-v8": "^4.1.5",
        "@vue/test-utils": "^2.4.6",
        "happy-dom": "^20.9.0",
        "playwright-core": "^1.59.1",
        "std-env": "^4.1.0",
        "vitest": "^4.1.5"
      }
    }
  }

  // ...
}
```

## What's the Best Practice?

> Less is more.

The meaning of categorizing your dependencies is to simplify the dependency management, so we shouldn't spend a lot of time to categorize them clearly and exactly.

For example, you don't need to categorize dev dependencies into `linter`, `formatter`, and other small pieces, just put them together in the `check` catalog, and that's quit enough.

There are my personal opinions about the catalog names:

| Catalog For                                          | Name For Application Projects | Name For Library Projects |
| ---------------------------------------------------- | -------------------------- | ------------------------- |
| production dependencies                              | `frontend` and `backend`   | `prod`                    |
| inlined dependencies                                 | `frontend`                 | `inlined`                 |
| development tools                                    | `dev`                      | `dev`                     |
| type definitions                                     | `types`                    | `types`                   |
| builders/bundlers or others used during this process | `build`                    | `build`                   |
| code quality check libraries                         | `check`                    | `check`                   |
| testing libraries                                    | `test`                     | `test`                    |
| documentation used dependencies                      | --                         | `docs`                    |

The mainly difference between application projects and library packages are the following catalogs:

- **production dependencies** and **inlined dependencies** are the ones who will be used in the production environment.

  For application projects, **production dependencies** maybe used in `frontend` (browsers), or `backend` (servers), so we should divide them into two different catalogs to distinguish them.

  For library packages, everything is used in `backend`, we can simply call them `prod`.

- **documentation used dependencies** are library-specific dependencies. No one will write documentation for a application projects, right? 😄
