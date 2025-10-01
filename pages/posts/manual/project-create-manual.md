---
title: Project Create Manual
date: 2025-09-28T11:34+08:00
update: 2025-09-28T11:34+08:00
lang: en
duration: 2min
type: blog+note
---

[[toc]]

## Foreword

This is a manual for how to create a new project with specific tech stack.

## Prerequisites

- Node.js (v18+ recommended)
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
create
```

And select the `Library` template in the startup prompt.

![project-create-manual](/public/posts/project-create-manual.png)

## JS/TS Monorepo

Use `@sxzz/create` CLI tool:

```bash
cd <folder/to/hold/your/project>
create
```

And select the `Monorepo` template in the startup prompt.

![project-create-manual](/public/posts/project-create-manual.png)

## VS Code Extension

Use `@sxzz/create` CLI tool:

```bash
cd <folder/to/hold/your/project>
create
```

And select the `VS Code` template in the startup prompt.

![project-create-manual](/public/posts/project-create-manual.png)

## Vue

### Vitesse Lite (Vue 3 + Vite + TypeScript)

Use `@sxzz/create` CLI tool:

```bash
cd <folder/to/hold/your/project>
create
```

And select the `Vitesse Lite` template in the startup prompt.

![project-create-manual](/public/posts/project-create-manual.png)

### Vue CLI (Vue 3 + Webpack + JavaScript)

Use the Vue CLI tool:

```bash
npm i @vue/cli@latest -g

cd <folder/to/hold/your/project>
vue create project-name
```

Then, select **Vue 3 preset** in the startup prompt.

### `create-vue` (Vue 2 + Vite + JavaScript)

Use the `create-vue` CLI tool:

```bash
cd <folder/to/hold/your/project>
npm create vue@legacy
```

### Vue CLI (Vue 2 + Webpack + JavaScript)

Use the Vue CLI tool:

```bash
npm i @vue/cli@latest -g

cd <folder/to/hold/your/project>
vue create project-name
```

Then, select **Vue 2 preset** in the startup prompt.

## Nuxt

### Vitesse Nuxt (Nuxt 3 + Vite + TypeScript)

Use `@sxzz/create` CLI tool:

```bash
cd <folder/to/hold/your/project>
create
```

And select the `Vitesse Nuxt` template in the startup prompt.

![project-create-manual](/public/posts/project-create-manual.png)

### `create-nuxt-app` (Nuxt 2 + Webpack + JavaScript)

> [!Note]
>
> Since the version of 6, `create-nuxt-app` using `nuxi` under the hood, so it will create Nuxt 3 project not Nuxt 2
> project!

```bash
cd <folder/to/hold/your/project>
npm create nuxt-app@^5 <project-name>
```
