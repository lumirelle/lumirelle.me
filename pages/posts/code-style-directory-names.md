---
title: 'Code Style: Directory Names'
date: 2026-03-30T17:24+08:00
update: 2026-03-30T17:24+08:00
lang: en
duration: 1min
type: blog+note
---

[[toc]]

## Singular vs Plural

> [!Note]
>
> Reference: [Plural vs Singular - Directory Names](https://logansbailey.com/plural-vs-singular-directory-names).

1. If the directory name is describing what the files it contains, it should be plural. For example:

    ```plaintext
    src/
    ├── components/     # All files in this directory are components
    │   ├── Button.js
    │   └── Input.js
    ├── utils/          # All files in this directory are utilities
    │   ├── format.js
    │   └── parse.js
    ```

2. If the directory name is describing the target / purpose of the files in contains, it should be singular. For example:

    ```plaintext
    src/
    ├── test/         # All files in this directory are for testing.
    │   │             # Not only tests, but also setup and teardown files,
    │   │             # Sometimes, there are even fixtures and config files.
    │   ├── setup.js
    │   ├── teardown.js
    │   ├── Button.test.js
    │   └── Input.test.js
    ```

3. ...Other cases?
