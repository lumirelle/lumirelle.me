---
title: JS Advanced Grammar Manual
date: 2025-09-28T13:48+08:00
update: 2025-09-28T13:48+08:00
lang: en
duration: 24min
type: blog+note
---

[[toc]]

## Code style

### Particular case of omitting semicolons

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

### The modern mode, `"use strict"`

#### Why use strict mode?

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

#### Automatic strict mode

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

#### Summary

For modern JavaScript development, you should always use strict mode, except the cases when you need to work with legacy
code that can not be compatible with it.

### `var` vs `let`

`var` is a very different beast than `let`, it has a lot of weird behaviors different from the common way of variable
declaration in modern languages.

You shouldn't use `var` in modern JavaScript code, but you should know its behaviors to understand why you shouldn't use
it.

#### `var` has no block scope

`var` only has global scope and function scope, for instance:

<!-- eslint-disable -->

```js
if (true) {
  var x = 1
}
console.log(x) // 1, `x` is accessible here
```

As `var` has no block scope, we've got a global variable `x`.

If we use `var` inside a function, it will be scoped to that function:

<!-- eslint-disable -->

```js
function foo() {
  if (true) {
    var y = 2
  }
  console.log(y) // 2, `y` is accessible here
}
foo()
console.log(y) // ReferenceError: y is not defined
```

> [!Note]
>
> As there was only `var` in the past, people used to use **IIFE (Immediately Invoked Function Expression)** to create a
> new function scope to avoid polluting the global scope:
>
> <!-- eslint-disable -->
>
> ```js
> (function() {
>   var x = 1 // `x` and `y` are scoped to this function, not global
>   var y = 2
>   console.log(x + y) // 3
> })()
> ```
>
> We can find them in a lot of old JS code, and now, you know why they are there.
>
> Nowadays, we can use `let` and `const` to create block scope variables, so IIFE is no longer necessary.

#### `var` declarations are hoisted

`var` declarations are hoisted to the top of their enclosing function or global scope. This means that you can use a
`var` variable before its declaration without getting a `ReferenceError`:

<!-- eslint-disable -->

```js
a = 3
console.log(a) // 3
var a
console.log(a) // 3
```

This is technically equivalent to:

<!-- eslint-disable -->

```js
var a
a = 3
console.log(a) // 3
console.log(a) // 3
```

**Declarations are hoisted, but assignments are not.**

#### `var` tolerates redeclarations

You can redeclare a variable using `var` without getting an error:

<!-- eslint-disable -->

```js
var b = 4
var b = 5
console.log(b) // 5
```

## Data types

### Object

#### Keys of an object

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

#### Order of properties in an object

In JavaScript, the order of properties in an object is not guaranteed. However, in practice, most JavaScript engines
maintain the order of properties following the rules below:

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

#### Deep clone an object

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

#### Transform an object to other types

The object-to-primitive conversion is called automatically by many built-in functions and operators that expect a
primitive as a value.

There are 3 types (hints) of it:

- "string" (for `console.log` and other operations that need a string)
- "number" (for maths like `+`, `-`, `*`, `/`, etc)
- "default" (few operators, usually objects implement it the same way as "number", like `Date`)

The specification describes explicitly which operator uses which hint.

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
console.log(str.toUpperCase()) // 'HELLO', JS will wrap `str` with `String` object temporarily, and then destroy it
```

The most important thing to use "object wrappers" is to avoid using `new` keyword with them, because that will create an
object instead of a primitive value:

<!-- eslint-disable -->

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

The reason is that call a constructor function with `new` and without `new` will have completely different behavior:

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

We can use `new.target` to determine whether a function is called with `new` or not:

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

### Strings

#### Accessing characters

You can access characters in a string by index, just like accessing elements in an array:

```js
const str = 'hello'
console.log(str[0]) // 'h'
console.log(str[str.length - 1]) // 'o'
```

If you need negative index support, you can use `str.at(index)` method:

```js
const str = 'hello'
console.log(str.at(0)) // 'h'
console.log(str.at(-1)) // 'o'
```

> [!Note]
>
> `str.at(index)` method is included in ECMAScript 2022, so it may not be supported in older environments.
>
> You can use a polyfill or a library like `core-js` to add support for it in older environments.

#### Tagged template literals

JS supports
[tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
, which allows you to create custom string processing functions:

```js
function tag(strings, nameExp, locationExp) {
  // Array of string literals, that will be: ['Hello, ', ' in ', '!']
  console.log(strings)
  // Interpolated value for name, that will be: 'Alice'
  console.log(nameExp)
  // Interpolated value for location, that will be: 'Wonderland'
  console.log(locationExp)
  // Return the processed string: 'Welcome Here, Alice from Wonderland!'
  return `Welcome Here, ${nameExp} from ${locationExp}!`
}

