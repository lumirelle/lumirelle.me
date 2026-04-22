---
title: 'Code Style: Code Organization'
date: 2025-09-24T16:36+08:00
update: 2026-04-22T22:43+08:00
lang: en
duration: 9min
type: blog+note
---

[[toc]]

## Why Good Code Organization Is Necessary?

The only reason is **making the code readable and maintainable**.

As a developer, the time you spend with code is much more than the time you spend with your girl! To save this time to stay with your family more often, we need code has good readability and maintainability.

## How to Organize Code?

This is a long topic. For different programming languages with different grammar, there are even different rules and best practices. But anyway, this article does not try to cover all situations, just pick some general basic principles and best practices. Based on these principles and best practices, you can easily extend to other specific situations.

### Per File, Per Focus

Human brain can only hold a limited amount of information at the same time, if we have more than one focus in a file, it may break our focus and do harm to our judgement.

All of below examples work, but the good example has much better readability and maintainability.

<table><tbody>

<tr><th valign="top">

A good example:

_src/constants.ts_

```ts
export const UserStatus = {
  Inactive: 0,
  Active: 1,
  Banned: 2,
}
export const UserStatusLabels = {
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Active]: 'Active',
  [UserStatus.Banned]: 'Banned',
}
// `Object.values()` has better
// performance than `Object.entries()`
export const UserStatusOptions = Object
  .values(UserStatus)
  .map(status => ({
    label: UserStatusLabels[status],
    value: status,
  }))
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
  {
    name: 'status',
    defaultValue: UserStatus.Inactive,
    options: UserStatusOptions,
  },
  // When `options` is a function,
  // we will call it when we create fields,
  // and cache the options in the field instance.
  { name: 'group', options: listUserGroups },
]

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
  {
    label: 'Status',
    props: 'status',
    format: values => (
      UserStatusLabels[values.status]
    )
  }
]
```

</th><th valign="top">

A bad example:

_src/all-in-one.ts_

```ts
export const UserStatus = {
  Inactive: 0,
  Active: 1,
  Banned: 2,
}

export const UserStatusLabels = {
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Active]: 'Active',
  [UserStatus.Banned]: 'Banned',
}

export const UserStatusOptions = Object
  .values(UserStatus)
  .map(status => ({
    label: UserStatusLabels[status],
    value: status,
  }))

export const FORM_FIELDS = [
  { name: 'username', defaultValue: 'guest' },
  { name: 'password' },
  {
    name: 'status',
    defaultValue: UserStatus.Inactive,
    options: UserStatusOptions,
  },
  { name: 'group', options: listUserGroups },
]

function listUserGroups() {
  // ...
}

const TABLE_COLUMNS = [
  { label: 'Name', props: 'name' },
  { label: 'Age', props: 'age' },
  {
    label: 'Status',
    props: 'status',
    format: values => (
      UserStatusLabels[values.status]
    )
  }
]
```

</th></tr>

</tbody></table>


### Leave Structure in Focus, Hide Implementation in Details

In order to let the reader understand our code easily, we'd better leave only the structure in focus, and hide the implementation in details.

<table><tbody>

<tr><th valign="top">

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

</th><th valign="top">

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

</th></tr>

</tbody></table>


### Focus Above, Details Below

Put the focus on the top, so that we can quickly understand the main logic of the code. If we are interested in the details, we can read from top to bottom, which fit with human reading habits well.

All of below examples work, but the good example has much better readability and maintainability.

<table><tbody>

<tr><th valign="top">

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

</th><th valign="top">

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

</th></tr>

</tbody></table>

## They Are Not Panaceas

Of course, code organization is not a panacea, excessive code organization can cause additional cost for our mental.

Before we do these, we must pay attention to the **motivation and quality**.

### Do Not Separate Child from Parent

Heavily dependent codes should not be separated to different files, otherwise it will lead to a mess of data flow and dependencies, which makes the code harder to understand and maintain.

> [!Note]
>
> Regarding data flow direction, strictly adhering to unidirectional data flow is the best practice.

<table><tbody>

<tr><th valign="top">

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
    // [!code focus:5]
    <SelectorComponent v-model="selected" />
    <FormComponent
      v-model="formData"
      :config="formConfig"
    />
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
    // [!code focus:5]
    <SelectorComponent v-model="selected" />
    <FormComponent
      v-model="formData"
      :config="formConfig"
    />
  </div>
</template>
```

</details>

</th><th valign="top">

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
    // [!code focus:6]
    <!-- Combined -->
    <!-- internal `v-if` based on `enableSelector` -->
    <FormComponent
      v-model="formData"
      :config="formConfig"
    />
  </div>
</template>
```

</th></tr>

</tbody></table>

### Do Not Extract Structure from Simple Implementation

Some simple implementation codes are no need to be extracted, excessive abstraction is just to show off skills, makes mental cost and has no practical application.

<table><tbody>

<tr><th valign="top">

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

</th><th valign="top">

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

</th></tr>

</tbody></table>

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

A simple example, one day I found the `vite.config.ts` file in my project is getting too large and complex, the root cause is that there are too many plugins with heavy logic. The solution is quite simple, just move each plugin (of course, only the plugins with additional logic are worth to be moved) into a separate file.

You can see that commit details [here](https://github.com/lumirelle/lumirelle.me/commit/7c1594db4c5cd5bd422659f1ea820da75e3f893c#diff-6a3b01ba97829c9566ef2d8dc466ffcffb4bdac08706d3d6319e42e0aa6890dd).

## Antfu's Code Style

[Antfu's code style](https://github.com/antfu/skills/blob/main/skills/antfu/SKILL.md) is a good reference for writing clean and maintainable code.
