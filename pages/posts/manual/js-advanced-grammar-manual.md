---
title: JavaScript Advanced Grammar Manual
date: 2025-09-28T13:48+08:00
update: 2025-10-09T14:32+08:00
lang: en
duration: 50min
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

_src/counter.JavaScript_

```js
// There is already a global variable `counter` fetched from the server
counter = await fetch('/api/counter').then(res => res.JavaScripton())

// Omit 2000 lines of code...
// ...
// ...
// ...
// ...
// ...

// Your new code, that also uses the global variable `counter`,
// ow it is overwritten to 1.
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
console.log(this) // In this case, `this` is the global object `window` (browser) or `globalThis` (node.JavaScript)
```

`"use strict"` directive is a way to end these situations, let JavaScript developers write more secure and optimized
code.

When you use strict mode, the following things will happen:

- Assigning a value to an undeclared variable will throw an error.
- `this` in functions that are not methods will be `undefined` instead of the global object.
- ...

By default, you need to explicitly enable it by adding it to the top of a
file or a function:

_src/your-code.JavaScript_

```js
'use strict'

console.log('This is strict mode')
```

#### Automatic strict mode

If you are using "classes" or "ES modules" in your source code, they will automatically enabled strict mode so you don't
need to add `"use strict"` manually:

- Case 1: _src/your-code-with-classes.JavaScript_

  ```js
  class MyClass {
    constructor() {
      console.log('This is strict mode')
    }
  }
  ```

- Case 2: _src/your-code-as-es-module.mJavaScript_

  ```js
  export function myFunction() {
    console.log('This is strict mode')
  }
  ```

- Case 3: _package.JavaScripton_

  ```json
  {
    "type": "module"
  }
  ```

  > All `.JavaScript` files will be treated as ES modules, and thus in strict mode.

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
> We can find them in a lot of old JavaScript code, and now, you know why they are there.
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
obj[1] = 'one' // Key `1` is converted to string `'1'`
obj[true] = 'true' // Key `true` is converted to string `'true'`
obj[null] = 'null' // Key `null` is converted to string `'null'`
obj[undefined] = 'undefined' // Key `undefined` is converted to string `'undefined'`
console.log(obj) // -> { '1': 'one', 'true': 'true', 'null': 'null', 'undefined': 'undefined' }
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

console.log(array)
/**
 * The `name` property of items in array is still `null`!
 * -> [
 *   { status: 1, message: 'Operation succeeded', name: null },
 *   { status: 0, message: 'Operation failed', name: null },
 * ]
 */
```

#### Computed property names

We can use square brackets `[]` in an object literal, when creating an object. This is called "computed property names".

<!-- eslint-disable -->

```js
let fruit = prompt('Which fruit to buy?', 'apple')

