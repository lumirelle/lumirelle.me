/**
 * The order a listed sequence is read in.
 *
 * A Manual or a Tutorial states its own `group` in frontmatter; the groups below
 * are rendered in this order, and any group not listed falls back to the end
 * (sorted alphabetically). A Post's `order` only places it inside its own group,
 * so each group numbers independently — which is also what the list's `STEP n.`
 * counts.
 *
 * A Guide names its group in the title instead (`Code Style: Title Case`), so its
 * `order` places it inside that series; the series below are the reading order of
 * the whole Guides page, and a series not listed falls back to the end,
 * alphabetically.
 */
export const postGroupOrder: string[] = [
  'Computer',
  'Shell',
  'Editor',
  'VCS',
  'Web',
]

export const guideSeriesOrder: string[] = [
  'Code Style',
  'Project Engineering',
  'Performance Optimization',
]
