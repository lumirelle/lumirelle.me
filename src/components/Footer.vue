<template>
  <footer
    class="prose slide-enter copyright m-auto mb-6 mt-10 border-t border-stroke flex animate-delay-1200!"
  >
    <span class="text-sm op50"><a
      target="_blank"
      href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      style="color: inherit"
    >CC BY-NC-SA 4.0</a>
      2025-PRESENT © Lumirelle</span>
    <RouterLink to="/sponsors-list" class="text-sm ml-4 op50">
      Sponsors
    </RouterLink>
    <div class="flex-auto" />
  </footer>
</template>

<style>
.no-copyright ~ .copyright {
  display: none;
}
</style>
