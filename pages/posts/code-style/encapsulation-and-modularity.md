---
title: 'Code Style: Encapsulation and Modularity'
date: 2025-09-24T16:36+08:00
update: 2025-12-01T13:49+08:00
lang: en
duration: 5min
type: blog+note
---

[[toc]]

## Why Encapsulation and Modularity are Necessary?

First of all, reduce the frequency of copy-paste. Copy-paste is a bad practice, because it makes code harder to maintain. If you need to change something, you have to change it in multiple places.

Just imagine that, you completed the product 2's buying page through copy-paste the product 1's one. After a long time, you get a new request about changing the implementation details, will you remember to change both pages, will you think it's troublesome to make double the changes every time? Worse still, you also need to pay attention to whether the same changes still apply to these two pages after dozens of version iterations.

Second, reduce the complexity of the code. If every page has its own implementation for the same feature, the code will be like a real "mud hill". Every time you forget the logic of these pages, you have to understand both the implementation details of and the differences between each page.

Tell the truth, I really feel tired to face these "mud hills".

Read through the above two points, are you feeling hot and dry, are you eager to achieve them? Then I'have to pour cold water on you.

Encapsulation and modularity are not a panacea, excessive encapsulation and modularity will bring you more trouble:

- The encapsulation and modularity that is hard to use or unnecessary are waste of time and effort of no value.
- Excessive encapsulation and modularity will instead increase the cost of understanding and using the code.

Therefore, we need to find a balance point, which is the focus of this article.

## The Principle of Encapsulation and Modularity

To avoid the above problems, we need to follow the following principles when encapsulating and modularizing:

1. Only encapsulate and modularize the code **as needed**: when you must to reuse a part of code belong another page, module or component.
2. List the **value & cost** points of encapsulation and modularity. If they cannot persuade you to do that, then please just give up immediately.
3. If you decide to do that, you should treat yourself as the first user through the whole development process (including design, implementation and testing), **easy to use**, **out of box**, **robust** are the three key concepts.
4. Don't forget to write the **documentation**.

## Examples

Before encapsulation and modularity:

_pages/buying/product1.vue_

```html
<script setup lang="ts">
  // [!code highlight:5]
  const formData = reactive({
    id: '',
    name: '',
    type: 0,
  })

  interface Product1 {
    id: string
    name: string
    description: string
    type: number
    price: number
    inventory: number
  }

  const product1List = ref<Product1[]>([])

  const tableColumns = [
    { label: 'ID', props: 'id' },
    { label: 'Name', props: 'name' },
    { label: 'Description', props: 'description' },
    { label: 'Type', props: 'type' },
    { label: 'Price', props: 'price' },
    { label: 'Inventory', props: 'inventory', type: 'slot' },
  ]

  // [!code highlight:8]
  const route = useRoute()

  function initFormDataFromRoute() {
    const query = route.query
    formData.id = (query.id as string) ?? ''
    formData.name = (query.name as string) ?? ''
    formData.type = +query.type ?? 0
  }

  const { buyingApi: api } = useApi()

  async function getProduct1List(params = formData) {
    const res = await api.getProduct1List(params)
    if (res.success) {
      product1List.value = res.data
    } else {
      product1List.value = []
      console.error(res.message)
    }
  }

  onMounted(() => {
    // [!code highlight:1]
    initFormDataFromRoute()
    getProduct1List()
  })

  function onSearch() {
    getProduct1List()
  }
</script>

<template>
  <!-- ... -->
</template>
```

After encapsulation and modularity:

_pages/buying/product1.vue_

```html
<script setup lang="ts">
  // [!code highlight:5]
  const formData = useQueryForm({
    id: '',
    name: '',
    type: 0,
  })

  interface Product1 {
    id: string
    name: string
    description: string
    type: number
    price: number
    inventory: number
  }

  const product1List = ref<Product1[]>([])

  const tableColumns = [
    { label: 'ID', props: 'id' },
    { label: 'Name', props: 'name' },
    { label: 'Description', props: 'description' },
    { label: 'Type', props: 'type' },
    { label: 'Price', props: 'price' },
    { label: 'Inventory', props: 'inventory', type: 'slot' },
  ]

  const { buyingApi: api } = useApi()

  async function getProduct1List(params = formData) {
    const res = await api.getProduct1List(params)
    if (res.success) {
      product1List.value = res.data
    } else {
      product1List.value = []
      console.error(res.message)
    }
  }

  onMounted(() => {
    getProduct1List()
  })

  function onSearch() {
    getProduct1List()
  }
</script>

<template>
  <!-- ... -->
</template>
```

_composables/use-query-form.ts_

```ts
import { reactive } from 'vue'

/**
 * This composable is used to initialize form data from route query parameters.
 * It takes a default form data object and populates it with values from the route query.
 *
 * The type of each form field is preserved during the assignment. If cannot be converted,
 * the type will be `string`.
 */
export function useQueryForm<T>(defaultFormData: T) {
  const formData = reactive<T>(structuredClone(defaultFormData))

  const route = useRoute()

  function initFormDataFromRoute() {
    const query = route.query
    Object.keys(formData).forEach((key) => {
      const k = key as keyof typeof formData
      if (query[key]) {
        const value = query[key]
        formData[k] = convertValue(formData[k], value as string)
      }
    })
  }

  onMounted(() => {
    initFormDataFromRoute()
  })

  return {
    formData,
  }
}

function convertValue<T>(formField: T, value: string): T {
  switch (typeof formField) {
    case 'boolean':
      return (value === 'true') as T
    case 'number':
      return +value as T
    case 'object':
      try {
        return JSON.parse(value) as T
      }
      catch (e) {
        console.warn(`Failed to parse value to an "object", falling back to "string"!`, e)
        return value as T
      }
    default:
      return value as T
  }
}
```

The example above shows how to encapsulate the logic of initializing form data from route query parameters into a composable function `useQueryForm`. This reduces code duplication and improves maintainability. After encapsulation, if you need to use this logic in another page, you can simply call the `useQueryForm` function with the appropriate default form data.
