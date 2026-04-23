---
title: Git Manual
date: 2025-09-26T11:47+08:00
update: 2026-04-23T18:33+08:00
lang: en
duration: 17min
type: manual
---

[[toc]]

## What Is Git?

Git is a distributed version control system, which is used to track changes in source code during software development.

### Core Concepts

- **Repository (Repo)**:

  A repository is be composed of two parts. First part is the **commit history tree**, another part is the **working directory**.

  Repository can be local (on your computer), remote (on a server like GitHub) or both.

- **Commit**:

  A commit is a diff record than the previous one. Each commit has a unique ID and contains information about the changes made.

  If different commits are based on the same previous commit, this will form a fork, and forks form a tree, that is **commit history tree**.

  For the first commit who is made based on empty working directory, we call it the **initial commit**.

- **Branch**:

  A branch is not a biological sense "branch": **It not only includes the fork start from the nearest public commit, but starts from the initial commit, and ends with leaf one (it's more like a combination of "trunk" and "branch")**.

  ```txt
             +- biological sense branch -+
             v                           v
             +===========================>
             |
  o----------+--------------------------->

  ...

  +------------- Git branch -------------+
  |                                      v
  |          +===========================>
  v          |
  o==========+--------------------------->
  ```

  We usually use `main` or `master` as the default branch. You can create new branches based on the default branch to work on features without affecting it.

  Branches are one of the most important concepts in collaborative development.

- **Working Directory**:

  The working directory is **the current state** of your project files **on your machine**. It is based on the commit node you are currently on, with your uncommitted changes.

- **Staging Area**:

  The staging area is a place where you can stage changes before committing them.

- **HEAD**:

  HEAD is that pointer which indicates your working directory is based on which commit node (and branch). When the HEAD changes, the working directory will also change accordingly.

## Basic Usage of Git

> [!Note]
>
> This article is based on my own `.gitconfig` configuration.
>
> For more details about the changed default behavior and custom alias, please see [the source file](https://github.com/lumirelle/starship-butler/tree/main/packages/config-provider/assets/vcs/git/.gitconfig). You can also get help information of the custom alias usage by provide `--?` flag or `-?` flag.
>
> If you are interested in my configuration, you can try my configurations setting up tool: [`starship-butler`](https://github.com/lumirelle/starship-butler) or download the source file manually.

### Initialize Git Repository

To initialize a new Git repository with none commit, open your project in the terminal and run:

```bash
git init
```

Then, Git will create a hidden `.git`, which contains all the Git metadata for your project.

### Make Commit

After initializing, you can start making commits to track your changes.

First, you need to make some changes, and stage them:

```bash
# Make some changes..
touch index.html
echo "Hello, Git!" > index.html

# Stage the changes
# Alias `a` = `add`
git a .
```

After that, you can make the initial commit:

```bash
# Alias `cm` = `commitx-with-message`
#           ~= `commitx --message`
#            = enhanced version of `commitx --message`
git cm feat 'initial commit'

# Or
# `c -m`    = `commitx --message`
#
# Alias `c` = `commitx`
#          ~= `commit`
#           = enhanced version of `commit`
git c -m "feat: initial commit"
```

Every time you want to record some changes, you can make a commit like this.

Commit will record the changes you made, and creates a new node in the commit history tree based on the previous node. Each node is like a snapshot version of your project at a specific time, so that you can "checkout" to it at any time later.

This is the most basic version control usecase.

### Add Remote

As a distributed version control system, Git allows you to collaborate with others by syncing your local repository with a remote repository. You can use services like GitHub, GitLab, or Bitbucket to host your remote repositories.

You need to add a "remote", so that Git knows where the remote repository is located, and how to sync with it.

To add a "remote", use the following command:

```bash
# `r -a`    = `remotex --add`
#          ~= `remote add`
#
# Alias `r` = `remotex`
#           = enhanced version of `remote`
git r -a https://github.com/username/repo.git
```

### Pull and Push Commits

To sync your local commit history with a remote repository, you can `pull` commits from and `push` commits to them.

To pull latest commit history from the remote repository, you can use the following command:

```bash
# Alias `l` = `pull`
git l
```

To push your latest commit history to the remote repository:

```bash
# Alias `p` = `push`
git p
```

### Work with Branches (Git Workflow)

Branches are one of the most important concepts in collaborative development.

With branches, you can create a temporary fork with the "main version" of your project, and work on it independently. After the task is done, you can apply your works back to "main version" by merging.

Through this, you can keep the "main version" always the stable and reliable one of your project.

Is there some standard workflow for branches? Yes:

- **Centralized workflow**:

  Everything works on the main branch, uses tags to mark the version numbers. Release new version periodically or randomly.

  _Only for personal projects._

- **Feature branch workflow**:

  Create a new branch for each feature, and merge it back to the main branch after the task is done. One or more merges make a new version release. Tags on the main branch are used to mark the version numbers too.

  _Suitable for small projects or personal projects._

- **Git flow workflow**:

  With some long-term branches like `main`, `dev`, and some temporary assistant branch groups like `release`, `hotfix/hotfeat`, `feat`.

  _Suitable for medium to large projects._

  - `main` branch is always the **stable version**, each merge (should only comes from `release` branch group) to `main` branch should make a new release, and tags on the `main` branch are used to mark the version numbers;
  - `dev` branch used to hold **completed new features** (Who merged the uncompleted features to `dev` branch? Fuck you! 😅) for next version;
  - `release` branch group is a group of branches, who are used to **apply testing, bug fixes and prepare releasing** before making a new version release. When the developments on `dev` / `hotfix/hotfeat` branches are done, you should create the corresponding `release` branch from them first, then deploy your application to test environment for testing use this branch, then apply the bug fixes, finally release the new version...
  - `hotfix/hotfeat` branch group is a group of branches, who are used to **make a hotfix or hotfeat** to a released version (usually created from `main` branch directly), of course, they should be tested too before merging back to `main` branch.
  - `feat` branch group is a group of branches, who are used to **develop new features**. When a feature completed, we will merge it into `dev` branch. When all features for the next version are completed, that means the development on `dev` branch also ends.
  - ... Maybe some custom branches / branch groups for your project, as your need.

  Let's take a look at the workflow of this Git flow workflow more clearly:

  When a version iteration starts, for each feature, we should create a new feature branch from `dev` branch, and merge them back to `dev` branch after the development is done. For example:

  | Iteration | Features       | Branch Name |
  | --------- | -------------- | ----------- |
  | v1.1.0    | New product: A | feat/a      |
  |           | New product: B | feat/b      |
  |           | New product: C | feat/c      |

  After one iteration development completed (all features merged to `dev`), we should create a new `release` branch from `dev` to prepare for testing (also bug fixes) and releasing, and vacate the `dev` branch for the next iteration development.

  After the test & release tasks (including bug fixes, changelog updates, etc.) are done, should merge the `release` branch back to `main` to create a new release, and `dev` to integrate the changes.

  The final branch graph will be like this:

  `*` means a node of the branch

  `o` means the first node of the branch

  `x` means the last node of the branch

  `+` means a merge node of the branch

  `@` means a iteration start node for that long-term branch

  `$` means a iteration end node for that long-term branch

  `@&$` means both the iteration start and end node for that long-term branch

  `~` means working on that branch, contains a bunch of nodes

  `...` means other iteration

  ```txt
         (v1.0.0)                             (v1.1.0)
          ^                                    ^
  o- ... -*-----------------------------------@&$- ... -> (main)
  |                                            ^
  |                                            |
  |                                    o~~~~~~~x (release/v1.1.0)
  |      (after create release/v1.0.0) ^       |
  v       ^                            |       v
  o- ... -@------+----------+----------$- ... -+- ... -> (dev)
          |      ^          ^          ^
          |      |          |          |
          o~~~~~~x (feat/a) |          |
          |                 |          |
          |                 |          |
          o~~~~~~~~~~~~~~~~~x (feat/b) |
          |                            |
          V                            |
          o~~~~~~~~~~~~~~~~~~~~~~~~~~~~x (feat/c)
  ```

  For hotfix and hotfeat, should create a new `hotfix/hotfeat` branch from `main`, and create a new `release` branch for testing and releasing after the development is done. After the tasks are done too, merge the `hotfix/hotfeat` branch back to `main` to create a new release, and `dev` to integrate the changes.

  For example:

  | Current Main Version | Hotfix/Hotfeat | Branch Name |
  | -------------------- | -------------- | ----------- |
  | v1.1.0               | Hotfix: A      | hotfix/a    |
  |                      | Hotfeat: B     | hotfeat/b   |

  And the branch graph will be like this:

  ```txt
         (v1.1.0)    (v1.1.1)                   (v1.1.2)
          ^           ^                          ^
  o- ... -*-----------+--------------------------+- ... -> (main)
  |       |           ^                          ^
  |       |           |                          |
  |       |   +~~~~~~~x (release/v1.1.1) +~~~~~~~x (release/v1.1.2)
  |       |   ^       |                  |       |
  |       |   |       v                  |       V
  o- ... -|---|-------+------------------|-------+- ... -> (dev)
          |   |                          |
          o~~~x (hotfix/a)               |
          |                              |
          |                              |
          o~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~x (hotfeat/b)
  ```

  > [!Caution]
  >
  > 1. Never merge a uncompleted/postponed feature branch to the `dev` branch, we mentioned this before.
  > 2. If you want to integrate some changes on `dev` branch to your feature branch, use `rebase` please 🙏.

- **Open source workflow**:

  A variant of feature branch workflow, with only `main` branch, `feat` branch group and optional `v{version}` branch group.

  _Suitable for open source projects._

  - `main` branch is for **the latest major version**, tags on this branch are used to mark the version numbers, e.g. `v8.0.0`, `v8.1.0`, etc.
  - `v{version}` branch group is for the old released major versions, e.g. `v1.0`, `v2.0`, etc. Tags on these branches are used to mark the version numbers too, e.g. `v1.0.0`, `v2.0.0`, etc.
  - `feat` branch group is for new features, which will be merged to `main` or `v{version}` branch after the development is done.

  For **participants who are not the maintainers** of the repository, they can only fork this repository and create a new feature branch in their fork, and make a **pull request** to `main` or `v{version}` branch of the original repository after the development is done.

  Pull request likes merge, but need to be reviewed and approved by the maintainers of the original repository before merging. This is a common workflow for open source projects, which can help to maintain the quality of the codebase.

You can choose one of the workflows above based on your project's size, type, complexity or your preference.

> [!Note]
>
> This article will use the most complex Git flow workflow as an example.

### Create a New Feature Branch

To add a new feature, you should create a new feature branch based on the `dev` branch first, and then work on this feature branch independently.

First, create `dev` branch from `main` branch if it does not exist:

```bash
# `w -c`    = `switch --create`
#
# Alias `w` = `switch`
git w -c dev main
```

Then create a new feature branch from `dev` branch:

> [!Caution]
>
> Although we say **"NOT TO MERGE UNCOMPLETED/POSTPONED FEATURE BRANCH TO DEV"**, but you cannot affect other's behavior.
>
> If you found that there is already a uncompleted/postponed feature branch merged to `dev` 😅, the simply workaround is to create you feature branch based on the specific commit before it or even the `main` branch.

```bash
git w -c feat/feature-name dev
```

Now, you can work on your feature branch, commit changes frequently, and push them to remote regularly.

### Drop Changes / Reset to HEAD

When you work on your feature branch, you may want to discard the changes easily:

You can use the following command:

```bash
# Alias `x` = `discard`
#           = custom alias, will reset tracked files to HEAD,
#             and remove untracked files based on specific paths
git x index.html index.css
```

To discard all changes:

```bash
# `.` means the project root, of course, only if you are in the project root.
git x .
```

### Unstage / Unadd Changes

If you have staged some changes by `git add`, you can also unstage them by `git unadd` (my custom alias):

```bash
# Alias `ua` = `unadd`
#            = Custom alias, will unstage the changes based on specific paths
git ua index.html index.css
```

To unstage all changes:

```bash
git ua .
```

### Undo Last Commit / Uncommit

When you commit some changes in accident, you can undo it by `git uncommit` (my custom alias too 😄):

```bash
# Alias `uc` = `uncommit`
#            = Custom alias, will undo the last commit
git uc
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to perform force push to remote after undo it:
>
> ```bash
> git p -f
> ```
>
> This may cause problems for other collaborators, please use it with caution 🙏.

### Amend Last Commit

If you want to amend the last commit, more conveniently than drop the last commit and create a new one, you can do:

```bash
# `c -a` = `commitx --amend`
#       ~= `commit --amend --no-edit`
git c -a
```

Or if you want to edit the last commit message:

```bash
# `c -e` = `commitx --edit`
#       ~= `commit --amend`
# Git will open an editor because you have not provided
# the new commit message yet.
git c -e

# Or with specific new commit message directly:
git cm -e "fix: some bugs"
git c -e -m "fix: some bugs"
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to perform force push to remote after undo it:
>
> ```bash
> git p -f
> ```
>
> This may cause problems for other collaborators, so please use it with caution 🙏.

### Revert Commit

Undo or amend last commit is unsafe, this may break other collaborators' work if you and them are working on the same branch.

For more safety choice, you can use `git revert` to create a new commit that undoes the changes made by a specific commit.

The cost is that the commit history will be more ugly, likes your "evidence of guilt", which will spread through the ages. 🫠

```bash
# Alias `rv` = `revertx`
#            = enhanced version of `revert`
git rv HEAD
```

### Merge Branch

Come back to general workflow from "error handling", after you completed your feature, you need to merge it back to the `dev` branch.

```bash
git w dev

# Alias `m` = `mergex`
#           = enhanced version of `merge`, will merge the specified
#             branch into the current branch with default message:
#             "chore: merge $merge_branches into $current_branch"
git m feat/feature-name

# Don't forget to push the `dev` branch to remote!
git p
```

When all features are merged into the `dev` branch, and ready for testing, you should create a new `release` branch to prepare for testing, bug fixing and releasing:

```bash
git w dev
# vx.x.x is the version number of the next release, e.g. v1.0.0.
git w -c release/vx.x.x dev
git p
```

> [!CAUTION]
>
> Before you create a new `release` branch, you should really think twice is there **any uncompleted features** already been merged into the `dev` branch. 😅 🙏

After that, your next tasks now can be performed on the `release` branch.

When your test team finds some bugs during testing, you can commit the bug fixes directly on the `release` branch. After all tasks done, you can finally create a new release by merging the `release` branch back to the `main` branch, and then merge the `release` branch back to the `dev` branch again to integrate the bug fixes:

```bash
# Merge `release` branch to `main` branch to create a new release
git w main
git m release/vx.x.x
git p

# Merge `release` branch back to `dev` branch to integrate the bug fixes
git w dev
git m release/vx.x.x
git p
```

### Manage Tag

After a new release, we should create a version tag to mark this point on the `main` branch, and push it to remote.

```bash
git w main

# Alias `t` = `tagx`
#           = enhanced version of `tag`, will create a new tag
#             with the specified name and message (if provided)
git t v1.0.0
git t v1.0.0 "Release version 1.0.0"
```

Then push the tag to remote:

```bash
git p
```

Or if you want to delete a tag

```bash
# Alias `tx` = `tag-delete`
#            = Custom alias, will delete a specific tag with specific range
git tx -a v1.0.0
```

### Rebase Branch

When something changes been integrated into the `dev` branch, and you also want to integrate these changes into your **local** feature branch, you can rebase your feature branch onto the latest `dev` branch.

```bash
git w feat/feature-name

# Alias `n` = `rebasex`
#           = enhanced version of `rebase`
git n dev
```

> [!Caution]
>
> Do not rebase a branch which has been **pushed to remote and shared with others**. Like force push, this also can cause problems for other collaborators, so please use it with caution 🙏.

### Delete Branch

Now, you already have some branches in your repository: `main`, `dev`, and multiple `release` and `feature` branches. The `main`, `dev` branches are long-lived branches, which will stay in the repository for a long time (I mean forever). But the `release` and `feature` branches are not.

When you complete your feature development on a `feat` branch and merged it back to the `dev` branch, you can delete your `feat` branch, because it's mission is accomplished.

When you complete your testing, bug fixing and releasing tasks on a `release` branch and merged it back to the `main` and `dev` branches, you can delete your `release` branch, because it's mission is accomplished too.

> [!Note]
>
> After a branch's mission is accomplished, everything you want to do with it should targeting the later branches. A simple example, after new version release, any bug fix should be performed on the `hotfix` branch or `feature` branch for next version.


> [!Caution]
>
> It’s hard to collect the water after it's spilled~ / 覆水难收~

To delete a branch:

```bash
# Alias `bx` = `branch-delete`
#            = Custom alias, will delete a specific branch with specific range
git bx -a feat/feature-name
git bx -a release/vx.x.x
```

### Cherry-Pick Commit

Sometimes, you may want to apply some specific commits from one branch to another branch without merging/rebasing the entire branch. In this case, you can use the `cherry-pick`:

```bash
# Alias `cp` = `cherry-pickx`
#            = enhanced version of `cherry-pick`
git cp 1234567
```

### Git Configuration

#### `.gitconfig`

To configure Git, you can create a `.gitconfig` file in your system home directory and add your configuration settings there. Here is an example of a basic `.gitconfig` file:

```ini
[user]
name = Your Name
email = your.email@example.com

[core]
editor = nvim
```

To get full configuration example, please refer to my [`.gitconfig`](https://github.com/lumirelle/starship-butler/blob/main/packages/config-provider/assets/vcs/git/.gitconfig) file.

#### `.gitignore`

To ignore certain files or directories in your Git repository.

I prefer to use the template from VSCode extension [`codezombiech.gitignore`](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore).

#### `.git-blame-ignore-revs`

When you have some commits that make massive formatting changes to your codebase, it can be hard to use `git blame` to track down the original author of a line of code.

To solve this problem, you can create a `.git-blame-ignore-revs` file in the root directory of your repository and add the commit hashes of these formatting commits to this file. Then, when you run `git blame`, Git will ignore these commits and show you the original author of each line of code.

> [!Note]
>
> If this does not work, you may need to try `git blame --ignore-revs-file .git-blame-ignore-revs` to specify the ignore revs file explicitly.
