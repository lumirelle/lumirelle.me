---
title: 'Code Style: Code Organization'
date: 2025-09-24T16:36+08:00
update: 2026-09-20T21:21+08:00
lang: en
duration: 20min
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


## Why Is Good Code Organization Necessary?

The only reason is to **make the code readable and maintainable**.

As a developer, you spend far more time with code than with your girlfriend! So that you can spend more of that time with your family, we need code to be readable and maintainable.

## How to Organize Code?

This is a long topic. Different programming languages have different grammars, and therefore different rules and best practices. But anyway, this article does not try to cover every situation; it just picks some general basic principles and best practices. Based on these, you can easily extend them to other specific situations.

### One Module, One Main Object

The human brain can only hold a limited amount of information at a time. If we have more than one **main object** in a **module**, it may break our concentration and harm our judgement.

#### What Is a Module and What Is Its Main Object?

A **module** here is an independent collection of functionality that can be built on top of other external modules or provide functionality for other modules. It's module **on code organization level**.

The **main object** of a module is the entity it is about: a noun you can point at (package, currency, partner), not an action you perform (purchase, display).

All parts of a module should have a **unified namespace**. The form of the namespace expression is not fixed, but it must be reflected in the **file path**: it can be a dedicated directory, or a single name reused across directories, as in the "partner" module of a Vue website project, which is related to the partners of this website:

```txt
-- app/
   |-- constants/
   |   |-- partner.ts
   |-- components/
   |   |-- partner/
   |       |-- Banner.vue
   |       |-- Cta.vue
   |       |-- ...
   |-- composables/
   |   |-- usePartners.ts
   |-- pages/
   |   |-- partner.vue
   |-- utils/
   |   |-- partner.ts
   |-- ...
```

This unified namespace is usually derived from the main object the module is related to, rather than from the actions performed on it. So you generally should not separate *purchasing a package* and *displaying package pricing* into two modules: they are two things you do with the same object, not two modules.

#### What Happens When a Module Has Two Main Objects?

All of the examples below work, but the good example has much better readability and maintainability:

<table><tbody>

<tr><td valign="top">

A good example:

_src/constants/package.ts_

```ts
/** @module package */

export const PackageType = {
  Personal: 0,
  Professional: 1,
  Enterprise: 2,
} as const

export type PackageTypeValue = (typeof PackageType)[keyof typeof PackageType]

export const PackageTypeLabels: Record<PackageTypeValue, string> = {
  [PackageType.Personal]: 'Personal',
  [PackageType.Professional]: 'Professional',
  [PackageType.Enterprise]: 'Enterprise',
}

export const PackageTypeOptions = [
  { label: PackageTypeLabels[PackageType.Personal], value: PackageType.Personal },
  { label: PackageTypeLabels[PackageType.Professional], value: PackageType.Professional },
  { label: PackageTypeLabels[PackageType.Enterprise], value: PackageType.Enterprise },
] as const
```

_src/constants/currency.ts_

```ts
/** @module currency */

export const Currency = {
  Usd: 'USD',
  Eur: 'EUR',
} as const

export type CurrencyValue = (typeof Currency)[keyof typeof Currency]

export const CurrencySymbols: Record<CurrencyValue, string> = {
  [Currency.Usd]: '$',
  [Currency.Eur]: '€',
}
```

_src/pages/package/pricing.vue_

```vue
<!-- @module package -->

<script setup lang="ts">
// [!code focus:9]
// For the "package" module, "currency" is an external module.
import {
  CurrencySymbols,
  type CurrencyValue,
} from '~/constants/currency'
import {
  PackageTypeLabels,
  type PackageTypeValue,
} from '~/constants/package'

interface Package {
  type: PackageTypeValue
  name: string
  priceInCents: number
}

defineProps<{
  packages: Package[]
  currency: CurrencyValue
}>()
</script>

<template>
  <section>
    <h2>Package Pricing</h2>
    <ul>
      <li v-for="pkg in packages" :key="pkg.type">
        <h3>{{ pkg.name }}</h3>
        <p>{{ PackageTypeLabels[pkg.type] }}</p>
        <p>
          {{ CurrencySymbols[currency] }}{{ (pkg.priceInCents / 100).toFixed(2) }}
        </p>
      </li>
    </ul>
  </section>
</template>
```

</td><td valign="top">

A bad example:

_src/constants.ts_

