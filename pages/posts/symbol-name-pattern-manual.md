---
title: Symbol Name Pattern Manual
date: 2025-09-23T15:58:00+08:00
update: 2025-09-23T20:04:00+08:00
lang: en
duration: 5min
---

[[toc]]

In a huge Vue project, we may have thousands of symbols, likes variable names, function names, hook names, component
names, etc. Especially function names, for example, we may have an endpoint function called `getUserInfo`, and a Vue
component method called `getUserInfo` which is used to call the endpoint function and set the response data to a
reactive variable in Vue component:

```html
<script setup lang="ts">
  import { getUserInfo } from '@/api/user'
  import { ref, onMounted } from 'vue'

  const userInfo = ref(null)

  /**
   * This Vue component method has the same name as the endpoint
   * function. It's hard to distinguish them in the code.
   */
  async function getUserInfo() {
    userInfo.value = await getUserInfo()
  }

  onMounted(() => {
    getUserInfo()
  })
</script>

<template>
  <div>
    <h1>User Info</h1>
    <pre>{{ userInfo }}</pre>
  </div>
</template>
```

The best practice is to use different names for different symbols. This article will introduce some naming patterns I
preferred in my projects.

## Variable Names

### Recommended Pattern

The recommended variable name pattern has the similar concept with BEM (Block Element Modifier) class name pattern:

```ts
// Not State
'(block)[Element][Modifier]'

// State
'is|can|should(Block)[Element][Modifier]'
```

For example:

```html
<script setup lang="ts">
  import { ElForm } from 'element-plus'
  import { ref } from 'vue'

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

For a really huge amount of symbols, you should not only follow the naming patterns but also
[encapsulate and modularize](encapsulation-and-modularity.md) them into components, composables, or modules.

Some common `block`, `element`, `modifier` examples are (`/` means the same as above):

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

### State Modifier

- `Visible` / `Invisible`
- `Shown` / `Hidden`
- `Enabled` / `Disabled`
- `Loading` / `Loaded`
- `Pending` / `Fulfilled` / `Rejected`
- `Success` / `Failure`
- `Active` / `Inactive`

## Function Names

### Endpoint Function

The endpoint function name should start with `api` prefix, and use verbs `get`, `create`, `update`, `upsert`, `delete`
to indicate the operation type:

To read the demo code below, please ensure you know the difference between HTTP methods and CRUD operation types:

- `GET` method is used to read data, which corresponds to `get` operation, it's **safe[^1]** and **idempotent[^2]**.
- `POST` method is used to create data, which corresponds to `create` operation, it's **not safe** and **not
  idempotent**.
- `PUT` method is used to update (replace) data, which corresponds to `update` operation, it's **not safe** but
  **idempotent**.
- `DELETE` method is used to delete data, which corresponds to `delete` operation, it's **not safe** but **idempotent**.
- `upsert` operation means to create or update data, which can be implemented by `PUT` method, because it's **not safe**
  but **idempotent**.

_model/user.ts_

```ts
import request from '@/utils/request.js'

/**
 * "apiGet${Data}" is used for endpoint function with "GET"
 method and "get" operation.
 */
export async function apiGetUserInfo(params?: Record<string, any>) {
  return await request.get('/user/info', { params })
}

/**
 * "apiCreate${Data}" is used for endpoint function with "POST"
 method and "create" operation.
 */
export async function apiCreateUserInfo(data: Record<string, any>) {
  return await request.post('/user/info', { data })
}

/**
 * "apiUpdate${Data}" is used for endpoint function with "PUT"
 method and "update" operation.
 */
export async function apiUpdateUserInfo(data: Record<string, any>) {
  return await request.put('/user/info', { data })
}

/**
 * "apiUpdate${Data}${Attribute}" is used for endpoint function
  with "PUT" method and "update" operation for specific
 * attribute.
 */
export async function apiUpdateUserInfoState(data: Record<string, any>) {
  return await request.put('/user/info/state', { data })
}

/**
 * "apiUpsert${Data}" is used for endpoint function with "PUT"
 method and "upsert" operation.
 */
export async function apiUpsertUserInfo(data: Record<string, any>) {
  return await request.put('/user/info', { data })
}

/**
 * "apiDelete${Data}" is used for endpoint function with "DELETE"
  method and "delete" operation.
 */
export async function apiDeleteUserInfo(data: Record<string, any>) {
  return await request.delete('/user/info', { data })
}
```

### Vue Component Method

The Vue component method name should start with verbs `get`, `create`, `update`, `upsert`, `delete` to indicate the
operation type, and add more details to indicate the purpose of the method:

_pages/users.vue_

```html
<script setup lang="ts">
  import { apiGetUserInfo, apiUpdateUserInfo } from '@/api/user'
  import { ref, onMounted } from 'vue'

  const userInfo = ref(null)

  async function getUserInfo() {
    userInfo.value = await apiGetUserInfo()
  }

  async function createUserInfo(data: Record<string, any>) {
    await apiCreateUserInfo(data)
  }

  async function updateUserInfo(data: Record<string, any>) {
    await apiUpdateUserInfo(data)
  }

  async function updateUserInfoState(data: Record<string, any>) {
    await apiUpdateUserInfoState(data)
  }

  onMounted(() => {
    getUserInfo()
  })
</script>

<template>
  <div>
    <h1>User Info</h1>
    <pre>{{ userInfo }}</pre>
    <button @click="getUserInfo()">Refresh</button>
    <button @click="createUserInfo({ name: 'New User' })">Create New User Named "New User"</button>
    <button @click="updateUserInfo({ id: 1, name: 'New Name' })">
      Update (Replace) User Name to "New Name" With ID "1"
    </button>
    <button @click="updateUserInfoState({ id: 1, state: 'active' })">
      Update (Replace) User State to "active" With ID "1"
    </button>
  </div>
</template>
```

[^1]: Safe means that the operation does not modify any data on the server.

[^2]: Idempotent means that performing the operation multiple times has the same effect as performing it once.
