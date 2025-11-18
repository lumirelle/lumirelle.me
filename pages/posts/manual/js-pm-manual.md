---
title: JavaScript Package Manager Manual
date: 2025-10-22T15:28+08:00
update: 2025-11-18T16:58+08:00
lang: en
duration: 4min
type: blog+note
---

[[toc]]

## JavaScript Package Managers

JavaScript has two kind of runtime environments:

- Server-side: Node.js, Bun, Deno, ...
- Client-side: Browser, ...

For the server-side, we have many package managers, like:

- [NPM](https://www.npmjs.com/)
- [PNPM](https://pnpm.io/)
- [Yarn](https://yarnpkg.com/)
- [Bun](https://bun.sh/)
- [Deno](https://deno.com/)
- ...

### Node.js

In most cases, we use Node.js as the server-side runtime environment.

NPM is the bundled package manager for Node.js, it is a good choice for legacy
environments, such as Node.js 18 or lower, but for modern environments, I
recommend using PNPM.

PNPM has many advantages over NPM, like:

- Faster installation
- Better dependency resolution
- Avoid ghost dependencies
- Monorepo support
- ...

### Bun & Deno

If you are using Bun or Deno, you may simply use the built-in package manager.

## Handle the Case of Different Package Managers

Of course, everyone has their own preferences, so you may have to face the case
of using different package managers in one project.

[@antfu/ni](https://github.com/antfu-collective/ni) is a tool that can help us
handle this case.

### Dependency Management

We can globally install `@antfu/ni` to handle the dependency management for us.

In the project folder, we can use `ni` to use the right package manager to
install the dependencies:

```sh
npm i @antfu/ni -g

# Whatever package manager this project is using, `ni` will automatically choose the right one,
# then install the dependencies.
cd <project-folder>
ni
```

We can use `nup` to upgrade the dependencies:

```sh
# Whatever package manager this project is using, `ni` will automatically choose the right one,
# then upgrade the dependencies.
cd <project-folder>
nup
```

We can also use `nd` to dedupe the dependencies:

```sh
# Whatever package manager this project is using, `ni` will automatically choose the right one,
# then dedupe the dependencies.
cd <project-folder>
nd
```

We can also use `ni`, `nun` to add/remove dependencies, the supported options
are just like the `install` command of the package manager:

```sh
# Whatever package manager this project is using, `ni` will automatically choose the right one,
# then add/remove the dependencies.
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

If we install it in our project, we can use `nr` to run the NPM scripts:

```sh
ni @antfu/ni -D
```

```json
{
  "scripts": {
    "prerelease": "nr test:run && nr typecheck", // nr <script>
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

For monorepo, we can use `-r` option with `nr` to run the script of all
sub-packages:

```json
{
  "scripts": {
    "build": "nr -r build" // nr -r <script>
  }
}
```

For change working directory to the sub-package, we can use `-C` option with
`nr`:

```json
{
  "scripts": {
    "build": "nr -C packages/core build" // nr -C <path> <script>
  }
}
```

We can also run the commands by using `nlx` or `na exec`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "na exec lint-staged" // `na exec` is equivalent to `nlx` here, but more recommended
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

If you are developing your own packages, you may want to publish them to the
package registry.

> [!Note]
>
> Because I just use NPM and PNPM in my projects, the following commands are
> only tested on NPM and PNPM.

### Login to the Package Registry

```sh
na login
  -> npm login
  -> pnpm login
  -> ...
```

### Publish Your Package

```sh
na publish
  -> npm publish
  -> pnpm publish
  -> ...
```

### Unpublish Your Package

```sh
na unpublish <package-name>
  -> npm unpublish <package-name>
  -> pnpm unpublish <package-name>
  -> ...
```

### Manage Package Version Tags

Remove a version tag from a package:

```sh
na dist-tag rm <package-name> <tag>
  -> npm dist-tag rm <package-name> <tag>
  -> pnpm dist-tag rm <package-name> <tag>
  -> ...
```

For example, if you want to remove the `beta` version tag from `@test/package`:

```sh
na dist-tag rm @test/package beta
  -> npm dist-tag rm @test/package beta
  -> pnpm dist-tag rm @test/package beta
  -> ...
```