```ts
// The package domain
export const PackageType = {
  Personal: 0,
  Professional: 1,
  Enterprise: 2,
} as const

export type PackageTypeValue = (typeof PackageType)[keyof typeof PackageType]

export const PackageTypeLabels: Record<PackageTypeValue, string> = {
  [PackageType.Personal]: 'Personal',
  [PackageType.Professional]: 'Professional',
  [PackageType.Enterprise]: 'Enterprise',
}

export const PackageTypeOptions = [
  { label: PackageTypeLabels[PackageType.Personal], value: PackageType.Personal },
  { label: PackageTypeLabels[PackageType.Professional], value: PackageType.Professional },
  { label: PackageTypeLabels[PackageType.Enterprise], value: PackageType.Enterprise },
] as const

// The Currency domain
export const Currency = {
  Usd: 'USD',
  Eur: 'EUR',
} as const

export type CurrencyValue = (typeof Currency)[keyof typeof Currency]

export const CurrencySymbols: Record<CurrencyValue, string> = {
  [Currency.Usd]: '$',
  [Currency.Eur]: '€',
}
```

_src/pages/package/pricing.vue_

```vue
<script setup lang="ts">
// [!code focus:6]
import {
  CurrencySymbols,
  type CurrencyValue,
  PackageTypeLabels,
  type PackageTypeValue,
} from '~/constants'

interface Package {
  type: PackageTypeValue
  name: string
  priceInCents: number
}

defineProps<{
  packages: Package[]
  currency: CurrencyValue
}>()
</script>

<template>
  <section>
    <h2>Package Pricing</h2>
    <ul>
      <li v-for="pkg in packages" :key="pkg.type">
        <h3>{{ pkg.name }}</h3>
        <p>{{ PackageTypeLabels[pkg.type] }}</p>
        <p>
          {{ CurrencySymbols[currency] }}{{ (pkg.priceInCents / 100).toFixed(2) }}
        </p>
      </li>
    </ul>
  </section>
</template>
```

</td></tr>

</tbody></table>

The bad version is not bad because it is long. It is bad because `src/constants.ts` can no longer answer "what is in here?" without the word *and*.

### One File, One Focus

Similar to modules, if a file has more than one focus, it may break our concentration and harm our judgement.

#### What Is a Focus?

A **focus** is the purpose of this file: A module may contain multiple functionalities, and each file plays its own role in one or more functionalities and has its own concern — that concern is the file's focus.

#### What Happens When a File Has Two Foci?

All of the examples below work, but the good example has much better readability and maintainability.

<table><tbody>

<tr><td valign="top">

A good example:

_src/utils/cli/parser.ts_

```ts
// Args parser for CLI

export function parseArgs(argv: string[]): string[] {
  const args: string[] = []
  let currentArg = ''
  let inQuotes = false

  for (const arg of argv) {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      args.push(arg.slice(1, -1))
    }
    else if (arg.startsWith('"')) {
      inQuotes = true
      currentArg += `${arg.slice(1)} `
    }
    else if (arg.endsWith('"')) {
      inQuotes = false
      currentArg += arg.slice(0, -1)
      args.push(currentArg.trim())
      currentArg = ''
    }
    else if (inQuotes) {
      currentArg += `${arg} `
    }
    else {
      args.push(arg)
    }
  }

  if (inQuotes) {
    console.error('Unmatched quotes in arguments')
  }

  return args
}
```

_src/utils/cli/factory.ts_

```ts
// Args factory for CLI

import { parseArgs } from './parser.ts'

class Cli {
  private commands: Map<string, (...args: string[]) => void>
  constructor() {
    this.commands = new Map()
  }

  command(name: string, action: (...args: string[]) => void): Cli {
    this.commands.set(name, action)
    return this
  }

  run(): Cli {
    const args = parseArgs(process.argv.slice(2))
    const commandName = args[0]
    const commandArgs = args.slice(1)
    const command = this.commands.get(commandName)
    if (command)
      command(...commandArgs)
    else
      console.error(`Command not found: ${commandName}`)
    return this
  }
}

export function cli() {
  return new Cli()
}
```

_src/cli.ts_

```ts
import { cli } from './utils/cli/factory.ts'

cli().command('greet', (name: string) => {
  console.log(`Hello, ${name}!`)
}).command('add', (a: string, b: string) => {
  const sum = Number(a) + Number(b)
  console.log(`Sum: ${sum}`)
}).run()
```

</td><td valign="top">

A bad example:

_src/utils/cli.ts_

