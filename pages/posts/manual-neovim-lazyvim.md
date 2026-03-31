---
title: Neovim and LazyVim Manual
date: 2025-12-25T14:48+08:00
update: 2026-03-31T15:29+08:00
lang: en
duration: 26min
type: note
---

[[toc]]

## Neovim & LazyVim

Neovim is a modern fork of Vim, which aims to improve the extensibility and usability of Vim.

LazyVim is a Neovim configuration framework that simplifies the setup and management of Neovim plugins and settings, with it, we can get a out-of-the-box Neovim experience with sensible defaults and powerful features.

## Installation

To install Neovim, I highly recommend using the package manager for your operating system. For example, on Windows, you can use `winget`:

```nu
# Command `sudo` is powered by gsudo
sudo winget add -e --id Neovim.Neovim --scope machine
```

To install LazyVim, make sure your system satisfies [the requirements](https://www.lazyvim.org/#%EF%B8%8F-requirements) first, then just simply follow [the official documentation](https://www.lazyvim.org/installation).

## Basic Usage

[Neovim Quick Reference](https://neovim.io/doc/user/quickref.html).

### Launch Neovim

To launch Neovim and LazyVim, simply open your terminal and type:

```nu
nvim
```

Then you will see the LazyVim dashboard. The first time you open that dashboard, LazyVim will automatically setup the plugins for you, which may take a while. After that, you can start using Neovim and LazyVim.

To launch Neovim with a specific file, use:

```nu
nvim path/to/your/file
```

Then you will see a editor buffer with the file opened.

### Modes

Neovim has several modes, the most commonly used ones are:

- **Normal mode**: The default mode, used for navigation and manipulation of text.
- **Insert mode**: Used for inserting text.
- **Visual mode**: Used for selecting text.
- **Command-line mode**: Used for executing commands.
- **Terminal mode**: Used for running terminal commands.

### Write & Quit

Belows are the commonly used commands for writing and quitting Neovim:

| Group[^1] | Command | Mode | Description |
| -- | -- | -- | -- |
| Write | `:[{range}]w[rite][!]` | Normal, Visual[^2] | Write **current buffer** to the current file. The `{range}` can be produced by Visual mode |
|  | `:[{range}]w[rite][!] {file}` | Normal, Visual | Write **current buffer** to `{file}`, **unless / overwrite if** it already exists, which depends on the presence of `[!]` |
|  | `:wa[ll][!]` | Normal, Visual | Write **all buffers** |
| Quit | `:q[uit][!]` | Normal, Visual | Quit **current buffer**, **unless / discard** changes made, which depends on the presence of `[!]`. Exit Neovim when there is not any other non-help buffer |
|  | `:qa[ll][!]` | Normal, Visual | Quit **all buffers** (so this will cause Neovim to exit directly), **unless / discard** changes made, which depends on the presence of `[!]` |
| Write & Quit | `:wq[!]` | Normal, Visual | The combination of `:w` and `:q`, write current buffer to current file, then quit that buffer |
|  | `:wq[!] {file}` | Normal, Visual | Write current buffer to `{file}` and exit that buffer |
|  | `:wqall[!]` | Normal, Visual | Write **all buffers** and exit those buffers (will cause Neovim to exit directly) |
|  | `:x[it][!]` | Normal, Visual | **When changes** have been made, equivalent to `:wq`; Otherwise, equivalent to `:q` |
|  | `:x[it][!] {file}` | Normal, Visual | **When changes** have been made, equivalent to `:wq {file}`; Otherwise, equivalent to `:q` |
|  | `:xa[ll][!]` | Normal, Visual | Write **all changed buffers** and exit |

There are also some shortcuts for write and quit commands:

| Command | Mode | Description |
| -- | -- | -- |
| `ZZ` | Normal | Shortcut for `:x` |
| `ZQ` | Normal | Shortcut for `:q!` |

[^1]: I use these groups to categorize the commands and help memorize them. There is no "group" concept in Neovim, it's just for learning purpose.
[^2]: This means you should start typing the command in the referred mode(s). For the commands starting with `:`, it will enter command-line mode after you type `:` directly.

### Motions

Motions are the commands that help us navigate through the text. Most of them are used in normal mode, and some of them can also be used with other operators targeting a range of text, such as delete, yank, etc.

> `motion` is a cursor movement command. -- [Neovim documentation](https://neovim.io/doc/user/vimindex.html#normal-index)

#### Left-Right Motions

| Group | Command | Mode | Description | Also |
| -- | -- | -- | -- | -- |
| Left | N `h` | Normal, Visual | Move left N characters | `<BS>`, `<Left>` |
| Right | N `l` | Normal, Visual | Move right N characters | `<Space>`, `<Right>` |
| Line start | `0` | Normal, Visual | To first character in the line | `<Home>` |
|  | `g0` | Normal, Visual | To first character in **screen line** |  |
|  | `^` | Normal, Visual | To first non-blank character in the line |  |
|  | `g^` | Normal, Visual | To first non-blank character in **screen line** |  |
| Line end | N `$` | Normal, Visual | To the next EOL (end of line) position | `<End>` |
|  | N `g$` | Normal, Visual | To the next EOL (end of **screen line**) position |  |
| Line middle | `gM` | Normal, Visual | To the middle of the line |  |
|  | `gm` | Normal, Visual | To the middle of **screen line** |  |

#### Up-Down Motions

| Group | Command | Mode | Description | Also |
| -- | -- | -- | -- | -- |
| Down | N `j` | Normal, Visual | Move down N lines;<br>When N is not given, it behaves the same as `gj` (set by LazyVim) | `<Up>` |
|  | N `gj` | Normal, Visual | Move down N **screen lines** | `<Up>` |
|  | N `+` | Normal, Visual | Move down N lines, on the **first non-blank character** |  |
|  | N `_` | Normal, Visual | Move down **N - 1** lines, on the **first non-blank character** |  |
| Up | N `k` | Normal, Visual | Move up N lines;<br>When N is not given, it behaves the same as `gk` (set by LazyVim) | `<Down>` |
|  | N `gk` | Normal, Visual | Move up N **screen lines** |  |
|  | N `-` | Normal, Visual | Move up N lines, on the **first non-blank character** |  |
| Line | N `G` | Normal, Visual | Goto line N (Default: Last line),<br>on the **first non-blank character if `'startofline'` is enabled** |  |
|  | N `gg` | Normal, Visual | Goto line N (Default: First line),<br>on the **first non-blank character if `'startofline'` is enabled** |  |
|  | N `%` | Normal, Visual | Goto line N percentage down in the file;<br>**N must be given, otherwise it is another command: [`%`](#find-search-motions)** |  |

> [!Note]
>
> By default, LazyVim remaps `j` and `k` to `gj` and `gk` when N is not given (or `0`), which are more recommended for modern usage.
>
> Also, it's highly recommended to enable relative line numbers in Neovim for better line navigation experience.

#### Word Motions

Moving by characters and lines is too slow for most cases, another kind of motions we often use is text object motions. Words are the most commonly used text objects, both writing and programming:

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Forward | N `w` | Normal, Visual | N words forward |
|  | N `W` | Normal, Visual | N WORDS **(blank-separated)** forward |
|  | N `e` | Normal, Visual | Forward to the end of the Nth word |
|  | N `E` | Normal, Visual | Forward to the end of the Nth WORD **(blank-separated)** |
| Backward | N `b` | Normal, Visual | N words backward |
|  | N `B` | Normal, Visual | N WORDS **(blank-separated)** backward |
|  | N `ge` | Normal, Visual | Backward to the end of the Nth word |
|  | N `gE` | Normal, Visual | Backward to the end of the Nth WORD **(blank-separated)** |

There is a way can help you remember them easier, if you are [LTR writing system](https://en.wikipedia.org/wiki/Left-to-right) user:

- `w`, `e` are the two adjacent keys on the keyboard, who are both used to move **forward**. `w` is the **left one**, which means moving forward to the **beginning of word**; `e` is the **right one**, which means moving forward to the **end of word**
- `b` means **"backward" & "beginning"**, which is used to move backward to the beginning of word
- We often use goto command to express the opposite / switch state, so: `ge` means move **backward** to the **end** of word

#### Bracket / Comment Motions

In programming, brackets (including parentheses, (curly) braces & (square) brackets), and (block) comments are also one of the commonly used text objects, they all have opening and closing pairs:

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| General | N `[*` | Normal, Visual | N times backward to the start of block comment |
|  | N `]*` | Normal, Visual | N times forward to the end of block comment |
| Matched | `%` | Normal, Visual | Find the **next** parenthesis, brace, bracket, block comment opening or closing **in this line**, then goto its match |
| Unclosed | N `]%` | Normal, Visual | N times forward to the **next unclosed** parenthesis, brace, bracket, block comment |
|  | N `[%` | Normal, Visual | N times backward to the **previous unclosed** parenthesis, brace, bracket, block comment |
|  | N `])` | Normal, Visual | N times forward to unclosed `)` |
|  | N `[(` | Normal, Visual | N times backward to unclosed `(` |
|  | N `]}` | Normal, Visual | N times forward to unclosed `}` |
|  | N `[{` | Normal, Visual | N times backward to unclosed `{` |

#### Sentence / Paragraph / Section Motions

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Sentence | N `)` | Normal, Visual | N sentences forward |
|  | N `(` | Normal, Visual | N sentences backward |
| Paragraph | N `}` | Normal, Visual | N paragraphs forward |
|  | N `{` | Normal, Visual | N paragraphs backward |
| Section | N `]]` | Normal, Visual | N sections forward, at **start** of section. Section are defined by file-specific markers, usually requiring additional plugins |
|  | N `[[` | Normal, Visual | N sections backward, at **start** of section |
|  | N `][` | Normal, Visual | N sections forward, at **end** of section |
|  | N `[]` | Normal, Visual | N sections backward, at **end** of section |

#### Text Object Motions with Other Operators

These special text object motions used with other operators are often start with `i` (inner) or `a` (around), which means whether to include the leading and trailing characters:

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Word | N `iw` | / | Select a word |
|  | N `aw` | / | Select around a word (With leading and trailing spaces) |
|  | N `iW` | / | Select a WORD |
|  | N `aW` | / | Select around a WORD (With leading and trailing spaces) |
| Sentence | N `is` | / | Select a sentence |
|  | N `as` | / | Select around a sentence (With leading and trailing spaces) |
| Paragraph | N `ip` | / | Select a paragraph |
|  | N `ap` | / | Select around a paragraph (With leading and trailing spaces) |
| Block | N `ib` | / | Select a block (from `[(` to `)]`) |
|  | N `ab` | / | Select around a block (from `[(` to `)]`, with opening and closing brackets) |
|  | N `iB` | / | Select a Block (from `[{` to `]}`) |
|  | N `aB` | / | Select around a Block (from `[{` to `]}`), with opening and closing brackets |
|  | N `i>` | / | Select a `<>` block |
|  | N `a>` | / | Select around a `<>` block, with opening and closing brackets |
|  | N `it` | / | Select a tag block (from `<xxx>` to `</xxx>`) |
|  | N `at` | / | Select around a tag block (from `<xxx>` to `</xxx>`), with opening and closing tags |
| String | N `i'` | / | Select a '-quoted string |
|  | N `a'` | / | Select around a '-quoted string |
|  | N `i"` | / | Select a "-quoted string |
|  | N `a"` | / | Select around a "-quoted string |
|  | N `` i` `` | / | Select a `-quoted string |
|  | N `` a` `` | / | Select around a `-quoted string |

#### Find & Search Motions <a name="find-search-motions"></a>

If you have a really long file and want to move to a specific character or word, you can achieve this by find/search motions:

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Find forward | N `f{char}` | Normal, Visual | To the forward Nth occurrence of `{char}` |
|  | N `t{char}` | Normal, Visual | Till before the forward Nth occurrence of `{char}` |
| Find backward | N `F{char}` | Normal, Visual | To the backward Nth occurrence of `{char}` |
|  | N `T{char}` | Normal, Visual | Till after the backward Nth occurrence of `{char}` |
| Repeat Find | N `;` | Normal, Visual | Repeat the last find N times |
|  | N `,` | Normal, Visual | Repeat the last find N times in **opposite direction** |
| Search forward | N `/{pattern}[/[{offset}]]<CR>` | Normal, Visual | Search forward for the Nth occurrence of `{pattern}` |
|  | N `*` | Normal, Visual | Search forward for the identifier under the cursor |
|  | N `g*` | Normal, Visual | Like `*`, but also find **partial matches** |
| Search backward | N `?{pattern}[?[{offset}]]<CR>` | Normal, Visual | Search backward for the Nth occurrence of `{pattern}` |
|  | N `#` | Normal, Visual | Search backward for the identifier under the cursor |
|  | N `g#` | Normal, Visual | Like `#`, but also find **partial matches** |
| Repeat Search | N `n` | Normal, Visual | Repeat the last search N times |
|  | N `N` | Normal, Visual | Repeat the last search N times in **opposite direction** |

There are also some useful find & search motions for coding, which require additional lsp information, and setup by LazyVim:

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Goto definition | `gd` | Normal | Goto (type) definition of identifier under the cursor |
|  | `gD` | Normal | Goto source definition of identifier under the cursor (Only JS / JSX / TS / TSX / Vue) |
|  | `gI` | Normal | Goto implementation of identifier under the cursor |
|  | `gr` | Normal | Goto references of identifier under the cursor |

#### Mark & Jump Motions

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Mark | `m{a-zA-Z}` | Normal, Visual | Mark current position with mark `{a-zA-Z}`;<br>Lowercase for file-local, uppercase for global |
|  | `:marks` | Normal, Visual | Print the active marks |
|  | `` `{a-z} `` | Normal, Visual | Goto mark `{a-z}` within **the current file** |
|  | `` `{A-Z} `` | Normal, Visual | Goto mark `{A-Z}` in **any file** |
|  | `` `{0-9[]'"<>.} `` | Normal, Visual | Goto the mark `{0-9[]'"<>.}` |
|  | `'{a-zA-Z0-9[]'"<>.}` | Normal, Visual | Same as `` `{a-zA-Z0-9[]'"<>.} ``,<br>but on the first non-blank character in the line |
| Jump | N `Ctrl-O` | Normal | Goto Nth older position in jump list |
|  | N `Ctrl-I` | Normal | Goto Nth newer position in jump list |
|  | `:ju[mps]` | Normal, Visual | Print the jump list |

### Scrolling

| Group | Command | Mode | Description | Also |
| -- | -- | -- | -- | -- |
| Forward | N `<Ctrl-E>` | Normal, Visual | Window N lines forward (downward) |  |
|  | N `<Ctrl-D>` | Normal, Visual | Window N half pages forward |  |
|  | N `<Ctrl-F>` | Normal, Visual | Window N pages forward |  |
| Backward | N `<Ctrl-Y>` | Normal, Visual | Window N lines backward (upward) |  |
|  | N `<Ctrl-U>` | Normal, Visual | Window N half pages backward |  |
|  | N `<Ctrl-B>` | Normal, Visual | Window N pages backward |  |
| Current window | `zt` | Normal, Visual | Current line at top of window | `z<CR>` |
|  | `zz` | Normal, Visual | Current line at center of window | `z.` |
|  | `zb` | Normal, Visual | Current line at bottom of window | `z-` |

### Window / Buffer & Tab

In Neovim, the term "window" is the same as "buffer".

#### Split Window / Buffer

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Window | `<leader>-` | Normal | Split the current window below (Set by LazyVim) |
| Window | `<leader>\|` | Normal | Split the current window to the right (Set by LazyVim) |

#### Switch Window / Buffer

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Window | `<Ctrl-H>` | Normal | Move to the left window |
|  | `<Ctrl-J>` | Normal | Move to the window below |
|  | `<Ctrl-K>` | Normal | Move to the window above |
|  | `<Ctrl-L>` | Normal | Move to the right window |

#### Switch Tab

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Tab | `H` | Normal | Move to the previous tab |
|  | `L` | Normal | Move to the next tab |

### Visual Select

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Character | `v` | Normal | Start visual mode |
| Line | `V` | Normal | Start linewise visual mode |
| Block | `<C-v>` | Normal | Start blockwise visual mode |
| Restore | `gv` | Normal | Reselect the last visual selection |

> [!Note]
>
> For some modern terminals, like _Windows Terminal_, they may have the keybing from `<C-v>` to paste from clipboard by default, you can disable that keybinding in the terminal settings to use it for blockwise visual mode in Neovim.
>
> To copy and paste, you can use `Ctrl-Insert` and `Shift-Insert` instead, this are the legacy keybindings which are supported by most of the terminals.

### Edit

#### Enter Insert Mode

| Group | Command | Mode | Description | Also |
| -- | -- | -- | -- | -- |
| Append | N `a` | Normal | append text after the cursor (n times) |  |
|  | n `a` | normal | append text at eol (n times) |  |
| insert | n `i` | normal | insert text before the cursor (n times) | `<insert>` |
|  | n `i` | normal | insert text before the first non-blank character of the line (N times) |  |
|  | N `gI` | Normal | Insert text at the beginning of the line (N times) |  |
| New line | N `o` | Normal | Open a new line below the current line, append text (N times) |  |
|  | N `O` | Normal | Open a new line above the current line, insert text (N times) |  |

Use `<Esc>` or `<Ctrl-[>` to exit insert mode and return to normal mode.

> [!Note]
>
> For some terminals like _Windows Terminal_, they may sand something different to what you actually pressed, for example, for `<Ctrl-[>`, it may send `\u001b[46;5u` instead.
>
> You need to use something like actions in _Windows Terminal_ to custom the sendings to fix this.

#### Special Keys in Insert Mode

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Insert | `<Ctrl-A>` | Insert | Insert previously inserted text |
|  | `<Ctrl-@>` | Insert | Insert previously inserted text and stop insert mode |
|  | `<Ctrl-R>{register}` | Insert | Insert the contents of `{register}` |
| Delete | `<Ctrl-W>` | Insert | Delete word before the cursor |
|  | `<Ctrl-U>` | Insert | Delete all entered characters in the current line |
| Indent | `<Ctrl-T>` | Insert | Indent in front of the line |
|  | `<Ctrl-D>` | Insert | Unindent in front of the line |
|  | 0 `<Ctrl-D>` | Insert | Delete all indent in the current line |
|  | ^ `<Ctrl-D>` | Insert | Delete all indent in the current line,<br>restore indent in next line |

#### Delete

| Group | Command | Mode | Description | Also |
| -- | -- | -- | -- | -- |
| Character Delete | N `x` | Normal | Delete N characters under and after the cursor | `<Del>` |
|  | N `X` | Normal | Delete N characters before the cursor |  |
| General Delete | N `d{motion}` | Normal | Delete the text that is moved over with `{motion}` |  |
|  | N `dd` | Normal | Delete N lines |  |
|  | N `D` | Normal | Delete to the end of the line (and N-1 more lines) |  |
|  | `d` | Visual | Delete the selected text |  |
| Join | N `J` | Normal | Join N-1 lines (Delete EOLs) |  |
|  | N `gJ` | Normal | Like `J`, but without inserting spaces |  |
|  | `J` | Visual | Join the selected lines |  |
|  | `gJ` | Visual | Like `J`, but without inserting spaces |  |
| Range Delete | `:[{range}]d [x]` | Normal | Delete {range} lines (into register x) |  |

#### Register, Yank and Put

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Register | `"{register}` | Normal | Use `{register}` for the next delete, yank, or put |
|  | `:reg` | Normal | Show the contents of all registers |
|  | `:reg {register}` | Normal | Show the contents of `{register}` |
| Yank | N `y{motion}` | Normal | Yank the text moved over with `{motion}` into a register |
|  | N `yy` | Normal | Yank N lines into a register |
|  | N `Y` | Normal | Yank N lines into a register<br>Mapped to `y$` by default |
|  | `y` | Visual | Yank the selected text into a register |
| Put | N `p` | Normal | Put a register after the cursor position (N times) |
|  | N `]p` | Normal | Like `p`, but adjust indent to current line |
|  | N `gp` | Normal | Like `p`, but leave the cursor after the new text |
|  | N `P` | Normal | Put a register before the cursor position (N times) |
|  | N `[p` | Normal | Like `P`, but adjust indent to current line |
|  | N `gP` | Normal | Like `P`, but leave the cursor after the new text |

#### Replace and Change

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Replace | N `r{char}` | Normal | Replace N characters with `{char}` |
|  | N `gr{char}` | Normal | Replace N characters without affecting layout |
|  | `r{char}` | Visual | Replace the each char of the selected text with `{char}` |
| Replace mode | N `R` | Normal | Enter **replace mode** (Repeat the entered text N times) |
|  | N `gR` | Normal | Enter **virtual replace mode** (Like replace mode, but without affecting layout) |
| Change (Delete & enter insert mode) | N `c{motion}` | Normal | Change the text that is moved over with `{motion}` |
|  | N `cc` | Normal | Change N lines |
|  | N `C` | Normal | Change to the EOL (and N-1 more lines) |
|  | `c` | Visual | Change the selected text |
|  | `c` | Visual block | Change each of the selected lines with the entered text |
|  | `C` | Visual | Change each of the selected lines until EOL with the entered text |
| Switch case | N `~` | Normal | Switch case for N characters and advance cursor |
|  | `g~{motion}` | Normal | Switch case for the text that is moved over with `{motion}` |
|  | `~` | Visual | Switch case for selected text |
|  | `gu{motion}` | Normal | Make the text that is moved over with `{motion}` lowercase |
|  | `u` | Visual | Make the selected text lowercase |
|  | `gU{motion}` | Normal | Make the text that is moved over with `{motion}` uppercase |
|  | `U` | Visual | Make the selected text uppercase |
| Move | N `Alt-j` | Normal | Move the current line down N times |
|  | N `Alt-k` | Normal | Move the current line up N times |
| Number | N `<Ctrl-A>` | Normal | Add N to the number at or after the cursor |
|  | N `<Ctrl-X>` | Normal | Subtract N from the number at or after the cursor |
| Indent | N `>{motion}` | Normal | Indent the lines that are moved over with `{motion}` |
|  | N `>>` | Normal | Indent N lines |
|  | N `<`{motion}` | Normal | Unindent the lines that are moved over with `{motion}` |
|  | N `<<` | Normal | Unindent N lines |
| Format | N `={motion}` | Normal | Autoformat the lines that are moved over with `{motion}` |
|  | N `==` | Normal | Autoformat N lines |
| Comment | N `gc{motion}` | Normal | Comment the lines that are moved over with `{motion}` |
|  | N `gcc` | Normal | Comment N lines |

#### Undo and Redo

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Undo | N `u` | Normal | Undo last N changes |
|  | `U` | Normal | Undo last changed line |
| Redo | N `<Ctrl-R>` | Normal | Redo last N undone changes |

#### Multi Cursor

In Neovim, you can start multi cursor only from blockwise visual mode, with plugin `multicursor.nvim`, we can accomplish this in any visual mode:

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Match | `<C-n>` | Normal | Create multi cursor at the next occurrence of the current selection |
| Insert | `I` | Visual | Create multi cursor at the beginning of each selected line, enter insert mode |
| Append | `A` | Visual | Create multi cursor at the end of each selected line, enter insert mode |

> [!Note]
>
> For Neovim in VSCode, there is a better plugin called `vscode-neovim-multicursor`, which can trigger VSCode's native multi cursor feature, so we use it instead of `multicursor.nvim` in VSCode environment.
>
> They two have different behaviors and default keybindings (Although we will remap them to be the most similar as possible), you can check their documentation for more details.

### Repeat Command

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Repeat | N `.` | Normal | Repeat the last change (With count replaced with N) |
| Record | `q{a-z}` | Normal | Record typed characters into register `{a-z}` |
|  | `q{A-Z}` | Normal | Record typed characters, appended to register `{a-z}` |
|  | `q` | Normal | Stop recording |
|  | `Q` | Normal | Replay last recorded macro |
| Execute | N `@{a-z}` | Normal | Execute the contents of register `{a-z}` (N times) |
|  | N `@@` | Normal | Repeat previous register execution (N times) |
| Sleep | N `gs` | Normal | Goto sleep for N seconds |

### Fold/Unfold Code

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Fold | `zc` | Normal | Close fold under the cursor |
|  | `zC` | Normal | Close all folds under the cursor |
| Unfold | `zo` | Normal | Open fold under the cursor |
|  | `zO` | Normal | Open all folds under the cursor |
| Toggle | `za` | Normal | Toggle fold under the cursor |
|  | `zA` | Normal | Toggle all folds under the cursor |
| Fold level | `zm` | Normal | Fold more, decrease `'foldlevel'` (Neovim in VSCode does not support) |
|  | `zM` | Normal | Fold all, set `'foldlevel'` to 0 |
| Unfold level | `zr` | Normal | Unfold more, increase `'foldlevel'` (Neovim in VSCode does not support) |
|  | `zR` | Normal | Unfold all, set `'foldlevel'` to max |

### Terminal

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Terminal | N `<C-/>` | Normal, Terminal | Open a terminal N (it's number order) in root directory |

### Version Information

| Group | Command | Mode | Description |
| -- | -- | -- | -- |
| Info | `:ve[rsion]` | Normal | Show version information |
