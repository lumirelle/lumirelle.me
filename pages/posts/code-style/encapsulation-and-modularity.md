---
title: 'Code Style: Encapsulation and Modularity'
date: 2025-09-24T16:36+08:00
update: 2026-01-27T16:41+08:00
lang: en
duration: 4min
type: blog+note
---

[[toc]]

## Why Encapsulation and Modularity are Necessary?

First of all, reduce the frequency of copy-paste. Copy-paste is a bad practice, because it makes code harder to maintain. If you need to change something, you have to change them in different places.

Just imagine that, you completed the product 2's buying page through copy-pasting the product 1's buying page. After a long time, you get a new request about changing the implementation details, will you remember to change both pages, will you think it's troublesome to make double the changes every time? Worse still, you also need to pay attention to whether the same changes still apply to these two pages after dozens of version iterations.

Second, reduce the complexity of the code. If every page has its own isolated implementation for the same feature, the code will be like a real "mud hill", especially for those pages with heavy logic.

The worst code I had seen is one Vue page component with more than 3000 lines of code, when I had to maintain it, it took me at least 10 minutes to understand the logic of that page. What's worse, every time you forget the logic of these pages, you have to read through them again... 😅

Tell the truth, I really feel tired to face these "mud hills".

Read through the above two points, are you feeling hot and dry, are you eager to solve them? No, just wait! 🥰

## They are not Panaceas

Encapsulation and modularity are not panaceas, excessive encapsulation and modularity are "mud hills" too:

- Should not encapsulate and modularize heavily dependent code, otherwise it will lead to a mess of data flow and dependencies, which makes the code harder to understand and maintain.

  _src/views/bad-page.vue_

  ```vue
  <script setup lang="ts">
  // imports ...

  // Problem: `selected` is used by `useFormComponent`,
  // but it's exported by `useSelectorComponent`,
  // and `useFormComponent` depends on `useFormComponent`...
  // The data flow is really a mess! 😵‍💫
  const { formData, formConfig } = useFormComponent({
    config: {
      columns: [
        { label: 'Name', props: 'name' },
        { label: 'Age', props: 'age' },
        // ...
      ],
    },
    selected,
  })
  const { selected } = useSelectorComponent({
    formData,
  })
  </script>

  <template>
    <div>
      <SelectorComponent v-model="selected" />
      <FormComponent v-model="formData" :config="formConfig" />
    </div>
  </template>
  ```

  _src/views/good-page.vue_

  ```vue
  <script setup lang="ts">
  // imports ...

  // Combined them together...
  const { formData, formConfig, selected } = useFormComponent({
    config: {
      columns: [
        { label: 'Name', props: 'name' },
        { label: 'Age', props: 'age' },
        // ...
      ],
      // Use `enableSelector` to control whether to enable the selector feature.
      enableSelector: true,
    },
  })
  </script>

  <template>
    <div>
      <!-- Integrated selector inside FormComponent -->
      <FormComponent v-model="formData" :config="formConfig" />
    </div>
  </template>
  ```

- The encapsulation and modularity who are hard to use or unnecessary are waste of time and effort of no value.

  ```ts
  // Hard to use example:
  export function useForm(config: FormConfig, defaultValues?: Record<string, any>) {
    const formData = reactive<Record<string, any>>({})

    function resetForm() {
      for (const field of config.fields)
        formData[field.name] = defaultValues?.[field.name] ?? field.defaultValue ?? null
    }

    resetForm()

    return {
      formData,
      resetForm,
    }
  }
  useForm(
    {
      fields: [
        { name: 'username' },
        { name: 'password' },
      ],
    },
    { username: 'guest' },
  )
  /**
   * Expected:
   *
   * useForm({
   *   fields: [
   *     { name: 'username', defaultValue: 'guest' },
   *     { name: 'password' },
   *   ],
   * })
   */

  // Unnecessary encapsulation example:
  export function isTrue(value: any): boolean {
    return value === true
  }
  const value = Math.random() > 0.5
  console.log(isTrue(value))
  // Expected: console.log(value === true)
  ```

- Excessive abstraction is just to show off skills and has no practical application.

Therefore, we need to find a balance point:

> "Make it work, make it right, make it fast." -- Kent Beck

- If you should reuse the old code **now**, do encapsulation and modularity.
- If you **already** made a code too large or too complex, do encapsulation and modularity (Of course, you should pay attention to not to write codes with strong coupling, this is your basic personal quality).

I mean, mending the situation before it is too late is always better than too many drafts. 😉
