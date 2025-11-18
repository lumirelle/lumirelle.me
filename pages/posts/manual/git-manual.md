---
title: Git Manual
date: 2025-09-26T11:47+08:00
update: 2025-11-18T09:44+08:00
lang: en
duration: 15min
type: blog+note
---

[[toc]]

## What is Git?

Git is a distributed version control system, which is used to track changes in
source code during software development.

### Core Concepts

- **Repository (Repo)**:

  A repository is be composed of two parts. First part is the
  **commit history tree**, another part is the **working directory**.

  Repository can be local (on your computer), remote (on a server like GitHub)
  or both.

- **Commit**:

  A commit is a change record than the previous one. Each commit has a unique ID
  and contains information about the changes made.

  Different commits can based on the same previous commit, this forms a **commit
  history tree**.

- **Branch**:

  A branch is not a biological sense "branch", it always starts from the initial
  commit, and ends with leaf one (it's more like a combination of "trunk" and
  "branch").

  ```txt
             +- biological sense branch -+
             v                           v
             +--------------------------->
             |
  o----------+--------------------------->

  ...

  +------------- Git branch -------------+
  |                                      v
  |          +--------------------------->
  v          |
  o----------+--------------------------->
  ```

  The default branch is usually called `main` or `master`. You can create new
  branches based on the default branch to work on features or hotfixes without
  affecting it.

  Branches are one of the most important concepts in collaborative development.

- **Working Directory**:

  The working directory is the current state of your project files. It based on
  a node in the commit history tree, with your uncommitted changes.

- **Staging Area**:

  The staging area is a place where you can prepare changes before committing
  them.

- **HEAD**:

  HEAD is a pointer that indicates your working directory is based on which
  commit and branch. When the HEAD changes, the working directory will also
  change accordingly.

## Basic Usage of Git

