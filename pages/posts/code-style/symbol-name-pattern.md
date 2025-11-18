---
title: 'Code Style: Symbol Name Pattern'
date: 2025-09-23T15:58:00+08:00
update: 2025-11-18T16:47+08:00
lang: en
duration: 6min
type: blog+note
---

[[toc]]

## Why We Need to Care About Symbol Name Patterns?

In a huge Vue project, we may have thousands of symbols, likes variable names,
function names, hook names, component names, etc. If we cannot encapsulate and
modularize them, the only thing we can do is to use the better naming patterns
to avoid naming conflicts.

This article will introduce some naming patterns I preferred in my projects.

## Variable Names

### Recommended Pattern

The recommended variable name pattern has the similar concept with BEM (Block
Element Modifier) class name pattern:

```ts
// Not State
'(block)[Element][Modifier]'

// State
'is|can|should(Block)[Element][Modifier]'
```

For example:

```vue
<script setup lang="ts">
import { ElForm } from 'element-plus'
import { ref } from 'vue'

// [!code highlight:13]
/**
 * "formRef" is used to store form reference. `block` is "form",
 * `modifier` is "Ref".
 */
const formRef = ref<InstanceType<typeof ElForm>>(null)
/**
 * "formData" is used to store form data. `block` is "form",
 * `modifier` is "Data".
 */
const formData = ref({
  name: null,
  email: null,
})

// [!code highlight:17]
/**
 * "tableData" is used to store table data. `block` is "table",
 * `modifier` is "Data".
 */
const tableData = ref([
  { name: 'data1', email: 'data2' },
  { name: 'data3', email: 'data4' },
])
/**
 * "tableColumnConfigs" is used to store table column configs.
 * `block` is "table", `element` is "Column", `modifier`
 * is "Configs".
 */
const tableColumnConfigs = ref([
  { label: 'Name', prop: 'name' },
  { label: 'Email', prop: 'email' },
])
</script>
```

For a really huge amount of symbols, you should not only follow the naming
patterns but also [encapsulate and modularize](encapsulation-and-modularity.md)
them into components, composables, or modules.

Some common `block`, `element`, `modifier` examples are (`/` means the same as
above):

