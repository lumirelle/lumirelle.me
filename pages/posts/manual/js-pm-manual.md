---
title: JavaScript Package Manager Manual
date: 2025-10-22T15:28+08:00
update: 2026-01-26T16:28+08:00
lang: en
duration: 5min
type: blog+note
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
- ...

### Bun & Deno

If you are using Bun or Deno, you may simply use the built-in package manager.

### Node.js

If you are using Node.js as the server-side runtime environment:

NPM is the bundled package manager for Node.js, it is a good choice for legacy environments, such as Node.js 18 or lower, but for modern environments, I recommend using PNPM.

PNPM has many advantages over NPM, like:

- Faster installation
- Better dependency resolution
- Avoid ghost dependencies
- Monorepo support
- ...

> [!Note]
>
> You can also use `bun` as the package manager for Node.js.
>
> But as Bun is still in active development, some features may not be stable enough than PNPM.

## Handle the Case of Different Package Managers

If you are facing the case of using different package managers in different projects, [@antfu/ni](https://github.com/antfu-collective/ni) is a tool that can help us handle this case.

> [!Note]
>
> As bun and deno are also supported by this package, you can even use it to achieve cross-runtime package management.

If you are using multiple package managers in one project, make sure you know [the default detect strategy](https://github.com/antfu-collective/package-manager-detector/blob/main/src/detect.ts#L61) of `@antfu/ni` (uses `package-manager-detector` under the hood):

1. lockfile [(Source)](https://github.com/antfu-collective/package-manager-detector/blob/main/src/constants.ts#L13-L23)
   1. `bun.lock` & `bun.lockb` -> Bun
   2. `deno.lock` -> Deno
   3. `pnpm-lock.yaml` & `pnpm-workspace.yaml` -> PNPM
   4. `yarn.lock` -> Yarn
   5. `package-lock.json` -> NPM
   6. `npm-shrinkwrap.json` -> NPM
2. package.json `packageManager` field
3. package.json `devEngines` field

### Dependency Management

It's recommended to globally install `@antfu/ni`.

Under the project folder, we can use `nci` to use the right package manager to clean install the dependencies (Clean install is enabled in PNPM and Bun by default, even if you are using normal `ni`/`pnpm install`/`bun install` command):

```sh
# Use Bun as example:
bun i @antfu/ni -g

# Whatever package manager this project is using, `nci` will automatically choose
# the right one, then clean install the dependencies.
cd <project-folder>
nci
```

We can use `nup` to upgrade the dependencies:

```sh
# Whatever package manager this project is using, `nup` will automatically choose
# the right one, then upgrade the dependencies.
cd <project-folder>
# For Bun, -r: recursive, -i: interactive,
# these parameters are determined by the corresponding package manager
nup -ri
```

We can also use `nd` to dedupe the dependencies:

> [!Warning]
>
> `Bun` currently not support deduping dependencies.
>
> See https://github.com/oven-sh/bun/issues/1343.

```sh
# Whatever package manager this project is using, `nd` will automatically choose
# the right one, then dedupe the dependencies.
cd <project-folder>
nd
```

We can also use `ni`, `nun` to add/remove dependencies, the supported options are just like the `install` command of the corresponding package manager:

```sh
# Whatever package manager this project is using, `ni` will automatically choose
# the right one, then add/remove the dependencies.
#
# Supported options:
# -g: Globally operate
# -D: Save as dev dependency
# -E: Save as exact version
# ...
cd <project-folder>
ni <dependency> [-g] [-D] [-E] ...
nun <dependency> [-g] ...
```

### Run Scripts & Commands

If we install `@antfu/ni` in our project, we can use `nr` to run the NPM scripts for better compatibility:

```sh
ni @antfu/ni -D
```

```jsonc
{
  "scripts": {
    // nr <script>, whatever package manager this project is using
    "prerelease": "nr test:run && nr typecheck",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

The same as other commands, the supported options are just like the `run` command of the corresponding package manager.

So check the supported options by running `<package-manager> run --help`.

We can also run the commands by using `nlx`:

```jsonc
{
  "simple-git-hooks": {
    // `na exec` is equivalent to `nlx` here, but more recommended.
    // As PNPM and Bun support omit `exec` command, we can use `na lint-staged` directly for those two package managers.
    "pre-commit": "nlx lint-staged"
  }
}
```

At the end, we can use `na`, which is just an agent for the package manager:

```sh
na exec <command>
  -> npm exec <command>
  -> pnpm exec <command>
  -> yarn exec <command>
  -> bun exec <command>
  -> deno exec <command>
  -> ...

na run <command>
  -> npm run <command>
  -> pnpm run <command>
  -> yarn run <command>
  -> bun run <command>
  -> deno task <command>
  -> ...
```

## Manage Your Own Packages

If you are developing your own packages, you may want to publish them to the package registry.

> [!Note]
>
> As NPM classical tokens is already revoked, it's recommended to publish your packages using workflows. See [the related blog](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/). But for the first time, you still publish your package manually by command like: `npm login && na publish --tag latest`.
>
> After the first time publishing, as `bun publish` not supports trusted publishing currently, the workaround is to build the tarball using `bun pm pack --filename <filename>` and publish it using `bunx npm publish --access public`. See the example in [my workflow configs](https://github.com/lumirelle/workflows/blob/main/.github/workflows/release.yml).

### Login to the Package Registry

```sh
na login
  -> npm login
  -> pnpm login
  # Bun shared the login state (tokens in .npmrc) with npm,
  # so you should use `npm login` instead
  -> ...
```

### Publish Your Package

```sh
na publish
  -> npm publish
  -> pnpm publish
  -> bun publish
  -> ...
```

### Unpublish Your Package

```sh
na unpublish <package-name>
  -> npm unpublish <package-name>
  -> pnpm unpublish <package-name>
  # The same as login, you should use `npm unpublish`
  # to unpublish your packages published by Bun
  -> ...
```

### Manage Package Version Tags

Remove a version tag from a package:

```sh
na dist-tag rm <package-name> <tag>
  -> npm dist-tag rm <package-name> <tag>
  -> pnpm dist-tag rm <package-name> <tag>
  # The same as login, you should use `npm dist-tag rm`
  # to remove version tags for your packages published by Bun
  -> ...
```

For example, if you want to remove the `beta` version tag from `@test/package`:

```sh
na dist-tag rm @test/package beta
  -> npm dist-tag rm @test/package beta
  -> pnpm dist-tag rm @test/package beta
  -> ...
```
