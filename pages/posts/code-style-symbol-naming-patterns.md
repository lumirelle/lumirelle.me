---
title: 'Code Style: Symbol Naming Patterns'
date: 2025-09-23T15:58+08:00
update: 2026-08-18T12:21+08:00
lang: en
duration: 19min
type: note
---

[[toc]]

## Why We Need to Care About Symbol Naming Patterns?

> [!Note]
>
> Of course, naming patterns are always the fallback options, [code organization](code-style-code-organization) is the better way to improve the code readability and maintainability.

In a huge project, we may have thousands of symbols, likes variable, function etc. If we cannot organize them (E.g., the project manager has pressed your working hours, or you don’t want to wipe the ass of your co-worker), the only thing we can do is to use the better naming patterns to improve the code readability and maintainability.

This article will introduce some naming patterns I preferred in my projects.

In a word, the rule of thumb is: **single responsibility principle**, which means each thing the symbol targets to should have only one reason to change, and this reason must be reflected in the symbol name.

> "Respond to all changes with never changing." -- My elementary school math teacher

To find a consistent way to handle most of cases, here we borrow the [BEM naming pattern](https://getbem.com/), and assign Block, Element, Modifier with different meanings based on the actual context. All of below naming patterns are based on BEM naming pattern.

But, in general, **Element** is the main target of the thing, **Block** shows the scope of the main target, **Modifier** may be the extra description or qualifier, just like the general meaning of BEM.

What's more, **camelCase**, **PascalCase** & **SCREAMING_SNAKE_CASE** are used based on the sematic of the thing.

## Variable Naming Pattern

For variables, the naming pattern is based on the stored data, so the stored data is **Element**.

TL&DR: **Element is a subject shows what can we call this data, Block is a scope property shows who does the Element belong to, Modifier is a descriptive property shows what special characteristics this data has.**

A more precise statements are:

- The variable name should always contain a **subject**, which shows **what can we call this data**, and that's **Element**;

  ```ts
  // "NAME" is the subject of this variable,
  // so we recognize "NAME" as an Element.
  const NAME = 'Alice'
  ```

- For required **scope properties**, we recognize it as **Block**, which shows **who does the Element belong to**. It can be omitted **only if** the Block can be easily inferred from the context, for better readability;

  ```ts
  // "USER" is a scope property of "NAME",
  // so we recognize "USER" as a Block, "NAME" as an Element.
  const USER_NAME = 'Alice'

  const user = {
    // "name" is an Element, "user" is a Block.
    // Because the scope can be easily inferred from the context,
    // we can omit it for better readability.
    name: 'Alice'
  }
  ```

- For optional **descriptive properties**, we recognize them as **Modifier**. It's **required if** there are similar data with the same Element but different characteristics.

  ```ts
  // "FIRST" is a descriptive property of "NAME",
  // so we recognize "FIRST" as a Modifier, "NAME" as an Element.
  const FIRST_NAME = 'Alice'

  // "is...Valid" is a descriptive property of "name",
  // so we recognize "is...Valid" as a Modifier, "Name" as an Element.
  let isNameValid = true
  ```

And you may already see, based on their sematic, we use **camelCase** for mutable variable, **SCREAMING_SNAKE_CASE** for truly immutable variable, which means a variable which is declared with `const` but stores a object reference should still use **camelCase**, `const` here just means that variable cannot be re-assigned, but be able to modify the value it has referenced.

Now let's look at more examples:

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
const userToken = getUserToken()
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
import { ProductType } from '@/enums/product'

// `FormData` is part of browser built-in API,
// we use `SubmitFormData` to distinguish our customized API.
interface SubmitFormData {
  name: string | null
  email: string | null
  type: ProductType
}
// [!code focus:4]
/**
 * Block is "FORM", Element is "DATA", Modifier is "DEFAULT".
 */
const DEFAULT_FORM_DATA = {
  name: null,
  email: null,
  type: ProductType.GENERAL,
} as const satisfies SubmitFormData
// [!code focus:10]
/**
 * Block is "form", Element is "Data".
 *
 * We can even know this data will be initialized by "DEFAULT_FORM_DATA",
 * because they have the same Element "Data",
 * and they have the same Block "form",
 * and "DEFAULT_FORM_DATA" has a Modifier "DEFAULT",
 * which means it's a default value of "formData".
 */
const formData = ref<SubmitFormData>(structuredClone(DEFAULT_FORM_DATA))
// [!code focus:4]
/**
 * Block is "form", Element is "Ref".
 */
const formRef = useTemplateRef('form')
// [!code focus:4]
/**
 * Block is "form", Element is "Type", Modifier is "is...General".
 */
const isFormTypeGeneral = computed(() => formData.value.type === ProductType.GENERAL)

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

For functions, the naming pattern is based on the use, so the use is **Element**.

TL&DR: **Element is a predicate shows what the functions does, Block is a object (antonyms of the subject) which may has additional descriptive properties shows what the function returns / calls with, Modifier is a descriptive property shows what special characteristics this function has.**

A more precise statements are:

- The function name should always contain a **predicate**, which shows **what the function does**, and that's **Element**;

  ```ts
  // "get" is a predicate,
  // so we recognize "get" as an Element.
  declare function get(userId: string): User
  ```

- For required **object (antonyms of the subject) which may has additional descriptive properties**, we recognize it as **Block**, which shows **what the function returns / calls with**. It can be omitted **only if** the Block can be easily inferred from the context, for better use;

  ```ts
  // "get" is a verb, "User" is the object of this function,
  // so we recognize "get" as an Element,
  // "User" as a Block.
  declare function getUser(userId: string): User

  // "log" is a predicate,
  // "Message" is object of this function,
  // so we recognize "log" as an Element.
  // "Message" as a Block.
  // People always "log" a "Message",
  // so we can omit the Block for better use.
  declare function log(message: string): void

  // "add" is a predicate,
  // "Numbers" & "Strings" are the objects of these functions,
  // so we recognize "add" as an Element,
  // "Numbers" & "Strings" as Blocks.
  // The type of function params of "add" functions
  // can reflect the objects of these functions,
  // so we can omit the Blocks for better use.
  declare function add(a: number, b: number): number
  declare function add(a: string, b: string): string
  // ...

  declare class UserRepository {
    // "add" is a verb, "User" is the object of this function,
    // because it's a method of "UserRepository",
    // we can easily infer the Block is "User",
    // so we can omit the Block for better use.
    get(userId: string): User
  }

  // "count" is a verb, "UserPosts" is the object of this function,
  // notice, "User" here is a property of "Posts", not the function.
  declare function countUserPosts(userId: string): number
  ```

- For optional **descriptive properties**, we recognize them as **Modifier**. It's **required if** there are similar functions with the same Block and Element but different characteristics, and who are hard to distingue within that context.

  ```ts
  // "ById" is a property of this function,
  // so we recognize "ById" as a Modifier, "User" as a Block, "get" as an Element.
  // Because we can easily infer "ById" from function param,
  // we can omit it for better use.
  declare function getUser(userId: string): User

  // "WithDefault" is a property of this function,
  // so we recognize "WithDefault" as a Modifier, "UserName" as a Block, "get" as an Element.
  declare function getUserNameWithDefault(userId: string): User
  ```

And we use **camelCase** for all of functions.

Let's look at more examples for different types of functions in the following sections.

### Endpoint Functions

For some basic examples:

```ts
// [!code focus:4]
/**
 * Block is "User", Element is "get".
 */
export async function getUser(id: Pick<User, 'id'>): Promise<User> {
  return await request.get('/user', { params: { id } })
// [!code focus:1]
}

// [!code focus:4]
/**
 * "Block" is "ActiveUsers", "Element" is "list".
 */
export async function listActiveUsers(): Promise<User[]> {
  return await request.get('/users', { params: { status: 'active' } })
// [!code focus:1]
}
```

Of course, with endpoint functions, we can futher induction some **common Blocks (predicates)** based on the HTTP methods (or their uses in some edge cases).

> [!Note]
>
> Before you reading the introduction below, please ensure you know the difference between HTTP methods and commonly used CRUD operation types.

> [!Note]
>
> `GET`, `PUT` & `PATCH` method requests can be distinguished by the nature of that request, while other method requests often use business verbs.

- `GET` method request is used to read data, it's **safe[^1]** and **idempotent[^2]**. They can be distinguished by the nature of the request:
  - `get` for **single data**.
  - `list` for **multiple data**.
  - `search` for **multiple data** with **keyword matching**.
  - `query` for **multiple data** with **pagination**.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Get single user.
   *
   * Block is "User", Element is "get".
   */
  export async function getUser(id: Pick<User, 'id'>): Promise<User> {
    return await request.get('/user', { params: { id } })
  // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * List multiple users with optional dynamic conditions.
   *
   * Block is "Users", Element is "list".
   */
  export async function listUsers(params: Partial<User>): Promise<User[]> {
    return await request.get('/users', { params })
  // [!code focus:1]
  }
  // [!code focus:6]
  /**
   * List active users.
   *
   * Block is "ActiveUsers", Element is "list".
   */
  export async function listActiveUsers(): Promise<User[]> {
    return await request.get('/users', { params: { status: 'active' } })
  // [!code focus:1]
  }

  // [!code focus:7]
  /**
   * Search users with keyword. This keyword maybe match multiple fields. For
   * example, name, email, phone, etc.
   *
   * Block is "Users", Element is "search".
   */
  export async function searchUsers(nameOrEmail: string): Promise<User[]> {
    return await request.get('/users/search', { params: { keyword: nameOrEmail } })
  // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Query users with pagination.
   *
   * Block is "Users", Element is "query".
   */
  export async function queryUsers(params: QueryParam<User>): Promise<Page<User>> {
    return await request.get('/users/query', { params })
  // [!code focus:1]
  }
  ```

  <details>

  <summary>Advanced: Repository Pattern:</summary>

  ```ts
  // [!code focus:2]
  // With Repository Pattern, we can omit "User" from the Block.
  export function userRepository() {
    return {
      // [!code focus:6]
      /**
       * Get single user.
       *
       * Element is "get".
       */
      get(id: Pick<User, 'id'>): Promise<User> {
        return await request.get('/user', { params: { id } })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * List multiple users with optional dynamic conditions.
       *
       * Element is "list".
       */
      list(params: Partial<User>): Promise<User[]> {
        return await request.get('/users', { params })
        // [!code focus:1]
      },
      // [!code focus:7]
      /**
       * List active users.
       *
       * Modifier is "Active", Element is "list".
       * Notice, "Active" now is not a part of Block.
       */
      listActive(): Promise<User[]> {
        return await request.get('/users', { params: { status: 'active' } })
        // [!code focus:1]
      },

      // [!code focus:7]
      /**
       * Search users with keyword. This keyword maybe match multiple fields. For
       * example, name, email, phone, etc.
       *
       * Element is "search".
       */
      search(nameOrEmail: string): Promise<User[]> {
        return await request.get('/users/search', { params: { keyword: nameOrEmail } })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Query users with pagination.
       *
       * Element is "query".
       */
      query(params: QueryParam<User>): Promise<Page<User>> {
        return await request.get('/users/query', { params })
        // [!code focus:1]
      }
    }
  // [!code focus:1]
  }
  ```

  </details>

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
   * Block is "User", Element is "create".
   */
  export async function createUser(data: Partial<User>): Promise<User> {
    return await request.post('/user', { data })
  // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Add user to a group.
   *
   * Block is "User", Element is "add", Modifier is "ToGroup".
   */
  export async function addUserToGroup(
    userId: Pick<User, 'id'>,
    groupId: Pick<Group, 'id'>,
  ): Promise<void> {
    return await request.post('/group/user', { data: { userId, groupId } })
  // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Register new user.
   *
   * Block is "User", Element is "register".
   */
  export async function registerUser(data: Partial<SensitiveUser>): Promise<User> {
    return await request.post('/user/register', { data })
  // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Login user.
   *
   * Block is "User", Element is "login".
   */
  export async function loginUser(
    username: Pick<SensitiveUser, 'username'>,
    password: Pick<SensitiveUser, 'password'>,
  ): Promise<{ token: string }> {
    return await request.post('/user/login', { data: { username, password } })
  // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Upload user avatar.
   *
   * Block is "UserAvatar", Element is "upload".
   */
  export async function uploadUserAvatar(userId: Pick<User, 'id'>, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('file', file)
    return await request.post('/user/avatar', { data: formData })
  // [!code focus:1]
  }
  ```

  <details>

  <summary>Advanced: Repository Pattern:</summary>

  ```ts
  // [!code focus:1]
  export function userRepository() {
    return {
      // [!code focus:6]
      /**
       * Create new user.
       *
       * Element is "create".
       */
      create(data: Partial<User>): Promise<User> {
        return await request.post('/user', { data })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Add user to a group.
       *
       * Element is "add", Modifier is "ToGroup".
       */
      addToGroup(
        userId: Pick<User, 'id'>,
        groupId: Pick<Group, 'id'>,
      ): Promise<void> {
        return await request.post('/group/user', { data: { userId, groupId } })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Register new user.
       *
       * Element is "register".
       */
      register(data: Partial<SensitiveUser>): Promise<User> {
        return await request.post('/user/register', { data })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Login user.
       *
       * Element is "login".
       */
      login(
        username: Pick<SensitiveUser, 'username'>,
        password: Pick<SensitiveUser, 'password'>,
      ): Promise<{ token: string }> {
        return await request.post('/user/login', { data: { username, password } })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Upload user avatar.
       *
       * Block is "Avatar", Element is "upload".
       */
      uploadAvatar(userId: Pick<User, 'id'>, file: File): Promise<string> {
        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('file', file)
        return await request.post('/user/avatar', { data: formData })
        // [!code focus:1]
      }
    }
  // [!code focus:1]
  }
  ```

  </details>

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
   * Block is "User", Element is "update".
   */
  export async function updateUser(
    data: Pick<User, 'id'> & Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    return await request.put('/user', { data })
    // Or
    // return await request.patch('/user', { data })
    // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Patch (partially update) existing user.
   *
   * Block is "UserStatus", Element is "patch".
   */
  export async function patchUserStatus(
    id: Pick<User, 'id'>,
    status: Pick<User, 'status'>,
  ): Promise<User> {
    return await request.patch('/user/status', { data: { id, status } })
    // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Replace (fully update) existing user.
   *
   * Block is "User", Element is "replace".
   */
  export async function replaceUser(data: User): Promise<User> {
    return await request.put('/user/replace', { data })
    // [!code focus:1]
  }
  ```

  <details>

  <summary>Advanced: Repository Pattern:</summary>

  ```ts
  // [!code focus:1]
  export function userRepository() {
    return {
      // [!code focus:6]
      /**
       * Update (partially or fully) existing user.
       *
       * Element is "update".
       */
      update(
        data: Pick<User, 'id'> & Partial<Omit<User, 'id'>>,
      ): Promise<User> {
        return await request.put('/user', { data })
        // Or
        // return await request.patch('/user', { data })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Patch (partially update) existing user.
       *
       * Block is "Status", Element is "patch".
       */
      patchStatus(
        id: Pick<User, 'id'>,
        status: Pick<User, 'status'>,
      ): Promise<User> {
        return await request.patch('/user/status', { data: { id, status } })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Replace (fully update) existing user.
       *
       * Element is "replace".
       */
      replace(data: User): Promise<User> {
        return await request.put('/user/replace', { data })
        // [!code focus:1]
      }
    }
  }
  ```

  </details>

- `DELETE` method request is used to delete data, it's **not safe** but **idempotent**. The acceptable verb is:
  - `delete` for deleting **existing data**.
  - ... But more often to use business verbs like `revoke`, etc.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Delete existing user.
   *
   * Block is "User", Element is "delete".
   */
  export async function deleteUser(id: Pick<User, 'id'>): Promise<void> {
    return await request.delete('/user', { data: { id } })
    // [!code focus:1]
  }

  // [!code focus:6]
  /**
   * Revoke user access.
   *
   * Block is "UserAccess", Element is "revoke".
   */
  export async function revokeUserAccess(id: Pick<User, 'id'>): Promise<void> {
    return await request.delete('/user/access', { data: { id } })
    // [!code focus:1]
  }
  ```

  <details>

  <summary>Advanced: Repository Pattern:</summary>

  ```ts
  // [!code focus:1]
  export function userRepository() {
    return {
      // [!code focus:6]
      /**
       * Delete existing user.
       *
       * Element is "delete".
       */
      delete(id: Pick<User, 'id'>): Promise<void> {
        return await request.delete('/user', { data: { id } })
        // [!code focus:1]
      },

      // [!code focus:6]
      /**
       * Revoke user access.
       *
       * Block is "Access", Element is "revoke".
       */
      revokeAccess(id: Pick<User, 'id'>): Promise<void> {
        return await request.delete('/user/access', { data: { id } })
        // [!code focus:1]
      }
    }
    // [!code focus:1]
  }
  ```

  </details>

There is a special case we need to pay attention to: **Upsert (Update or insert)**, which means to create or update data, can be implemented by `PUT` method, because it's **not safe** but **idempotent**, and it should only uses the verb `upsert`.

  E.g.:

  ```ts
  // [!code focus:6]
  /**
   * Upsert (update or insert) existing user.
   *
   * Block is "User", Element is "upsert".
   */
  export async function upsertUser(data: User): Promise<User> {
    return await request.put('/user/upsert', { data })
    // [!code focus:1]
  }
  ```

  <details>

  <summary>Advanced: Repository Pattern:</summary>

  ```ts
  // [!code focus:1]
  export function userRepository() {
    return {
      // [!code focus:6]
      /**
       * Upsert (update or insert) existing user.
       *
       * Block is "User", Element is "upsert".
       */
      upsertUser(data: User): Promise<User> {
        return await request.put('/user/upsert', { data })
        // [!code focus:1]
      }
    }
    // [!code focus:1]
  }
  ```

  </details>

To learn more about HTTP methods, please read the [computer network manual](manual-computer-network#http-methods).

> [!Note]
>
> If you have try this rule in practice, you may find that sometimes it's more like a unrealistic fantasies, because when you work on a team, you have no way to control others' behavior:
>
> You may receive a endpoint function from endpoint developer, and that function can be used to **query data** but must request by `POST` method, and the instigator just tells you: "I feel lazy to create a standlone DTO for query params, so I use `POST` method directly. Just make some adjustments yourself!".
>
> Don't be discouraged, this is the time to show your professionalism: In this case, you can classify these annoying functions based on **the uses** of the function! 😀

### State Checking Function/Method

For some basic examples:

```ts
// [!code focus:4]
/**
 * Block is "User", Element is "has", Modifier is "Permission".
 */
export function hasUserPermission(user: User, permission: Permission): boolean {
  for (const role of user.roles) {
    const rolePermissions = rolePermissionsMap[role] || []
    if (rolePermissions.includes(permission)) {
      return true
    }
  }
  return false
  // [!code focus:1]
}
// [!code focus:4]
/**
 * Block is "User", Element is "is", Modifier is "VIP".
 */
export function isUserVIP(user: User): boolean {
  return user.roles.includes('vip')
  // [!code focus:1]
}
```

You may notice that, in above examples, we have a fixed Block "user" for these functions.

**In practice, these functions should not be defined in the global scope, instead, they should be class methods or instance methods, like Repository Pattern in [Endpoint Functions](#endpoint-functions) section.**

In this way, we can avoid global function pollution, also can omit the fixed Block. For example:

```ts
// [!code focus:1]
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
   * Now we transform it to a method of User class, and omit the Block "user"!
   */
  hasPermission(permission: Permission): boolean {
    for (const role of this.roles) {
      const rolePermissions = rolePermissionsMap[role] || []
      if (rolePermissions.includes(permission)) {
        return true
      }
    }
    return false
  // [!code focus:1]
  }

  // [!code focus:4]
  /**
   * Now we transform it to a method of User class, and omit the Block "user"!
   */
  isVIP(): boolean {
    return this.roles.includes('vip')
  // [!code focus:1]
  }
  // [!code focus:1]
}
```

### Event Handler Function

For some basic examples:

```vue
<script setup lang="ts">
// [!code focus:4]
/**
 * Block is "UserInfo", Element is "before", Modifier is "Change".
 */
async function beforeUserInfoChange(oldUserInfo: UserInfo | null, newUserInfo: UserInfo | null) {
  console.log('User info changed before:', oldUserInfo, newUserInfo)
  // [!code focus:1]
}

// [!code focus:4]
/**
 * Block is "UserInfo", Element is "on", Modifier is "Change".
 */
async function onUserInfoChange(oldUserInfo: UserInfo | null, newUserInfo: UserInfo | null) {
  userInfo.value = newUserInfo
  console.log('User info changed:', oldUserInfo, newUserInfo)
  // [!code focus:1]
}

// [!code focus:4]
/**
 * Block is "UserInfo", Element is "after", Modifier is "Change".
 */
async function afterUserInfoChange(oldUserInfo: UserInfo | null, newUserInfo: UserInfo | null) {
  console.log('User info changed after:', oldUserInfo, newUserInfo)
  // [!code focus:1]
}

// [!code focus:4]
/**
 * Block is "AnEvent", Element is "on", Modifier is "Success".
 */
async function onAnEventSuccess(result: any) {
  console.log('An event success:', result)
  // [!code focus:1]
}
</script>

<template>
  <div>
    // [!code focus:6]
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