let bag = {
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

<!-- eslint-disable -->

```js
let fruit = prompt('Which fruit to buy?', 'apple')
let bag = {}

// Take property name from the fruit variable
bag[fruit] = 5
```

#### Property getters and setters

There are two kinds of object properties.

The first kind is data properties. We already know how to work with them. All properties that we’ve been using until now
were data properties.

The second type of property is something new. It’s an accessor property. They are essentially functions that execute on
getting and setting a value, but look like regular properties to an external code.

<!-- eslint-disable -->

```js
let obj = {
  get propName() {
    // Getter, the code executed on getting obj._propName
    console.log('Getter called')
    return this._propName
  },

  set propName(value) {
    // Setter, the code executed on setting obj._propName = value
    console.log('Setter called')
    this._propName = value
  }
}

obj.propName = 123 // -> Setter called
const a = obj.propName // -> Getter called
```

If a property only has a getter, then it’s read-only. If it only has a setter, then it’s write-only.

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
console.log(Reflect.ownKeys(obj)) // -> [ '3', 'x1', 'x0', Symbol(sym1) ]
```

#### Deep clone an object

For objects without functions, you can use `structuredClone()` to deep clone it:

```ts
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = structuredClone(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // -> 2
console.log(obj2.b.c) // -> 3
```

For objects with functions, you can use a library like `lodash`:

```ts
import _ from 'lodash'

const obj1 = { a: 1, b: { c: 2 } }
const obj2 = _.cloneDeep(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // -> 2
console.log(obj2.b.c) // -> 3
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
console.log(str.toUpperCase())
/**
 * JavaScript will wrap `str` with `String` object temporarily, and then destroy it
 * -> 'HELLO'
 */
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
> `str.at(index)` method is included in ECMAScript 2022, so it may not be supported in older environments.
>
> You can use a polyfill or a library like `core-js` to add support for it in older environments.

#### Tagged template literals

JavaScript supports
[tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
, which allows you to create custom string processing functions:

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
decrease it manually, the array will be truncated. The process is irreversible:

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.length) // -> 5

arr.length = 3
console.log(arr) // -> [1, 2, 3]
```

So, the most simple way to clear an array is to set its `length` property to `0`:

#### `arr.splice()`

`arr.splice(start[, deleteCount, item1, ..., itemN])` method can be used to add, remove or replace elements in an array.

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

So an array-like object is not necessarily iterable, and an iterable object is not necessarily array-like.

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

### Converting to number

In JavaScript, we have three ways to convert a value to a number:

#### `Number.parseInt()`

`Number.parseInt()` will convert a value to a string first, then parse it to an integer number. It will ignore any
trailing non-numeric characters:

```js
console.log(Number.parseInt('42')) // -> 42
console.log(Number.parseInt('42px')) // -> 42
```

#### `Number()`

`Number()` will convert a value to a number directly. It will return `NaN` if the value can not be converted to a
number:

```js
console.log(Number('42')) // -> 42
console.log(Number('42px')) // -> NaN
```

#### Unary `+`

The unary `+` operator will also convert a value to a number directly, just like `Number()`, maybe a bit faster:

```js
console.log(+'42') // -> 42
console.log(+'42px') // -> NaN
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
console.log(Boolean(a)) // -> false

let b = '0'
console.log(Boolean(b)) // -> true

console.log(a == b) // -> true!
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

In JavaScript, every function has a hidden property `[[Environment]]`, which is a reference to the lexical environment
where the function was created (there is only one exception, it uses global lexical environment which is to be covered
in [`new Function` syntax](#new-function-syntax)), that's to say, all functions are closures in JavaScript.

See https://javascript.info/closure for the theory and implementation details of closure in JavaScript.

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
>     debugger // In console: type alert(value); No such variable!
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
  return n * fact(n - 1) // Use `fact` to call itself
}
```

You may think we can use `doFact` to call itself, but that will not work if we reassign `doFact` to other value:

<!-- eslint-disable -->

```js
let doFact = function fact(n) {
  if (n <= 1)
    return 1
  return n * doFact(n - 1) // Use `doFact` to call itself
}

let anotherFact = doFact
doFact = null // Reassign `doFact` to `null`

console.log(anotherFact(5)) // -> TypeError: doFact is not a function
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
console.log(sum(1, 2)) // -> 3
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

_src/script.JavaScript_

<!-- eslint-disable -->

```js
let value = 1

let func = new Function('console.log(value)') // It seems works
func()
```

After minification, it may become:

_dist/script.min.JavaScript_

<!-- eslint-disable -->

```js
let a=1;let b=new Function("console.log(value)");b(); // ReferenceError: value is not defined
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

<!-- eslint-disable -->

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}

let user1 = { name: 'John' }
let user2 = { name: 'Jane' }
greet.call(user1, 'Hello', '!') // -> Hello, John!
greet.apply(user2, ['Hi', '.']) // -> Hi, Jane.
```

#### `func.bind`

If you want to create a new function with a specific `this` value and arguments, you can use `func.bind`:

- `func.bind(thisArg, arg1, arg2, ...)`

For instance:

<!-- eslint-disable -->

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}
let user = { name: 'John' }

// Create a new function with `this` set to `user` and first argument set to 'Hello',
// Now, the new function only needs one argument.
let greetUser = greet.bind(user, 'Hello')
greetUser('!') // -> Hello, John!
```

If you want to create a function that is bound to a specific argument and left `this` unchanged, you can use this simple
workaround:

<!-- eslint-disable -->

```js
function partial(func, ...argsBound) {
  return function(...args) { // This returns a new function, and passes `this` correctly
    return func.call(this, ...argsBound, ...args);
  }
}

let user = {
  name: 'John',
  greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`)
  }
}
user.greetHello = partial(user.greet, 'Hello') // `this` is still `user`
user.greetHello('!') // -> Hello, John!
```

## Advanced working with objects

### Property flags (or you can call it descriptors)

#### Introduction

For [data properties](#property-getters-and-setters), besides a value, have three special attributes (so-called
"flags"):

- <details>
  <summary>`writable` – if `true`, the value can be changed, otherwise it’s read-only.</summary>

  `writable` is `true`:

  <!-- eslint-disable -->

  ```js
  let user = {
    name: 'John', // writable: true
  }
  user.name = 'Pete' // Works
  console.log(user.name) // -> 'Pete'
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
  console.log(user.name) // -> 'John'
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
    console.log(key) // -> name
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
    console.log(key) // -> (nothing is logged)
  }
  ```

  </details>

- <details>
  <summary>
  `configurable` – if `true`, the property can be deleted and these attributes can be modified, otherwise not.
  </summary>

  `configurable` is `true`:

  <!-- eslint-disable -->

  ```js
  let user = {
    name: 'John', // configurable: true
  }
  Object.defineProperty(user, 'name', {
    writable: false,
  }) // Works
  delete user.name // Works
  console.log(user.name) // -> undefined
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

For [accessor property](#property-getters-and-setters), they don't have `writable` flag, but instead have `get` and
`set` functions:

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
console.log(JavaScriptON.stringify(descriptor, null, 2))
/* -> {
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
console.log(JavaScriptON.stringify(descriptor, null, 2))
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
> <!-- eslint-disable prefer-const -->
>
> ```js
> let obj = {
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
console.log(JavaScriptON.stringify(descriptor, null, 2))
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

<!-- eslint-disable -->

```js
function User(name) {
  this.name = name
}
let user = new User('John')
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
> <!-- eslint-disable -->
>
> ```js
> let animal = {
>   eats: true
> }
>
> function Rabbit(name) {
>   this.name = name
> }
>
> Rabbit.prototype = animal
>
> let rabbit = new Rabbit("White Rabbit") //  rabbit.[[prototype]] == animal
>
> console.log(rabbit.eats) // -> true
> ```

Every function has the default `prototype` property even if we don't supply it.

The default `prototype` is an object with only one property `constructor`, which points back to the function itself:

<!-- eslint-disable -->

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

<!-- eslint-disable -->

```js
import { user } from './some-module.JavaScript'

// We don't know how `user` is created,
// But we can create a new object with the same constructor as `user`
let newUser = new user.constructor()
```

> [!Caution]
>
> JavaScript does not ensure there is a `constructor` property in the prototype of a `Function`, it's not a standard.
>
> If we manually set `Func.prototype` to another object, the `constructor` property may be lost, so we shouldn't rely on
> it:
>
> <!-- eslint-disable -->
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
> let user = new User()
> console.log(user.constructor === User) // -> false (`undefined` !== User)
> ```
>
> The best practice is not to totally replace `Func.prototype`, but to add properties to it:
>
> <!-- eslint-disable -->
>
> ```js
> function User() {}
>
> User.prototype.sayHi = function() {
>   console.log('Hi')
> }
>
> let user = new User()
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
> 3. Classes always use strict mode. All code inside the class is automatically in strict mode.

### Class expression

Just like functions, classes can be defined inside another expression, passed around, returned, assigned, etc.

<!-- eslint-disable -->

```js
let User = class {
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

Just like literal objects, classes may include [getters/setters](#property-getters-and-setters),
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
      alert('Name is too short.')
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

<!-- eslint-disable -->

```js
let methodPrefix = 'say'
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

<!-- eslint-disable -->

```js
class User {
  name = prompt("Name, please?", "John");
}

let user = new User();
console.log(user.name); // -> John
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

<!-- eslint-disable -->

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

let dog = new Dog('Rex')
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

<!-- eslint-disable -->

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

let dog = new Dog('Rex')
dog.move() // -> Rex runs.
```

If we want to call the parent method from the child method, classes provide "super" keyword for that:

- `super.method(...)` to call a parent method.
- `super(...)` to call a parent constructor (inside our constructor only).

For instance:

<!-- eslint-disable -->

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

let dog = new Dog('Rex')
dog.move()
/**
 * -> Rex moves.
 * -> Rex runs.
 */
```

### Overriding constructor

According to the [specification](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation), if a
class extends another class and has no constructor, then the following "empty" constructor is generated:

<!-- eslint-disable -->

```js
class Rabbit extends Animal {
  constructor(...args) {
    super(...args)
  }
}
```

Now let’s add a custom constructor to `Rabbit`. It will specify the `earLength` in addition to `name`:

<!-- eslint-disable -->

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
let rabbit = new Rabbit('White Rabbit', 10) // Error: this is not defined.
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
`this.__proto__.method`. Unfortunately, such a "naive" solution won’t work.

Let’s demonstrate the problem. Without classes, using plain objects for the sake of simplicity.

In the example below, `rabbit.__proto__ = animal`. Now let’s try: in `rabbit.eat()` we’ll call `animal.eat()`, using
`this.__proto__`:

<!-- eslint-disable -->

```js
let animal = {
  name: 'Animal',
  eat() {
    console.log(`${this.name} eats.`)
  }
}

let rabbit = {
  __proto__: animal,
  name: 'Rabbit',
  eat() {
    // That's how super.eat() could presumably work
    this.__proto__.eat.call(this) // (*)
  }
}

rabbit.eat() // Rabbit eats.
```

At the line (\*) we take `eat` from the prototype (`animal`) and call it in the context of the current object
(`rabbit`).

Please note that `.call(this)` is important here, because a simple `this.__proto__.eat()` would execute
parent eat in the context of the prototype, not the current object.

And in the code above it actually works as intended.

Now let’s add one more object to the chain. We’ll see how things break:

<!-- eslint-disable -->

```js
let animal = {
  name: 'Animal',
  eat() {
    alert(`${this.name} eats.`)
  }
}

let rabbit = {
  __proto__: animal,
  eat() {
    // ...Bounce around rabbit-style and call parent (animal) method
    this.__proto__.eat.call(this) // (*)
  }
}

let longEar = {
  __proto__: rabbit,
  eat() {
    // ...Do something with long ears and call parent (rabbit) method
    this.__proto__.eat.call(this) // (**)
  }
}

longEar.eat() // Error: Maximum call stack size exceeded
```

The code doesn’t work anymore!

It may be not that obvious, but if we trace `longEar.eat()` call, then we can see why:

1. Inside `longEar.eat()`, the line (\*\*) calls `rabbit.eat()` providing it with `this = longEar`.
2. Then in the line (\*) of `rabbit.eat`, we’d like to pass the call even higher in the chain, but `this = longEar`, so
   `this.__proto__.eat` is again `rabbit.eat`!
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
> let animal = {
>   eat: function() { // This is a function property, not a method
>     // ...
>   }
> };
>
> let rabbit = {
>   __proto__: animal,
>   eat: function() {
>     super.eat()
>   }
> };
>
> rabbit.eat()  // Error calling super (because there's no [[HomeObject]])
> ```

By using `super`, our code works correctly again:

<!-- eslint-disable -->

```js
let animal = {
  name: 'Animal',
  eat() {
    // [[HomeObject]] == animal (implicitly)
    console.log(`${this.name} eats.`)
  }
}

let rabbit = {
  __proto__: animal,
  name: 'Rabbit',
  eat() {
    // [[HomeObject]] == rabbit (implicitly)
    super.eat() // Just like: `[[HomeObject]].__proto__.eat.call(this)`
  }
}

let longEar = {
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
> <!-- eslint-disable -->
>
> ```js
> let animal = {
>   eat() { console.log(`${this.name} eats.`) }
> }
>
> let rabbit = { name: 'Rabbit' }
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
> <!-- eslint-disable -->
>
> ```js
> let animal = {
>   sayHi() {
>     alert('I\'m an animal')
>   }
> }
>
> // rabbit inherits from animal
> let rabbit = {
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
> let plant = {
>   sayHi() {
>     alert('I\'m a plant')
>   }
> }
>
> // tree inherits from plant
> let tree = {
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

<!-- eslint-disable prefer-const -->

```js
class Article {
  constructor(title, date) {
    this.title = title
    this.date = date
  }

  static createTodays() {
    // remember, this = Article
    return new this('Today\'s digest', new Date())
  }
}

let article = Article.createTodays()
console.log(article.title) // -> Today's digest

article.createTodays() // Error: `article.createTodays` is not a function
```

Because it's just like:

```js
Article.createTodays = function () {
  // remember, this = Article
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
    alert(`${this.name} runs with speed ${this.speed}.`)
  }

  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed
  }
}

class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`)
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

<!-- eslint-disable prefer-const -->

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
let coffeeMachine = new CoffeeMachine(100)
// add water
coffeeMachine.waterAmount = 10
```

The same as protected methods and properties, private methods and properties are using naming conventions (prefixing
with a hash "#"), which is included in ECMAScript 2022.

The same as other languages, protected properties and methods can be inherited, but private ones cannot.

The only special thing is that private ones can not be accessed from `this[variable]`, for security reasons:

<!-- eslint-disable prefer-const -->

```js
class User {
  // ...
  sayHi() {
    let fieldName = 'name'
    alert(`Hello, ${this[fieldName]}`)
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

<!-- eslint-disable prefer-const -->

```js
class User {}
let user = new User()
console.log(user instanceof User) // -> true
```

But what if we want to get the class name as a string?

We can use `Object.prototype.toString` to get the class name:

- For a number, it will be [object Number]
- For a boolean, it will be [object Boolean]
- For null: [object Null]
- For undefined: [object Undefined]
- For arrays: [object Array]
- ...etc (customizable).

To customize the result, we can add a property named `Symbol.toStringTag` to the class:

<!-- eslint-disable prefer-const -->

```js
class User {
  // Use a getter without setter to make it non-writable
  get [Symbol.toStringTag]() {
    return 'User'
  }
}
let user = new User()
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

TODO(Lumirelle): Complete later after reading https://javascript.info/async.
