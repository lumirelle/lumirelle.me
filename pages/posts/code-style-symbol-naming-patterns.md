---
title: 'Code Style: Symbol Naming Patterns'
date: 2025-09-23T15:58+08:00
update: 2026-04-21T19:09+08:00
lang: en
duration: 14min
type: blog+note
---

[[toc]]

## Why We Need to Care About Symbol Naming Patterns?

> [!Note]
>
> Of course, naming patterns are always the fallback options, [encapsulation and modularity](code-style-encapsulation-and-modularity) are the better ways to improve the code readability and maintainability.

In a huge project, we may have thousands of symbols, likes variable, function etc. If we cannot encapsulate and modularize them (E.g., the project manager has pressed your working hours, or you don’t want to wipe the ass of the original developer), the only thing we can do is to use the better naming patterns to improve the code readability and maintainability.

This article will introduce some naming patterns I preferred in my projects.

In a word, the rule of thumb is: **single responsibility principle**, which means each thing the symbol targets to should have only one reason to change, and this reason must be reflected in the symbol name.

> "Respond to all changes with constancy." -- My elementary school math teacher

To find a consistent way to handle most of cases, here we borrow the [BEM naming pattern](https://getbem.com/), and assign Block, Element, Modifier with different meanings based on the actual context. All of below naming patterns are based on BEM naming pattern.

## Variable Naming Pattern

For variables, the naming pattern is based on the stored data.

TL&DR: **Element is a subject shows what can we call this data, Block is a scope property shows who does the Element belong to, Modifier is a descriptive property shows what special characteristics this data has.**

A more precise statements are:

- The variable name should always contain a **subject**, which shows **what can we call this data**, and that's **Element**;

  ```ts
  // "name" is the subject of this variable,
  // so we recognize "Name" as an Element.
  const name = 'Alice'
  ```

- For required **scope properties**, we recognize it as **Block**, which shows **who does the Element belong to**. It can be omitted **only if** the Block can be easily inferred from the context, for better readability;

  ```ts
  // "user" is a scope property of "name",
  // so we recognize "user" as a Block, "Name" as an Element.
  const userName = 'Alice'

  const user = {
    // "name" is an Element, "user" is a Block.
    // Because the scope can be easily inferred from the context,
    // we can omit it for better readability.
    name: 'Alice'
  }
  ```

- For optional **descriptive properties**, we recognize them as **Modifier**. It's **required if** there are similar data with the same Element but different characteristics.

  ```ts
  // "first" is a descriptive property of "name",
  // so we recognize "first" as a Modifier, "Name" as an Element.
  const firstName = 'Alice'

  // "is...Valid" is a descriptive property of "name",
  // so we recognize "is...Valid" as a Modifier, "Name" as an Element.
  const isNameValid = true
  ```

Now let's look at some examples:

_src/xxx.ts_

```ts
// [!code focus:2]
// Element is "PRESET", Modifier is "BY_TYPE".
const PRESETS_BY_TYPE = {
  primary: { color: 'blue', size: 'large' },
  secondary: { color: 'gray', size: 'medium' },
  tertiary: { color: 'white', size: 'small' },
} as const
// [!code focus:2]
// Element is "PRESET", Modifier is "DEFAULT".
const DEFAULT_PRESET = PRESETS_BY_TYPE.primary

// ...

// [!code focus:4]
// Block is "user", Element is "Token".
let userToken = getUserToken()
// Block is "user", Element is "Token", Modifier is "is...Valid".
let isUserTokenValid = true
if (validateUserToken(userToken)) {
  isUserTokenValid = true
}
else {
  isUserTokenValid = false
}

if (!isUserTokenValid) {
  navigateTo('/login')
}
```

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
// [!code focus:4]
/**
 * Block is "form", Element is "Data", Modifier is "Default".
 */
const DEFAULT_FORM_DATA = {
  name: null,
  email: null,
  type: TypeEnum.GENERAL,
} as const satisfies FormData
// [!code focus:10]
/**
 * Block is "form", Element is "Data".
 *
 * We can even know this data maybe initialized by "DEFAULT_FORM_DATA",
 * because they have the same Element "Data",
 * and they have the same Block "form",
 * and "DEFAULT_FORM_DATA" has a Modifier "Default",
 * which means it's a default value of "formData".
 */
const formData = ref<FormData>(structuredClone(DEFAULT_FORM_DATA))
// [!code focus:4]
/**
 * Block is "form", Element is "Ref".
 */
const formRef = useTemplateRef('form')
// [!code focus:4]
/**
 * Block is "form", Element is "Type", Modifier is "is...General".
 */
const isFormTypeGeneral = computed(() => formData.value.type === TypeEnum.GENERAL)

// [!code focus:4]
/**
 * Block is "upsertForm", Element is "Ref".
 */
const upsertFormRef = useTemplateRef('upsertForm')

// [!code focus:4]
/**
 * Block is "table", Element is "Data".
 */
const tableData = ref([
  { name: 'data1', email: 'data2' },
  { name: 'data3', email: 'data4' },
])
// [!code focus:4]
/**
 * Block is "tableColumn", Element is "Configs".
 */
const tableColumnConfigs = ref([
  { label: 'Name', prop: 'name' },
  { label: 'Email', prop: 'email' },
])
</script>
```

## Function Naming Pattern

For functions, the naming pattern is based on the use.

TL&DR: **Block is a predicate shows what the functions does, Element is a object (antonyms of the subject) with its properties shows what the function returns / calls with, Modifier is a property shows what special characteristics this function has.**

A more precise statements are:

- The function name should always contain a **predicate**, which shows **what the function does**, and that's **Block**;

  ```ts
  // "add" is a predicate,
  // so we recognize "add" as a Block.
  declare function add(a: number, b: number): number
  ```

- For required **object (antonyms of the subject) with its properties**, we recognize it as **Element**, which shows **what the function returns / calls with**. It can be omitted **only if** the Element can be easily inferred from the context, for better readability;

  ```ts
  // "Number" is the object of this function,
  // so we recognize "add" as a Block, "Number" as an Element.
  declare function addNumber(a: number, b: number): number

  declare const MathUtils: {
    // "add" is a verb, "Number" is the object of this function,
    // because it's a method of "MathUtils",
    // we can easily infer the Element is "Number",
    // so we can omit the Element for better readability.
    add: (a: number, b: number) => number
  }

  // "count" is a verb, "UserPosts" is the object of this function,
  // notice, "User" here is a property of "Posts", not the function.
  declare function countUserPosts(userId: string): number
  ```

- For optional **properties**, we recognize them as **Modifier**. It's **required if** there are similar functions with the same Block and Element but different characteristics.

  ```ts
  // "ById" is a property of this function,
  // so we recognize "ById" as a Modifier, "get" as a Block, "User" as an Element.
  declare function getUserById(id: string): User
  ```

Let's look at some examples for different types of functions in the following sections.

### Endpoint Functions

For some basic examples:

```ts
// [!code focus:4]
/**
 * Block is "get", Element is "User", Modifier is "ById".
 */
export async function getUserById(id: Pick<User, 'id'>): Promise<User> {
  return await request.get('/user', { params: { id } })
}

// [!code focus:4]
/**
 * "Block" is "list", "Element" is "ActiveUsers".
 */
export async function listActiveUsers(): Promise<User[]> {
  return await request.get('/users', { params: { status: 'active' } })
}
```

Of course, with endpoint functions, we can futher induction some common Blocks (predicates) based on the HTTP methods (or their uses in some edge cases).

> [!Note]
>
> Before you reading the introduction below, please ensure you know the difference between HTTP methods and commonly used CRUD operation types.

> [!Note]
>
> GET, PUT & PATCH method requests can be distinguished by the nature of that request, while other method requests often use business verbs.

- `GET` method request is used to read data, it's **safe[^1]** and **idempotent[^2]**. They can be distinguished by the nature of the request:
  - `get` for **single data**.
  - `list` for **multiple data** (and that data are often used in dropdown).
  - `search` for **multiple data** with **keyword matching**.
  - `query` for **multiple data** with **pagination**.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Get single user.
   *
   * Block is "get", Element is "User".
   */
  export async function getUser(id: Pick<User, 'id'>): Promise<User> {
    return await request.get('/user', { params: { id } })
  }

  // [!code focus:6]
  /**
   * List multiple users without any conditions.
   *
   * Block is "list", Element is "Users".
   */
  export async function listUsers(): Promise<User[]> {
    return await request.get('/users')
  }
  // [!code focus:6]
  /**
   * List active users.
   *
   * Block is "list", Element is "ActiveUsers".
   */
  export async function listActiveUsers(): Promise<User[]> {
    return await request.get('/users', { params: { status: 'active' } })
  }
  // [!code focus:6]
  /**
   * List users with dynamic conditions.
   *
   * Block is "list", Element is "Users", Modifier is "ByConditions".
   */
  export async function listUsersByConditions(params: Partial<User>): Promise<User[]> {
    return await request.get('/users', { params })
  }
  // [!code focus:6]
  /**
   * List users by dynamic status.
   *
   * Block is "list", Element is "Users", Modifier is "ByStatus".
   */
  export async function listUsersByStatus(status: Pick<User, 'status'>): Promise<User[]> {
    return await request.get('/users', { params: { status } })
  }

  // [!code focus:7]
  /**
   * Search users with keyword. This keyword maybe match multiple fields. For
   * example, name, email, phone, etc.
   *
   * Block is "search", Element is "Users", Modifier is "ByKeyword".
   */
  export async function searchUsers(keyword: string): Promise<User[]> {
    return await request.get('/users/search', { params: { q: keyword } })
  }

  // [!code focus:6]
  /**
   * Query users with pagination.
   *
   * Block is "query", Element is "Users".
   */
  export async function queryUsers(params: QueryParam<User>): Promise<Page<User>> {
    return await request.get('/users/query', { params })
  }
  ```

- `POST` method request is used to create data, it's **not safe** and **not idempotent**. The acceptable verbs are:
  - `create` for **creating new data (from nothing)**.
  - `add` for **adding data (to a collection)**.
  - ... But more often to use business verbs like `register`, `login`, `upload`, etc.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Create new user.
   *
   * Block is "create", Element is "User".
   */
  export async function createUser(data: Partial<User>): Promise<User> {
    return await request.post('/user', { data })
  }

  // [!code focus:6]
  /**
   * Add user to a group.
   *
   * Block is "add", Element is "User", Modifier is "ToGroup".
   */
  export async function addUserToGroup(
    userId: Pick<User, 'id'>,
    groupId: Pick<Group, 'id'>,
  ): Promise<void> {
    return await request.post('/group/user', { data: { userId, groupId } })
  }

  // [!code focus:6]
  /**
   * Register new user.
   *
   * Block is "register", Element is "User".
   */
  export async function registerUser(data: Partial<SensitiveUser>): Promise<User> {
    return await request.post('/user/register', { data })
  }

  // [!code focus:6]
  /**
   * Login user.
   *
   * Block is "login", Element is "User".
   */
  export async function loginUser(
    username: Pick<SensitiveUser, 'username'>,
    password: Pick<SensitiveUser, 'password'>,
  ): Promise<{ token: string }> {
    return await request.post('/user/login', { data: { username, password } })
  }

  // [!code focus:6]
  /**
   * Upload user avatar.
   *
   * Block is "upload", Element is "UserAvatar".
   */
  export async function uploadUserAvatar(userId: Pick<User, 'id'>, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('file', file)
    return await request.post('/user/avatar', { data: formData })
  }
  ```

- `PUT` and `PATCH` method requests are used to update data, they're **not safe** but **idempotent**. The acceptable verbs are:
  - `update` for updating **(partially or fully)** existing data.
  - `patch` for **emphasizing partially updating** existing data.
  - `replace` for **emphasizing fully updating** existing data.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Update (partially or fully) existing user.
   *
   * Block is "update", Element is "User".
   */
  export async function updateUser(
    data: Pick<User, 'id'> & Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    return await request.put('/user', { data })
    // Or
    // return await request.patch('/user', { data })
  }

  // [!code focus:6]
  /**
   * Patch (partially update) existing user.
   *
   * Block is "patch", Element is "User".
   */
  export async function patchUserStatus(
    id: Pick<User, 'id'>,
    status: Pick<User, 'status'>,
  ): Promise<User> {
    return await request.patch('/user/status', { data: { id, status } })
  }

  // [!code focus:6]
  /**
   * Replace (fully update) existing user.
   *
   * Block is "replace", Element is "User".
   */
  export async function replaceUser(data: User): Promise<User> {
    return await request.put('/user/replace', { data })
  }
  ```

- `DELETE` method request is used to delete data, it's **not safe** but **idempotent**. The acceptable verb is:
  - `delete` for deleting **existing data**.
  - ... But more often to use business verbs like `revoke`, etc.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Delete existing user.
   *
   * Block is "delete", Element is "User".
   */
  export async function deleteUser(id: Pick<User, 'id'>): Promise<void> {
    return await request.delete('/user', { data: { id } })
  }

  // [!code focus:6]
  /**
   * Revoke user access.
   *
   * Block is "revoke", Element is "UserAccess".
   */
  export async function revokeUserAccess(id: Pick<User, 'id'>): Promise<void> {
    return await request.delete('/user/access', { data: { id } })
  }
  ```

There is a special case we need to pay attention to: **Upsert (Update or insert)**, which means to create or update data, can be implemented by `PUT` method, because it's **not safe** but **idempotent**, and it should only uses the verb `upsert`.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Upsert (update or insert) existing user.
   *
   * Block is "upsert", Element is "User".
   */
  export async function upsertUser(data: User): Promise<User> {
    return await request.put('/user/upsert', { data })
  }
  ```

To learn more about HTTP methods, please read the [computer network manual](manual-computer-network#http-methods).

> [!Note]
>
> If you have try this rule in practice, you may find that sometimes it's more like a unrealistic fantasies, because when you work on a team, you have no way to control others' behavior:
>
> You may receive a endpoint function from endpoint developer, and that function can be used to query data but must request by `POST` method, and the instigator just tells you: "I feel lazy to create a standlone DTO for query params, so I use `POST` method directly. Just make some adjustments yourself!".
>
> Don't be discouraged, this is the time to show your professionalism: In this case, you can classify these annoying functions based on the uses of the function! 😀

### State Checking Function/Method

For some basic examples:

```ts
// [!code focus:4]
/**
 * Block is "Has", Element is "Permission", Modifier is "user".
 */
export function userHasPermission(user: User, permission: Permission): boolean {
  for (const role of user.roles) {
    const rolePermissions = rolePermissionsMap[role] || []
    if (rolePermissions.includes(permission)) {
      return true
    }
  }
  return false
}
// [!code focus:4]
/**
 * Block is "Is", Element is "VIP", Modifier is "user".
 */
export function userIsVIP(user: User): boolean {
  return user.roles.includes('vip')
}
```

You may notice that, in above examples, we have a fixed Modifier "user" for these functions.

**In practice, these functions should not be defined in the global scope, instead, they should be class methods or instance methods.**

In this way, we can avoid global function pollution, also can omit the fixed Modifier. For example:

```ts
class User implements UserLike {
  id: string
  name: string
  roles: string[]

  constructor(id: string, name: string, roles: string[]) {
    this.id = id
    this.name = name
    this.roles = roles
  }

  // [!code focus:4]
  /**
   * Now we transform it to a method of User class, and omit the Modifier "user"!
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

  // [!code focus:4]
  /**
   * Now we transform it to a method of User class, and omit the Modifier "user"!
   */
  isVIP(): boolean {
    return this.roles.includes('vip')
  }
}
```

### Event Handler Function

For some basic examples:

```vue
<script setup lang="ts">
// [!code focus:4]
/**
 * Block is "before", Element is "UserInfoChange".
 */
async function beforeUserInfoChange(oldUserInfo: UserInfo | null, newUserInfo: UserInfo | null) {
  console.log('User info changed before:', oldUserInfo, newUserInfo)
}

// [!code focus:4]
/**
 * Block is "on", Element is "UserInfoChange".
 */
async function onUserInfoChange(oldUserInfo: UserInfo | null, newUserInfo: UserInfo | null) {
  userInfo.value = newUserInfo
  console.log('User info changed:', oldUserInfo, newUserInfo)
}

// [!code focus:4]
/**
 * Block is "after", Element is "UserInfoChange".
 */
async function afterUserInfoChange(oldUserInfo: UserInfo | null, newUserInfo: UserInfo | null) {
  console.log('User info changed after:', oldUserInfo, newUserInfo)
}

// [!code focus:4]
/**
 * Block is "on", Element is "AnEvent", Modifier is "Success".
 */
async function onAnEventSuccess(result: any) {
  console.log('An event success:', result)
}
</script>

<template>
  <div>
    // [!code focus:7]
    <UserInfoCard
      @before-change="beforeUserInfoChange"
      @change="onUserInfoChange"
      @after-change="afterUserInfoChange"
      @an-event-success="onAnEventSuccess"
    />
  </div>
</template>
```

Of course, with event handler functions, we can futher induction some common Blocks (predicates):

- `before` for **handling before the event happens**.
- `on` for **handling when the event happens**.
- `after` for **handling after the event happens**.

[^1]: Safe means that the operation does not modify any data on the server.

[^2]: Idempotent means that performing the operation multiple times has the same effect as performing it once.
