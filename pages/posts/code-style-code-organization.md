---
title: 'Code Style: Code Organization'
date: 2025-09-24T16:36+08:00
update: 2026-09-01T00:51+08:00
lang: en
duration: 15min
type: note
---

[[toc]]

<style>
.prose table thead, .prose table tbody {
  display: block;
}
.prose table tr {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 2fr;
}
.prose table th, .prose table td {
  overflow-x: auto;
}
</style>


## Why Good Code Organization Is Necessary?

The only reason is **making the code readable and maintainable**.

As a developer, the time you spend with code is much more than the time you spend with your girl! To save this time to stay with your family more often, we need code has good readability and maintainability.

## How to Organize Code?

This is a long topic. For different programming languages with different grammar, there are even different rules and best practices. But anyway, this article does not try to cover all situations, just pick some general basic principles and best practices. Based on these principles and best practices, you can easily extend to other specific situations.

### Per File, Per Focus

Human brain can only hold a limited amount of information at the same time, if we have more than one focus in a file, it may break our focus and do harm to our judgement.

All of below examples work, but the good example has much better readability and maintainability.

<table><tbody>

<tr><td valign="top">

A good example:

_src/constants.ts_

```ts
export const UserStatus = {
  Inactive: 0,
  Active: 1,
  Banned: 2,
} as const

export const UserStatusLabels = {
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Active]: 'Active',
  [UserStatus.Banned]: 'Banned',
} as const

export const UserStatusOptions = [
  { label: UserStatusLabels[UserStatus.Inactive], value: UserStatus.Inactive },
  { label: UserStatusLabels[UserStatus.Active], value: UserStatus.Active },
  { label: UserStatusLabels[UserStatus.Banned], value: UserStatus.Banned },
] as const
```

_src/form.ts_

```ts
import {
  UserStatus,
  UserStatusOptions
} from './constants'

export const FORM_FIELDS = [
  { name: 'username', defaultValue: 'guest' },
  { name: 'password' },
  { name: 'status', defaultValue: UserStatus.Inactive, options: UserStatusOptions, },
  // When `options` is a function,
  // we will call it when we create fields,
  // and cache the options in the field instance.
  { name: 'group', options: listUserGroups },
] as const

function listUserGroups() {
  // ...
}
```

_src/table.ts_

```ts
import { UserStatusLabels } from './constants'

const TABLE_COLUMNS = [
  { label: 'Name', props: 'name' },
  { label: 'Age', props: 'age' },
  { label: 'Status', props: 'status', format: values => UserStatusLabels[values.status] }
] as const
```

</td><td valign="top">

A bad example:

_src/all-in-one.ts_

```ts
export const UserStatus = {
  Inactive: 0,
  Active: 1,
  Banned: 2,
} as const

export const UserStatusLabels = {
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Active]: 'Active',
  [UserStatus.Banned]: 'Banned',
} as const

export const UserStatusOptions = [
  { label: UserStatusLabels[UserStatus.Inactive], value: UserStatus.Inactive },
  { label: UserStatusLabels[UserStatus.Active], value: UserStatus.Active },
  { label: UserStatusLabels[UserStatus.Banned], value: UserStatus.Banned },
] as const

export const FORM_FIELDS = [
  { name: 'username', defaultValue: 'guest' },
  { name: 'password' },
  { name: 'status', defaultValue: UserStatus.Inactive, options: UserStatusOptions, },
  { name: 'group', options: listUserGroups },
] as const

function listUserGroups() {
  // ...
}

const TABLE_COLUMNS = [
  { label: 'Name', props: 'name' },
  { label: 'Age', props: 'age' },
  { label: 'Status', props: 'status', format: values => UserStatusLabels[values.status] }
] as const
```

</td></tr>

</tbody></table>

There is a general order of thought for identifying the different focuses:

1. Module. Code for launch a Playwright instance and code fore orchestrate automation tasks are obviously not part of the same module.
2. Content nature. Global constants code and test cases code are obviously not the same.

### Leave Structure in Focus, Hide Implementation in Details

In order to let the reader understand our code easily, we'd better leave only the structure in focus, and hide the implementation in details.

<table><tbody>

<tr><td valign="top">

_src/good.ts_

