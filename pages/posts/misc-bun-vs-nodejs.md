---
title: Bun vs Node.js
date: 2026-01-27T17:46+08:00
update: 2026-03-30T18:24+08:00
lang: en
duration: 2min
---

[[toc]]

> [!Note]
>
> This site is also running on Bun! Check out the [source code](https://github.com/lumirelle/lumirelle.me).

## Introduction

A few months ago, I decided to switch my main JavaScript / TypeScript runtime environment from [_Node.js_](https://nodejs.org/en) to [_Bun_](https://github.com/oven-sh/bun).


During these months, with the heavy usage of Bun, there are some experiences I would like to share.

## Why Bun?

### Native TypeScript Support

One of the most attractive features of Bun is its native _TypeScript_ support. You can run TypeScript files directly without any additional configuration or transpilation steps:

```bash
bun run ./scripts/some-script.ts
```

So we can drop the extra libraries like `ts-node` or `jiti` for running TypeScript files, which simplifies the development workflow and saves the disk.

### Powerful `run` Command

Bun's `run` command can run many things out of the box, like `package.json` scripts, source files, binaries from project packages and even system commands.

```bash
bun run lint

bun run ./scripts/some-script.ts

bun run eslint ./src

bun run ls
```

See the [official documentation](https://bun.com/docs/runtime#resolution-order) for more details.

### Incredible Performance

Bun has much faster dependency installation speed, much shorter cold start time, much better runtime performance than Node.js in most scenarios.

[Here](https://github.com/lumirelle/starter-ts/tree/main/benchmark) is a simple benchmark I did before.

### All in One Experience

Bun provides many built-in APIs that are not available in Node.js, such as _WebSocket_ support, _SQLite_ support and even more.

For example, on Bun, you can [parse YAML files](https://bun.com/docs/runtime/yaml) just like how you parse JSON files in Node.js:

```ts
import { YAML } from 'bun'

const yamlString = `
  name: Lumirelle
  age: 18
`
const data = YAML.parse(yamlString)
```

Even [create archive files programmatically](https://bun.com/docs/runtime/archive) like _ZIP_ and _TAR_ without extra libraries:

```ts
import { Archive, write } from 'bun'

const archive = new Archive({
  'hello.txt': 'Hello, World!',
  'data.json': JSON.stringify({ foo: 'bar' }),
  'nested/file.txt': 'Nested content',
})

// Write to disk
await write('bundle.tar', archive)
```

Also encryption, hashing, image manipulation, and more are supported natively by Bun.

All those features make Bun have a great all-in-one development experience.

See [the official documentation](https://bun.com/docs/runtime) for more runtime built-in APIs.

### Ecosystem Compatibility

Bun aims to be compatible with the _Node.js_ ecosystem, so most of the built-in APIs of Node.js are also available in Bun.

See [compatibility documentation](https://bun.com/docs/runtime/nodejs-compat) for more details.

## Bun Still Young, but Growing Fast!

Bun is still a young project.

It's written in _Zig_ -- another young programming language.

All of them have not made a stable release yet, and there are still some troubles and limitations when using Bun in real-world projects:

1. The missing compatibility for `node:inspector` breaks the test coverage feature of some testing frameworks;
2. The compatibility on _Windows_ is still very limited, due to Windows path syntax, because Windows uses backslashes `\` instead of forward slashes `/`.
3. ...

However, I'm very confident about its future. Let's keep an eye on Bun! 😊
