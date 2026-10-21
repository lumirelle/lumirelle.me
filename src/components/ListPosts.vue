<script setup lang="ts">
import type { Post } from '~/types'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { chineseOnly } from '~/logics'
import { manualGroupOrder } from '../../data/manual-groups'

/**
 * The Post list: a masthead, a command line, and a ledger.
 *
 * The masthead is the page's own affordance — `$ ls posts --sort=date` with the
 * entry count at the far edge — and the ledger below it is a two-column grid in
 * which the *margin* carries the group label (year, `Upcoming`, or `manuals` over
 * the manual's group) and each row carries its own date and reading time on the
 * line beneath the title. Rows are separated by rhythm, not by rules: a hairline
 * belongs to the Frame, and a list of thirty rows does not need thirty of them.
 *
 * Ordering is unchanged: manual group order then manual order, otherwise date
 * descending, future-dated Posts still grouped under `Upcoming`.
 */
const props = defineProps<{
  title: string
  lead?: string
  type?: string
  posts?: Post[]
  extra?: Post[]
}>()

const router = useRouter()

interface LedgerRow extends Post {
  /** `YYYY-MM-DD`, the form the meta line prints. */
  isoDate: string
  external: boolean
  manual: boolean
  step?: number
}

interface LedgerGroup {
  key: string
  /** Two lines at most: `['2026', '']` or `['manuals', 'computer']`. */
  margin: [string, string]
  rows: LedgerRow[]
}

const routes: LedgerRow[] = router
  .getRoutes()
  .filter(
    i => i.path.startsWith('/posts') && i.meta.frontmatter.date && !i.meta.frontmatter.draft,
  )
  .filter(
    i =>
      !i.path.endsWith('.html')
      && (!props.type || (i.meta.frontmatter.type || 'blog').split('+').includes(props.type)),
  )
  .map((i) => {
    const frontmatter = i.meta.frontmatter
    return {
      path: frontmatter.redirect || i.path,
      title: frontmatter.title,
      date: frontmatter.date,
      isoDate: dayjs(frontmatter.date).format('YYYY-MM-DD'),
      lang: frontmatter.lang,
      duration: frontmatter.duration,
      upcoming: frontmatter.upcoming,
      redirect: frontmatter.redirect,
      place: frontmatter.place,
      group: frontmatter.group,
      order: frontmatter.order,
      // The markers the list has always carried, copied so they can render.
      inperson: frontmatter.inperson,
      radio: frontmatter.radio,
      video: frontmatter.video,
      recording: frontmatter.recording,
      external: i.path.includes('://') || Boolean(frontmatter.redirect),
      manual: (frontmatter.type || 'blog').split('+').includes('manual'),
    }
  })

function manualGroupIndex(post: Post): number {
  const idx = manualGroupOrder.indexOf(post.group || '')
  return idx === -1 ? manualGroupOrder.length : idx
}

const posts = computed<LedgerRow[]>(() =>
  [...routes, ...((props.extra as LedgerRow[] | undefined) || [])]
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
      return Number(new Date(b.date)) - Number(new Date(a.date))
    })
    .filter(i => !chineseOnly.value || !i.lang || i.lang === 'zh'),
)

const manualCount = computed(() => posts.value.filter(post => post.manual).length)

const command = computed(() =>
  props.type
    ? `ls posts --type=${props.type} --sort=date`
    : 'ls posts --sort=date',
)

function isFuture(a?: Date | string | number): boolean {
  return a !== undefined && new Date(a) > new Date()
}

function groupKey(post: LedgerRow): string {
  if (props.type === 'manual')
    return post.group || 'Other'
  return isFuture(post.date) ? 'Upcoming' : String(new Date(post.date).getFullYear())
}

/**
 * The margin reads `manuals` over the manual's own group, and the plain group
 * label otherwise. Two lines at most, because it is a 6.5 rem column.
 */
