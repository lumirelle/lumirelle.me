<script setup lang="ts">
import type { Post } from '~/types'
import { useRouter } from 'vue-router'
import { chineseOnly, formatDate } from '~/logics'
import { manualGroupOrder } from '../../data/manual-groups'

/**
 * The Post list, as a ledger.
 *
 * Rows are a two-column grid: a monospaced, tabular date in the margin, then
 * title and secondary metadata. Reading time is right-aligned against the inner
 * edge of the title column, so it reads as a quantity rather than as a tag. The
 * year and Manual group labels sit on the Frame's rule instead of floating above
 * the rows, and nothing is joined with middle dots — the columns do that work.
 *
 * Ordering is untouched: Manual group order then manual order, otherwise date
 * descending, future-dated Posts still grouped under `Upcoming`.
 */
const props = defineProps<{
  type?: string
  posts?: Post[]
  extra?: Post[]
}>()

const router = useRouter()

const routes: Post[] = router
  .getRoutes()
  .filter(
    i => i.path.startsWith('/posts') && i.meta.frontmatter.date && !i.meta.frontmatter.draft,
  )
  .filter(
    i =>
      !i.path.endsWith('.html')
      && (!props.type || (i.meta.frontmatter.type || 'blog').split('+').includes(props.type)),
  )
  .map(i => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    lang: i.meta.frontmatter.lang,
    duration: i.meta.frontmatter.duration,
    upcoming: i.meta.frontmatter.upcoming,
    redirect: i.meta.frontmatter.redirect,
    place: i.meta.frontmatter.place,
    group: i.meta.frontmatter.group,
    order: i.meta.frontmatter.order,
    // The markers the list has always carried, copied so they can render:
    // without these the `inperson` / radio / video rows below never fired.
    inperson: i.meta.frontmatter.inperson,
    radio: i.meta.frontmatter.radio,
    video: i.meta.frontmatter.video,
    recording: i.meta.frontmatter.recording,
    platform: i.meta.frontmatter.platform,
  }))

function manualGroupIndex(p: Post): number {
  const idx = manualGroupOrder.indexOf(p.group || '')
  return idx === -1 ? manualGroupOrder.length : idx
}

const posts = computed(() =>
  [...(props.posts || routes), ...(props.extra || [])]
    .sort((a, b) => {
      if (props.type === 'manual') {
        const groupDiff = manualGroupIndex(a) - manualGroupIndex(b)
        if (groupDiff !== 0)
          return groupDiff
        const groupNameDiff = (a.group || '').localeCompare(b.group || '')
        if (groupNameDiff !== 0)
          return groupNameDiff
        return (a.order || Number.MAX_SAFE_INTEGER) - (b.order || Number.MAX_SAFE_INTEGER)
      }
      else {
        return Number(new Date(b.date)) - Number(new Date(a.date))
      }
    })
    .filter(i => !chineseOnly.value || !i.lang || i.lang === 'zh'),
)

const getYear = (a: Date | string | number): number => new Date(a).getFullYear()

function isFuture(a?: Date | string | number): boolean {
  return a !== undefined && new Date(a) > new Date()
}

function isSameYear(a?: Date | string | number, b?: Date | string | number): boolean {
  return a !== undefined && b !== undefined && getYear(a) === getYear(b)
}

function isSameGroup(a: Post, b?: Post): boolean {
  if (props.type === 'manual')
    return b != null && a.group === b?.group
  else
    return isFuture(a.date) === isFuture(b?.date) && isSameYear(a.date, b?.date)
}

function getGroupName(p: Post): number | string {
  if (props.type === 'manual')
    return p.group || 'Other'
  else
    return isFuture(p.date) ? 'Upcoming' : getYear(p.date)
}

interface LedgerRow extends Post {
  step?: number
}

interface LedgerGroup {
  label: string
  rows: LedgerRow[]
}

/**
 * One pass over the ordered Posts, cutting a new group wherever the grouping
 * rule says the label changes. `STEP n.` is numbered per group, because a
 * Manual is a sequence and the step belongs to the sequence, not to the page.
 */
const groups = computed<LedgerGroup[]>(() => {
  const result: LedgerGroup[] = []

  for (const [idx, post] of posts.value.entries()) {
    const isNewGroup = !isSameGroup(post, posts.value[idx - 1])
    if (isNewGroup || result.length === 0) {
      result.push({ label: String(getGroupName(post)), rows: [] })
    }

    const group = result.at(-1)!
    const step = props.type === 'manual' ? group.rows.length + 1 : undefined
    group.rows.push({ ...post, step })
  }

  return result
})

/** The row whose title is currently resolving, so hover and focus agree. */
const activeRow = ref<string | null>(null)
const active = (path: string): boolean => activeRow.value === path

/** External links leave the site, so they are anchors; everything else routes. */
function isExternal(p: Post): boolean {
  return p.path.includes('://')
}

/**
 * The language indicator, which exists so a reader can tell a Post is written in
 * Chinese before opening it. English is the site's default, so labelling every
 * English row would be noise in a ledger; the marker appears when the language
 * is the exception, which is the only time it carries information.
 */
function languageLabel(p: Post): string | undefined {
  return p.lang === 'zh' ? '中文 / CN' : undefined
}
</script>

