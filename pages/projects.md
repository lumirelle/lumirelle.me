---
title: Projects - Lumirelle
display: Projects
description: List of projects that I am proud of
wrapperClass: 'text-center'
art: dots
projects:
  Current Focus:
    - name: 'Starship Butler'
      link: 'https://github.com/lumirelle/starship-butler'
      desc: 'Your best starship butler, for quick setup of your system, projects, and more.'
      icon: 'i-vscode-icons-file-type-rust-toolchain'
    - name: 'Stylelint Config'
      link: 'https://github.com/lumirelle/stylelint-config'
      desc: 'My Stylelint config.'
      icon: 'i-vscode-icons-file-type-stylelint'
  Starters:
    - name: 'Vitesse Nuxt'
      link: 'https://github.com/lumirelle/starter-vitesse-nuxt'
      desc: 'Vitesse starter for Nuxt4.'
      icon: 'i-carbon-campsite'
    - name: 'Monorepo'
      link: 'https://github.com/lumirelle/starter-monorepo'
      desc: 'TS Monorepo starter.'
      icon: 'i-twemoji-package'
    - name: 'TS'
      link: 'https://github.com/lumirelle/starter-monorepo'
      desc: 'TS library starter.'
      icon: 'i-vscode-icons-file-type-typescript'
  Just Maintenance:
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
