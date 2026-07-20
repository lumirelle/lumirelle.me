---
title: Project Create Manual
date: 2025-09-28T11:34+08:00
update: 2026-07-20T10:16+08:00
lang: en
duration: 1min
type: manual
---

[[toc]]

## Foreword

This is a manual for how to create a new project with specific tech stack.

## TypeScript Library

> TypeScript 6+

```nu
git clone --depth=1 git@github.com:lumirelle/starter-ts.git {{project-path}}
rm -rf {{project-path}}/.git
```

## TypeScript Monorepo

> TypeScript 6+

```nu
git clone --depth=1 git@github.com:lumirelle/starter-monorepo.git {{project-path}}
rm -rf {{project-path}}/.git
```

## VS Code Extension

```nu
git clone --depth=1 git@github.com:antfu/starter-vscode.git {{project-path}}
rm -rf {{project-path}}/.git
```

## Vue

> Vue 3+, Vite 8+

Use the `create-vue` CLI tool:

```bash
# If you are using mise just like me:
mise exec github:nubjs/nub -- nub create vue {{project-path}}
# Or you are using nub directly:
nub create vue {{project-path}}
# PNPM:
pnpm create vue {{project-path}}
# NPM:
npm create vue {{project-path}}
# ...
```

## Nuxt

```nu
git clone --depth=1 git@github.com:lumirelle/starter-vitesse-nuxt.git {{project-path}}
rm -rf {{project-path}}/.git
```
