# A Post's last edit comes from git; its publication date stays authored

Every Post states when it was last edited, and until now that date was typed into
frontmatter. All 26 carried one and they drifted: `manual-git.md` claimed
`2026-10-21T17:11+08:00` while the commit that last touched it says `17:07:37` —
four minutes of fiction, invisible to the reader and invisible to review.

**`update` is derived, never authored.** At build start one
`git log --no-renames --name-only` walk is memoised into a path → {first commit,
last commit} map; a Post's edit date is the **author** date of the last commit
that touched its file. Author date rather than committer date, because it
survives rebases and it is the one that answers "when was this written". The
value appears only when that commit's calendar day differs from the authored
`date` — a Post committed on its publication day shows one date, not two — and is
absent when the file has no commit or the tree has no git at all. There is no
fallback to file modification time: a checkout changes it, so it would produce a
date that means nothing.

**`date` stays authored, on purpose.** Git cannot reconstruct first publication:
ten of the 26 Posts disagree with their earliest commit, five by months, and the
disagreements are rewrites and re-adds that no rename heuristic bridges. Deriving
it would replace correct memory with a wrong fact. It remains the only thing that
decides order, so the feed, the Post list and sorting are untouched by this
decision.

**A publication date later than a file's own first commit is warned about, not
failed on.** That is impossible rather than stale, so it is a typo; a warning
surfaces it without making the build depend on history. The check reuses the same
walk.

## Consequences

- **A mechanical mass edit re-dates every Post.** Deleting the 26 authored
  `update:` keys was itself a commit that touched all 26 files, so for a while
  every Post reads "Last edit on" that commit's day. That is the derivation being
  honest, not a bug: the date answers "when was this file last committed", not
  "how much prose changed". If a mass edit ever needs to leave dates alone, the
  answer is a commit convention (e.g. one commit per Post), not a second source
  of truth about time.
- **The derivation needs commit history, not file history.** The deployment clone
  is blobless but carries full commits and trees, so per-file dates resolve
  there. A tree without git loses its edit dates and still builds.
- **The suite reads git too.** Each rendered date is compared with `git log -1`
  for that file, formatted with the site's own rule, and the expected presence is
  computed the way the implementation computes it — so the same-day rule is
  exercised the day a Post qualifies. Where history cannot be read, the check
  skips with a logged reason, exactly as the site degrades.
- **A Post with no commit has no edit date, and the one-seam suite cannot hold a
  fixture for it**: any file in the tree is committed, and the suite runs against
  a production build. That path is covered by the derivation being absent-when-
  unknown and by review, not by an assertion.
