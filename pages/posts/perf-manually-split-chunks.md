---
title: 'Performance Optimization: Manually Split Chunks'
date: 2025-11-05T16:22+08:00
update: 2026-06-24T18:01+08:00
lang: en
duration: 14min
type: note
---

[[toc]]

## Introduction

As a modern front-end developer, you may be very familiar with the word **"chunks splitting"**.

But before this, we must understand the concepts of **"module", "chunk" and "bundle"**: They are the concepts from Webpack, but they are also widely used in other modern bundlers / build tools.

### Module

A "module" is **any source file** in your project (like `.js`, `.ts`, `.vue`, and even though a `.css`, `.svg`, etc.), which **can be (or supported to be)** processed by your bundler / build tool and imported into other "modules".

### Chunk

A "chunk" is **a group of modules** which **will be compiled into a single output file** by your bundler / build tool, so it determines the output bundle structure of your project.

In a word: **"chunks splitting" determines which modules are grouped together into chunks.** (So, I'm willing to call it "chunk grouping" or "code splitting" instead "chunks splitting")

#### Basic Chunking Behavior

Basically, each entrypoint module and its related (imported) modules will be grouped into a separate chunk, which is called **"initial chunk"**.

Also, each asynchronous (dynamically imported) module and its related (imported) modules will be grouped into a separate chunk, which is called **"asynchronous chunk"**.

These are the basic rules to build an application. Real bundlers may [further split or merge chunks](#modern-bundler-default-chunking-behavior) due to shared dependencies, CSS extraction, vendor splitting, or manual configuration.

For example, a plain JS / TS project:

<table><tbody>

<tr><th valign="top">

Source:

_bundler.config.ts (simulated)_

```ts
export default {
  entry: [
    './src/index.ts',
    './src/lib.ts',
  ],
}
```

_src/index.ts_

```ts
import { foo } from './module.ts'

console.log(foo)
console.log(
  await import('./module-async.ts')
    .then(module => module.bar)
)
```

_src/module.ts_

```ts
export const foo = 'Hello, World!'
```

_src/module-async.ts_

```ts
export const bar = 'Hello, Async World!'
```

_src/lib.ts_

```ts
console.log('This is a library.')
```

</th><th valign="top">

Output:

_dist/index.js_

```js
// module.ts
const foo = 'Hello, World!'

// index.ts
console.log(foo)
console.log(
  await import('./module-async.js')
    .then(module => module.bar)
)
```

_dist/module-async.js_

```js
// module-async.ts
export const bar = 'Hello, Async World!'
```

_dist/lib.js_

```js
// lib.ts
console.log('This is a library.')
```

</th></tr>

</tbody></table>

Unfortunately, things are much more complicated for Web applications, because we have not only JS / TS modules, but also HTML modules, style modules (like `.css`, `.scss`, etc.) and even though asset modules (like `.svg`, `.png`, etc.).

And due to the technical limitation, when you try to group modules, you:

- **Can** group JS / TS modules into a JS chunk, of course;
- **Can** group style modules into a CSS chunk, of course;
- **Can not** group JS / TS modules into a CSS chunk, of course;
- **Can not** group style modules into a JS chunk
  - Unless you are using runtime CSS injection technique (like [style-loader](https://webpack.js.org/loaders/style-loader/), [vite-plugin-style-inject](https://www.npmjs.com/package/vite-plugin-style-inject), etc.);
  - Unless you are using "CSS-in-JS" technique (like [styled-components](https://styled-components.com/), [emotion](https://emotion.sh/docs/introduction), etc.);
- Other modules (like `.svg`, `.png`, etc.) are usually treated as **asset modules**, which will be emitted into the output directory as separate files, and cannot be grouped into JS / CSS chunks. Also, the import result of those modules will be replaced with the URL of the emitted file.

Also, the entrypoint module of a Web application is usually a HTML module, which is belong to asset modules, so there is a special behavior: **Each module imported by the entrypoint HTML will be grouped into a separate chunk**, just like they are all entrypoint modules.

For example, a simple Vite project:

<table><tbody>

<tr><th valign="top">

Source:

_index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <link href="./src/styles.css" rel="stylesheet" />
  </head>
  <body>
    <!-- ... -->
    <script type="module" src="./src/main.js">
    </script>
    <script type="module" src="./src/extra.js">
    </script>
  </body>
</html>
```

_src/styles.css_

```css
body {
  background-color: #f0f0f0;
}
```

_src/main.js_

```js
import { foo } from './module.js'

console.log(foo)
```

_src/module.js_

```js
export const foo = 'Hello, World!'
```

_src/extra.js_

```js
import SvgIcon from './icon.svg'

console.log('This is an extra module.')
console.log(SvgIcon)
```

_src/icon.svg_

```xml
<svg>
  <!-- ... -->
</svg>
```

</th><th valign="top">

Output:

_dist/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <link href="./styles.css" rel="stylesheet" />
  </head>
  <body>
    <!-- ... -->
    <script type="module" src="./main.js">
    </script>
    <script type="module" src="./extra.js">
    </script>
  </body>
</html>
```

_dist/styles.css_

```css
body {
  background-color: #f0f0f0;
}
```

_dist/main.js_

```js
// module.js
const foo = 'Hello, World!'

// main.js
console.log(foo)
```

_dist/extra.js_

```js
// extra.js
console.log('This is an extra module.')
console.log('./assets/icon.svg')
```

_dist/assets/icon.svg_

```xml
<svg>
  <!-- ... -->
</svg>
```

</th></tr>

</tbody></table>

#### Things to Consider in Chunks Splitting

To group modules into chunks, there are a lot of strategies, also a lot of things to consider.

The first thing is the **chunk execution order**: If module1 is imported before module2, after they group into two chunks, we still need to ensure that the chunk contains module1 is imported first, otherwise, it may break the logic of the application, especially for side effect code.

The second thing is **to avoid circular chunks, also to avoid mangle the exports of entrypoint modules**. There is a simple example:

_src/index.js_

```js
import { foo } from './module-a.js'
import { bar } from './module-b.js'

console.log(foo)
console.log(bar)
```

_src/module-a.js_

```js
const foo = 'Hello, World!'

export { foo }
```

_src/module-b.js_

```js
import { foo } from './module-a.js'

const bar = foo + '!!!'

export { bar }
```

<table><tbody>

<tr><th valign="top">

Default (one chunk, one bundle):

_dist/index.js_

```js
// module-a.js
const foo = 'Hello, World!'

// module-b.js
const bar = foo + '!!!'

// index.js
console.log(foo)
console.log(bar)
```

</th><th valign="top">

Move `module-b.js` into new chunk **(without its dependencies)**:

_dist/index.js_

```js
import { bar } from './module-b.js'

// module-a.js
const foo = 'Hello, World!'

// index.js
console.log(foo)
console.log(bar)

// Oops!
// In order to make
// the reference to `foo`
// available in `module-b.js`,
// we need to rewrite exports
// of entrypoint.
// It violate the original
// intention, also cause
// the inconsistent of the
// exports between `dist/index.js`
// and `src/index.js`.
export { foo }
```

_dist/module-b.js_

```js
import { foo } from './index.js'

// module-b.js
const bar = foo + '!!!'

export { bar }
```

</th><th valign="top">

Move `module-b.js` into new chunk **(with its dependencies)**:

_dist/index.js_

```js
import { bar, foo } from './module-b.js'

// index.js
console.log(foo)
console.log(bar)
```

_dist/module-b.js_

```js
// module-a.js
const foo = 'Hello, World!'

// module-b.js
const bar = foo + '!!!'

// Mangle the exports of
// non entrypoint modules is valid.
export { bar, foo }
```

</th></tr>

</tbody></table>

#### Tree Shaking

Specially, if a module is never been used by any other module, it will not been grouped into any chunk, this is called **"tree shaking"**.

Example:

_entry.js_

```js
import { foo } from './module.js'

console.log(foo)
```

_module1.js_

```js
export const foo = 'Hello, World!'
```

_module2.js_

```js
export const bar = 'Hello, World!'
```

_output_

```js
// module1.js
const foo = 'Hello, World!'

// entry.js
console.log(foo)
```

### Bundle

A "bundle" is **an output file** generated by your bundler / build tool **for each emitted chunk**.

## Why Manually Chunks Splitting?

> [!Note]
>
> This background is necessary for us to understand the motivation of manually splitting chunks, and how to split chunks.

After understanding the concepts of "module", "chunk" and "bundle", we know "chunk" deeply determine the output structure of "bundle", so manually splitting chunks can help us to control the output, which can bring the following benefits:

- **Improve cache efficiency**: Separating the vendor modules (like Vue, React, etc.) into separate chunks can improve the cache efficiency, because these modules are usually used everywhere in the application, and they are not changed frequently. So we can take advantage of the browser & CDN cache to avoid re-downloading them every time we change the source code;
- **Page loading performance**: **Since HTTP/2.0**, the browser can **handle more requests in parallel** (one TCP connection, multiplexing) than HTTP/1.1 (up to 6 TCP connections per domain), we can safely split the large output bundles into more smaller chunks, to improve the page loading performance.
  > [!Note]
  > [Rolldown](https://rolldown.rs/)'s recommended chunk size is around **100KiB ~ 250KiB**, and [Webpack](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks)`s recommended chunk size is around **20KiB ~ 244KiB**.

## How to do Manual Chunks Splitting?

### Modern Bundler Default Chunking Behavior

Modern bundlers / build tools have already provided a default split strategy preset for us as fallback:

- Based on the [Basic chunking behavior](#basic-chunking-behavior);
- They will extract **shared parts** from the bundle into independent chunks.

These strategies are suitable for most of the cases, except for some special ones:

1. Want to cache the vendor modules which is **used everywhere**.

    If you are familiar with the principle of the modern bundlers / build tools, you may know that they will attach file hash to each output file, so that we (actually, it's the browser) can identify the file version easily. CDN also uses these hash to identify the file version.

    If you put both the source code and the dependencies into the same chunk, every time you change the source code, the hash of this chunk will change, and user should re-fetch the whole chunk, even though a bunch of the code (from the dependencies) has not changed. This cause CDN cache invalidation, and hurts the website performance.

    In this case, we need to separate these chunks manually.

2. Some of output chunks with default strategy are too large, we need to split them into smaller chunks manually.


### Things to Consider in Manual Chunks Splitting

When we want to split chunks manually, we need to consider the following things:

With the popularization of **ESM**, **build-time tree shaking** becoming the standard optimization method for reducing bundle size, this presents a requirement for us when doing code splitting: **Do not mix one-time used modules with shared modules in the same chunk**, otherwise, the effect of tree shaking will be degraded.

<details>
<summary>Reason</summary>

Imagine that, you have a web application with two dynamic imported routes `/home` & `/about`:

```ts
const routes = [
  {
    name: 'home',
    path: '/home',
    component: () => import('./home.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('./about.vue'),
  },
]
```

When you visit the `/home` route, it's expected that only the code related to the `/home` route will be loaded.

Assume these two pages both use the same vendor library, for example, `loadash-es`, `/home` uses `debounce` function, while `/about` uses `throttle` function.

_src/pages/home.vue_

```vue
<script setup lang="ts">
import { debounce } from 'lodash-es'

// ...
</script>
```

_src/pages/about.vue_

```vue
<script setup lang="ts">
import { throttle } from 'lodash-es'
// ...
</script>
```

Build-time tree shaking of ESM will result in the following output bundles:

_dist/home.js_

```js
// lodash-es/debounce.js
function debounce() {
  // ...
}
// ...
```

_dist/about.js_

```js
// lodash-es/throttle.js
function throttle() {
  // ...
}
// ...
```

Every time you visit `/home`, only `debounce` function will be loaded; every time you visit `/about`, only `throttle` function will be loaded. So clean and efficient!

What if you extract the whole vendor library `lodash-es` into a separate chunk? The output bundles will be like this:

_dist/vendor.js_

```js
// lodash-es/debounce.js
function debounce() {
  // ...
}
// lodash-es/throttle.js
function throttle() {
  // ...
}
// ...
```

_dist/home.js_

```js
import { debounce } from './vendor.js'
// ...
```

_dist/about.js_

```js
import { throttle } from './vendor.js'
// ...
```

Oops, every time you visit each page, browser will always download the whole `vendor.js`! Although the tree shaking is still working: never used code still not be included in the chunks, but this cause unused code to be downloaded and executed in some cases, which degrades the loading performance of the first screen.

</details>

### Vite

Since Vite 8, it uses _Rolldown_ as the low-level bundler, supporting more flexible configuration for chunks splitting, which is similar to _Webpack_.

What's more, its **"automatic code splitting"** feature provides more intelligent default chunk splitting strategy, than Webpack: It will group **the module and its dependencies** within the same chunk group, without considering the constraints, which is what we expect in most cases. See more details [here](https://rolldown.rs/in-depth/manual-code-splitting#why-does-the-group-contain-modules-that-don-t-satisfy-the-constraints).

BTW, Vite & Rolldown called chunk splitting to **"code splitting"**, we can use `build.rolldownOptions.output.codeSplitting` in the configuration (like `vite.config.ts`) to custom the behavior.

_vite.config.ts_

```ts
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        // [!code focus:48]
        codeSplitting: {
          // Default Group options, which will be used
          // to control the chunk size and other behaviors.
          minSize: 100_000, // 100 KB
          maxSize: 250_000, // 250 KB

          groups: [
            // For vendor libraries who are used in every page,
            // we can group them into separate chunk groups.
            {
              // Group name, which will be used as the chunk name.
              name: 'vue',
              // Group rules, which will be used to determine
              // whether a module will be captured by this group.
              test: /node_modules[\\/]@?vue/,
              priority: 40,
            },

            // For business libraries, we only extract the
            // commonly used ones into separate chunk groups.
            {
              name: 'echarts',
              test: /node_modules[\\/]echarts/,
              minShareCount: 2,
              priority: 30,
            },
            {
              name: 'element-plus',
              test: /node_modules[\\/]element-plus/,
              minShareCount: 2,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              minShareCount: 2,
              priority: 10,
            },

            // For source code, we only extract the
            // commonly used ones into separate chunk groups.
            {
              name: 'source',
              minShareCount: 2,
              priority: 5,
            }
          ]
        },
      },
    },
  },
})
```

### Vite 7

For Vite 7 and below, we can only use `build.rollupOptions.output.manualChunks` in the configuration (like `vite.config.ts`) to custom the chunks splitting behavior.

Due to the limitation of Rollup, it is much less flexible than Vite 8 & Webpack: **Vite 7 just supports to cache the vendor modules into separate chunks.**

_vite.config.ts_

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // [!code focus:14]
        // We only extract vendor libraries, who are used in every page,
        // into separate chunks. Because:
        // 1. Vite 7 (Rollup) only supports chunks grouping;
        // 2. For business libraries, we may used different parts in
        // different pages, if we group them together, we may get a full
        // size chunk in each page, which reduces the performance.
        manualChunks: (id) => {
          // Extract vendor libraries who are base frameworks
          // into separate chunks.
          if (/node_modules[\\/]@?vue/.test(id)) {
            return 'vue'
          }
          return null
        },
      },
    },
  },
})
```

### Webpack

For Webpack, we can use `optimization.splitChunks` in the configuration (like `webpack.config.js`) to split chunks.

It has a default configuration, you can refer [the document](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks) for more details.

_webpack.config.js_

```js
export default {
  output: {
    // [!code focus:5]
    /**
     * Webpack does not attach hash to chunk files by default, so we should
     * configure it manually.
     */
    filename: '[name]-[contenthash:8].js',
  },

  optimization: {
    // [!code focus:58]
    splitChunks: {
      /**
       * We want apply cache groups to both `async` and `initial` chunks,
       *  so we should use `chunks: 'all'`.
       */
      chunks: 'all',

      // Default Group options, which will be used to control the chunk
      // size and other behaviors.
      minSize: 100_000, // 100 KB
      maxSize: 250_000, // 250 KB

      cacheGroups: {
        // For vendor libraries who are used in every page, we can group
        // them into separate chunk groups.
        vue: {
          // Group name, which will be used as the chunk name.
          name: 'vue',
          // Group rules, which will be used to determine whether a module
          // will be captured by this group.
          test: /node_modules[\\/]@?vue/,
          priority: 40,
        },

        // For business libraries, we only extract the commonly used ones
        // into separate chunk groups.
        echarts: {
          name: 'echarts',
          test: /node_modules[\\/]echarts/,
          priority: 30,
          minChunks: 2,
          reuseExistingChunk: true,
        },
        elementplus: {
          name: 'element-plus',
          test: /node_modules[\\/]element-plus/,
          priority: 20,
          minChunks: 2,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          name: 'vendor',
          test: /node_modules/,
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true,
        },

        // For source code, we only extract the commonly used ones into
        // separate chunk groups.
        default: {
          name: 'source',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
```

## How to Check the Effects?

You can refer to my demo repository [here](https://github.com/lumirelle/demo-manually-split-chunks) for more details.

### Vite

For Vite, you can enable the devtools & inspect plugin by:

```bash
npm install -D @vitejs/devtools vite-plugin-inspect
```

```ts
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  devtools: {
    enabled: true,
    build: { withApp: true }
  },
  plugins: [
    Inspect({
      build: true,
    }),
  ],
})
```

And you can inspect the chunks in the "Chunks" tab of the opening website.

### Vite 7

For Vite 7 and below, you can use the Rollup plugin `rollup-plugin-visualizer` to analyze the output bundles and chunks.

```bash
npm install -D rollup-plugin-visualizer
```

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer()
  ]
})
```

### Webpack

For Webpack, you can use the Webpack Bundle Analyzer plugin to analyze the output bundles and chunks.

```bash
npm install -D webpack-bundle-analyzer
```

```js
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

export default {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
}
```

## Example

See [here](https://github.com/lumirelle/demo-manually-split-chunks).
