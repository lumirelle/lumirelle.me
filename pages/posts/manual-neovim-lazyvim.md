---
title: Neovim & LazyVim Manual
date: 2025-12-25T14:48+08:00
update: 2026-02-09T11:54+08:00
lang: en
duration: 23min
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

#### Text Object Motions (Only for Visual Mode or after Operator)

| Group     | Command    | Mode | Description                                             |
| --------- | ---------- | ---- | ------------------------------------------------------- |
| Word      | N `aw`     | /    | Select a word                                           |
|           | N `iw`     | /    | Select inner word (Without leading and trailing spaces) |
|           | N `aW`     | /    | Select a WORD (Blank-separated)                         |
|           | N `iW`     | /    | Select inner WORD (Without leading and trailing spaces) |
| Sentence  | N `as`     | /    | Select a sentence                                       |
|           | N `is`     | /    | Select inner sentence                                   |
| Paragraph | N `ap`     | /    | Select a paragraph                                      |
|           | N `ip`     | /    | Select inner paragraph                                  |
| Block     | N `ab`     | /    | Select a block (from `[(` to `)]`)                      |
|           | N `ib`     | /    | Select inner block (from `[(` to `)]`)                  |
|           | N `aB`     | /    | Select a Block (from `[{` to `]}`)                      |
|           | N `iB`     | /    | Select inner Block (from `[{` to `]}`)                  |
|           | N `a>`     | /    | Select a `<>` block                                     |
|           | N `i>`     | /    | Select inner `<>` block                                 |
|           | N `at`     | /    | Select a tag block (from `<xxx>` to `</xxx>`)           |
|           | N `it`     | /    | Select inner tag block (from `<xxx>` to `</xxx>`)       |
| String    | N `a'`     | /    | Select a single-quoted string                           |
|           | N `i'`     | /    | Select inner of a single-quoted string                  |
|           | N `a"`     | /    | Select a double-quoted string                           |
|           | N `i"`     | /    | Select inner of a double-quoted string                  |
|           | N `` a` `` | /    | Select a backtick-quoted string                         |
|           | N `` i` `` | /    | Select inner of a backtick-quoted string                |

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

### Window/Buffer

#### Split Window

| Group  | Command     | Mode   | Description                                             |
| ------ | ----------- | ------ | ------------------------------------------------------- |
| Window | `<Ctrl-W>s` | Normal | Split the current window horizontally                   |
| Window | `<Ctrl-W>v` | Normal | Split the current window vertically<br>(Set by Lazyvim) |

#### Switch Window/Buffer

| Group  | Command    | Mode   | Description                 |
| ------ | ---------- | ------ | --------------------------- |
| Window | `<Ctrl-H>` | Normal | Move to the left window     |
|        | `<Ctrl-J>` | Normal | Move to the window below    |
|        | `<Ctrl-K>` | Normal | Move to the window above    |
|        | `<Ctrl-L>` | Normal | Move to the right window    |
| Buffer | `H`        | Normal | Move to the previous buffer |
|        | `L`        | Normal | Move to the next buffer     |

### Visual Selection

| Group     | Command | Mode   | Description                        |
| --------- | ------- | ------ | ---------------------------------- |
| Character | `v`     | Normal | Start visual mode                  |
| Line      | `V`     | Normal | Start linewise visual mode         |
| Block     | `<C-v>` | Normal | Start blockwise visual mode        |
| Restore   | `gv`    | Normal | Reselect the last visual selection |

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

Use `<Esc>` to exit insert mode and return to normal mode.

#### Special Keys in Insert Mode

| Group  | Command              | Mode   | Description                                                           |
| ------ | -------------------- | ------ | --------------------------------------------------------------------- |
| Insert | `<Ctrl-A>`           | Insert | Insert previously inserted text                                       |
|        | `<Ctrl-@>`           | Insert | Insert previously inserted text and stop insert mode                  |
|        | `<Ctrl-R>{register}` | Insert | Insert the contents of `{register}`                                   |
| Delete | `<Ctrl-W>`           | Insert | Delete word before the cursor                                         |
|        | `<Ctrl-U>`           | Insert | Delete all entered characters in the current line                     |
| Indent | `<Ctrl-T>`           | Insert | Indent in front of the line                                           |
|        | `<Ctrl-D>`           | Insert | Unindent in front of the line                                         |
|        | 0 `<Ctrl-D>`         | Insert | Delete all indent in the current line                                 |
|        | ^ `<Ctrl-D>`         | Insert | Delete all indent in the current line,<br>restore indent in next line |

