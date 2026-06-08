<template>
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>lumirelle.me</title>
    <mask
      id="mask0_lm"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="36"
      width="100"
      height="44"
    >
      <path
        d="M10 64C12 66 14 70 17 74C20 74 24 70 30 62C34 54 40 46 43 44C46 42 40 40 34 42C32 44 30 50 33 58C36 66 40 74 44 76C46 76 50 58 54 58C54 58 58 58 62 76C62 76 66 58 70 58C70 58 74 58 78 76C84 76 90 75 94 74C96 74 98 76 96 76"
        stroke="white"
        stroke-width="5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </mask>
    <g mask="url(#mask0_lm)">
      <path
        class="path1"
        d="M10 64C12 66 14 70 17 74C20 74 24 70 30 62C34 54 40 46 43 44C46 42 40 40 34 42C32 44 30 50 33 58C36 66 40 74 44 76C46 76 50 58 54 58C54 58 58 58 62 76C62 76 66 58 70 58C70 58 74 58 78 76C84 76 90 75 94 74C96 74 98 76 96 76"
        stroke="black"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion) {
  .path1 {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}
@media print {
  .path1 {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}
@keyframes grow {
  0% {
    stroke-dashoffset: 1px;
    stroke-dasharray: 0 208px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
    stroke-dasharray: 208px 0;
  }
  85% {
    stroke-dasharray: 208px 0;
  }
  95%,
  to {
    stroke-dasharray: 0 208px;
  }
}
.path1 {
  stroke-dashoffset: 1px;
  stroke-dasharray: 208px 0;
  animation: grow 10s ease forwards infinite;
  transform-origin: center;
  stroke: #303030;
  animation-delay: 0s;
}
.dark .path1 {
  stroke: #fdfdfd;
}
</style>
