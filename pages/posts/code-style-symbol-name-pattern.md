---
title: 'Code Style: Symbol Name Pattern'
date: 2025-09-23T15:58+08:00
update: 2026-02-09T22:44+08:00
lang: en
duration: 14min
type: blog+note
---

[[toc]]

## Why We Need to Care About Symbol Name Patterns?

> [!Note]
>
> Of course, name patterns are always the fallback options, [encapsulate and modularize](encapsulation-and-modularity.md) is the better way to improve the code readability and maintainability.
>
> The rule of thumb is: **single responsibility principle**, which means each module, class, function or variable should have only one reason to change.

In a huge project, we may have thousands of symbols, likes variable names, function names etc. If we cannot encapsulate and modularize them (E.g., the project manager has pressed your working hours, or you don’t want to wipe the ass of the original developer), the only thing we can do is to use the better naming patterns to improve the code readability and maintainability.

This article will introduce some naming patterns I preferred in my projects.

## Variable Names

The recommended variable name pattern has the similar concept with BEM (Block Element Modifier) class name pattern in Web application development:

```ts
/**
 * Variables are used to store something,
 * so the variable name needs to clearly express
 * what the storage thing is and its necessary characteristics.
 *
 * There are some core concepts:
 * - What do we call this thing? -> Element
 * - Who does the Element belong to? -> Block
 * - Is there any special characteristics? -> Modifier
 *
 * Notice, we think about the Element, then Block, finally Modifier,
 * but we put the Modifier first, then Block, finally Element,
 * this is to fit the human reading habits.
 *
 * What's more, when the Element and Block are both the thing itself,
 * we can omit the Block.
 *
 * Modifier is optional, of course.
 *
 * Base on this, we can categorize variables into stateful & non-state.
 */

/**
 * This is non-state pattern.
 */
'[Modifier][Block](Element)'

/**
 * This is stateful pattern.
 *
 * It usually starts with a state verb to indicate it's a state variable,
 * and the core concept has some differences:
 * - Who does this state related to? -> Element
 * - Who does the Element belong to? -> Block
 * - What is the specific state? -> Modifier
 *
 * Notice, for stateful variables, we put the Modifier last,
 * and state verb first.
 *
 * Only Block can be omitted when it's the same to Element.
 *
 * The commonly used state verbs are: is, been, will, has, can, should.
 */
'(StateVerb)[Block](Element)(Modifier)'
```

Let's look at a Vue page component example, for better comprehension:

_src/pages/configure-product.vue_

```vue
<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { TypeEnum } from '@/enums/product'

interface FormData {
  name: string | null
  email: string | null
  type: TypeEnum
}
// [!code highlight:70]
/**
 * "DEFAULT_FORM_DATA" means the thing stored in this variable is a "data",
 * it's belong to "form", and it's the default one.
 *
 * In this example, "Block" is "form", "Element" is "Data",
 * "Modifier" is "Default".
 */
const DEFAULT_FORM_DATA = {
  name: null,
  email: null,
  type: TypeEnum.GENERAL,
} as const satisfies FormData
/**
 * "formData" means the thing stored in this variable is a "data",
 * it's belong to "form".
 *
 * Based on this, we know we should initialize it with "DEFAULT_FORM_DATA",
 * and user may use input, select or other form controls to change its value,
 * and we may finally use submit it to backend or do other things.
 *
 * In this example, "Block" is "form", "Element" is "Data".
 */
const formData = ref<FormData>(structuredClone(DEFAULT_FORM_DATA))
/**
 * "formRef" means the thing stored in this variable is a "ref",
 * it's belong to "form".
 *
 * Based on this, we know this thing comes from the DOM,
 * and we can use it to operate the DOM element or component instance.
 *
 * In this example, "Block" is "form", "Element" is "Ref".
 */
const formRef = useTemplateRef('form')
/**
 * "isFormTypeGeneral" means the thing stored in this variable is a state,
 * because it starts with a state verb "is", and it's related to "Type",
 * and this type is belong to "Form", and the specific state is "General".
 *
 * In this example, "Block" is "form", "Element" is "Type",
 * "Modifier" is "General".
 */
const isFormTypeGeneral = computed(
  () => formData.value.type === TypeEnum.GENERAL
)

/**
 * "upsertFormRef" means the thing stored in this variable is a "ref",
 * it's belong to "upsertForm".
 *
 * In this example, "Block" is "upsertForm", "Element" is "Ref".
 */
const upsertFormRef = useTemplateRef('upsertForm')

/**
 * "tableData" means the thing stored in this variable is a "data",
 * it's belong to "table".
 */
const tableData = ref([
  { name: 'data1', email: 'data2' },
  { name: 'data3', email: 'data4' },
])
/**
 * "tableColumnConfigs" means the thing stored in this variable
 * is "columnConfigs", it's belong to "table".
 */
const tableColumnConfigs = ref([
  { label: 'Name', prop: 'name' },
  { label: 'Email', prop: 'email' },
])
</script>
```