#### Delete

| Group            | Command         | Mode   | Description                                        | Also    |
| ---------------- | --------------- | ------ | -------------------------------------------------- | ------- |
| Character Delete | N `x`           | Normal | Delete N characters under and after the cursor     | `<Del>` |
|                  | N `X`           | Normal | Delete N characters before the cursor              |         |
| General Delete   | N `d{motion}`   | Normal | Delete the text that is moved over with `{motion}` |         |
|                  | N `dd`          | Normal | Delete N lines                                     |         |
|                  | N `D`           | Normal | Delete to the end of the line (and N-1 more lines) |         |
|                  | `d`             | Visual | Delete the selected text                           |         |
| Join             | N `J`           | Normal | Join N-1 lines (Delete EOLs)                       |         |
|                  | N `gJ`          | Normal | Like `J`, but without inserting spaces             |         |
|                  | `J`             | Visual | Join the selected lines                            |         |
|                  | `gJ`            | Visual | Like `J`, but without inserting spaces             |         |
| Range Delete     | `:[range]d [x]` | Normal | Delete [range] lines [into register x]             |         |

To delete text without entering insert mode, you can use the following commands:

- `x`: Delete the character under the cursor
- `X`: Delete the character before the cursor
- `d<motion>`: Delete text specified by the `<motion>`
- `dd`: Delete the current line
- `D`: Delete from the cursor position to the end of the line
- `c<motion>`: Delete text specified by the `<motion>`, enter insert mode
- `cc`: Delete (replace) the current line, enter insert mode
- `C`: Delete from the cursor position to the end of the line, enter insert mode

#### Register, Yank and Put

| Group    | Command           | Mode   | Description                                               |
| -------- | ----------------- | ------ | --------------------------------------------------------- |
| Register | `"{register}`     | Normal | Use `{register}` for the next delete, yank, or put        |
|          | `:reg`            | Normal | Show the contents of all registers                        |
|          | `:reg {register}` | Normal | Show the contents of `{register}`                         |
| Yank     | N `y{motion}`     | Normal | Yank the text moved over with `{motion}` into a register  |
|          | N `yy`            | Normal | Yank N lines into a register                              |
|          | N `Y`             | Normal | Yank N lines into a register<br>Mapped to `y$` by default |
|          | `y`               | Visual | Yank the selected text into a register                    |
| Put      | N `p`             | Normal | Put a register after the cursor position (N times)        |
|          | N `]p`            | Normal | Like `p`, but adjust indent to current line               |
|          | N `gp`            | Normal | Like `p`, but leave the cursor after the new text         |
|          | N `P`             | Normal | Put a register before the cursor position (N times)       |
|          | N `[p`            | Normal | Like `P`, but adjust indent to current line               |
|          | N `gP`            | Normal | Like `P`, but leave the cursor after the new text         |

#### Replace and Change

