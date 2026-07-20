---
title: 'Project Engineering: Monorepo Dependencies Management'
date: 2025-11-01T16:06+08:00
update: 2026-07-20T12:01+08:00
lang: en
duration: 2min
type: note
---


<style>
.prose table thead, .prose table tbody {
  display: block;
}
.prose table tr {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
}
.prose table td {
  overflow-x: auto;
}
</style>

[[toc]]

## Introduction

If you are working on a **"monorepo"**, you may have got in trouble with dependencies version management before: Each time you want to change the version of a shared dependency, you need to modify every place it has been referenced.

Thanks to the modern [JavaScript package managers](manual-js-pm), we have **"workspace"** & **"catalogs"** (or "catalog", a unified catalog without explicit name) to handle this situation: You can define & use a catalog reference instead of plain version specifier.

For example:

```json
{
  // ...
  "workspaces": {
    "packages": [
      "docs",
      "playground",
      "packages/*"
    ],
    "catalogs": {
      "dev": {
        "taze": "^19.14.1"
      },
      "prod": {
        // ...
      },
      "types": {
        "@lumirelle/tsconfig": "^0.1.6",
        "@types/node": "^26.1.1",
        "typescript": "^6.0.3"
      },
      "build": {
        "tsdown": "^0.22.9"
      },
      "docs": {
        "@iconify-json/svg-spinners": "^1.2.4",
        "@shikijs/vitepress-twoslash": "^4.3.1",
        "@unocss/reset": "^66.7.5",
        "@vueuse/core": "^14.3.0",
        "floating-vue": "^5.2.2",
        "oxc-minify": "^0.140.0",
        "pinia": "^4.0.2",
        "unocss": "^66.7.5",
        "unplugin-vue-components": "^32.1.0",
        "vite": "^8.1.5",
        "vitepress": "^2.0.0-alpha.18",
        "vitepress-plugin-group-icons": "^1.7.5",
        "vue": "^3.5.40"
      },
      "check": {
        "@antfu/eslint-config": "^9.1.0",
        "@arethetypeswrong/cli": "^0.18.5",
        "@lumirelle/oxlint-config": "^0.13.0",
        "eslint": "^10.7.0",
        "eslint-plugin-oxlint": "^1.73.0",
        "knip": "^6.27.0",
        "oxlint": "^1.74.0",
        "oxlint-tsgolint": "^0.25.0",
        "publint": "^0.3.21"
      },
      "test": {
        "@vitest/coverage-v8": "^4.1.10",
        "tsnapi": "^1.0.0",
        "vitest": "^4.1.10"
      },
      "release": {
        "bumpp": "^11.1.0",
        "changelogithub": "^14.0.0",
        "pkg-pr-new": "^0.0.78"
      }
    }
  }

  // ...
}
```

## What's the Best Practice for Workspace?

### Prefer "catalogs" than "catalog"

With **"catalogs"**, you can categorize your dependencies into different groups, which is much better for management.

### Less is More

The meaning of categorizing your dependencies is to simplify the dependency management, so we shouldn't spend a lot of time to categorize them clearly and exactly.

For example, you don't need to categorize dev dependencies into `linter`, `formatter`, and other small pieces, just put them together in the `check` catalog, and that's quit enough.

There are my personal opinions about the catalog names:

| Catalog for                       | Catalog Name for Web Applications  | Catalog Name for Libraries        |
| --------------------------------- | ---------------------------------- | --------------------------------- |
| Production dependencies           | `frontend` and `backend`           | `prod`                            |
| Inlined dependencies              | `frontend`                         | `inlined`                         |
| Development tools                 | `dev`                              | `dev`                             |
| Type system and third party types | `types`                            | `types`                           |
| Build tools and their plugins     | `build`                            | `build`                           |
| Check tools                       | `check`                            | `check`                           |
| Testing tools                     | `test`                             | `test`                            |
| Documentation dependencies        | --                                 | `docs`                            |