The commonly used state verbs are:

- `is`, `been`, `will`: The current/past/future state
- `has`: The possession state
- `can`: The ability
- `should`: The necessity

## Function Names

### Endpoint Function

The recommended endpoint function name pattern is similar:

```ts
/**
 * Core concept:
 * - What operation does this endpoint function perform? -> EndpointVerb
 * - What is the main element this endpoint function operates on? -> Element
 * - Is there any special DYNAMIC conditions? -> Condition
 *
 * Different from variable name pattern, we put the EndpointVerb first,
 * then Element, finally Condition, this is to fit the human reading habits.
 */
'(EndpointVerb)(Element)[Condition]'
```

For example:

```ts
/**
 * "getUserById" is a "get" endpoint function, because it's used to get
 * single data. `Element` is "User", `Condition` (DYNAMIC) is "ById", which means we
 * need to provide user id to get the user.
 */
export async function getUserById(id: Pick<User, 'id'>): Promise<User> {
  return await request.get('/user', { params: { id } })
}

/**
 * "listActiveUsers" is a "list" endpoint function, because it's used to list
 * multiple data. `Element` is "ActiveUser".
 *
 * Notice, we recognize the static condition "Active" as part of the Element.
 */
export async function listActiveUsers(): Promise<User[]> {
  return await request.get('/users', { params: { status: 'active' } })
}
```

#### Endpoint Verbs based on HTTP Methods

> [!Note]
>
> Before you reading the introduction below, please ensure you know the difference between HTTP methods and commonly used CRUD operation types.

Generally, we can know what operation an endpoint function performs by its HTTP method, so we can categorize endpoint functions by their HTTP methods, and then use different verbs for different HTTP methods.

- `GET` method is used to read data, it's **safe[^1]** and **idempotent[^2]**. The acceptable verbs are:
  - `get` for getting **single data**.
  - `list` for getting **multiple data**.
  - `search` for getting **multiple data** with **keyword matching**.
  - `query` for getting **multiple data** with **pagination**.

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
   * List multiple users without any conditions.
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
   * List users with dynamic conditions.
   */
  export async function listUsersByConditions(params: Partial<User>): Promise<User[]> {
    return await request.get('/users', { params })
  }

  /**
   * List users by dynamic status.
   */
  export async function listUsersByStatus(
    status: Pick<User, 'status'>
  ): Promise<User[]> {
    return await request.get('/users', { params: { status } })
  }

  /**
   * Search users with keyword. This keyword maybe match multiple fields. For
   * example, name, email, phone, etc.
   *
   * You can add "ByNameAndEmail" to the function name as the "Condition",
   * or just use comment to explain the keyword matching fields if
   * there are too many fields or the matching fields are changeable.
   */
  export async function searchUsers(keyword: string): Promise<User[]> {
    return await request.get('/users/search', { params: { q: keyword } })
  }

  /**
   * Query users with pagination.
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
  - `patch` for **emphasizing partially updating** existing data.
  - `replace` for **emphasizing fully updating** existing data.

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

To learn more about HTTP methods, please read the [computer network manual](manual-computer-network#http-methods).

> [!Note]
>
> If you have try this rule in practice, you may find that it's more like a fantastic imagination, because when you work on a team, you cannot influence others' behavior:
>
> You may receive a endpoint function used to query data but with `POST` method, and the instigator just tells you: "I feel lazy to create a standlone DTO for query params, so I use `POST` method directly. Just make some adjustments yourself!".
>
> Don't be discouraged, this is the time to show your professionalism: classify these annoying functions correctly based on your understanding of the business! 😀

### Validation Function/Method

Validation functions are used to check the state of something, so the recommended validation function name pattern is similar to the state variable name pattern:

`(StateVerb)(Element)[Condition]`

For example:

```ts
type Permission = 'read' | 'write' | 'delete'

const rolePermissionsMap: Record<string, Permission[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
}

interface User {
  id: string
  name: string
  roles: string[]
}
const user: User = {
  id: 'user1',
  name: 'Alice',
  roles: ['admin', 'editor'],
}

/**
 * "hasPermission" is used to check whether the user has the specific
 * permission. "StateVerb" is "has", "Element" is "Permission"
 */
