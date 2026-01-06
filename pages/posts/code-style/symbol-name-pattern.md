---
title: 'Code Style: Symbol Name Pattern'
date: 2025-09-23T15:58:00+08:00
update: 2026-01-06T10:56+08:00
lang: en
duration: 6min
type: blog+note
---

[[toc]]

## Why We Need to Care About Symbol Name Patterns?

In a huge Vue project, we may have thousands of symbols, likes variable names, function names, hook names, component names, etc. If we cannot encapsulate and modularize them, the only thing we can do is to use the better naming patterns to improve the code readability and maintainability.

This article will introduce some naming patterns I preferred in my projects.

## Variable Names

### Recommended Pattern

The recommended variable name pattern has the similar concept with BEM (Block Element Modifier) class name pattern:

```ts
// When the variable is none-state, modifier is a type or purpose of the variable
'(block)[Element][Modifier]'

// When the variable is a state, modifier is a state description
'(is|has|can|should)(Block)[Element][Modifier]'
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

The prefix verbs for state variables are used to introduce the state type:

- `is`: The current state
- `has`: The possession state
- `can`: The ability
- `should`: The necessity

For a really huge amount of symbols, you should not only follow the naming patterns but also [encapsulate and modularize](encapsulation-and-modularity.md) them into components, composables, or modules.

### Common Examples

Some common `block`, `element`, `modifier` examples are (`~` means the same as above):

| Block                                          | Element      | Modifier                                                        |
| ---------------------------------------------- | ------------ | --------------------------------------------------------------- |
| form                                           | /            | [None-state](#none-state-modifier) vs. [State](#state-modifier) |
|                                                | Item         | ~                                                               |
|                                                | Input        | ~                                                               |
|                                                | Select       | ~                                                               |
|                                                | ...          | ...                                                             |
| table                                          | /            | ~                                                               |
|                                                | Column       | ~                                                               |
|                                                | Row          | ~                                                               |
|                                                | Cell         | ~                                                               |
|                                                | ...          | ...                                                             |
| dialog                                         | Header       | ~                                                               |
|                                                | Body/Content | ~                                                               |
|                                                | Footer       | ~                                                               |
|                                                | ...          | ...                                                             |
| menu<br>dropmenu<br>sidemenu<br>navmenu<br>... | /            | ~                                                               |
|                                                | Group        | ~                                                               |
|                                                | Item         | ~                                                               |
|                                                | ...          | ...                                                             |
| card                                           | /            | ~                                                               |
|                                                | Header       | ~                                                               |
|                                                | Body/Content | ~                                                               |
|                                                | Footer       | ~                                                               |
|                                                | Cover        | ~                                                               |
|                                                | ...          | ...                                                             |

### None-state Modifier

- Data: Just data.
- Ref(s): The reference(s) to the DOM element(s) or component instance(s).
- Config(s): Some custom setting(s) or something similar.
- Options: Dropdown options, each option contains the label and value.
- ...

### State Modifier

Visibility States:

- Visible / Invisible: Passive visibility state.
- Shown / Hidden: Proactive visibility state.
- ...

Activation States:

- Active / Inactive (Selected / Deselected, Checked / Unchecked, ...): Passive activation state.
- Enabled / Disabled: Proactive activation state.
- ...

Async Task States:

- Pending / Fulfilled / Rejected
- Pending / Success / Failure
- Loading / Loaded / Unloaded
- ...

Others:

- ...

## Function Names

### Endpoint Function

#### Recommended Pattern

The recommended endpoint function name pattern is similar:

`(verb)(Data)[Condition]`

For example:

```ts
/**
 * "getUserById" is used to get single user by id. `verb` is "get", `Data` is
 * "User", `Condition` is "ById".
 */
export async function getUserById(id: Pick<User, 'id'>): Promise<User> {
  return await request.get('/user', { params: { id } })
}

/**
 * "listActiveUsers" is used to list multiple active users. `verb` is "list",
 * `data` is `ActiveUsers`.
 */
