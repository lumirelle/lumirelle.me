---
title: JavaScript Advanced Grammar Manual
date: 2025-09-28T13:48+08:00
update: 2025-10-13T16:42+08:00
lang: en
duration: 66min
type: blog+note
---

[[toc]]

## Code style

### Particular case of omitting semicolons

I think this particular case is something that everyone who uses semicolon-free style in JavaScript must be aware of.

JavaScript has [automatic semicolon insertion (ASI)](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)
feature, which means that in most cases, you can omit semicolons at the end of statements. However, there are certain
situations where omitting semicolons can lead to unexpected behavior:

<!-- eslint-skip -->

```js
console.log('Hello')

[1, 2, 3].forEach(n => console.log(n))
```

In this case, you will get an error, because the JavaScript engine will interprets it as:

<!-- eslint-skip -->

```js
console.log('Hello')[1, 2, 3].forEach(n => console.log(n))
```

The best practice (for me) is always to use variable instead of array literal, so that I can keep omitting semicolons:

```js
console.log('Hello')

const arr = [1, 2, 3]
arr.forEach(n => console.log(n))
```

### The modern code style, `"use strict"`

#### Why `"use strict"`?

For a long time, JavaScript evolved without compatibility issues. New features were added to the language while old
functionality didn’t change.

That had the benefit of never breaking existing code. But the downside was that many early design defects got stuck in
the language forever.

For example, you can assign a value to a variable that has not been declared, that will create a global variable
implicitly. But if there is already a global variable with the same name that used by other part of the code, it will be
overwritten without any warning or error:

_src/counter.js_

```js
// There is already a global variable `counter` fetched from the server
counter = await fetch('/api/counter').then(res => res.json())

// Omit 2000 lines of code...

// Your new code, that also uses the global variable `counter`,
// Now it is overwritten to 1.
counter = 1
console.log(counter)
yourFunctionUseCounter(counter)

// Omit 2000 lines of code...

// Some other code that also uses the global variable `counter`,
// expects it to be the number fetched from the server,
// but now it is `1` instead.
someFunctionUseCounter(counter)
```

Another example is global `this`, in non-strict mode, `this` in a regular function (not a method) will refer to the
global object, which can lead to unexpected behaviors:

```js
// In this case (non-strict mode), `this` is the global object `window` (browser) or `globalThis` (node.js)
console.log(this)
```

`"use strict"` directive is a way to end these situations, let JavaScript developers write more secure and optimized
code, so we should always use it in modern JavaScript development.

#### How to enable strict mode?

By default, you need to explicitly enable it by adding `"use strict"` to the top of a file or a function:

_src/use-strict.js_

```js
'use strict'

console.log('This is strict mode')
```

But if you are using "classes" or "ES modules" in your source code, they will automatically enabled strict mode:

- Case 1: _src/class.js_

  > [!Note]
  >
  > Notice that, only the code inside the class body is in strict mode, the code outside the class body is still in
  > non-strict mode.

  ```js
  class MyClass {
    constructor() {
      console.log('This is strict mode')
    }
  }
  ```

- Case 2: _src/es-module.js_

  Now, the whole file is treated as an ES module, and thus in strict mode.

  ```js
  export function myFunction() {
    console.log('This is strict mode')
  }
  ```

- Case 3: _package.json_

  If you set `"type": "module"` in your `package.json`, all `.js` files will be treated as ES modules, and thus in
  strict mode.

  ```json
  {
    "type": "module"
  }
  ```

### `var` vs `let`

`var` is a very different beast than `let`, it has a lot of weird behaviors different from the common way of variable
declaration in modern languages.

You shouldn't use `var` in modern JavaScript code, but you should know its behaviors to understand why you shouldn't use
it.

#### `var` has no block scope

`var` only has global scope and function scope, for instance:

<!-- eslint-disable no-var,vars-on-top,block-scoped-var -->

```js
if (true) {
  var x = 1
}
console.log(x) // -> 1, `x` is accessible here
```

As `var` has no block scope, we've got a global variable `x`.

If we use `var` inside a function, it will be scoped to that function:

<!-- eslint-disable no-var,vars-on-top,block-scoped-var -->

```js
function foo() {
  if (true) {
    var y = 2
  }
  console.log(y) // -> 2, `y` is accessible here
}
foo()
console.log(y) // -> ReferenceError: `y` is not defined
```

> [!Note]
>
> As there was only `var` in the past, people used to use **IIFE (Immediately Invoked Function Expression)** to create a
> new function scope to avoid polluting the global scope:
>
> <!-- eslint-disable no-var -->
>
> ```js
> (function () {
>   var x = 1 // `x` and `y` are scoped to this function, not global
>   var y = 2
>   console.log(x + y) // 3
> })()
> ```
>
> That's why sometimes you can find them appearing in some old JavaScript code, and now, you know why they are there.
>
> Nowadays, we can use `let` and `const` to create block scope variables, so IIFE is no longer necessary.

#### `var` declarations are hoisted

`var` declarations are hoisted to the top of their enclosing function or global scope. This means that you can use a
`var` variable before its declaration without getting a `ReferenceError`:

<!-- eslint-disable no-use-before-define,no-var,vars-on-top -->

```js
a = 3
console.log(a) // 3
var a
console.log(a) // 3
```

This is technically equivalent to:

<!-- eslint-disable no-var -->

```js
var a
a = 3
console.log(a) // 3
console.log(a) // 3
```

**Declarations are hoisted, but assignments are not.**

#### `var` tolerates redeclarations

You can redeclare a variable using `var` without getting an error:

<!-- eslint-disable no-var,no-redeclare -->

```js
var b = 4
var b = 5
console.log(b) // -> 5
```

This kind of tolerance is the most intolerable thing for us with `var`!

## Data types

### Object

#### Keys of an object

Keys of an object can be only `string` or `Symbol`. If you use other types of values as keys, they will be implicitly
converted to `string`:

<!-- eslint-disable dot-notation -->

```js
const obj = {}
obj[1] = 'one' // Key `1` is converted to string `'1'`
obj[true] = 'true' // Key `true` is converted to string `'true'`
obj[null] = 'null' // Key `null` is converted to string `'null'`
obj[undefined] = 'undefined' // Key `undefined` is converted to string `'undefined'`
console.log(obj) // -> { '1': 'one', 'true': 'true', 'null': 'null', 'undefined': 'undefined' }
```

So, if you want to define an enum to name object, you should pay more attention to the key type:

```js
const StatusEnum = {
  success: 1, // As values, still numbers
  failure: 0,
}

const StatusEnumToName = {
  1: 'success', // As keys, will be converted to strings
  0: 'failure',
}

const array = [
  { status: 1, message: 'Operation succeeded', name: null },
  { status: 0, message: 'Operation failed', name: null },
]

Object.entries(StatusEnum).forEach(([key, value]) => {
  // `item.status` is a number, but `key` is a string,
  // They will never be equal!
  const item = array.find(item => item.status === key)
  if (item) {
    item.name = key
  }
})

console.log(array)
/**
 * Get name from `StatusEnum` failed,
 * the `name` property of items in array is still `null`!
 * -> [
 *   { status: 1, message: 'Operation succeeded', name: null },
 *   { status: 0, message: 'Operation failed', name: null },
 * ]
 */
```

#### Computed property names

We can use square brackets `[]` in an object literal, it allows us to define dynamic property names. This is called
"computed property names".

```js
const fruit = prompt('Which fruit to buy?', 'apple')

const bag = {
  [fruit]: 5, // The name of the property is taken from the variable fruit
}

console.log(bag.apple)
/**
 * if `fruit === 'apple'`
 * -> 5
 * otherwise
 * > undefined
 */
```

Essentially, that works the same as below, but looks better:

```js
const fruit = prompt('Which fruit to buy?', 'apple')
const bag = {}

// Take property name from the fruit variable
bag[fruit] = 5
```

#### Accessor properties

There are two kinds of object properties.

The first kind is data properties, they just store values. We already know how to work with them.

The second type of property is something new. It’s called accessor property. They are essentially functions that execute
on getting and setting a value, but look like regular properties to an external code.

```js
const obj = {
  /**
   * Getter, the code executed on getting `obj._propName`
   */
  get propName() {
    console.log('Getter called')
    return this._propName
  },

  /**
   * Setter, the code executed on setting `obj._propName = value`
   */
  set propName(value) {
    console.log('Setter called')
    this._propName = value
  }
}

obj.propName = 123 // -> Setter called implicitly
const a = obj.propName // -> Getter called implicitly
```

> [!Note]
>
> If a property only has a getter, then it’s read-only.
>
> If it only has a setter, then it’s write-only.

#### Order of properties in an object

In JavaScript, the order of properties in an object is not guaranteed. However, in practice, most JavaScript engines
maintain the order of properties following the rules below:

- Integer-like keys (keys that can be converted to a non-negative integer) are ordered in ascending order.
- String keys (non-integer-like keys) are ordered in the order they were added to the object, after all integer-like
  keys.
- Symbol keys are ordered in the order they were added to the object, after all string keys. They can not iterated by
  `for...in` loop or `Object.keys()`, but can be iterated by `Object.getOwnPropertySymbols()` or `Reflect.ownKeys()`.

<!-- eslint-disable style/quote-props -->

```js
const sym = Symbol('sym1')
const obj = {
  'x1': 'test-1',
  [sym]: 'tets-4',
  'x0': 'test-0',
  3: 'test-3'
}
console.log(Reflect.ownKeys(obj)) // -> [ '3', 'x1', 'x0', Symbol(sym1) ]
```

#### Deep clone an object

