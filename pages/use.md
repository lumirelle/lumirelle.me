---
title: Use - Lumirelle
display: Use
subtitle: Things I am using
description: Things I am using
art: dots
---

[[toc]]

## Devices

### Working

- OS: **WSL (Arch Linux) on Windows 11**

I'm really want to try MAC mini if I have chance in the future. ☺️

### Gaming

- OS: **Windows 11**

## Software

### Configuration Setup

- [lumirelle/dotfiles](https://github.com/lumirelle/dotfiles) &ndash; Powered by [chezmoi](https://www.chezmoi.io/)

### Terminal & Mutiplexer & Shell & Shell Prompt

- [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/) &ndash; Terminal, **Windows Only**
  - Configuration: [Configuration setup](#configuration-setup)
- [Herdr](https://herdr.dev/) &ndash; Run them anywhere. Leave them running.
- [Nushell](https://www.nushell.sh/) &ndash; Shell, cross-platform
  - Configuration: [Configuration setup](#configuration-setup)
- [Starship](https://starship.rs/) &ndash; Shell Prompt, cross-platform
  - Configuration: [Configuration setup](#configuration-setup)

### Editors

- Editors:
  - [Neovim](https://neovim.io/) &ndash; Fast, keyboard-driven, with [AstroVim](https://astronvim.com/) setup
  - [Zed](https://zed.dev/) &ndash; Morden & lightweight choice
  - [VS Code](https://code.visualstudio.com/) &ndash; Legacy & stable choice
- Editor Settings & Extensions:
  - See [configuration setup section](#configuration-setup)
- Fonts:
  - See [my programming font choices](posts/misc-programming-fonts)
- Theme:
  - [Vercel theme for Windows Terminal](https://github.com/lumirelle/zed-vercel-theme)
  - [Vercel theme for Neovim](https://github.com/nvim-tree/nvim-web-devicons)
  - [Vercel theme for Zed](https://github.com/lumirelle/zed-vercel-theme)
  - [Vercel theme for VS Code](https://github.com/lumirelle/vscode-vercel)
- Icons Theme:
  - [Material Icons for Zed](https://github.com/zed-extensions/material-icon-theme)
  - [Material Icons for VS Code](https://github.com/material-extensions/vscode-material-icon-theme)
- Product Icons:
  - [Material Product Icons for VS Code](https://github.com/material-extensions/vscode-material-product-icons)

### Agent Applications

- Agent Applications:
  - [Pi Coding Agent](https://pi.dev) &ndash; Simple, fast, vibe-ready!

### Browser

Switched to [Firefox](https://www.firefox.com/) as Chrome is pushing hard on [Manifest V3](https://www.eff.org/deeplinks/2021/12/chrome-users-beware-manifest-v3-deceitful-and-threatening) without a good solution for AD blockers.

See my [browser setup](posts/manual-windows-setup#browser-setup) for more details.

## Development Tools

### General, Machine Scope

- [Zoxide](https://zoxide.org/) &ndash; A smarter cd commandJump to the directories you use most
- [Git](https://git-scm.com/) &ndash; Version control system, maybe some day I will try [Jujustu](https://www.jj-vcs.dev/)?
- [chezmoi](https://www.chezmoi.io/) &ndash; Dotfiles manager
- GNU Compiler Collection
  - Distributed as [WinLibs](https://winlibs.com/) on Windows
  - Distributed as `base-devel` on Arch Linux
- [Mise](https://mise.jdx.dev/) &ndash; Devtools manager
- [Tree Sitter CLI](https://github.com/tree-sitter/tree-sitter) &ndash; An incremental parsing system for programming tools
- <TextTag preset="green">mise-ed</TextTag> [yazi](https://yazi-rs.github.io/) &ndash; Blazing fast terminal file manager written in Rust, based on async I/O.
- <TextTag preset="green">mise-ed</TextTag> [fd](https://github.com/sharkdp/fd) &ndash; A simple, fast and user-friendly alternative to 'find'
- <TextTag preset="green">mise-ed</TextTag> [ripgrep](https://github.com/BurntSushi/ripgrep) &ndash; ripgrep recursively searches directories for a regex pattern while respecting your gitignore
- <TextTag preset="green">mise-ed</TextTag> [lazygit](https://github.com/jesseduffield/lazygit) &ndash; simple terminal UI for git commands
- <TextTag preset="green">mise-ed</TextTag> [hyperfine](https://github.com/sharkdp/hyperfine) &ndash; A command-line benchmarking tool
- <TextTag preset="green">mise-ed</TextTag> [bottom](https://github.com/ClementTsang/bottom) &ndash; Yet another cross-platform graphical process/system monitor.
- <TextTag preset="green">mise-ed</TextTag> [gdu](https://github.com/dundee/gdu) &ndash; Fast disk usage analyzer with console interface written in Go

### General, Project Scope

- <TextTag preset="green">mise-ed</TextTag> [hk](https://hk.jdx.dev/) &ndash; Fast, powerful, and flexible hook management for modern development workflows

### System CLI Projects

Language (with it's own development kits):

- <TextTag preset="green">mise-ed</TextTag> [Zig](https://ziglang.org/learn/getting-started/) &ndash; Zig development kits

### Data Wrangling CLI Projects

Language (with it's own development kits):

- [TypeScript](https://www.typescriptlang.org/) &ndash; TypeScript is JavaScript with syntax for types.

Interpreter (native TypeScript support):

- <TextTag preset="green">mise-ed</TextTag> [Bun](https://bun.com/) &ndash; Bun is a fast JavaScript/TypeScript runtime & toolkit. All in one.

Project manager:

- <TextTag preset="green">mise-ed</TextTag> [Nub](https://nubjs.com/) &ndash; The all-in-one JavaScript toolkit that augments Node.js instead of trying to replace it
- [taze](https://github.com/antfu/taze) &ndash; Upgrade dependencies
- [bumpp](https://github.com/antfu/bumpp) &ndash; Interactive CLI that bumps your `package.json` version numbers and more
- [node-modules-inspector](https://github.com/antfu/node-modules-inspector) &ndash; Visualize your `node_modules`, inspect dependencies, and more

Data wrangler:

- Bun native API &ndash; JSON, JSON5, JSONL, XML, YAML, TOML
- [SheetJS](https://github.com/SheetJS/sheetjs) &ndash; SheetJS spreadsheet data toolkit, supports [plenty of spreadsheet files](https://docs.sheetjs.com/docs/miscellany/formats)

Automation:

- [Playwright](https://playwright.dev/) &ndash; Playwright enables reliable web automation for testing, scripting, and AI agents.

### Frontend Projects

Web assets:

- HTML
- CSS
- Images (SVG, WebP, PNG, ...)
- Medias (MP4, MP3, ...)
- ...

Languages (with their own development kits):

> [!Note]
> Traditional frontend project uses HTML to define UI structure, CSS to define UI style & JavaScript to define UI interactive behavior. They runs JavaScript code directly in browsers, but modern projects go beyond this: For case of programming, they allow you to use a bunch of pre-made frameworks or code snippets, and then require you to use their special code transformer to transform to native JavaScript.
>
> These transformer are typically written in TypeScript or JavaScript (some are in Rust, but they also provide APIs that can be called by JavaScript), in order to work with them, that's why we use Node.js (a JavaScript first Interpreter) here.

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) &ndash; JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions.
- [TypeScript](https://www.typescriptlang.org/) &ndash; TypeScript is JavaScript with syntax for types.

Interpreter (JavaScript support first, TypeScript support still experimental):

- <TextTag preset="green">mise-ed</TextTag> [Node.js](https://nodejs.org/) &ndash; Run JavaScript Everywhere

Project manager:

- Same as [data wrangling CLI projects](#data-wrangling-cli-projects)

UI framework:

- [Vue](https://vuejs.org/) &ndash; The progressive JavaScript framework

Build tools (Transform everything else to JavaScript & bundling them with other assets):

- [tsdown](https://tsdown.dev) &ndash; Transforms & bundle JavaScript / TypeScript code, used for library projects
- [Vite](https://vite.dev/) &ndash; Transforms & bundle JavaScript / TypeScript / Other frontend assets, used for frontend projects

Testing:

- [Vitest](https://vitest.dev/) &ndash; A blazing fast unit test framework powered by Vite
- [Playwright](https://playwright.dev/) &ndash; Used to perform E2E tests

Code Quality:

- [OxLint](https://oxc.rs/docs/guide/usage/linter.html) &ndash; A fast linter written in Rust, prepared to replace ESLint in the future
  - Configuration: [lumirelle/oxlint-config](https://github.com/lumirelle/oxlint-config)
- [ESLint](https://eslint.org/) &ndash; Linter & Formatter
  - Configuration: [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [Stylelint](https://stylelint.io/) &ndash; Linter & Formatter for styles
  - Configuration: [lumirelle/stylelint-config](https://github.com/lumirelle/stylelint-config)

### Backend Projects

Language (with it's own development kits):

- <TextTag preset="green">mise-ed</TextTag> [Rust](https://rust-lang.org/) &ndash; A language empowering everyone to build reliable and efficient software.

Server framework:

- [Acitx Web](https://actix.rs/) &ndash; Actix Web is a powerful, pragmatic, and extremely fast web framework for Rust

### Cross-platform Native Projects

SDK (Software Development Kits):

- [Native SDK](https://native-sdk.dev/) &ndash; Toolkit for building native desktop apps

Languages (with their own development kits):

- <TextTag preset="green">mise-ed</TextTag> [Zig](https://ziglang.org/learn/getting-started/) &ndash; For `--template zig-core`
- [TypeScript](https://www.typescriptlang.org/) &ndash; For the default TypeScript core template
  - <TextTag preset="green">mise-ed</TextTag> [Node.js](https://nodejs.org/)

## Project Starter Templates

### System CLI Project

...

#### Zig Library Projects

### Data Wrangling CLI Projects

...

#### JavaScript/TypeScript Library Projects <a name="javascript-typescript-library-projects"></a>

- [Starter TS](https://github.com/lumirelle/starter-ts) &ndash; TypeScript starter template
- [Starter TS Monorepo](https://github.com/lumirelle/starter-ts-monorepo) &ndash; TypeScript starter template for monorepo

### Frontend Projects

- [Vitesse](https://github.com/antfu/vitesse) &ndash; Opinionated Vite + Vue starter template
- [Vitesse Lite](https://github.com/antfu/vitesse-lite) &ndash; Lite version of Vitesse
- [Vitesse Nuxt](https://github.com/lumirelle/starter-vitesse-nuxt) &ndash; Opinionated Nuxt starter template

#### JavaScript/TypeScript Library Projects

- The same as [JavaScript/TypeScript Library Projects for Data Wrangling Projects](#javascript-typescript-library-projects)

### VSCode Extension Projects

- [Starter VSCode](https://github.com/antfu/starter-vscode) &ndash; VS Code Extension starter template
