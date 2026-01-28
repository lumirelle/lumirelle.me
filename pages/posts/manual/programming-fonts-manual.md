---
title: Programming Fonts Manual
date: 2025-10-15T14:10+08:00
update: 2025-12-30T22:45+08:00
lang: en
duration: 8min
type: note
---

[[toc]]

## Monospace Font Families

As we all know, monospace font families are necessary for us to programming.

As a Chinese, sometimes I have to use both Latin characters and CJK characters in my projects. So I need to pay more attention to the width of each character, in order to get better development experience.

> [!Note]
>
> In CSS, `em` is base on the current font size. For example, if the font size is `16px`, then `1em` = `16px`.

I categorize the fonts I used into three groups by the **default character width (as some font families are variable, they may support custom character width) relative to the font size**:

- **50%em group**: If the font size is 16px, one Latin character will be 8px (50%), and one CJK character will be 16px (50% \* 2), like "M PLUS Code Latin" and "Source Han Sans TC", etc.
- **60%em group**: If the font size is 16px, one Latin character will be 9.6px (60%), and one CJK character will be 19.2px (60% \* 2), like "Go Mono" and "Maple Font", etc.
- **62%em group**: If the font size is 16px, one Latin character will be 9.92px (62%), and one CJK character will be 19.84px (62% \* 2), like "Monaspace Xenon Var", etc.

## 50%em Group

> [!Note]
>
> Most of CJK fonts are designed to be 50% width, but very few Latin fonts are.

