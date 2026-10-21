# Testing

There is one test seam: a browser suite against a production build. The redesign is entirely a
question of what a visitor can observe, so a unit seam would test nothing that matters and would
be a second seam for no gain.

```sh
mise run test
```

That single command prepares the build, builds the site, starts `vite preview` over `dist/`, runs
`test/**/*.spec.ts` against it, and fails loudly if any of those steps fails. A fresh machine needs
one dependency install (`mise install`, which also runs `nub install`) and nothing else.

## Why it builds from the checked-in tree

`mise run build` clones an external asset repository into `temp/` and reads artefacts that
`.gitignore` excludes. The suite must not depend on that, so `scripts/prepare-test-build.ts` stubs
any missing input with an empty but structurally valid value before running the real generator. A
machine that already cloned `temp/` is left untouched.

## Why it runs against a production build

Dev mode sets `no-sliding` on `<html>`, which disables the entrance cascade. Any assertion about
entry or route motion made against a dev server would be vacuous.

## Writing assertions

Only assert externally observable behaviour: accessible names, visible text, computed styles, and
what the built artefacts contain. Never class names, component internals, or pixel geometry.

- `test/shell.spec.ts` — the suite. Add new assertions here rather than creating a second seam.
  Every route in the build is walked automatically, so a new page is covered the moment it exists.
- `test/support/artifacts.ts` — reads `dist/` to discover routes and to obtain a distinctive run of
  text from each prerendered page. Build-level assertions (artefact contents, absence of removed
  libraries) belong here too, because they are about the build rather than about a page.

Third-party requests are answered locally by the suite's `page.route` handler, so a network hiccup
can never fail a page-load assertion and only this origin can produce a real 404.

`mise run check` runs the linters and the type checker. `vue-tsc` needs the generated
`auto-imports.d.ts` and `components.d.ts`, which only exist after a build — so build (or run
`mise run test`) before checking on a fresh checkout.
