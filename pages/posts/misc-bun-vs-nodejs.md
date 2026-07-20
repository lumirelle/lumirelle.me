---
title: Bun vs. Node.js
date: 2026-01-27T17:46+08:00
update: 2026-07-20T10:49+08:00
lang: en
duration: 4min
---

[[toc]]

## Introduction

A few months ago (around December, 2025), I decided to switch my main JavaScript / TypeScript runtime environment from [_Node.js_](https://nodejs.org/en) to [_Bun_](https://github.com/oven-sh/bun).

During these months, with the heavy usage of Bun, there are some experiences I would like to share.

## Why I Want to Try Bun?

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

References:

- [jsrbench](https://github.com/hexagon/jsrbench)
- [A simple benchmark I did before](https://github.com/lumirelle/starter-ts/tree/fb155618f1f78ddc083c2d915371835c83d6f921/benchmark)

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

## Why I Back to Node.js?

### Things Stop Me to Use Bun

1. As a test runner, it has issues with restoring mocks, like https://github.com/oven-sh/bun/issues/7823, https://github.com/oven-sh/bun/issues/7376. Worse still, it seems unlikely that we'll have a chance to get a fix anytime soon (half a year). My only choice is to use a dedicated testing tool;
2. As a bundler, it's not exactly ready to use right out of the box. Bunup is a really good choice to overcome this, but the issues about **compile mismatch** (like https://github.com/oven-sh/bun/issues/12067, https://github.com/oven-sh/bun/issues/18963) is the biggest thing to stop me (especially for buiding a complex project). The solution is still to use a dedicated bundling tool instead;
3. As a package manager, it has issues with monorepo (like https://github.com/oven-sh/bun/issues/18906, https://github.com/oven-sh/bun/issues/20477), also issues with isolated node_modules linker & typescript type resolution. I have to replace it;
4. As a runtime, its Node.js compatibility is progressing too slowly, the mainly thing stop me is the support of node:inspector, I use Vitest instead of "bun test" to solve the `1.`, but this doesn't seem to be a viable solution still, because vitest --coverage uses node:inspector, which is not supported by Bun! XD. A futher workaround is run Vitest on Node.js, others on Bun...**Wait, what do we have left?**

As you can see, after you replacing the unusable part, the entire Bun is almost replaced.

### AI-led vs. Human-led

Recently, Bun is undergoing a big refactoring from Zig to Rust, to be honest, I think it is a good thing, after all, the Zig API has not yet reached a stable time. But for those of us, it will greatly slow down the speed of feature support, bug fixes, and kill people’s patience.

More importantly, this refactoring is almost all AI-led, and honestly in the use of AI, I prefer to support the Zig team: AI is a good idea generator, but definitely not a architecture designer. Every time a new context is opened, the nature of the chaotic system will make the architectural design of the entire project worse and worse: AI 1 believes that this part of the abstraction will help the new API design in the future, but AI 2 may completely ignore the previously done abstraction and give birth to new ideas... Even if someone is reviewing, will the person who reviewed choose to take the initiative to help the AI to reorganize the architecture? Certainly not. It is believed that the products of AI programming will inevitably escape the influence of AI's own characteristics and will eventually become another chaotic system.

Perhaps it is most important to quickly occupy the market and deliver products in the AI era, but I always expect that people should not be so casual about infrastructure projects.

Let me clarify, I don't dislike AI-led products, [Mise](https://mise.jdx.dev), [Aube](https://aube.jdx.dev) and [Nub](https://nubjs.com) are both AI-led products. What I dislike are **AI products that are unusable and lack design**.