As we all know, primitive values are copied by value, assigning or passing them will create a copy of the value; Objects
are copied by reference, assigning or passing them will create a reference to the original object.

So, if we assign an object to a variable, any modification on that variable will affect the original object.

```js
const prim1 = 1
let prim2 = prim1 // This copy the value of `prim1` to it
prim2++
console.log(prim1) // -> 1
console.log(prim2) // -> 2

const obj1 = { a: 1 }
const obj2 = obj1 // This copy the reference of `obj1` to it
obj2.a = 2
console.log(obj1.a) // -> 2
console.log(obj2.a) // -> 2
```

So, if we want to create a copy of an object, we need to clone it, and if the object has nested objects, we need to deep
clone it.

For objects without functions, you can use built-in global function `structuredClone()` to safely deep clone it:

```js
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = structuredClone(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // -> 2
console.log(obj2.b.c) // -> 3
```

For objects with functions, you can use a library like `lodash` to achieve this:

```js
import _ from 'lodash'

const obj1 = { a: 1, b: { c: 2 } }
const obj2 = _.cloneDeep(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // -> 2
console.log(obj2.b.c) // -> 3
```

#### Transform an object to primitive types

The object-to-primitive conversion is called automatically by many built-in functions and operators that expect a
primitive as a value.

There are 3 types (hints) of it, as described in the [specification](https://tc39.github.io/ecma262/#sec-toprimitive):

- "string" (for `console.log` and other operations that need a string)
- "number" (for maths like `+`, `-`, `*`, `/`, etc)
- "default" (few operators, usually objects implement it the same way as "number", like `Date`)

The conversion algorithm is:

1. Call `obj[Symbol.toPrimitive](hint)` if the method exists,
2. Otherwise if hint is `"string"` try calling `obj.toString()` or `obj.valueOf()`, whatever exists.
3. Otherwise if hint is `"number"` or `"default"` try calling `obj.valueOf()` or `obj.toString()`, whatever exists.

So the best practice is to implement `Symbol.toPrimitive` method for your object if you want to customize its conversion
behavior:

```js
const obj = {
  a: 1,
  b: 2,
  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return `a=${this.a}, b=${this.b}`
    }
    return this.a + this.b
  },
}
```

#### Object wrappers for primitive types

JavaScript has three primitive types that have corresponding object wrappers:

- `String` for `string`
- `Number` for `number`
- `Boolean` for `boolean`

When you access a property or method on a primitive value, JavaScript automatically wraps the primitive in its
corresponding object wrapper, allowing you to use methods and properties defined on the wrapper's prototype, and then it
will be destroyed:

```js
const str = 'hello'
console.log(str.toUpperCase())
/**
 * JavaScript will wrap `str` with `String` object temporarily, and then destroy it
 * -> 'HELLO'
 */
```

The most important thing to use "object wrappers" is to avoid using `new` keyword with them, because that will create an
object instead of a primitive value, may cause unexpected behavior:

<!-- eslint-disable no-new-wrappers,unicorn/new-for-builtins -->

```js
const num1 = 0
const num2 = new Number(0) // This is an object, not a number!

// This will be logged
if (!num1) {
  console.log('num1 is falsy')
}

// This will NOT be logged, because `num2` is an object, and all objects are truthy
if (!num2) {
  console.log('num2 is falsy')
}
```

The reason is that call a constructor function with `new` and without `new` will have completely different behavior, see
[constructor functions](#constructor-functions) for more details.

### Strings

#### Accessing characters

You can access characters in a string by index, just like accessing elements in an array:

```js
const str = 'hello'
console.log(str[0]) // -> 'h'
console.log(str[str.length - 1]) // -> 'o'
```

If you need negative index support, you can use `str.at(index)` method:

```js
const str = 'hello'
console.log(str.at(0)) // -> 'h'
console.log(str.at(-1)) // -> 'o'
```

> [!Note]
>
> `str.at(index)` method is included in ECMAScript 2022, so it may not be supported in old environments.
>
> You can use a polyfill like `core-js` to add support for it.

#### Tagged template literals

JavaScript supports
[tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), which allows you to create custom string processing functions:

```js
function tag(strings, nameExp, locationExp) {
  // Array of string literals
  // -> ['Hello, ', ' in ', '!']
  console.log(strings)
  // Interpolated value for name
  // -> 'Alice'
  console.log(nameExp)
  // Interpolated value for location
  // -> 'Wonderland'
  console.log(locationExp)
  // Return the processed string
  // -> 'Welcome Here, Alice from Wonderland!'
  return `Welcome Here, ${nameExp} from ${locationExp}!`
}

const name = 'Alice'
const location = 'Wonderland'

tag`Hello, ${name} in ${location}!` // Call the `tag` function with the template literal
```

Based on this, `@antfu/utils` provides a useful function called `unindent`, which can help us clear indent while we
writing multiple-line string templates:

```js
import { unindent } from '@antfu/utils'

const general = `
  function test(x) {
    return x * x
  }
`
console.log(general)
/**
 * The output looks like:
 *   function test(x) {
 *     return x * x
 *   }
 */

const unindented = unindent`
  function test(x) {
    return x * x
  }
`
console.log(unindented)
/**
 * The output looks like:
 * function test(x) {
 *   return x * x
 * }
 */
```

#### Local compare

`str.localeCompare(otherString[, locales[, options]])` method can be used to compare two strings in a locale-aware
manner instead of unicode order:

```js
const str1 = 'ä'
const str2 = 'z'
console.log(str1 > str2 ? 1 : -1) // -> 1 (in Unicode, 'ä' comes after 'z')
console.log(str1.localeCompare(str2)) // -> -1 (in German, 'ä' comes before 'z')
```

### Arrays

#### Accessing elements

The same as [strings](#accessing-characters).

#### Array length property

`length` property of an array is writable. If you increase it manually, nothing interesting will happen. But if you
decrease it manually, the array will be truncated. **The process is irreversible**:

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.length) // -> 5

arr.length = 3
console.log(arr) // -> [1, 2, 3]
```

So, the most simple way to clear an array is to set its `length` property to `0`. 😏

#### `arr.splice()`

`arr.splice(start[, deleteCount, item1, ..., itemN])` method can be used to add, remove or replace elements in an array
just in place.

> [!Note]
>
> `arr.splice()` method modifies the original array and returns an array containing the deleted elements.

- To remove elements:

  ```js
  const arr = [1, 2, 3, 4, 5]
  arr.splice(1, 2) // Remove 2 elements starting from index 1
  console.log(arr) // -> [1, 4, 5]
  ```

- To add elements:

  ```js
  const arr = [1, 2, 3, 4, 5]
  arr.splice(2, 0, 'a', 'b') // Add 'a' and 'b' at index 2
  console.log(arr) // -> [1, 2, 'a', 'b', 3, 4, 5]
  ```

- To replace elements:

  ```js
  const arr = [1, 2, 3, 4, 5]
  arr.splice(1, 2, 'a', 'b') // Replace 2 elements starting from index 1 with 'a' and 'b'
  console.log(arr) // -> [1, 'a', 'b', 4, 5]
  ```

#### Array-like and iterable objects

An array-like object is an object that has:

1. a `length` property.
2. indexed elements.

For instance:

```js
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}
```

An iterable object is an object that implements the iterable protocol, which means it has a `Symbol.iterator` method
that returns an iterator:

```js
const iterable = {
  items: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        if (index < this.items.length) {
          return { value: this.items[index++], done: false }
        }
        else {
          return { value: undefined, done: true }
        }
      },
    }
  },
}
```

So an array-like object is not necessarily iterable, and an iterable object is not necessarily array-like too.

### `Map` and `Set`

#### `WeakMap` and `WeakSet`

`WeakMap` and `WeakSet` are similar to `Map` and `Set`, but they only accept objects as keys (for `WeakMap`) or
values (for `WeakSet`), and they do not prevent garbage collection of the objects used as keys or values.

What's more, they do not have methods to iterate over their elements, such as `keys()`, `values()`, `entries()`, or
`forEach()`.

They are designed to be used in scenarios where you want to **associate data with an object** without preventing that
object from being garbage collected:

```js
const users = [
  { name: 'Alice' },
  { name: 'Bob' },
]

const userViewsMap = new WeakMap()

// When the user views a page, we can record the number of views in the WeakMap
function viewPage(user) {
  const views = userViewsMap.get(user) ?? 0
  userViewsMap.set(user, views + 1)
  console.log(`${user.name} has viewed this page ${views + 1} times`)
}

// When the user logs out, we can remove the reference to the user object
// from the users array, and if there are no other references to the user
// object, it will be garbage collected, along with its entry in the WeakMap.
function userLogout(user) {
  const index = users.indexOf(user)
  if (index !== -1) {
    users.splice(index, 1)
  }
}
```

## Type conversion

### Converting anything to number

In JavaScript, we have three ways to convert a value to a number:

- `Number.parseInt()`

  `Number.parseInt()` will convert a value to a string first, then parse it to an integer number. It will ignore any
  trailing non-numeric characters:

  ```js
  console.log(Number.parseInt('42')) // -> 42
  console.log(Number.parseInt('42px')) // -> 42
  ```

- `Number()`

  `Number()` will convert a value to a number directly. It will return `NaN` if the value can not be converted to a
  number:

  ```js
  console.log(Number('42')) // -> 42
  console.log(Number('42px')) // -> NaN
  ```

- Unary `+`

  The unary `+` operator will also convert a value to a number directly, just like `Number()`, maybe a bit faster:

  ```js
  console.log(+'42') // -> 42
  console.log(+'42px') // -> NaN
  ```

The only case you need to ignore trailing non-numeric characters is when you should use `Number.parseInt()`, otherwise,
use `Number()` or unary `+` operator. Then, just follow your preference or your team's coding style. `Number()` is more
explicit and human-readable, while unary `+` is more concise and maybe a bit faster.

### Implicit type conversion

#### For binary `+` operator

For different types of operands, the binary `+` operator will do implicit type coercion with the following rules:

- If either operand is a string, both operands will be converted to strings, and then concatenated.
- Otherwise, both operands will be converted to numbers, and then added.

<!-- eslint-disable prefer-template -->

```js
console.log(1 + 2) // -> 3 (number)
console.log(1 + []) // -> 0 (number)
console.log(1 + true) // -> 2 (number)

