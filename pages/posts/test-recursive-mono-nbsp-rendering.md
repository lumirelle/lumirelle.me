---
title: Recursive Variable font (Mono) Non-Breaking Space Rendering Test
date: 2025-12-30T10:31+08:00
update: 2025-12-30T22:02+08:00
lang: en
duration: 2min
---

[[toc]]

CSS used:

```css
@font-face {
  font-family: 'Recursive';
  src: url('/fonts/Recursive_VF_1.085.woff2');
  font-weight: 300 1000;
  font-style: oblique 0deg 14deg;
}

/* ... */

[font~='60%em'] {
  font-family: 'Recursive', 'Maple Mono CN';
  font-variation-settings:
    'MONO' 1,
    'CASL' 0,
    'wght' 400,
    'slnt' 0,
    'CRSV' 0.5;
}
```

Preview:

<div font="60%em" text="lg">
  <div><span>" " & Max: This is normal space 这是一个普通空格</span></div>
  <div><span>"&nbsp;" & Max: This is non-breaking space 这是一个不间断空格</span></div>
</div>