```ts
export function main() {
  const context = createContext()

  runHook(context, 'beforeInit')
  init(context)
  runHook(context, 'afterInit')

  runHook(context, 'beforeRun')
  run(context)
  runHook(context, 'afterRun')
}

function createContext() {
  return {
    foo: 'bar',
  }
}

function runHook(context, hookName) {
  globalThis.__hooks?.[hookName]?.(context)
}

function init(context) {
  globalThis.__bar = 'baz'
  // ...
  globalThis.__initialized = true
}

function run(context) {
  const readline = require('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let shouldExit = false
  while (!shouldExit) {
    rl.question('> ', (answer) => {
      if (answer === 'exit') {
        rl.close()
        shouldExit = true
        return
      }
      console.log('run', context, answer)
      rl.close()
    })
  }
}
```

</td><td valign="top">

_src/bad.ts_

```ts
export function main() {
  const context = {
    foo: 'bar',
  }

  globalThis.__hooks?.beforeInit?.(context)
  globalThis.__bar = 'baz'
  // ...
  globalThis.__initialized = true
  globalThis.__hooks?.afterInit?.(context)

  globalThis.__hooks?.beforeRun?.(context)
  const readline = require('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let shouldExit = false
  while (!shouldExit) {
    rl.question('> ', (answer) => {
      if (answer === 'exit') {
        rl.close()
        shouldExit = true
        return
      }
      console.log('run', context, answer)
      rl.close()
    })
  }
  globalThis.__hooks?.afterRun?.(context)
}
```

</td></tr>

</tbody></table>

### Focus Above, Details Below

Put the focus on the top, so that we can quickly understand the main logic of the code. If we are interested in the details, we can read from top to bottom, which fit with human reading habits well.

All of below examples work, but the good example has much better readability and maintainability.

<table><tbody>

<tr><td valign="top">

_src/good.ts_

```ts
export function main() {
  const context = createContext()

  runHook(context, 'beforeInit')
  init(context)
  runHook(context, 'afterInit')

  runHook(context, 'beforeRun')
  run(context)
  runHook(context, 'afterRun')
}

function createContext() {
  return {
    foo: 'bar',
  }
}

function runHook(context, hookName) {
  globalThis.__hooks?.[hookName]?.(context)
}

function init(context) {
  globalThis.__bar = 'baz'
  // ...
  globalThis.__initialized = true
}

function run(context) {
  const readline = require('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let shouldExit = false
  while (!shouldExit) {
    rl.question('> ', (answer) => {
      if (answer === 'exit') {
        rl.close()
        shouldExit = true
        return
      }
      console.log('run', context, answer)
      rl.close()
    })
  }
}
```

</td><td valign="top">

_src/bad.ts_

```ts
function run(context) {
  const readline = require('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let shouldExit = false
  while (!shouldExit) {
    rl.question('> ', (answer) => {
      if (answer === 'exit') {
        rl.close()
        shouldExit = true
        return
      }
      console.log('run', context, answer)
      rl.close()
    })
  }
}

function init(context) {
  globalThis.__bar = 'baz'
  // ...
  globalThis.__initialized = true
}

export function main() {
  const context = createContext()

  runHook(context, 'beforeInit')
  init(context)
  runHook(context, 'afterInit')

  runHook(context, 'beforeRun')
  run(context)
  runHook(context, 'afterRun')
}

function runHook(context, hookName) {
  globalThis.__hooks?.[hookName]?.(context)
}

function createContext() {
  return {
    foo: 'bar',
  }
}
```

</td></tr>

</tbody></table>

### Special First, General Last

There is a common classic pattern you may already know: Guard clause.

The key point of guard clause is: Achieve early return via conditional inversion.

```ts
function buyTickets(id: string, amount: number, options: any): void {
  // TODO(Lumirelle): Should we use function instead of objects for better tree-shaking in any cases?
  const ticketRepo = new TicketRepository()

  // Early return with an error via inversing condition `ticketRepo.has(id)` to `!ticketRepo.has(id)`
  if (!ticketRepo.has(id)) {
    throw new Error(`The ticket with ID "${id}" does not exist!`)
  }

  const userRepo = new UserRepo()
  const userInfo = userRepo.getInfo()

  if (userInfo.balance < amount) {
    throw new Error(`Your current balance does not enough to buy this ticket!
You still need to recharge by ${userInfo.balance - amount}$.`)
  }

  // ...

  ticketRepo.buy(id)
}
```

It hoist all of the special logics in the start, and leave the last and most general logic at the end.

Base on those structure, you will never lose yourself within the charming control flows & data flows.

## They Are Not Panaceas

Of course, code organization is not a panacea, excessive code organization can cause additional cost for our mental.

Before we do these, we must pay attention to the **motivation and quality**.

### Do Not Separate Related Codes