| Group                               | Command        | Mode         | Description                                                                      |
| ----------------------------------- | -------------- | ------------ | -------------------------------------------------------------------------------- |
| Replace                             | N `r{char}`    | Normal       | Replace N characters with `{char}`                                               |
|                                     | N `gr{char}`   | Normal       | Replace N characters without affecting layout                                    |
|                                     | `r{char}`      | Visual       | Replace the each char of the selected text with `{char}`                         |
| Replace mode                        | N `R`          | Normal       | Enter **replace mode** (Repeat the entered text N times)                         |
|                                     | N `gR`         | Normal       | Enter **virtual replace mode** (Like replace mode, but without affecting layout) |
| Change (Delete & enter insert mode) | N `c{motion}`  | Normal       | Change the text that is moved over with `{motion}`                               |
|                                     | N `cc`         | Normal       | Change N lines                                                                   |
|                                     | N `C`          | Normal       | Change to the EOL (and N-1 more lines)                                           |
|                                     | `c`            | Visual       | Change the selected text                                                         |
|                                     | `c`            | Visual block | Change each of the selected lines with the entered text                          |
|                                     | `C`            | Visual       | Change each of the selected lines until EOL with the entered text                |
| Switch case                         | N `~`          | Normal       | Switch case for N characters and advance cursor                                  |
|                                     | `g~{motion}`   | Normal       | Switch case for the text that is moved over with `{motion}`                      |
|                                     | `~`            | Visual       | Switch case for selected text                                                    |
|                                     | `gu{motion}`   | Normal       | Make the text that is moved over with `{motion}` lowercase                       |
|                                     | `u`            | Visual       | Make the selected text lowercase                                                 |
|                                     | `gU{motion}`   | Normal       | Make the text that is moved over with `{motion}` uppercase                       |
|                                     | `U`            | Visual       | Make the selected text uppercase                                                 |
| Move                                | N `Alt-j`      | Normal       | Move the current line down N times                                               |
|                                     | N `Alt-k`      | Normal       | Move the current line up N times                                                 |
| Number                              | N `<Ctrl-A>`   | Normal       | Add N to the number at or after the cursor                                       |
|                                     | N `<Ctrl-X>`   | Normal       | Subtract N from the number at or after the cursor                                |
| Indent                              | N `>{motion}`  | Normal       | Indent the lines that are moved over with `{motion}`                             |
|                                     | N `>>`         | Normal       | Indent N lines                                                                   |
|                                     | N `<`{motion}` | Normal       | Unindent the lines that are moved over with `{motion}`                           |
|                                     | N `<<`         | Normal       | Unindent N lines                                                                 |
| Format                              | N `={motion}`  | Normal       | Autoformat the lines that are moved over with `{motion}`                         |
|                                     | N `==`         | Normal       | Autoformat N lines                                                               |
| Comment                             | N `gc{motion}` | Normal       | Comment the lines that are moved over with `{motion}`                            |
|                                     | N `gcc`        | Normal       | Comment N lines                                                                  |

#### Undo and Redo

| Group | Command      | Mode   | Description                |
| ----- | ------------ | ------ | -------------------------- |
| Undo  | N `u`        | Normal | Undo last N changes        |
|       | `U`          | Normal | Undo last changed line     |
| Redo  | N `<Ctrl-R>` | Normal | Redo last N undone changes |

#### Multi Cursor

In Neovim, you can start multi cursor only from blockwise visual mode, with plugin `multicursor.nvim`, we can accomplish this in any visual mode:

| Group  | Command | Mode   | Description                                                                   |
| ------ | ------- | ------ | ----------------------------------------------------------------------------- |
| Match  | `<C-n>` | Normal | Create multi cursor at the next occurrence of the current selection           |
| Insert | `I`     | Visual | Create multi cursor at the beginning of each selected line, enter insert mode |
| Append | `A`     | Visual | Create multi cursor at the end of each selected line, enter insert mode       |

> [!Note]
>
> For Neovim in VSCode, there is a better plugin called `vscode-neovim-multicursor`, which can trigger VSCode's native multi cursor feature, so we use it instead of `multicursor.nvim` in VSCode environment.
>
> They two have different behaviors and default keybindings (Although we will remap them to be the most similar as possible), you can check their documentation for more details.

### Repeat Command

| Group   | Command    | Mode   | Description                                           |
| ------- | ---------- | ------ | ----------------------------------------------------- |
| Repeat  | N `.`      | Normal | Repeat the last change (With count replaced with N)   |
| Record  | `q{a-z}`   | Normal | Record typed characters into register `{a-z}`         |
|         | `q{A-Z}`   | Normal | Record typed characters, appended to register `{a-z}` |
|         | `q`        | Normal | Stop recording                                        |
|         | `Q`        | Normal | Replay last recorded macro                            |
| Execute | N `@{a-z}` | Normal | Execute the contents of register `{a-z}` (N times)    |
|         | N `@@`     | Normal | Repeat previous register execution (N times)          |
| Sleep   | N `gs`     | Normal | Goto sleep for N seconds                              |

### Other Useful Commands

#### Fold/Unfold Code

| Group        | Command | Mode   | Description                                           |
| ------------ | ------- | ------ | ----------------------------------------------------- |
| Toggle       | `za`    | Normal | Toggle fold under the cursor<br>(Set by Lazyvim)      |
|              | `zA`    | Normal | Toggle all folds under the cursor<br>(Set by Lazyvim) |
| Fold level   | `zm`    | Normal | Fold more, decrease `'foldlevel'`                     |
|              | `zM`    | Normal | Fold all, set `'foldlevel'` to 0                      |
| Unfold level | `zr`    | Normal | Unfold more, increase `'foldlevel'`                   |
|              | `zR`    | Normal | Unfold all, set `'foldlevel'` to max                  |

#### Version Information

| Group | Command      | Mode   | Description              |
| ----- | ------------ | ------ | ------------------------ |
| Info  | `:ve[rsion]` | Normal | Show version information |