function marginLines(key: string): [string, string] {
  if (props.type === 'manual')
    return ['manuals', key.toLowerCase()]
  return [key, '']
}

const groups = computed<LedgerGroup[]>(() => {
  const result: LedgerGroup[] = []

  for (const post of posts.value) {
    const key = groupKey(post)
    if (result.at(-1)?.key !== key) {
      result.push({ key, margin: marginLines(key), rows: [] })
    }

    const group = result.at(-1)!
    group.rows.push({
      ...post,
      // A Manual is a sequence, so the step belongs to the group, not the page.
      step: props.type === 'manual' ? group.rows.length + 1 : undefined,
    })
  }

  return result
})

/** The row whose title is resolving, so hover and focus agree. */
const activeRow = ref<string | null>(null)
function active(path: string): boolean {
  return activeRow.value === path
}

/** Sections. Kept because they are the only route to /blog, /notes and /manuals. */
const sections = [
  { label: 'all', to: '/posts' },
  { label: 'blog', to: '/blog' },
  { label: 'notes', to: '/notes' },
  { label: 'manuals', to: '/manuals' },
]
const route = useRoute()
</script>

<template>
  <header class="masthead">
    <h1 class="masthead-title">
      {{ title }}
    </h1>
    <p v-if="lead" class="masthead-lead">
      {{ lead }}
    </p>

    <div class="command">
      <span class="prompt">$</span>
      <span>{{ command }}</span>
      <span class="caret" aria-hidden="true" />
      <span class="counts">{{ posts.length }} entries / {{ manualCount }} manuals</span>
    </div>

    <nav class="filters" aria-label="Post sections">
      <button
        type="button"
        class="filter"
        :class="chineseOnly ? 'text-ink-strong' : 'text-ink-faint'"
        :aria-pressed="chineseOnly"
        @click="chineseOnly = !chineseOnly"
      >
        <span
          :class="chineseOnly ? 'i-carbon-checkbox-checked' : 'i-carbon-checkbox'"
          aria-hidden="true"
        />
        chinese only
      </button>
      <RouterLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="filter"
        :class="route.path === section.to ? 'text-ink-strong' : 'text-ink-faint'"
        :aria-current="route.path === section.to ? 'page' : undefined"
      >
        {{ section.label }}
      </RouterLink>
    </nav>
  </header>

  <div v-if="!posts.length" class="text-ink-faint py-2">
    { nothing here yet }
  </div>

  <div v-else class="ledger">
    <section v-for="group in groups" :key="group.key" class="group">
      <div class="group-grid">
        <!-- A real heading, not a decorative label: the rows below belong to it. -->
        <h2 class="group-margin">
          <span>{{ group.margin[0] }}</span>
          <span v-if="group.margin[1]" class="group-margin-sub">{{ group.margin[1] }}</span>
        </h2>

        <ul class="rows">
          <li v-for="row in group.rows" :key="row.path">
            <component
              :is="row.external ? 'a' : 'RouterLink'"
              v-bind="
                row.external
                  ? { href: row.path, target: '_blank', rel: 'noopener noreferrer' }
                  : { to: row.path }
              "
              class="row-link"
              @mouseenter="activeRow = row.path"
              @mouseleave="activeRow = null"
              @focus="activeRow = row.path"
              @blur="activeRow = null"
            >
              <span class="row-title">
                <GlitchText :text="row.title" :active="active(row.path)" />
                <span v-if="row.redirect" class="row-external" title="External" aria-label="External link">↗</span>
              </span>

              <span class="row-meta">
                <span v-if="row.step" class="row-step">STEP {{ row.step }}.</span>
                <time
                  class="row-date"
                  :class="{ active: active(row.path) }"
                  :datetime="String(row.date)"
                >{{ row.isoDate }}</time>
                <span v-if="row.duration">{{ row.duration }}</span>
                <span v-if="row.lang === 'zh'">chinese</span>
                <span v-if="row.inperson" title="In person" aria-label="In person"><span i-ri-group-2-line aria-hidden="true" /></span>
                <span v-if="row.recording || row.video" title="Provided in video" aria-label="Provided in video"><span i-ri-film-line aria-hidden="true" /></span>
                <span v-if="row.radio" title="Provided in radio" aria-label="Provided in radio"><span i-ri-radio-line aria-hidden="true" /></span>
                <span v-if="row.place">{{ row.place }}</span>
              </span>
            </component>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------------------------------------------------------------- masthead */