Heavily dependent codes should not be separated to different places, even if they look like two very different focus , otherwise it will lead to a mess of data flow and dependencies, which makes the code harder to understand and maintain.

> [!Note]
>
> Regarding data flow direction, strictly adhering to unidirectional data flow is the best practice.

<table><tbody>

<tr><td valign="top">

Bad Example:

_src/composables/use-form-component.ts_

```ts
export function useFormComponent(
  config: FormConfig,
  selected?: any
) {
  const formData = reactive({
    // ...
  })

  // ...

  // This logic based on `selected`,
  // this cause `useFormComponent`
  // should be called after
  // `useSelectorComponent` is called.
  watch(selected, (newSelected) => {
    // Update some fields of formData
    // when selected changes
    // ...
  })

  return {
    formData,
    formConfig: config,
  }
}
```

_src/composables/use-selector-component.ts_

```ts
export function useSelectorComponent(
  formData: Record<string, any>,
) {
  // This logic based on `formData`,
  // this cause `useSelectorComponent`
  // should be called after
  // `useFormComponent` is called.
  const selected = computed(() => {
    // Compute selected based on
    // other fields of formData
    // ...
  })

  return {
    selected,
  }
}
```

_src/views/bad-page1.vue_

```vue
<script setup lang="ts">
// imports ...

// [!code focus:19]
const {
  formData, // <-
  formConfig,
} = useFormComponent({
  config: {
    columns: [
      { label: 'Name', props: 'name' },
      { label: 'Age', props: 'age' },
      // ...
    ],
  },
  selected, // <- Used before defined...
})

const {
  selected, // <-
} = useSelectorComponent({
  formData, // <-
})
</script>

<template>
  <div>
    // [!code focus:2]
    <SelectorComponent v-model="selected" />
    <FormComponent v-model="formData" :config="formConfig" />
  </div>
</template>
```


<details>

<summary><strong>src/views/bad-page2.vue</strong></summary>

```vue
<script setup lang="ts">
// imports ...

// [!code focus:19]
const {
  selected, // <-
} = useSelectorComponent({
  formData, // <- Used before defined...
})

const {
  formData, // <-
  formConfig,
} = useFormComponent({
  config: {
    columns: [
      { label: 'Name', props: 'name' },
      { label: 'Age', props: 'age' },
      // ...
    ],
  },
  selected, // <-
})
</script>

<template>
  <div>
    // [!code focus:2]
    <SelectorComponent v-model="selected" />
    <FormComponent v-model="formData" :config="formConfig" />
  </div>
</template>
```

</details>

</td><td valign="top">

Good Example:

_src/composables/use-form-and-selector-component.ts_

```ts
export function useFormAndSelectorComponent(
  config: FormConfig,
) {
  const formData = reactive({
    // ...
  })

  const selected = computed(() => {
    // Compute selected based on
    // other fields of formData
    // ...
  })

  watch(selected, (newSelected) => {
    // Update some fields of formData
    // when selected changes
    // ...
  })

  return {
    formData,
    formConfig: config,
    selected,
  }
}
```

_src/views/good-page.vue_

```vue
<script setup lang="ts">
// imports ...

// [!code focus:17]
// Combined them together...
const {
  formData,
  formConfig,
  selected
} = useFormComponent({
  config: {
    columns: [
      { label: 'Name', props: 'name' },
      { label: 'Age', props: 'age' },
      // ...
    ],
    // Use `enableSelector` to control
    // whether to enable the selector feature.
    enableSelector: true,
  },
})
</script>

<template>
  <div>
    // [!code focus:3]
    <!-- Combined -->
    <!-- internal `v-if` based on `enableSelector` -->
    <FormComponent v-model="formData" :config="formConfig" />
  </div>
</template>
```

</td></tr>

</tbody></table>

### Do Not Extract Structure from Simple/Specific Implementation

Some simple implementation codes are no need to be extracted, excessive abstraction is just to show off skills, makes mental cost (constant context switching) and has no practical application.

<table><tbody>

<tr><td valign="top">

_src/good.ts_

```ts
export function main() {
  if (someCondition === true) {
    doSomething()
  }
  else if (someCondition === false) {
    doSomethingElse()
  }
  else {
    doDefault()
  }
}
```

</td><td valign="top">

_src/bad.ts_ 😅

```ts
export function main() {
  if (isStrictTrue(someCondition)) {
    doSomething()
  }
  else if (isStrictFalse(someCondition)) {
    doSomethingElse()
  }
  else {
    doDefault()
  }
}
function isStrictTrue(value: unknown): value is true {
  return value === true
}
function isStrictFalse(value: unknown): value is false {
  return value === false
}
```

