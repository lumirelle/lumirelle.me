---
title: 'Project Engineering: Manually Split Chunks'
date: 2025-11-05T16:22+08:00
update: 2025-11-05T16:22+08:00
lang: en
duration: n/a
type: blog+note
---

[[toc]]

## Introduction

As a modern front-end developer, you may be very familiar with the word "chunks splitting".

This is a technique that allows you split the output "bundles" into smaller pieces (called "chunks"), which can reduce the
initial bundle size and improve the loading performance.

The key point of using this technique is how to balance the size of the chunks and the number of chunks.

- If the chunks are too large, the initial loading time may become too long.
- If the chunks are too small, there will be a large number of chunks to load, which may cause the request waterfall.
- Both of the above two edge cases will degrade the loading performance.

Happily, modern builders/bundlers have already provided some default split strategies (like max chunk size, min chunk
size, etc.) for us to use. These strategies are suitable for most of the cases, so we don't need to (I mean, we
**shouldn't to**) change these strategies at most of the time, unless you have special needs, and you really know what
you are doing.

Change these default strategies casually will face the two edge cases mentioned above.

Putting aside all the above, there is still one thing we can do for chunks splitting: "chunks grouping".

## Why should we do chunks grouping?

If you are familiar with the principle of the modern builders/bundlers, you may know that the modern builders/bundlers
will attach file hash to the output files, so that we can use the file hash to identify the file version.

If we extract all of the dependencies into some independent chunks, things will be interesting:

In most cases, the dependencies of our front-end project will not change in a long time, so the hash of chunks for these
dependencies will not change too. Benefited from this, the CDN can work much better, because it can cache these chunks
for a longer time.

How about the default case?

Some output chunks may both contain our source code and the dependencies' code, every time we change the source code,
the hash of these chunks will change too, and the cache on the CDN will be invalidated.

## How to group chunks?

For different builders/bundlers, the way to group chunks is different.

### Webpack

For Webpack, we can use the `optimization.splitChunks.cacheGroups` in the configuration (like `webpack.config.js`) to group chunks.

_webpack.config.js_

```js
export default {
  optimization: {
    splitChunks: {
      /**
       * We want apply cache groups to both `async` and `initial` chunks, so we should use `chunks: 'all'`.
       */
      chunks: 'all',
      cacheGroups: {
        // Extract large vendors into a separate chunk.
        'e-charts': {
          name: 'echarts',
          test: /[\\/]node_modules[\\/]echarts(.*)/,
          priority: 30,
        },
        'element-plus': {
          name: 'element-plus',
          test: /[\\/]node_modules[\\/]element-plus(.*)/,
          priority: 20,
        },
        // Extract common vendors into a separate chunk.
        'vendor': {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        // Extract common source code (used by more than 1 chunk) into a separate chunk.
        'default': {
          name: 'default',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
```

### Vite

For Vite, we can use the `build.rollupOptions.output.chunkFileNames` in the configuration (like `vite.config.ts`) to group chunks.

_vite.config.ts_

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Extract large vendors into a separate chunk.
          if (id.startsWith('node_modules/echarts')) {
            return 'echarts'
          }
          if (id.startsWith('node_modules/element-plus')) {
            return 'element-plus'
          }
          // Extract common vendors into a separate chunk.
          if (id.startsWith('node_modules')) {
            return 'vendor'
          }
          return null
        },
      },
    },
  },
})
```