.masthead {
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--color-stroke);
}

.masthead-title {
  margin: 0;

  font-family: var(--font-serif, serif);
  font-size: 46px;
  font-weight: 400;
  line-height: 1.05;
  color: var(--color-ink-strong);
}

.masthead-lead {
  margin: 1rem 0 0;
  max-width: 46ch;

  font-family: var(--font-serif, serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-ink-faint);
}

.command {
  display: flex;
  align-items: baseline;
  gap: 1rem;

  margin-top: 2rem;

  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--color-ink-faint);
}

/* The prompt is the one token at full ink, as in the header's breadcrumb. */
.prompt {
  color: var(--color-ink-strong);
}

.counts {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

/* A 2 px bar, not a glyph: block characters overhang their cell in this face. */
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: -1rem;

  background-color: var(--color-ink-strong);
  animation: caret-blink 1.1s steps(1, end) infinite;
}

@keyframes caret-blink {
  50% {
    opacity: 0;
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 1.5rem;

  margin-top: 1rem;

  font-family: var(--font-mono, monospace);
  font-size: 11px;
}

.filter,
.filter:hover {
  border-bottom: none;
  text-decoration: none;
  transition: color var(--duration-interaction) var(--ease-interaction);
}

.filter:hover {
  color: var(--color-ink-strong);
}

/* ------------------------------------------------------------------ ledger */

.group {
  margin-top: 4rem;
}

.group-grid {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 0 2rem;
}

.group-margin {
  display: block;
  margin: 0;
  padding-top: 0.375rem;

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.6;
  text-align: right;
  color: var(--color-ink-faint);
}

.group-margin > span {
  display: block;
}

.group-margin-sub {
  opacity: 0.7;
}

/*
 * The pilot page is wrapped in `.prose`, which gives every `ul > li` a drawn
 * bullet, a 1.75em indent and its own vertical rhythm. A ledger row is not a
 * prose list item — its structure is the grid — so all three are turned off.
 */
.rows {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rows > li {
  position: static;
  margin: 0;
  padding-left: 0;
}

.rows > li::before {
  content: none;
  background: none;
}

/* Rows are separated by rhythm, not by rules. */
.rows > li + li {
  margin-top: 2.25rem;
}

.row-link,
.row-link:hover {
  display: block;
  border-bottom: none;
  text-decoration: none;
  color: inherit;
}

.row-title {
  display: flex;
  align-items: baseline;
  gap: 0.5ch;

  font-family: var(--font-serif, serif);
  font-size: 23px;
  line-height: 1.32;
  color: var(--color-ink-strong);
}

.row-external {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  color: var(--color-ink-faint);
}

.row-meta {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;

  margin-top: 0.5rem;

  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--color-ink-faint);
}

.row-step {
  font-size: 11px;
}

/* Terminal selection: the date reads as a selected line while the row is active. */
.row-date {
  margin-inline: -0.25rem;
  padding-inline: 0.25rem;
  font-variant-numeric: tabular-nums;
  transition: background-color var(--duration-interaction) var(--ease-interaction),
    color var(--duration-interaction) var(--ease-interaction);
}

.row-date.active {
  color: var(--color-canvas);
  background-color: var(--color-ink-strong);
}

@media (max-width: 39.999rem) {
  .group-grid {
    grid-template-columns: 4rem 1fr;
    gap: 0 1rem;
  }

  .masthead-title {
    font-size: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }

  .row-date {
    transition: none;
  }
}
</style>