console.log('1' + 2) // -> '12' (string)
console.log(1 + '2') // -> '12' (string)
```

> [!Note]
>
> The binary `+` operator is the only operator that does implicit type coercion to string.
>
> All other arithmetic operators (`-`, `*`, `/`, `%`, `**`) and non-strict comparison operators (`>`, `<`, `>=`, `<=`,
> `==`, `!=`) will always do implicit type coercion to number.
>
> That's why we can join strings with `+` operator!

#### For comparison operators

If you read through the note above, you must really know what will happen when you use comparison operators with
different types of operands: They will be converted to numbers first, then compared.

So there will be a funny consequence. It's possible that at the same time:

- Two values are equal with `==`
- One of them is `true` as a boolean and the other is `false` as a boolean

For example:

<!-- eslint-disable eqeqeq -->

```js
const a = 0
console.log(Boolean(a)) // -> `false`, `0` is falsy

const b = '0'
console.log(Boolean(b)) // -> `true`, `'0'` is truthy

console.log(a == b) // -> `true`! They are both converted to number `0`
```

> [!Note]
>
> `null` and `undefined` are still as it's in **non-strict equality comparisons** (`==`, `!=`) without any type conversion,
> so in equality comparisons, they are only equal to themselves and each other (`null == undefined` is `true`).
>
> And things is quit different in **relational comparisons** (`>`, `<`, `>=`, `<=`): `null` will be converted to `0`, while
> `undefined` will be converted to `NaN`.
>
> Because this, there is a strange result when comparing `null` and `undefined` with `0`:
>
> - `null` vs `0`:
>   - `null >= 0` is `true`, because `null` is converted to `0`.
>   - `null > 0` is `false`, because `null` is converted to `0`.
>   - `null == 0` is `false`, because `null` is left as it's, and it really is not equal to `0`. 😄
> - `undefined` vs `0`:
>   - `undefined > 0` is `false`, because `undefined` is converted to `NaN`.
>   - `undefined < 0` is `false`, because `undefined` is converted to `NaN`.
>   - `undefined == 0` is `false`, because `undefined` is left as it's, and it really is not equal to `0`. 😄
>
> The best practice is not to use relational comparisons with `null` or `undefined`, but using non-strict equality
> comparisons with them is safe:
>
> I prefer to use `if (value == null)` instead of `if (value === null ||  value === undefined)`, because it's more
> concise and clear.

## Advanced working with functions

### Constructor functions

A constructor function is a regular function that is used to create objects. It should called with the `new` keyword.

Call a constructor function with `new` and without `new` will have completely different behavior:

- With `new`: A new object is created, and `this` inside the constructor points to that new object. If the constructor
  does not explicitly return an object, the new object is returned by default.

  In other words, `new MyConstructor(...)` does something like:

  ```js
  function MyConstructor() {
    // this = {} (implicitly)

    this.value = 42

    // return this (implicitly)
  }
  const obj1 = new MyConstructor()
  ```

- Without `new`: The constructor function is called as a regular function, and `this` inside the function points to the
  global object (or `undefined` in strict mode). The return value of the function is returned directly.

  In other words, `MyConstructor(...)` does something like:

  ```js
  function MyConstructor() {
    this.value = 42

    // return (implicitly)
  }
  const obj2 = MyConstructor() // obj2 === undefined
  ```

We can use `new.target` to determine whether a function is called with `new` or not, so that we can limit the usage of a
our functions:

```js
function MyConstructor() {
  // If `new.target` is `undefined`, it means the function is called without `new`,
  // otherwise, it is called with `new`.
  if (!new.target) {
    throw new Error('MyConstructor() must be called with new')
  }
  this.value = 42
}
```

### Closure

#### What is closure?

Closure is a function that remembers its outer variables (called **outer lexical environment**) and can access them.

In JavaScript, every function has a hidden property `[[Environment]]`, which is a reference to the lexical environment
where the function was created (there is only one exception, it uses global lexical environment which is to be covered
in [`new Function` syntax](#new-function-syntax-with-closure)), so we can say that all functions are closures in
JavaScript.

See https://javascript.info/closure for the theory and implementation details of closure in JavaScript.

#### Garbage collection

Usually, a Lexical Environment is removed from memory with all the variables after the function call finishes. That’s
because there are no references to it. As any JavaScript object, it’s only kept in memory while it’s reachable.

However, if there’s a nested function that is still reachable after the end of a function, then it has `[[Environment]]`
property that references the lexical environment.

In that case the Lexical Environment is still reachable even after the completion of the function, so it stays alive.

> [!Note]
>
> An important side effect in V8 engine (Chrome, Edge, Opera) is that such variable will be optimized while debugging:
>
> <!-- eslint-disable no-debugger -->
>
> ```js
> function f() {
>   const value = Math.random()
>
>   function g() {
>     debugger // In console, after you typing `console.log(value)`, you will get `No such variable`!
>   }
>
>   return g
> }
>
> const g = f()
> g()
> ```
>
> As you could see, there is no such variable! In theory, it should be accessible, but the engine optimized it out.

### Named function expression

A named function expression is a function expression that has a name. The name is
**only accessible within the function itself**.

So why do we need it? For instance, when we want to create a recursive function expression:

<!-- eslint-disable antfu/top-level-function -->

```js
const doFact = function fact(n) {
  if (n <= 1)
    return 1
  return n * fact(n - 1) // Use `fact` to call itself
}
```

You may think we can use `doFact` to call itself, but that will not work if we reassign `doFact` to other value:

<!-- eslint-disable antfu/top-level-function -->

```js
let doFact = function fact(n) {
  if (n <= 1)
    return 1
  return n * doFact(n - 1) // Use `doFact` to call itself
}

const anotherFact = doFact
doFact = null // Reassign `doFact` to `null`

console.log(anotherFact(5)) // -> TypeError: doFact is not a function
```

That happens because the function takes `doFact` from the outer lexical environment. There is no local `doFact`, so the
outer variable is used. And at the moment of the call that outer `doFact` is `null`. That's why we need named function
expression.

> [!Note]
>
> This "internal name" features is only available for **function expressions**.

### `new Function` syntax

#### What is it?

There’s one more way to create a function. It’s rarely used, and not recommended (because it use `eval` under the hood),
but it's still good to know.

<!-- eslint-disable no-new-func -->

```js
// new Function ([arg1, arg2, ...argN], functionBody)
const sum = new Function('a', 'b', 'return a + b')
console.log(sum(1, 2)) // -> 3
```

The last argument of `new Function` is the function body, and the previous arguments are the names for the function
parameters.

> [!Caution]
>
> Through `new Function`, we can create functions dynamically, for instance, from a string received from a server:
>
> <!-- eslint-disable no-new-func -->
>
> ```js
> const res = await fetch('/api/function-body').then(res => res.text())
>
> const func = new Function('a', 'b', res)
> func(1, 2)
> ```
>
> But it's really really really dangerous, because the function body may contain malicious code, and it will be executed
> directly. So, never do this unless you really know what you are doing and you can trust the source of the function
> body.

#### `new Function` syntax with closure

Usually, a function remembers the lexical environment where it was created. But when a function is created with `new
Function`, it always uses the global lexical environment as `[[Environment]]`. So it can’t access outer variables, only
global ones.

What if it could access outer variables?

The problem is that before JavaScript is published to production, we may compressed the source code using a minifier, a
special program that shrinks code by removing extra comments, spaces and what’s important: renames local variables into
shorter ones. So if `new Function` had access to outer variables, it would be unable to find them after minification:

For instance, we have a source code like this:

_src/script.js_

<!-- eslint-disable no-new-func -->

```js
const value = 1

const func = new Function('console.log(value)') // It seems works
func()
```

After minification, it may become:

_dist/script.min.js_

<!-- eslint-skip -->

```js
const a=1;const b=new Function("console.log(value)");b(); // ReferenceError: value is not defined
```

### `this` and `func.call/apply/bind`

As we all know, `this` is a special variable that refers to the context of the function call:

- For a constructor function, `this` refers to the newly created object.
- For a method, `this` refers to the object that the method is called on.
- For a regular function, `this` refers to the global object (or `undefined` in strict mode).
- For an arrow function, `this` refers to the `this` of the outer lexical environment.

And we can use `func.call/apply/bind` to call a function with a specific `this` value and arguments.

#### `func.call/apply`

The only difference between `func.call` and `func.apply` is how to pass arguments to the function. `func.call` accepts
arguments **one by one**, while `func.apply` accepts arguments **as an array**.

- `func.call(thisArg, arg1, arg2, ...)`
- `func.apply(thisArg, [argsArray])`

They can be used to change the `this` value of a function call for one-time:

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}

const user1 = { name: 'John' }
const user2 = { name: 'Jane' }
greet.call(user1, 'Hello', '!') // -> Hello, John!
greet.apply(user2, ['Hi', '.']) // -> Hi, Jane.
```

#### `func.bind`

If you want to create a new function with a specific `this` value and arguments, you can use `func.bind`:

- `func.bind(thisArg, arg1, arg2, ...)`

