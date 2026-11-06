---
title: System Fonts
date: 2025-10-15T14:10+08:00
lang: en
---

<style>
/* Font Definitions */
/* Strict 60%em Group */
@font-face {
  font-family: 'Maple Mono CN';
  src: url('/fonts/MapleMono-CN-Regular.ttf');
}
</style>

[[toc]]

> [!Note]
> Current status (2026-10-20T13:56+08:00):
> ```json
> {
>   "UI": "'Geist', 'Resource Han Rounded', sans-serif",
>   "Prose": "'Geist Serif', 'Resource Han Rounded', serif",
>   "Code": "'GeistMono Nerd Font', 'Maple Mono CN', monospace"
> }
> ```

## Introduction to Different Fonts

1. **Sans fonts** are fonts in which each characters has no serif, we may use them for general user interface, because it's easy to read.
2. **Serif fonts** are fonts at the opposite of Sans fonts, we may use them for blog prose for design sense.
3. **Monospace fonts** are fonts in which each character occupies the same amount of horizontal space. Basically, we always use monospace fonts for programming, because they can align characters in a better way, which can help us review code.

## My Preference

As a Chinese, sometimes I have to use both Latin and CJK characters in my lifetime. So I need to pay more attention to the harness between Latin charactere & CJK characters.

My basic requirements for fonts are:

1. They must have at least two weights (Regular & Bold)
2. The latin font must have italic styles
3. Be easy on the eyes but not too serious

Finally, I made the difficult and serious decision to use the Geist Font Family & Maple Font Family (based on Resource Han Rounded) for the rest of my life, and NEVER SWITCH TO ANYTHING ELSE!

### General Font Weight Map from Numeric Value to Aliase <a name="font-weights"></a>

This is a comparison table of the font weight aliases and the corresponding numeric values:

| Numeric Value	| Keyword Aliases |
| -- | -- |
| 100 | thin |
| 200 | extra light |
| 300 | light |
| 400 | regular |
| 500 | medium |
| 600 | semibold |
| 700 | bold |
| 800 | extra bold, heavy |
| 900 | black |

### Fonts

- [Geist](https://vercel.com/font) & [Geist Serif](https://vercel.com/font?type=serif):

  <TextTag text="variable" preset="amber" /><TextTag text="sans-serif" /><TextTag text="serif" /><TextTag text="thin to black, with italic" preset="green" />

  Geist is designed for legibility and simplicity. It is a modern, geometric typeface that is based on the principles of classic Swiss typography.

  <img src="/posts/programming-fonts/geist-sans.webp" alt="Geist Sans" style="width: 100%; height: auto; border-radius: 12px;" />
  <img src="/posts/programming-fonts/geist-serif.webp" alt="Geist Serif" style="width: 100%; height: auto; border-radius: 12px;" />

- [GeistMono Nerd Font](https://www.nerdfonts.com/font-downloads):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="thin to black, with italic" preset="green" />

  GeistMono Nerd Font is the monospaced version of Geist, with Nerd Font patch.

  It's recommended to use static build instead of variable, becuase most of terminal/editor have poor support for the variable font.

  <img src="/posts/programming-fonts/geist-mono.webp" alt="Geist Mono" style="width: 100%; height: auto; border-radius: 12px;" />

## Fonts Preview

### Code

<div font="[&_code]:code!">

```json
"'Go Mono', 'Maple Mono CN', 'Symbols Nerd Font Mono', monospace"
```

```js
console.log('Holly shit!')
console.log('我的娘亲嘞!')

// |wo|!-|so|+=0o|lI|
// |我|的|天|……哪|！|
我
w
```

```ts
import type { ProcessConfigOptions } from '../../types'
import { join } from 'node:path'
import consola from 'consola'
import { fs, highlight } from 'starship-butler-utils'

/**
 * Process config files (copy-paste or symlink).
 *
 * @param source Relative path to assets folder (package-root/assets/).
 * @param target Target path.
 * @param options Processing options.
 * @returns Whether operation success or not.
 */
export async function processConfig(
  source: string,
  target: string,
  options: Partial<ProcessConfigOptions> = {},
): Promise<void> {
  const { mode = 'copy-paste', dryRun = false } = options
  if (mode === 'copy-paste') {
    if (dryRun || (await _copyPasteConfig(source, target, options))) {
      consola.success(
        `Configuration ${highlight.important(`"${source}"`)} ${
          dryRun ? highlight.green('will') : 'is'
        } copied to ${highlight.important(`"${target}"`)}.`,
      )
    }
  }
  else if (mode === 'symlink') {
    if (dryRun || (await _symlinkConfig(source, target, options))) {
      consola.success(
        `Configuration ${highlight.important(`"${target}"`)} ${
          dryRun ? highlight.green('will') : 'is'
        } symlinked to ${highlight.important(`"${source}"`)}.`,
      )
    }
  }
  else {
    throw new Error(`Unknown configure mode: ${mode}`)
  }
}

/**
 * Copy config to target path.
 *
 * @private
 * @param source Relative path to assets folder (`package-root/assets/`).
 * @param target Target path, absolute path or relative path to CWD.
 * @returns Whether operation success or not.
 */
async function _copyPasteConfig(
  source: string,
  target: string,
  options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {},
): Promise<boolean> {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return Promise.resolve(
    fs.copyFile(join(import.meta.dirname, '..', 'assets', source), target, force),
  )
}

/**
 * Symlink config to target path.
 *
 * @private
 * @param source Relative path to assets folder (`package-root/assets/`).
 * @param target Target path, absolute path or relative path to CWD.
 * @returns Whether operation success or not.
 */
async function _symlinkConfig(
  source: string,
  target: string,
  options: Omit<Partial<ProcessConfigOptions>, 'mode'> = {},
): Promise<boolean> {
  const { useGlob, force } = options
  if (useGlob) {
    // TODO: Implement support for glob
    return Promise.resolve(false)
  }
  return fs.createSymlink(join(import.meta.dirname, '..', 'assets', source), target, force)
}
```

</div>

