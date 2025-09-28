---
title: JS Advanced Grammar Manual
date: 2025-09-28T13:48+08:00
update: 2025-09-28T13:48+08:00
lang: en
duration: n/a
type: blog+note
---

[[toc]]

## Particular case of omitting semicolons

JavaScript has [automatic semicolon insertion (ASI)](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)
feature, which means that in most cases, you can omit semicolons at the end of statements. However, there are certain
situations where omitting semicolons can lead to unexpected behavior:

<!-- This disable comment command only effects next line -->
<!-- eslint-disable -->

```js
console.log('Hello')

[1, 2, 3].forEach(n => console.log(n))
```

In this case, you will get an error, because the JavaScript engine will interprets it as:

<!-- This disable comment command only effects next line -->
<!-- eslint-disable -->

```js
console.log('Hello')[1, 2, 3].forEach(n => console.log(n))
```

The best practice (for me) is to assign the array `[1, 2, 3]` to a variable to avoid this issue & still omit semicolon:

```js
console.log('Hello')

const arr = [1, 2, 3]
arr.forEach(n => console.log(n))
```

I think this particular case is something that everyone who uses semicolon-free style in JavaScript must be aware of.

## The modern mode, `"use strict"`

### Why use strict mode?

For a long time, JavaScript evolved without compatibility issues. New features were added to the language while old
functionality didn’t change.

That had the benefit of never breaking existing code. But the downside was that any mistake or an imperfect decision
made by JavaScript’s creators got stuck in the language forever.

For example, you can assign a value to a variable that has not been declared, that will create a global variable
implicitly. But if there is already a global variable with the same name that used by other part of the code, it will be
overwritten without any warning:

_src/counter.js_

```js
// There is already a global variable `counter` fetched from the server
counter = await fetch('/api/counter').then(res => res.json())

// Omit 2000 lines of code...
// ...
// ...
// ...
// ...
// ...

// Your new code, that also uses the global variable `counter`,
// now it is overwritten to 1.
counter = 1
console.log(counter)
yourFunctionUseCounter(counter)

// Omit 2000 lines of code...
// ...
// ...
// ...
// ...
// ...

// Some other code that also uses the global variable `counter`,
// expects it to be the number fetched from the server,
// but now it is `1` instead.
someFunctionUseCounter(counter)
```

Another example is global `this`:

```js
console.log(this) // In this case, `this` is the global object `window` (browser) or `globalThis` (node.js)
```

`"use strict"` directive is a way to end these situations, let JS developers write more secure and optimized code.

When you use strict mode, the following things will happen:

- Assigning a value to an undeclared variable will throw an error.
- `this` in functions that are not methods will be `undefined` instead of the global object.
- ...

By default, you need to explicitly enable it by adding it to the top of a
file or a function:

_src/your-code.js_

```js
'use strict'

console.log('This is strict mode')
```

### Automatic strict mode

If you are using "classes" or "ES modules" in your source code, they will automatically enabled strict mode so you don't
need to add `"use strict"` manually:

- Case 1: _src/your-code-with-classes.js_

  ```js
  class MyClass {
    constructor() {
      console.log('This is strict mode')
    }
  }
  ```

- Case 2: _src/your-code-as-es-module.mjs_

  ```js
  export function myFunction() {
    console.log('This is strict mode')
  }
  ```

- Case 3: _package.json_

  ```json
  {
    "type": "module"
  }
  ```

  > All `.js` files will be treated as ES modules, and thus in strict mode.

### Summary

For modern JavaScript development, you should always use strict mode, except the cases when you need to work with legacy
code that can not be compatible with it.

## `Number.parseInt()`, `Number()` and unary `+`

In JS, we have three ways to convert a value to a number:

### `Number.parseInt()`

`Number.parseInt()` will convert a value to a string first, then parse it to an integer number. It will ignore any
trailing non-numeric characters:

```js
console.log(Number.parseInt('42')) // 42
console.log(Number.parseInt('42px')) // 42
```

### `Number()`

`Number()` will convert a value to a number directly. It will return `NaN` if the value can not be converted to a
number:

```js
console.log(Number('42')) // 42
console.log(Number('42px')) // NaN
```

### Unary `+`

The unary `+` operator will also convert a value to a number directly, just like `Number()`, maybe a bit faster:

```js
console.log(+'42') // 42
console.log(+'42px') // NaN
```

### Summary

The only case you need to ignore trailing non-numeric characters is when you should use `Number.parseInt()`, otherwise,
use `Number()` or unary `+` operator.

Just follow your preference or your team's coding style. `Number()` is more explicit and human-readable, while unary `+`
is more concise and maybe a bit faster.

## Implicit type coercion

### For binary `+` operator

