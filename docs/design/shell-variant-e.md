# Shell — variant E (confirmed)

The redesign's Shell, as confirmed from the prototype. **This file is the design reference the tickets build against.** The runnable version lives on branch `prototype/redesign-shell` (commit `8955979`, `?variant=E`) — read it for proportions and feel, not for implementation, because half of it is deliberately throwaway (see *Prototype hacks* below).

Companion decisions: [ADR-0001](../adr/0001-geist-style-transfer.md) (style transfer, zero-dependency motion), [ADR-0002](../adr/0002-semantic-and-syntax-colour.md) (hue only for syntax and severity).

## Structure

One centred column, 820 px max, 32 px side padding, on every route. No vertical rails: the earlier "Frame with two Rails" idea did not survive the prototype — the column is held by its own measure and hairline rules, and the left margin column carries the structure instead.

```
lumirelle@me ~/posts                        posts  projects  use  photos  demos  ☾
──────────────────────────────────────────────────────────────────────────────
                         [ content column, 820 px max ]
```

- **Header row** — 20 px vertical padding, no rule beneath it.
- **Content** — starts 48 px below the header on every route (`pt-12`), so list mastheads and post titles share one rhythm.
- **Footer** — hairline above, mono 11 px, two items.

## Type

| role | face | size |
| --- | --- | --- |
| Post / page titles | Aporetic Serif (system serif fallback) | 46 px |
| List row titles | same | 23 px, 1.32 |
| Prose | same | 18 px / 1.7 |
| Chrome, dates, metadata | **Aporetic Serif Mono** | 12 px |
| Rail entries, group labels, footer | same | 11 px |
| Code | same | 13.5 px / 1.7 |
| Code window bar, copy | same | 10 px |

Mono is for system truth — nav, breadcrumb, dates, counts, labels. Serif is for voice — titles and prose. Never mix the two in one line. No all-caps labels; `STEP n.` stays only in Manuals, which are genuinely ordered.

## Geometry

- Content column **820 px**, padding **32 px**. The footer's closing rule is the column's width, not the
  viewport's.
- Margin column **6.5 rem**, right-aligned mono, and it carries the **group label** — the year, `Upcoming`,
  or (for manuals) `manuals` over the manual's own group on a second line. It does not carry the date.
- List masthead: `h1` at 46 px, a one-sentence lead at 18 px / 1.6 capped at 46ch, then the command line
  `$ ls posts --sort=date` with a 2 px caret and, at the far edge, `26 entries / 13 manuals`. One hairline
  closes the block.
- List rows: `grid [6.5rem 1fr]`; the title is 23 px serif and the **date and reading time sit on a second
  line beneath the title**, mono 12 px, as `2026-04-21  3min`. Rows are separated by rhythm (`2.25rem`),
  **never by rules** — thirty rows do not need thirty hairlines.
- Outline rail: fixed, gutter only. `left: max(16px, 50% - 626px)`, width **224 px**, `cd ..` at **top 72**,
  rail at **top 102** (`--rail-top + 30`). Hidden below **1400 px**, where the gutter can't hold it without
  touching the column; there the site's existing hover-reveal outline takes over.
- Radii: **8 px** on the code window, **4 px** on interactive controls, square everywhere else.

## Tokens

| token | light | dark |
| --- | --- | --- |
| canvas | `#FFFFFF` | `#000000` |
| surface | `#F6F6F6` | `#0D0D0D` |
| stroke | `#E2E2E2` | `#262626` |
| ink | `#3A3A3A` | `#C4C4C4` |
| ink-strong | `#111111` | `#F2F2F2` |
| ink-faint | `#767676` | `#6E6E6E` |

`#767676` is not a taste call: it is the point where faint text clears WCAG AA (4.54:1) on white. The darker *strong* border in dark mode is `#454545`, because `#262626` disappears against black.

## Colour

Structure is monochrome. Hue appears in exactly two places (ADR-0002):

