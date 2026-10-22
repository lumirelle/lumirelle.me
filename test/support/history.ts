import { execFileSync } from 'node:child_process'

/**
 * Git's own record of when a page's source was last written.
 *
 * The masthead's "Last edit on" date is derived from history, so the suite has to
 * read history to know whether the page is right: "the rendered date is the right
 * date" is the whole contract, and no structural assertion can stand in for it.
 *
 * Git is asked one file at a time here, on purpose. The build batches its walk
 * because it must; the suite is slow either way, and a ground truth that shares
 * no parsing with the implementation is a ground truth that can disagree with it.
 */

interface HistoryAvailability {
  available: boolean
  /** Why history cannot be read, when it cannot. */
  reason?: string
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

/**
 * Whether history is readable at all.
 *
 * The site degrades to "no edit date" without git, so the suite degrades to
 * "no assertion" the same way — with the reason logged, never with a failure.
 */
export function historyAvailability(): HistoryAvailability {
  try {
    if (git(['rev-parse', '--is-inside-work-tree']) !== 'true') {
      return { available: false, reason: 'not a git working tree' }
    }
    return { available: true }
  }
  catch (error) {
    return { available: false, reason: `git is unavailable: ${(error as Error).message}` }
  }
}

/**
 * Author date of the last commit that touched `file`, in the offset it carries.
 *
 * `undefined` when history has never seen the file — an uncommitted draft, which
 * the site must render without an edit date.
 */
export function lastCommitOf(file: string): string | undefined {
  const date = git(['log', '-1', '--no-renames', '--format=%aI', '--', file])
  return date === '' ? undefined : date
}

/**
 * Author date of the commit that introduced `file`, in the offset it carries.
 *
 * A Post may be *older* than this — a file that was rewritten or re-added enters
 * history late, and the authored date remembers what history lost. It may never
 * be *newer*: nothing is published before the commit that introduced it.
 *
 * `undefined` when history has never seen the file, where nothing is impossible.
 */
export function firstCommitOf(file: string): string | undefined {
  // Oldest first, then the first line: `--reverse` and `-1` do not compose, and
  // a Post's file history is a handful of commits either way.
  const date = git(['log', '--no-renames', '--reverse', '--format=%aI', '--', file])
    .split('\n')[0]
  return date === undefined || date === '' ? undefined : date
}