</td></tr>

</tbody></table>

The same for specific implementation who is not reusable, extract them only leads to negative effects:

<table><tbody>

<tr><td valign="top">

_src/good.ts_

```ts
export interface ContactFormData {
  name: string | null
  email: string | null
  message: string | null
  /** Date in ms. */
  date: number | null
}
export function useContactForm() {
  const formData = ref<ContactFormData>({
    name: null,
    email: null,
    message: null,
    date: null,
  })

  function submit() {
    const contactRepo = new ContactRepository()
    const params = {
      ...formData.value
    }
    // Convert date to seconds.
    params.date = params.date / 1000
    contactRepo.submit(params)
  }

  return {
    formData
  }
}
```

</td><td valign="top">

_src/bad.ts_ 😅

```ts
export interface ContactFormData {
  name: string | null
  email: string | null
  message: string | null
  /** Date in ms. */
  date: number | null
}
export function useContactForm() {
  const formData = ref<ContactFormData>({
    name: null,
    email: null,
    message: null,
    date: null,
  })

  function submit() {
    const contactRepo = new ContactRepository()
    const params = buildContactFormParams(formData)
    contactRepo.submit(params)
  }

  return {
    formData
  }
}
/**
 * After using AI for so long, I've noticed that
 * AI really enjoys extract these specific logics
 * into a large number of non-reusable util functions.
 */
export function buildContactFormParams(formData: Ref<ContactFormData>): ContactFormData {
  const params = {
    ...formData.value
  }
  // Convert date to seconds.
  params.date = params.date / 1000
  return params
}
```

</td></tr>

</tbody></table>

### Do Extract But Not Separate for Unreusable but Heavy Codes

