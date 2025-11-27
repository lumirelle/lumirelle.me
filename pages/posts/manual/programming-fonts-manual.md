---
title: Programming Fonts Manual
date: 2025-10-15T14:10+08:00
update: 2025-11-27T10:48+08:00
lang: en
duration: 5min
type: blog+note
---

[[toc]]

## Monospace Fonts

As we all know, monospace fonts are necessary for us to programming.

As a Chinese, sometimes I have to use both Latin characters and CJK characters in my projects. So I need to pay more attention to the width of the fonts, in order to let the width of 2 Latin characters = 1 CJK character.

I categorize the fonts I used into two groups by character width:

- 50%: If the font size is 16px, one Latin character will be 8px (50%), and one CJK character will be 16px (50% \* 2), like "M Plus Code Latin 50" and "Source Han Sans TC", etc.
- 60%: If the font size is 16px, one Latin character will be 9.6px (60%), and one CJK character will be 19.2px (60% \* 2), like "Go Mono" and "Maple Font", etc.

Every group has more than one Latin font and at least one CJK font.

## 50% Group

In this group, I use ["Source Hans Sans TC"](https://github.com/adobe-fonts/source-han-sans/releases) as the CJK font.

And Latin fonts have more choice:

- ["Inconsolata"](https://github.com/google/fonts/tree/main/ofl/inconsolata/static):

  <TextTag text="NEED TRIAL..." preset="purple" />

  A huge font family with many weights and italicable[^1].

- ["Iosevka" (Monospace, Default)](https://github.com/be5invis/Iosevka/releases):

  <TextTag text="NEED TRIAL..." preset="purple" />

  A huge font family with many weights and italicable.

- ["M Plus Code Latin 50"](https://github.com/coz-m/MPLUS_FONTS/tree/master/fonts):

  <TextTag text="NARROW" /><TextTag text="NO SLAB" preset="amber" /><TextTag text="CARTOON" preset="green" />

  **7 weights from `Thin` to `Bold`, not italicable. (Which I preferred)**

- ["Binchotan Sharp"](https://fontesk.com/binchotan-font/):

  <TextTag text="TINY" /><TextTag text="NEED TRIAL..." preset="purple" />

  `Regular`, not italicable.

- ["Lekton"](http://www.fontsquirrel.com/fonts/lekton):

  <TextTag text="TINY" /><TextTag text="THIN" /><TextTag text="NO SLAB" preset="amber" />

  `Regular`, `Bold`, not italicable (Only has `Italic` which is corresponding to `Regular`).

- ["Monofur"](http://www.dafont.com/monofur.font):

  <TextTag text="ROUNDED" /><TextTag text="TINY" /><TextTag text="THIN" /><TextTag text="NO SLAB" preset="amber" /><TextTag text="CARTOON" preset="green" />

  `Regular`, italicable.

- ["NanumGothicCoding"](https://github.com/naver/nanumfont):

  <TextTag text="ROUNDED" /><TextTag text="NARROW" /><TextTag text="TINY" /><TextTag text="THIN" /><TextTag text="NO SLAB" preset="amber" />

  `Regular`, `Bold`, not italicable.

- ["Ubuntu Mono"](https://fonts.google.com/specimen/Ubuntu+Mono?query=Ubuntu):

  <TextTag text="ROUNDED" /><TextTag text="TINY" /><TextTag text="NO SLAB" preset="amber" />

  `Regular`, `Bold`, and italicable.

For my opinion, better eyeshield is the most important thing. So I prefer to use the first three fonts as they are in general size.

Then, you can using these font like this:

```json
// 'M Plus Code Latin 50' can be replaced by any other Latin fonts listed above
"'M Plus Code Latin 50', 'Source Han Sans TC', 'Symbols Nerd Font', monospace"
```

## 60% Group

In this group, I use ["Maple Mono CN (Ligature)"](https://github.com/subframe7536/maple-font/releases) as the CJK font.

> [!Note]
>
> "Maple Mono CN" itself is a monospace font, so you can use it alone if you want.

And Latin fonts have more choice:

- ["Adwaita Mono"](https://gitlab.gnome.org/GNOME/adwaita-fonts/-/tree/main/mono?ref_type=heads):

  <TextTag text="CONVENTIONAL" preset="red" /><TextTag text="NEED TRIAL..." preset="purple" />

  Regular, Bold, italicable, but a little bit conventional.

- ["Geist"](https://github.com/vercel/geist-font/releases):

  <TextTag text="ROUNDED" /><TextTag text="NO SLAB" preset="amber" /><TextTag text="NEED TRIAL..." preset="purple" />

  A beautiful font designed by Vercel. 9 weights, italicable.

- ["Go Mono"](https://go.googlesource.com/image/+/refs/heads/master/font/gofont/ttfs/):

  <TextTag text="ROUNDED" /><TextTag text="SLAB" preset="amber" />

  A beautiful font designed by Google. Regular, Bold, and italicable.

- ["Google Sans Code"](https://github.com/googlefonts/googlesans-code/releases):

  <TextTag text="ROUNDED" /><TextTag text="NO SLAB" preset="amber" />

  A beautiful font designed by Google, too. 6 weights, italicable.

  > [!Caution]
  >
  > If you are using Windows 10, please download the font files from Google Fonts, instead of Github.
  >
  > See the [issue](https://github.com/googlefonts/googlesans-code/issues/23) for more details.

- ["Rec Mono Casual"](https://github.com/arrowtype/recursive/releases):

  <TextTag text="ROUNDED" /><TextTag text="SLAB" preset="amber" /><TextTag text="CASUAL" preset="red" />

  A recursive & casual font. Regular, Bold, italicable.

- ["Monaspace Xenon"](https://github.com/githubnext/monaspace/releases):

  <TextTag text="SLAB" preset="amber" />

  **A beautiful font designed by GitHub. (Which I preferred)**

  > [!Caution]
  >
  > The real width of this font is 62%, not 60% exactly, so there will be some difference between the Latin and CJK characters.

Then, you can using these font like this:

```json
// 'Monaspace Xenon' can be replaced by any other Latin fonts listed above
"'Symbols Nerd Font', 'Monaspace Xenon', 'Maple Mono CN', monospace"
```

## Font Preview

### Latin vs. CJK Characters

<div font="*:percent60!">

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

<div font="*:percent60!">

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

[^1]: Italicable means every font weight has a corresponding italic style.
