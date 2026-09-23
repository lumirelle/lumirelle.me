---
title: Git Manual
date: 2025-09-26T11:47+08:00
update: 2026-09-22T17:56+08:00
lang: en
duration: 15min
type: manual
group: VCS
order: 1
---

[[toc]]

## What Is Git?

Git is a distributed version control system, which is used to track changes in source code during software development.

### Core Concepts

- **Repository (Repo)**:

  A repository contains all the information about your project.

  Conceptually, a repository is composed of three parts: Git's configuration & metadata (in `.git`), the **commit history** (in `.git`), and the **working directory** (tracked paths).

  A repository can be stored locally (on your computer), remotely (on a server like GitHub), or both.

- **Commit (Revision)**:

  A commit is a **diff record** against the previous one; except for the initial commit, which stores the initial state of your project.

  Each commit is identified by a **unique ID** (SHA-1 so far).

  What's more, two different commits can be based on the same previous commit. Through this, we can build **forks (branches)** on top of the commit history. That's why the commit history looks like a **tree**.

- **Pointer**:

  A pointer is a reference to a specific commit, which can be used to identify that commit.

  Pointers can move to another commit.

  Git has two main kinds of pointers: `HEAD` is an **implicit pointer** that always marks where you are working, while a **branch** is an **explicit, named pointer** that Git advances for you as you commit.

  **HEAD** is a special pointer: it is usually a *symbolic* pointer that points to a branch rather than directly to a commit, and it only points to a commit directly in the "detached HEAD" state. Keeping the **working directory** in sync with the commit HEAD refers to is the job of the command that moves HEAD: `git switch` / `git checkout` update the working directory (and refuse if that would overwrite your uncommitted changes), while `git reset --soft` moves HEAD and leaves the working directory untouched.

- **Branch**:

  A branch starts from a shared commit with other branches (for the first branch, it starts from the initial commit), so we can say: a branch is a bunch of changes made on top of that starting commit.

  ```txt
                                         (feat/feature-name)
                                         v
             +===========================+=>
             |
  o==========+=> (main)
  ```

  We usually name the initial branch `main` or `master`.

  The branch name is just a pointer to a specific commit, which shows the end of the branch. When a new commit is made on this branch, that branch pointer will move to the new commit automatically.

  When you switch / checkout to a branch, it just moves the *symbolic* HEAD pointer to that branch name pointer.

  **In Git, the branch is the first-class citizen.** Working on a branch is the default and intended way to work: `git commit` records onto whatever branch `HEAD` points to, and that branch advances automatically. The branch, not the commit, is the unit you create, switch, merge, and delete. Commits that are not on a branch are a special case (the "detached HEAD" state), kept alive only by the reflog, so they are rarely used for real work. In general, any commit that no ref points to, no branch, no tag, no remote ref, is **unreachable**: Git stops tracking it, and it is eventually garbage-collected.

- **Working Directory**:

  The working directory shows **the current state of your project**: the files on disk (the content of the commit) you are on, plus your uncommitted changes and any untracked or ignored files. It is *not* automatically in sync with `HEAD`; see **Pointer** above.

- **Staging Area**:

  The staging area is a place where you can stage changes before committing them.

- **Conflict**:

  In git, conflicts prevent you from doing anything until you resolve it.

## Basic Usage of Git