If a code is heavy and reusable, we can extract it to a separate file, just like [the `useFormAndSelectorComponent` example above](#do-not-separate-related-codes). But if a code is unreusable, for example, it's a specific page's logic, we can still extract them to a composed big function in the same file.

<table><tbody>

<tr><td valign="top">

Bad Example (Not Extracted):

_src/views/bad-page.vue_

```vue
<script setup lang="ts">
// [!code focus:55]
// imports ...

// Too many top-level codes,
// and we cannot see the
// structure of the page clearly.

interface PageModule {
  id: string
  name: string
  payload: Record<string, any>
}

const pageModules = useFetch(
  '/api/page-modules',
  { key: 'page-modules' }
)

function parseHead(modules: PageModule[]) {
  let title = ''
  let description = ''
  let keywords: string[] = []
  // ...
  return {
    title,
    description,
    keywords,
  }
}
const head = computed(
  () => parseHead(pageModules.value)
)
useHead(head)

const COMPONENT_MAP = {
  'comp-1': () => {
    return import('~/components/Comp1.vue')
  },
  'comp-2': () => {
    return import('~/components/Comp2.vue')
  },
  // ...
}
const pageComponents = computed(() => {
  return pageModules.value.map((module) => {
    const component = COMPONENT_MAP[module.name]
    if (!component) {
      throw new Error(`Component ${module.name} not found`)
    }
    return {
      id: module.id,
      component,
      payload: module.payload,
    }
  })
})
</script>

<template>
  // [!code focus:11]
  <div>
    <template
      v-for="module in pageComponents"
      :key="module.id"
    >
      <component
        :is="module.component"
        v-bind="module.payload"
      />
    </template>
  </div>
</template>
```

</td><td valign="top">

Bad Example (Extracted to a separate file but unreusable):

_src/composables/useTemplatePage.ts_

```ts
// imports ...

// A one time use composable...

interface PageModule {
  id: string
  name: string
  payload: Record<string, any>
}

export function useTemplatePage() {
  const pageModules = useFetch(
    '/api/page-modules',
    { key: 'page-modules' }
  )

  function parseHead(modules: PageModule[]) {
    let title = ''
    let description = ''
    let keywords: string[] = []
    // ...
    return {
      title,
      description,
      keywords,
    }
  }
  const head = computed(
    () => parseHead(pageModules.value)
  )
  useHead(head)

  const COMPONENT_MAP = {
    'comp-1': () => {
      return import('~/components/Comp1.vue')
    },
    'comp-2': () => {
      return import('~/components/Comp2.vue')
    },
  // ...
  }
  const pageComponents = computed(() => {
    return pageModules.value.map((module) => {
      const component = COMPONENT_MAP[module.name]
      if (!component) {
        throw new Error(`Component ${module.name} not found`)
      }
      return {
        id: module.id,
        component,
        payload: module.payload,
      }
    })
  })

  return {
    pageComponents,
  }
}
```

_src/views/bad-page.vue_

```vue
<script setup lang="ts">
// [!code focus:1]
const { pageComponents } = useTemplatePage()
</script>

<template>
  // [!code focus:5]
  <div>
    <template v-for="module in pageComponents" :key="module.id">
      <component :is="module.component" v-bind="module.payload" />
    </template>
  </div>
</template>
```

</td></tr>

</tbody></table>

The only right code looks like:

_src/views/good-page.vue_

```vue
<script setup lang="ts">
// [!code focus:11]
// imports ...

interface PageModule {
  id: string
  name: string
  payload: Record<string, any>
}

const { pageComponents } = useTemplatePage()

// --- Main logic above, details below ! ---

function useTemplatePage() {
  const pageModules = useFetch(
    '/api/page-modules',
    { key: 'page-modules' }
  )

  function parseHead(modules: PageModule[]) {
    let title = ''
    let description = ''
    let keywords: string[] = []
    // ...
    return {
      title,
      description,
      keywords,
    }
  }
  const head = computed(
    () => parseHead(pageModules.value)
  )
  useHead(head)

  const COMPONENT_MAP = {
    'comp-1': () => {
      return import('~/components/Comp1.vue')
    },
    'comp-2': () => {
      return import('~/components/Comp2.vue')
    },
  // ...
  }
  const pageComponents = computed(() => {
    return pageModules.value.map((module) => {
      const component = COMPONENT_MAP[module.name]
      if (!component) {
        throw new Error(`Component ${module.name} not found`)
      }
      return {
        id: module.id,
        component,
        payload: module.payload,
      }
    })
  })

  return {
    pageComponents,
  }
}
</script>

<template>
  // [!code focus:5]
  <div>
    <template v-for="module in pageComponents" :key="module.id">
      <component :is="module.component" v-bind="module.payload" />
    </template>
  </div>
</template>
```

For plain JavaScript / TypeScript, we can still achieve this by using a big composed function with nested functions:

_src/utils/complex-logic.ts_

```ts
// [!code focus:7]
export function complexLogic() {
  const context = createContext()
  setup(context)
  process(context)
  teardown(context)

  // --- Main logic above, details below ! ---

  function createContext() {
    // ...
  }

  function setup(ctx) {
    // ...
  }

  function process(ctx) {
    // ...
  }

  function teardown(ctx) {
    // ...
  }
// [!code focus:1]
}
```

_src/index.ts_

```ts
import { complexLogic } from './utils/complex-logic'

// ...

complexLogic()

// ...
```

### If Your Team Only Care About Deadlines But Not Code Quality...

As the saying goes, when in Rome, do as the Romans do; one must learn to be tactful in life.

If your team only care about deadlines but not code quality, just follow them:

> "Make it work, make it right, make it fast." -- Kent Beck

You just need ato make our code work, fit the business requirements, without bugs. That's all. Then, do organization only when you be happy to.

Remember, you are the angel in these dirty world fulled with AI generated contents. Some of these contents are black boxes, no one knows how they work, because those AI's users do not care about can these contents work efficiently or not, they do not care about the future maintenance, and they even never review the content before applying: "Since we're using AI anyway, it won't complain about the bloat and maintainability of the code. If there's a bug, the tester will finder it; if AI cannot fix it, then let the developer fix it, so what if it's bloat and maintainable?"

I mean, in this shit-like world, the best practice is to make up for the situation only when it's getting troublesome. 😉

> ~~“亡羊补牢，为时未晚。”~~
>
> ~~"It's never too late to mend the fence after the sheep are lost."~~
>
> “既未亡羊，何必补牢？”
>
> "Why mend the fence when the sheep have not been lost?"

## Examples

### Example: Per File, Per Focus

A simple example, one day I found the `vite.config.ts` file in my project is getting too large and complex, the root cause is that there are too many plugins with heavy logic. The solution is quite simple, just move each plugin (of course, only the plugins with additional logic are worth to be moved) into a separate file.

You can see that commit details [here](https://github.com/lumirelle/lumirelle.me/commit/7c1594db4c5cd5bd422659f1ea820da75e3f893c#diff-6a3b01ba97829c9566ef2d8dc466ffcffb4bdac08706d3d6319e42e0aa6890dd).

## References

### Antfu's Code Style

[Antfu's code style](https://github.com/antfu/skills/blob/main/skills/antfu/SKILL.md) is a good reference for writing clean and maintainable code.