For instance:

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}
const user = { name: 'John' }

// Create a new function with `this` set to `user` and first argument set to 'Hello',
// Now, the new function only needs one argument.
const greetUser = greet.bind(user, 'Hello')
greetUser('!') // -> Hello, John!
```

If you want to create a function that is bound to a specific argument and left `this` unchanged, you can use this simple
workaround:

```js
function partial(func, ...argsBound) {
  return function (...args) { // This returns a new function, and passes `this` correctly
    return func.call(this, ...argsBound, ...args)
  }
}

const user = {
  name: 'John',
  greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`)
  }
}
user.greetHello = partial(user.greet, 'Hello') // `this` is still `user`
user.greetHello('!') // -> Hello, John!
```

## Advanced working with objects

### Property flags (so called descriptors)

#### What are property flags?

For [data properties](#accessor-properties), besides a value, have three special attributes (so-called "flags"):

- <details>
  <summary>`writable` – if `true`, the value can be changed, otherwise it’s read-only.</summary>

  `writable` is `true`:

  ```js
  const user = {
    name: 'John', // writable: true
  }
  user.name = 'Pete' // Works
  console.log(user.name) // -> 'Pete'
  ```

  `writable` is `false`:

  ```js
  const user = {}
  Object.defineProperty(user, 'name', {
    value: 'John',
    writable: false,
  })
  user.name = 'Pete' // Error in strict mode, fails silently otherwise
  console.log(user.name) // -> 'John'
  ```

  </details>

- <details>
  <summary>
  `enumerable` – if `true`, the property shows up during enumeration of the properties of the object, otherwise it’s
  hidden.
  </summary>

  `enumerable` is `true`:

  ```js
  const user = {
    name: 'John', // enumerable: true
  }
  for (const key in user) {
    console.log(key) // -> name
  }
  ```

  `enumerable` is `false`:

  ```js
  const user = {}
  Object.defineProperty(user, 'name', {
    value: 'John',
    writable: false,
  })
  for (const key in user) {
    console.log(key) // -> (nothing is logged)
  }
  ```

  </details>

- <details>
  <summary>
  `configurable` – if `true`, the property can be deleted and these attributes can be modified, otherwise not.
  </summary>

  `configurable` is `true`:

  ```js
  const user = {
    name: 'John', // configurable: true
  }
  Object.defineProperty(user, 'name', {
    writable: false,
  }) // Works
  delete user.name // Works
  console.log(user.name) // -> undefined
  ```

  `configurable` is `false`:

  ```js
  const user = {}
  Object.defineProperty(user, 'name', {
    value: 'John',
    configurable: false,
  })
  Object.defineProperty(user, 'name', {
    writable: false,
  }) // Error: Cannot redefine property: name
  delete user.name // Fails silently
  console.log(user.name) // -> John
  ```

  Making a property non-configurable is a one-way road. We cannot change it back with `defineProperty`.

  > [!Note]
  >
  > There’s a minor exception about changing flags.
  >
  > We can change `writable: true` to `false` for a non-configurable property, thus preventing its value modification
  > (to add another layer of protection). Not the other way around though.

  </details>

For [accessor properties](#accessor-properties), they don't have `writable` flag, but instead have `get` and `set`
functions:

<!-- eslint-disable prefer-template -->

```js
const user = {
  _name: 'John',
}
Object.defineProperty(user, 'name', {
  get() {
    return 'Mr. ' + this._name
  },
  set(value) {
    this._name = value
  },
  enumerable: false,
  configurable: false,
})
```

An property can be either a data property, or an accessor property. It cannot be both at the same time.

When we create a property in a usual way, all three flags are `true`:

```js
const user = {
  name: 'John', // writable: true, enumerable: true, configurable: true
}

const descriptor = Object.getOwnPropertyDescriptor(user, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* -> {
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
} */
```

We can change the flags using `Object.defineProperty`:

```js
const user = {
  name: 'John',
}
Object.defineProperty(user, 'name', {
  writable: false,
  enumerable: false,
  configurable: false,
})

const descriptor = Object.getOwnPropertyDescriptor(user, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* -> {
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
} */
```

> [!Note]
>
> The best practice to define a read-only property is to use `getters` without `setters` instead of `writable: false`,
> because it's more convenient:
>
> ```js
> const obj = {
>   get name() {
>     return 'John'
>   }
> }
> ```

#### Clone properties with flags

When we clone an object with `Object.assign` or spread syntax `{ ...obj }`, only enumerable properties are copied, and
the flags are not preserved (all flags will be `true` in the new object).

We can use `Object.getOwnPropertyDescriptors` to get all properties with their flags, and then use
`Object.defineProperties` to clone them to a new object:

```js
const user = {}
Object.defineProperty(user, 'name', {
  value: 'John',
  writable: false,
  enumerable: false,
  configurable: false,
})

const clonedUser = Object.defineProperties({}, Object.getOwnPropertyDescriptors(user))
const descriptor = Object.getOwnPropertyDescriptor(clonedUser, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* -> {
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
} */
```

#### Sealing an object globally

Property descriptors work at the level of individual properties.

There are also methods that limit access to the whole object:

- `Object.preventExtensions(obj)` – prevents adding new properties to the object.
- `Object.seal(obj)` – prevents adding/removing properties. Sets `configurable: false` for all existing properties.
- `Object.freeze(obj)` – prevents adding/removing/changing properties. Sets `configurable: false` and `writable: false`
  for all existing properties.

And also there are tests for them:

- `Object.isExtensible(obj)` – returns `false` if adding new properties is prevented.
- `Object.isSealed(obj)` – returns `true` if adding/removing properties is prevented.
- `Object.isFrozen(obj)` – returns `true` if adding/removing/changing properties is prevented.

These methods are rarely used in practice, but good to know.

### Prototypes, inheritance

#### What is prototype?

JavaScript uses prototype to express inheritance.

Every object has a hidden property `[[prototype]]` (which can be accessed by `__proto__` accessor property, or
`Object.getPrototypeOf` & `Object.setPrototypeOf` method) finally referencing to `Object.prototype`, which is the
top-level prototype.

> [!Note]
>
> `[[prototype]]` is internal and hidden property targetting to the prototype of an object
>
> `__proto__` is an accessor property (getter/setter) that exposes `[[prototype]]` to the user.
>
> They have the same result, but they are quite different things.

When we try to **get (only get)** a property of an object, if it doesn't exist in the object itself, JavaScript will
look for it in the prototype, and then the prototype's prototype, and so on, until it finds the property or reaches the
top-level prototype and returns `undefined`.

Through this way, an object can "inherit" properties from its prototype.

> [!Note]
>
> Prototype can be only an object or `null`, set it to other types are not allowed and will be ignored.

#### `Func.prototype` property

We know that constructor functions can be used to create objects:

```js
function User(name) {
  this.name = name
}
const user = new User('John')
console.log(user.name) // -> 'John'
```

So how can we change the prototype of the objects created by a constructor function?

JavaScript uses a regular property named `prototype` of a function to determine the prototype of the objects created by
it.

> [!Note]
>
> `Func.prototype` means a regular property of `Func` named `prototype`, it defines the prototype of objects created by
> `Func`
>
> That is to say, `Func.prototype` determines `[[prototype]]` of the objects created by `Func`.
>
> ```js
> const animal = {
>   eats: true
> }
>
> function Rabbit(name) {
>   this.name = name
> }
>
> Rabbit.prototype = animal
>
> const rabbit = new Rabbit('White Rabbit') //  rabbit.[[prototype]] == animal
>
> console.log(rabbit.eats) // -> true
> ```

Every function has the default `prototype` property even if we don't supply it.

The default `prototype` is an object with only one property `constructor`, which points back to the function itself:

```js
function User() {}
/**
 * `User.prototype`:
 * {
 *   constructor: User
 * }
 */
```

That's to say you can create a new object without knowing it's constructor function:

```js
import { user } from './some-module.js'

// We don't know how `user` is created,
// But we can create a new object with the same constructor as `user`
const newUser = new user.constructor()
```

> [!Caution]
>
> JavaScript does not ensure there is a `constructor` property in the prototype of a `Function`, it's not a standard.
>
> If we manually set `Func.prototype` to another object, the `constructor` property may be lost, so we shouldn't rely on
> it:
>
> ```js
> function User() {}
>
> User.prototype = {
>   sayHi() {
>     console.log('Hi')
>   }
> }
>
> const user = new User()
> console.log(user.constructor === User) // -> false (`undefined` !== User)
> ```
>
> The best practice is not to totally replace `Func.prototype`, but to add properties to it:
>
> ```js
> function User() {}
>
> User.prototype.sayHi = function () {
>   console.log('Hi')
> }
>
> const user = new User()
> console.log(user.constructor === User) // -> true
> ```

#### Native prototypes

The `prototype` property is widely used by the core of JavaScript itself. All built-in constructor functions use it.

For built-in constructor function `Object`, there is a property `Object.prototype` which is the prototype of objects
created by `{}` or `new Object`.

By specification, all of the built-in prototypes have `Object.prototype` on the top. That’s why some people say that
"everything inherits from objects".

Other built-in constructor functions such as `Array`, `Date`, `Function` and others also keep methods in prototypes, we
can access them through `Array.prototype`, `Date.prototype`, `Function.prototype` and so on.

> [!Caution]
>
> These built-in prototypes can be modified, but change anything of them is a bad idea, can lead to hard-to-debug
> errors.

#### How to access prototype?

For modern JavaScript development, we shouldn't use `__proto__` to get or set the prototype of an object, they are in
the Annex B of the ECMAScript specification, which means they are only for web browser compatibility.

Now we have the following standard methods to work with prototypes:

- `Object.getPrototypeOf(obj)` – returns the prototype of `obj`.
- `Object.setPrototypeOf(obj, proto)` – sets the prototype of `obj` to `proto`.
- `Object.create(proto, [descriptors])` – creates a new object with the specified prototype and property descriptors.

## Classes

### What is class?

Actually, `class` in JavaScript is just a kind of `function`.

For instance:

```js
class User {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    console.log(`Hello, ${this.name}!`)
  }
}

console.log(typeof User) // -> 'function'
```

What `class User { ... }` does is:

1. Create a function named `User`, that becomes the result of the class declaration. The function code is taken from the
   `constructor` method (assumed empty if we don’t write such method).
2. Store class methods, such as `sayHi`, in `User.prototype`.

After `new User` object is created, it can access methods from `User.prototype`. So the object has access to class
methods.

> [!Note]
>
> `class` is not just a syntax sugar of constructor function:
>
> 1. A function created by `class` labelled by a special internal property `[[IsClassConstructor]]: true`, JavaScript
>    checks for this property in a variety of places:
>
>    ```js
>    class User {}
>
>    User() // Error: Class constructor User cannot be invoked without 'new'
>    ```
>
>    Also, a string representation of a class constructor in most JavaScript engines starts with the "class..."
>
>    ```js
>    class User {}
>
>    console.log(User.toString()) // -> class User { ... }
>    ```
>
> 2. Class methods are non-enumerable by default. A class definition sets enumerable flag to `false` for all methods in
>    the `prototype` property.
> 3. Classes always use strict mode. All code inside the class is automatically in strict mode. (Yeah, we said this
>    before 👍)

### Class expression

Just like functions, classes can be defined inside another expression, passed around, returned, assigned, etc.

```js
const User = class {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    console.log(`Hello, ${this.name}!`)
  }
}
```

Similar to [Named Function Expressions](#named-function-expression), class expressions may have a name, and it's visible
inside the class only.

### Getters/setters and computed property names

Just like literal objects, classes may include [getters/setters](#accessor-properties),
[computed property names](#computed-property-names) etc.

Example for getters/setters:

```js
class User {
  constructor(name) {
    // Invokes the setter
    this.name = name
  }

  get name() {
    return this._name
  }

  set name(value) {
    if (value.length < 4) {
      console.log('Name is too short.')
      return
    }
    this._name = value
  }
}

let user = new User('John')
console.log(user.name) // -> John

user = new User('') // -> Name is too short.
```

Example for computed property names:

```js
const methodPrefix = 'say'
class User {
  [`${methodPrefix}Hi`]() {
    console.log('Hello')
  }
}

new User().sayHi() // -> Hello
```

### Class fields

Class fields is a new feature added in ECMAScript 2022, which is a syntax that allows to add any properties.

Previously, our classes only had methods, and properties were usually added in the constructor:

```js
class User {
  constructor() {
    this.name = 'John'
  }

  sayHi() {
    console.log(`Hello, ${this.name}!`)
  }
}

new User().sayHi() // Hello, John!
```

But now, with class fields, we can declare properties directly in the class body:

```js
class User {
  name = 'John'

  sayHi() {
    console.log(`Hello, ${this.name}!`)
  }
}

new User().sayHi() // -> Hello, John!
```

So, we just write " = " in the declaration, and that’s it.

We can also assign values using more complex expressions and function calls:

```js
class User {
  name = prompt('Name, please?', 'John')
}

const user = new User()
console.log(user.name) // -> John
```

> [!Note]
>
> If you want to create a property that is read-only, you can use a getter without a setter, instead of `writable: false`:
>
> ```js
> class User {
>   #name = 'John' // Private property
>   get name() {
>     return this.#name
>   }
> }
> ```
>
> If you want to create a property that is not enumerable or configurable, you still need to use
> `Object.defineProperty` in the constructor:
>
> ```js
> class User {
>   constructor(name) {
>     Object.defineProperty(this, 'name', {
>       value: name,
>       writable: false,
>       enumerable: false,
>       configurable: false,
>     })
>   }
> }
> ```

### Class inheritance

Class inheritance is a way for one class to extend another class.

So we can create new functionality on top of the existing.

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  move() {
    console.log(`${this.name} moves.`)
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} barks.`)
  }
}

const dog = new Dog('Rex')
```

Look at this inheritance diagram:

```
Animal -- prototype --> Animal.prototype
                            ^
                            |
                            | [[prototype]] (inheritance)
                            |
 Dog -- prototype -----> Dog.prototype
                            ^
                            |
                            | [[prototype]] (inheritance)
                            |
                         dog = new Dog('Rex')
```

For the example above, if we want to access `dog.move()`, JavaScript engine will:

1. Look for `move` in `dog` itself (not founded).
2. Look for `move` in `dog.[[prototype]]`, which is `Dog.prototype` (not founded).
3. Look for `move` in `Dog.prototype.[[prototype]]`, which is `Animal.prototype` (founded).

As we can recall from the chapter [Native prototypes](#native-prototypes), JavaScript itself uses prototypal inheritance
for built-in objects. E.g. `Date.prototype.[[Prototype]]` is `Object.prototype`. That’s why dates have access to generic
object methods.

So that's how inheritance works in JavaScript (static inheritance will be explained
[later](#static-methods-and-properties)).

> [!Note]
>
> Class syntax allows to specify not just a class, but any expression after extends.
>
> For instance, a function call that generates the parent class:
>
> ```js
> function GenerateClass(phrase) {
>   return class {
>     sayHi() { console.log(phrase) }
>   }
> }
>
> class User extends GenerateClass('Hello') {}
>
> new User().sayHi() // -> Hello
> ```
>
> Here `class User` inherits from the result of `GenerateClass('Hello')`.
>
> That may be useful for advanced programming patterns when we use functions to generate classes depending on many
> conditions and can inherit from them.

### Overriding a method

If we want to override a method of the parent class, we can simply declare it in the child class with the same name:

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  move() {
    console.log(`${this.name} moves.`)
  }
}

class Dog extends Animal {
  move() {
    console.log(`${this.name} runs.`) // Override
  }
}

const dog = new Dog('Rex')
dog.move() // -> Rex runs.
```

If we want to call the parent method from the child method, classes provide "super" keyword for that:

- `super.method(...)` to call a parent method.
- `super(...)` to call a parent constructor (inside our constructor only).

For instance:

```js
class Animal {
  constructor(name) {
    this.name = name
  }

  move() {
    console.log(`${this.name} moves.`)
  }
}

class Dog extends Animal {
  move() {
    super.move() // Call the parent method `move`
    console.log(`${this.name} runs.`) // Override
  }
}

const dog = new Dog('Rex')
dog.move()
/**
 * -> Rex moves.
 * -> Rex runs.
 */
```

### Overriding constructor

According to the [specification](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation), if a
class extends another class and has no constructor, then the following "empty" constructor is generated:

<!-- eslint-disable no-useless-constructor -->

```js
class Rabbit extends Animal {
  constructor(...args) {
    super(...args)
  }
}
```

Now let’s add a custom constructor to `Rabbit`. It will specify the `earLength` in addition to `name`:

<!-- eslint-disable constructor-super,no-this-before-super -->

```js
class Animal {
  constructor(name) {
    this.speed = 0
    this.name = name
  }
  // ...
}

class Rabbit extends Animal {
  constructor(name, earLength) {
    this.speed = 0
    this.name = name
    this.earLength = earLength
  }

  // ...
}

// Doesn't work!
const rabbit = new Rabbit('White Rabbit', 10) // Error: this is not defined.
```

Whoops! We’ve got an error. Now we can’t create rabbits. What went wrong?

The short answer is: Constructors in inheriting classes must call `super(...)`, and do it before using `this`.

Of course, there’s an explanation.

In JavaScript, there’s a distinction between a constructor function of an inheriting class (so-called "derived
constructor") and other functions. A derived constructor has a special internal property `[[ConstructorKind]]:"derived"`.
That’s a special internal label.

That label affects its behavior with `new`.

- When a regular function is executed with `new`, it creates an empty object and assigns it to this.
- But when a derived constructor runs, it doesn’t do this. It expects the parent constructor to do this job.

So a derived constructor must call super in order to execute its parent (base) constructor, otherwise the object for
this won’t be created. And we’ll get an error.

### Overriding class fields

We can override not only methods, but also class fields.

Although, there’s a tricky behavior when we access an overridden field in parent constructor, quite different from most
other programming languages.

Consider this example:

```js
class Animal {
  name = 'animal'

  constructor() {
    console.log(this.name)
  }
}

class Rabbit extends Animal {
  name = 'rabbit'
}

const animal = new Animal() // -> animal
const rabbit = new Rabbit() // -> animal
```

Here, class `Rabbit` extends `Animal` and overrides the name field with its own value.

There’s no own constructor in `Rabbit`, so `Animal` constructor is called.

What’s interesting is that in both cases: `new Animal()` and `new Rabbit()`, log `animal`.

**In other words, the parent constructor always uses its own field value, not the overridden one.**

Well, the reason is the field initialization order. The class field is initialized:

- For the base class, before constructor call.
- For the derived class, immediately after `super()` call in constructor.

In our case, `Rabbit` has no constructor, so `super()` is called implicitly at the very beginning of `Animal`
constructor. At that moment, `Rabbit` fields are not initialized yet, so `this.name` in `Animal` constructor returns the
value of `Animal.name`, which is `animal`.

This subtle difference between fields and methods is specific to JavaScript.

Luckily, this behavior only reveals itself if an overridden field is used in the parent constructor. Then it may be
difficult to understand what’s going on, so we’re explaining it here.

If it becomes a problem, one can fix it by using methods or getters/setters instead of fields.

```js
class Animal {
  showName() { // instead of this.name = 'animal'
    console.log('animal')
  }

  constructor() {
    this.showName() // instead of console.log(this.name)
  }
}

class Rabbit extends Animal {
  showName() {
    console.log('rabbit')
  }
}

const animal = new Animal() // animal
const rabbit = new Rabbit() // rabbit
```

### Super: internals, `[[HomeObject]]`

It’s about the internal mechanisms behind inheritance and `super`.

First to say, from all that we’ve learned till now, it’s impossible for super to work at all!

Yeah, indeed, let’s ask ourselves, how it should technically work? When an object method runs, it gets the current
object as `this`. If we call `super.method()` then, the engine needs to get the `method` from the prototype of the
current object. But how?

The task may seem simple, but it isn’t. The engine knows the current object `this`, so it could get the parent method as
`Object.getPrototypeOf(this).method`. Unfortunately, such a "naive" solution won’t work.

Let’s demonstrate the problem. Without classes, using plain objects for the sake of simplicity.

In the example below, `rabbit.__proto__ = animal`. Now let’s try: in `rabbit.eat()` we’ll call `animal.eat()`, using
`Object.getPrototypeOf(this)`:

```js
const animal = {
  name: 'Animal',
  eat() {
    console.log(`${this.name} eats.`)
  }
}

const rabbit = {
  __proto__: animal,
  name: 'Rabbit',
  eat() {
    // That's how super.eat() could presumably work
    Object.getPrototypeOf(this).eat.call(this) // (*)
  }
}

rabbit.eat() // Rabbit eats.
```

At the line `(*)` we take `eat` from the prototype (`animal`) and call it in the context of the current object
(`rabbit`).

Please note that `call(this)` is important here, because a simple `Object.getPrototypeOf(this).eat()` would execute
parent eat in the context of the prototype, not the current object.

And in the code above it actually works as intended.

Now let’s add one more object to the chain. We’ll see how things break:

```js
const animal = {
  name: 'Animal',
  eat() {
    console.log(`${this.name} eats.`)
  }
}

const rabbit = {
  __proto__: animal,
  eat() {
    // ...Bounce around rabbit-style and call parent (animal) method
    Object.getPrototypeOf(this).eat.call(this) // (*)
  }
}

const longEar = {
  __proto__: rabbit,
  eat() {
    // ...Do something with long ears and call parent (rabbit) method
    Object.getPrototypeOf(this).eat.call(this) // (**)
  }
}

longEar.eat() // Error: Maximum call stack size exceeded
```

The code doesn’t work anymore!

It may be not that obvious, but if we trace `longEar.eat()` call, then we can see why:

1. Inside `longEar.eat()`, the line `(**)` calls `rabbit.eat()` providing it with `this = longEar`.
2. Then in the line `(*)` of `rabbit.eat`, we’d like to pass the call even higher in the chain, but `this = longEar`, so
   `Object.getPrototypeOf(this).eat` is again `rabbit.eat`!
3. ...So `rabbit.eat` calls itself in the endless loop, because it can’t ascend any further.

To solve the problem, we should not find the parent prototype from `this`, because `this` may be anything, depending on
the user are calling this method on which object.

JavaScript adds one more special internal property for methods, named `[[HomeObject]]`, it always references the object
where the method is defined. Then `super` uses it to resolve the parent prototype and its methods.

> [!Note]
>
> JavaScript only adds `[[HomeObject]]` for methods, not for function properties, so we can only use `super` in methods.
>
> <!-- eslint-skip -->
>
> ```js
> const animal = {
>   eat: function() { // This is a function property, not a method
>     // ...
>   }
> };
>
> const rabbit = {
>   __proto__: animal,
>   eat: function() {
>     super.eat()
>   }
> };
>
> rabbit.eat()  // Error calling super (because there's no [[HomeObject]])
> ```

By using `super`, our code works correctly again:

```js
const animal = {
  name: 'Animal',
  eat() {
    // [[HomeObject]] == animal (implicitly)
    console.log(`${this.name} eats.`)
  }
}

const rabbit = {
  __proto__: animal,
  name: 'Rabbit',
  eat() {
    // [[HomeObject]] == rabbit (implicitly)
    super.eat() // Just like: `[[HomeObject]].__proto__.eat.call(this)`
  }
}

const longEar = {
  __proto__: rabbit,
  name: 'Long Ear',
  eat() {
    // [[HomeObject]] == longEar (implicitly)
    super.eat() // Just like: `[[HomeObject]].__proto__.eat.call(this)`
  }
}

// Works correctly again!
longEar.eat() // -> Long Ear eats.
```

> [!Caution]
>
> As we’ve known before, generally functions are "free", not bound to objects in JavaScript. So they can be copied
> between objects and called with another `this`:
>
> ```js
> const animal = {
>   eat() { console.log(`${this.name} eats.`) }
> }
>
> const rabbit = { name: 'Rabbit' }
> rabbit.eat = animal.eat
> rabbit.eat() // -> Rabbit eats.
> ```
>
> The very existence of `[[HomeObject]]` violates that principle, because methods remember their `objects.[[HomeObject]]`
> can’t be changed, so this bond is forever.
>
> The only place in the language where `[[HomeObject]]` is used is `super`. So, if a method does not use `super`, then we
> can still consider it "free" and copy between objects. But with `super` things may go wrong.
>
> ```js
> const animal = {
>   sayHi() {
>     console.log('I\'m an animal')
>   }
> }
>
> // rabbit inherits from animal
> const rabbit = {
>   __proto__: animal,
>   sayHi() {
>     // [[HomeObject]] == rabbit (implicitly)
>     super.sayHi() // Will be resolved as: `[[HomeObject]].__proto__.sayHi.call(this)`
>   }
>   /**
>    * Because `[[HomeObject]] === rabbit`,
>    * and `super.sayHi()` is resolved as `[[HomeObject]].__proto__.sayHi.call(this)`,
>    * the method body looks like this:
>    * sayHi() {
>    *   rabbit.__proto__.sayHi.call(this)
>    * }
>    */
> }
>
> const plant = {
>   sayHi() {
>     console.log('I\'m a plant')
>   }
> }
>
> // tree inherits from plant
> const tree = {
>   __proto__: plant,
>   sayHi: rabbit.sayHi
>   /**
>    * Here we copy `sayHi` from `rabbit` to `tree`, method body is the same as above:
>    * sayHi() {
>    *   rabbit.__proto__.sayHi.call(this)
>    * }
>    */
> }
>
> tree.sayHi() // -> I'm an animal (?!)
> ```

### Static methods and properties

Static methods are belong to class, not objects:

```js
class Article {
  constructor(title, date) {
    this.title = title
    this.date = date
  }

  static createTodays() {
    // Remember, this = Article
    return new this('Today\'s digest', new Date())
  }
}

const article = Article.createTodays()
console.log(article.title) // -> Today's digest

article.createTodays() // Error: `article.createTodays` is not a function
```

Because it's just like:

```js
Article.createTodays = function () {
  // Remember, this = Article
  return new this('Today\'s digest', new Date())
}
```

`createToDays` does not exist in `Article.prototype`, so objects created by `new Article` can’t access it.

The same as static properties:

```js
class Article {
  static publisher = 'Ilya Kantor'
}

console.log(Article.publisher) // -> Ilya Kantor
```

It's just like:

```js
Article.publisher = 'Ilya Kantor'
```

What's more, static methods and properties are inherited.

```js
class Animal {
  constructor(name, speed) {
    this.speed = speed
    this.name = name
  }

  run(speed = 0) {
    this.speed += speed
    console.log(`${this.name} runs with speed ${this.speed}.`)
  }

  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed
  }
}

class Rabbit extends Animal {
  hide() {
    console.log(`${this.name} hides!`)
  }
}
```

Look at this inheritance diagram:

```
Animal -- prototype --> Animal.prototype
  ^                         ^
  |                         |
  | [[prototype]]           | [[prototype]]
  |                         |
 Dog -- prototype -----> Dog.prototype
```

`extends` not only sets `Dog.prototype.[[prototype]]` to `Animal.prototype`, but also sets `Dog.[[prototype]]` to
`Animal`.

That's how static methods and properties are inherited.

> [!Note]
>
> As we already know all classes are extended from `Object`.
>
> Normally, when one class extends another, both static and non-static methods are inherited (using `extends` keyword).
>
> But built-in classes are an exception, they don't inherit static members from each other.
>
> For example, both `Array` and `Date` inherit from `Object`, so their instances have methods from `Object.prototype`.
> But `Array.[[Prototype]]` does not reference `Object`, so there’s no, for instance, `Array.keys()` (or `Date.keys()`)
> static method.

### Private and protected methods and properties

In JavaScript, there are no "protected" properties or methods, but we can use naming conventions (prefixing with an
underscore "\_") to indicate that a property or method is intended for internal use only.

```js
class CoffeeMachine {
  _waterAmount = 0 // Protected property

  set waterAmount(value) {
    this._waterAmount = value
  }

  get waterAmount() {
    return this._waterAmount
  }

  constructor(power) {
    this._power = power
  }
}

// create the coffee machine
const coffeeMachine = new CoffeeMachine(100)
// add water
coffeeMachine.waterAmount = 10
```

The same as protected methods and properties, private methods and properties are using naming conventions (prefixing
with a hash "#"), which is included in ECMAScript 2022.

The same as other languages, protected properties and methods can be inherited, but private ones cannot.

The only special thing is that private ones can not be accessed from `this[variable]`, for security reasons:

```js
class User {
  // ...
  sayHi() {
    const fieldName = 'name'
    console.log(`Hello, ${this[fieldName]}`)
  }
}
```

### Check class of instance

As we all know, we can use `typeof` operator to check the type of a variable:

```js
console.log(typeof 123) // -> 'number'
console.log(typeof true) // -> 'boolean'
```

And we can use `instanceof` operator to check if an object is created by a certain class:

```js
class User {}
const user = new User()
console.log(user instanceof User) // -> true
```

But what if we want to get the class name as a string?

We can use `Object.prototype.toString` to get the class name:

- For a `number`, it will be `'[object Number]'`
- For a `boolean`, it will be `'[object Boolean]'`
- For `null`: `'[object Null]'`
- For `undefined`: `'[object Undefined]'`
- For arrays: `'[object Array]'`
- ...etc (customizable).

To customize the result, we can add a property named `Symbol.toStringTag` to the class:

```js
class User {
  // Use a getter without setter to make it non-writable
  get [Symbol.toStringTag]() {
    return 'User'
  }
}
const user = new User()
console.log(Object.prototype.toString.call(user)) // -> [object User]
```

## Error handling

### `try...catch...finally`

Like other languages, JavaScript uses `try...catch...finally` statement to handle runtime errors.

`try` statement contains code that may throw an error, `catch` statement contains code to handle the error, and
`finally` statement is optional, and always executed after `try` and `catch`, regardless of the outcome.

```js
function func() {
  try {
    // Code that may throw an error
  }
  catch (err) {
    // Code to handle the error
  }
  finally {
    // Code that will run regardless of the result above
  }
}
```

But there are some special things in JavaScript:

1. If you don't need error details, you can omit the `err` parameter in `catch` (included in ECMAScript 2019):

```js
function func() {
  try {
    // Code that may throw an error
  }
  catch {
    // Code to handle the error
  }
}
```

2. If you don't want to handle the error, but want to be sure that processes that we started are finalized, you can omit
   the `catch` block:

```js
function func() {
  try {
    // Code that may throw an error
  }
  finally {
    // Complete the finalization even if an error occurs above
  }
}
```

3. `finally` works for any exit from `try...catch`, including explicit `return`:

```js
function func() {
  try {
    return 1
  }
  finally {
    console.log('finally') // -> finally
  }
}
```

### Custom errors

We can extends the built-in `Error` class to create custom error classes:

<!-- eslint-disable no-useless-constructor -->

```js
class BaseError extends Error {
  constructor(message) {
    super(message) // (1)
    this.name = this.constructor.name // (2)
  }
}

class JsonValidationError extends BaseError {
  constructor(message) {
    super(message)
  }
}

class JsonValidationRequireError extends JsonValidationError {
  constructor(property) { // (3)
    super(`Property "${property}" is missing`)
  }
}

class JsonValidationTypeError extends JsonValidationError {
  constructor(property, expectedType) {
    super(`Type of property "${property}" is expected to be "${expectedType}", but got "${typeof property}"`)
  }
}

function readUser(json) {
  const user = JSON.parse(json)

  if (!user.age) {
    throw new JsonValidationRequireError('age')
  }
  if (!Number.isInteger(user.age)) {
    throw new JsonValidationTypeError('age', 'Integer')
  }
  if (!user.name) {
    throw new JsonValidationRequireError('name')
  }

  return user
}

try {
  const user = readUser('{ "age": 25 }')
}
catch (err) {
  if (err instanceof JsonValidationError) {
    console.log(err)
    /**
     * -> JsonValidationRequireError: Property "name" is missing
     *   at readUser (...)
     *   at ...
     */
  }
  else {
    throw err // Unknown error, rethrow it (don't know how to handle it)
  }
}
```

The essential parts are:

1. We should call `super(message)` in the constructor to pass the error message to the parent class.
2. We use `constructor.name` to set the `name` property of the error, so that it reflects the actual class name.
3. We can change the constructor to accept any parameters we need and generate the message inside.

## Promises, async/await

### Callbacks and promises

In the past, JavaScript used callbacks to implement asynchronous programming, but it leads to "callback hell" and
makes code hard to read.

```js
function loadScript(src, onfulfilled, onrejected) {
  const script = document.createElement('script')
  script.src = src
  script.onload = () => onfulfilled(script)
  script.onerror = () => onrejected(new Error(`Failed to load script: ${src}`))
  document.head.append(script)
}

loadScript(
  '/my/script.js',
  (script) => {
    loadScript(
      '/my/script2.js',
      (script) => {
        loadScript(
          '/my/script3.js',
          (script) => {
            // ...continue after all scripts are loaded
          },
          (error) => {
            console.error(error)
          }
        )
      },
      (error) => {
        console.error(error)
      }
    )
  },
  (error) => {
    console.error(error)
  }
)
```

To solve this problem, JavaScript introduced `Promise`.

A promise has a constructor that takes a function with two parameters: `resolve` and `reject`.

This function is called the "executor", it's the operation we want to perform asynchronously.

Promise has three states, when we call `resolve` or `reject`, the state changes:

- `pending`: initial state, meaning that the operation is still ongoing.
- `fulfilled`: After we call `resolve` in the executor, promise turns to this state, meaning that the operation
  completed successfully.
- `rejected`: After we call `reject` or got an error in the executor, promise turns to this state, meaning that the
  operation failed.

> [!Note]
>
> We can say that a promise is `settled` if it is either `fulfilled` or `rejected`.

We can call `then` method on `Promise`, it accepts two callback function that is called when the promise is `fulfilled`
or `rejected`, which are called "handlers".

There is also a `catch` method, which is a shorthand for `.then(null, rejectionHandler)`.

These allows us to flatten the nested callbacks structure we had before, and makes code more readable, to handle
asynchronous operations in a more elegant way.

```js
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(script)
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.append(script)
  })
}

loadScript('/my/script.js')
  .then(
    (script) => {
      return loadScript('/my/script2.js')
    },
    (error) => {
      console.error(error)
    }
  )
  .then(
    (script) => {
      return loadScript('/my/script3.js')
    },
    (error) => {
      console.error(error)
    }
  )
  .then(
    (script) => {
    // ...continue after all scripts are loaded
    },
    (error) => {
      console.error(error)
    }
  )
```

Notice that, `then` or `catch` method always returns **a new promise**, and spreads the result to the next handler.

If the handler return isn't a promise, it will be wrapped in a promise resolved with that value:

```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000) // (*)
})
  .then((result) => {
    console.log(result) // -> 1
    return result * 2
  })
