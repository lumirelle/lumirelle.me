---
title: Projects - Lumirelle
display: Projects
description: List of projects that I am proud of
wrapperClass: 'text-center'
art: dots
projects:
  Current Focus:
    - name: 'Impurities'
      link: 'https://github.com/lumirelle/impurities'
      desc: 'Inspect the intermediate state of Vite bundle and pipeline'
      icon: 'i-carbon-delivery-parcel'

---

<!-- @layout-full-width -->
<ListProjects :projects="frontmatter.projects" />
