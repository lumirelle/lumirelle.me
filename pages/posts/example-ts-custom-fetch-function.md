---
title: 'Example: TypeScript Custom Fetch Function'
date: 2026-04-18T22:28+08:00
update: 2026-04-18T22:28+08:00
lang: en
duration: 1min
type: note
---

[[toc]]

There are several targets of a modern fetch function:

1. It should be type-safe;
2. It should has error handling;
3. ... Also, it need to follow the [symbol naming patterns code style](code-style-symbol-naming-patterns).

So, things are quite clear. We use [ofetch](https://github.com/unjs/ofetch) under the hood to simplify the implementation:

_src/utils/request.ts_

```ts
import { ofetch } from 'ofetch'

const BASE_URL = '/api'

export const $fetch = ofetch.create({
  // Custom `baseURL` for convenience
  baseURL: BASE_URL,

  // Custom request interceptor, for example, add auth token
  onRequest({ options }) {
    const token = localStorage.getItem('authToken')
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`)
    }
  },
  // Custom request error handling
  onRequestError({ error }) {
    console.error('Request error:', error)
  },

  // Custom response error handling
  async onResponseError({ response }) {
    if (response.status === 401 || response.status === 403) {
      console.error('User has not login!')
      window.location.href = '/login'
    }
    else {
      console.error('Response error:', response.status, response.statusText)
    }
  },
})
```