```

Are the same as:

```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000) // (*)
})
  .then((result) => {
    console.log(result) // -> 1
    return new Promise(resolve => resolve(result * 2)) // Will automatically wrap in a promise
  })
```

> [!Note]
>
> To be precise, a handler may return not exactly a promise, but a so-called "thenable" object – an arbitrary object
> that has a method `then`. It will be treated the same way as a promise.
>
> The idea is that 3rd-party libraries may implement “promise-compatible” objects of their own. They can have an
> extended set of methods, but also be compatible with native promises, because they implement `then`.
>
> ```js
> class Thenable {
>   constructor(num) {
>     this.num = num
>   }
>
>   then(resolve, reject) {
>     console.log(resolve) // function() { native code }
>     // resolve with this.num*2 after the 1 second
>     setTimeout(() => resolve(this.num * 2), 1000) // (**)
>   }
> }
>
> new Promise(resolve => resolve(1))
>   .then((result) => {
>     return new Thenable(result) // (*)
>   })
>   .then(console.log) // shows 2 after 1000ms
> ```
>
> JavaScript checks the object returned by the .then handler in line (\*): if it has a callable method named then, then
> it calls that method providing native functions resolve, reject as arguments (similar to an executor) and waits until
> one of them is called. In the example above resolve(2) is called after 1 second (\*\*). Then the result is passed
> further down the chain.
>
> This feature allows us to integrate custom objects with promise chains without having to inherit from Promise.

Like `try...catch...finally`, `Promise` also has a `finally` method, which is called when the promise is either
`fulfilled` or `rejected`. The idea of `finally` is to execute a handler without any arguments, which is used to
finalize the process, regardless of the outcome.

```js
new Promise((resolve, reject) => {
  /* do something that takes time, and then call resolve or maybe reject */
})
  // runs when the promise is settled, doesn't matter successfully or not
  .finally(() => stopLoadingIndicator())
  // so the loading indicator is always stopped before we go on
  .then(result => showResult(result), err => showError(err))
