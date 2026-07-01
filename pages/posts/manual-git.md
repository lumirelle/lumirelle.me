---
title: Git Manual
date: 2025-09-26T11:47+08:00
update: 2026-06-25T14:59+08:00
lang: en
duration: 17min
type: manual
---

[[toc]]

## What Is Git?

Git is a distributed version control system, which is used to track changes in source code during software development.

### Core Concepts

- **Repository (Repo)**:

  Repository contains all the information about your project.

  In concept, a repository is be composed of three parts: Git's configuration (in `.git`), the **commit history** (in `.git`), and the **working directory** (tracked files).

  Repository can be stored in local (on your computer), remote (on a server like GitHub) or both.

- **Commit**:

  A commit is a diff record than the previous one, except for the initial commit, it stores the initial state of your project.

  Each commit is named with a **unique ID** (SHA-1 until now).

  What's more, two different commits can base on the same previous commit. Through this, we can build **forks (branches)** on top of commit history. That's why the commit history looks like a **tree**.

- **Pointer**:

  A pointer is a reference to a specific commit node, which can be used to identify the commit node & the branch it belongs to (branch name).

  Pointers can move to another commit node.

  **HEAD** is a special pointer, the **working directory** is always based on the commit node referenced by HEAD. If HEAD moves to another commit node, the working directory will also change immediately to reflect the state of that commit node.

- **Branch**:

  A branch starts from a shared commit node with other branches (for the initial branch, it starts from the initial commit node), so we can say: branches are a bunch of changes made on top of that shared commit node.

  ```txt
                                         (feat/feature-name)
                                         v
             +===========================+=>
             |
  o==========+=> (main)
  ```

  We usually named the initial branch to `main` or `master`.

  The branch name is just a pointer to a specific commit node, which shows the end of the branch. When a new commit is made on this branch, the pointer will move to the new commit node.

  When you switch / checkout to a branch, it's just move the HEAD pointer to the commit node referenced by that branch name pointer.

- **Working Directory**:

  The working directory shows **the current state of your project**. It is always based on the commit node you are currently on (referenced by HEAD), with your uncommitted changes.

  When HEAD points move to another commit node, the working directory will also change to reflect the state of that commit node.

- **Staging Area**:

  The staging area is a place where you can stage changes before committing them.

## Basic Usage of Git

