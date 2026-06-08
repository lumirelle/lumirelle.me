---
title: Use - Lumirelle
display: Use
subtitle: Things I am using
description: Things I am using
art: dots
---

[[toc]]

## Devices

### Working & Gaming

- PC: **Windows 11**

I'm really want to try MAC mini if I have chance in the future. ☺️

## Software

### Configuration Setup

- My personal configuration setup: [lumirelle/dotfiles](https://github.com/lumirelle/dotfiles)

### Editors

- Editors:
  - [Neovim](https://neovim.io/) (Fast, keyboard-driven) with [LazyVim](https://www.lazyvim.org/) setup
  - [VS Code](https://code.visualstudio.com/) (Basic choice)
  - [Zed](https://zed.dev/) (Lightweight choice)
- Editor Settings & Extensions: [Configuration setup](#configuration-setup)
- Fonts: See [my programming font choices](posts/misc-programming-fonts) for more details.
- Theme: [Ayu Theme](https://ayutheme.com/) &ndash; [VS Code](https://marketplace.visualstudio.com/items?itemName=teabyii.ayu) & [Neovim](https://github.com/ayu-theme/ayu-vim) & [Zed (Community, dark only)](https://github.com/k4yt3x/zed-theme-ayu-darker)
- Icons Theme: [Catppuccin Icon Theme](https://catppuccin.com/) &ndash; [VS Code](https://github.com/catppuccin/vscode-icons) & [Neovim](https://github.com/catppuccin/nvim) & [Zed](https://github.com/catppuccin/zed-icons)
- Product Icons: Carbon Icons &ndash; [VS Code Only](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)
- Formatting & Linting:
  - [OxLint](https://marketplace.visualstudio.com/items?itemName=oxc.oxc.oxc-vscode) with [`@lumirelle/oxlint-config`](https://github.com/lumirelle/oxlint-config) first
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) with [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) fallback
  - ...some times [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) with [`@lumirelle/stylelint-config`](https://github.com/lumirelle/stylelint-config).

### Browser

Switched to [Brave](https://brave.com/) as Chrome is pushing hard on [Manifest V3](https://www.eff.org/deeplinks/2021/12/chrome-users-beware-manifest-v3-deceitful-and-threatening) without a good solution for AD blockers.

See my [manual](posts/manual-windows-setup#browser-setup) for more details about my Brave setup.

### Design / Social Media

- [Figma](https://www.figma.com/) - Illustrations, Logos, Social Media Banners
- [OBS](https://obsproject.com/) - Streaming & Recording

### Terminal & Shell & Shell Prompt

- [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/) - Terminal, **Windows Only**
  - Configuration: [Configuration setup](#configuration-setup)
- [Nushell](https://www.nushell.sh/) - Shell, cross-platform
  - Configuration: [Configuration setup](#configuration-setup)
- [Starship](https://starship.rs/) - Shell Prompt, cross-platform
  - Configuration: [Configuration setup](#configuration-setup)

## Development

### General

- [Git](https://git-scm.com/downloads) - Version control system
- [Chezmoi](https://www.chezmoi.io/) - Dotfiles manager
- [Mise](https://mise.jdx.dev/) - Devtools manager
- [@sxzz/create](https://github.com/sxzz/create) - Create new projects from GitHub templates with ease (any language & framework)
- [hyperfine](https://github.com/sharkdp/hyperfine) - A command-line benchmarking tool

### Zig

- [Zig](https://ziglang.org/learn/getting-started/) - Zig development kits

### JavaScript / TypeScript

Runtimes:

- [Bun](https://bun.sh/download) - A fast all-in-one JavaScript / TypeScript runtime, bundler, transpiler, and package manager, not stable enough for production yet but worth trying for new projects
- [Node.js](https://nodejs.org/en/download/) - Legacy JavaScript / TypeScript runtime, still the best choice for stable production use

Build tools:

- [Tsdown](https://tsdown.dev) - Build JavaScript / TypeScript library projects
- [Vite](https://vite.dev/) - Build frontend projects

Testing:

- [Vitest](https://vitest.dev/) - A blazing fast unit test framework powered by Vite
- [Playwright](https://playwright.dev/) - End-to-end testing framework

Project management:

- [aube](https://aube.en.dev/) - Fast, disk-save package manager, can run directly on projects using other major package managers (NPM, PNPM, Yarn and Bun), without any migration steps
- [taze](https://github.com/antfu/taze) - Upgrade dependencies
- [bumpp](https://github.com/antfu/bumpp) - Interactive CLI that bumps your `package.json` version numbers and more
- [node-modules-inspector](https://github.com/antfu/node-modules-inspector) - Visualize your `node_modules`, inspect dependencies, and more

Code Quality:

- [OxLint](https://oxc.rs/docs/guide/usage/linter.html) - A fast linter written in Rust, prepared to replace ESLint in the future
  - Configuration: [lumirelle/oxlint-config](https://github.com/lumirelle/oxlint-config)
- [ESLint](https://eslint.org/) - Linter & Formatter
  - Configuration: [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [StyleLint](https://stylelint.io/) - Linter & Formatter for styles
  - Configuration: [lumirelle/stylelint-config](https://github.com/lumirelle/stylelint-config)

### Java

- [Graal VM](https://www.graalvm.org/downloads/) - A high-performance runtime that provides support for Java and other languages, used for **playing Minecraft**. XD

## Project Starter Templates

### JavaScript / TypeScript

- [starter-ts](https://github.com/lumirelle/starter-ts) - TypeScript starter template
- [starter-monorepo](https://github.com/lumirelle/starter-monorepo) - TypeScript starter template for monorepo
- [starter-vscode](https://github.com/antfu/starter-vscode) - VS Code Extension starter template
- [vitesse](https://github.com/antfu/vitesse) - Opinionated Vite + Vue starter template
- [vitesse-nuxt](https://github.com/lumirelle/starter-vitesse-nuxt) - Opinionated Nuxt starter template
- [vitesse-lite](https://github.com/antfu/vitesse-lite) - Lite version of Vitesse