```ts
// Everything about the CLI!

class Cli {
  private commands: Map<string, (...args: string[]) => void>
  constructor() {
    this.commands = new Map()
  }

  command(name: string, action: (...args: string[]) => void): Cli {
    this.commands.set(name, action)
    return this
  }

  run(): Cli {
    const args = parseArgs(process.argv.slice(2))
    const commandName = args[0]
    const commandArgs = args.slice(1)
    const command = this.commands.get(commandName)
    if (command)
      command(...commandArgs)
    else
      console.error(`Command not found: ${commandName}`)
    return this
  }
}

export function cli() {
  return new Cli()
}

export function parseArgs(argv: string[]): string[] {
  const args: string[] = []
  let currentArg = ''
  let inQuotes = false

  for (const arg of argv) {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      args.push(arg.slice(1, -1))
    }
    else if (arg.startsWith('"')) {
      inQuotes = true
      currentArg += `${arg.slice(1)} `
    }
    else if (arg.endsWith('"')) {
      inQuotes = false
      currentArg += arg.slice(0, -1)
      args.push(currentArg.trim())
      currentArg = ''
    }
    else if (inQuotes) {
      currentArg += `${arg} `
    }
    else {
      args.push(arg)
    }
  }

  if (inQuotes) {
    console.error('Unmatched quotes in arguments')
  }

  return args
}
```

_src/cli.ts_

```ts
import { cli } from './utils/cli'

cli().command('greet', (name: string) => {
  console.log(`Hello, ${name}!`)
}).command('add', (a: string, b: string) => {
  const sum = Number(a) + Number(b)
  console.log(`Sum: ${sum}`)
}).run()
```

</td></tr>

</tbody></table>

### Leave Main Logic as an Outline, Hide Detail Logic Internally

#### What Is Logic?

Logic is expressed by functions — in other words, "logic" here means functions.

#### Why Should We Leave Main Logic as an Outline?

To help the reader understand our file easily, we'd better leave main logic as an outline, and hide detail logic internally.

All of the examples below work, but the good example has much better readability and maintainability.

<table><tbody>

<tr><td valign="top">

_src/good.ts_

```ts
// [!code focus:11]
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

### Main Logic Above, Details Below

Put the main logic at the top so that we can quickly understand the main logic of the code. If we are interested in the details, we can read from top to bottom, which fits human reading habits well.

All of the examples below work, but the good example has much better readability and maintainability.

> [!Note]
>
> We are talking about **definition order** — the order in which functions *appear in the file* — not **execution order**. By the time `main()` is called, everything it uses already exists; we never really execute a symbol before it is defined. XD.
>
> This is a **style convention rather than a language feature**. Robert C. Martin calls it the *Stepdown Rule* in *Clean Code* (chapter 3) — code should read like a top-down newspaper article. Most languages support it in one form or another; a handful need a forward declaration (C, C++, Nim, Pascal), and very few cannot express it at all (e.g. Oberon-07, Coq).

<table><tbody>

<tr><td valign="top">

_src/good.ts_

```ts
// [!code focus:11]
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

// [!code focus:11]
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

### Special Condition First, General One Last

There is a classic pattern you may already know: the guard clause.

The key point of the guard clause is to achieve an early return via conditional inversion.

```ts
function buyTickets(id: string, amount: number, options: any): void {
  // TODO(Lumirelle): Should we use function instead of objects for better tree-shaking in any cases?
  const ticketRepo = new TicketRepository()

  // Early return with an error by inverting the condition `ticketRepo.has(id)` to `!ticketRepo.has(id)`
  if (!ticketRepo.has(id)) {
    throw new Error(`The ticket with ID "${id}" does not exist!`)
  }

  const userRepo = new UserRepo()
  const userInfo = userRepo.getInfo()

  if (userInfo.balance < amount) {
    throw new Error(`Your current balance is not enough to buy this ticket!
You still need to top up by ${amount - userInfo.balance}$.`)
  }

  // ...

  ticketRepo.buy(id)
}
```

It hoists all the special conditional logic to the start and leaves the most general logic at the end.

Based on that structure, you will never lose yourself among the charming control flows and data flows.

## They Are Not Panaceas

Of course, code organization is not a panacea; excessive organization can impose an additional mental cost.

Before we do any of this, we must pay attention to **motivation and quality**.

### Do Not Separate Interdependent Code into Different Files

Interdependent code should not be split across different places, even if the pieces look like two very different concerns; otherwise it will lead to a mess of data flow and dependencies, which makes the code harder to understand and maintain.