const name = 'Alice'
const location = 'Wonderland'

tag`Hello, ${name} in ${location}!` // Call the `tag` function with the template literal
```

#### Local compare

`str.localeCompare(otherString[, locales[, options]])` method can be used to compare two strings in a locale-aware
manner instead of unicode order:

```js
const str1 = 'ä'
const str2 = 'z'
console.log(str1 > str2 ? 1 : -1) // 1 (in Unicode, 'ä' comes after 'z')
console.log(str1.localeCompare(str2)) // -1 (in German, 'ä' comes before 'z')
```

### Arrays

#### Accessing elements

The same as [strings](#accessing-characters).

#### Array length property

`length` property of an array is writable. If you increase it manually, nothing interesting will happen. But if you
decrease it manually, the array will be truncated. The process is irreversible:

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.length) // 5

arr.length = 3
console.log(arr) // [1, 2, 3]
```

So, the most simple way to clear an array is to set its `length` property to `0`:

#### `arr.splice()`

`arr.splice(start[, deleteCount, item1, ..., itemN])` method can be used to add, remove or replace elements in an array.

- To remove elements:

  ```js
  const arr = [1, 2, 3, 4, 5]
  arr.splice(1, 2) // Remove 2 elements starting from index 1
  console.log(arr) // [1, 4, 5]
  ```

- To add elements:

  ```js
  const arr = [1, 2, 3, 4, 5]
  arr.splice(2, 0, 'a', 'b') // Add 'a' and 'b' at index 2
  console.log(arr) // [1, 2, 'a', 'b', 3, 4, 5]
  ```

- To replace elements:

  ```js
  const arr = [1, 2, 3, 4, 5]
  arr.splice(1, 2, 'a', 'b') // Replace 2 elements starting from index 1 with 'a' and 'b'
  console.log(arr) // [1, 'a', 'b', 4, 5]
  ```

> [!Note]
>
> `arr.splice()` method modifies the original array and returns an array containing the deleted elements.

#### Array like and iterable objects

An array-like object is an object that has a `length` property and indexed elements:

```js
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}
```

An iterable object is an object that implements the iterable protocol, which means it has a `Symbol.iterator` method that
returns an iterator:

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

So an array-like object is not necessarily iterable, and an iterable object is not necessarily array-like.

### `Map` and `Set`

#### `WeakMap` and `WeakSet`

`WeakMap` and `WeakSet` are similar to `Map` and `Set`, but they only accept objects as keys (for `WeakMap`) or
values (for `WeakSet`), and they do not prevent garbage collection of the objects used as keys or values.

What's more, they do not have methods to iterate over their elements, such as `keys()`, `values()`, `entries()`, or
`forEach()`.

They are designed to be used in scenarios where you want to **associate data with an object** without preventing that object
from being garbage collected:

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

### Converting to number

In JS, we have three ways to convert a value to a number:

#### `Number.parseInt()`

`Number.parseInt()` will convert a value to a string first, then parse it to an integer number. It will ignore any
trailing non-numeric characters:

```js
console.log(Number.parseInt('42')) // 42
console.log(Number.parseInt('42px')) // 42
```

#### `Number()`

`Number()` will convert a value to a number directly. It will return `NaN` if the value can not be converted to a
number:

```js
console.log(Number('42')) // 42
console.log(Number('42px')) // NaN
```

#### Unary `+`

The unary `+` operator will also convert a value to a number directly, just like `Number()`, maybe a bit faster:

