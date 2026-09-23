---
title: Project Create Manual
date: 2025-09-28T11:34+08:00
update: 2026-09-21T16:37+08:00
lang: en
duration: 1min
type: manual
group: Web
order: 7
---

[[toc]]

## Foreword

This is a manual for how to create a new project with a specific tech stack.

## Prerequisites

The [`degit` CLI](https://npmx.dev/package/degit).

## TypeScript Library

> TypeScript 7+

```nu
degit git@github.com:lumirelle/starter-ts.git {{project-path}}
```

## TypeScript Monorepo

> TypeScript 7+

```nu
degit git@github.com:lumirelle/starter-monorepo.git {{project-path}}
```

## VS Code Extension

```nu
degit git@github.com:antfu/starter-vscode.git {{project-path}}
```

## Vue

> Vue 3+, Vite 7, TypeScript 5

Use the `create-vue` CLI tool:

```nu
degit https://github.com/antfu-collective/vitesse-lite {{project-path}}
```

## Nuxt

> Vue 3+, Vite 8+, TypeScript 7+

```nu
degit git@github.com:lumirelle/starter-vitesse-nuxt.git {{project-path}}
```
