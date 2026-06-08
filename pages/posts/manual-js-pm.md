---
title: JavaScript Package Manager Manual
date: 2025-10-22T15:28+08:00
update: 2026-06-09T03:56+08:00
lang: en
duration: 2min
type: manual
---

[[toc]]

## JavaScript Package Managers

JavaScript has two kind of runtime environments:

- Server-side: Node.js, Bun, Deno, ...
- Client-side: Browser, ...

For the server-side, we have `node_modules` with plenty of packages which can run on our device. There are also many package managers, like:

- [NPM](https://www.npmjs.com/)
- [PNPM](https://pnpm.io/)
- [Yarn](https://yarnpkg.com/)
- [Bun](https://bun.sh/)
- [Deno](https://deno.com/)
- ⭐ [Aube](https://aube.en.dev/)
- ...

### Why Aube?

- Faster installation
- Disk space efficient
- Use existing lockfiles
- Better dependency resolution
- Stronger monorepo support
- Isolated `node_modules` structure, avoiding ghost dependencies
- Ignore `postinstall` scripts by default, avoiding potential security risks
- ...

## Manage Your Own Packages

If you are developing your own packages, you may want to publish them to the package registry.

> [!Note]
>
> As NPM classical tokens is already revoked, it's recommended to publish your packages using workflows. See [the related blog](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/). But for the first time, you should still login manually by command: `npm login`. NPM CLI will automatically open the browser for you to login, and then you can publish your package using `na publish` command.
>
> After the first time publishing, as `bun publish` not supports trusted publishing currently, the workaround is to build the tarball using `bun pm pack --filename <filename>` and publish it using `npm publish --access public`. See the example in [my workflow configs](https://github.com/lumirelle/workflows/blob/main/.github/workflows/release.yml).
>
> Notice, do not call `npm publish` with `bunx`, `nlx` or any other agent, this may break the login state when we using them with trusted publising.

### Login to the Package Registry

```sh
na login
  -> npm login
  -> pnpm login
  -> aube login
  -> ...
```

### Publish Your Package

```sh
na publish
  -> npm publish
  -> pnpm publish
  -> aube publish
  -> ...
```

### Unpublish Your Package

```sh
na unpublish <package-name>
  -> npm unpublish <package-name>
  -> pnpm unpublish <package-name>
  -> aube unpublish <package-name>
  -> ...
```

### Manage Package Version Tags

Remove a version tag from a package:

```sh
na dist-tag rm <package-name> <tag>
  -> npm dist-tag rm <package-name> <tag>
  -> pnpm dist-tag rm <package-name> <tag>
  -> aube dist-tag rm <package-name> <tag>
  # The same as login, you should use `npm dist-tag rm`
  # to remove version tags for your packages published by Bun
  -> ...
```

For example, if you want to remove the `beta` version tag from `@test/package`:

```sh
na dist-tag rm @test/package beta
  -> npm dist-tag rm @test/package beta
  -> pnpm dist-tag rm @test/package beta
  -> aube dist-tag rm @test/package beta
  -> ...
```