export function hasPermission(
  user: User,
  permission: Permission
): boolean {
  for (const role of user.roles) {
    const rolePermissions = rolePermissionsMap[role] || []
    if (rolePermissions.includes(permission)) {
      return true
    }
  }
  return false
}

console.log(hasPermission(user, 'write')) // true
console.log(hasPermission(user, 'delete')) // true
console.log(hasPermission(user, 'execute')) // false

/**
 * Notice, in this example, we have globally defined:
 *
 *   - Permission
 *   - rolePermissionsMap
 *   - User
 *   - user
 *   - hasPermission
 *
 * If there are also other validation functions, we will have more symbols,
 * e.g., "canEdit", "isActive", etc...
 */
```

**In practice, these functions should not be defined in the global scope, instead, they should be class methods or instance methods. In this way, we can avoid global function pollution. For example:**

```ts
type Permission = 'read' | 'write' | 'delete'

const rolePermissionsMap: Record<string, Permission[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
}

interface UserLike {
  id: string
  name: string
  roles: string[]
}
class User implements UserLike {
  id: string
  name: string
  roles: string[]

  constructor(id: string, name: string, roles: string[]) {
    this.id = id
    this.name = name
    this.roles = roles
  }

  /**
   * Now we transform it to a method of User class
   */
  hasPermission(permission: Permission): boolean {
    for (const role of this.roles) {
      const rolePermissions = rolePermissionsMap[role] || []
      if (rolePermissions.includes(permission)) {
        return true
      }
    }
    return false
  }
}
const user = new User('user1', 'Alice', ['admin', 'editor'])

console.log(user.hasPermission('write')) // true
console.log(user.hasPermission('delete')) // true
console.log(user.hasPermission('execute')) // false

/**
 * Now, we have globally defined:
 *
 *   - Permission
 *   - rolePermissionsMap
 *   - UserLike
 *   - User
 *   - user
 *
 * Whatever how many validation methods we need, there are always these symbols.
 */
```

These state verbs in validation function names mean:

- `is`, `been`, `will`: Check the current/past/future state
- `has`: Check the possession
- `can`: Check the ability
- `should`: Check the necessity

### Event Handler Function

The event handler function name should start with verbs `on`, `after`, `before` to indicate the event handler type.

`(on|after|before)(Event)[Condition]`

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

// [!code highlight:41]
/**
 * "beforeUserInfoChange" is trigger before user info changes.
 * "Event" is "UserInfoChange".
 */
async function beforeUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  console.log('User info changed before:', oldUserInfo, newUserInfo)
}

/**
 * "onUserInfoChange" is trigger when user info changes.
 * "Event" is "UserInfoChange".
 */
async function onUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  userInfo.value = newUserInfo
  console.log('User info changed:', oldUserInfo, newUserInfo)
}

/**
 * "afterUserInfoChange" is trigger after user info changes.
 * "Event" is "UserInfoChange".
 */
async function afterUserInfoChange(
  oldUserInfo: UserInfo | null,
  newUserInfo: UserInfo | null
) {
  console.log('User info changed after:', oldUserInfo, newUserInfo)
}

/**
 * "onAEventSuccess" is trigger when "an-event" is successful.
 * "Event" is "AnEvent", "Condition" is "Success".
 */
async function onAnEventSuccess(result: any) {
  console.log('An event success:', result)
}
</script>

<template>
  <div>
    // [!code highlight:7]
    <UserInfoCard
      :user="userInfo"
      @before-change="beforeUserInfoChange"
      @change="onUserInfoChange"
      @after-change="afterUserInfoChange"
      @an-event-success="onAnEventSuccess"
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
 * "calcPrice" is too general to express what price is calculated.
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
