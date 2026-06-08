---
title: Project Create Manual
date: 2025-09-28T11:34+08:00
update: 2026-06-09T03:37+08:00
lang: en
duration: 1min
type: manual
---

[[toc]]

## Foreword

This is a manual for how to create a new project with specific tech stack.

## Prerequisites

- [Bun](https://bun.sh/) latest or [Node.js](https://nodejs.org/) LTS installed;
- `@sxzz/create` CLI tool with [configuration](https://github.com/lumirelle/dotfiles/blob/main/dot_config/create.config.yml).

## TypeScript Library

> TypeScript 6+

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Library` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />

## TypeScript Monorepo

> TypeScript 6+

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

> Vue 3+, Vite 8+

### `create-vue`

Use the `create-vue` CLI tool:

```bash
bun create vue <project-path>
```

### Vitesse Lite

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Vitesse Lite` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />

## Nuxt

> Nuxt 4+

### `create-nuxt`

```bash
bun create nuxt <project-path>
```

### Vitesse Nuxt

Use `@sxzz/create` CLI tool:

```bash
create <project-path>
```

And select the `Vitesse Nuxt` template in the startup prompt.

<img src="/posts/project-create-manual.png" alt="project-create-manual" style="width: 40%; height: auto;" />
