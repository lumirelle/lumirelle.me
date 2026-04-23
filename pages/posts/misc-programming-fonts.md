---
title: Programming Fonts
date: 2025-10-15T14:10+08:00
update: 2026-04-12T19:12+08:00
lang: en
duration: 11min
---

[[toc]]

## Introduce to Monospace Fonts

Monospace fonts are fonts in which each character occupies the same amount of horizontal space.

Basically, we always use monospace fonts for programming, because they can align characters in a better way, which can improve readability and reduce eye strain.

> [!Note]
>
> As a Chinese, sometimes I have to use both Latin characters and CJK characters in my projects. So I need to pay more attention to the width of each character, in order to get better development experience.

## Test Drive Comparison

You can compare various programming fonts with test drive method in this [website](https://programmingfonts.org/).

## My Preference

My basic requirements for fonts are that:

1. They must have at least two weights (Regular & Bold);
2. They must include italics.

All of fonts listed below are satisfy these requirements.

> [!Note]
>
> In CSS, `em` is base on the current font size. For example, if the font size is `16px`, then `1em` = `16px`.

I categorize the fonts I used into several groups by the **default character width (as some font families are variable, they may support custom character width) relative to the font size**, for example:

- **50%em group**: If the font size is 16px, one Latin character will be 8px (50%em), and one CJK character will be 16px (50% \* 2 = 100%em), like "M PLUS Code Latin" and "Source Han Sans TC", etc.
- **60%em group**: If the font size is 16px, one Latin character will be 9.6px (60%em), and one CJK character will be 19.2px (60% \* 2 = 120%em), like "Go Mono" and "Maple Font", etc.
- **62%em group**: If the font size is 16px, one Latin character will be 9.92px (62%em), and one CJK character will be 19.84px (62% \* 2 = 124%em), like "Monaspace Xenon Var", etc.

Also, this is a comparison table of the font weight aliases and the corresponding numeric values:

| Numeric Value	| Keyword Aliases |
| -- | -- |
| 100 |	thin, hairline |
| 200 |	extra light, ultra light |
| 300 |	light, demi, book |
| 400 |	normal, regular, book, plain |
| 500 |	medium |
| 600 |	semibold, demibold |
| 700 |	bold |
| 800 |	extra bold, ultra bold, heavy |
| 900 |	black, extra black, ultra black, poster, fat |
| 950 |	(non-standard, supported by some variable fonts) |

### 62%em Group

> [!Warning]
>
> This group is currently Latin-only.

- [0xProto](https://github.com/0xType/0xProto/releases): <a name="0xProto"></a>

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" preset="blue" /><TextTag text="regular, bold, with italic" preset="green" />

  An opinionated font for software engineers, with ligatures that don't deform shape.

  <img src="/posts/misc-programming-fonts/0xproto.png" alt="0xProto" style="width: 100%; height: auto; border-radius: 12px;" />

- ⭐ [Monaspace Xenon Var](https://github.com/githubnext/monaspace/releases):

  <TextTag text="variable" preset="amber" /><TextTag text="serif" preset="blue" /><TextTag text="extralight to extrabold, with italic" preset="green" />

  The Monaspace type system is a monospaced type superfamily with some modern tricks up its sleeve. Xenon is the slab serif version

  <img src="/posts/misc-programming-fonts/monaspace-xenon.png" alt="Monaspace Xenon" style="width: 100%; height: auto; border-radius: 12px;" />

Then, you can using these font like this:

```json
"'Symbols Nerd Font', 'Monaspace Xenon Var', monospace"
```

### 60%em Group

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

- [Adwaita Mono](https://gitlab.gnome.org/GNOME/adwaita-fonts/-/tree/main/mono?ref_type=heads):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="regular, bold, with italic" preset="green" />

  A tweaked version of Iosevka, made to look similar to Adwaita's proportional font (based on Inter).

  <img src="/posts/misc-programming-fonts/adwaita-mono.png" alt="Adwaita Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- [Anka / Coder](https://github.com/loafer-mka/anka-coder-fonts):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="regular, bold, with italic" preset="green" />

  The Anka/Coder family is a monospaced, courier-width (60% of height; em size 2048x1229) font that can be used for source code, terminal windows etc.

  <img src="/posts/misc-programming-fonts/anka-coder.png" alt="Anka Coder" style="width: 100%; height: auto; border-radius: 12px;" />

- [DM Mono](https://fonts.google.com/specimen/DM+Mono):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="light to medium, with italic" preset="green" />

  DM Mono is a three weight, three style family designed for DeepMind. DM Mono was loosely based off of DM Sans, with a reduction in contrast and less geometric proportions.

  <img src="/posts/misc-programming-fonts/dm-mono.png" alt="DM Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- ⭐ [Drafting* Mono](https://indestructibletype.com/BuyDrafting.html):

  <TextTag text="static" preset="amber" /><TextTag text="serif" /><TextTag text="thin to bold, with italic" preset="green" />

  An ode to our past. A celebration of inconsistencies.

  <img src="/posts/misc-programming-fonts/drafting-mono.png" alt="Drafting Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- [Geist Mono](https://github.com/vercel/geist-font/releases):

  <TextTag text="variable" preset="amber" /><TextTag text="sans-serif" /><TextTag text="thin to black, with italic" preset="green" />

  Geist is designed for legibility and simplicity. It is a modern, geometric typeface that is based on the principles of classic Swiss typography. Geist Mono is the monospaced version of Geist.

  <img src="/posts/misc-programming-fonts/geist-mono.png" alt="Geist Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- [Go Mono](https://go.googlesource.com/image/+/refs/heads/master/font/gofont/ttfs/):

  <TextTag text="static" preset="amber" /><TextTag text="serif" /><TextTag text="regular, bold, with italic" preset="green" />

  The Go font was created especially for readability in the Go programming language. It’s a humanist, slab serif font created by the famous Bigelow & Holmes foundry.

  <img src="/posts/misc-programming-fonts/go-mono.png" alt="Go Mono" style="width: 100%; height: auto; border-radius: 12px;" />

- [Google Sans Code](https://github.com/googlefonts/googlesans-code/releases):

  <TextTag text="variable" preset="amber" /><TextTag text="sans-serif" /><TextTag text="light to extrabold, with italic" preset="green" />

  Google Sans Code is a fixed-width font family, designed to bring clarity, readability, and a bit of Google's distinctive brand character to code.

  <img src="/posts/misc-programming-fonts/google-sans-code.png" alt="Google Sans Code" style="width: 100%; height: auto; border-radius: 12px;" />

- [Recursive Mono Linear/Casual](https://github.com/arrowtype/recursive/releases):

  > [!Warning]
  >
  > Variable version has some rendering issues about non-breaking space in Chromium-based applications (like Chrome, VSCode, etc.), please track the [issue #472245780](https://issues.chromium.org/issues/472245780).

  <TextTag text="variable" preset="amber" /><TextTag text="serif" /><TextTag text="light to 1000, with italic" preset="green" />

  Built to maximize versatility, control, and performance, Recursive is a five-axis variable font.

  <img src="/posts/misc-programming-fonts/recursive-mono-casual.png" alt="Rec Mono Casual" style="width: 100%; height: auto; border-radius: 12px;" />

- [Red Hat Mono](https://github.com/RedHatOfficial/RedHatFont):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="thin to bold, with italic" preset="green" />

  Red Hat Mono is a monospaced font family designed for developers. It is based on the Red Hat Display typeface, and includes a range of weights from thin to bold, with italics.

  <img src="/posts/misc-programming-fonts/red-hat-mono.svg" alt="Red Hat Mono" style="width: 100%; height: auto; border-radius: 12px;" />

Then, you can using these font like this:

```json
// 'Drafting* Mono' can be replaced by any other Latin fonts listed above
"'Symbols Nerd Font', 'Drafting* Mono', 'Maple Mono CN', monospace"
```

### 50%em Group

> [!Note]
>
> Most of CJK fonts are designed to be 50% width, but very few Latin fonts are.

This group may look a bit narrow for most people, it uses ["Source Han Sans TC VF"](https://github.com/adobe-fonts/source-han-sans/releases) for CJK characters support.

These are some latin fonts you can choose for this group:

- [Inconsolata](https://github.com/google/fonts/blob/main/ofl/inconsolata):

  <TextTag text="variable" preset="amber" /><TextTag text="sans-serif" /><TextTag text="extralight to black, with italic" preset="green" />

  Inconsolata is a monospace font, designed for code listings and the like, in print. First and foremost, it is a humanist sans design.

  <img src="/posts/misc-programming-fonts/inconsolata.png" alt="Inconsolata" style="width: 100%; height: auto; border-radius: 12px;" />

- [Iosevka](https://github.com/be5invis/Iosevka/releases):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="thin to black, with italic" preset="green" />

  An open-source, sans-serif + slab-serif, monospace + quasi‑proportional typeface family, designed for writing code, using in terminals, and preparing technical documents.

  <img src="/posts/misc-programming-fonts/iosevka.png" alt="Iosevka" style="width: 100%; height: auto; border-radius: 12px;" />

- ⭐ [M PLUS Code Latin](https://github.com/coz-m/MPLUS_FONTS/tree/master/fonts):

  <TextTag text="variable" preset="amber" /><TextTag text="sans-serif" /><TextTag text="thin to bold, without italic" preset="green" />

  M PLUS 1/2 are Sans Serif font with 9 weights from Thin to Black.

  <img src="/posts/misc-programming-fonts/m-plus-code-latin.png" alt="M PLUS Code Latin" style="width: 100%; height: auto; border-radius: 12px;" />

- [Ubuntu Mono](https://fonts.google.com/specimen/Ubuntu+Mono?query=Ubuntu):

  <TextTag text="static" preset="amber" /><TextTag text="sans-serif" /><TextTag text="regular, bold, without italic" preset="green" />

  The way typography is used says as much about our brand as the words themselves. The Ubuntu typeface has been specially created to complement the Ubuntu tone of voice.

  <img src="/posts/misc-programming-fonts/ubuntu-mono.png" alt="Ubuntu Mono" style="width: 100%; height: auto; border-radius: 12px;" />

Then, you can using these font like this:

```json
// 'M PLUS Code Latin' can be replaced by any other Latin fonts listed above
"'Symbols Nerd Font', 'M PLUS Code Latin', 'Source Han Sans TC', monospace"
```

## Font Preview

### Latin vs. CJK

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

50%em Group ("M PLUS Code Latin", "Source Han Sans TC"):

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

### Code


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

50%em Group ("M PLUS Code Latin", "Source Han Sans TC"):

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
