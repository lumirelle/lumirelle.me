---
title: JavaScript Package Manager Manual
date: 2025-10-22T15:28+08:00
update: 2026-09-21T10:32+08:00
lang: en
type: manual
group: Web
order: 4
---

[[toc]]

## JavaScript Package Managers

JavaScript has two kinds of runtime environments:

- Server-side: Node.js, Bun, Deno, ...
- Client-side: Browser, ...

For the server-side, we have `node_modules` with plenty of packages that can run on our device. There are also many package managers, like:

- [NPM](https://www.npmjs.com/): Built-in package manager of _Node.js_;
- [PNPM](https://pnpm.io/)
- [Yarn](https://yarnpkg.com/)
- [Bun](https://bun.sh/): Built-in package manager of _Bun_;
- [Deno](https://deno.com/): Built-in package manager of _Deno_;
- [Aube](https://aube.en.dev/)
- ⭐ [Nub](https://nubjs.com/): Powered by _Aube_;
- ...

### Why Nub?

As a package manager, Nub has the following advantages:

- Faster installation
- Efficient disk space usage
- Support for existing lockfiles
- Better dependency resolution
- Stronger monorepo support
- Isolated `node_modules` structure, avoiding ghost dependencies
- Ignore `postinstall` scripts by default, avoiding potential security risks
- ...

On the other hand, it is a powerful tool that makes _Node.js_ run TypeScript files out of the box.

## Manage Your Own Packages

If you are developing your own packages, you may want to publish them to the package registry.

> [!Note]
> The package registry we mentioned here is standing for NPM.
>
> There are also other package registry for JavaScript, such as [JSR](https://jsr.io/).

### Login to the Package Registry

```nu
npm login
```

### Publish Your Package


As NPM classic tokens have already been revoked, it's recommended to publish your packages using trusted publisher, such as GitHub Actions, GitLab CI/CD, CircleCI. See [the related blog](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/) and [NPM trusted publishing guide](https://docs.npmjs.com/trusted-publishers#supported-cicd-providers).

Specifically, for the first release, you should log in manually to the package registry. The CLI tool will automatically open the browser for you to complete the remaining steps (such as 2FA verification), and then save the token to `~/.npmrc`:

```nu
npm login
```

After that, you can check your login status by `npm whoami`, and publish your package with `{your_package_manager} publish`. Generally, we will publish an empty package as placeholder (empty dist), with version `0.0.0`.

```nu
npm whoami
```

```nu
nub publish
# Or
pnpm publish
# Or
npm publish
# ...
```

After the first release, you can use `npm trust` to setup the trusted publisher, writing code, implement features, and finally trigger your release CI/CD workflow to make the real first release (usually with version `0.0.1`).

```nu
npm trust --file path/to/your/ci/workflow --allow-publish --allow-stage-publish
```

```nu
# I use bumpp to update the version field in package.json,
# make release commit with a version tag `vx.y.z`,
# and push to the origin (interactive).
bumpp
```

### Unpublish Your Package

```nu
nub unpublish {package_name}
# Or
pnpm unpublish {package_name}
# Or
npm unpublish {package_name}
# ...
```

### Manage Package Version Tags

Remove a version tag from a package:

```nu
nub dist-tag rm {package_name} {tag}
# Or
npm dist-tag rm {package_name} {tag}
# Or
pnpm dist-tag rm {package_name} {tag}
# ...
```

For example, if you want to remove the `beta` version tag from `@test/package`:

```nu
nub dist-tag rm @test/package beta
# Or
npm dist-tag rm @test/package beta
# Or
pnpm dist-tag rm @test/package beta
# ...
```

### Deprecate Your Package

Deprecate the entire package (all of the released versions):

```nu
nub deprecate {package_name} "Deprecate message."
# Or
npm deprecate {package_name} "Deprecate message."
# Or
pnpm deprecate {package_name} "Deprecate message."
```

Deprecate a specific version of the package:

```nu
nub deprecate {package_name}@{version} "Deprecate message."
# Or
npm deprecate {package_name}@{version} "Deprecate message."
# Or
pnpm deprecate {package_name}@{version} "Deprecate message."
```