<template>
  <div v-if="!posts.length" class="text-ink-faint py-2">
    { nothing here yet }
  </div>

  <div v-else class="ledger">
    <section v-for="group in groups" :key="group.label" class="border-t border-stroke">
      <!-- The label sits *on* the rule, masked against the canvas. -->
      <h2 class="group-label">
        {{ group.label }}
      </h2>

      <ul>
        <li v-for="row in group.rows" :key="row.path" class="row">
          <component
            :is="isExternal(row) ? 'a' : 'RouterLink'"
            v-bind="
              isExternal(row)
                ? { href: row.path, target: '_blank', rel: 'noopener noreferrer' }
                : { to: row.path }
            "
            class="row-link"
            :class="{ active: active(row.path) }"
            @mouseenter="activeRow = row.path"
            @mouseleave="activeRow = null"
            @focus="activeRow = row.path"
            @blur="activeRow = null"
          >
            <span class="row-grid">
              <span class="cell-date">
                <time class="block" :datetime="String(row.date)">
                  {{ formatDate(row.date, true) }}
                </time>
                <span v-if="row.group" class="text-ink-faint block">{{ row.group }}</span>
              </span>

              <span class="cell-body">
                <span class="cell-title">
                  <span v-if="row.step" class="step">STEP {{ row.step }}.</span>
                  <GlitchText :text="row.title" :active="active(row.path)" />
                  <span
                    v-if="row.redirect"
                    class="external"
                    title="External"
                    aria-label="External link"
                  >↗</span>
                </span>

                <span class="cell-meta">
                  <span class="markers">
                    <span v-if="languageLabel(row)" class="marker">{{ languageLabel(row) }}</span>
                    <span
                      v-if="row.inperson"
                      class="marker"
                      title="In person"
                      aria-label="In person"
                    ><span i-ri-group-2-line aria-hidden="true" /></span>
                    <span
                      v-if="row.recording || row.video"
                      class="marker"
                      title="Provided in video"
                      aria-label="Provided in video"
                    ><span i-ri-film-line aria-hidden="true" /></span>
                    <span
                      v-if="row.radio"
                      class="marker"
                      title="Provided in radio"
                      aria-label="Provided in radio"
                    ><span i-ri-radio-line aria-hidden="true" /></span>
                    <span v-if="row.place" class="marker">{{ row.place }}</span>
                  </span>

                  <span v-if="row.duration" class="duration tabular-nums">{{ row.duration }}</span>
                </span>
              </span>
            </span>
          </component>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.ledger {
  font-family: var(--font-mono, monospace);
}

/*
 * Rows are rows, not prose list items.
 *
 * The pilot page is wrapped in `.prose`, which gives every `ul > li` a drawn
 * bullet and a 1.75em indent. The ledger's structure is its grid, so both are
 * turned off here — the scoped attribute keeps this above `.prose`'s rule.
 */
.ledger ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ledger ul > li {
  position: static;
  padding-left: 0;
}

.ledger ul > li::before {
  content: none;
  background: none;
}

/* A label on the Frame's rule: 11 px, faint, masked against the canvas. */
.group-label {
  display: inline-block;
  position: relative;
  top: -0.55rem;

  margin: 0;
  padding-right: 0.75rem;

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  color: var(--color-ink-faint);
  background-color: var(--color-canvas);
}

.row {
  border-bottom: 1px solid var(--color-stroke);
}

.row-link,
.row-link:hover {
  display: block;
  padding: 0.6rem 0;
  color: inherit;
  /* `.prose a` draws a rule under every link and, on hover, *adds* one. The row
     divider is the Frame's job — a hairline is a Rail, a row divider or a focus
     outline, never a link decoration — so both states are cleared. */
  border-bottom: none;
  text-decoration: none;
}

.row-grid {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 0 1rem;
  align-items: baseline;
}

.cell-date {
  font-size: 11px;
  line-height: 1.6;
  text-align: right;
  color: var(--color-ink-faint);
  /* Tabular so a column of dates lines up digit for digit. */
  font-variant-numeric: tabular-nums;

  padding: 0 0.25rem;
  transition: background-color var(--duration-interaction) var(--ease-interaction),
    color var(--duration-interaction) var(--ease-interaction);
}

/* Terminal selection: the hovered row's date inverts like a selected line. */
.row-link.active .cell-date,
.row-link:hover .cell-date {
  color: var(--color-canvas);
  background-color: var(--color-ink-strong);
}

.cell-body {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  min-width: 0;
}

.cell-title {
  display: flex;
  align-items: baseline;
  gap: 0.5ch;
  min-width: 0;

  font-family: var(--font-serif, serif);
  font-size: 23px;
  line-height: 1.32;
  color: var(--color-ink-strong);
}

.step {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-ink-faint);
  flex: none;
}

.external {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-ink-faint);
  flex: none;
}

.cell-meta {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  flex: none;

  font-size: 12px;
  color: var(--color-ink-faint);
}

.markers {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
}

.marker {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4ch;
  white-space: nowrap;
}

/* Reading time: a quantity at the inner edge of the title column. */
.duration {
  text-align: right;
  min-width: 4ch;
}

@media (max-width: 39.999rem) {
  .row-grid {
    grid-template-columns: 4rem 1fr;
  }

  .cell-body {
    display: block;
  }

  .cell-meta {
    margin-top: 0.25rem;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cell-date {
    transition: none;
  }
}
</style>