```

Differently, `finally` method has no return value, the returns will always be ignored. It just passes the result from
the previous promise or error to the next handler.

### Promises chaining

We can call `then` method both standalone or chained:

```js
// This call three times on the same promise
const standalone = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000)
})
standalone.then((result) => { // sp1
  console.log(result) // -> 1
  return result * 2
})
standalone.then((result) => { // sp2
  console.log(result) // -> 1
  return result * 2
})
standalone.then((result) => { // sp3
  console.log(result) // -> 1
  return result * 2
})

// This call each time on the new promise returned by the previous `then`
const chained = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000)
})
  .then((result) => { // cp1
    console.log(result) // -> 1
    return result * 2
  })
  .then((result) => { // cp2
    console.log(result) // -> 2
    return result * 2
  })
  .then((result) => { // cp3
    console.log(result) // -> 4
    return result * 2
  })
```

They are quite different.

For standalone promises, each `then` is independent, they all get the same result of the original promise.

```txt
new Promise => 1
    |
    +-------------------+-------------------+
    |                   |                   |
    then => 2 (sp1)     then => 2 (sp2)     then => 2 (sp3)
```

For chained promises, each `then` is dependent on the previous one, they all get the result of the previous promise.

```txt
new Promise => 1
    |
    +- then => new Promise => 1 2 (cp1)
                   |
                   +- then => new Promise => 2 4 (cp2)
                                  |
                                  +- then => new Promise => 4 8 (cp3)