export async function listActiveUsers(): Promise<User[]> {
  return await request.get('/users', { params: { status: 'active' } })
}
```

These prefix verbs (e.g. `get`, `create`, `update`, `upsert`, `delete`) are used to introduce the operation type or purpose.

#### Common Examples

> [!Note]
>
> Before you reading the introduction below, please ensure you know the difference between HTTP methods and commonly used CRUD operation types.

- `GET` method is used to read data, it's **safe[^1]** and **idempotent[^2]**. The acceptable verbs are:
  - `get` for getting **single data**.
  - `list` for listting **multiple data**.
  - `find` for finding **with dynamic conditions**.
  - `search` for searching **with keyword**.
  - `query` for querying **with complex conditions and pagination**.

  E.g.:

  ```ts
  /**
   * Mocked user interface.
   */
  export interface User {
    id: string
    username: string
    name: string
    sex: number
    phone: number
    avatarUrl?: string
    email?: string
    address?: string
    status: 'active' | 'inactive'
    // ...
  }

  /**
   * Mocked query param interface.
   */
  export interface QueryParam<DataT> {
    page?: number
    pageSize?: number
    sortBy?: keyof DataT
    sortOrder?: 'asc' | 'desc'
    filters?: Partial<DataT>
    // ...
  }

  /**
   * Mocked page interface.
   */
  export interface Page<DataT> {
    data: DataT[]
    total: number
    // ...
  }

  /**
   * Get single user.
   */
  export async function getUser(id: Pick<User, 'id'>): Promise<User> {
    return await request.get('/user', { params: { id } })
  }

  /**
   * List multiple users.
   */
  export async function listUsers(): Promise<User[]> {
    return await request.get('/users')
  }

  /**
   * List active users. (Static conditions still use `list` as the verb.)
   */
  export async function listActiveUsers(): Promise<User[]> {
    return await request.get('/users', { params: { status: 'active' } })
  }

  /**
   * Find users with conditions.
   */
  export async function findUsers(params: Partial<User>): Promise<User[]> {
    return await request.get('/users', { params })
  }

  /**
   * Find users by status.
   */
  export async function findUsersByStatus(
    status: Pick<User, 'status'>
  ): Promise<User[]> {
    return await request.get('/users', { params: { status } })
  }

  /**
   * Search users with keyword. This keyword maybe match multiple fields. For
   * example, name, email, phone, etc.
   */
  export async function searchUsers(keyword: string): Promise<User[]> {
    return await request.get('/users/search', { params: { q: keyword } })
  }

  /**
   * Query users with complex conditions and pagination.
   */
  export async function queryUsers(
    params: QueryParam<User>
  ): Promise<Page<User>> {
    return await request.get('/users/query', { params })
  }
  ```

- `POST` method is used to create data, it's **not safe** and **not idempotent**. The acceptable verbs are:
  - `create` for creating **new data**.
  - `add` for adding **data to a collection**.
  - ... For some special scenarios, you can also use `register`, `login`, `upload`, etc.

  E.g.:

  ```ts
  export interface User {
    id: string
    username: string
    name: string
    sex: number
    phone: number
    avatarUrl?: string
    email?: string
    address?: string
    status: 'active' | 'inactive'
    // ...
  }

  /**
   * Mocked sensitive user data interface, with sensitive information, used
   * for registration and login.
   */
  export interface SensitiveUser extends User {
    password: string
  }

  export interface Group {
    id: string
    // ...
  }

  /**
   * Create new user.
   */
  export async function createUser(data: Partial<User>): Promise<User> {
    return await request.post('/user', { data })
  }

  /**
   * Add user to a group.
   */
  export async function addUserToGroup(
    userId: Pick<User, 'id'>,
    groupId: Pick<Group, 'id'>
  ): Promise<void> {
    return await request.post('/group/user', { data: { userId, groupId } })
  }

  /**
   * Register new user.
   */
  export async function registerUser(
    data: Partial<SensitiveUser>
  ): Promise<User> {
    return await request.post('/user/register', { data })
  }

  /**
   * Login user.
   */
  export async function loginUser(
    username: Pick<SensitiveUser, 'username'>,
    password: Pick<SensitiveUser, 'password'>
  ): Promise<{ token: string }> {
    return await request.post('/user/login', { data: { username, password } })
  }

  /**
   * Upload user avatar.
   */
  export async function uploadUserAvatar(
    userId: Pick<User, 'id'>,
    file: File
  ): Promise<string> {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('file', file)
    return await request.post('/user/avatar', { data: formData })
  }
  ```

- `PUT` and `PATCH` method is used to update data, they're **not safe** but **idempotent**. The acceptable verbs are:
  - `update` for updating **(partially or fully)** existing data.
  - `patch` for exactly **partially updating** existing data.
  - `replace` for exactly **fully updating** existing data.

  E.g.:

  ```ts
  export interface User {
    id: string
    username: string
    name: string
    avatarUrl?: string
    sex: number
    phone: number
    email?: string
    address?: string
    status: 'active' | 'inactive'
    // ...
  }

  /**
   * Update (partially or fully) existing user.
   */
  export async function updateUser(
    data: Pick<User, 'id'> & Partial<Omit<User, 'id'>>
  ): Promise<User> {
    return await request.put('/user', { data })
    // Or
    // return await request.patch('/user', { data })
  }

  /**
   * Patch (partially update) existing user.
   */
  export async function patchUserStatus(
    id: Pick<User, 'id'>,
    status: Pick<User, 'status'>
  ): Promise<User> {
    return await request.patch('/user/status', { data: { id, status } })
  }

  /**
   * Replace (fully update) existing user.
   */
  export async function replaceUser(data: User): Promise<User> {
    return await request.put('/user/replace', { data })
  }
  ```

- `DELETE` method is used to delete data, it's **not safe** but **idempotent**. The acceptable verb is:
  - `delete` for deleting **existing data**.
  - ... For some special scenarios, you can also use `revoke`, etc.

  E.g.:

  ```ts
  export interface User {
    id: string
    // ...
  }

  export async function deleteUser(id: Pick<User, 'id'>): Promise<void> {
    return await request.delete('/user', { data: { id } })
  }

  export async function revokeUserAccess(id: Pick<User, 'id'>): Promise<void> {
    return await request.delete('/user/access', { data: { id } })
  }
  ```

- Upsert operation means to create or update data, which can be implemented by `PUT` method, because it's **not safe** but **idempotent**, and it uses the verb `upsert`.

  E.g.:

  ```ts
  export interface User {
    id: string
    username: string
    name: string
    // ...
  }

  export async function upsertUser(data: User): Promise<User> {
    return await request.put('/user/upsert', { data })
  }
  ```

To learn more about HTTP methods, please read the [computer network manual](/posts/manual/computer-network-manual.md#http-methods).

> [!Note]
>
> If you have try this rule in practice, you may find that it's more like a fantastic imagination, because when you work on a team, you cannot influence others' behavior:
>
> You may receive a endpoint function used to query data but with `POST` method, and the instigator just tells you: "I feel lazy to create a standlone DTO for query params, so I use `POST` method directly. Just make some adjustments yourself!".
>
> So how could we handle these situations? I suggest you to categorize the endpoint functions not only by their HTTP methods but also by their **purposes**.

### Validation Function

#### Recommended Pattern

The recommended validation function name pattern is:

`(is|has|can|should|validate|check)(Subject)[Condition]`

These prefix verbs are used to introduce the validation type:

- `is`: Check the current state
- `has`: Check the possession
- `can`: Check the ability
- `should`: Check the necessity
- `validate`: Validate the correctness
- `check`: General check (nothing is invalid, so we use check instead of validate)

### Event Handler Function

#### Recommended Pattern

The event handler function name should start with verbs `on`, `after`, `before` to indicate the event handler type.

`on|after|before(Event)[Condition]`

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

// [!code highlight:10]
/**
 * "beforeUserInfoChange" is used to handle the event before user info
 * changes. `Event` is "UserInfoChange", `Condition` is none.
 */
async function beforeUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  console.log('User info changed before:', oldUserInfo, newUserInfo)
}

// [!code highlight:11]
/**
 * "onUserInfoChange" is used to handle the event when user info changes.
 * `Event` is "UserInfoChange", `Condition` is none.
 */
async function onUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  userInfo.value = newUserInfo
  console.log('User info changed:', oldUserInfo, newUserInfo)
}

// [!code highlight:10]
/**
 * "afterUserInfoChange" is used to handle the event after user info
 * changes. `Event` is "UserInfoChange", `Condition` is none.
 */
async function afterUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  console.log('User info changed after:', oldUserInfo, newUserInfo)
}
</script>

<template>
  <div>
    // [!code highlight:6]
    <UserInfoCard
      :user="userInfo"
      @before-change="beforeUserInfoChange"
      @change="onUserInfoChange"
      @after-change="afterUserInfoChange"
    />
  </div>
</template>
```

### Business Logic Function

There is no best practice for business logic function names, you can name them according to their purposes, just make sure the names can **express their functionalities clearly**.

A good example:

```ts
/**
 * "calcDiscountedPrice" is used to calculate discounted price.
 */
export function calcDiscountedPrice(
  originalPrice: number,
  discountRate: number
): number {
  return originalPrice * (1 - discountRate)
}
```

A bad example:

```ts
/**
 * "calcPrice" is too general to express its functionality.
 */
export function calcPrice(
  originalPrice: number,
  discountRate: number
): number {
  return originalPrice * (1 - discountRate)
}
```

[^1]: Safe means that the operation does not modify any data on the server.

[^2]: Idempotent means that performing the operation multiple times has the same effect as performing it once.