This group may look a bit narrow for most people, it uses ["Source Han Sans TC VF"](https://github.com/adobe-fonts/source-han-sans/releases) for CJK characters support.

These are some latin fonts you can choose for this group:

- ["Inconsolata"](https://github.com/google/fonts/blob/main/ofl/inconsolata):

  <TextTag text="VARIABLE" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" />

  A huge font family. With weights from 200 to 900, with italic.

  <img src="/posts/programming-fonts-manual/inconsolata.png" alt="Inconsolata" style="width: 100%; height: auto; border-radius: 12px;" />

- ["Iosevka"](https://github.com/be5invis/Iosevka/releases):

  <TextTag text="STATIC" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" />

  A huge font family. With 9 weights from 100 to 900, with italic.

  <img src="/posts/programming-fonts-manual/iosevka.png" alt="Iosevka" style="width: 100%; height: auto; border-radius: 12px;" />

- ["M PLUS Code Latin"](https://github.com/coz-m/MPLUS_FONTS/tree/master/fonts):

  <TextTag text="VARIABLE" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" />

  With weights from 100 to 700, but without italic.

  <img src="/posts/programming-fonts-manual/m-plus-code-latin.png" alt="M PLUS Code Latin" style="width: 100%; height: auto; border-radius: 12px;" />

- ["Ubuntu Mono"](https://fonts.google.com/specimen/Ubuntu+Mono?query=Ubuntu):

  <TextTag text="STATIC" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" /><TextTag text="TINY" preset="red" />

  A beautiful font used by Ubuntu OS. With 2 weights: regular (400), bold (700), with italic.

  <img src="/posts/programming-fonts-manual/ubuntu-mono.png" alt="Ubuntu Mono" style="width: 100%; height: auto; border-radius: 12px;" />

Then, you can using these font like this:

```json
// 'M PLUS Code Latin' can be replaced by any other Latin fonts listed above
"'Symbols Nerd Font', 'M PLUS Code Latin', 'Source Han Sans TC', monospace"
```

## 60%em Group

> [!Note]
>
> Most of Latin fonts are designed to be 60% width, but very few CJK fonts are.

This group uses ["Maple Mono CN (Default ligature and unhinted)"](https://github.com/subframe7536/maple-font/releases) for CJK characters support.

> [!Note]
>
> "Maple Mono CN" itself is a beautiful monospace font, you can use it standalone if you want.
>
> The variable version of Maple Mono CN is still in progress, just see the [discussion](https://github.com/subframe7536/maple-font/discussions/503).

And Latin font have more choice:

- ["Adwaita Mono"](https://gitlab.gnome.org/GNOME/adwaita-fonts/-/tree/main/mono?ref_type=heads):

  <TextTag text="STATIC" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" />

  A conventional font designed by GNOME. With 2 weights: regular (400), bold (700), with italic.

  <img src="/posts/programming-fonts-manual/adwaita-mono.png" alt="Adwaita Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- ["Geist Mono"](https://github.com/vercel/geist-font/releases):

  <TextTag text="VARIABLE" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" />

  A beautiful font designed by Vercel. With weights from 100 to 900, with italic.

  <img src="/posts/programming-fonts-manual/geist-mono.png" alt="Geist Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- ["Go Mono"](https://go.googlesource.com/image/+/refs/heads/master/font/gofont/ttfs/):

  <TextTag text="STATIC" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SERIF" />

  A beautiful font designed for Go language by Google. With 2 weights: regular (400), bold (600, not 700), with italic.

  <img src="/posts/programming-fonts-manual/go-mono.png" alt="Go Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- ["Google Sans Code"](https://github.com/googlefonts/googlesans-code/releases):

  <TextTag text="VARIABLE" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" />

  A beautiful variable font designed by Google, too. With weights from 300 to 800, with italic.

  <img src="/posts/programming-fonts-manual/google-sans-code.png" alt="Google Sans Code" style="width: 100%; height: auto; border-radius: 12px;" />

- ["Recursive Mono Linear/Casual"](https://github.com/arrowtype/recursive/releases):

  > [!Warning]
  >
  > Variable version has some rendering issues about non-breaking space in Chromium-based applications (like Chrome, VSCode, etc.), please track the [issue #472245780](https://issues.chromium.org/issues/472245780).

  <TextTag text="VARIABLE" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SERIF" />

  Mono and casual style of Recursive variable font family. With weights from 300 to 1000, with italic.

  <img src="/posts/programming-fonts-manual/recursive-mono-casual.png" alt="Rec Mono Casual" style="width: 100%; height: auto; border-radius: 12px;" />

- ["DM Mono"](https://fonts.google.com/specimen/DM+Mono):

  <TextTag text="STATIC" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SANS" /><TextTag text="CURRENT USAGE" preset="green" />

  A static font family with 3 weights from 300 to 500, with italic.

  <img src="/posts/programming-fonts-manual/dm-mono.png" alt="DM Mono" style="width: 100%; height: auto; border-radius: 12px;" />

Then, you can using these font like this:

```json
// 'Recursive Mono Linear' can be replaced by any other Latin fonts listed above
"'Symbols Nerd Font', 'Recursive Mono Linear', 'Maple Mono CN', monospace"
```

## 62%em Group

> [!Warning]
>
> This group is currently Latin-only.

- ["Monaspace Xenon Var"](https://github.com/githubnext/monaspace/releases):

  <TextTag text="VARIABLE" preset="amber" /><TextTag text="ROUNDED" /><TextTag text="SERIF" preset="blue" />

  A beautiful font designed by GitHub. With weights from 200 to 800, with italic.

  <img src="/posts/programming-fonts-manual/monaspace-xenon.png" alt="Monaspace Xenon" style="width: 100%; height: auto; border-radius: 12px;" />

Then, you can using these font like this:

```json
"'Symbols Nerd Font', 'Monaspace Xenon Var', monospace"
```

## Font Preview

### Latin Characters with CJK Characters

50%em Group:

<div font="[&_code]:50%em!">

```js
console.log('Holly shit!')
console.log('我的娘亲嘞!')

// |wo|!-|so|+=0o|lI|
// |我|的|天|……哪|！|
我
w
```

</div>

60%em Group:

<div font="[&_code]:60%em!">

```js
console.log('Holly shit!')
console.log('我的娘亲嘞!')

// |wo|!-|so|+=0o|lI|
// |我|的|天|……哪|！|
我
w
```

</div>

### Code

50%em Group:

<div font="[&_code]:50%em!">

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
    if (dryRun || await _copyPasteConfig(source, target, options)) {
      consola.success(
        `Configuration ${highlight.important(`"${source}"`)} ${
          dryRun ? highlight.green('will') : 'is'
        } copied to ${highlight.important(`"${target}"`)}.`,
      )
    }
  }
  else if (mode === 'symlink') {
    if (dryRun || await _symlinkConfig(source, target, options)) {
      consola.success(`Configuration ${highlight.important(`"${target}"`)} ${
        dryRun ? highlight.green('will') : 'is'
      } symlinked to ${highlight.important(`"${source}"`)}.`)
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
    fs.copyFile(
      join(import.meta.dirname, '..', 'assets', source),
      target,
      force,
    ),
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
  return fs.createSymlink(
    join(import.meta.dirname, '..', 'assets', source),
    target,
    force,
  )
}
```

</div>

60%em Group:

<div font="[&_code]:60%em!">

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
    if (dryRun || await _copyPasteConfig(source, target, options)) {
      consola.success(
        `Configuration ${highlight.important(`"${source}"`)} ${
          dryRun ? highlight.green('will') : 'is'
        } copied to ${highlight.important(`"${target}"`)}.`,
      )
    }
  }
  else if (mode === 'symlink') {
    if (dryRun || await _symlinkConfig(source, target, options)) {
      consola.success(`Configuration ${highlight.important(`"${target}"`)} ${
        dryRun ? highlight.green('will') : 'is'
      } symlinked to ${highlight.important(`"${source}"`)}.`)
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
    fs.copyFile(
      join(import.meta.dirname, '..', 'assets', source),
      target,
      force,
    ),
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
  return fs.createSymlink(
    join(import.meta.dirname, '..', 'assets', source),
    target,
    force,
  )
}
```

</div>