> [!Note]
>
> As for data flow direction, strictly adhering to unidirectional data flow is the best practice.

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

  // This logic is based on `selected`,
  // which means `useFormComponent`
  // should be called after
  // `useSelectorComponent`.
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
  // This logic is based on `formData`,
  // which means `useSelectorComponent`
  // should be called after
  // `useFormComponent`.
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
// Combined into a single composable...
const {
  formData,
  formConfig,
  selected
} = useFormAndSelectorComponent({
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
    <!-- internally `v-if` based on `enableSelector` -->
    <FormComponent v-model="formData" :config="formConfig" />
  </div>
</template>
```

</td></tr>

</tbody></table>

### Do Not Extract Logic from Simple or Special Implementations

Some simple implementation code does not need to be extracted; excessive abstraction is just showing off, adds mental cost (constant context switching), and has no practical payoff.

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

The same goes for special implementations that are not reusable; extracting them only leads to negative effects:

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
 * AI really enjoys extracting these specific pieces
 * of logic into a large number of non-reusable util functions.
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

### Extract Heavy Logic, But Do Not Separate It into Different Files If It's Non-reusable

If a piece of code is heavy and reusable, we can extract it into a separate file, just like [the `useFormAndSelectorComponent` example above](#do-not-separate-interdependent-code-into-different-files). But if a piece of code is not reusable — for example, it's a specific page's logic — we should not extract it into different files but one big composed function in the same file.

<table><tbody>

<tr><td valign="top">

Bad Example (Not Extracted):

_src/views/bad-page.vue_

```vue
<script setup lang="ts">
// [!code focus:55]
// imports ...

// Too much top-level code,
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

Bad Example (Extracted to a separate file, but not reusable):

_src/composables/useTemplatePage.ts_

```ts
// imports ...

// A one-time-use composable...

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

The only right way looks like this:

_src/views/good-page.vue_

```vue
<script setup lang="ts">
// [!code focus:12]
// imports ...

interface PageModule {
  id: string
  name: string
  payload: Record<string, any>
}

const { pageComponents } = useTemplatePage()

// --- Main logic above, details below! ---
// --- But limited by language support! ---

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

For plain JavaScript / TypeScript, we can still achieve this by using a big composed function with nested functions (In fact, the code within the `<script>` tag in the `.vue` file is plain JavaScript / TypeScript code):

_src/utils/complex-logic.ts_

```ts
// [!code focus:7]
export function complexLogic() {
  const context = createContext()
  setup(context)
  process(context)
  teardown(context)

  // --- Main logic above, details below! ---

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

TODO: For unsupported languages...

### If Your Team Only Cares About Deadlines But Not Code Quality...

As the saying goes, when in Rome, do as the Romans do; one must learn to be tactful in life.

If your team only cares about deadlines and not code quality, just follow along:

> "Make it work, make it right, make it fast." -- Kent Beck

You just need to make the code work, meet the business requirements, and be free of bugs. That's all. Then do the organizing only when you feel like it.

Remember, you are the angel in this dirty world full of AI-generated content. Some of this content is a black box; no one knows how it works, because those AI users do not care whether it works efficiently or not, they do not care about future maintenance, and they never even review the content before applying it: "Since we're using AI anyway, it won't complain about the bloat and maintainability of the code. If there's a bug, the tester will find it; if AI cannot fix it, then let the developer fix it, so what if it's bloated and unmaintainable?"

I mean, in this shitty world, the best practice is to patch things up only when they get troublesome. 😉

> ~~“亡羊补牢，为时未晚。”~~
>
> ~~"It's never too late to mend the fold after the sheep are lost."~~
>
> “既未亡羊，何必补牢？”
>
> "Why mend the fold when no sheep has been lost?"

## Examples

### Example: One File, One Focus

A simple example: one day I found that the `vite.config.ts` file in my project was getting too large and complex. The root cause was that there were too many plugins with heavy logic. The solution is quite simple: just move each plugin (of course, only the plugins with additional logic are worth moving) into a separate file.

You can see the commit details [here](https://github.com/lumirelle/lumirelle.me/commit/7c1594db4c5cd5bd422659f1ea820da75e3f893c#diff-6a3b01ba97829c9566ef2d8dc466ffcffb4bdac08706d3d6319e42e0aa6890dd).

## References

### Antfu's Code Style

[Antfu's code style](https://github.com/antfu/skills/blob/main/skills/antfu/SKILL.md) is a good reference for writing clean and maintainable code.
