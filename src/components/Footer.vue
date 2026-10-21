<template>
  <!--
    The Frame's closing rule: column width, one hairline, two items, mono 11 px.
    `sponsors` is the third item the prototype does not have — #4 moved the
    Sponsors list out of the navigation and into the footer, so it has to live
    somewhere.
  -->
  <footer class="copyright">
    <span class="items">
      <a
        target="_blank"
        rel="noopener"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      >CC BY-NC-SA 4.0</a>
      <RouterLink to="/sponsors-list">sponsors</RouterLink>
    </span>
    <span>2025 — present, Lumirelle</span>
  </footer>
</template>

<style scoped>
.copyright {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;

  padding: 1.5rem 0;

  border-top: 1px solid var(--color-stroke);

  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-ink-faint);
}

.items {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
}

.copyright a,
.copyright a:hover {
  border-bottom: none;
  text-decoration: none;
  color: inherit;
}

.copyright a:hover {
  color: var(--color-ink-strong);
}

@media print {
  .copyright {
    display: none;
  }
}
</style>
