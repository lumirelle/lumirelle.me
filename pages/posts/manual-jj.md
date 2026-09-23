---
title: JJ Manual
date: 2025-09-26T11:47+08:00
update: 2026-09-23T18:15+08:00
lang: en
duration: 15min
type: manual
group: VCS
order: 2
---

[[toc]]

## What Is JJ?

Jujutsu (a.k.a. JJ) is yet another distributed version control system, like [Git](manual-git).

### Core Concepts

JJ shares the same underlying data model as [Git](manual-git): a DAG of commits, but it renames or replaces several Git concepts to get rid of some long-standing pain points. The concepts below are introduced from the JJ point of view, with their Git counterparts marked as **vs Git**.

- [**Repository (Repo):**](#repository) <i id="repository"></i>

  A repository contains all the information about your project.

  Conceptually, a repository is composed of two parts: JJ's configuration & metadata (in `.jj`), the **commit history** (in `.jj`).

  A repository can be stored locally (on your computer), remotely (on a server like GitHub), or both.

  > [!Note]
  > **vs Git:** JJ keeps its own metadata in a `.jj` directory instead of `.git`. With the (default) Git backend, a `.git` directory still exists which is colocated next to `.jj`. Through this, you can run Git commands directly in the same repository.

- [**Commit (Revision):**](#commit) <i id="commit"></i>

  A commit is a **full snapshot** of your project, together with its description, author, timestamps, and parent commits.

  Unlike Git, a commit is identified by **two** IDs:

  - **Commit ID**: the hash of the snapshot (SHA-1 so far), just like Git's commit hash. It changes whenever anything about the commit (content, description, parents...) changes.
  - **Change ID**: a stable, human-friendly identifier (e.g. `qpvuntsm`) that **survives rewrites**. Amending, rebasing, or squashing a commit produces a new commit ID, but keeps the same change ID.

  Two different commits can be based on the same parent commit, so the commit history is a **DAG (tree)**, the same as in Git.

  > [!Note]
  > **vs Git:** a Git commit is a diff against its parent(s), while a JJ commit is a full snapshot. More importantly, Git only has the commit hash, so "the same change, rewritten" is indistinguishable from a brand-new commit; the change ID makes it a first-class citizen in JJ.

- [**Pointer:**](#pointer) <i id="pointer"></i>

  A pointer is a reference to a specific commit, which can be used to identify that commit.

  Pointers can move to another commit.

  JJ has two main kinds of pointers: `@` is an **implicit pointer** that always marks where you are working, while a **bookmark** is an **explicit, named pointer** that you move yourself.

  **`@`** is special pointer: it **is** the working-copy commit itself. Moving it therefore never leaves the working copy behind: `jj new` / `jj edit` (and navigating with `jj next` / `jj prev`) first snapshot whatever is on disk and then materialize the new `@`, so they never refuse because of "uncommitted changes". There is no symbolic/detached distinction either: `@` is always an ordinary commit, and the working copy is simply its materialized state.

  > [!Note]
  > **vs Git:** Git's `HEAD` points *to* a commit (usually through the branch it names), so "where I am" and "what my files look like" are two states that a command has to keep in sync, which is why `git checkout` can refuse. JJ has no `HEAD`: the position **is** a commit, and there is nothing to detach from.

- [**Bookmark (Branch):**](#bookmark) <i id="bookmark"></i>

  A bookmark is JJ's equivalent of a Git branch. Older JJ versions called the bookmark "branch" as well, so some docs and commands may still use that word; note that JJ also calls a commit line a **branch** (see **Commit Line** below).

  Bookmarks are **not automatically advanced**: JJ has no concept of a "current bookmark". New commits are created on top of the current commit, and you decide when to move the bookmark with `jj bookmark move`, `jj bookmark advance`, etc.. Except some special cases: when a commit is rewritten (amended, rebased, squashed...), any bookmark pointing to it (or to one of its descendants) is moved automatically.

  Remote bookmarks are tracked per remote and displayed with a `@{{remote}}` suffix, e.g. `main@origin`. The `trunk()` revset function refers to the default remote's main bookmark (e.g. `main@origin`).

  ```txt
                         (main)
                         v
  o---o---o---o---o---o---o
                      \
                       o---o---o
                               ^
                               @ (working-copy commit)
  ```

  As the graph shows, the working-copy commit sits on an **anonymous commit line** (a chain of commits that no bookmark points to). Unlike Git, JJ does not garbage-collect them, because it tracks all visible heads of the commit graph.

  > [!Note]
  > **vs Git:** in Git, the **branch** is the first-class citizen, which means:
  >
  > 1.  You must create and name a branch before you start, even though you don't yet know how the work should be split;
  > 2.  Half-finished work has nowhere to live: it either stays in the working tree or a stash, or it is committed onto the branch;
  > 3.  Just looking at an older commit means creating another branch or entering the detached HEAD state, where work is easy to lose.
  >
  > JJ deliberately takes that status away from the bookmark and gives it to the commit: a commit that no bookmark points to is still a first-class, fully tracked commit. It lives on an **anonymous commit line**, keeps its change ID, and can be rebased, squashed or split at any time. A bookmark is only useful when you need to **name** a group of commits, to push and collaborate on it, or to keep a long-lived version commit line.

- [**Revset:**](#revset) <i id="revset"></i>

  A **revset** is an expression that selects revisions, and it can be used wherever a revision is expected as an argument.

  The most common symbols are `@` (working-copy commit), `@-` (its parent), `trunk()` (the default remote's main bookmark), `x::y` (from `x` to `y`), `x..y` (from `x` to `y`, excluding `x`), and functions like `bookmarks()`, `description("...")`, `author(...)`, `mutable()`...

  ```bash
  jj log --revisions 'author(alice) & mutable()'
  ```

  > [!Note]
  > **vs Git:** revsets are much more expressive than Git's revision syntax (`HEAD~2`, `main..feat`), and can be freely composed with set operators (`|`, `&`, `~`) and functions.

- [**Commit Line (Branch):**](#commit-line) <i id="commit-line"></i>

  A commit line is a set of commits in the commit graph. Its official JJ name is **branch**, in the **graph theory** sense; older JJ versions also called bookmarks "branch", so the word appears in both senses, and commands like `jj rebase --branch` still use this one.

  Concretely, relative to a base revision `y`, the commit line of a revision `x` is the revset `(y..x)::`: the commits from `y` to `x` (excluding `y`), **plus all of their descendants**, so it is not always a single chain.

  ```txt
                                (feat/feature-name)
                                v
                        o---o---o---o
                       /            ^
  o---o---o---o---o                 @ (working-copy commit)
                  ^    \
               (main)   o---o
  ```

  As the graph shows, the commit line of `@` relative to `(main)` is everything after `(main)`: both the line `@` sits on and the forked line, because all of them are descendants of the commits between `(main)` and `@`. That is why `jj rebase --branch @ --destination main` moves all of them.

  > [!Note]
  > **vs Git:** a Git branch is a **named pointer**, and it decides what `git rebase` rewrites; a JJ commit line is **computed** from the graph (a base plus a revision), so no bookmark is required, and the same commit can belong to many commit lines.

- [**Working-Copy Commit:**](#working-copy-commit) <i id="working-copy-commit"></i>

  The working copy is **a real commit**, called the working-copy commit (`@`). Everything you see in your editor is just the materialized state of that commit.

  JJ automatically **snapshots** the working copy at the beginning of every command, and **amends** `@` with the changes, so there is no "dirty working directory" state: your changes are always in a commit (even if it has an empty description), and they will never be lost between commands.

  To start a new change on top of `@`, use `jj new`; to describe the current change and start a new one on top of it, use `jj commit`; to switch the working copy to another commit, use `jj edit` (likes `git checkout`), except that the previous `@` is simply kept as a normal commit.

  > [!Note]
  > **vs Git:** a Git working directory is a separate, unversioned area on top of `HEAD`, and the files you edit are "modified" until you commit them. In JJ the working copy *is* the commit `@`, so being "modified" only means "snapshotted into `@`".

- [**No Staging Area:**](#no-staging-area) <i id="no-staging-area"></i>

  JJ has **no staging area**: because the working copy is automatically committed, an index-like concept doesn't make sense.

  Instead of `git add -p; git commit`, use `jj split` to split the working-copy commit into two commits; instead of `git add -p; git commit --amend`, use `jj squash -i` to move part of the changes into the parent commit; and use `jj restore` to discard changes.

  > [!Note]
  > **vs Git:** Git exposes its index to users, which makes commands like `git reset` confusing (especially when combined with commits and/or files). JJ keeps a similar cache internally, but never exposes it.

- [**Conflict:**](#conflict) <i id="conflict"></i>

  Conflicts are **recorded inside commits** instead of blocking the operation that produced them: no JJ command fails because of a conflict. Conflict markers are written to the affected files in the working copy, and you can resolve them later with `jj resolve`, or even rebase the conflicted commit first.

  > [!Note]
  > **vs Git:** in Git, an unresolved conflict lives in the index / working directory and typically blocks `merge`, `rebase`, and `cherry-pick` until you resolve it. Since JJ stores conflicts in the commit itself, it addresses most `git rerere` use cases.

- [**Immutable Commit:**](#immutable-commit) <i id="immutable-commit"></i>

  The **trunk** is JJ's name for the remote's main commit line: the `trunk()` revset, which by default resolves to the newest of `main` / `master` / `trunk` on the `origin` / `upstream` remote. It is a config alias, so a project with a different remote or default branch can point it elsewhere.

  If no such remote bookmark exists, it falls back to the virtual root commit (so-called initial commit).

  Commits that are reachable from the trunk, tags, or untracked remote bookmarks and tags are **immutable** (see the `immutable_heads()` revset): JJ refuses to rewrite them, so you can't rewrite a shared commit by accident. Everything else is **mutable** and free to be rewritten. You can override this on purpose with `--ignore-immutable`.

  > [!Note]
  > **vs Git:** Git has no such protection, rewriting a published commit is always one `--force` away, and only your own discipline stands between you and your collaborators' tears 🫠.

- [**Operation Log:**](#operation-log) <i id="operation-log"></i>

  Every command that changes the repository is recorded as an **operation** in the operation log, which tracks atomic updates to all refs at once. This is what powers undo / redo: `jj op log`, `jj undo`, `jj redo`, and `jj op restore {{opId}}` (to go back to any previous state directly).

  > [!Note]
  > **vs Git:** Git's reflog is per-ref and only a safety net with a limited retention window; JJ's operation log is a first-class, repo-wide history of every state change.

#### Git to JJ Concept Mapping

| Git | JJ |
| --- | --- |
| `.git` metadata | `.jj` metadata (with a Git backend underneath) |
| Commit (diff + hash) | Commit (snapshot; change ID + commit ID) |
| `HEAD` / detached `HEAD` | `@` (working-copy commit) |
| Branch | Bookmark |
| — | Commit line (graph-theoretic branch) |
| Working directory (dirty or clean) | Working-copy commit (always committed) |
| Staging area (index) | — (use `jj split` / `jj squash`) |
| Pathspec | Fileset |
| Remote-tracking branch | Remote bookmark (`main@origin`) |
| Tag | Tag (`jj tag`) |
| Reflog | Operation log (`jj op log`) |
| Conflict in the index / working tree | Conflict stored in the commit |
| — | Immutable commit |
| — | Revset |

## Basic Usage of JJ

> [!Note]
>
> This article is based on my own `config.toml` for JJ.
>
> For more details about the changed default behavior, please see [the source file](https://github.com/lumirelle/dotfiles/blob/main/dot_config/jj/config.toml).

### Initialize JJ Repository

There are two ways to start a JJ repository: **create a new one** from your local files (`jj git init`), or **clone an existing one** from a remote repository (`jj git clone`).

#### Create a New Repository

To initialize a fresh JJ repository, open your project in the terminal and run:

```bash
jj git init
```

Then, JJ will create a hidden `.jj` directory, which contains all the JJ metadata for your project.

Since JJ uses Git as its storage backend by default, a `.git` directory is created alongside it too, which makes the repository a **colocated** Jujutsu / Git repository:

```txt
my-project/
├── .git/  # the Git repo (colocated, still visible to Git tools)
└── .jj/   # JJ's own metadata
```

In a colocated repository, both `jj` and `git` commands operate on the same repo, so Git-based tooling (IDE integrations, CI scripts, build tools...) keeps working as usual.

> [!Caution]
> Mixing `jj` and `git` commands in a colocated repository is allowed, but interleaving mutating `git` commands with `jj` commands is not recommended: `jj` has no "current bookmark", so it usually leaves the Git repo in a "detached HEAD" state, and the two tools may end up disagreeing about where a branch points.
>
> So: prefer read-only `git` commands, and let `jj` make the changes.
>
> If a mutating `git` command did something unexpected, `jj undo` can revert it — because JJ records the Git import as an operation too.

At that point, unlike in Git, the repository is already **not empty**: it contains the **working-copy commit `@`** — an empty commit created on top of the **virtual root commit**. JJ has no "unborn branch" state, so you never need to make an initial commit before doing anything else.

> [!Note]
> **vs Git:** right after `git init`, there are no commits at all, `HEAD` points to an unborn branch, and `git log` has nothing to show. In JJ, `@` is a real commit from the very beginning; if you initialized in an empty directory, it is simply an empty commit (no description, no changes).

If the directory already contains files, they will be **snapshotted** into `@` as soon as a JJ command runs, so they are already tracked — no `git add` needed.

#### Clone an Existing Repository

To start from an existing remote repository instead, use `jj git clone`, the counterpart of `git clone`:

```bash
jj git clone {{repoUrl}} {{destination}}
```

The remote is named `origin` unless you pass `--remote <name>`.

The clone is a **colocated** repository too, with `--no-colocate` to opt out. The new working-copy commit `@` is created on top of the remote's default bookmark (or the one given by `--branch <name>`), and that bookmark is tracked automatically, so you can start working right away.

> [!Note]
> **vs Git:** `git clone` checks out the default branch and leaves you on it, so your next commit moves `main` branch. `jj git clone` instead gives you a remote bookmark `main@origin` and puts your empty working-copy commit `@` on top of it, you should move `main@origin` by yourself (for example, `jj bookmark advance`).

### Make Changes and Commit

After initializing, you can start making changes and then commit them.

In JJ, changes don't need to be staged first: the working copy is snapshotted into the working-copy commit `@` automatically before any command, so just make your changes:

```bash
# Make some changes to the working copy...
echo "Hello, JJ!" > index.js
```

After that, you can make the initial commit:

```bash
jj commit --message "feat: initial commit"
```

`jj commit` sets the **description** (JJ's word for the commit message) of the current change, and then creates a new, empty change on top of it. After that, `@` moves to the new change and you can keep working right away.

Every time you want to record some changes, you can make a commit like this. Run `jj log` if you want to see the commit you just created, with the new empty `@` on top of it.

Making a commit records the changes you made since the previous commit (or the initial state), and also creates a new commit node in the commit history tree based on the previous node. Everything is similar to Git, except that your changes will be recorded in `@` before you "committed" them.

> [!Note]
> **vs Git:** `git commit` records the staged snapshot, so forgetting to `git add` is a classic mistake, but this is not the case in JJ.

If you only want to describe the change you are working on without starting a new one, use `jj describe` instead; `jj new` is the opposite: it starts a new change and leaves the previous one disdescribed.

This is the most basic version control use case.

### Sync with Remote Repository

As a distributed version control system, JJ (like Git) allows you to collaborate with others by syncing your local repository with a remote repository. You can use services like GitHub, GitLab, or Bitbucket to host your remote repositories.

#### For Newly Created Repositories

If you created your repository with `jj git init` instead of cloning it, it has no remote yet. Before you can fetch and rebase, or push, you need to add one, so that JJ knows where the remote repository is located, and how to sync with it.

To add a remote, use the following command:

```bash
jj git remote add origin https://github.com/username/repo.git
```

You can inspect the configured remotes with `jj git remote list`, and manage them with `jj git remote rename` / `set-url` / `remove`.

> [!Note]
> **vs Git:** `jj git remote add` is the direct counterpart of `git remote add`. JJ even invokes the `git` binary under the hood for remote operations. The difference is what the remote's branches become locally: Git stores remote-tracking branches named `origin/main`, while JJ stores **remote bookmarks** named `main@origin`.

#### Sync Changes with Remote

As you may already know, JJ uses **bookmarks** to represent Git branches.

Unlike `git fetch`, `jj git fetch` does not only update the locally remembered position of the remote bookmark (`{{bookmark}}@{{remote}}`): if the remote bookmark is tracked (through `jj bookmark track {{bookmark}} --remote {{remote}}`), it also moves your local bookmark with it (which means your local bookmark like `{{bookmark}}` move with `{{bookmark}}@{{remote}}`). After that, you can **integrate changes** from or to that remote bookmark — `jj rebase --destination {{bookmark}}@{{remote}}` to bring commits from it, and `jj bookmark advance && jj git push` to send commits to it.

The biggest difference between JJ and Git is that JJ has **no current bookmark** and no `pull` command: `jj git fetch` may move a tracked bookmark, but it never integrates (merges or rebases for Git) your work onto it. In Git, `pull` does that for the current branch and updates the working directory for you; in JJ the rewrite is always a separate step that you run yourself.

A newly created bookmark is not tracked yet, tracking a remote bookmark is the counterpart of Git's **upstream** association. You should establish the link once, either by pushing the bookmark with `--bookmark`, which is JJ's counterpart of `git push --set-upstream`:

```bash
jj git push --bookmark feat/feature-name
```

Or by linking the bookmark to an existing remote bookmark, which is the counterpart of `git branch --set-upstream-to`:

```bash
jj bookmark track main --remote origin
```

Once the track relation is set, both commands are simple. You can verify the relation with:

```bash
jj bookmark list --all
# main: qpvuntsm 4f2a1b3c feat: add index.js
#   @origin: qpvuntsm 4f2a1b3c feat: add index.js   <- tracked
```

To integrate the latest commits from that remote bookmark, you can use the following commands:

```bash
# Integrate commits from origin/main to main
jj git fetch
jj rebase --destination main@origin
```

> [!Caution]
> `jj git fetch` also drops what the remote has dropped: commits that are no longer reachable from any bookmark on the remote are **abandoned locally** as well. So if someone force-pushes a bookmark, the commits that were dropped are abandoned in your repo too.
>
> Also, they will disappear from `jj log`, though `jj undo` reverts the fetch and brings them back.
>
> This can be turned off with `git.abandon-unreachable-commits = false`.

`main@origin` is exactly what the `trunk()` revset resolves to, so `jj rebase --destination trunk()` works the same way without hard-coding the remote and bookmark names. And since everything reachable from the trunk is **immutable**, this update will never move something you have already published.

> [!Note]
> **vs Git:** `git pull` fetches and integrates in a single step (merging or rebasing, depending on your configuration), because it knows which branch you are on and which remote branch it tracks. JJ has no current bookmark, so nothing would tell a bare `pull` what to update; and because the integration step is a rewrite rather than a merge, JJ deliberately keeps the two steps apart.

To integrate your latest commits to that remote bookmark:

```bash
jj git push
```

JJ never pushes the working-copy commit `@` itself; it pushes **bookmarks**. By default, `jj git push` pushes all your tracked bookmarks (and tags) that have new commits compared to the last fetch:

```bash
# Push only a specific bookmark...
jj git push --bookmark feat/feature-name

# ...or push a commit that has no bookmark yet, by creating one on the fly.
jj git push --change @
```

> [!Note]
> **vs Git:** Git pushes whatever the current branch / `HEAD` points to, so the target is implicit. JJ has no current bookmark, so the target is always a bookmark: all tracked bookmarks with unpushed commits by default, or exactly what you select with `--bookmark` / `--change`. And because the remote position must match the last fetch, `jj git push` behaves like `git push --force-with-lease`, if the bookmark has moved on the remote since your last fetch, JJ refuses to push and asks you to fetch and resolve the conflict first.

### Work with Bookmarks

Bookmarks are one of the most important concepts in collaborative development.

With commit lines, you can create a temporary fork with a specific state, and work on it independently. Through this, you can do anything you want without affecting the existing codebase.

> [!Note]
> **vs Git:** there is nothing to `checkout` in JJ. To start working on a feature, you simply create commits on top of a revision and name that commit line with a bookmark when you want to share it or find it again:
>
> ```bash
> jj new main
>
> # Working on this...
>
> jj bookmark create feat/feature-name
> ```
>
> Until you name it, it stays an **anonymous commit line** — a perfectly normal state in JJ (see **Core Concepts** above).

After the tasks are done on those commit lines, you can apply them back by **pull request**.

> [!Note]
> I highly recommend you always use a **pull request** instead of integrating locally to apply the review and approval process.
>
> Creating a merge commit should only be used in cases of:
>
> 1.  Merge multiple feature commit lines into one big feature commit line, due to changed requirements or other reasons;
> 2.  Merge upstream changes (for example, changes on the `main` commit line) into a feature commit line. (In this case, `jj rebase` is a better choice than a merge commit.)

> [!Note]
> **vs Git:** Git uses `merge` command to create a merge commit, while JJ uses `new` command with multiple parent, for example: `jj new feat/a feat/b`.

#### Bookmark (and Commit Line) Management Workflow

To keep things controlled and organized, there are several common bookmark management workflows:

- [**Main Bookmark Workflow:**](#main-bookmark-workflow) <i id="main-bookmark-workflow"></i>

  <TextTag>Personal</TextTag><TextTag preset="red">Not recommended</TextTag>

  Everything is committed to the main commit line directly.

  Versions are marked by tags on the main commit line, each release means one or more commits on the main commit line.

  > [!Note]
  > **vs Git:** this is what Git calls the *main branch workflow*: there, committing advances the current branch automatically. A bookmark never moves by itself in JJ, so each change has to be recorded explicitly: you should execute `jj bookmark advance` manually before starting the next one.

- [**Feature Bookmark Workflow:**](#feature-bookmark-workflow) <i id="feature-bookmark-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Single version</TextTag>

  The main commit line only advances on **pull/merge requests** and does not accept any direct commit.

  Commits are performed on feature commit lines or hotfix commit lines, which are always start from the main commit line and applied back to the main commit line via pull/merge requests once development is complete.

  Of course, do not forget to use `jj bookmark advance` to update the `main` bookmark.

  Versions are marked by tags on the main commit line, each release means one or more pull/merge requests on the main commit line.

  > [!Note]
  > **vs Git:** the `feat/xxx` / `hotfix/xxx` bookmark does not have to be created up front. You can build the change (or a stack of changes) first, and only name it when you push it for review.

- [**Multiple Versions Workflow:**](#multiple-versions-workflow) <i id="multiple-versions-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple versions</TextTag>

  Based on the [feature bookmark workflow](#feature-bookmark-workflow), with multiple long-term commit lines for different major versions.

  - Main commit line is for **the next major version**
  - Released version commit lines are for the released major versions, e.g. `v1.x`, `v2.x`, etc.
  - Feature commit lines are for new features, start from the main commit line, and will also be applied back to the main commit line by pull/merge requests once the development is done.

    If this feature needs to be **backported** to any released major version, you should use `jj duplicate` to copy the feature commits onto the appropriate `v{{version}}` commit line. See [examples](https://github.com/nuxt/nuxt) here.
  - Hotfix commit lines are for hotfixes, start from the first included released version commit line, and will be applied back to the appropriate `v{{version}}` commit line by pull/merge requests after the development is done.

    If this hotfix needs to be **forwardported** to any other released version or next major version, you should use `jj duplicate` to copy the feature commits onto the appropriate `v{{version}}` or main commit line. See [examples](https://github.com/nuxt/nuxt) here.

  A simple comparison with feature bookmark workflow:

  ```txt
  Feature Bookmark Workflow:
  o- ... -o- ... ... ... ... ... -o- ... ... ... ... ... -> (main)
          (tag v1.0.0)            (tag v2.0.0)

  Multiple Versions Workflow:
  o- ... -o- ... ... ... ... ... -o- ... ... ... ... ... -> (main)
          |                       |
          o- ... -> (v1.x)        o- ... -> (v2.x)
  ```

- [**Multiple Environment Workflow:**](#multiple-environment-workflow) <i id="multiple-environment-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple environments</TextTag>

  Based on the [feature bookmark workflow](#feature-bookmark-workflow), with multiple long-term commit lines for different environments.

  - main commit line is for **production environment**
  - `uat` commit line is for **UAT environment**
  - `test` commit line is for **testing environment**
  - `dev` commit line is for **development environment**
  - Feature commit lines are for new features, start from the main commit line, and applied back to the `dev`, `test`, `uat`, and main commit lines by pull/merge requests, based on the feature's development process.
  - Hotfix commit lines are for hotfixes, start from the main commit line, and applied back to the `dev`, `test`, `uat`, and main commit lines by pull/merge requests, based on the hotfix's development process.

  > [!Note]
  > **Why not promote strictly (`test` → `uat` → `main`)?**
  >
  > A promotion is a *wholesale* merge (`jj new uat test`, then `jj bookmark advance uat`): everything sitting on the previous environment's commit line comes along. Environment commit lines are writable in practice and collect things that must not be released (a debug commit on `test`, a config tweak on `uat`) and a strict chain would carry them upward without anyone deciding to.
  >
  >Applying every change to every environment flips the failure mode: **missing an application is explicit and cheap to find** (compare the applied sets, or just open a pull request), whereas something riding along unnoticed is implicit and hard to trace, especially when the promotion happened as a local merge.
  >
  > It is the same kind of decision as backport/forwardport across version commit lines: moving changes between long-lived commit lines is always a per-change, human one. The price is that you should care about which artifact/commit each environment actually runs.

You can choose one of the workflows above based on your project's size, type, complexity or your preference.

> [!Note]
>
> This article will use the most complex [**multiple versions workflow**](#multiple-versions-workflow) as an example.

### Create a New Bookmark

#### Feature Bookmark

> [!Note]
> Basically, we only start new feature development on the next major version commit line, which is the `main` commit line in this case. If other versions need this feature, we can backport it.
>
> That is to say, we will never develop a new feature for a specific released version but not for the next major version.

To add a new feature, you should start a new commit line from the `main` commit line first:

```bash
jj new main
```

Then, you can work on that commit line, commit changes frequently:

```bash
echo "Hello, JJ!" > index.js
jj commit --message "feat: add index.js"

echo "Hello, JJ!" > second.js
jj commit --message "feat: add second.js"
```

And mark the commit line with a bookmark when you are ready to push it. `@-` is the tip of the commit line, because the working-copy commit `@` itself is always empty.

```bash
jj bookmark create feat/feature-name --revision @-
jj git push --bookmark feat/feature-name
```

> [!Note]
> **vs Git:** `git switch --create feat/feature-name main` creates the branch *and* moves you onto it; in JJ those are two separate things. `jj new main` starts a new commit line on top of `main`, and the bookmark is just a name you attach when you need one.

#### Hotfix Bookmark

To add a hotfix, you should start a new commit line from the first included released commit line. For example, if the bug appears in the `v1.x` commit line:

```bash
jj new v1.x
```

Then, you can work on that commit line, commit changes frequently:

```bash
echo "Fix the bug!" >> index.js
jj commit --message "hotfix: fix the bug"
```

And mark the commit line with a bookmark when you are ready to push it:

```bash
jj bookmark create hotfix/bug-name --revision @-
jj git push --bookmark hotfix/bug-name
```

### Discard Changes

When you work on your commits, you may want to discard the changes (in the working copy).

All of the commands below take a **fileset**, JJ’s counterpart of Git’s pathspec: can be a file, a directory, or a wildcard pattern. E.g. index.ts, bin/, or src/**/*.ts.

In JJ the working copy is just the working-copy commit `@`, so "discarding a change" means restoring paths in `@` to the parent `@-`.

You can use the following command to restore specific tracked paths:

```bash
jj restore index.html index.css
```

To restore all paths (still keeping description and other metadata of working copy commit `@`):

```bash
jj restore
```

To restore paths from a specific revision instead of the parent `@-`, pass `--from`:

```bash
jj restore --from v1.x index.html
```

Notice that every path in the working copy that is not ignored is actually tracked by JJ and is part of `@`, so there is no separate step for so-called untracked files (Git concept):

```bash
# Equivalent to `git clean --force -d bin/ index.ts`
jj restore bin/ index.ts
```

Paths you never want JJ to track belong in `.gitignore`. For a path that is already tracked, add it to `.gitignore` first and then untrack it without deleting it from disk:

```bash
jj file untrack index.ts
```

> [!Note]
> **vs Git:** discarding content is one command in JJ (`jj restore`) but two in Git (`git restore` for tracked paths and `git clean` for untracked ones), because everything is tracked in JJ. Anything `jj restore` discards is **undoable**: `jj undo` brings it back, which `git restore` / `git clean` cannot.

### No Need to Unstage Changes

There is nothing to unstage in JJ: with no staging area, every change is already part of the working-copy commit `@`.

### Undo Last (None-working-copy) Commit

Committing is just an operation in JJ, when you commit some changes by accident (Not in working-copy commit), you can undo it with:

```bash
jj undo
```

If other commands ran after the commit, use `jj op log` and `jj op restore {{opId}}` to restore that specific operation:

```bash
jj op log
# @  88c07ed5f6ab ... default@
# │  new empty commit
# │  args: jj commit
# ○  a7208c449130 ...
# │  add workspace 'default'
# ○  000000000000 root()
jj op restore 88c07ed5f6ab
```

> [!Caution]
> If this commit has been pushed to the remote, `jj undo` only rewrites *your* history, and the remote still has the old commit. So putting the undo on the remote means a rewrite pusing:
>
> ```bash
> jj git push
> ```
>
> `jj git push` is already the safe form, it behaves like `git push --force-with-lease`, refuses when the remote has moved since your last fetch, so you cannot silently overwrite a collaborator’s work.
>
> This may cause problems for other collaborators, please use it with caution 🙏.

> [!Note]
> **vs Git:** `git reset HEAD^` has to re-sync the index and working tree, while `jj undo` simply rolls back the operation.


### Amend Last (None-working-copy) Commit

If you want to amend the last (none-working-copy) commit, which is more convenient than dropping the last commit and creating a new one, you can do:

```bash
# Move all the changes of working-copy commit `@` into the last none-working-copy commit `@-`:
jj squash

# Or only some of changes:
jj squash -i
```

After that, `@` is empty again, sitting on top of the amended commit, so you can keep working as usual.

> [!Note]
> If `@` has a description too, `jj squash` opens your editor to combine both descriptions; pass `--use-destination-message` to keep the last commit's description and discard the other one.

If you want to amend the description (JJ's word for the commit message) of the last commit, use `jj describe` with `--revision @-`:

```bash
jj describe --revision @- --message "fix: some bugs"

# Or to edit it in your editor:
jj describe --revision @-
```

> [!Caution]
> If this commit has been pushed to the remote, you need to rewrite push to the remote after amending it:
>
> ```bash
> jj git push
> ```
>
> This may cause problems for other collaborators, please use it with caution 🙏.

### Revert Commit

Undoing or amending the last (none-working-copy) commit is unsafe; this may break other collaborators' work if you and they are working on the same commit line.

For a safer choice, you can use `jj revert` to create a new commit that undoes the changes made by a specific commit.

The cost is that the commit history will be uglier, like your "evidence of guilt", which will spread through the ages. 🫠

```bash
# Revert the changes of the last none-working-copy commit `@-`, inserting the revert commit after it:
jj revert --revision @- --insert-after @-
```

> [!Note]
> **vs Git:** `git revert` appends the revert commit to the tip of the current branch; JJ has no current bookmark, so the location is explicit: `--insert-after @-` inserts the revert commit directly after the reverted commit (what `git revert` does), while `--onto @` puts it on top of the working-copy commit `@`.

### Integrate Changes

#### Pull Request

I highly recommend you always use a **pull request** to perform the code review and approval process before integrating changes from one commit line to another commit line.

All the operations are simple:

1. Open a pull request on the remote hosting service (like GitHub, GitLab, Bitbucket, etc.), from your commit line to the target commit line
2. Perform code review and approval process
3. Then, accept the pull request

#### Rebase Commit Line

When you want to integrate some changes from the upstream commit line into your current commit line (the commit line `@` belongs to), instead of `merge` with a ugly history tree, you can rebase your current commit line onto it.

```bash
# The current commit line is the one `@` belongs to
jj rebase --destination {{bookmark}}

# A rebase rewrites history!!!
jj git push
```

> [!Note]
> **vs Git:** there is no `git switch` step: JJ has no current bookmark, so the source defaults to the current commit line (the commit line of `@`), and any bookmark pointing at the rebased commits follows them automatically.

> [!Caution]
> Do not rebase a commit line that is **shared with others**.
>
> This may cause problems for other collaborators, so please use it with caution 🙏.

#### Merge Commit (Not Recommended)

```bash
# Create a merge commit with the target commit line `main` and your commit line
# `feat/feature-name` as parents, then move the target bookmark to it:
jj new {{yourBookmark}} {{targetBookmark}}
jj describe --message "Merge {{yourBookmark}} into {{targetBookmark}}"
jj bookmark advance {{targetBookmark}}

# Don't forget to push the target bookmark to remote!
jj git push --bookmark {{targetBookmark}}
```

> [!Note]
> JJ refuses to push a commit without a description, so the merge commit has to be described before pushing.

#### Integrate Changes Example

> [!Note]
> This example uses a merge commit to show the flow of integrating changes, but I still recommend you use a **pull request** instead.

Feature commit line development flow:

```bash
# Start a new commit line from main
jj new main

# ...Make some changes

# Integrate changes
jj new main feat/feature-name
jj describe --message "Merge feat/feature-name into main"
jj bookmark advance main
```

Hotfix commit line development flow:

```bash
# Start a new commit line from the first included released commit line
jj new v1.x

# ...Make some changes

# Integrate changes
jj new v1.x hotfix/bug-name
jj describe --message "Merge hotfix/bug-name into v1.x"
jj bookmark advance v1.x
```

### Manage Tags & Create Released Major Version Commit Line

When you want to release a new version, after completing the necessary changes (changelogs, bumping the version...), you should create a version tag to mark this point on the main commit line, and push it to the remote.

```bash
# Complete the necessary changes...
echo "- v1.0.0: ..." >> CHANGELOG.md
bumpversion 1.0.0
jj commit --message "chore: release v1.0.0"

# The release commit is the last none-working-copy commit `@-`:
jj tag set v1.0.0 --revision @-
```

Then push the tag to remote:

```bash
jj git push --tag 'v*'
```

Or if you want to delete a tag:

```bash
jj tag delete v1.0.0

# Deleting a tag locally does not delete it on the remote:
jj git push --deleted
```

After that, you should create a new bookmark for this released major version:

```bash
# Instead of going through `main`, point the bookmark at the tag:
jj bookmark create v1.x --revision v1.0.0

# Don't forget to push the bookmark to remote!
jj git push --bookmark v1.x
```

When the released major version commit line already exists (for example, releasing `v1.1.0` on the `v1.x` commit line), you can create the tag from that bookmark directly:

```bash
# A bookmark never advances by itself, so move it to the release commit first:
jj bookmark advance v1.x --to @-

jj tag set v1.1.0 --revision v1.x

# Don't forget to push the tag and the bookmark to remote!
jj git push --tag 'v*'
jj git push --bookmark v1.x
```

> [!Note]
> **vs Git:** `jj tag` only creates lightweight tags, so `git tag --annotate --message ...` has no counterpart. And unlike `git push --tags`, a bare `jj git push` **refuses to create a new remote tag** (`Refusing to create new remote tag v1.0.0@origin`), so a tag has to be named with `--tag`, or tracked first with `jj tag track v1.0.0@origin`.

### Delete Bookmark

Once you have integrated the changes from a feature / hotfix commit line into the target commit line, you can delete its bookmark if it is no longer needed.

This helps to keep your bookmark list clean and organized.

```bash
jj bookmark delete feat/feature-name
jj git push --deleted

jj bookmark delete hotfix/bug-name
jj git push --deleted
```

> [!Note]
> **vs Git:** `git branch --delete` refuses to delete a branch that is not merged (unless you force it); `jj bookmark delete` always succeeds, because it only deletes the name — the commits stay first-class, and a line without a bookmark is just an **anonymous commit line**. If the bookmark should keep existing on the remote, use `jj bookmark forget` instead.

### Backport Feature (Duplicate)

Sometimes, you may want to apply some specific commits from one commit line to another commit line without merging/rebasing the entire commit line. In this case, you can use `jj duplicate`.

The most common use case is to backport a feature to the released major version commit line. For example, you want to backport the feature on the `main` commit line, which is introduced by the commits of `feat/xxx`, the only things you need to do are:

1.  Select the feature commits to copy, for example, everything in `feat/xxx` but not in `main` (a revset does it, so there is no commit hash to look up);
2.  Duplicate them onto the released major version commit line `v1.x`:

```bash
# Start a new commit on top of the `v1.x` commit line:
jj new v1.x

# Insert copies of the feature commits before it, so they land on the `v1.x` tip:
jj duplicate -r 'main..feat/xxx' --insert-before @

# Move the `v1.x` bookmark to the last duplicated commit (the new `@-`):
jj bookmark advance v1.x --to @-

jj git push --bookmark v1.x
```

> [!Note]
> By default a duplicated commit only keeps the description and gets a new change ID, so nothing records where it came from. Set the marker once in `config.toml`:
>
> ```toml
> [templates]
> duplicate_description = 'description ++ "\n\n(duplicated from commit " ++ commit_id.short() ++ ")"'
> ```
>
> The copies then carry `(duplicated from commit {{commit id}})`, just like `git cherry-pick -x`.

> [!Note]
> **vs Git:** `git cherry-pick` copies the **changes** of one commit (for a merge commit, with `--mainline`) onto the tip of the current branch; `jj duplicate` copies the **commits** themselves from any revset to any destination, so a whole feature line is backported in one command, and the copies are ordinary new commits with new change IDs.

### Forwardport Bugfix (Duplicate)

When you want to apply a bugfix from a released major version commit line to the later versions, you can duplicate it, just like a backport. For example, you want to forwardport the hotfix on the `v1.x` commit line, which is introduced by the commits of `hotfix/bug-name`, to the `v2.x` and `main` commit lines:

```bash
# Everything in `hotfix/bug-name` but not in `v1.x` is the hotfix,
# so `v1.x..hotfix/bug-name` selects it:

# The `v2.x` commit line:
jj new v2.x
jj duplicate -r 'v1.x..hotfix/bug-name' --insert-before @
jj bookmark advance v2.x --to @-
jj git push --bookmark v2.x

# Then the `main` commit line:
jj new main
jj duplicate -r 'v1.x..hotfix/bug-name' --insert-before @
jj bookmark advance main --to @-
jj git push --bookmark main
```

> [!Note]
> The duplicated commits keep only the description, so the hotfix is also a good candidate for the `templates.duplicate_description` marker shown in [Backport Feature (Duplicate)](#backport-feature-duplicate), which records where each copy came from.

### JJ Configuration

#### `config.toml`

To configure JJ's behavior, you can create a `config.toml` file in your system **user config directory** (`~/.config/jj/config.toml`, or ask JJ with `jj config path --user`) and add your configuration settings there. Here is an example of a basic `config.toml` file:

```toml
[user]
name = "Your Name"
email = "your.email@example.com"

[ui]
editor = "nvim"
```

To get a full configuration example, please refer to my [`config.toml`](https://github.com/lumirelle/dotfiles/blob/main/dot_config/jj/config.toml) file.

> [!Note]
> **vs Git:** a Git setup is one `.gitconfig` plus a per-repository `.git/config`; JJ layers configs in a fixed order: user, then repo, then workspace (the last two also live under your user config directory, see `jj config path --repo` / `--workspace`), and writes to any layer with `jj config set --user` / `--repo` / `--workspace`, so project-specific settings do not have to live in your dotfiles.

#### `.gitignore`

This file is used to ignore certain paths in your JJ repository: every line is a pattern that selects paths (files, directories, or wildcards). E.g. `*.log`, `build/`, or `!src/keep.log` to un-ignore a single one.

I prefer to use the templates from [github/gitignore](https://github.com/github/gitignore). There are some extensions for different editors to generate a `.gitignore` file based on those templates with ease:

- Neovim: [`gitignore.nvim`](https://github.com/wintermute-cell/gitignore.nvim)
- VSCode: [`codezombiech.gitignore`](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore).

#### `.git-blame-ignore-revs`

`jj file annotate` shows the source commit of each line, but it has no ignore list yet, so one massive formatting commit still hides the original authors of the whole file. The Git side of the same repository keeps working for this: in a colocated repository, use `git blame` with a `.git-blame-ignore-revs` file, configured as described in the [Git manual](manual-git#git-blame-ignore-revs).
