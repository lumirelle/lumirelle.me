---
title: 'Project Engineering: Categorize Your Dependencies'
date: 2025-11-01T16:06+08:00
update: 2026-01-27T09:51+08:00
lang: en
duration: 3min
type: blog+note
---

[[toc]]

## Introduction

With the project size is growing up, we have to face the case of managing a large number of dependencies. `devDependencies` and `dependencies` are not enough to fit our needs.

Thanks to the modern [JavaScript package managers](/posts/manual/js-pm-manual), we have "catalogs" to handle this situation: We can categorize them by why we use them: We have `test` dependencies which are meant to be used for testing, and `dev` dependencies which are used for development...

Here are two examples (using Bun):

_A Nuxt frontend project:_

```jsonc
{
  // ...

  "workspaces": {
    "catalogs": {
      "frontend": {
        "@antfu/utils": "^9.3.0",
        "@vueuse/core": "^14.1.0",
        "dayjs": "^1.11.19",
        "echarts": "^6.0.0",
        "pinia": "^3.0.4",
        "vue": "^3.5.27",
        "vue-echarts": "^8.0.1"
      },
      // Extracted from "frontend", as we may have a lot of icons dependencies
      "icons": {
        "@iconify-json/carbon": "^1.2.18",
        "@iconify-json/twemoji": "^1.2.5",
        "@iconify/utils": "^3.1.0"
      },
      "backend": {
        // ...
      },

      "dev": {
        "simple-git-hooks": "git+https://github.com/toplenboren/simple-git-hooks.git#7625657",
        "typescript": "^5.9.3",
        "vue-tsc": "^3.2.4"
      },

      "types": {
        // ...
      },

      "build": {
        "@nuxt/eslint": "^1.13.0",
        "@nuxt/fonts": "^0.13.0",
        "@nuxt/hints": "^1.0.0-alpha.5",
        "@nuxt/image": "npm:@nuxt/image-nightly@2.0.1-20251225-125234-23b8cef",
        "@nuxt/test-utils": "^3.23.0",
        "@nuxtjs/color-mode": "^4.0.0",
        "@nuxtjs/device": "^4.0.0",
        "@nuxtjs/i18n": "^10.2.1",
        "@nuxtjs/seo": "^3.3.0",
        "@pinia/nuxt": "^0.11.3",
        "@unocss/eslint-config": "^66.6.0",
        "@unocss/nuxt": "^66.6.0",
        "@vite-pwa/nuxt": "^1.1.0",
        "@vueuse/nuxt": "^14.1.0",
        "dayjs-nuxt": "^2.1.11",
        "nuxt": "^4.3.0",
        "nuxt-echarts": "^1.0.1",
        "nuxt-qrcode": "^0.4.8",
        "nuxt-swiper": "^2.0.1",
        "nuxt-typed-router": "^4.0.2",
        "unocss": "^66.6.0",
        "unplugin-vue-router": "^0.19.2"
      },

      "check": {
        "@antfu/eslint-config": "^7.2.0",
        "eslint": "^9.39.2",
        "eslint-plugin-format": "^1.3.1",
        "lint-staged": "^16.2.7"
      },

      "test": {
        "@vitest/coverage-v8": "^4.0.18",
        "@vue/test-utils": "^2.4.6",
        "happy-dom": "^20.3.9",
        "playwright-core": "^1.58.0",
        "std-env": "^3.10.0",
        "vitest": "^4.0.18"
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
      "prod": {
        // ...
      },
      // A devDependency which will be inlined into the final build output
      "inlined": {
        "@antfu/utils": "^9.3.0"
      },

      "dev": {
        "bumpp": "^10.4.0",
        "simple-git-hooks": "git+https://github.com/toplenboren/simple-git-hooks.git#7625657",
        "typescript": "^5.9.3"
      },

      "types": {
        "@types/bun": "^1.3.6"
      },

      "build": {
        "bunup": "^0.16.20"
      },

      "check": {
        "@antfu/eslint-config": "^7.2.0",
        "@arethetypeswrong/cli": "^0.18.2",
        "eslint": "^9.39.2",
        "eslint-plugin-format": "^1.3.1",
        "knip": "^5.82.1",
        "lint-staged": "^16.2.7",
        "publint": "^0.3.17"
      },

      "test": {
        "vitest-package-exports": "^1.1.2"
      },

      "docs": {
        "@iconify-json/svg-spinners": "^1.2.4",
        "@shikijs/vitepress-twoslash": "^3.21.0",
        "@unocss/reset": "^66.5.12",
        "@vueuse/core": "^14.1.0",
        "floating-vue": "^5.2.2",
        "pinia": "^3.0.4",
        "unocss": "^66.5.12",
        "unplugin-vue-components": "^31.0.0",
        "vite-tsconfig-paths": "^6.0.5",
        "vitepress": "^2.0.0-alpha.15",
        "vitepress-plugin-group-icons": "^1.7.1",
        "vue": "^3.5.27"
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
| production dependencies                              | `frontend` and `backend`   | `prod`                    |
| inlined dependencies                                 | `frontend`                 | `inlined`                 |
| development tools                                    | `dev`                      | `dev`                     |
| type definitions                                     | `types`                    | `types`                   |
| builders/bundlers or others used during this process | `build`                    | `build`                   |
| code quality check libraries                         | `check`                    | `check`                   |
| testing libraries                                    | `test`                     | `test`                    |
| documentation used dependencies                      | --                         | `docs`                    |

The mainly difference between frontend projects and library packages are the following catalogs:

- **production dependencies** and **inlined dependencies** are the ones who will be used in the production environment.

  For frontend projects, **production dependencies** maybe used in `frontend` (browsers), or `backend` (servers), so we should divide them into two different catalogs to distinguish them.

  For library packages, everything is used in `backend`, we can simply call them `prod`.

- **documentation used dependencies** are library-specific dependencies. No one will write documentation for a frontend projects, right? 😄
