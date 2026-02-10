---
title: Git Manual
date: 2025-09-26T11:47+08:00
update: 2026-02-10T12:01+08:00
lang: en
duration: 17min
type: note
---

[[toc]]

## What is Git?

Git is a distributed version control system, which is used to track changes in source code during software development.

### Core Concepts

- **Repository (Repo)**:

  A repository is be composed of two parts. First part is the **commit history tree**, another part is the **working directory**.

  Repository can be local (on your computer), remote (on a server like GitHub) or both.

- **Commit**:

  A commit is a diff record than the previous one. Each commit has a unique ID and contains information about the changes made.

  If different commits are based on the same previous commit, this will form a **commit history tree**.

- **Branch**:

  A branch is not a biological sense "branch", it always starts from the initial commit, and ends with leaf one (it's more like a combination of "trunk" and "branch").

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

  The default branch is usually called `main` or `master`. You can create new branches based on the default branch to work on features or hotfixes without affecting it.

  Branches are one of the most important concepts in collaborative development.

- **Working Directory**:

  The working directory is the current state of your project files. It based on a node in the commit history tree, with your uncommitted changes.

- **Staging Area**:

  The staging area is a place where you can prepare changes before committing them.

- **HEAD**:

  HEAD is a pointer that indicates your working directory is based on which commit and branch. When the HEAD changes, the working directory will also change accordingly.

## Basic Usage of Git

> [!Note]
>
> This article is based on my own `.gitconfig` configuration.
>
> For more details about the changed default behavior and custom alias, please see [the source file](https://github.com/lumirelle/starship-butler/blob/main/packages/config-provider/assets/vcs/git/.gitconfig).
>
> If you are interested in my configuration, you can try my configurations setting up tool: [`starship-butler`](https://github.com/lumirelle/starship-butler) or download the source file manually.

### Initialize a Git Repository

To initialize a new Git repository, navigate to your project directory and run:

```bash
git init
```

Then, Git will create a `.git` directory in your project directory, which contains all the Git metadata for your project.

### Make a Commit

After initializing, you may need to add some basic files (like `package.json` for Node.js project) to the repository.

After that, you can make your initial commit:

```bash
# Alias `a` = `add`
git a .

# Alias `cm` = `commit-with-message` = `commit --message`
git cm "feat: initial commit"
```

Commit will record the changes you made, and makes a new node in the commit history tree based on the previous node. Each node is like a snapshot version of your project at a specific time, so that you can revert to it if needed.

This is the most basic version control usecase.

So -- every time you want to make some changes, don't forget to commit them!

### Add a Remote

As a distributed version control system, Git allows you to collaborate with others by syncing your local repository with a remote repository. You can use services like GitHub, GitLab, or Bitbucket to host your remote repositories.

To add a remote repository, use the following command:

```bash
# Alias `ren` = `remote-new` = (custom-alias): Add a remote repository,
# if `remote-name` is not provided, it will use `origin` by default
#
# Usage: git ren [remote-name] <remote-url>
git ren https://github.com/username/repo.git
```

### Pull and Push Commits

To sync your commits with a remote repository, you can `pull` and `push` commits from/to the remote repository.

To pull latest changes from the remote repository, you can use the following command:

```bash
# Alias `l` = `pull`: Pull the latest changes from the remote repository
git l
```

To push your commits to the remote repository:

```bash
# Alias `p` = `push`: Push commit on current branch to the remote repository
git p
```

### Work with Branches (Git Workflow)

Branches are one of the most important concepts in collaborative development.

With branches, you can create a temporary fork with the "main version" of your project, and work on it independently. After the task is done, you can also merge it back to the "main version". So that you can keep the "main version" always the stable and reliable one of your project.

So, how can we work with branches? There are some common Git workflows:

- **Centralized workflow**:

  Everything works on the main branch, uses tags to mark the version numbers. Release new version periodically or randomly.

  Only for personal projects.

- **Feature branch workflow**:

  Create a new branch for each feature, and merge it back to the main branch after the task is done. One or more merges can make a new version release. Tags on the main branch are used to mark the version numbers too.

  Suitable for small projects or personal projects.

- **Git flow workflow**:

  With some long-term branches like `main`, `dev` (or `develop`) , and some temporary assistant branch groups like `release`, `hotfix/hotfeat`, `feat` (or `feature`) , suitable for medium to large projects:
  - `main` branch is always the stable version, each merge to `main` branch will make a new release, and tags on the `main` branch are used to mark the version numbers;
  - `dev` branch contains all of the **completed** new features for next iteration;
  - `release` branch group is used to testing before making a new version release.
  - `hotfix/hotfeat` branch group is used to make a hotfix or hotfeat to a released version.
  - `feat` branch group is the branch for new features.
  - ...

  When an iteration starts, for each feature, we should create a new feature branch from `dev` branch, and merge them back to `dev` branch after the development is done. For example:

  | Iteration | Features       | Branch Name |
  | --------- | -------------- | ----------- |
  | v1.1.0    | New product: A | feat/a      |
  |           | New product: B | feat/b      |
  |           | New product: C | feat/c      |

  After one iteration development completed (all features merged to `dev`), should create a new `release` branch from `dev` to prepare for testing and releasing, and vacate the `dev` branch for the next iteration development.

  After the test & release tasks (including bug fixes, changelog updates, etc.) are done, should merge the `release` branch back to `main` to create a new release, and `develop` to integrate the changes.

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
  > 1. Never merge a uncompleted/postponed feature branch to the `dev` branch
  > 2. If you want to integrate some changes on `dev` branch to your feature branch, use `rebase` please.

- **Open source workflow**:

  A variant of Git flow workflow, with only `main` and `feat` branches, and additional `v{version}` branch group.
  - `main` branch is for the next major version
  - `v{version}` branch group is for the current released major versions, e.g. `v1.0`, `v2.0`, etc. Tags on these branches are used to mark the version numbers, e.g. `v1.0.0`, `v2.0.0`, etc.
  - `feat` branch group is for new features, which will be merged to `main` or `v{version}` branch after the development is done.

  For participants who are not the maintainers of the repository, they can fork this repository and create a new feature branch in their fork, and make a pull request to `main` or `v{version}` branch of the original repository after the development is done.

  Suitable for open source projects.

You can choose one of the workflows above based on your project's size, complexity or your preference.

> [!Note]
>
> This article will use the most complex Git flow workflow as an example.

### Create a New Feature Branch

After the initial commit, we should create a `dev` branch immediately based on the `main` for iterations.

```bash
# Alias `swn` = `switch-new` = `switch --create`: Switch to a new branch and create it. If the
# `start-point` is not provided, it will use the current branch by default.
#
# Usage: git swn <branch-name> [start-point]
git swn dev main
```

For each new feature, we will create a new feature branch based on the `dev` branch:

> [!Caution]
>
> Although we say **"NOT TO MERGE UNCOMPLETED/POSTPONED FEATURE BRANCH TO DEV"**, but you cannot affect other's behavior.
>
> If you found that there is already a uncompleted/postponed feature branch merged to `dev`, the simply workaround is to create you feature branch based on the specific commit before it or the `main` branch.

```bash
git swn feature/your-feature-name dev
```

Now, you can work on your feature branch, commit changes frequently, and push the branch to remote regularly.

### Drop Changes in Working Directory

When you work on your feature branch, you may want to discard some changes in your working directory. You can use the following command to discard changes of specific files:

```bash
# Alias `x` = `discard` = (custom-alias): Discard changes under specific paths
# in working directory
#
# Usage: git x <...path>
git x index.html index.css
```

Or you want to discard all changes in your working directory:

```bash
git x .
```

### Drop Changes in Staging Area

When you work on your feature branch, you may want to unstage some changes in your staging area. You can use the following command to do that:

```bash
# Alias `u` = `disadd` = (custom-alias): Unstage changes under specific paths
# in staging area
#
# Usage: git u <...path>
git u index.html index.css
```

Or you want to unstage all changes in your staging area:

```bash
git u .
```

### Drop Last Commit

When you work on your feature branch, you may want to undo some commits in your local branch. You can use the following command to do that:

```bash
# Alias `uc` = `uncommit` = (custom-alias): Undo the last commit and keep the
# changes in staging area
git uc
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to force push the branch to remote after dropping the last commit:
>
> ```bash
> git p -f
> ```
>
> This may cause problems for other collaborators, so please use it with caution.

### Amend the Last Commit

If you want to amend the last commit, more conveniently than drop the last commit and create a new one, you can amend it directly:

```bash
# Alias `ca` = `commit-amend` = `commit --amend --no-edit`: Amend the last commit
# with the changes in staging area
git ca
```

Or if you want to amend the last commit message:

```bash
# Command `ce` = `commit-amend-with-edit` = `commit --amend`: Amend the last
# commit and its message with the changes in staging area
git ce
```

Then Git will open your default editor (`vim` is the default) to let you edit the commit message, after you save and close the editor, the last commit will be amended.

> [!Caution]
>
> If this commit has been pushed to remote, you need to force push the branch to remote after dropping the last commit:
>
> ```bash
> git p -f
> ```
>
> This may cause problems for other collaborators, so please use it with caution.

### Revert a Commit

If you already pushed some wrong commits to a branch which has branch protection enabled, you cannot force push to the remote branch. In this case, you can revert the wrong commits by creating new commits that undo the changes made by the wrong commits.

This is the only one choice in the case above, the cost is that the commit history will be more ugly, likes your "evidence of guilt", which will spread through the ages.

```bash
# Alias `rv` = `revert`: Revert a specific commit by its ID or relative
# position to HEAD
#
# Usage: git rv <commit-id|relative-head>
git rv HEAD
```

### Merge Branches

Come back to general workflow, after you finished your feature on your feature branch, you need to merge it back to the `dev` branch.

```bash
# Alias `sw` = `switch`: Switch to an existing branch
#
# Usage: git sw <branch-name>
git sw dev

# Alias `m` = `merge-with-default-message` = (custom-alias): Merge a specific
# branch into the current branch with default  message:
# "chore: merge branch branch-name into current-branch-name"
#
# Usage: git m <branch-name>
git m feature/your-feature-name

# Don't forget to push the `dev` branch to remote after merging
git p
```

When all features are merged into the `dev` branch, and ready for testing, this means one iteration is done, you should create a new `release` branch to prepare for testing and releasing:

```bash
git sw dev
# vx.x.x is the version number of the next release, e.g. v1.0.0.
git swn release/vx.x.x dev
git p
```

> [!CAUTION]
>
> Before you create a new `release` branch, you should really think twice is there any features not yet ready for testing, but already been merged into the `dev` branch.

Your test tasks now can be performed on the `release` branch.

When your test team finds some bugs during testing, you can commit the bug fixes directly on the `release` branch:

```bash
# Apply some bug fixes
git sw release/vx.x.x
git a .
git cm "fix: some bugs found during testing"
git p
```

After all test tasks are done and verified, you can finally create a new release by merging the `release` branch back to the `main` branch, and then merge the `release` branch back to the `dev` branch again to integrate the bug fixes:

```bash
# Merge `release` branch to `main` branch to create a new release
git sw main
git m release/vx.x.x
git p

# Merge `release` branch back to `dev` branch to integrate the bug fixes
git sw dev
git m release/vx.x.x
git p
```

### Manage Tags

After a new release, we should create a version tag to mark this point on the `main` branch, and push it to remote.

```bash
git sw main

# Alias `t` = `tag-wrapper` = (custom-alias): Create a new tag with a specific name
#
# Usage for Simple tag:
# git t <tag-name>
# Usage for Annotated tag:
# git t <tag-name> <tag-message>
git t v1.0.0
git t v1.0.0 "Release version 1.0.0"
```

Then push the tag to remote:

```bash
git p
```

Or if you want delete a tag both locally and on remote:

```bash
# Alias `tx` = `tag-delete` = (custom-alias): Delete a specific tag
#
# Usage: git tx <tag-name> [-o, -origin] [-a, -all]
git tx -a v1.0.0
```

### Rebase Branches

When something changes been integrated into the `dev` branch, and you also want to integrate these changes into your feature branch, you can rebase your feature branch onto the latest `dev` branch.

```bash
git sw feature/your-feature-name

# Alias `r` = `rebase`: Rebase the current branch onto a specific branch
#
# Usage: git r <branch-name>
git r dev
```

> [!Caution]
>
> Do not rebase a branch which has been **both pushed to remote and shared with others**.
>
> Rebase likes to pull out a "branch" from the tree and insert it into another place. For other collaborators working on this branch, they will lose their branch.
>
> What's worse, they will probably do a force push at any cost. (Don't trust user's input, and also don't trust your collaborator's behavior, this simple principle just suitable for many many situations 😅)
>
> This will bring you a lot of trouble, so please just use it with caution.

### Delete Branches

Now, you have some types of branches in your repository: `main`, `dev`, and multiple `release` and `feature` branches.

The `main`, `dev` branches are long-lived branches, which will stay in the repository for a long time (I mean forever).

But the `release` and `feature` branches are not.

When you finished your feature development and merged it back to the `dev` branch, you can delete your `feature` branch, because it's mission is accomplished.

When you finished your release tasks and merged it back to the `main` and `dev` branches, you can delete your `release` branch, because it's mission is accomplished too.

After a branch's mission is accomplished, everything you want to do with it should targeting the later branches. A simple example, after new version release, any bug fix will upgrade to "hotfix".

> It’s hard to collect the water after it's spilled~
>
> 覆水难收~

To delete a branch locally:

```bash
# Alias `bx` = `branch-delete` = (custom-alias): Delete a specific branch
#
# Usage: git bx <branch-name> [-o, --origin] [-a, --all] [-f, --force]
git bx feature/your-feature-name
git bx release/vx.x.x
```

And then delete it from origin remote:

```bash
git bx -o feature/your-feature-name
git bx -o release/vx.x.x
```

Or you can delete it both locally and on origin in one command:

```bash
git bx -a feature/your-feature-name
git bx -a release/vx.x.x
```

### Cherry-Pick Commits

Sometimes, you may want to apply some specific commits from one branch to another branch without merging/rebasing on the entire branch. In this case, you can use the cherry-pick command to apply the changes introduced by specific commits.

```bash
# Alias `cp` = `cherry-pick`: Cherry-pick a specific commit by its ID
# (or relative position to HEAD?)
#
# Usage: git cp <commit-id|relative-head?>
# This is a short commit ID example:
git cp 3b88e2d
```

### Git Configuration

#### `.gitconfig`

To configure Git, you can create a `.gitconfig` file in your home directory (usually `~/.gitconfig` on Unix-like systems) and add your configuration settings there. Here is an example of a basic `.gitconfig` file:

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