```

In practice we rarely need multiple handlers for one promise. Chaining is used much more often, but this is good to
know.

### Promise API

#### `Promise.all`

If we want to run multiple asynchronous operations in parallel and wait until all of them are completed, we can use
`Promise.all`.

It accepts an iterable (usually an array) of promises, and returns a new promise that is fulfilled when **all** the
input promises are fulfilled, or rejected when **any** of the input promises is rejected.

```js
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000)) // 3
]).then(console.log) // 1,2,3 when promises are ready: each promise contributes an array member
```

Please note that the order of the resulting array members is the same as in its source promises.

> [!Caution]
>
> If one promise rejects, `Promise.all` immediately rejects, completely forgetting about the other ones in the list.
> Their results are ignored.

#### `Promise.allSettled`

In ECMAScript 2020, `Promise.allSettled` was added to the language.

Differently from `Promise.all`, it waits until all input promises are settled, regardless of whether they are
fulfilled or rejected.

This is useful when we want to know the result of all operations, without failing fast on the first rejection.

#### `Promise.race`

As it's name suggests, `Promise.race` returns a promise that **settles** as soon as one of the input promises settles,
with the same value or reason.

#### `Promise.any`

As it's name suggests, `Promise.any` returns a promise that **fulfills** as soon as one of the input promises fulfills,
with the value of the fulfilled promise.

If all input promises are rejected, it rejects with an `AggregateError`, a new error type that groups multiple errors
together.

### Microtasks

Promise handlers `then`/`catch`/`finally` are always asynchronous.

Even when a Promise is immediately resolved, the code on the lines below `then`/`catch`/`finally` will still execute
before these handlers.

Here’s a demo:

```js
const promise = Promise.resolve()

