---
title: 'Project Engineering: Categorize Your Dependencies'
date: 2025-11-01T16:06+08:00
update: 2026-01-06T17:05+08:00
lang: en
duration: 3min
type: blog+note
---

[[toc]]

## Introduction

With the project size is growing up, we have to face the case of managing a large number of dependencies. `devDependencies` and `dependencies` are not enough to fit our needs.

Thanks to the modern [JavaScript package managers](/posts/manual/js-pm-manual), we have "catalogs" to handle this situation: We can categorize them by why we use them: We have `testing` dependencies which are meant to be used for testing, and `dev` dependencies which are used for development...

Here are two examples (using Bun):

_A Nuxt frontend project:_

```jsonc
{
  // ...

  "workspaces": {
    "catalogs": {
      "build": {
        "@nuxt/eslint": "^1.12.1",
        "@nuxt/fonts": "^0.12.1",
        "@nuxt/hints": "^1.0.0-alpha.4",
        "@nuxt/image": "npm:@nuxt/image-nightly@2.0.1-20251126-104656-db87207",
        "@nuxt/test-utils": "^3.20.1",
        "@nuxtjs/color-mode": "^4.0.0",
        "@nuxtjs/device": "^4.0.0",
        "@nuxtjs/i18n": "^10.2.1",
        "@nuxtjs/seo": "^3.3.0",
        "@pinia/nuxt": "^0.11.3",
        "@unocss/eslint-config": "^66.5.9",
        "@unocss/nuxt": "^66.5.9",
        "@vite-pwa/nuxt": "^1.1.0",
        "@vueuse/nuxt": "^14.1.0",
        "dayjs-nuxt": "^2.1.11",
        "nuxt": "^4.2.2",
        "nuxt-echarts": "^1.0.1",
        "nuxt-qrcode": "^0.4.8",
        "nuxt-swiper": "^2.0.1",
        "nuxt-typed-router": "^4.0.2",
        "unocss": "^66.5.9",
        "unplugin-vue-router": "^0.19.1"
      },
      "dev": {
        "@antfu/eslint-config": "^6.7.1",
        "eslint": "^9.39.2",
        "eslint-plugin-format": "^1.0.2",
        "lint-staged": "^16.2.7",
        "simple-git-hooks": "git+https://github.com/toplenboren/simple-git-hooks.git#7625657",
        "typescript": "^5.9.3",
        "vue-tsc": "^3.1.8"
      },
      "frontend": {
        "@antfu/utils": "^9.3.0",
        "@vueuse/core": "^14.1.0",
        "dayjs": "^1.11.19",
        "echarts": "^6.0.0",
        "pinia": "^3.0.4",
        "vue": "^3.5.25",
        "vue-echarts": "^8.0.1"
      },
      "icons": {
        "@iconify-json/carbon": "^1.2.14",
        "@iconify-json/twemoji": "^1.2.4",
        "@iconify/utils": "^3.1.0"
      },
      "testing": {
        "@vitest/coverage-v8": "^3.2.4",
        "@vitest/ui": "^3.2.4",
        "@vue/test-utils": "^2.4.6",
        "happy-dom": "^20.0.11",
        "playwright-core": "^1.57.0",
        "std-env": "^3.10.0",
        "vitest": "^3.2.4"
      }
    }
  }

  // ...
}
```

_A TypeScript library project:_

```json
{
  // ...

  "workspaces": {
    "catalogs": {
      "build": {
        "@arethetypeswrong/core": "^0.18.2",
        "publint": "^0.3.16",
        "tsdown": "^0.18.4"
      },
      "dev": {
        "@antfu/eslint-config": "^6.7.3",
        "bumpp": "^10.3.2",
        "eslint": "^9.39.2",
        "eslint-plugin-format": "^1.1.0",
        "knip": "^5.78.0",
        "lint-staged": "^16.2.7",
        "simple-git-hooks": "git+https://github.com/toplenboren/simple-git-hooks.git#7625657",
        "typescript": "^5.9.3"
      },
      "inlined": {
        "@antfu/utils": "^9.3.0"
      },
      "testing": {
        "vitest-package-exports": "^1.1.1"
      },
      "types": {
        "@types/bun": "^1.3.5"
      }
    }
  }

  // ...
}
```

## What's the Best Practice?

The meaning of categorizing your dependencies is to simplify the dependency management, so we shouldn't spend a lot of time to categorize them clearly and exactly.

For example, you don't need to categorize dev dependencies into `linter`, `formatter`, and other small pieces, just put them together in the `dev` catalog, and that's quit enough.

There are my personal opinions about the catalog names:

| Catalog For                                          | Name For Frontend Projects | Name For Library Projects |
| ---------------------------------------------------- | -------------------------- | ------------------------- |
| builders/bundlers or others used during this process | `build`                    | `build`                   |
| development tools                                    | `dev`                      | `dev`                     |
| production dependencies                              | `frontend` and `backend`   | `prod`                    |
| inlined dependencies                                 | `frontend`                 | `inlined`                 |
| documentation used dependencies                      | --                         | `docs`                    |
| testing libraries                                    | `testing`                  | `testing`                 |
| type definitions                                     | `types`                    | `types`                   |

The mainly difference between frontend projects and library packages are the following catalogs:

- **production dependencies** and **inlined dependencies** are the ones who will be used in the production environment.

  For frontend projects, **production dependencies** maybe used in `frontend` (browsers), or `backend` (servers), so we should divide them into two different catalogs to distinguish them.

  For library packages, everything is used in `backend`, we can simply call them `prod`.

- **documentation used dependencies** are library-specific dependencies. No one will write documentation for a frontend projects, right? 😄
