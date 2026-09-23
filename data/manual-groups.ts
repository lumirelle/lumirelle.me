/**
 * Manual post group order.
 *
 * Manual posts are grouped by their `group` frontmatter. Groups are rendered
 * in the order listed here; any group not listed falls back to the end
 * (sorted alphabetically). A post's `order` frontmatter only controls its
 * position within its own group, so each group numbers independently.
 */
export const manualGroupOrder: string[] = [
  'Computer',
  'Shell',
  'Editor',
  'VCS',
  'Web',
]
