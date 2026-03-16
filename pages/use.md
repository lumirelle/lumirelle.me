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

- PC:
  - MaxSun B760M Challenger
  - i5-13490F
  - RTX 5060ti 16G
  - Aigo DDR4 3200/C12 16G x 2
  - Western Digital SN770 1TB
  - Lenovo R27qe 2K 27" 180Hz
  - **Windows 11**
  - ...

I'm really want to try MAC mini if I have chance in the future. ☺️

## Software

### Configuration Setup Helpers

- My personal CLI tool for configuration setup: [lumirelle/starship-butler](https://github.com/lumirelle/starship-butler)

### Editors

- Editors:
  - [VS Code](https://code.visualstudio.com/) (Basic choice)
  - [Cursor](https://www.cursor.com/) (Better AI coding experience)
  - [Zed](https://zed.dev/) (Look forward to the future)
  - [Neovim](https://neovim.io/) (For terminal lovers) with [LazyVim](https://www.lazyvim.org/) setup
- Editor Settings & Extensions: [Configuration setup](#configuration-setup-helpers)
- Fonts: See [programming fonts manual](posts/manual/programming-fonts-manual.md) for more details.
- Theme: [GitHub Theme](https://github.com/primer/github-vscode-theme)
- Icons Theme: [Catppuccin Icon Theme](https://github.com/catppuccin/vscode-icons)
- Product Icons: [Carbon Icons](https://github.com/antfu/vscode-icons-carbon)
- Formatting & Linting:
  - [OxLint](https://marketplace.visualstudio.com/items?itemName=oxc.oxc.oxc-vscode) with [`@lumirelle/oxlint-config`](https://github.com/lumirelle/oxlint-config) first
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) with [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) least
  - ...some times [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) with [`@lumirelle/stylelint-config`](https://github.com/lumirelle/stylelint-config).

### Browser (Daily Use)

Switched to [Brave](https://brave.com/) as Chrome is pushing hard on [Manifest V3](https://www.eff.org/deeplinks/2021/12/chrome-users-beware-manifest-v3-deceitful-and-threatening) without a good solution for AD blockers.

See my [manuals](/posts/manual-windows-setup#brave-browser) for more details about my Brave setup.

### Design / Social Media

- [Figma](https://www.figma.com/) - Illustrations, Logos, Social Media Banners
- [OBS](https://obsproject.com/) - Streaming & Recording

### Terminal & Shell & Shell Prompt

- [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/) - Terminal, **Windows Only**
  - Configuration: [Configuration setup](#configuration-setup-helpers)
- [Nushell](https://www.nushell.sh/) - Shell
  - Configuration: [Configuration setup](#configuration-setup-helpers)
- [Starship](https://starship.rs/) - Shell Prompt
  - Configuration: [Configuration setup](#configuration-setup-helpers)

## Development

### General

- [@sxzz/create](https://github.com/sxzz/create) - Create new projects from GitHub templates with ease (any language)
- [hyperfine](https://github.com/sharkdp/hyperfine) - A command-line benchmarking tool

### C/C++

Build tools:

- [Mingw-w64](https://github.com/niXman/mingw-builds-binaries/releases/latest) - GCC (GNU Compiler Collection) for **Windows**
- [MSVC](https://visualstudio.microsoft.com/visual-cpp-build-tools/) - Microsoft Visual C++ Compiler Toolchain for **Windows**

### Zig

Build tools:

- [Zig](https://ziglang.org/learn/getting-started/) - Zig development kits

### JavaScript / TypeScript

Standalone runtimes:

- [Bun](https://bun.sh/download) - A fast all-in-one JavaScript / TypeScript runtime, bundler, transpiler, and package manager, not stable enough for production yet but worth trying for new projects
- [Node.js](https://nodejs.org/en/download/) - Legacy JavaScript / TypeScript runtime, still the best choice for stable production use

Build tools:

- [Bunup](https://bunup.dev) - Build JavaScript / TypeScript library projects
- [Vite](https://vite.dev/) - Build frontend projects

Project management:

- [@antfu/ni](https://github.com/antfu-collective/ni) - Aliasing package managers
- [taze](https://github.com/antfu/taze) - Upgrade dependencies
- [bumpp](https://github.com/antfu/bumpp) - Interactive CLI that bumps your version numbers and more
- [node-modules-inspector](https://github.com/antfu/node-modules-inspector) - Visualize your node_modules, inspect dependencies, and more

Code Quality:

- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) - A fast linter written in Rust, prepared to replace ESLint in the future
  - Configuration: [lumirelle/oxlint-config](https://github.com/lumirelle/oxlint-config)
- [eslint](https://eslint.org/) - Linter & Formatter
  - Configuration: [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [stylelint](https://stylelint.io/) - Linter & Formatter for styles
  - Configuration: [lumirelle/stylelint-config](https://github.com/lumirelle/stylelint-config)

Useful libraries & frameworks:

- [esbuild](https://esbuild.github.io/) - An extremely fast bundler and minifier, used to power [the import-cost VSCode extension](https://marketplace.visualstudio.com/items?itemName=hyrious.import-cost).

### JVM (Java/Kotlin/Scala...)

Runtime & Build tools:

- [Graal VM](https://www.graalvm.org/downloads/) - JVM language's development kits

## Project Starter Templates

### JavaScript / TypeScript

- [starter-ts](https://github.com/lumirelle/starter-ts) - TypeScript starter template
- [starter-monorepo](https://github.com/lumirelle/starter-monorepo) - TypeScript starter template for monorepo
- [starter-vscode](https://github.com/antfu/starter-vscode) - VS Code Extension starter template
- [vitesse](https://github.com/antfu/vitesse) - Opinionated Vite + Vue starter template
- [vitesse-nuxt](https://github.com/lumirelle/starter-vitesse-nuxt) - Opinionated Nuxt starter template
- [vitesse-lite](https://github.com/antfu/vitesse-lite) - Lite version of Vitesse