> [!Note]
>
> This article is based on my own `.gitconfig` configuration.
>
> For more details about the changed default behavior and custom alias, please see [the source file](https://github.com/lumirelle/dotfiles/blob/main/dot_gitconfig). You can also get help information of the custom alias usage by provide `--?` flag or `-?` flag.

### Initialize Git Repository

To initialize a fresh Git repository, open your project in the terminal and run:

```bash
git init
```

Then, Git will create a hidden `.git`, which contains all the Git metadata for your project.

At that time, there is no any commit in your repository, and the working directory is empty.

### Make Changes and Commit

After initializing, you can start making changes and then commit them.

First, you need to make some changes to the working directory, and then stage them to the staging area:

```bash
# Make some changes to the working directory...
echo "Hello, Git!" > index.js

# Stage the changes to the staging area...
git add index.js
```

After that, you can make the initial commit:

```bash
git commit --message "feat: initial commit"
```

Every time you want to record some changes, you can make a commit like this.

Making a commit will record the changes you made than the previous commit (or the initial state), also creates a new commit node in the commit history tree based on the previous node.

This is the most basic version control usecase.

### Add Remote

As a distributed version control system, Git allows you to collaborate with others by syncing your local repository with a remote repository. You can use services like GitHub, GitLab, or Bitbucket to host your remote repositories.

You need to add a remote, so that Git knows where the remote repository is located, and how to sync with it.

To add a remote, use the following command:

```bash
git remote add origin https://github.com/username/repo.git
```

### Pull and Push Commits

To sync your local commit history with a remote repository, you can `pull` commits from and `push` commits to them.

To pull latest commit history from the remote repository, you can use the following command:

```bash
git pull
```

To push your latest commit history to the remote repository:

```bash
git push
```

### Work with Branches

Branches are one of the most important concepts in collaborative development.

With branches, you can `checkout` a temporary fork with a specific state, and work on it independently. Through this, you can do anything you want without affecting the existing codebase.

After the tasks are done on those branches, you can apply them back by **pull request**.

> [!Note]
> I highly recommend you always to use **pull request** instead of `merge` to apply review and approval process.
>
> `merge` should only be used in cases of:
>
> 1.  Merge multiple feature branches into one big feature branch, caused by the changes of requirements or else;
> 2.  Merge upstream changes (for example, changes on the main branch) to feature branch. (In this case, `rebase` is a better choice than `merge`)

#### Branch Management Workflow

To keep things controlled and organized, there are several common branch management workflows:

- [**Single branch workflow:**](#single-branch-workflow) <i id="single-branch-workflow"></i>

  <TextTag>Personal</TextTag><TextTag preset="red">Not recommended</TextTag>

  Everything are committed to the `main` branch directly.

  One or more commits make a new version release. Tags on the `main` branch are used to mark the version numbers.

- [**Single major version workflow:**](#single-major-version-workflow) <i id="single-major-version-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Single version</TextTag>

  Create a new branch for each feature (`feat/xxx`) or hotfix (`hotfix/xxx`) from the `main` branch, apply it back to the `main` branch by **pull request** after the development is done.

  One or more pull requests make a new version release. Tags on the `main` branch are used to mark the version numbers too.

- [**Multiple major versions workflow:**](#multiple-major-versions-workflow) <i id="multiple-major-versions-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple versions</TextTag>

  Based on the [single major version workflow](#single-major-version-workflow), with multiple long-term branches for different major versions.

  - `main` branch is for **the next major version**;
  - `v{version}` branch group is for the released major versions, e.g. `v1.x`, `v2.x`, etc.
  - `feat/xxx` branch is for new feature, created from the `main` branch, also will be applied back to the `main` branch by **pull request** after the development is done.

    If this feature need to be **backported** to the released major versions, you should use `cherry-pick` to pick the merge commit node to the appropriate `v{version}` branch ([example](https://github.com/nuxt/nuxt)).
  - `hotfix/xxx` branch is for hotfix, created from the first included `v{version}` branch, and will be applied back to the appropriate `v{version}` branch by **pull request** after the development is done.

    If this hotfix need to be **forwardported** to the later versions, you can use `merge` to apply it back to the later `v{version}` & `main` branches ([example](https://github.com/symfony/symfony)).

  A simple comparison with single major version workflow:

  ```txt
  Single Major Version Workflow:
  o- ... -o- ... ... ... ... ... -o- ... ... ... ... ... -> (main)
          (tag v1.0.0)            (tag v2.0.0)

  Multiple Major Versions Workflow:
  o- ... -o- ... ... ... ... ... -o- ... ... ... ... ... -> (main)
          |                       |
          o- ... -> (v1.x)        o- ... -> (v2.x)
  ```

- [**Multiple Environment Workflow:**](#multiple-environment-workflow) <i id="multiple-environment-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple environments</TextTag>

  Based on the [single major version workflow](#single-major-version-workflow), with multiple long-term branches for different environments.

  - `main` branch is for **production environment**;
  - `uat` branch is for **UAT environment**;
  - `test` branch is for **testing environment**;
  - `dev` branch is for **development environment**;
  - `feat/xxx` branch is for new feature, created from the `main` branch, which will be applied back to `dev`, `test`, `uat`, `release` branch by **pull request**, based on the feature's development process.
  - `hotfix/xxx` branch is for hotfix, created from the `main` branch, which will be applied back to `dev`, `test`, `uat`, `release` branch by **pull request**, based on the hotfix's development process.

You can choose one of the workflows above based on your project's size, type, complexity or your preference.

> [!Note]
>
> This article will use the most complex [**multiple major versions workflow**](#multiple-major-versions-workflow) as an example.

### Create a New Feature Branch

> [!Note]
> Basically, we only start a new feature development on the next major version branch, which is the `main` branch in this case.
>
> If other versions need this feature, we can backport it.
>
> That's to say, we will never develop a new feature for a specific released version but not for the next major version.

To add a new feature, you should create a new feature branch based from `main` branch first.

```bash
git switch --create feat/feature-name main
```

Then, you can work on your feature branch, commit changes frequently, and push them to remote regularly:

```bash
echo "Hello, Git!" > index.js
git add index.js
git commit --message "feat: add index.js"

echo "Hello, Git!" > second.js
git add second.js
git commit --message "feat: add second.js"

# ...
```

### Drop Changes / Reset to HEAD

When you work on your feature branch, you may want to discard the changes easily:

You can use the following command:

```bash
# Alias `discard` = custom alias, will reset tracked files to HEAD,
#                   and remove untracked files based on specific paths
git discard index.html index.css
```

To discard all changes:

```bash
# `.` means the project root, of course, only if you are in the project root.
git discard .
```

### Unstage / Unadd Changes

If you have staged some changes by `git add`, you can also unstage them by `git unadd` (my custom alias):

```bash
# Alias `disadd` = Custom alias, will unstage the changes based on specific paths
git disadd index.html index.css
```

To unstage all changes:

```bash
git disadd .
```

### Undo Last Commit / Uncommit

When you commit some changes in accident, you can undo it by `git uncommit` (my custom alias too 😄):

```bash
# Alias `uncommit` = Custom alias, will undo the last commit
git uncommit
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to perform force push to remote after undo it:
>
> ```bash
> git push --force
> ```
>
> This may cause problems for other collaborators, please use it with caution 🙏.

### Amend Last Commit

If you want to amend the last commit, more conveniently than drop the last commit and create a new one, you can do:

```bash
git commit --amend --no-edit
```

Or if you want to edit the last commit message:

```bash
git commit --amend

# Or with specific new commit message directly:
git commit --amend --message "fix: some bugs"
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to perform force push to remote after undo it:
>
> ```bash
> git push --force
> ```
>
> This may cause problems for other collaborators, so please use it with caution 🙏.

### Revert Commit

Undo or amend last commit is unsafe, this may break other collaborators' work if you and them are working on the same branch.

For more safety choice, you can use `git revert` to create a new commit that undoes the changes made by a specific commit.

The cost is that the commit history will be more ugly, likes your "evidence of guilt", which will spread through the ages. 🫠

```bash
git revert HEAD
```

### Merge Branch

Come back to general workflow from "error handling", after you completed your feature, you need to merge it back to the `dev` branch.

```bash
git switch dev

# Alias `justmerge` = Custom alias, will merge the specific branch to current branch,
#                      with predefined commit message
git justmerge feat/feature-name

# Don't forget to push the `dev` branch to remote!
git push
```

When all features are merged into the `dev` branch, and ready for testing, you should create a new `release` branch to prepare for testing, bug fixing and releasing:

```bash
git switch dev
# vx.x.x is the version number of the next release, e.g. v1.0.0.
git switch --create release/vx.x.x dev
git push
```

> [!CAUTION]
>
> Before you create a new `release` branch, you should really think twice is there **any uncompleted features** already been merged into the `dev` branch. 😅 🙏

After that, your next tasks now can be performed on the `release` branch.

When your test team finds some bugs during testing, you can commit the bug fixes directly on the `release` branch. After all tasks done, you can finally create a new release by merging the `release` branch back to the `main` branch, and then merge the `release` branch back to the `dev` branch again to integrate the bug fixes:

```bash
# Merge `release` branch to `main` branch to create a new release
git switch main
git justmerge release/vx.x.x
git push

# Merge `release` branch back to `dev` branch to integrate the bug fixes
git switch dev
git justmerge release/vx.x.x
git push
```

### Manage Tag

After a new release, we should create a version tag to mark this point on the `main` branch, and push it to remote.

```bash
git switch main

git tag v1.0.0
git tag --annotate v1.0.0 --message "Release version 1.0.0"
```

Then push the tag to remote:

```bash
git push
```

Or if you want to delete a tag

```bash
git tag --delete v1.0.0
```

### Rebase Branch

When something changes been integrated into the `dev` branch, and you also want to integrate these changes into your **local** feature branch, you can rebase your feature branch onto the latest `dev` branch.

```bash
git switch feat/feature-name

git rebase dev
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
git branch --delete feat/feature-name
git branch --delete release/vx.x.x
```

### Cherry-Pick Commit

Sometimes, you may want to apply some specific commits from one branch to another branch without merging/rebasing the entire branch. In this case, you can use the `cherry-pick`:

```bash
git cherry-pick 1234567
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

To get full configuration example, please refer to my [`.gitconfig`](https://github.com/lumirelle/dotfiles/blob/main/dot_gitconfig) file.

#### `.gitignore`

To ignore certain files or directories in your Git repository.

I prefer to use the template from VSCode extension [`codezombiech.gitignore`](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore).

#### `.git-blame-ignore-revs`

When you have some commits that make massive formatting changes to your codebase, it can be hard to use `git blame` to track down the original author of a line of code.

To solve this problem, you can create a `.git-blame-ignore-revs` file in the root directory of your repository and add the commit hashes of these formatting commits to this file. Then, when you run `git blame`, Git will ignore these commits and show you the original author of each line of code.

> [!Note]
>
> If this does not work, you may need to try `git blame --ignore-revs-file .git-blame-ignore-revs` to specify the ignore revs file explicitly.
>
> For VSCode users, I highly recommend the [eamodio.gitlens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) extension to show the Git blame information, other than the built-in Git extension, because it respects the `.git-blame-ignore-revs` file by default, while the built-in one does not.

## LazyGit

https://github.com/jesseduffield/lazygit

Simple terminal UI for git commands, I highly recommend it for everyone.

Why? If you have used VSCode or other IDEs quite a long time, with their Git GUI, you may find that: You have to wait several seconds for each GUI operation, wait for the GUI to update. That's quite annoying, especially with a large project, when the IDE takes a lot of CPU and memory resources, the Git GUI will be even slower.

The truth is: The raw Git commands are already completed, but the GUI is still rendering and updating, which means 80% of the time you spend on the Git GUI is wasted on GUI itself!

So, why not just use a terminal UI for Git commands? Both fast and visual!
