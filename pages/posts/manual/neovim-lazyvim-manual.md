---
title: Neovim & LazyVim Manual
date: 2025-12-25T14:48+08:00
update: 2026-01-09T18:19+08:00
lang: en
duration: n/a
type: blog+note
---

[[toc]]

## Neovim & LazyVim

Neovim is a modern fork of Vim, which aims to improve the extensibility and usability of Vim.

LazyVim is a Neovim configuration framework that simplifies the setup and management of Neovim plugins and settings, with it, we can get a out-of-the-box Neovim experience with sensible defaults and powerful features.

## Installation

To install Neovim, I highly recommend using the package manager for your operating system. For example, on Windows, you can use `winget`:

```nu
winget install Neovim.Neovim --scope machine
```

To install LazyVim, check your system satisfies [the requirements](https://www.lazyvim.org/#%EF%B8%8F-requirements) first, then just simply follow [the official documentation](https://www.lazyvim.org/installation).

## Basic Usage

[Fully Neovim commands](https://neovim.io/doc/user/vimindex.html).

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

### Exit Neovim

To exit Neovim, you should use the `command`:

- Type `<esc>` for several times to ensure you are back to normal mode.

For single buffer:

- Type `:q` and press `Enter` to quit the current buffer and exit Neovim. Before you exit, Neovim will prompt you to save changes if there are unsaved changes.
- Type `:wq` and press `Enter`, or just type `ZZ` to save changes and quit.
- Type `:q!` and press `Enter`, or just type `ZQ` to force quit without saving changes.

For multiple buffers:

- Type `:qa` and press `Enter` to quit all buffers and exit Neovim.
- Type `:wqa` and press `Enter` to save changes in all buffers and quit.
- Type `:qa!` and press `Enter` to force quit all buffers without saving changes. Alternatively, you can use the LazyVim shortcut `<leader>qq` which does the same thing.

### Motions

> Motion is a cursor movement command. -- [Neovim documentation](https://neovim.io/doc/user/vimindex.html#normal-index)

#### Move Around Characters

Neovim uses `hjkl` keys for the most basic navigation:

- `h`: Move left one character
- `l`: Move right one character
- `j`: Move down one line
- `gj`: Move down one display line (when lines wrap)
- `k`: Move up one line
- `gk`: Move up one display line (when lines wrap)

It's highly recommended to enable relative line numbers in Neovim for better line navigation experience.

By default, LazyVim remaps `j` and `k` to `gj` and `gk`, which are more recommended for modern usage.

> [!Note]
>
> You can start a command with a number to simply repeat it multiple times. For example, `5j` moves down 5 lines, `3h` moves left 3 characters.
>
> Most of Neovim commands support this feature. Just try yourself!

#### Move Around Words

Just like what you think, move around characters one by one is too slow. Happily, Neovim provides several commands to move around words quickly:

- `w`: Move to the next beginning of word
- `e`: Move to the next end of word
- `b`: Move to the previous beginning of word
- `ge`: Move to the previous end of word

If you master these commands, you can navigate through text much faster.

There is a way can help you remember them easier:

- `w`, `e` are the two adjacent keys on the keyboard, who are both used to move forward. `w` is the left one, which means moving forward to the beginning of word; `e` is the right one, which means moving forward to the end of word
- `b` means "backward" and "beginning", which is used to move backward to the beginning of word
- Move backward to the end of the word is not used so often, you can achieve this by the `goto command`: `ge`

#### Move Around Whole Line

To move around whole lines, you can use the following commands:

- `0`: Move to the beginning of the current line, `0` means the zero-th character of the line
- `^`: Move to the first non-blank character of the current line, recall the regex, `^` means the beginning
- `g^`: Move to the first non-blank character of the current line, similar to `^`, but works in soft-wrapped lines
- `$`: Move to the end of the current line, recall the regex, `$` means the end
- `g$`: Move to the end of the current line, similar to `$`, but works in soft-wrapped lines

#### Move Around by Finding

If you have a really long file and want to move to a specific character or word, you can achieve this by finding:

- `f{char}`: Move to the next Nth occurrence of `{char}`
- `F{char}`: Move to the previous Nth occurrence of `{char}`
- `t{char}`: Move to just before the next Nth occurrence of `{char}`
- `T{char}`: Move to just after the previous Nth occurrence of `{char}`
- `s{char}`: Find `{char}` among the current display lines with hint, you can type the hint to move the cursor there
- `/{string}`: Search forward for `{string}`, use `n` to go to the next occurrence and `N` to go to the previous occurrence
- `?{string}`: Search backward for `{string}`, use `n` to go to the next occurrence and `N` to go to the previous occurrence
- `*`: Search forward for the word under the cursor, use `n` to go to the next occurrence and `N` to go to the previous occurrence
- `#`: Search backward for the word under the cursor, use `n` to go to the next occurrence and `N` to go to the previous occurrence

#### Move Around Brackets

To move around brackets, you can use:

- `%`: Move to the closest matching brackets (works for `()`, `{}`, `[]`, `<>`)
- `[(`, `[{`, `[<`: Move to the previous unmatched opening bracket
- `])`, `}]`, `]>`: Move to the next unmatched closing

#### Move Around Paragraphs

To move around paragraphs, you can use:

- `{`: Move to the previous beginning of paragraph (a paragraph is separated by one or more blank lines)
- `}`: Move to the next beginning of paragraph

#### Move Around Whole File

- `gg`: Move to the beginning of the file
- `G`: Move to the end of the file

#### Move Around Screen

To move around screen without moving the cursor, you can use:

- `<C-e>`: Move down by one line
- `<C-y>`: Move up by one line
- `<C-d>`: Move down by half screen
- `<C-u>`: Move up by half screen
- `<C-f>`: Move down by one full screen
- `<C-b>`: Move up by one full screen
- `zz`: Center the current line in the screen
- `zt`: Move the current line to the top of the screen
- `zb`: Move the current line to the bottom of the screen

#### Move Around Windows

To move around windows, you can use the following commands:

- `<C-h>`: Move to the left window
- `<C-j>`: Move to the window below
- `<C-k>`: Move to the window above
- `<C-l>`: Move to the right window

#### Move Around Buffers

To move around buffers, you can use the following commands:

- `H`: Move to the previous buffer
- `L`: Move to the next buffer

### Editing

#### Enter Insert Mode

You can enter insert mode by using the following commands:

- `i`: Insert before the cursor
- `a`: Append after the cursor
- `I`: Insert at the beginning of the line
- `A`: Append at the end of the line
- `o`: Open a new line below the current line and enter insert mode
- `O`: Open a new line above the current line and enter insert mode

Then you can start typing just like a normal text editor.

Use `<esc>` to exit insert mode and return to normal mode.

#### Copy and Paste

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