| Block                                           | Element  | Modifier                                                         |
| ----------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `form`                                          | `Item`   | [`Not State`](#not-state-modifier)<br>[`State`](#state-modifier) |
| `table`                                         | `Column` | /                                                                |
| /                                               | `Row`    | /                                                                |
| /                                               | `Cell`   | /                                                                |
| `dialog`                                        | `Header` | /                                                                |
| /                                               | `Body`   | /                                                                |
| /                                               | `Footer` | /                                                                |
| `menu`<br>`dropmenu`<br>`sidemenu`<br>`navmenu` | `Group`  | /                                                                |
| /                                               | `Item`   | /                                                                |
| `card`                                          | `Box`    | /                                                                |
| /                                               | `Header` | /                                                                |
| /                                               | `Body`   | /                                                                |
| /                                               | `Footer` | /                                                                |
| /                                               | `Cover`  | /                                                                |

### Not State Modifier

- `Ref`
- `Data`
- `Config[s]`
- ...

### State Modifier

- `Visible` / `Invisible`
- `Shown` / `Hidden`
- `Enabled` / `Disabled`
- `Loading` / `Loaded`
- `Pending` / `Fulfilled` / `Rejected`
- `Success` / `Failure`
- `Active` / `Inactive`
- ...

## Function Names

### Endpoint Function

The endpoint function name should start with verbs `get`, `create`, `update`,
`upsert`, `delete` to introduce the operation type.

To read the demo code below, please ensure you know the difference between HTTP
methods and CRUD operation types:

- `GET` method is used to read data, which corresponds to `get` operation, it's
  **safe[^1]** and **idempotent[^2]**.
- `POST` method is used to create data, which corresponds to `create` operation,
  it's **not safe** and **not idempotent**.
- `PUT` method is used to update (replace) data, which corresponds to `update`
  operation, it's **not safe** but **idempotent**.
- `DELETE` method is used to delete data, which corresponds to `delete`
  operation, it's **not safe** but **idempotent**.
- `upsert` operation means to create or update data, which can be implemented by
  `PUT` method, because it's **not safe** but **idempotent**.

To learn more about HTTP methods, please read the
[computer network manual](/posts/manual/computer-network-manual.md#http-methods).

For example, the endpoint functions for user info are defined seperately and
exported as a single object for easy import:

_api/user.ts_

```ts
import request from '@/utils/request.js'

// [!code highlight:7]
/**
 * "get${Data}" is used for endpoint function with "GET"
 method and "get" operation.
 */
async function getUserInfo(params?: Record<string, any>) {
  return await request.get('/user/info', { params })
}

// [!code highlight:7]
/**
 * "create${Data}" is used for endpoint function with "POST"
 method and "create" operation.
 */
async function createUserInfo(data: Record<string, any>) {
  return await request.post('/user/info', { data })
}

// [!code highlight:7]
/**
 * "update${Data}" is used for endpoint function with "PUT"
 method and "update" operation.
 */
async function updateUserInfo(data: Record<string, any>) {
  return await request.put('/user/info', { data })
}

// [!code highlight:8]
/**
 * "update${Data}${Attribute}" is used for endpoint function
  with "PUT" method and "update" operation for specific
 * attribute.
 */
async function updateUserInfoState(data: Record<string, any>) {
  return await request.put('/user/info/state', { data })
}

// [!code highlight:7]
/**
 * "upsert${Data}" is used for endpoint function with "POST"
 method and "upsert" operation.
 */
async function upsertUserInfo(data: Record<string, any>) {
  return await request.put('/user/info', { data })
}

// [!code highlight:7]
/**
 * "delete${Data}" is used for endpoint function with "DELETE"
  method and "delete" operation.
 */
async function deleteUserInfo(data: Record<string, any>) {
  return await request.delete('/user/info', { data })
}

// [!code highlight:8]
export default {
  createUserInfo,
  deleteUserInfo,
  getUserInfo,
  updateUserInfo,
  updateUserInfoState,
  upsertUserInfo,
}
```

Then, use the endpoint functions in Vue component by importing the default
exported object:

_pages/user.vue_

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
// [!code highlight:4]
/**
 * Organize the endpoint functions into a single object `api` for easy import.
 */
import api from '@/api/user'

const userInfo = ref(null)

onMounted(async () => {
  // [!code highlight:1]
  userInfo.value = await api.getUserInfo()
})
</script>

<template>
  <div>
    <h1>User Info</h1>
    <pre>{{ userInfo }}</pre>
  </div>
</template>
```

The same as the endpoint function name pattern, the Vue component method name
who is used to call the endpoint functions should start with verbs `get`,
`create`, `update`, `upsert`, `delete` to indicate the operation type.

_pages/user.vue_

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api/user'

const userInfo = ref(null)

// [!code highlight:3]
async function getUserInfo() {
  userInfo.value = await api.getUserInfo()
}

// [!code highlight:3]
async function createUserInfo(data: Record<string, any>) {
  await api.createUserInfo(data)
}

// [!code highlight:3]
async function updateUserInfo(data: Record<string, any>) {
  await api.updateUserInfo(data)
}

// [!code highlight:3]
async function updateUserInfoState(data: Record<string, any>) {
  await api.updateUserInfoState(data)
}

// [!code highlight:3]
async function upsertUserInfo(data: Record<string, any>) {
  await api.upsertUserInfo(data)
}

onMounted(async () => {
  await getUserInfo()
})
</script>

<template>
  <div>
    <h1>User Info</h1>
    <pre>{{ userInfo }}</pre>
    <button @click="getUserInfo()">
      Refresh
    </button>
    <button @click="createUserInfo({ name: 'New User' })">
      Create New User Named "New User"
    </button>
    <button @click="updateUserInfo({ id: 1, name: 'New Name' })">
      Update (Replace) User Name to "New Name" With ID "1"
    </button>
    <button @click="updateUserInfoState({ id: 1, state: 'active' })">
      Update (Replace) User State to "active" With ID "1"
    </button>
  </div>
</template>
```

### Event Handler Function

The event handler function name should start with verbs `on`, `after`, `before`
to indicate the event handler type.

For example:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface UserInfo {
  id: string
  name: string
  email: string
}

const userInfo = ref<UserInfo | null>(null)

// [!code highlight:6]
async function beforeUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  console.log('User info changed before:', oldUserInfo, newUserInfo)
}

// [!code highlight:7]
async function onUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  userInfo.value = newUserInfo
  console.log('User info changed:', oldUserInfo, newUserInfo)
}

// [!code highlight:6]
async function afterUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  console.log('User info changed after:', oldUserInfo, newUserInfo)
}

onMounted(() => {
  const oldUserInfo = userInfo.value
  const newUserInfo = await api.getUserInfo()
  beforeUserInfoChange(oldUserInfo, newUserInfo)
  onUserInfoChange(oldUserInfo, newUserInfo)
  afterUserInfoChange(oldUserInfo, newUserInfo)
})
</script>

<template>
  <div>
    <h1>User Info</h1>
    <pre>{{ userInfo }}</pre>
  </div>
</template>
```

[^1]: Safe means that the operation does not modify any data on the server.

[^2]:
    Idempotent means that performing the operation multiple times has the same
    effect as performing it once.