promise.then(() => console.log('promise done!'))

console.log('code finished') // This console.log shows first
```

If you run it, you see code finished first, and then promise done!

Why did the `then` trigger afterwards? What’s going on?

#### Microtasks queue

Asynchronous tasks need proper management. For that, the ECMA standard specifies an internal queue PromiseJobs, more
often referred to as the "microtask queue" (V8 term).

As stated in the [specification](https://tc39.github.io/ecma262/#sec-jobs-and-job-queues):

- The queue is first-in-first-out: tasks enqueued first are run first.
- Execution of a task is initiated only when nothing else is running.

Or, to put it more simply, when a promise is ready, its `then`/`catch`/`finally` handlers are put into the queue; they
are not executed yet. When the JavaScript engine becomes free from the current code, it takes a task from the queue and
executes it.

That’s why "code finished" in the example above shows first.

**What if the order matters for us? How can we make code finished appear after promise done?**

Easy, just put it into the queue with `then`:

```js
Promise.resolve()
  .then(() => console.log('promise done!'))
  .then(() => console.log('code finished'))
```

TODO(Lumirelle): Add more explanation about event loop and macrotasks (new chapter).

#### Unhandled rejections

Now we can see exactly how JavaScript finds out that there was an unhandled rejection.

**An "unhandled rejection" occurs when a promise error is not handled at the end of the microtask queue.**

### Async/await

Async function means a function that always returns a promise. Other values are wrapped in a resolved promise automatically.

```js
async function f() {
  return 1 // Same as: return Promise.resolve(1)
}
f().then(console.log) // -> 1
```

The keyword `await` is only allowed inside async functions, it makes JavaScript wait until that promise settles and
returns its result.

```js
async function f() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done!'), 1000)
  })

  const result = await promise // Wait until the promise resolves (*)

  console.log(result) // -> "done!"
}

f()
```

It's the better way to write promise-based code, making it look like synchronous.

> [!Note]
>
> In modern browsers, `await` on top level works just fine, when we’re inside a module.
>
> If we’re not using modules, or [older browsers](https://caniuse.com/mdn-javascript_operators_await_top_level) must be
> supported, there’s a universal recipe: wrapping into an anonymous async function.
>
> ```js
> (async () => {
>   const response = await fetch('/article/promise-chaining/user.json')
>   const user = await response.json()
>   // ...
> })()
> ```

> [!Note]
>
> Like promise.then, await allows us to use thenable objects.

## Generators, advanced iteration

### Generators

Regular functions return only one, single value (or nothing).

Generators can return ("yield") multiple values, one after another, on-demand. They work great with iterables, allowing
to create data streams with ease.

```js
function* generateSequence() {
  yield 1
  yield 2
  return 3
}
```

Generator functions are declared with `function*` syntax.

When called, they don’t run the function body right away. Instead, they return a special object called "generator
object" to manage the execution.

```js
function* generateSequence() {
  yield 1
  yield 2
  return 3
}

// "generator function" creates "generator object"
const generator = generateSequence()
console.log(generator) // -> [object Generator]
```

The main method of a generator is `next()`. When called, it runs the execution until the nearest `yield [value]`
statement (`value` can be omitted, then it’s `undefined`). Then the function execution pauses, and the yielded value is
returned to the outer code.

The result of next() is always an object with two properties:

- `value`: the yielded value
- `done`: `true` if the function has finished, `false` otherwise

As you probably already guessed looking at the next() method, generators are iterable.

We can loop over their values using for..of:

```js
function* generateSequence() {
  yield 1
  yield 2
  return 3
}

const generator = generateSequence()

for (const value of generator) {
  console.log(value) // -> 1, then 2
}
```

Looks a lot nicer than calling `next().value`.

But please note: the example above shows 1, then 2, and that’s all. It doesn’t show 3!

It’s because `for..of` iteration ignores the last value, when `done: true`. So, if we want all results to be shown by
`for..of`, we must return them with `yield`:

```js
function* generateSequence() {
  yield 1
  yield 2
  yield 3
}

const generator = generateSequence()

for (const value of generator) {
  console.log(value) // => 1, then 2, then 3
}
```

### Generator composition

Generator composition is a special feature of generators that allows to transparently "embed" generators in each other.

```js
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i
}

function* generatePasswordCodes() {
  // 0..9
  yield* generateSequence(48, 57)

  // A..Z
  yield* generateSequence(65, 90)

  // a..z
  yield* generateSequence(97, 122)
}

let str = ''

for (const code of generatePasswordCodes()) {
  str += String.fromCharCode(code)
}

console.log(str) // -> 0..9A..Za..z
```

The `yield*` directive delegates the execution to another generator. This term means that `yield* gen` iterates over the
generator `gen` and transparently forwards its yields outside. As if the values were yielded by the outer generator.

### `yield` is a two-way street

`yield` is a two-way street: it not only returns the result to the outside, but also can pass the value inside the
generator.

The result of `yield` expression is the value passed to the next `next(value)` call.

```js
function* gen() {
  const ask1 = yield '2 + 2 = ?'

  console.log(ask1) // -> 4

  const ask2 = yield '3 * 3 = ?'

  console.log(ask2) // -> 9
}

const generator = gen()

console.log(generator.next().value) // -> "2 + 2 = ?"

console.log(generator.next(4).value) // -> "3 * 3 = ?"

console.log(generator.next(9).done) // -> true
```

### Generator API

#### `generator.throw()`

As we observed in the examples above, the outer code may pass a value into the generator, as the result of `yield`.

So it should also support passing an error into the generator, we can use `throw` method to achieve this:

```js
function* gen() {
  try {
    const result = yield '2 + 2 = ?'

    console.log('The execution does not reach here, because the exception is thrown above')
  }
  catch (e) {
    console.error(e) // shows the error
  }
}

const generator = gen()

const question = generator.next().value

generator.throw(new Error('The answer is not found in my database'))
```

#### `generator.return()`

The `return` method stops the generator and sets `done: true` with the given value.

```js
function* gen() {
  yield 1
  yield 2
  yield 3
}

const g = gen()

g.next() // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next() // { value: undefined, done: true }
```

It's only useful when we want to stop the generator from outside, before it naturally finishes.

But it's good to know that it exists.

### Async generators and iteration

For most practical applications, when we’d like to make an object that asynchronously generates a sequence of values, we
can use an asynchronous generator.

The syntax is simple: prepend `function*` with `async`. That makes the generator asynchronous.

```js
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    // Wow, can use await!
    await new Promise(resolve => setTimeout(resolve, 1000))

    yield i
  }
}

const generator = generateSequence(1, 5)
for await (const value of generator) {
  console.log(value) // 1, then 2, then 3, then 4, then 5 (with delay between)
}
```

As the generator is asynchronous, we can use await inside it, rely on promises, perform network requests and so on.

Asynchronous iteration allow us to iterate over data that comes asynchronously, on-demand. Like, for instance, when we
download something chunk-by-chunk over a network. And asynchronous generators make it even more convenient.

```js
const range = {
  from: 1,
  to: 5,

  [Symbol.asyncIterator]() { // (1)
    return {
      current: this.from,
      last: this.to,

      async next() { // (2)
        // Note: we can use "await" inside the async next:
        await new Promise(resolve => setTimeout(resolve, 1000)) // (3)

        if (this.current <= this.last) {
          return { done: false, value: this.current++ }
        }
        else {
          return { done: true }
        }
      }
    }
  }
}

for await (const value of range) { // (4)
  console.log(value) // -> 1,2,3,4,5
}
```

> [!Caution]
>
> The spread syntax `...` doesn’t work asynchronously.
>
> That’s natural, as it expects to find `Symbol.iterator`, not `Symbol.asyncIterator`.
>
> It’s also the case for `for..of`: the syntax without `await` needs `Symbol.iterator`.
