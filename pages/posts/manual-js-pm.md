---
title: JavaScript Package Manager Manual
date: 2025-10-22T15:28+08:00
update: 2026-07-20T10:27+08:00
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

- [NPM](https://www.npmjs.com/): Built-in package manager of _Node.js_;
- [PNPM](https://pnpm.io/)
- [Yarn](https://yarnpkg.com/)
- [Bun](https://bun.sh/): Built-in package manager of _Bun_;
- [Deno](https://deno.com/): Built-in package manager of _Deno_;
- [Aube](https://aube.en.dev/)
- ⭐ [Nub](https://nubjs.com/): Powered by _Aube_;
- ...

### Why Nub?

As a package manager, nub has follwing advantegers:

- Faster installation
- Disk space efficient
- Use existing lockfiles
- Better dependency resolution
- Stronger monorepo support
- Isolated `node_modules` structure, avoiding ghost dependencies
- Ignore `postinstall` scripts by default, avoiding potential security risks
- ...

On the other hand, it is a powerful tool to make _Node.js_ run TypeScript file out-of-box.

## Manage Your Own Packages

If you are developing your own packages, you may want to publish them to the package registry.

> [!Note]
>
> As NPM classical tokens is already revoked, it's recommended to publish your packages using workflows. See [the related blog](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/).
>
> For the first release, you should still login manually by command: `npm login`. NPM CLI will automatically open the browser for you to login, and then you can publish your package using `nub publish` command.

### Login to the Package Registry

```sh
npm login
```

### Publish Your Package

```sh
nub publish
# Or
pnpm publish
# Or
npm publish
# ...
```

### Unpublish Your Package

```sh
nub unpublish <package-name>
# Or
pnpm unpublish <package-name>
# Or
npm unpublish <package-name>
# ...
```

### Manage Package Version Tags

Remove a version tag from a package:

```sh
nub dist-tag rm <package-name> <tag>
# Or
npm dist-tag rm <package-name> <tag>
# Or
pnpm dist-tag rm <package-name> <tag>
# ...
```

For example, if you want to remove the `beta` version tag from `@test/package`:

```sh
nub dist-tag rm @test/package beta
# Or
npm dist-tag rm @test/package beta
# Or
pnpm dist-tag rm @test/package beta
# ...
```
