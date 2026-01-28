---
title: Project Create Manual
date: 2025-09-28T11:34+08:00
update: 2026-01-14T14:26+08:00
lang: en
duration: 2min
type: note
---

[[toc]]

## Foreword

This is a manual for how to create a new project with specific tech stack.

## Prerequisites

- [Bun](https://bun.sh/) latest installed.
- <details>
  <summary>`@sxzz/create` CLI tool (if capable)</summary>

  Install:

  ```bash
  npm install -g @sxzz/create
  ```

  Configuration (_~/create.config.yml_):

  ```yaml
  git:
    add: true
  templates:
    - name: Library
      url: lumirelle/starter-ts
      git:
        init: false
    - name: Monorepo
      url: lumirelle/starter-monorepo
      git:
        init: false
    - name: VS Code
      url: antfu/starter-vscode
      git:
        init: false
    - name: Vitesse Lite
      url: antfu-collective/vitesse-lite
      git:
        init: false
    - name: Vitesse Nuxt
      url: lumirelle/starter-vitesse-nuxt
      git:
        init: false
  ```

  </details>

## JS/TS Library

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Library` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />

## JS/TS Monorepo

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Monorepo` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />

## VS Code Extension

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `VS Code` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />

## Vue

### `create-vue` (Vue 3 + Vite + TypeScript)

Use the `create-vue` CLI tool:

```bash
bun create vue <project-path>
```

### `create-vue@legacy` (Vue 2 + Vite + JavaScript)

Use the `create-vue` CLI tool:

```bash
bun create vue@legacy <project-path>
```

### Vitesse Lite (Vue 3 + Vite + TypeScript)

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Vitesse Lite` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />

## Nuxt

### `nuxi` (Nuxt 4 + Vite + TypeScript)

```bash
bun create nuxi <project-path>
```

### `create-nuxt-app@^5` (Nuxt 2 + Webpack + JavaScript)

> [!Note]
>
> Since the version of 6, `create-nuxt-app` using `nuxi` under the hood, so it will create Nuxt 4 project not Nuxt 2 project!

```bash
bun create nuxt-app@^5 <project-path>
```

### Vitesse Nuxt (Nuxt 4 + Vite + TypeScript)

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Vitesse Nuxt` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />
