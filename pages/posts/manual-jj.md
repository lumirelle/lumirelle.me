---
title: JJ Manual
date: 2025-09-26T11:47+08:00
update: 2026-09-22T18:04+08:00
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

- **Repository (Repo)**:

  A repository contains all the information about your project.

  Conceptually, a repository is composed of two parts: JJ's configuration & metadata (in `.jj`), the **commit history** (in `.jj`).

  A repository can be stored locally (on your computer), remotely (on a server like GitHub), or both.

  > [!Note]
  > **vs Git:** JJ keeps its own metadata in a `.jj` directory instead of `.git`. With the (default) Git backend, a `.git` directory still exists which is colocated next to `.jj`. Through this, you can run Git commands directly in the same repository.

- **Commit (Revision)**:

  A commit is a **full snapshot** of your project, together with its description, author, timestamps, and parent commits.

  Unlike Git, a commit is identified by **two** IDs:

  - **Commit ID**: the hash of the snapshot (SHA-1 so far), just like Git's commit hash. It changes whenever anything about the commit (content, description, parents...) changes.
  - **Change ID**: a stable, human-friendly identifier (e.g. `qpvuntsm`) that **survives rewrites**. Amending, rebasing, or squashing a commit produces a new commit ID, but keeps the same change ID.

  Two different commits can be based on the same parent commit, so the commit history is a **DAG (tree)**, the same as in Git.

  > [!Note]
  > **vs Git:** a Git commit is a diff against its parent(s), while a JJ commit is a full snapshot. More importantly, Git only has the commit hash, so "the same change, rewritten" is indistinguishable from a brand-new commit; the change ID makes it a first-class citizen in JJ.

- **Pointer**:

  A pointer is a reference to a specific commit, which can be used to identify that commit.

  Pointers can move to another commit.

  JJ has two main kinds of pointers: `@` is an **implicit pointer** that always marks where you are working, while a **bookmark** is an **explicit, named pointer** that you move yourself.

  **`@`** is special pointer: it **is** the working-copy commit itself. Moving it therefore never leaves the working copy behind: `jj new` / `jj edit` (and navigating with `jj next` / `jj prev`) first snapshot whatever is on disk and then materialize the new `@`, so they never refuse because of "uncommitted changes". There is no symbolic/detached distinction either: `@` is always an ordinary commit, and the working copy is simply its materialized state.

  > [!Note]
  > **vs Git:** Git's `HEAD` points *to* a commit (usually through the branch it names), so "where I am" and "what my files look like" are two states that a command has to keep in sync, which is why `git checkout` can refuse. JJ has no `HEAD`: the position **is** a commit, and there is nothing to detach from.

- **Bookmark (Branch)**:

  A bookmark is JJ's equivalent of a Git branch. Older JJ versions called it "branch", so some docs or commands may still use that word.

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

  As the graph shows, the working-copy commit sits on an **anonymous commits line** (a chain of commits that no bookmark points to). Unlike Git, JJ does not garbage-collect them, because it tracks all visible heads of the commit graph.

  > [!Note]
  > **vs Git:** in Git, the **branch** is the first-class citizen, which means:
  >
  > 1.  You must create and name a branch before you start, even though you don't yet know how the work should be split;
  > 2.  Half-finished work has nowhere to live: it either stays in the working tree or a stash, or it is committed onto the branch;
  > 3.  Just looking at an older commit means creating another branch or entering the detached HEAD state, where work is easy to lose.
  >
  > JJ deliberately takes that status away from the bookmark and gives it to the commit: a commit that no bookmark points to is still a first-class, fully tracked commit. It lives on an **anonymous branch**, keeps its change ID, and can be rebased, squashed or split at any time. A bookmark is only useful when you need to **name** a group of commits, to push and collaborate on it, or to keep a long-lived version line.

- **Working-Copy Commit**:

  The working copy is **a real commit**, called the working-copy commit (`@`). Everything you see in your editor is just the materialized state of that commit.

  JJ automatically **snapshots** the working copy at the beginning of every command, and **amends** `@` with the changes, so there is no "dirty working directory" state: your changes are always in a commit (even if it has an empty description), and they will never be lost between commands.

  To start a new change on top of `@`, use `jj new`; to describe the current change and start a new one on top of it, use `jj commit`; to switch the working copy to another commit, use `jj edit` (likes `git checkout`), except that the previous `@` is simply kept as a normal commit.

  > [!Note]
  > **vs Git:** a Git working directory is a separate, unversioned area on top of `HEAD`, and the files you edit are "modified" until you commit them. In JJ the working copy *is* the commit `@`, so being "modified" only means "snapshotted into `@`".