```js
console.log(+'42') // 42
console.log(+'42px') // NaN
```

#### Summary

The only case you need to ignore trailing non-numeric characters is when you should use `Number.parseInt()`, otherwise,
use `Number()` or unary `+` operator.

Just follow your preference or your team's coding style. `Number()` is more explicit and human-readable, while unary `+`
is more concise and maybe a bit faster.

### Implicit type conversion

#### For binary `+` operator

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

#### For comparison operators

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

## Advanced working with functions

### Closure

#### What is closure?

Closure is a function that remembers its outer variables (outer lexical environment) and can access them.

In JS, every function has a hidden property `[[Environment]]`, which is a reference to the lexical environment where the
function was created (there is only one exception, it uses global lexical environment which is to be covered in
[`new Function` syntax](#new-function-syntax)), that's to say, all functions are closures in JS.

See https://javascript.info/closure for the theory and implementation details of closure in JS.

#### Garbage collection

Usually, a Lexical Environment is removed from memory with all the variables after the function call finishes. That’s
because there are no references to it. As any JavaScript object, it’s only kept in memory while it’s reachable.

However, if there’s a nested function that is still reachable after the end of a function, then it has `[[Environment]]`
property that references the lexical environment.

In that case the Lexical Environment is still reachable even after the completion of the function, so it stays alive.

> [!Note]
>
> An important side effect in V8 (Chrome, Edge, Opera) is that such variable will become unavailable in debugging:
>
> <!-- eslint-disable -->
>
> ```js
> function f() {
>   let value = Math.random()
>
>   function g() {
>     debugger // in console: type alert(value); No such variable!
>   }
>
>   return g
> }
>
> let g = f()
> g()
> ```
>
> As you could see – there is no such variable! In theory, it should be accessible, but the engine optimized it out.

### Named function expression

A named function expression is a function expression that has a name. The name is **only accessible within the function
itself**.

So why do we need it? For instance, when we want to create a recursive function expression:

<!-- eslint-disable -->

```js
let doFact = function fact(n) {
  if (n <= 1)
    return 1
  return n * fact(n - 1) // use `fact` to call itself
}
```

You may think we can use `doFact` to call itself, but that will not work if we reassign `doFact` to other value:

<!-- eslint-disable -->

```js
let doFact = function fact(n) {
  if (n <= 1)
    return 1
  return n * doFact(n - 1) // use `doFact` to call itself
}

let anotherFact = doFact
doFact = null // reassign `doFact` to `null`

console.log(anotherFact(5)) // TypeError: doFact is not a function
```

That happens because the function takes `doFact` from the outer lexical environment. There is no local `doFact`, so the
outer variable is used. And at the moment of the call that outer `doFact` is null. That's why we need named function
expression.

> [!Note]
>
> This "internal name" features is only available for **function expressions**.

### `new Function` syntax

#### What is it?

There’s one more way to create a function. It’s rarely used, but sometimes there’s no alternative.

<!-- eslint-disable -->

```js
// new Function ([arg1, arg2, ...argN], functionBody)
let sum = new Function('a', 'b', 'return a + b')
console.log(sum(1, 2)) // 3
```

The last argument of `new Function` is the function body, and the previous arguments are the names for the function
parameters.

Through `new Function`, we can create functions dynamically, for instance, from a string received from a server:

<!-- eslint-disable -->

```js
const res = await fetch('/api/function-body').then(res => res.text())

let func = new Function('a', 'b', res)
func(1, 2)
```

#### Closure

Usually, a function remembers the lexical environment where it was created. But when a function is created with `new
Function`, it always uses the global lexical environment as `[[Environment]]`. So it can’t access outer variables, only
global ones.

What if it could access outer variables?

The problem is that before JavaScript is published to production, it’s compressed using a minifier – a special program
that shrinks code by removing extra comments, spaces and – what’s important, renames local variables into shorter ones.
So if new Function had access to outer variables, it would be unable to find them after minification:

You write this code:

_src/script.js_

<!-- eslint-disable -->

```js
let value = 1

let func = new Function('console.log(value)') // It seems works
func()
```

After minification, it may become:

_dist/script.min.js_

<!-- eslint-disable -->

```js
let a=1;let b=new Function("console.log(value)");b(); // ReferenceError: value is not defined
```

## Advanced working with objects

### Property flags (or you can call it descriptors)

#### Introduction

For data properties, besides a value, have three special attributes (so-called "flags"):

- <details>
  <summary>`writable` – if `true`, the value can be changed, otherwise it’s read-only.</summary>

  `writable` is `true`:

  <!-- eslint-disable -->

  ```js
  let user = {
    name: 'John', // writable: true
  }
  user.name = 'Pete' // works
  console.log(user.name) // 'Pete'
  ```

  `writable` is `false`:

  <!-- eslint-disable -->

  ```js
  let user = {}
  Object.defineProperty(user, 'name', {
    value: 'John',
    writable: false,
  })
  user.name = 'Pete' // Error in strict mode, fails silently otherwise
  console.log(user.name) // 'John'
  ```

  </details>

- <details>
  <summary>
  `enumerable` – if `true`, the property shows up during enumeration of the properties of the object, otherwise it’s
  hidden.
  </summary>

  `enumerable` is `true`:

  <!-- eslint-disable -->

  ```js
  let user = {
    name: 'John', // enumerable: true
  }
  for (let key in user) {
    console.log(key) // name
  }
  ```

  `enumerable` is `false`:

  <!-- eslint-disable -->

  ```js
  let user = {}
  Object.defineProperty(user, 'name', {
    value: 'John',
    writable: false,
  })
  for (let key in user) {
    console.log(key) // nothing
  }
  ```

  </details>

- <details>
  <summary>`configurable` – if `true`, the property can be deleted and these attributes can be modified, otherwise not.</summary>

  `configurable` is `true`:

  <!-- eslint-disable -->

  ```js
  let user = {
    name: 'John', // configurable: true
  }
  Object.defineProperty(user, 'name', {
    writable: false,
  }) // works
  delete user.name // works
  console.log(user.name) // undefined
  ```

  `configurable` is `false`:

  <!-- eslint-disable -->

  ```js
  let user = {}
  Object.defineProperty(user, 'name', {
    value: 'John',
    configurable: false,
  })
  Object.defineProperty(user, 'name', {
    writable: false,
  }) // Error: Cannot redefine property: name
  delete user.name // Fails silently
  console.log(user.name) // John
  ```

  Making a property non-configurable is a one-way road. We cannot change it back with `defineProperty`.

  > [!Note]
  >
  > There’s a minor exception about changing flags.
  >
  > We can change `writable: true` to `false` for a non-configurable property, thus preventing its value modification
  > (to add another layer of protection). Not the other way around though.

  </details>

For accessor property, they don't have `writable` flag, but instead have `get` and `set` functions:

<!-- eslint-disable -->

```js
let user = {
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

<!-- eslint-disable -->

```js
let user = {
  name: 'John', // writable: true, enumerable: true, configurable: true
}

let descriptor = Object.getOwnPropertyDescriptor(user, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* {
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
} */
```

We can change the flags using `Object.defineProperty`:

<!-- eslint-disable -->

```js
let user = {
  name: 'John',
}
Object.defineProperty(user, 'name', {
  writable: false,
  enumerable: false,
  configurable: false,
})

let descriptor = Object.getOwnPropertyDescriptor(user, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* {
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
} */
```

#### Clone properties with flags

When we clone an object with `Object.assign` or spread syntax `{ ...obj }`, only enumerable properties are copied, and
the flags are not preserved (all flags will be `true` in the new object).

We can use `Object.getOwnPropertyDescriptors` to get all properties with their flags, and then use
`Object.defineProperties` to clone them to a new object:

<!-- eslint-disable -->

```js
let user = {}
Object.defineProperty(user, 'name', {
  value: 'John',
  writable: false,
  enumerable: false,
  configurable: false,
})

let clonedUser = Object.defineProperties({}, Object.getOwnPropertyDescriptors(user))
let descriptor = Object.getOwnPropertyDescriptor(clonedUser, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* {
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

TODO(Lumirelle): Write this section after reading https://javascript.info/prototypes.
