# lumirelle.me

Lumirelle's personal site: Markdown Posts, Manuals and notes published as a static site.

## Language

**Reading time**:
The estimated time a reader needs for the body of a Post, shown beside its date and in Post lists. It is derived from the body and never authored.
_Avoid_: Read time, reading duration

**Shell**:
The chrome that outlives a route change: navigation, footer and the Frame.
_Avoid_: Layout, chrome, wrapper, template

**Frame**:
The hairline structure that separates sections and holds the content column's rhythm. It encodes structure; it never decorates. It does not draw vertical rules around the column — the measure does that job.
_Avoid_: Grid, borders, dividers, container

**Rail**:
The vertical hairline in the left gutter that carries the outline, with `cd ..` above it. It exists only where the gutter is wide enough to hold it, and it never touches the content column.
_Avoid_: Sidebar, gutter, column line

**Splash**:
The opening sequence shown once per session before the Shell reveals itself.
_Avoid_: Loading screen, preloader, intro

**Effect**:
Any motion or visual flourish layered on top of content. An Effect may never be load-bearing: the site is complete and correct with every Effect removed.
_Avoid_: Animation, art, transition (when the thing is not a route change)

**Art**:
A retired concept: a per-page WebGL canvas background that drew dots or plum shapes behind content. Kept in the vocabulary so it is never reused for new Effects.
_Avoid_: using Art for anything that exists after ADR-0001
