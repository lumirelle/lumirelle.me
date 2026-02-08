---
title: Neovim & LazyVim Manual
date: 2025-12-25T14:48+08:00
update: 2026-01-09T18:19+08:00
lang: en
duration: n/a
type: note
---

[[toc]]

## Neovim & LazyVim

Neovim is a modern fork of Vim, which aims to improve the extensibility and usability of Vim.

LazyVim is a Neovim configuration framework that simplifies the setup and management of Neovim plugins and settings, with it, we can get a out-of-the-box Neovim experience with sensible defaults and powerful features.

## Installation

To install Neovim, I highly recommend using the package manager for your operating system. For example, on Windows, you can use `winget`:

```nu
winget install --id Neovim.Neovim --scope machine
```

To install LazyVim, check your system satisfies [the requirements](https://www.lazyvim.org/#%EF%B8%8F-requirements) first, then just simply follow [the official documentation](https://www.lazyvim.org/installation).

## Basic Usage

[Neovim Quick Reference](https://neovim.io/doc/user/quickref.html).

### Launch Neovim

To launch Neovim and LazyVim, simply open your terminal and type:

```nu
nvim
```

Then you will see the LazyVim dashboard.

To launch Neovim with a specific file, use:

```nu
nvim path/to/your/file
```

Then you will see a editor buffer with the file opened.

### Writing and Quiting

Belows are the common used commands for writing and quiting Neovim:

| Group[^1]    | Command                   | Mode       | Description                                                                                                     |
| ------------ | ------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Write        | `:[range]w[rite][!]`      | Normal[^2] | Write to the current file                                                                                       |
|              | `:[range]w[rite] {file}`  | Normal     | Write to `{file}`, **unless** it already exists                                                                 |
|              | `:[range]w[rite]! {file}` | Normal     | Write to `{file}`, **overwrite** if it already exists                                                           |
|              | `:wa[ll][!]`              | Normal     | Write all **changed** buffers                                                                                   |
| Quit         | `:q[uit]`                 | Normal     | Quit current buffer, **unless changes have been made**;<br>Exit Neovim when there are no other non-help buffers |
|              | `:q[uit]!`                | Normal     | Quit current buffer always, **discard any changes**;<br>Exit Neovim when there are no other non-help buffers    |
|              | `:qa[ll]`                 | Normal     | Exit Vim, **unless changes have been made**                                                                     |
|              | `:qa[ll]!`                | Normal     | Exit Vim always, **discard any changes**                                                                        |
| Write & Quit | `:wq[!]`                  | Normal     | Write the current file and exist                                                                                |
|              | `:wq[!] {file}`           | Normal     | Write to `{file}` and exit                                                                                      |
|              | `:wqall[!]`               | Normal     | Write all **changed** buffers and exit                                                                          |
|              | `:x[it][!] [file]`        | Normal     | Like `:wq` but write **only when changes have been made**                                                       |
|              | `:xa[ll][!]`              | Normal     | Write all **changed** buffers and exit                                                                          |

There are also some shortcuts for writing and quiting Neovim:

| Command | Mode   | Description   |
| ------- | ------ | ------------- |
| `ZZ`    | Normal | Same as `:x`  |
| `ZQ`    | Normal | Same as `:q!` |

[^1]: I use these groups to categorize the commands and help memorize them. There is no "group" concept in Neovim, it's just for learning purpose.

[^2]: This means you should start typing the command in normal mode. For the commands starting with `:`, it will enter command-line mode after you type `:` automatically.

### Motions

> `{motion}` is a cursor movement command. -- [Neovim documentation](https://neovim.io/doc/user/vimindex.html#normal-index)

#### Left-Right Motions

| Group  | Command | Mode   | Description                                       | Also                 |
| ------ | ------- | ------ | ------------------------------------------------- | -------------------- |
| Left   | N `h`   | Normal | Left N characters                                 | `<BS>`, `<Left>`     |
| Right  | N `l`   | Normal | Right N characters                                | `<Space>`, `<Right>` |
| Column | N `\|`  | Normal | To column N                                       |                      |
| Start  | `0`     | Normal | To first character in the line                    | `<Home>`             |
|        | `g0`    | Normal | To first character in **screen line**             |                      |
|        | `^`     | Normal | To first non-blank character in the line          |                      |
|        | `g^`    | Normal | To first non-blank character in **screen line**   |                      |
| End    | N `$`   | Normal | To the next EOL (end of line) position            | `<End>`              |
|        | N `g$`  | Normal | To the next EOL (end of **screen line**) position |                      |
| Middle | `gm`    | Normal | To the middle of **screen line**                  |                      |
|        | `gM`    | Normal | To the middle of the line                         |                      |

#### Up-Down Motions

| Group | Command | Mode   | Description                                                                                                                  | Also     |
| ----- | ------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| Down  | N `j`   | Normal | Down N lines;<br>When N is not given, it behaves the same as `gj` (set by LazyVim)                                           | `<Up>`   |
|       | N `gj`  | Normal | Down N screen lines                                                                                                          | `<Up>`   |
|       | N `+`   | Normal | Down N lines, on the first non-blank character                                                                               |          |
|       | N `_`   | Normal | Down **N - 1** lines, on the first non-blank character                                                                       |          |
| Up    | N `k`   | Normal | Up N lines;<br>When N is not given, it behaves the same as `gk` (set by LazyVim)                                             | `<Down>` |
|       | N `gk`  | Normal | Up N screen lines                                                                                                            |          |
|       | N `-`   | Normal | Up N lines, on the first non-blank character                                                                                 |          |
| Line  | N `G`   | Normal | Goto line N (Default: Last line),<br>on the first non-blank character **if `'startofline'` is enabled**                      |          |
|       | N `gg`  | Normal | Goto line N (Default: First line),<br>on the first non-blank character **if `'startofline'` is enabled**                     |          |
|       | N `%`   | Normal | Goto line N percentage down in the file;<br>**N must be given, otherwise it is another command: [`%`](#findsearch-motions)** |          |

> [!Note]
>
> By default, LazyVim remaps `j` and `k` to `gj` and `gk` when N is not given, which are more recommended for modern usage.

It's highly recommended to enable relative line numbers in Neovim for better line navigation experience.

#### Word Motions

Moving by characters and lines is too slow for most cases, another kind of motions we often use is word motions:

| Group    | Command | Mode   | Description                                               |
| -------- | ------- | ------ | --------------------------------------------------------- |
| Forward  | N `w`   | Normal | N words forward                                           |
|          | N `W`   | Normal | N WORDS **(blank-separated)** forward                     |
|          | N `e`   | Normal | Forward to the end of the Nth word                        |
|          | N `E`   | Normal | Forward to the end of the Nth WORD **(blank-separated)**  |
| Backward | N `b`   | Normal | N words backward                                          |
|          | N `B`   | Normal | N WORDS **(blank-separated)** backward                    |
|          | N `ge`  | Normal | Backward to the end of the Nth word                       |
|          | N `gE`  | Normal | Backward to the end of the Nth WORD **(blank-separated)** |

There is a way can help you remember them easier:

- `w`, `e` are the two adjacent keys on the keyboard, who are both used to move forward. `w` is the left one, which means moving forward to the beginning of word; `e` is the right one, which means moving forward to the end of word
- `b` means "backward" and "beginning", which is used to move backward to the beginning of word
- Move backward to the end of the word is not used so often, we use **goto command** to express the oppsite of `e`: `ge`

#### Bracket Motions

| Group             | Command | Mode   | Description                                                                |
| ----------------- | ------- | ------ | -------------------------------------------------------------------------- |
| Matches           | `%`     | Normal | Find the next brace, bracket, comment in this line,<br>then goto its match |
| Unclosed forward  | N `])`  | Normal | N times forward to unclosed `)`                                            |
|                   | N `]}`  | Normal | N times forward to unclosed `}`                                            |
| Unclosed backward | N `[(`  | Normal | N times backward to unclosed `(`                                           |
|                   | N `[{`  | Normal | N times backward to unclosed `{`                                           |

#### Sentence/Paragraph/Section Motions

| Group     | Command | Mode   | Description                                  |
| --------- | ------- | ------ | -------------------------------------------- |
| Sentence  | N `)`   | Normal | N sentences forward                          |
|           | N `(`   | Normal | N sentences backward                         |
| Paragraph | N `}`   | Normal | N paragraphs forward                         |
|           | N `{`   | Normal | N paragraphs backward                        |
| Section   | N `]]`  | Normal | N sections forward, at **start** of section  |
|           | N `[[`  | Normal | N sections backward, at **start** of section |
|           | N `][`  | Normal | N sections forward, at **end** of section    |
|           | N `[]`  | Normal | N sections backward, at **end** of section   |

#### Other Text Object Motions

| Group         | Command | Mode   | Description                                    |
| ------------- | ------- | ------ | ---------------------------------------------- |
| Block comment | N `[*`  | Normal | N times backward to the start of block comment |
|               | N `]*`  | Normal | N times forward to the end of block comment    |

#### Find/Search Motions

If you have a really long file and want to move to a specific character or word, you can achieve this by find/search motions:

| Group           | Command                       | Mode   | Description                                              |
| --------------- | ----------------------------- | ------ | -------------------------------------------------------- |
| Find forward    | N `f{char}`                   | Normal | To the forward Nth occurrence of `{char}`                |
|                 | N `t{char}`                   | Normal | Till before the forward Nth occurrence of `{char}`       |
| Find backward   | N `F{char}`                   | Normal | To the backward Nth occurrence of `{char}`               |
|                 | N `T{char}`                   | Normal | Till after the backward Nth occurrence of `{char}`       |
| Repeat Find     | N `;`                         | Normal | Repeat the last find N times                             |
|                 | N `,`                         | Normal | Repeat the last find N times in **opposite direction**   |
| Search forward  | N `/{pattern}[/[offset]]<CR>` | Normal | Search forward for the Nth occurrence of `{pattern}`     |
|                 | N `*`                         | Normal | Search forward for the identifier under the cursor       |
|                 | N `g*`                        | Normal | Like `*`, but also find **partial matches**              |
| Search backward | N `?{pattern}[?[offset]]<CR>` | Normal | Search backward for the Nth occurrence of `{pattern}`    |
|                 | N `#`                         | Normal | Search backward for the identifier under the cursor      |
|                 | N `g#`                        | Normal | Like `#`, but also find **partial matches**              |
| Repeat Search   | N `n`                         | Normal | Repeat the last search N times                           |
|                 | N `N`                         | Normal | Repeat the last search N times in **opposite direction** |

There are also some useful find/search motions for coding:

| Group              | Command | Mode   | Description                                               |
| ------------------ | ------- | ------ | --------------------------------------------------------- |
| Search declaration | `gd`    | Normal | Goto **local** declaration of identifier under the cursor |
|                    | `gD`    | Normal | Goto **global** definition of identifier under the cursor |

#### Mark/Jump Motions

| Group | Command               | Mode   | Description                                                                                   |
| ----- | --------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Mark  | `m{a-zA-Z}`           | Normal | Mark current position with mark `{a-zA-Z}`;<br>Lowercase for file-local, uppercase for global |
|       | `:marks`              | Normal | Print the active marks                                                                        |
|       | `` `{a-z} ``          | Normal | Goto mark `{a-z}` within **the current file**                                                 |
|       | `` `{A-Z} ``          | Normal | Goto mark `{A-Z}` in **any file**                                                             |
|       | `` `{0-9[]'"<>.} ``   | Normal | Goto the mark `{0-9[]'"<>.}`                                                                  |
|       | `'{a-zA-Z0-9[]'"<>.}` | Normal | Same as `` `{a-zA-Z0-9[]'"<>.} ``,<br>but on the first non-blank character in the line        |
| Jump  | N `Ctrl-O`            | Normal | Goto Nth older position in jump list                                                          |
|       | N `Ctrl-I`            | Normal | Goto Nth newer position in jump list                                                          |
|       | `:ju[mps]`            | Normal | Print the jump list                                                                           |

### Scrolling

| Group          | Command      | Mode   | Description                       | Also    |
| -------------- | ------------ | ------ | --------------------------------- | ------- |
| Forward        | N `<Ctrl-E>` | Normal | Window N lines forward (downward) |         |
|                | N `<Ctrl-D>` | Normal | Window N half pages forward       |         |
|                | N `<Ctrl-F>` | Normal | Window N pages forward            |         |
| Backward       | N `<Ctrl-Y>` | Normal | Window N lines backward (upward)  |         |
|                | N `<Ctrl-U>` | Normal | Window N half pages backward      |         |
|                | N `<Ctrl-B>` | Normal | Window N pages backward           |         |
| Current window | `zt`         | Normal | Current line at top of window     | `z<CR>` |
|                | `zz`         | Normal | Current line at center of window  | `z.`    |
|                | `zb`         | Normal | Current line at bottom of window  | `z-`    |

### Switch Window/Buffer

| Group  | Command | Mode   | Description                 |
| ------ | ------- | ------ | --------------------------- |
| Window | `<C-h>` | Normal | Move to the left window     |
|        | `<C-j>` | Normal | Move to the window below    |
|        | `<C-k>` | Normal | Move to the window above    |
|        | `<C-l>` | Normal | Move to the right window    |
| Buffer | `H`     | Normal | Move to the previous buffer |
|        | `L`     | Normal | Move to the next buffer     |

### Editing

#### Enter Insert Mode

| Group    | Command | Mode   | Description                                                            | Also       |
| -------- | ------- | ------ | ---------------------------------------------------------------------- | ---------- |
| Append   | N `a`   | Normal | Append text after the cursor (N times)                                 |            |
|          | N `A`   | Normal | Append text at EOL (N times)                                           |            |
| Insert   | N `i`   | Normal | Insert text before the cursor (N times)                                | `<Insert>` |
|          | N `I`   | Normal | Insert text before the first non-blank character of the line (N times) |            |
|          | N `gI`  | Normal | Insert text at the beginning of the line (N times)                     |            |
| New line | N `o`   | Normal | Open a new line below the current line, append text (N times)          |            |
|          | N `O`   | Normal | Open a new line above the current line, insert text (N times)          |            |

Use `<esc>` to exit insert mode and return to normal mode.

#### Copy and Paste

<!-- TODO(Lumirelle): -->

- `y<motion>`: Yank (copy) text specified by the `<motion>` (e.g., `cw` changes a word, `c3j` changes three lines down)

  > [!Note]
  >
  > The `<motion>` is one of the motion commands we mentioned before (Of course, except for screen, buffer, window movements). For example: `yw` yanks to the next end of word, `y2w` yanks to the second next end of word.
  >
  > There are two special modifiers when using motion commands with others: `i` and `a`. Different to numbers, they means `inside` and `around`. For example, `yiw` yanks inside the word (without spaces), `yaw` yanks around the word (with spaces).

- `yy`: Yank (copy) the current line
- `p`: Paste the yanked text after the cursor
- `P`: Paste the yanked text before the cursor

#### Delete

To delete text without entering insert mode, you can use the following commands:

- `x`: Delete the character under the cursor
- `X`: Delete the character before the cursor
- `d<motion>`: Delete text specified by the `<motion>`
- `dd`: Delete the current line
- `D`: Delete from the cursor position to the end of the line
- `c<motion>`: Delete text specified by the `<motion>`, enter insert mode
- `cc`: Delete (replace) the current line, enter insert mode
- `C`: Delete from the cursor position to the end of the line, enter insert mode

#### Replace

To replace characters without entering insert mode, you can use the following commands:

- `r{char}`: Replace the character under the cursor with `{char}`
- `R`: Enter replace mode, where you can overwrite existing text
  e

#### Undo and Redo

- `u`: Undo the last change
- `<C-r>`: Redo the last undone change

#### Move Lines Up/Down

To move the current line up or down, you can use:

- `A-j`: Move the current line down by one line
- `A-k`: Move the current line up by one line

#### Comment/Uncomment Code

- `gc<motion>` : Toggle comment for the selected lines specified by `<motion>`
- `gcc` : Toggle comment for the current line

### Other Useful Commands

#### Fold/Unfold Code

To fold or unfold code blocks, you can use the following commands:

- `za`: Toggle fold
- `zA`: Toggle fold recursively
- `zM`: Fold all
- `zR`: Unfold all
