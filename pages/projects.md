---
title: Projects - Lumirelle
display: Projects
description: List of projects that I am proud of
wrapperClass: 'text-center'
art: dots
projects:
  Current Focus:
    - name: 'Dotfiles'
      link: 'https://github.com/lumirelle/dotfiles'
      desc: 'My dotfiles (also application files), out-of-box (for me).'
      icon: 'i-vscode-icons-file-type-config'
    - name: 'TS Config'
      link: 'https://github.com/lumirelle/tsconfig'
      desc: 'My opinionated TypeScript config.'
      icon: 'i-vscode-icons-file-type-typescript-official'
    - name: 'OxLint Config'
      link: 'https://github.com/lumirelle/oxlint-config'
      desc: 'My opinionated OxLint config, based on @antfu/eslint-config.'
      icon: 'i-vscode-icons-file-type-oxc'
    - name: 'Stylelint Config'
      link: 'https://github.com/lumirelle/stylelint-config'
      desc: 'My opinionated Stylelint config.'
      icon: 'i-vscode-icons-file-type-stylelint'
    - name: 'VS Code Shell Script Formatter (Rev)'
      link: 'VSCode Shell-like Formatter'
      desc: 'The shellscript、Dockerfile、properties ...... format extension.'
      icon: 'i-vscode-icons-file-type-shellcheck'
  Starters:
    - name: 'TS'
      link: 'https://github.com/lumirelle/starter-monorepo'
      desc: 'TS library starter.'
      icon: 'i-vscode-icons-file-type-tsconfig'
    - name: 'Monorepo'
      link: 'https://github.com/lumirelle/starter-monorepo'
      desc: 'TS Monorepo starter.'
      icon: 'i-vscode-icons-file-type-webpack'
    - name: 'Vitesse Nuxt'
      link: 'https://github.com/lumirelle/starter-vitesse-nuxt'
      desc: 'Vitesse starter for Nuxt4.'
      icon: 'i-carbon-campsite'
  Under Maintenance:
    - name: 'Android Killer'
      link: 'https://github.com/lumirelle/android-killer'
      desc: 'Make Android de-compiler great again.'
      icon: 'i-twemoji-carpentry-saw'
  Learning Backup:
    - name: 'Learning Backup'
      link: 'https://github.com/lumirelle/learning-backup'
      desc: '鲁迅说过：“知识应该存进脑子，存不进脑子那只能存在这里了。”'
      icon: 'i-twemoji-books'
---

<!-- @layout-full-width -->
<ListProjects :projects="frontmatter.projects" />
