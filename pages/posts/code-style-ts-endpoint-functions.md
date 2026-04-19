---
title: 'Code Style: TypeScript Endpoint Functions'
date: 2026-04-18T22:28+08:00
update: 2026-04-18T22:28+08:00
lang: en
duration: 1min
type: blog+note
---

[[toc]]

## Best Practice

There are several targets of the best practice:

1. It should be type-safe;
2. It should has validation;
3. It should has error handling;
4. ... Also, it need to follow the [symbol name pattern code style](code-style-symbol-name-pattern).

So, things are quite clear. We need _TypeScript_ support, next a schema library (like _Zod_), then a custom error handler (as your need) and finally ensure your symbol names are correctly matching the requires.


For example, you may need to encapsulate a request helper function:

_src/utils/request.ts_

```ts
import type { ZodType } from 'zod'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' // ...
interface RequestOptions {
  method: HttpMethod
  params: Record<string, any>
  body: Record<string, any>
  schema: ZodType
}
export function request(url: string, options: RequestOptions): any
```
