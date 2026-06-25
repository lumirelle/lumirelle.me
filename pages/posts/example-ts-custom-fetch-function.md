---
title: 'Example: TypeScript Custom Fetch Function'
date: 2026-04-18T22:28+08:00
update: 2026-06-25T14:57+08:00
lang: en
duration: 1min
type: note
---

[[toc]]

## Introduction

There are several requirements of a modern fetch function:

1. Type-safe;
2. Error handling;
3. Cross-environment compatibility;
4. Customizable;
5. ... Other features, such as caching, retry, etc.

I highly recommended to use [ofetch](https://github.com/unjs/ofetch) to achieve these requirements. You can use the pre-created `ofetch` function, or just create your own [custom fetch function](#custom-fetch-function) via `ofetch.create()`.

## Examples

### Custom Fetch Function

_src/utils/fetch.ts_

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

// Make the custom fetch function globally available, if you want to do so
globalThis.$fetch = $fetch
// Also do not forget to type it
declare global {
  var $fetch: typeof $fetch
}
```

### Usage

_src/repositories/user.ts_

```ts
export function userRepository() {
  return {
    async get() {
      return await $fetch('/user')
    },
    // ...
  }
}
```

_src/pages/index.tsx_

```ts
import { userRepository } from '~/repositories/user'

const userRepo = userRepository()
const user = await userRepo.get()
```