- **No Staging Area**:

  JJ has **no staging area**: because the working copy is automatically committed, an index-like concept doesn't make sense.

  Instead of `git add -p; git commit`, use `jj split` to split the working-copy commit into two commits; instead of `git add -p; git commit --amend`, use `jj squash -i` to move part of the changes into the parent commit; and use `jj restore` to discard changes.

  > [!Note]
  > **vs Git:** Git exposes its index to users, which makes commands like `git reset` confusing (especially when combined with commits and/or files). JJ keeps a similar cache internally, but never exposes it.

- **Conflict**:

  Conflicts are **recorded inside commits** instead of blocking the operation that produced them: no JJ command fails because of a conflict. Conflict markers are written to the affected files in the working copy, and you can resolve them later with `jj resolve`, or even rebase the conflicted commit first.

  > [!Note]
  > **vs Git:** in Git, an unresolved conflict lives in the index / working directory and typically blocks `merge`, `rebase`, and `cherry-pick` until you resolve it. Since JJ stores conflicts in the commit itself, it addresses most `git rerere` use cases.

- **Immutable Commit**:

  The **trunk** is JJ's name for the remote's main line: the `trunk()` revset, which by default resolves to the newest of `main` / `master` / `trunk` on the `origin` / `upstream` remote. It is a config alias, so a project with a different remote or default branch can point it elsewhere.

  If no such remote bookmark exists, it falls back to the virtual root commit (so-called initial commit).

  Commits that are reachable from the trunk, tags, or untracked remote bookmarks and tags are **immutable** (see the `immutable_heads()` revset): JJ refuses to rewrite them, so you can't rewrite a shared commit by accident. Everything else is **mutable** and free to be rewritten. You can override this on purpose with `--ignore-immutable`.

  > [!Note]
  > **vs Git:** Git has no such protection, rewriting a published commit is always one `--force` away, and only your own discipline stands between you and your collaborators' tears 🫠.

- **Operation Log**:

  Every command that changes the repository is recorded as an **operation** in the operation log, which tracks atomic updates to all refs at once. This is what powers undo / redo: `jj op log`, `jj undo`, `jj redo`, and `jj op restore {{opId}}` (to go back to any previous state directly).

  > [!Note]
  > **vs Git:** Git's reflog is per-ref and only a safety net with a limited retention window; JJ's operation log is a first-class, repo-wide history of every state change.

