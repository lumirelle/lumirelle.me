---
title: 'Code Style: Encapsulation and Modularity'
date: 2025-09-24T16:36+08:00
update: 2026-02-10T13:46+08:00
lang: en
duration: 4min
type: blog+note
---

[[toc]]

## Why Encapsulation and Modularity are Necessary?

The only reason is **making the code separate**.

Making code separate can help reduce the coupling between different logic and features, also help us maintain the code more easily. Whenever you need to change something, you can find the related code more quickly, without worrying about the side effects of other code.

It can also make the code reusable, reduce the frequency of copy-paste. If every module has its own isolated implementation for the same feature, the inconsistency between implementation details will make the code looks like a real "mud hill", especially for modules with heavy logic. Also, copy-paste is a bad practice, because it makes code duplicated in everywhere. If you need to do some changes, you have to change all of them in different places. After dozens of version iterations, who can ensure that code produced by copy-paste is still the same as the original one? 😅

Futhermore, it reduce the complexity of the code. Human brain can only hold a limited amount of information at the same time, if the code is too large or too complex, it will be hard to understand. By making the code separate, we can break down the complexity into smaller and more manageable pieces, which makes it easier to understand.

For a simple example:

<table><tbody><tr><td width="500px" valign="top">

_src/good.js_

```js
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
```

</td><td width="500px" valign="top">

_src/bad.js_

```js
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

</td></tr></tbody></table>

Or a short story: You are a front-end developer, and you have completed the _product 2_'s buying page through copy-pasting the _product 1_'s buying page before. After some monthes, you get a new request about changing the implementation details, will you remember to change both these two pages, will you think it's troublesome to make double the changes? Worse still, you also need to pay attention to whether the same changes still apply to these two pages after dozens of version iterations by your cooperators.

The worst code I had seen is one Vue page component **with more than 3000 lines of code, with meaningless symbol names**, when I had to maintain it, it took me at least 10 minutes to understand the logic of that page. What's worse, every time you forget the logic of these pages, you have to read through them again... 😅 What a shit is it?

Oh yes, are you feeling hot and dry, are you eager to do encapsulation and modularity? Just wait a minute. 🥰

## They are not Panaceas

Encapsulation and modularity are not panaceas, excessive encapsulation and modularity are "mud hills" too.

Before we do these, we must pay attention to the **motivation and quality**.

- Some codes clearly are no need to be encapsulated and modularified, excessive abstraction is just to show off skills, makes mental cost and has no practical application.

  ```js
  // 😅
  export function isTrue(value) {
    return value === true
  }
  export function isFalse(value) {
    return value === false
  }
  ```

- Heavily dependent codes should not be encapsulated and modularified, otherwise it will lead to a mess of data flow and dependencies, which makes the code harder to understand and maintain.

  <table><tbody><tr><td width="500px" valign="top">

  _src/views/bad-page.vue_

  ```vue
  <script setup lang="ts">
  // imports ...

  // [!code focus:23]
  // `selected` is used by `useFormComponent`, but
  // exported by `useSelectorComponent`!
  // `formData` is used by
  // `useSelectorComponent`,
  // but exported by
  // `useFormComponent`!
  // The data flow is really a mess! 😵‍💫
  const {
    formData, // <-
    formConfig
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
  const {
    selected // <-
  } = useSelectorComponent({
    formData, // <-
  })
  </script>

  <template>
    <div>
      // [!code focus:2]
      <SelectorComponent v-model="selected" />
      <FormComponent
        v-model="formData"
        :config="formConfig"
      />
    </div>
  </template>
  ```

  </td><td width="500px" valign="top">

  _src/views/good-page.vue_

  ```vue
  <script setup lang="ts">
  // imports ...

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
      <!-- Combined -->
      <FormComponent
        v-model="formData"
        :config="formConfig"
      />
    </div>
  </template>
  ```

  </td></tr></tbody></table>

- The encapsulation and modularity who are hard to use are waste of time and effort of no value.

  ```ts
  // [!code focus:6]
  // Separate `defaultValues` setting from `config`, which is meaningless
  // and makes the usage more complex and harder to understand.
  export function useForm(
    config: FormConfig,
    defaultValues?: Record<string, any>
  ) {
    const formData = reactive<Record<string, any>>({})

    function resetForm() {
      for (const field of config.fields) {
        formData[field.name]
          = defaultValues?.[field.name] ?? field.defaultValue ?? null
      }
    }

    resetForm()

    return {
      formData,
      resetForm,
    }
  // [!code focus:20]
  }
  // Usage
  useForm(
    {
      fields: [
        { name: 'username' },
        { name: 'password' },
      ],
    },
    { username: 'guest' },
  )
  // Expected
  useForm(
    {
      fields: [
        { name: 'username', defaultValue: 'guest' },
        { name: 'password' },
      ],
    }
  )
  ```

Therefore, we need to find a balance point, to make our code works first:

> "Make it work, make it right, make it fast." -- Kent Beck

Then, do encapsulation and modularity when it is necessary, not too early, not too late:

- If you should reuse the old code **now**, do encapsulation and modularity.
- If you **made** a code too large or too complex **just before**, do encapsulation and modularity. Of course, you should pay attention to not to write codes with strong coupling in every day coding, this is your basic personal quality.

I mean, the best practice is to make up for the situation only when it's getting troublesome. 😉

## Examples

Hope there will be some examples in the future...

## Antfu's Code Style

[Antfu's code style](https://github.com/antfu/skills/blob/main/skills/antfu/SKILL.md) is a good reference for writing clean and maintainable code.

```

```