- **Syntax**, from the [`lumirelle/vercel.nvim`](https://github.com/lumirelle/vercel.nvim) palette via a Shiki theme (`plugins/shiki-vercel-theme.ts`, already on `main`): keywords/operators pink, strings green, numbers/properties blue, functions/types purple, comments grey.
- **Severity**, the `[900]` accent step of each scale: note blue, tip green, important purple, warning amber, caution red.

Never on chrome, never as decoration, never as a hover or focus state — focus is a 1 px stroke outline, offset 2 px.

## Effects

One orchestrated moment, everything else answers an action. All of it is off under `prefers-reduced-motion`.

- **Splash** — ASCII boot, once per session: a box-drawn ghost fades in, a command types under it (`lumirelle.me $ ls posts --sort=date`), cursor blinks, panel lifts. ~1.1 s total; any click or keypress jumps to the end. **Plain ASCII only** (`+ - | o ~`): box-drawing and block glyphs (`█ ▀ ▄ ─`) overhang their cell in Aporetic Serif Mono and the frame drifts.
- **Route change** — a 200 ms opacity `route-in` keyed on the route. **No View Transitions** (see #9): scroll and the transition must be owned by the same code, and here that is the router.
- **Caret** — a 2 px bar after the list command line, `steps(1, end)` at 1.1 s. The Splash's typing cursor is the same 2 px bar.
- **Hover decode-glitch** — a row title resolves left to right from random ASCII over 260 ms. Layout-inert by construction: the real string stays in flow as an invisible spacer and the animated copy is painted over it in a clipped, absolutely positioned box.
- **Terminal selection** — hovering a row inverts the date cell (ink on canvas, inverse in dark), like a selected line in a shell.

## Chrome utilities

Everything the old `NavBar` provided has to be re-earned by a custom Shell. Each has been missed at least once during the prototype:

- **Breadcrumb** — `lumirelle@me ~/path`, live path, faint plus strong.
- **Theme toggle** — last item in the nav row, no box, icons `i-ri-sun-line` / `dark:i-ri-moon-line`, `aria-label` follows state ("Switch to dark theme"), and it calls `toggleDark` so the site's circular reveal is reused.
- **Scroll to top** — fixed bottom-right 24 px, 32 px square, 4 px radius, hairline, mono `↑` at `ink-strong` (17.9:1 light / 18.8:1 dark), inverting on hover. Appears past 320 px and is `inert` while hidden — not merely transparent.
- **`cd ..`** — Shell element above the outline rail, `$` at full ink, rest faint, parent path with the query preserved.

## Outline rail

The TOC comes from the pipeline (`markdown-it-table-of-contents`), restyled — not re-implemented: mono 11 px, hairline on its left, **two levels only** (h4 makes it unreadable at that size), permanent at ≥1400 px, hover-revealed below. The active section is tracked with scroll arithmetic (not `IntersectionObserver`, which went stale) and marked with `>` in a reserved `1.4ch` gutter so labels never shift.

## Code blocks

Terminal windows, not `<pre>` blocks:

```
● ● ●   ts                                    copy
const str: string = 'hello'
```

8 px radius, 1 px stroke, `surface` fill, `overflow: hidden` so the bar and the horizontally scrolling `<pre>` clip to the frame. Bar: 7/12 px padding, 9 px dots at `#ff5f57` / `#febc2e` / `#28c840`, language as window title (from `code.language-*`), copy at the right reading `copy` → `copied`. Copy falls back to a selection-based `execCommand` when `navigator.clipboard` is unavailable or denied.

## Prototype hacks — do not copy

| in the prototype | where it belongs |
| --- | --- |
| `enhanceCodeBlocks()` wraps `<pre>` and injects the window bar | markdown plugin (Shiki transformer / renderer), where the language is already known |
| language label via DOM post-processing | same |
| `?variant=` branch in `App.vue`, `PrototypeSwitcher` | deleted; the Shell ships as the real `NavBar`/`App.vue` |
| inline hex values everywhere | the token layer (#4) |
| glitch and rail mounted by `refreshOutline()` on route change | Vue components inside the Shell, rendered once |

## Traps worth remembering

- **Art canvases paint over the Shell.** `ArtDots` appends a full-viewport canvas later in DOM order than the Shell; it washes the whole page and the header reads as "missing". Retiring Art (#7) is a correctness prerequisite, not just cleanup.
- **A filled animation's identity `transform` is still a containing block**, and will drag the `position: fixed` rail into the content column. Animate opacity only.
- **`mouseenter` doesn't bubble**: hover state for a nested element has to come from the row's own handler (and needs `focus`/`blur` pairing for a11y).
- **`router.push()` resolves before Vue commits.** Any work that races the DOM swap must await `nextTick`.
- **Never await an unbounded `requestAnimationFrame`** in a lifecycle that gates rendering — a backgrounded tab never fires it.

## P1 exit audit

Run against the production build at 1440 / 1024 / 390 px, in both colour schemes, with the
Effects stripped. Everything below is what the build actually renders, not what was intended.

**Kept, and now asserted by the suite.** One 820 px column with a 32 px gutter on every route;
row dividers at every breakpoint and down to 390 px with no horizontal scrolling; a 1 px focus
outline at 2 px offset, painted in both schemes; dark-mode hairlines (`#262626`) and ink levels
that stay clear of the canvas; the ledger's tabular date column, right-aligned reading time and
group labels on the rule; the Splash absent on a seeded session and under reduced motion; every
route complete with JavaScript disabled.

**Fixed during the audit** — each was a real deviation, not a matter of taste:

- Ledger rows inherited `.prose ul > li::before`, so every row carried a grey bullet and a 1.75 em
  indent. The pilot page is wrapped in `.prose`, so the ledger now clears that itself.
- `.prose a:hover` *adds* a 1 px border under a link. On hover, every ledger row and every filter
  link grew a second hairline — a hairline that was none of a Rail, a row divider or a focus
  outline. Cleared in both states.
- `SubNav` was still the fork's 3xl serif link stack, which made the pilot page read as two designs
  stacked. It is now 12 px mono, active at full ink, with lowercase labels.
- The header row wrapped to three lines on a 390 px phone. It is 11 px with tighter gaps below
  `md`, so it packs to two.

**Fixed after the audit, at the owner's direction** — the rendered page had drifted from this reference and
the reference itself had drifted from the prototype, so both were corrected:

- The list inverted the row: the date was in the margin and the reading time was right-aligned against the
  inner edge, with a hairline under every row. It now matches *Geometry* above — group label in the margin,
  date and reading time on the line under the title, rhythm instead of rules.
- The list had no masthead and no command line. Both are back, with the entry counts.
- The outline rail was the fork's hover-revealed hamburger at the viewport edge. It is now the mono rail in
  the gutter, with `cd ..` above it, the active section marked `>` in a reserved `1.4ch` gutter, and scroll
  arithmetic tracking it.
- The footer's rule and items were neither the prototype's width nor its type. They are now.

Two deliberate deviations from the prototype remain. **The list keeps a filter row** (`chinese only`, `all`,
`blog`, `notes`, `manuals`): the prototype has none, but the Shell's navigation has no other route to
`/blog`, `/notes` or `/manuals`, and dropping them would have broken navigation to satisfy a screenshot.
**The header keeps feed and source** as named icon links, which the prototype dropped by accident.

**Recorded, not fixed — these belong to P2:**

- **Code blocks are still `<pre>` blocks**, not the terminal windows described under *Code blocks*:
  no `surface` fill, no 1 px `stroke`, no 8 px radius, no window bar. Their twoslash popups still
  carry the alpha border (`--twoslash-border-color: #8884`) and a hard-coded `#191919` fill, which
  the token layer replaces when the windows are built.

- **The Post page's masthead still joins its metadata with `·`** ("First post on … · Last edit on …
  · 20min"). The middle-dot removal in P1 is about the *list*, where columns now do that work; the
  Post page's own header is P2's to set.
- **Reading time stacks under the title below 640 px.** It is already on the line beneath the title by
  design, so at 390 px only the margin column narrows (6.5 rem → 4 rem).

**Deliberate, so it is not "fixed" later:** there are no vertical Rails. The earlier Frame idea did
not survive the prototype, and the column is held by its measure and by row dividers instead.