> [!Note]
>
> This article is based on my
> [`custom Git configuration`](https://github.com/lumirelle/starship-butler/blob/main/packages/config-provider/assets/vcs/git/.gitconfig)
> .

### Initialize a Git Repository

To initialize a new Git repository, navigate to your project directory and run:

```bash
git init
```

Then, Git will create a `.git` directory in your project directory, which
contains all the Git metadata for your project.

### Make a Commit

After initializing, you may need to add some basic files (like `package.json`
for Node.js project) to the repository.

After that, you can make your initial commit:

```bash
# Command `aa`: Add all files to the staging area
git aa

# Command `cmms`: Commit the changes with a message
git cmms "feat: initial commit"
```

Commit will record the changes you made, and makes a new node in the commit
history tree based on the previous node. Each node is like a snapshot version of
your project at a specific time, so that you can revert to it if needed.

This is the most basic version control usecase.

So -- every time you want to make some changes, don't forget to commit them!

### Add a Remote

As a distributed version control system, Git allows you to collaborate with
others by syncing your local repository with a remote repository. You can use
services like GitHub, GitLab, or Bitbucket to host your remote repositories.

To add a remote repository, use the following command:

```bash
# Command `ren`: Add a remote repository, if `remote-name` is not
# provided, it will be set to `origin` by default
# git ren [remote-name] <remote-url>
git ren https://github.com/username/repo.git
```

### Pull and Push Commits

To sync your commits with a remote repository, you can `pull` and `push` commits
from/to the remote repository.

To pull latest changes from the remote repository, you can use the following
command:

```bash
# Command `pl`: Pull the latest changes from the remote repository
# if you already set the upstream branch
git pl
```

Or if you haven't set the upstream branch of the current branch yet:

```bash
# Command `plup`: Pull the latest changes from the remote repository
# and set the upstream branch
git plup
```

To push your commits to the remote repository:

```bash
# Command `ps`: Push commit on current branch to the remote repository,
# if you have not set the upstream branch, it will set the upstream
# branch to the remote branch with the same name as the current branch.
git ps
```

### Work with Branches (Git Workflow)

Branches are one of the most important concepts in collaborative development.

With branches, you can create a temporary fork with the "main version" of your
project, and work on it independently. After the task is done, you can also
merge it back to the "main version". So that you can keep the "main version"
always the stable and reliable one of your project.

So, how can we work with branches? There are some common Git workflows:

- **Centralized workflow**:

  Everything works on the same main branch, only for personal projects.

- **Feature branch workflow**:

  Create a new branch for each feature, and merge it back to the main branch
  after the task is done, suitable for small projects or personal projects.

- **Git Flow workflow**:

  With some stable branches/branch groups like `main`, `develop` (or `dev`) ,
  some temporary assistant branches like `release`, `hotfix/emergency` (or
  `hotfix/emerg`) , `feature` (or `feat`) , suitable for medium to large
  projects.
  - `main` branch/branch group is the stable and reliable one of your project;
  - `develop` branch contains the **completed** new features;
  - `release` branch group is the branch for the next release.
  - `hotfix` branch group is the branch for hotfixes.
  - `feature` branch group is the branch for new features.
  - ...

  For each feature, should create a new feature branch from `develop` branch,
  and merge them back to `develop` branch after the development is done.

  After one period of development completed, should create a new `release`
  branch from `develop` to prepare for testing and release tasks, and vacate the
  `develop` branch for the next period of development.

  After the test & release tasks (including bug fixes, changelog updates, etc.)
  are done, should merge the `release` branch back to `main` to create a new
  release, and `develop` to integrate the changes.

  For hotfix and emergency features, should create a new `hotfix/emergency`
  branch from `main`, and create a new `release` branch for testing and release
  tasks after the development is done. After the tasks are done too, merge the
  `hotfix/emergency` branch back to `main` to create a new release, and
  `develop` to integrate the changes.

  If your project provides more than one maintained version to the users, like
  `v1` and `latest`, you can use `v1` branch for `v1` version, and `main` branch
  for the latest version. The status of the `v1` branch is the same as the
  `main` branch, but commonly you don't want to providing new features on the
  `v1` branch, so `v1` branch has not corresponding `feature` branch group and
  `develop` branch, but `hotfix` branch group and `release` branch.

  You can also extend this workflow as needed, for example, you can define a new
  branch `test` for testing tasks, and use `release` branch for user acceptance
  testing tasks and release tasks.

- **Fork workflow**:

  Fork the original repository, create a new branch for feature development, and
  make a pull request to the original repository after the task is done.
  Suitable for open source projects.

You can choose one of the workflows above based on your project's size and
complexity.

This article will use the most complex Git Flow workflow as an example.

### Create a New Feature Branch

After the initial commit, we should create a `dev` branch based on the `main` to
hold completed new features.

```bash
# Command `swn`: Switch to a new branch and create it (if it doesn't exist?) If
# the `start-point` is not provided, it will be based on the current branch by
# default.
# git swn <branch-name> [start-point]
git swn dev main
```

For each new feature, we will create a new feature branch based on the `dev`
branch:

> [!Caution]
>
> If the feature is out of development period, that's mean it's a emergency
> feature, should treat it as a hotfix.
>
> You should also care about whether the `dev` branch contains incomplete
> features, if so, you should create new feature branch based on the more
> previous commit to escape the incomplete features in your new feature branch.
> The best workaround is to create a new feature branch based on the `main`
> branch.

```bash
git swn feature/your-feature-name dev
```

Now, you can work on your feature branch, commit changes frequently, and push
the branch to remote regularly.

### Drop Changes in Working Directory

When you work on your feature branch, you may want to discard some changes in
your working directory. You can use the following command to discard changes of
specific files:

```bash
# Command `x`: Discard changes of specific files in working directory
# git x <...file-path>
git x index.html index.css
```

Or you want to discard all changes in your working directory:

```bash
# Command `xa`: Discard all changes in working directory
git xa
```

### Drop Changes in Staging Area

When you work on your feature branch, you may want to unstage some changes in
your staging area. You can use the following command to do that:

```bash
# Command `au`: Unstage changes of specific files in staging area
# git au <file-path>
git au index.html
```

Or you want to unstage all changes in your staging area:

```bash
# Command `aau`: Unstage all changes in staging area
# git aau
git aau
```

### Drop Last Commit

When you work on your feature branch, you may want to undo some commits in your
local branch. You can use the following command to do that:

```bash
# Command `cmu`: Undo the last commit and keep the changes in staging area
git cmu
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to force push the branch to
> remote after dropping the last commit:
>
> ```bash
> git psf
> ```
>
> This may cause problems for other collaborators, so please use it with
> caution.

### Amend the Last Commit

If you want to amend the last commit, more conveniently than drop the last
commit and create a new one, you can amend it directly:

```bash
# Command `md`: Amend the last commit with the changes in staging area
git md
```

Or if you want to amend the last commit message:

```bash
# Command `mdi`: Amend the last commit and its message with the changes in
# staging area
git mdi
```

Then Git will open your default editor (`vim` is the default) to let you edit
the commit message, after you save and close the editor, the last commit will be
amended.

> [!Caution]
>
> If this commit has been pushed to remote, you need to force push the branch to
> remote after dropping the last commit:
>
> ```bash
> git psf
> ```
>
> This may cause problems for other collaborators, so please use it with
> caution.

### Revert a Commit

If you already pushed some wrong commits to a branch which has branch protection
enabled, you cannot force push to the remote branch. In this case, you can
revert the wrong commits by creating new commits that undo the changes made by
the wrong commits.

This is the only one choice in the case above, the cost is that the commit
history will be more ugly, likes your "evidence of guilt", which will spread
through the ages.

```bash
# Command `rv`: Revert a specific commit by its ID or relative position to HEAD
# git rv <commit-id|relative-head>
git rv HEAD
```

### Merge Branches

Come back to general workflow, after you finished your feature on your feature
branch, you need to merge it back to the `dev` branch.

```bash
# Command `sw`: Switch to an existing branch
# git sw <branch-name>
git sw dev

# Command `mg`: Merge a specific branch into the current branch with default
# message: "chore: merge branch 'branch-name' into 'current-branch-name'"
# git mg <branch-name>
git mg feature/your-feature-name

# Don't forget to push the `dev` branch to remote after merging
git ps
```

When all features are merged into the `dev` branch, and ready for testing, this
means one period of development is done, you should create a new `release`
branch to prepare for testing and release tasks:

```bash
git sw dev
# vx.x.x is the version number of the next release, e.g. v1.0.0.
git swn release/vx.x.x dev
git ps
```

> [!CAUTION]
>
> Before you create a new `release` branch, you should really think twice is there
> any features not yet ready for testing, but already been merged into the `dev`
> branch.

Your test tasks now can be performed on the `release` branch.

When your test team finds some bugs during testing, you can commit the bug fixes
directly on the `release` branch, and then merge the `release` branch back to
the `develop` branch again to integrate the bug fixes:

```bash
# Apply some bug fixes
git sw test
git aacmms "fix: some bugs found during testing"
git ps

# Merge `test` branch back to `dev` branch to integrate the bug fixes
git sw dev
git mg test
git ps
```

After all test tasks are done and verified, you can finally create a new release
by merging the `release` branch back to the `main` branch:

```bash
git sw main
git mg release/vx.x.x
git ps
```

### Manage Tags

After a new release, we should create a version tag to mark this point on the
`main` branch, and push it to remote.

```bash
git sw main

# Command `tgn`: Create a new tag with a specific name
# Simple tag:
# git tgn <tag-name>
# Annotated tag:
# git tgn <tag-name> <tag-message>
git tgn v1.0.0
git tgn v1.0.0 "Release version 1.0.0"
```

Then push the tag to remote:

```bash
# Command `pstg`: Push a specific tag to the remote repository, if `remote-name`
# is not provided, it will be set to `origin` by default. If `tag-name` is not
# provided, it will push all tags to remote.
# git pstg [remote-name] [tag-name]
git pstg
git pstg v1.0.0
```

Or if you want delete a tag both locally and on remote:

```bash
# Command `tgxbt`: Delete a specific tag both locally and on remote, if
# `remote-name` is not provided, it will be set to `origin` by default.
# git tgxbt [remote-name] <tag-name>
git tgxbt v1.0.0
```

### Rebase Branches

When something changes been integrated into the `dev` branch, and you also want
to integrate these changes into your feature branch, you can rebase your feature
branch onto the latest `dev` branch.

```bash
git sw feature/your-feature-name

# Command `rb`: Rebase the current branch onto a specific branch
# git rb <branch-name>
git rb dev
```

> [!Caution]
>
> Do not rebase a branch which has been
> **both pushed to remote and shared with others**.
>
> Rebase likes to pull out a "branch" from the tree and insert it into another
> place. For other collaborators working on this branch, they will lose their
> branch. This may cause problems for everyone, so please just use it with
> caution.

### Delete Branches

Now, you have some types of branches in your repository: `main`, `dev`,
and multiple `release` and `feature` branches.

The `main`, `dev` branches are long-lived branches, which will stay in the
repository for a long time (I mean forever).

But the `release` and `feature` branches are not.

When you finished your feature development and merged it back to the `dev`
branch, you can delete your `feature` branch, because it's mission is
accomplished.

When you finished your release tasks and merged it back to the `main` and `dev`
branches, you can delete your `release` branch, because it's mission is
accomplished too.

To delete a branch locally:

```bash
# Command `brx`: Delete a specific branch locally
# git brx <branch-name>
git brx feature/your-feature-name
git brx release/vx.x.x
```

And then delete it on remote:

```bash
# Command `brxre`: Delete a specific branch on remote, if `remote-name` is not
# provided, it will be set to `origin` by default.
# git brxre [remote-name] <branch-name>
git brxre feature/your-feature-name
git brxre release/vx.x.x
```

Or you can delete it both locally and on remote in one command:

```bash
# Command `brxbt`: Delete a specific branch both locally and on remote, if
# `remote-name` is not provided, it will be set to `origin` by default.
# git brxbt [remote-name] <branch-name>
git brxbt feature/your-feature-name
git brxbt release/vx.x.x
```

### Cherry-Pick Commits

Sometimes, you may want to apply some specific commits from one branch to
another branch without merging the entire branch. In this case, you can use the
cherry-pick command to apply the changes introduced by specific commits.

```bash
# Command `cp`: Cherry-pick a specific commit by its ID (or relative position to
# HEAD?)
# git cp <commit-id|relative-head?>
# This is a short commit ID example:
git cp 3b88e2d
```

### Git Configuration

#### `.gitconfig`

To configure Git, you can create a `.gitconfig` file in your home directory
(usually `~/.gitconfig` on Unix-like systems) and add your configuration
settings there. Here is an example of a basic `.gitconfig` file:

```ini
[user]
name = Your Name
email = your.email@example.com

[core]
editor = code --wait
```

To get full configuration example, please refer to my
[`.gitconfig`](https://github.com/lumirelle/starship-butler/blob/main/packages/config-provider/assets/vcs/git/.gitconfig)
file.

#### `.gitignore`

To ignore certain files or directories in your Git repository.

I prefer to use the template from VSCode extension
[`codezombiech.gitignore`](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore).

#### `.git-blame-ignore-revs`

When you have some commits that make massive formatting changes to your
codebase, it can be hard to use `git blame` to track down the original author of
a line of code.

To solve this problem, you can create a `.git-blame-ignore-revs` file in the
root directory of your repository and add the commit hashes of these formatting
commits to this file. Then, when you run `git blame`, Git will ignore these
commits and show you the original author of each line of code.