For different types of operands, the binary `+` operator will do implicit type coercion with the following rules:

- If either operand is a string, both operands will be converted to strings, and then concatenated.
- Otherwise, both operands will be converted to numbers, and then added.

<!-- eslint-disable -->

```js
console.log(1 + 2) // 3 (number)
console.log(1 + []) // 0 (number)
console.log(1 + true) // 2 (number)

console.log('1' + 2) // '12' (string)
console.log(1 + '2') // '12' (string)
```

> [!Note]
>
> The binary `+` operator is the only operator that does implicit type coercion to string.
>
> All other arithmetic operators (`-`, `*`, `/`, `%`, `**`) and non-strict comparison operators (`>`, `<`, `>=`, `<=`,
> `==`, `!=`) will always do implicit type coercion to number.

### For comparison operators

If you read through the note above, you must really know what will happen when you use comparison operators with
different types of operands: They will be converted to numbers first, then compared.

And there will be a funny consequence that it's possible that at the same time:

- Two values are equal with `==`
- One of them is `true` as a boolean and the other is `false` as a boolean

For example:

<!-- eslint-disable -->

```js
let a = 0
console.log(Boolean(a)) // false

let b = '0'
console.log(Boolean(b)) // true

console.log(a == b) // true!
```

> [!Note]
>
> There is a strange result when comparing `null` and `undefined` with `0`:
>
> - `null` vs `0`:
>   - `null >= 0` is `true`
>   - `null > 0` is `false`
>   - `null == 0` is `false`
> - `undefined` vs `0`:
>   - `undefined > 0` is `false`
>   - `undefined < 0` is `false`
>   - `undefined == 0` is `false`
>
> That's because `null` and `undefined` are as it is in non-strict equality comparisons (`==`, `!=`) without any type
> conversion, so in equality comparisons, they are only equal to themselves and each other (`null == undefined` is
> `true`).
>
> And things is quit different in relational comparisons (`>`, `<`, `>=`, `<=`), `null` will be converted to `0`, while
> `undefined` will be converted to `NaN`.
>
> The best practice is do not use relational comparisons with `null` or `undefined`, but use non-strict equality
> comparisons (`==`, `!=`) with them is safety (I prefer to use `if (value == null)` instead of
> `if (value === null ||  value === undefined)`).

## Object

### Keys of an object

Keys of an object can only be `string` or `Symbol`. If you use other types of values as keys, they will be converted to
`string` first:

<!-- eslint-disable -->

```js
const obj = {}
obj[1] = 'one' // key `1` is converted to string `'1'`
obj[true] = 'true' // key `true` is converted to string `'true'`
obj[null] = 'null' // key `null` is converted to string `'null'`
obj[undefined] = 'undefined' // key `undefined` is converted to string `'undefined'`
console.log(obj) // { '1': 'one', 'true': 'true', 'null': 'null', 'undefined': 'undefined' }
```

So, if you want to define an enum to name object, you should pay more attention to the type keys:

```js
const StatusEnum = {
  success: 1,
  failure: 0,
}

const StatusEnumToName = {
  1: 'success',
  0: 'failure',
}

const array = [
  { status: 1, message: 'Operation succeeded', name: null },
  { status: 0, message: 'Operation failed', name: null },
]

Object.entries(StatusEnum).forEach(([key, value]) => {
  // `item.status` is a number, but `key` is a string,
  // they will never be equal!
  const item = array.find(item => item.status === key)
  if (item) {
    item.name = key
  }
})

console.log(array) // The `name` of items in array will always be `null`!
```

### Order of attributes in an object

In JavaScript, the order of attributes in an object is not guaranteed. However, in practice, most JavaScript engines
maintain the order of attributes following the rules below:

- Integer keys (keys that can be converted to a non-negative integer) are ordered in ascending order.
- String keys (non-integer keys) are ordered in the order they were added to the object, after all integer keys.
- Symbol keys are ordered in the order they were added to the object, after all string keys.

<!-- eslint-disable -->

```js
const sym = Symbol('sym1')
const obj = {
  'x1': 'test-1',
  [sym]: 'tets-4',
  'x0': 'test-0',
  3: 'test-3'
}
console.log(Reflect.ownKeys(obj)) // [ '3', 'x1', 'x0', Symbol(sym1) ]
```

### Deep clone an object

For objects without functions, you can use `structuredClone()` to deep clone it:

```ts
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = structuredClone(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // 2
console.log(obj2.b.c) // 3
```

For objects with functions, you can use a library like `lodash`:

```ts
import _ from 'lodash'

const obj1 = { a: 1, b: { c: 2 } }
const obj2 = _.cloneDeep(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // 2
console.log(obj2.b.c) // 3
```

### Transform an object to other types

https://javascript.info/object-toprimitive
