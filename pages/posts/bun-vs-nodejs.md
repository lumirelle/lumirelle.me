---
title: Bun vs. Node.js
date: 2026-01-27T17:46+08:00
update: 2026-01-27T17:46+08:00
lang: en
duration: 2min
---

[[toc]]

> [!Note]
>
> This site is also running on Bun! Check out the [source code](https://github.com/lumirelle/lumirelle.me).

## Introduction

A few months ago, I decided to switch my main JavaScript/TypeScript runtime environment from Node.js to Bun.

During these months, with the heavy usage of Bun, there are some experiences I would like to share.

## Native TypeScript Support

One of the most attractive features of Bun is its native TypeScript support. You can run TypeScript files directly without any additional configuration or transpilation steps:

```bash
bun run ./scripts/some-script.ts
```

So we can drop the extra libraries like `ts-node` or `jiti` for running TypeScript files, which simplifies the development workflow and saves the disk.

## Powerful `run` Command

Bun's `run` command can run many things out of the box, like `package.json` scripts, source files, binaries from project packages and even system commands.

```bash
bun run lint

bun run ./scripts/some-script.ts

bun run eslint ./src

bun run ls
```

See the [official documentation](https://bun.com/docs/runtime#resolution-order) for more details.

## Incredible Performance

Bun has much faster dependency installation speed, much shorter cold start time, much better runtime performance than Node.js in most scenarios.

[Here](https://github.com/lumirelle/starter-ts/tree/main/benchmark) is a simple benchmark I did before.

## Various Built-in API & All in One

Bun provides many built-in APIs that are not available in Node.js by default, such as a built-in HTTP server, WebSocket support, and more.

You can [parse YAML files](https://bun.com/docs/runtime/yaml) like you parse JSON files in Node.js before:

```ts
import { YAML } from 'bun'

const yamlString = `
  name: Lumirelle
  age: 18
`
const data = YAML.parse(yamlString)
```

Even [make archive files](https://bun.com/docs/runtime/archive) like ZIP and TAR without extra libraries:

```ts
const archive = new Bun.Archive({
  'hello.txt': 'Hello, World!',
  'data.json': JSON.stringify({ foo: 'bar' }),
  'nested/file.txt': 'Nested content',
})

// Write to disk
await Bun.write('bundle.tar', archive)
```

Also encryption, hashing, image manipulation, and more are all supported natively in Bun.

See [the official documentation](https://bun.com/docs/runtime) for more runtime built-in APIs.

## Ecosystem Compatibility

Bun aims to be compatible with the Node.js ecosystem, so most of the built-in APIs in Node.js are also available in Bun.

See [Bun's Node.js compatibility documentation](https://bun.com/docs/runtime/nodejs-compat) for more details.

## Troubles and Limitations

As we all know, Bun is still a young project, and there are still some troubles and limitations when using Bun in real-world projects.

For example, when you using Bun runtime with `vitest --coverage`, the missing support for `node:inspector` breaks the coverage feature.

However, the Bun team is actively working on improving compatibility and adding new features, so we can expect these issues to be resolved in the future.

Just keep an eye on [Bun](https://github.com/oven-sh/bun)! 😊