> [!Note]
>
> This article is based on my own `.gitconfig` configuration.
>
> For more details about the changed default behavior, please see [the source file](https://github.com/lumirelle/dotfiles/blob/main/dot_gitconfig).

### Initialize Git Repository

There are two ways to start a Git repository: **create a new one** from your local files (`git init`), or **clone an existing one** from a remote repository (`git clone`).

#### Create a New Repository

To initialize a fresh Git repository, open your project in the terminal and run:

```bash
git init
```

Then, Git will create a hidden `.git` directory, which contains all the Git metadata for your project.

At that point, there are no commits in your repository, and the working directory is empty.

#### Clone an Existing Repository

To start from an existing remote repository instead, use `git clone`:

```bash
git clone {{repoUrl}} {{destination}}
```

The remote is named `origin` unless you pass `--origin {{name}}`, and the default branch is checked out, so you can start working right away. The remote's other branches are available as **remote-tracking branches** (like `origin/main`).

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

Making a commit records the changes you made since the previous commit (or the initial state), and also creates a new commit node in the commit history tree based on the previous node.

This is the most basic version control use case.

### Sync with Remote Repository

As a distributed version control system, Git allows you to collaborate with others by syncing your local repository with a remote repository. You can use services like GitHub, GitLab, or Bitbucket to host your remote repositories.

#### For Newly Created Repositories

If you created your repository with `git init` instead of cloning it, it has no remote yet. Before you can pull or push, you need to add one, so that Git knows where the remote repository is located, and how to sync with it.

To add a remote, use the following command:

```bash
git remote add origin https://github.com/username/repo.git
```

You can inspect the configured remotes with `git remote --verbose`, and manage them with `git remote rename` / `set-url` / `remove`.

#### Sync Changes with Remote

In Git, the branch is the first-class citizen: you sync commits through branches.

As you already know, a branch is a reference to commits. You can use `git fetch` to update the locally remembered position of the remote branch (`refs/remotes/{{remote}}/{{branch}}`). After that, you can **integrate changes** from or to that remote branch — `git pull` commits from that remote branch and `git push` commits to it.

Both commands operate on the **current branch**, and they need to know which remote branch it is linked to: its **upstream**, recorded as `branch.{{name}}.remote` and `branch.{{name}}.merge`.

A branch created with `git switch --create` has no upstream yet. You should establish the link once, either by pushing the branch with `--set-upstream`:

```bash
# To see the current branch you are on:
# $> git branch
# -> * feat/feature-name

git push --set-upstream origin feat/feature-name
```

Or by linking the branch to an existing remote branch:

```bash
# To see the current branch you are on:
# $> git branch
# -> * main

git branch --set-upstream-to=origin/main
```

> [!Note]
> In this article's configuration, `push.autoSetupRemote = true` is set, so the first `git push` of a new branch creates its upstream automatically, and `--set-upstream` is usually unnecessary.

Once the upstream is set, both commands are simple. You can verify the relation with:

```bash
git branch
# -> * main
git config --get branch.main.remote
# -> origin
git config --get branch.main.merge
# -> refs/heads/main
```

To integrate the latest commits from that remote branch to the current branch, you can use the following command:

```bash
# Integrate commits from origin/main to main
git pull
```

To integrate your latest commits to that remote branch:

```bash
# Integrate commits from main to origin/main
git push
```

### Work with Branches

Branches are one of the most important concepts in collaborative development.

With branches, you can `checkout` a temporary fork with a specific state, and work on it independently. Through this, you can do anything you want without affecting the existing codebase.

After the tasks are done on those branches, you can apply them back by **pull request**.

> [!Note]
> I highly recommend you always use a **pull request** instead of `merge` to apply the review and approval process.
>
> `merge` should only be used in cases of:
>
> 1.  Merge multiple feature branches into one big feature branch, due to changed requirements or other reasons;
> 2.  Merge upstream changes (for example, changes on the main branch) into a feature branch. (In this case, `rebase` is a better choice than `merge`.)

#### Branch Management Workflow

To keep things controlled and organized, there are several common branch management workflows:

- [**Main Branch Workflow:**](#main-branch-workflow) <i id="main-branch-workflow"></i>

  <TextTag>Personal</TextTag><TextTag preset="red">Not recommended</TextTag>

  Everything is committed to the main branch directly.

  Versions are marked by tags on the main branch, each release means one or more commits on the main branch.

- [**Feature Branch Workflow:**](#feature-branch-workflow) <i id="feature-branch-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Single version</TextTag>

  The main branch only accepts **pull/merge requests** and does not accept any direct commit.

  Commits are performed on feature branches (`feat/xxx`) or hotfix branches (`hotfix/xxx`), which are always checked out from the main branch and applied back to the main branch via pull/merge requests once development is complete.

  Versions are marked by tags on the main branch, each release means one or more pull/merge requests on the main branch.

- [**Multiple Versions Workflow:**](#multiple-versions-workflow) <i id="multiple-versions-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple versions</TextTag>

  Based on the [feature branch workflow](#feature-branch-workflow), with multiple long-term branches for different major versions.

  - Main branch is for **the next major version**
  - Released version branches (`v{{version}}`) are for the released major versions, e.g. `v1.x`, `v2.x`, etc.
  - Feature (`feat/xxx`) branches are for new features, checkout from the main branch, and applied back to the main branch by pull/merge requests once the development is done.

    If this feature needs to be **backported** to any released major version, you should use `cherry-pick` to pick that merge commit into the appropriate `v{{version}}` branch. See [examples](https://github.com/nuxt/nuxt) here.
  - Hotfix (`hotfix/xxx`) branches are for hotfixes, checkout from the first included released version branch, and applied back to that branch by pull/merge requests once the development is done.

    If this hotfix needs to be **forwardported** to any other released version or next major version, you should use `cherry-pick` to pick that merge commit into the appropriate `v{{version}}` or main branch. See [examples](https://github.com/nuxt/nuxt) here.

  A simple comparison with feature branch workflow:

  ```txt
  Feature Branch Workflow:
  o- ... -o- ... ... ... ... ... -o- ... ... ... ... ... -> (main)
          (tag v1.0.0)            (tag v2.0.0)

  Multiple Versions Workflow:
  o- ... -o- ... ... ... ... ... -o- ... ... ... ... ... -> (main)
          |                       |
          o- ... -> (v1.x)        o- ... -> (v2.x)
  ```

- [**Multiple Environment Workflow:**](#multiple-environment-workflow) <i id="multiple-environment-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple environments</TextTag>

  Based on the [feature branch workflow](#feature-branch-workflow), with multiple long-term branches for different environments.

  - main branch is for **production environment**
  - `uat` branch is for **UAT environment**
  - `test` branch is for **testing environment**
  - `dev` branch is for **development environment**
  - Feature branches are for new features, checkout from the main branch, and applied back to the `dev`, `test`, `uat`, and main branches by pull/merge requests, based on the feature's development process.
  - Hotfix branches are for hotfixes, checkout from the main branch, and applied back to the `dev`, `test`, `uat`, and main branches by pull/merge requests, based on the hotfix's development process.

  > [!Note]
  > **Why not promote strictly (`test` → `uat` → `main`)?**
  >
  > A promotion is a *wholesale* merge (`git switch uat && git merge test`): everything sitting on the previous environment's branch comes along. Environment branches are writable in practice and collect things that must not be released (a debug commit on `test`, a config tweak on `uat`) and a strict chain would carry them upward without anyone deciding to.
  >
  > Applying every change to every environment flips the failure mode: **missing an application is explicit and cheap to find** (compare the applied sets, or just open a pull request), whereas something riding along unnoticed is implicit and hard to trace, especially when the promotion happened as a local merge.
  >
  > It is the same kind of decision as backport/forwardport across version branches: moving changes between long-lived branches is always a per-change, human one. The price is that you should care about which artifact/commit each environment actually runs.

You can choose one of the workflows above based on your project's size, type, complexity or your preference.

> [!Note]
>
> This article will use the most complex [**multiple versions workflow**](#multiple-versions-workflow) as an example.

### Create a New Branch

#### Feature Branch

> [!Note]
> Basically, we only start new feature development on the next major version branch, which is the `main` branch in this case. If other versions need this feature, we can backport it.
>
> That is to say, we will never develop a new feature for a specific released version but not for the next major version.

To add a new feature, you should create a new feature branch based on the `main` branch first.

```bash
git switch --create feat/feature-name main
```

Then, you can work on your feature branch, commit changes frequently, and push them to the remote regularly:

```bash
echo "Hello, Git!" > index.js
git add index.js
git commit --message "feat: add index.js"

echo "Hello, Git!" > second.js
git add second.js
git commit --message "feat: add second.js"

# ...
```

#### Hotfix Branch

To add a hotfix, you should create a new hotfix branch based on the first included released version branch. For example, if the bug appears in the `v1.x` branch to the next major version:

```bash
git switch --create hotfix/bug-name v1.x
```

Then, you can work on your hotfix branch, commit changes frequently, and push them to the remote regularly:

```bash
echo "Fix the bug!" >> index.js
git add index.js
git commit --message "hotfix: fix the bug"

# ...
```

### Discard Changes

When you work on your branch, you may want to discard the changes (in the workspace).

All of the commands below take a **pathspec**:  can be a file, a directory, or a wildcard pattern. E.g. `index.ts`, `bin/`, or `src/**/*.ts`.

You can use the following command to restore specific tracked paths:

```bash
git restore index.html index.css
```

To restore all paths:

```bash
# `.` means the project root,
# of course, only if you are in the project root.
git restore .
```

To clean specific untracked paths (`-d` allows directories):

```bash
git clean --force -d bin/ index.ts
```

To clean all untracked paths:

```bash
# `.` means the project root,
# of course, only if you are in the project root.
git clean --force -d .
```

Paths you never want Git to track belong in `.gitignore`. For a path that is already tracked, add it to `.gitignore` first and then untrack it without deleting it from disk:

```bash
git rm --cached -r index.ts
```

### Unstage Changes

If you have staged some changes by `git add`, you can also unstage them with `git reset`:

```bash
git reset index.html index.css
```

To unstage all changes:

```bash
git reset .
```

### Undo Last Commit

When you commit some changes by accident, you can undo it with `git reset HEAD^`:

```bash
git reset HEAD^
```

> [!Caution]
> If this commit has been pushed to the remote, undoing it locally only rewrites *your* history, and the remote still has the old commit. So putting the undo on the remote needs a force push:
>
> ```bash
> git push --force-with-lease --force-if-includes
> ```
>
> `--force-with-lease` refuses when the remote has moved since your last fetch, so you cannot silently overwrite a collaborator's work.
>
> `--force-if-includes` (Git 2.30+) adds the other half: the remote's new commits must have been integrated locally, which is what protects you when a background fetch refreshed the lease for you.
>
> This may cause problems for other collaborators, please use it with caution 🙏.

### Amend Last Commit

If you want to amend the last commit, which is more convenient than dropping the last commit and creating a new one, you can do:

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
> If this commit has been pushed to the remote, you need to force push to the remote after amending it:
>
> ```bash
> git push --force-with-lease --force-if-includes
> ```
>
> This may cause problems for other collaborators, so please use it with caution 🙏.

### Revert Commit

Undoing or amending the last commit is unsafe; this may break other collaborators' work if you and they are working on the same branch.

For a safer choice, you can use `git revert` to create a new commit that undoes the changes made by a specific commit.

The cost is that the commit history will be uglier, like your "evidence of guilt", which will spread through the ages. 🫠

```bash
git revert HEAD
```

### Rebase Branch

When you want to integrate some changes from the upstream branch into your branch, you can rebase your branch onto it.

```bash
git switch {{your-branch}}
git rebase {{upstream-branch}}
# A rebase rewrites history, so the push needs --force-with-lease --force-if-includes (never plain --force)!!!
git push --force-with-lease --force-if-includes
```

> [!Caution]
> Do not rebase a branch that is **shared with others**.
>
> This may cause problems for other collaborators, so please use it with caution 🙏.

### Integrate Changes

#### Pull Request

I highly recommend you always use a **pull request** to perform the code review and approval process before integrating changes from one branch to another branch.

All the operations are simple:

1. Open a pull request on the remote hosting service (like GitHub, GitLab, Bitbucket, etc.), from your branch to the target branch;
2. Perform code review and approval process;
3. Then, accept the pull request.

#### Merge Branch (Not Recommended)

```bash
git switch {{target-branch}}

git merge {{your-branch}}

# Don't forget to push the target branch to remote!
git push
```

#### Integrate Changes Example

> [!Note]
> This example uses `merge` to show the flow of integrating changes, but I still recommend you use a **pull request** instead.

Feature branch development flow:

```bash
# Create a new feature branch from main
git switch --create feat/feature-name main

# ...Make some changes

# Integrate changes
git switch main
git justmerge feat/feature-name
```

Hotfix branch development flow:

```bash
# Create a new hotfix branch from the first included released version branch
git switch --create hotfix/bug-name v1.x

# ...Make some changes

# Integrate changes
git switch v1.x
git justmerge hotfix/bug-name
```

### Manage Tags & Create Released Major Version Branch

When you want to release a new version, after completing the necessary changes (changelogs, bumping the version...), you should create a version tag to mark this point on the `main` branch, and push it to the remote.

```bash
# Complete the necessary changes...
git switch main
echo "- v1.0.0: ..." >> CHANGELOG.md
bumpversion 1.0.0

git tag v1.0.0
git tag --annotate v1.0.0 --message v1.0.0
```

Then push the tag to remote:

```bash
git push --tags
```

Or if you want to delete a tag:

```bash
git tag --delete v1.0.0
```

After that, you should create a new branch for this released major version.

```bash
# TODO: Can we use tag v1.0.0 instead of main?
git switch --create v1.x main
```

### Delete Branch

Once you have integrated the changes from a feature / hotfix branch into the target branch, you can delete it if it is no longer needed.

This helps to keep your branch list clean and organized.

```bash
git branch --delete feat/feature-name
git push origin --delete feat/feature-name

git branch --delete hotfix/bug-name
git push origin --delete hotfix/bug-name
```

### Backport Feature (Cherry-pick)

Sometimes, you may want to apply some specific commits from one branch to another branch without merging/rebasing the entire branch. In this case, you can use `cherry-pick`.

The most common use case is to backport a feature to the released major version branch. For example, you want to backport the feature on the `main` branch, which is introduced by the merging of `feat/xxx`, the only things you need to do are:

1.  Find the merge commit hash of `feat/xxx` in the `main` branch, for example, `1234567`;
2.  Cherry-pick this commit to the released major version branch `v1.x`:

```bash
git switch v1.x
git cherry-pick 1234567
git push
```

### Forwardport Bugfix (Merge)

When you want to apply a bugfix from a released major version branch to the later versions, just do as you do in the [integrate changes](#integrate-changes) section:

> [!Note]
> Of course, a **pull request** is still recommended over `merge`.

```bash
git switch v2.x
git justmerge v1.x
git push

git switch main
git justmerge v1.x
git push
```

### Git Configuration

#### `.gitconfig`

To configure Git's behavior, you can create a `.gitconfig` file in your system **home directory** and add your configuration settings there. Here is an example of a basic `.gitconfig` file:

```ini
[user]
name = Your Name
email = your.email@example.com

[core]
editor = nvim
```

To get a full configuration example, please refer to my [`.gitconfig`](https://github.com/lumirelle/dotfiles/blob/main/dot_gitconfig) file.

#### `.gitignore`

This file is used to ignore certain paths in your Git repository: every line is a pattern that selects paths (files, directories, or wildcards) — e.g. `*.log`, `build/`, or `!src/keep.log` to un-ignore a single one.

I prefer to use the templates from [github/gitignore](https://github.com/github/gitignore). There are some extensions for different editors to generate a `.gitignore` file based on those templates with ease:

- Neovim: [`gitignore.nvim`](https://github.com/wintermute-cell/gitignore.nvim)
- VSCode: [`codezombiech.gitignore`](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore).

#### `.git-blame-ignore-revs`

When you have some commits that make massive formatting changes to your codebase, it can be hard to use `git blame` to track down the original author of a line of code.

To solve this problem, you can create a `.git-blame-ignore-revs` file in the root directory of your repository and add the commit hashes of these formatting commits to this file. Then, when you run `git blame`, Git will ignore these commits and show you the original author of each line of code.

> [!Note]
>
> Git does not respect `.git-blame-ignore-revs` by default; you need to configure it in your `.gitconfig` file:
>
> ```ini
> [blame]
> ignoreRevsFile = ":(optional).git-blame-ignore-revs"
> ```

## LazyGit

https://github.com/jesseduffield/lazygit

Simple terminal UI for git commands; I highly recommend it for everyone.

Why? If you have used VS Code or other IDEs for quite a long time, with their Git GUI, you may find that: you have to wait several seconds for each GUI operation, waiting for the GUI to update. That's quite annoying, especially with a large project: when the IDE takes a lot of CPU and memory resources, the Git GUI will be even slower.

The truth is: the raw Git commands are already completed, but the GUI is still rendering and updating, which means 80% of the time you spend on the Git GUI is wasted on the GUI itself!

So, why not just use a terminal UI for Git commands? It is both fast and visual!
