---
title: Git Manual
date: 2025-09-26T11:47+08:00
update: 2025-10-28T11:56+08:00
lang: en
duration: 13min
type: blog+note
---

[[toc]]

## What is Git?

Git is a distributed version control system, which is used to track changes in source code during software development.

### Core concepts

- **Repository (Repo)**: A repository is be composed of two parts. First part is the **storage for all commits** of your
  project, another part is the **working directory**. It can be local (on your computer) or remote (on a server like
  GitHub).
- **Commit**: A commit is a snapshot of your project at a specific point in time. Each commit has a unique ID and
  contains information about the changes made than the previous commit. A commit is always based on a previous commit,
  except for the initial commit, and different commits can based on the same previous commit. This forms a commit tree.
- **Branch**: A branch is a chain of commits start from the initial commit, and end with any commit, so that different
  branches can have same parts. The default branch is usually called `main` or `master`. You can create new branches
  based on the default branch to work on features or fixes without affecting it.
- **Working Directory**: The working directory is the current state of your project files.
- **Staging Area**: The staging area is a place where you can prepare changes before committing them.
- **HEAD**: HEAD is a pointer that indicates your working directory is on which commit and branch. When the HEAD changes,
  the working directory will also change accordingly.

## How to use Git?

> [!Note]
>
> This article use custom
> [`gitconfig`](https://github.com/lumirelle/starship-butler/blob/main/packages/config-provider/assets/vcs/git/.gitconfig)
> file for configuration.

### Initialize a Git repository

To initialize a new Git repository, navigate to your project directory and run:

```bash
git init
```

### Initial commit

After initializing the repository, you may need to create some basic files (like `package.json` for Node.js project).
Then, you can create your initial commit:

```bash
# Command `aa`: Add all files to the staging area
git aa

# Command `cmms`: Commit the changes with a message
git cmms "feat: initial commit"
```

### Add remote and push to remote

As a distributed version control system, Git allows you to collaborate with others by pushing your commits to a remote
repository. You can use services like GitHub, GitLab, or Bitbucket to host your remote repositories.

To add a remote repository, use the following command:

```bash
# Command `ren`: Add a remote repository, if `remote-name` is not
# provided, it will be set to `origin` by default
# git ren [remote-name] <remote-url>
git ren https://github.com/username/repo.git
```

Then push your commits to the remote repository:

```bash
# Command `ps`: Push commit on current branch to the remote repository,
# if you have not set the upstream branch, it will set the upstream
# branch to the remote branch with the same name as the current branch.
git ps
```

### Pull from remote

To update your local repository with changes from the remote repository, you can pull the latest changes:

```bash
# Command `plup`: Pull the latest changes from the remote repository
# and set the upstream branch
git plup
```

Or if you have already set the upstream branch:

```bash
# Command `pl`: Pull the latest changes from the remote repository
# if you already set the upstream branch
git pl
```

### Work with branches

That's come back to general workflow.

After the initial tasks are done, now you have a `main` branch with your initial commit.

To start development, we should create a `dev` branch based on the `main` branch to keep the `main` branch stable: Only
if the code on the `dev` branch is tested and verified, we can merge it back to the `main` branch.

```bash
# Command `swn`: Switch to a new branch and create it (if it doesn't exist?) If
# the `start-point` is not provided, it will be based on the current branch by
# default.
# git swn <branch-name> [start-point]
git swn dev main
```

We also need a `test` branch based on the `dev` branch to perform test tasks:

```bash
git swn test dev
```

What's more, we are not working directly on the `dev` branch, because we may have multiple features to develop at the
same time, and we don't want to mix them together: They may have different development progress, so the slower one will
block other faster ones.

To solve this, we will create a new feature branch for each new feature based on the `main` branch:

> [!Caution]
>
> Do not create feature branches based on the `dev` branch, or you may integrate other features which are untested but
> already been integrated into `dev` branch into your branch accidentally.

```bash
git swn feature/your-feature-name main
```

Now, you can work on your feature branch, commit changes frequently, and push the branch to remote regularly.

Following the [standardized multi-person collaboration development process](https://github.com/wibetter/akfun/blob/master/%E5%A6%82%E4%BD%95%E8%A7%84%E8%8C%83%E5%A4%9A%E4%BA%BA%E5%8D%8F%E4%BD%9C%E5%BC%80%E5%8F%91.md),
can help you maintain your project better.

### Drop changes in working directory

When you work on your feature branch, you may want to discard some changes in your working directory. You can use the
following command to discard changes of specific files:

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

### Drop changes in staging area

When you work on your feature branch, you may want to unstage some changes in your staging area. You can use the
following command to do that:

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

### Drop last commit

When you work on your feature branch, you may want to undo some commits in your local branch. You can use the
following command to do that:

```bash
# Command `cmu`: Undo the last commit and keep the changes in staging area
git cmu
```

> [!Caution]
>
> If this commit has been pushed to remote, you need to force push the branch to remote after dropping the last commit:
>
> ```bash
> git psf
> ```
>
> This may cause problems for other collaborators, so please use it with caution.

### Amend the last commit

If you want to amend the last commit, more conveniently than drop the last commit and create a new one, you can amend it
directly:

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

Then Git will open your default editor (`vim` is the default) to let you edit the commit message, after you save and
close the editor, the last commit will be amended.

> [!Caution]
>
> If this commit has been pushed to remote, you need to force push the branch to remote after dropping the last commit:
>
> ```bash
> git psf
> ```
>
> This may cause problems for other collaborators, so please use it with caution.

### Revert a commit

If you already pushed some wrong commits to a branch which has branch protection enabled, you cannot force push to the
remote branch. In this case, you can revert the wrong commits by creating new commits that undo the changes made by the
wrong commits.

This is the only one choice in the case above, the cost is that the commit history will be more ugly, likes your
"evidence of guilt", which will spread through the ages.

```bash
# Command `rv`: Revert a specific commit by its ID or relative position to HEAD
# git rv <commit-id|relative-head>
git rv HEAD
```

### Merge branches

Come back to general workflow, after you finished your feature on your feature branch, you need to merge it back to the
`dev` branch.

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

And then, merge all changes from the `dev` branch into the `test` branch to perform test tasks:

```bash
git sw test
git mg dev
git ps
```

Your test tasks now can be performed on the `test` branch.

When your test team finds some bugs during testing, you can commit the bug fixes directly on the `test` branch, and then
merge the `test` branch back to the `dev` branch again to integrate the bug fixes:

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

After all test tasks are done and verified, you can create a new release by merging the `test` branch back to the `main` branch:

```bash
git sw main
git mg test
git ps
```

### Manage tags

After a new release, we should create a version tag to mark this point on the `main` branch.

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
# Command `pstg`: Push a specific tag to the remote repository
# git pstg [remote-name] <tag-name>
git pstg v1.0.0
```

Or if you want delete a tag both locally and on remote:

```bash
# Command `tgxbt`: Delete a specific tag both locally and on remote, if
# `remote-name` is not provided, it will be set to `origin` by default.
# git tgxbt [remote-name] <tag-name>
git tgxbt v1.0.0
```

### Rebase branches

When something changes been integrated into the `main` branch, and you also want to integrate these changes into your
feature branch, you can rebase your feature branch onto the latest `main` branch.

```bash
git sw feature/your-feature-name

# Command `rb`: Rebase the current branch onto a specific branch
# git rb <branch-name>
git rb main
```

> [!Caution]
>
> Do not rebase a branch which has been pushed to remote and shared with others.
>
> Rebase likes to pull out a branch from the tree and insert it into another place. For other collaborators working on
> this branch, they will lose their branch.
>
> This may cause problems for everyone, so please just use it on local branch and with caution.

### Delete branches

Now, you have some types of branches in your repository: `main`, `dev`, `test`, and multiple feature branches.

The `main`, `dev`, and `test` branches are long-lived branches, which will stay in the repository for a long time (I mean forever).

But the feature branches are not.

When you finished your feature and merged it back to the `dev` branch, you can delete your feature branch, because it's mission
is accomplished, bug fixes and additional improvements can be done on the `test` branch later, and will be merged back to
the `dev` branch again.

To delete a branch locally:

```bash
# Command `brx`: Delete a specific branch locally
# git brx <branch-name>
git brx feature/your-feature-name
```

And then delete it on remote:

```bash
# Command `brxre`: Delete a specific branch on remote, if `remote-name` is not
# provided, it will be set to `origin` by default.
# git brxre [remote-name] <branch-name>
git brxre feature/your-feature-name
```

Or you can delete it both locally and on remote in one command:

```bash
# Command `brxbt`: Delete a specific branch both locally and on remote, if
# `remote-name` is not provided, it will be set to `origin` by default.
# git brxbt [remote-name] <branch-name>
git brxbt feature/your-feature-name
```

### Cherry-pick commits

Sometimes, you may want to apply some specific commits from one branch to another branch without merging the entire
branch. In this case, you can use the cherry-pick command to apply the changes introduced by specific commits.

```bash
# Command `cp`: Cherry-pick a specific commit by its ID (or relative position to
# HEAD?)
# git cp <commit-id|relative-head?>
# This is a short commit ID example:
git cp 3b88e2d
```

### Recommended workflow

A recommended workflow for using Git in a collaborative environment is as follows:

```txt
main
 |      dev
 +------>+      test
 |       +------>+      feature/your-feature-name
 +---------------------->+
 |       |       |       |
 |       |       |      ...
 |       |       |       |
 |       +<--------------+
 |       |       |
 |      ...      |
 |       |       |
 |       +------>+
 |       |       |
 |       |      ...
 |       |       |
 |       +<------+
 +<--------------+ (tag: v1.0.0)
 |       |       |
...      |       |
 |       |       |              hotfix/your-hotfix-name
 +------------------------------>+
 |       |       |               |
 |       |       |              ...
 |       |       |               |
 +<------------------------------+ (tag: v1.0.1)
 |       |       |               |
...     ...     ...             ...
```

1. Use the `main` branch as the **stable production** branch.
2. Create a `dev` branch based on the `main` branch for **ongoing development**, and a `test` branch for **testing**.
3. For each **new feature**, create a new feature branch based on the `main` branch.
4. For each **hotfix**, create a new hotfix branch based on the `main` branch.
5. Work on the feature & hotfix branches, commit changes frequently, and push the branches to remote regularly.

   When the feature is complete, create a **pull request** to merge the feature branch into the `dev` branch, and then
   delete the feature branch both locally and on remote.

   When the hotfix is complete, create a **pull request** to merge the hotfix branch into the `main` branch, `dev` branch,
   and then delete the hotfix branch both locally and on remote.

6. After all features are merged into the `dev` branch, merge the `dev` branch into the `test` branch to perform test tasks.

   When bugs are found during testing, commit the bug fixes directly on the `test` branch, and then merge the `test`
   branch back to the `dev` branch again to integrate the bug fixes.

7. After all test tasks are done and verified, merge the `test` branch back to the `main` branch to create a **new release**.
8. Every time create a **new release**, add a tag with a version number.

   The version number should follow the [Semantic Versioning](https://semver.org/) specification:
   - **MAJOR** version when you make breaking changes
   - **MINOR** version when you add functionality in a backwards-compatible manner
   - **PATCH** version when you make backwards-compatible bug fixes
   - Additional **labels** for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH-LABEL`
     format. For example: `1.0.0-alpha.1`

### Git configuration

#### `.gitconfig`

To configure Git, you can create a `.gitconfig` file in your home directory (usually `~/.gitconfig` on Unix-like
systems) and add your configuration settings there. Here is an example of a basic `.gitconfig` file:

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

When you have some commits that make massive formatting changes to your codebase, it can be hard to use `git blame` to
track down the original author of a line of code.

To solve this problem, you can create a `.git-blame-ignore-revs` file in the root directory of your repository and add
the commit hashes of these formatting commits to this file. Then, when you run `git blame`, Git will ignore these
commits and show you the original author of each line of code.
