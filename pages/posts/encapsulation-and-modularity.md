---
title: Encapsulation and Modularity
date: 2025-09-24T16:36+08:00
update: 2025-09-24T16:36+08:00
lang: en
duration: 5min
---

[[toc]]

## Why encapsulation and modularity is necessary?

First of all, reduce the frequency of copy-paste. Copy-paste is a bad practice, because it makes code harder to
maintain. If you need to change something, you have to change it in multiple places.

Just imagine that, you completed the product 2's buying page through copy-paste the product 1's one. After a long time,
you get a new request about changing the implementation details, will you remember to change both pages, will you think
it's troublesome to make double the changes every time? Worse still, you also need to pay attention to whether the same
changes still apply to these two pages after dozens of version iterations.

Second, reduce the complexity of the code. If every page has its own implementation for the same feature, the code will
be like a real "mud hill". Every time you forget the logic of these pages, you have to understand both the
implementation details of and the differences between each page.

Tell the truth, I really feel tired to face these "mud hills".

Read through the above two points, are you feeling hot and dry, are you eager to achieve them? Then I'have to pour cold
water on you.

Encapsulation and modularity are not a panacea, excessive encapsulation and modularity will bring you more trouble:

- The encapsulation and modularity that is hard to use or unnecessary are waste of time and effort of no value.
- Excessive encapsulation and modularity will instead increase the cost of understanding and using the code.

Therefore, we need to find a balance point, which is the focus of this article.

## The principle of encapsulation and modularity

To avoid the above problems, we need to follow the following principles when encapsulating and modularizing:

1. Only encapsulate and modularize the code **as needed**: when you must to reuse a part of code belong another page, module
   or component.
2. List the **value & cost** points of encapsulation and modularity. If they cannot persuade you to do that, then please
   just give up immediately.
3. If you decide to do that, you should treat yourself as the first user through the whole development process
   (including design, implementation and testing), **easy to use**, **out of box**, **robust** are the three key
   concepts.
4. Don't forget to write the **documentation**.

### Examples

Before encapsulation and modularity:

_pages/buying/product1.vue_

```html
<script setup lang="ts">
  interface FormData {
    id?: string | null
    name?: string | null
    type?: number | null
  }

  const formData = reactive<FormData>({
    id: null,
    name: null,
    type: null,
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

  const route = useRoute()

  function initFormDataFromRoute() {
    const query = route.query
    formData.id = (query.id as string) || null
    formData.name = (query.name as string) || null
    formData.type = query.type ? +query.type : null
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

_composables/use-query-form.ts_

```ts
import deepClone from 'deep-clone'
import { reactive } from 'vue'

/**
 * This composable is used to initialize form data from route query parameters.
 * It takes a default form data object and populates it with values from the route query.
 * If a query parameter is not present, the corresponding form data field is set to null.
 */
export function useQueryForm<T>(defaultFormData: T) {
  const formData = reactive<T>(deepClone(defaultFormData))

  const route = useRoute()

  function initFormDataFromRoute() {
    const query = route.query
    Object.keys(formData).forEach((key) => {
      const k = key as keyof T
      if (query[key]) {
        const value = query[key]
        if (typeof formData[k] === 'number') {
          formData[k] = +value as T[keyof T]
        }
        else {
          formData[k] = value as T[keyof T]
        }
      }
      else {
        formData[k] = null as T[keyof T]
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
```

_pages/buying/product1.vue_

```html
<script setup lang="ts">
  interface FormData {
    id?: string | null
    name?: string | null
    type?: number | null
  }

  const formData = useQueryForm<FormData>({
    id: null,
    name: null,
    type: null,
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

The example above shows how to encapsulate the logic of initializing form data from route query parameters into a
composable function `useQueryForm`. This reduces code duplication and improves maintainability. After encapsulation, if
you need to use this logic in another page, you can simply call the `useQueryForm` function with the appropriate default
form data.
