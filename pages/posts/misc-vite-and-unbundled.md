---
title: Vite and Unbundled
date: 2025-12-03T11:56+08:00
update: 2025-12-03T11:56+08:00
lang: en
duration: 2min
---

[[toc]]

As Rolldown Vite is comming soon, I saw a introduction about [Vite's future plans](https://vite.dev/guide/rolldown#future-plans): Vite will switch to **a full bundled mode** in the future.

You may think that: Oh, Vite is known for its unbundled dev server approach, which is a main reason for Vite's speed and popularity when it was first introduced. Why would they switch back to a bundled mode?

I'm really agree with the reasons the Vite team gives:

1. **Development/Production inconsistency**:

   > The unbundled JavaScript served in development versus the bundled production build creates different runtime behaviors. This can lead to issues that only manifest in production, making debugging more difficult.

2. **Performance degradation during development**:

   > The unbundled approach results in each module being fetched separately, which creates a large number of network requests. While this has no impact in production, it causes significant overhead during dev server startup and when refreshing the page in development. The impact is especially noticeable in large applications where hundreds or even thousands of separate requests must be processed. These bottlenecks become even more severe when developers use network proxy, resulting in slower refresh times and degraded developer experience.

   I was deeply touched by this reason. When I develop a large-scale Nuxt 4 application, every time the dev server starts/restarts, it should takes a long time, and causes request waterfall. Even cause a bad developer experience: Windows resolve localhost to IPv6 address first, then fallback to IPv4, so every request should take longer, plus with the request waterfall, the initial load time can up to 10 minutes. This is really terrible.

In short, unbundled mode is more likely a **workaround** to improve development performance before, and it has two main problems: inconsistency between development and production, and performance degradation during development.

For now, **Rust** and **Rolldown** will help Vite get more performance improvements in bundled mode. So, I think it's really a good time to say goodbye to unbundled! 🖐️

Let's look forward to the future of Vite! 🚀