- **Revset**:

  A **revset** is an expression that selects revisions, and it can be used wherever a revision is expected as an argument.

  The most common symbols are `@` (working-copy commit), `@-` (its parent), `trunk()` (the default remote's main bookmark), `x::y` (from `x` to `y`), `x..y` (from `x` to `y`, excluding `x`), and functions like `bookmarks()`, `description("...")`, `author(...)`, `mutable()`...

  ```bash
  jj log --revisions 'author(alice) & mutable()'
  ```

  > [!Note]
  > **vs Git:** revsets are much more expressive than Git's revision syntax (`HEAD~2`, `main..feat`), and can be freely composed with set operators (`|`, `&`, `~`) and functions.

#### Git to JJ Concept Mapping

| Git | JJ |
| --- | --- |
| `.git` metadata | `.jj` metadata (with a Git backend underneath) |
| Commit (diff + hash) | Commit (snapshot; change ID + commit ID) |
| `HEAD` / detached `HEAD` | `@` (working-copy commit) |
| Branch | Bookmark |
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
> Mixing `jj` and `git` commands in a colocated repository is allowed, but interleaving mutating `git` commands with `jj` commands is not recommended: `jj` has no "current branch", so it usually leaves the Git repo in a "detached HEAD" state, and the two tools may end up disagreeing about where a branch points.
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

As you may already know, JJ uses **bookmarks** to represent branches.

Unlike `git fetch`, `jj git fetch` does not only update the locally remembered position of the remote bookmark (`{{bookmark}}@{{remote}}`): if the remote bookmark is tracked (through `jj bookmark track {{bookmark}} --remote {{remote}}`), it also moves your local bookmark with it (which means your local bookmark like `{{bookmark}}` move with `{{bookmark}}@{{remote}}`). After that, you can **integrate changes** from or to that remote bookmark — `jj rebase --destination {{bookmark}}@{{remote}}` to bring commits from it, and `jj bookmark advance && jj git push` to send commits to it.

The biggest difference between JJ and Git is that JJ has **no current branch (bookmark)** and no `pull` command: `jj git fetch` may move a tracked bookmark, but it never integrates (merges or rebases for Git) your work onto it. In Git, `pull` does that for the current branch and updates the working directory for you; in JJ the rewrite is always a separate step that you run yourself.

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
> **vs Git:** `git pull` fetches and integrates in a single step (merging or rebasing, depending on your configuration), because it knows which branch you are on and which remote branch it tracks. JJ has no current branch, so nothing would tell a bare `pull` what to update; and because the integration step is a rewrite rather than a merge, JJ deliberately keeps the two steps apart.

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
> **vs Git:** Git pushes whatever the current branch / `HEAD` points to, so the target is implicit. JJ has no current branch, so the target is always a bookmark: all tracked bookmarks with unpushed commits by default, or exactly what you select with `--bookmark` / `--change`. And because the remote position must match the last fetch, `jj git push` behaves like `git push --force-with-lease`, if the bookmark has moved on the remote since your last fetch, JJ refuses to push and asks you to fetch and resolve the conflict first.

### Work with Bookmarks

Bookmarks are one of the most important concepts in collaborative development.

With bookmarks, you can create a temporary fork with a specific state, and work on it independently. Through this, you can do anything you want without affecting the existing codebase.

> [!Note]
> **vs Git:** there is nothing to `checkout` in JJ. To start working on a feature, you simply create commits on top of a revision and name that line of work with a bookmark when you want to share it or find it again:
>
> ```bash
> jj new main
>
> # Working on this...
>
> jj bookmark create feat/feature-name
> ```
>
> Until you name it, the line of commits is an **anonymous commits line** — a perfectly normal state in JJ (see **Core Concepts** above).

After the tasks are done on those bookmarks, you can apply them back by **pull request**.

> [!Note]
> I highly recommend you always use a **pull request** instead of integrating locally to apply the review and approval process.
>
> Creating a merge commit should only be used in cases of:
>
> 1.  Merge multiple feature bookmarks into one big feature bookmark, due to changed requirements or other reasons;
> 2.  Merge upstream changes (for example, changes on the `main` bookmark) into a feature bookmark. (In this case, `jj rebase` is a better choice than a merge commit.)

> [!Note]
> **vs Git:** Git uses `merge` command to create a merge commit, while JJ uses `new` command with multiple parent, for example: `jj new feat/a feat/b`.

#### Bookmark (and Commits Line) Management Workflow

To keep things controlled and organized, there are several common bookmark management workflows:

- [**Main Bookmark Workflow:**](#main-bookmark-workflow) <i id="main-bookmark-workflow"></i>

  <TextTag>Personal</TextTag><TextTag preset="red">Not recommended</TextTag>

  Every commits is start form the main bookmark directly.

  Versions are marked by tags on the main line (commits line marked by `main` bookmark), each release means one or more commits on the main branch.

  > [!Note]
  > **vs Git:** this is what Git calls the *main branch workflow*: there, committing advances the current branch automatically. A bookmark never moves by itself in JJ, so each change has to be recorded explicitly: you should execute `jj bookmark advance` manually before starting the next one.

- [**Feature Bookmark Workflow:**](#feature-bookmark-workflow) <i id="feature-bookmark-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Single version</TextTag>

  The main bookmark only advance on **pull/merge requests** commits and does not accept any direct commit.

  Commits are performed on feature lines (marked by `feat/xxx` bookmark) or hotfix lines (marked by `hotfix/xxx` bookmark), which are always start from the main line and applied back to the main line via pull/merge requests once development is complete.

  Of course, do not forget to use `jj bookmark advance` to update the `main` bookmark.

  Versions are marked by tags on the main line, each release means one or more pull/merge requests on the main line.

  > [!Note]
  > **vs Git:** the `feat/xxx` / `hotfix/xxx` bookmark does not have to be created up front. You can build the change (or a stack of changes) first, and only name it when you push it for review.

- [**Multiple Versions Workflow:**](#multiple-versions-workflow) <i id="multiple-versions-workflow"></i>

  <TextTag>Personal / Team</TextTag><TextTag preset="green">Multiple versions</TextTag>

  Based on the [feature bookmark workflow](#feature-bookmark-workflow), with multiple long-term bookmarks for different major versions.

  - Main line is for **the next major version**
  - Released version lines (marked by `v{{version}}` bookmark) are for the released major versions, e.g. `v1.x`, `v2.x`, etc.
  - Feature lines (marked by `feat/xxx` bookmark) are for new features, start from the main bookmark, and will also be applied back to the main line by pull/merge requests once the development is done.

    If this feature needs to be **backported** to any released major version, you should use `jj duplicate` to copy the feature commits onto the appropriate `v{{version}}` bookmark. See [examples](https://github.com/nuxt/nuxt) here.
  - Hotfix lines (marked by `hotfix/xxx` bookmark) are for hotfixes, start from the first included released version bookmark, and will be applied back to the appropriate `v{{version}}` line by pull/merge requests after the development is done.

    If this hotfix needs to be **forwardported** to any other released version or next major version, you should use `jj duplicate` to copy the feature commits onto the appropriate `v{{version}}` or main bookmark. See [examples](https://github.com/nuxt/nuxt) here.

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

  Based on the [feature bookmark workflow](#feature-bookmark-workflow), with multiple long-term bookmarks for different environments.

  - main line is for **production environment**
  - `uat` line is for **UAT environment**
  - `test` line is for **testing environment**
  - `dev` line is for **development environment**
  - Feature lines are for new features, start from the main bookmark, and applied back to the `dev`, `test`, `uat`, and main lines by pull/merge requests, based on the feature's development process.
  - Hotfix lines are for hotfixes, start from the main bookmark, and applied back to the `dev`, `test`, `uat`, and main lines by pull/merge requests, based on the hotfix's development process.

  > [!Note]
  > **Why not promote strictly (`test` → `uat` → `main`)?**
  >
  > A promotion is a *wholesale* merge (`jj new uat test`, then `jj bookmark advance uat`): everything sitting on the previous environment's line comes along. Environment lines are writable in practice and collect things that must not be released (a debug commit on `test`, a config tweak on `uat`) and a strict chain would carry them upward without anyone deciding to.
  >
  >Applying every change to every environment flips the failure mode: **missing an application is explicit and cheap to find** (compare the applied sets, or just open a pull request), whereas something riding along unnoticed is implicit and hard to trace, especially when the promotion happened as a local merge.
  >
  > It is the same kind of decision as backport/forwardport across version lines: moving changes between long-lived lines is always a per-change, human one. The price is that you should care about which artifact/commit each environment actually runs.

You can choose one of the workflows above based on your project's size, type, complexity or your preference.

> [!Note]
>
> This article will use the most complex [**multiple versions workflow**](#multiple-versions-workflow) as an example.

### Create a New Bookmark

#### Feature Bookmark

> [!Note]
> Basically, we only start new feature development on the next major version line, which is the `main` line (marked by the `main` bookmark) in this case. If other versions need this feature, we can backport it.
>
> That is to say, we will never develop a new feature for a specific released version but not for the next major version.

To add a new feature, you should start a new commits line from the `main` line first:

```bash
jj new main
```

Then, you can work on that line, commit changes frequently:

```bash
echo "Hello, JJ!" > index.js
jj commit --message "feat: add index.js"

echo "Hello, JJ!" > second.js
jj commit --message "feat: add second.js"
```

And mark the line with a bookmark when you are ready to push it. `@-` is the tip of the line, because the working-copy commit `@` itself is always empty.

```bash
jj bookmark create feat/feature-name --revision @-
jj git push --bookmark feat/feature-name
```

> [!Note]
> **vs Git:** `git switch --create feat/feature-name main` creates the branch *and* moves you onto it; in JJ those are two separate things. `jj new main` starts a new commits line on top of `main`, and the bookmark is just a name you attach when you need one.

#### Hotfix Bookmark

To add a hotfix, you should start a new commits line from the first included released line. For example, if the bug appears in the `v1.x` line (marked by the `v1.x` bookmark):

```bash
jj new v1.x
```

Then, you can work on that line, commit changes frequently:

```bash
echo "Fix the bug!" >> index.js
jj commit --message "hotfix: fix the bug"
```

And mark the line with a bookmark when you are ready to push it:

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

### Undo Last Commit

Committing is just an operation in JJ, when you commit some changes by accident, you can undo it with:

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
