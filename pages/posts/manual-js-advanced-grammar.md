---
title: JavaScript Advanced Grammar Manual
date: 2025-09-28T13:48+08:00
update: 2026-02-11T16:25+08:00
lang: en
duration: 89min
type: note
---

[[toc]]

> [!Note]
>
> This manual hypothesizes that you have already know the basic of JavaScript or other programming languages.

## Code Style

### Particular Case of Omitting Semicolons

I think this particular case is something that everyone who uses semicolon-free style in JavaScript must be aware of.

JavaScript has [automatic semicolon insertion (ASI)](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion) feature, which means that in most cases, you can omit semicolons at the end of statements. However, there are certain situations where omitting semicolons can lead to unexpected behavior:

<!-- eslint-skip -->

```js
// Example 1
console.log('Hello')

// [!code highlight:1]
[1].forEach(n => console.log(n))

// Example 2
(function () {
  console.log('This is an anonymous function')
})

// [!code highlight:1]
() => {
  console.log('This is an arrow function')
}
```

In this case, you will get an error, because the JavaScript engine will interprets it as:

<!-- eslint-skip -->

```js
// Example 1
console.log('Hello')[1]

// [!code highlight:1]
.forEach(n => console.log(n))

// Example 2
(function () {
  console.log('This is an anonymous function')
})()

// [!code highlight:1]
=> {
  console.log('This is an arrow function')
}
```

Use variable can avoid these problem:

<!-- eslint-disable prefer-arrow-callback,antfu/top-level-function -->

```js
// Example 1
console.log('Hello')

const arr = [1, 2, 3]
arr.forEach(n => console.log(n))

// Example 2
const anonymousFunc = function () {
  console.log('This is an anonymous function')
}

const arrowFunc = () => {
  console.log('This is an arrow function')
}
```

### The Modern Code Style, `"use strict"`

#### Why `"use strict"`?

For a long time, JavaScript evolved without compatibility issues. New features were added to the language while old functionality didn’t change.

That had the benefit of never breaking existing code. But the downside was that many early design defects got stuck in the language forever.

For example, you can assign a value to a variable that has not been declared, that will create a global variable implicitly, just like Python:

_src/counter.js_

```js
// Without explicit declaration
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

Another example is global `this`, in non-strict mode, `this` in a regular function (not method or constructor) will refer to the global object, which can lead to unexpected behaviors:

```js
// In this case (non-strict mode), `this` is the global object `window` (browser) or `globalThis` (node.js)
(function () {
  console.log(this) // -> global object
})()
```

`"use strict"` directive is a way to end these situations, let JavaScript developers write more secure and optimized code, so we should always use it in modern JavaScript development.

#### How to `"use strict"`?

For **CommonJS module** files, you need to explicitly enable it by adding `"use strict"` to the top of a file or a function:

_src/commonjs.js_

```js
'use strict'

console.log('This file is in strict mode')
```

_src/commonjs-function.js_

```js
function foo() {
  'use strict'

  console.log('This function is in strict mode')
}
```

For **ES module** files, everything is in strict mode:

_src/es-module.js_

```js
console.log('This file is in strict mode')
```

_src/es-module-function.js_

```js
export function foo() {
  console.log('This function is in strict mode')
}
```

And code inside `class` is always in strict mode too:

_src/class.js_

```js
class MyClass {
  constructor() {
    console.log('Code inside class is in strict mode')
  }
}
```

### Use `let` and `const` Instead of `var`

`var` is a very different beast than `let` and `const`, it has a lot of weird behaviors different from the common way of variable declaration in modern languages.

You shouldn't use `var` in modern JavaScript development, but it's still important to understand its behavior, because you may encounter it in old codebases, in some libraries or the build outputs.

#### Missing Block Scope

`var` only has **global scope** and **function scope**, the **block scope** is missing, for instance:

<!-- eslint-disable no-use-before-define,no-var,vars-on-top,block-scoped-var -->

```js
/** A global scope `var` */
var o = 1
console.log(o) // -> 1

function foo() {
  /** A function scope `var` */
  var x = 1
}
console.log(x) // -> ReferenceError: `x` is not defined

if (true) {
  /**
   * There is no block scope for `var`,
   * so this is still a global scope `var`
   */
  var y = 1
}
console.log(y) // -> 1, `y` is still accessible here
```

> [!Note]
>
> As there was only `var` in the old JavaScript, people used to use [IIFE (Immediately Invoked Function Expression)](#iife-immediately-invoked-function-expression) to avoid global scope pollution:
>
> <!-- eslint-disable no-var -->
>
> ```js
> (function () {
>   var x = 1 // `x` and `y` are scoped to this function, not global
>   var y = 2
>   console.log(x + y) // 3
> })()
>
> console.log(x) // ReferenceError: `x` is not defined
> console.log(y) // ReferenceError: `y` is not defined
> ```
>
> That's why IIFE exists. With `let` and `const`, we don't need this trick anymore.

#### Declaration Hoist

`var` declarations are implicitly hoisted to the top of their function or global scope. This means you can use a `var` variable before its explicit declaration in code without getting a `ReferenceError`:

<!-- eslint-disable no-use-before-define,no-var,vars-on-top -->

```js
// What a bullshit code,
// but it really works 😅
a = 3
console.log(a) // -> 3
var a
console.log(a) // -> 3
```

This is technically equivalent to:

<!-- eslint-disable no-var -->

```js
var a // This declaration is hoisted to the top of the scope
a = 3
console.log(a) // 3
console.log(a) // 3
```

Notice that, **declarations are hoisted, but assignments are not**:

<!-- eslint-disable no-use-before-define,no-var,vars-on-top -->

```js
console.log(a) // -> undefined

var a = 3
```

This is technically equivalent to:

<!-- eslint-disable no-var -->

```js
var a // This declaration is hoisted to the top of the scope

console.log(a) // -> undefined, because `a` is declared but not assigned yet

a = 3
```

#### Tolerate Redeclaration

You can redeclare a variable using `var` without getting an error:

<!-- eslint-disable no-var,no-redeclare -->

```js
var b = 4
var b = 5
console.log(b) // -> 5
```

This kind of tolerance is the most intolerable thing for us with `var`.

When you have a HTML page with two forms and two external JavaScript files:

_src/index.html_

```html
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
    <script src="./a.js"></script>
    <script src="./b.js"></script>
  </body>
</html>
```

_src/a.js_

<!-- eslint-disable no-var -->

```js
// Ha! We use formData to store the user input!
var formData = {
  name: 'Alice',
  age: 30,
}
$('#name').on('input', function () {
  formData.name = this.value
})
$('#age').on('input', function () {
  formData.age = this.value
})
$('#btn1').on('click', () => {
  $.ajax({
    url: '/api/submit',
    method: 'POST',
    data: formData,
  })
})
```

_src/b.js_

<!-- eslint-disable no-var -->

```js
// Hints: This file is created by copy-pasting

// Ha! We use formData to store the user input!
var formData = {
  needs: 'some data',
}
$('#needs').on('input', function () {
  formData.needs = this.value
})
$('#btn2').on('click', () => {
  $.ajax({
    url: '/api/submit',
    method: 'POST',
    data: formData,
  })
})
```

After user completing both two forms and click one of button... Ops! The endpoint will get the combined data for this two forms. 😇

### Other General Code Styles

Is there any other general code style? Yes:

- [Symbol name pattern](./code-style-symbol-name-pattern), whatever the programming language you are using
- [Encapsulation and modularity](./code-style-encapsulation-and-modularity), of course not only for JavaScript
- [Antfu's code style](https://github.com/antfu/skills/blob/main/skills/antfu/SKILL.md), highly recommended for JavaScript and TypeScript development

Here is the most important piece of advice: **Don't get lost in finding best practices. They are born from practicing.**

## Data Type

### Primitive

In JavaScript, a primitive (primitive value, primitive data type) is data that is not an [object](#object) and has no [methods](https://developer.mozilla.org/en-US/docs/Glossary/Method) or [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript).

There are 7 primitive types in JavaScript:

- `string`
- `number`
- `bigint`
- `boolean`
- `symbol`
- `undefined`
- `null`

#### String

`string` can be created by string literals or `String()` [constructor function](#constructor-function):

<!-- eslint-disable no-new-wrappers,unicorn/new-for-builtins -->

```js
const str1 = 'Hello, world!' // String literal
const str2 = String('Hello, world!') // String primitive
const str3 = new String('Hello, world!') // String object
```

String literals are character sequences enclosed in single quotes (`'...'`), double quotes (`"..."`) or backticks (`` `...` ``).

Single quotes and double quotes support escape sequences, while backticks support [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with interpolation and multi-line strings.

> [!Warning]
>
> Call `String()` constructor function with `new` keyword is not recommended, we will explain it later in [object wrappers for primitive](#object-wrappers-for-primitive) section.

For advanced string manipulation, see [the section below](#advanced-working-with-string).

#### Number

In JavaScript, there is only one number type, which is a double-precision 64-bit binary format IEEE 754 value. It can represent both integer and floating-point numbers.

`number` can be created by number literals or `Number()` constructor function too:

<!-- eslint-disable no-new-wrappers,unicorn/new-for-builtins -->

```js
const num1 = 42 // Number literal
const num2 = Number(42) // Number primitive
const num3 = new Number(42) // Number object
```

You can use prefix `0b` for binary literals, `0o` for octal literals, and `0x` for hexadecimal literals:

```js
const binary = 0b1010 // Binary literal, equals to 10 in decimal
const octal = 0o52 // Octal literal, equals to 42 in decimal
const hexadecimal = 0x2A // Hexadecimal literal, equals to 42 in decimal
```

Underscore (`_`) can be used as a separator for numeric literals to improve readability:

```js
const million = 1_000_000 // Equals to 1000000
const bytes = 0b1010_1011_1100_1101 // Equals to 43981 in decimal
```

The maximum safe integer in JavaScript is `Number.MAX_SAFE_INTEGER` (2^53 - 1), and the minimum safe integer is `Number.MIN_SAFE_INTEGER` (-(2^53 - 1)). Numbers outside this range may lose precision.

> [!Warning]
>
> Call `Number()` constructor function with `new` keyword is not recommended, we will explain it [later](#object-wrappers-for-primitive) too.

#### BigInt

`bigint` is a new primitive type introduced in ECMAScript 2020, it can represent integers with **arbitrary precision**.

`bigint` can be created by appending `n` to the end of an integer literal, or by using the `BigInt()` constructor function:

```js
const bigInt1 = 1234567890123456789012345678901234567890n // BigInt literal
const bigInt2 = BigInt('1234567890123456789012345678901234567890') // BigInt constructor function
```

> [!Note]
>
> Different from `string` and `number`, you may found that we cannot use `BigInt()` constructor function with `new` keyword (It will throw a TypeError).
>
> This is because `bigint` is newly introduced to JavaScript, and JavaScript changes the standard of the behavior of primitive object wrapper constructor, it disables the disrecommended behavior from language level. We will explain it [later](#object-wrappers-for-primitive) too.

#### Boolean

`boolean` can be created by boolean literals or `Boolean()` constructor function:

<!-- eslint-disable no-new-wrappers,unicorn/new-for-builtins -->

```js
const bool1 = true // Boolean literal
const bool2 = Boolean(true) // Boolean primitive
const bool3 = new Boolean(true) // Boolean object
```

> [!Warning]
>
> Also, call `Boolean()` constructor function with `new` keyword is not recommended, we will explain it [later](#object-wrappers-for-primitive) too.

#### Symbol

`symbol` is a special data type in JavaScript introduced in ECMAScript 2015.

A `symbol` is a data type that represents unique, unforgeable identifiers. They are sometimes called atoms.

Because a `symbol` is unique and unforgeable, you can only read a property value associated with a symbol if you have a reference to the original identifier.

`symbol` can created by `Symbol()` constructor function, or `Symbol.for()` [static method](#static-member).

`Symbol()` constructor always returns a unique symbol every time it is called, this means this kind of `symbol` are not shareable, they called **non-registered symbols**:

```js
const sym1 = Symbol()
const sym2 = Symbol('foo') // -> 'foo' is just a description for that symbol
const sym3 = Symbol('foo')
console.log(sym1 === sym2) // -> false
console.log(sym2 === sym3) // -> false
console.log(sym1 === sym3) // -> false
```

`Symbol.for(key)` static method returns a symbol from the global symbol registry with the given key. If there is no symbol with the given key, a new symbol will be created and registered with that key. This means this kind of `symbol` are shareable, they called **registered symbols**:

```js
const sym1 = Symbol.for('foo')
const sym2 = Symbol.for('foo')
console.log(sym1 === sym2) // -> true
```

JavaScript has many built-in symbols, such as `Symbol.iterator`, `Symbol.toStringTag`, `Symbol.toPrimitive`, etc. You can use them to customize the behavior of JavaScript built-in operations. We will cover them in the section of corresponding operation later.

> [!Note]
>
> Just like `bigint`, it's newly introduced to JavaScript, we cannot use `Symbol()` constructor function with `new` keyword (It will throw a TypeError).

#### Undefined and Null

`undefined` is a primitive value that represents the absence of a value or an uninitialized variable. It is the default value of variables that have not been assigned a value.

`null` is a primitive value that represents the **intentional** absence of any object value. It is often used to indicate that a variable should have no value.

We can create `undefined` and `null` by using their literals:

```js
const undef = undefined
const nul = null
```

Something should be noticed is comparsion with `undefined` and `null`, we will cover them in the section of [comparing with `null` and `undefined`](#comparing-with-null-and-undefined) later.

### Object

In JavaScript, objects can be seen as a collection of [properties](#property).

They can be created by **object literal syntax** or **constructor function**.

An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces (`{}`).

```js
const objLiteral = {
  name: 'Alice',
  age: 30,
  greet() {
    console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`)
  },
}
```

[Constructor function](#constructor-function) is a [function](#function) that is used to create objects, it is called with the `new` keyword, and it can have its own properties and methods.

```js
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`)
}
const person = new Person('Alice', 30)
```

Like other OOP languages, everything except [primitive](#primitive) in JavaScript are objects.

```js
const obj = {}
console.log(obj instanceof Object) // -> true
```

```js
const date = new Date()
console.log(date instanceof Object) // -> true
```

```js
const arr = [1, 2, 3]
console.log(arr instanceof Object) // -> true
```

```js
function func() {}
console.log(func instanceof Object) // -> true
```

#### Property

Property is identified using key value pair:

```js
const obj = {
  key: 'value',
}
```

Property name can be a `string`, `symbol` or any other type that can be converted to `string`, while property value can be any JavaScript type, including `object`.

#### Property Name

Property name can be a `string`, `symbol` or any other type that can be converted to `string`, everything execpt `Symbol` will be implicitly converted to `string`:

<!-- eslint-disable dot-notation -->

```js
const obj = {}
// Key `1` is converted to string `'1'`
obj[1] = 'one'
// Key `true` is converted to string `'true'`
obj[true] = 'true'
// Key `null` is converted to string `'null'`
obj[null] = 'null'
// Key `undefined` is converted to string `'undefined'`
obj[undefined] = 'undefined'

// -> { '1': 'one', 'true': 'true', 'null': 'null', 'undefined': 'undefined' }
console.log(obj)
```

So you should pay more attention when you are iterating an object defined with non-string keys, for example:

```js
const StatusEnum = {
  // [!code highlight:1]
  success: 1, // Use `1` as values, still `number`
  failure: 0,
}

const StatusDict = {
  // [!code highlight:1]
  1: 'success', // Use `1` as keys, will be converted to `string` implicitly
  0: 'failure',
}

const array = [
  // [!code highlight:2]
  // `status` is `number`
  { status: 1, message: 'Operation succeeded', name: null },
  { status: 0, message: 'Operation failed', name: null },
]

Object.entries(StatusEnum).forEach(([key, value]) => {
  // [!code highlight:3]
  // `item.status` is `number`, but `key` is actually `string`,
  // They will never be equal!
  const item = array.find(item => item.status === key)
  if (item) {
    item.name = key
  }
})

// [!code highlight:9]
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

You may interested that is this will break the access of properties with non-string keys? No, because of the non-string property names can only used with bracket notation, and they will be converted to string implicitly too.

See [property accessing under the hood](#property-accessing-under-the-hood) section for more details.

#### Dynamic (Computed) Property Name

We can use `[]` to reference a variable to define a dynamic property name, this is called "computed property names".

```js
const fruit = prompt('Which fruit to buy?', 'apple')

const bag = {
  // [!code highlight:1]
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

This is equivalent to, but has better readability than:

```js
const fruit = prompt('Which fruit to buy?', 'apple')
const bag = {}

// Take property name from the fruit variable
bag[fruit] = 5
```

#### Method

A method is a [function](#function) which is a property of an object.

There are two kinds of methods: **Instance methods** and **static methods**.

- Instance methods are build-in tasks performed by the object instance
- Static methods are tasks that are called directly on the object constructor

```js
function Person(name) {
  this.name = name
  this.instanceMethod = function () {
    console.log(`Hello, my name is ${this.name}`)
  }
}
Person.staticMethod = function () {
  console.log('This is a static method')
}

const person = new Person('Alice')
person.instanceMethod() // -> Hello, my name is Alice
Person.staticMethod() // -> This is a static method
```

> [!Note]
>
> When we talk about `F` is a method of `O`, it means function `F` uses `O` as its [`this`](#this) binding.
>
> So, `this` inside method `F` is `O`:
>
> ```js
> const O = {
>   name: 'Object O',
>   F() {
>     console.log(this.name)
>   },
> }
>
> O.F() // -> Object O
> ```
>
> We will talk about changing `this` binding of a function in the section of [change this](#change-this) later.

#### Property Accessing Under the Hood

In JavaScript, there are two ways to access properties of an object: **dot notation (`obj.prop`)** and **bracket notation (`obj['prop']`)**.

Both notations will call the internal method `[[Get]]` to retrieve the property value, and `[[Set]]` to set the property value.

These two internal method is implemented by the JavaScript engine, we cannot access them directly, and the signatures look like:

```js
/**
 * @param obj That object
 * @param propName The property name
 * @param receiver The value of `this` inside getter
 */
[[Get]](obj, propName, receiver)
```

```js
/**
 * @param obj That object
 * @param propName The property name
 * @param value The value to set
 * @param receiver The value of `this` inside setter
 */
[[Set]](obj, propName, value, receiver)
```

The key difference between the two notations is how they pass the `propName` argument to the internal methods:

- Dot notation:

  It will call `[[Get]]` or `[[Set]]` with a string literal as `propName`.

  ```js
  const obj = { name: 'Alice' }
  obj.name
  // => [[Get]](obj, 'name', obj)
  ```

- Bracket notation:

  If the expression inside the brackets is a `symbol`, it will call `[[Get]]` or `[[Set]]` with as it as `propName`.

  Otherwise, it will call them with the value of the expression converted to a string as `propName`.

  <!-- eslint-disable dot-notation -->

  ```js
  const obj = { name: 'Alice' }
  obj['name']
  // => [[Get]](obj, String('name'), obj)
  //    => [[Get]](obj, 'name', obj)
  obj[1]
  // => [[Get]](obj, String(1), obj)
  //    => [[Get]](obj, '1', obj)
  obj[{ key: 'name' }]
  // => [[Get]](obj, String({ key: 'name' }), obj)
  //    => [[Get]](obj, '[object Object]', obj)
  ```

  This is why after the property name is converted to string implicitly, we can still using the original one with bracket notation to access it:

  ```js
  const obj = {
    1: 'one', // Key `1` is converted to string `'1'` implicitly
    2: 'two'
  }
  console.log(obj[1]) // -> 'one'
  console.log(obj['1']) // -> 'one'
  console.log(obj[2]) // -> 'two'
  console.log(obj['2']) // -> 'two'
  ```

#### Accessor Property

Object has two kinds of properties: **data properties** and **accessor properties**.

Data properties just store different types of data, what we have seen before is data properties.

Accessor properties are essentially functions that execute on getting and setting a value, look like the custom version of internal `[[Get]]` and `[[Set]]` methods we can control ourselves:

```js
const obj = {
  // [!code highlight:7]
  /**
   * Getter, the code will be executed on getting `obj.propName`
   */
  get propName() {
    console.log('Getter called')
    return this._propName
  },

  // [!code highlight:7]
  /**
   * Setter, the code will be executed on setting `obj.propName = value`
   */
  set propName(value) {
    console.log('Setter called')
    this._propName = value
  }
}

// [!code highlight:2]
obj.propName = 123 // -> Setter called implicitly
const a = obj.propName // -> Getter called implicitly
```

> [!Note]
>
> If a property only has a getter, that means it’s read-only.
>
> If it only has a setter, that means it’s write-only.

#### Order of Properties in an Object

In JavaScript, the order of properties in an object is not guaranteed, but in practice, most JavaScript engines maintain the order of properties following the rules below:

- Properties with number-like name are ordered in ascending order.
- Properties with string name are ordered in the order they were added to the object, after all properties with number-like name.
- Properties with symbol name are ordered in the order they were added to the object, after all properties with string name.

For example:

<!-- eslint-disable style/quote-props -->

```js
const sym = Symbol('sym1')
const obj = {
  'x1': 'test-1',
  [sym]: 'tets-4',
  'x0': 'test-0',
  3: 'test-3'
}
// Properties with symbol name can not iterated by `for...in` loop
// or `Object.keys()`, but can be iterated by
// `Object.getOwnPropertySymbols()` or `Reflect.ownKeys()`.
console.log(Reflect.ownKeys(obj)) // -> [ '3', 'x1', 'x0', Symbol(sym1) ]
```

#### Clone an Object

As we all know, primitive values are stored directly in the variable, assigning or passing them to functions will create a **copy of the value**.

Object values are different, the variable only stores the reference to them, assigning or passing them to functions will create a **copy of the reference**, so they are still pointing to the same object value.

For example:

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

So, if we want to create a copy of object value, we need to clone it. Specially, when the object has nested objects, we need to deep clone it.

Object spread syntax (`{ ...obj }`) can be used to shallow clone an object, but not for deep cloning:

```js
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = { ...obj1 }
obj1.a = 2
obj1.b.c = 3

console.log(obj1.a) // -> 2
console.log(obj1.b.c) // -> 3

console.log(obj2.a) // -> 1, not affected
console.log(obj2.b.c) // -> 3, affected because of shallow clone
```

For deep cloning objects **without functions**, you can use built-in global function `structuredClone()` (ECMAScript 2021) to achieve this:

```js
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = structuredClone(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // -> 2
console.log(obj2.b.c) // -> 3
```

For objects **with functions** or JavaScript runtime does not support ECMAScript 2021, you can use a third-party library like `es-toolkit` to achieve this:

```js
import { cloneDeep } from 'es-toolkit/object'

const obj1 = { a: 1, b: { c: 2 } }
const obj2 = cloneDeep(obj1)
obj2.b.c = 3
console.log(obj1.b.c) // -> 2
console.log(obj2.b.c) // -> 3
```

#### Transform Object to Primitive

The object-to-primitive conversion is called automatically by many built-in functions and operators that expect a primitive as a value.

There are 3 types (hints) of it, as described in the [specification](https://tc39.github.io/ecma262/#sec-toprimitive):

- "string" (for `console.log` and other operations that need a string)
- "number" (for math operators like `+`, `-`, `*`, `/`, etc)
- "default" (few operators, usually objects implement it the same way as "number", like `Date`)

The conversion algorithm is:

1. Call `obj[Symbol.toPrimitive](hint)` if the method exists,
2. Otherwise if hint is `"string"` try calling `obj.toString()` or `obj.valueOf()`, whatever exists.
3. Otherwise if hint is `"number"` or `"default"` try calling `obj.valueOf()` or `obj.toString()`, whatever exists.

So the best practice is to implement `Symbol.toPrimitive` method for your object if you want to customize its conversion behavior:

```js
const obj = {
  a: 1,
  b: 2,
  [Symbol.toPrimitive](hint) {
    if (hint === 'string')
      return `a=${this.a}, b=${this.b}`
    return this.a + this.b
  },
}
```

#### Object Wrappers for Primitive

Primitives except `null` and `undefined` have their corresponding object wrappers:

- `String` for `string`
- `Number` for `number`
- `BigInt` for `bigint`
- `Boolean` for `boolean`
- `Symbol` for `symbol`

They are used to provide methods and properties for primitive values, **without changing their primitive nature**.

When you access a property or method on a primitive value, JavaScript automatically wraps the primitive in its corresponding object wrapper, allowing you to use methods and properties in the wrapper instance, and then it will be destroyed:

```js
const str = 'hello'
/**
 * -> 'HELLO'
 *
 * JavaScript will wrap `str` with `String` object temporarily,
 * and then destroy it
 */
console.log(str.toUpperCase())
```

> [!Caution]
>
> You can manually create some of them by their constructor function with `new` keyword:
>
> <!-- eslint-disable no-new-wrappers,unicorn/new-for-builtins -->
>
> ```js
> const strObj = new String('hello')
> const numObj = new Number(42)
> const boolObj = new Boolean(true)
> ```
>
> But this is not recommended, because it will break the primitive nature of the value, and cause unexpected behavior:
>
> <!-- eslint-disable no-new-wrappers,unicorn/new-for-builtins -->
>
> ```js
> const num1 = Number(0) // This returns a number, not an object
> const num2 = new Number(0) // This returns an object, not a number!
>
> // This will be logged, because `num1` is `0`, a falsy value
> if (!num1) {
>   console.log('num1 is falsy')
> }
>
> // This will NOT be logged, because `num2` is an object, and all objects are truthy
> if (!num2) {
>   console.log('num2 is falsy')
> }
> ```
>
> For `bigint` and `symbol` which are newly introduced to JavaScript, the language disables the disrecommended behavior of using their constructor function with `new` keyword directly, and you will get a `TypeError` if you try to do that:
>
> <!-- eslint-disable no-new,no-new-native-nonconstructor,unicorn/new-for-builtins -->
>
> ```js
> new BigInt(123) // TypeError: BigInt is not a constructor
> new Symbol('sym') // TypeError: Symbol is not a constructor
> ```
>
> To see the difference between calling a function with and without `new` keyword, please refer to [constructor function](#constructor-function) for more details.

#### Built-in Object

JavaScript provides many built-in objects that you can use to perform various tasks. Some commonly used built-in objects include:

| Object                                      | Description                                         |
| ------------------------------------------- | --------------------------------------------------- |
| `Object`                                    | The base object from which all objects inherit.     |
| [`Array`](#advanced-working-with-array)     | Used to create and manipulate arrays.               |
| [`Map`](#advanced-working-with-map-and-set) | A collection of key-value pairs.                    |
| [`Set`](#advanced-working-with-map-and-set) | A collection of unique values.                      |
| `Date`                                      | Used to work with dates and times.                  |
| `RegExp`                                    | Used for pattern matching with regular expressions. |
| ...                                         | ...                                                 |

### Function

Functions are code snippets that can be called by other code or itself, or variables that refer to the function.

There are two kinds of functions: **function declarations** and **function expressions**.

Function declarations is the general way to create function which will be hoisted, while function expressions are used to share function as values, so we can assign them to variables, pass them as arguments to other functions, or return them from other functions:

<!-- eslint-disable antfu/top-level-function -->

```js
// Function declaration
function fn(args) {
  /* function body */
}

// Function expression
(function (args) {
  /* function body */
});
(args) => { /* function body */ }

// Function expression with variable assignment
const fn1 = function (args) {
  /* function body */
}
const fn2 = (args) => {
  /* function body */
}
```

Function in JavaScript is also `object`.

#### Function Declaration

Function declaration will be hoisted to the top of the scope, so you can call it before its declaration, just like [variable declaration with `var`](#declaration-hoist):

```js
console.log(fn(1, 2)) // -> 3
function fn(a, b) {
  return a + b
}
```

We shouldn't depend on this behavior, as it will make the code less readable.

#### Function Expression

A function expression is a way to define a function as a value. It's similar to a function declaration, but it's not hoisted.

<!-- eslint-disable antfu/top-level-function -->

```js
const func = function (a, b) {
  return a + b
}
console.log(func(1, 2)) // -> 3
```

There is also a special kind of function expression called **arrow function** which we will cover [later](#arrow-function).

#### Anonymous Function

Anonymous functions are functions without a name, only function expressions can be anonymous, because function declarations must have a name:

```js
// Function declaration, must have a name
function declaredFunc() {}

// Anonymous function expression
(function () {});
() => {}
```

#### Named Function Expression

A named function expression is a function expression that has a name. The name is **only accessible within the function itself**.

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

That happens because the function takes `doFact` from the [outer lexical environment](#closure), and it can be changed by other code. That's why we need named function expression.

#### Arrow Function

An arrow function is a special function expression that is defined with the `=>` syntax.

```js
const func = (a, b) => a + b
console.log(func(1, 2)) // -> 3
```

Arrow functions is quite different from regular function and function expression: Arrow functions have no [`this`](#this), `arguments`, `super`, and `new.target`, it's always bound to the outer lexical environment where the arrow function was created.

The most common use case of arrow functions is avoid the change of `this`, especially in callbacks:

```js
const obj = {
  name: 'Alice',
  greet() {
    setTimeout(() => {
      // `this` in arrow function is the same as `this` in greet method,
      // which is `obj`, so we can access `obj.name` here.
      console.log(`Hello, my name is ${this.name}`)
    }, 1000)
  },
}
obj.greet() // -> Hello, my name is Alice
```

#### Inner/Outer Function

An inner function is a function inside another function, while the function containing a function is called outer function:

```js
function outer() {
  let a = 1

  function inner() {
    return a++
  }

  return inner()
}
```

#### IIFE (Immediately Invoked Function Expression)

As it's name, we can immediately invoke a function expression after defining it, and we should wrap the function expression with parentheses (`()`):

```js
(function () {
  console.log('This is an IIFE')
})();

(() => {
  console.log('This is also an IIFE')
})()
```

#### Constructor Function

A constructor function is a regular function that is used to create objects. It's expected to be called with the `new` keyword.

Calling a constructor function with `new` and without `new` can have completely different behavior:

- With `new`: A new object is created, and `this` inside the constructor points to that new object. If the constructor does not explicitly return an object, the new object is returned by default.

  In other words, `new MyConstructor(...)` does something like:

  ```js
  function MyConstructor() {
    // this = {} (implicitly)

    this.value = 42

    // return this (implicitly)
  }
  const obj1 = new MyConstructor()
  ```

- Without `new`: The constructor function is called as a regular function, and `this` inside the function points to the global object (or `undefined` in strict mode). The return value of the function is returned directly.

  In other words, `MyConstructor(...)` does something like:

  ```js
  function MyConstructor() {
    this.value = 42

    // return (implicitly)
  }
  const obj2 = MyConstructor() // obj2 === undefined
  ```

We can use `new.target` to determine whether a function is called with `new` or not, so that we can limit the usage of a our constructor functions:

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

> [!Note]
>
> There is a special case called ["derived constructor"](#derived-constructor), which will not create a new object itself, but the "parent constructor".

#### `this`

`this` is a special variable that refers to the context of the function call, there is a summary of the behavior of `this` in different contexts we seen before:

- For a regular function, `this` refers to the global object (or `undefined` in strict mode).
- For a constructor function, `this` refers to the newly created object.
- For a method, `this` refers to the object that the method is called on.
- For an arrow function, `this` refers to the `this` of the outer lexical environment.

#### Change `this`

We can use `func.call()`, `func.apply()`, and `func.bind()` to change the `this` value of a function call.

The only difference between `func.call` and `func.apply` is how to pass arguments to the function. `func.call` accepts arguments **as rest parameters**, while `func.apply` accepts arguments **as an array**.

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

If you want to create a function that is bound to a specific argument and left
`this` unchanged, you can use this simple workaround:

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

#### Function Overloading

JavaScript does not support function overloading. The workaround is to create a general one that can handle all types of arguments, and then check the types of arguments inside the function body:

```js
function contact(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return `${a}${b}`
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a + b
  }
  throw new Error('Invalid arguments')
}
```

### Type Conversion

#### Explicitly Converting to Number

In JavaScript, we have three ways to convert a value to a number explicitly:

- `Number.parseInt()`

  `Number.parseInt()` will convert a value to a string first, then parse it to an integer number. It will ignore any trailing non-numeric characters:

  ```js
  console.log(Number.parseInt('42')) // -> 42
  console.log(Number.parseInt('42px')) // -> 42
  ```

- `Number()`

  `Number()` will convert a value to a number directly. It will return `NaN` if the value can not be converted to a number:

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

The only case you need to ignore trailing non-numeric characters is when you should use `Number.parseInt()`, otherwise, use `Number()` or unary `+` operator instead.

For `Number()` or unary `+` operator, just follow your preference or your team's coding style. `Number()` is more explicit and human-readable, while unary `+` is more concise and maybe a bit faster.

#### Implicit Type Conversion for Binary `+` Operator

In JavaScript world, there are a bunch of implicit type conversions happening behind the scenes, that's the cost of its weakly typed nature.

Binary `+` operator is one of the arithmetic operators in JavaScript.

For different types of operands, the binary `+` operator will do implicit type conversion with the following rules:

- If either operand is `string`, both operands will be converted to `string`, and then concatenated.
- Otherwise, both operands will be converted to `number`, and then added.

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
> The binary `+` operator is the only operator that does implicit type conversion to `string`.
>
> All other arithmetic operators (`-`, `*`, `/`, `%`, `**`) and unsafe comparison operators (`>`, `<`, `>=`, `<=`, `==`, `!=`) will always do implicit type conversion to `number`.
>
> That's why we can join strings with `+` operator!

#### Implicit Type Conversion for Comparison Operators

If you read through the note above, you must really know what will happen when you use unsafe comparison operators with different types of operands: They will be converted to `number` first, then compared.

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

#### Comparing with `null` and `undefined`

`null` and `undefined` are still as it is in **unsafe equality comparisons** (`==`, `!=`) without any type conversion, and they are only equal to themselves and each other (`null == undefined` is `true`).

But things are quite different in **relational comparisons** (`>`, `<`, `>=`, `<=`): `null` will be converted to `0`, while `undefined` will be converted to `NaN`.

Because this, there is a strange result when comparing `null` and `undefined` with `0`:

- `null` vs `0`:
  - `null >= 0` is `true`, because `null` is converted to `0`.
  - `null > 0` is `false`, because `null` is converted to `0`.
  - `null == 0` is `false`, because `null` is left as it is, and it is really not equal to `0`. 😄
- `undefined` vs `0`:
  - `undefined > 0` is `false`, because `undefined` is converted to `NaN`.
  - `undefined < 0` is `false`, because `undefined` is converted to `NaN`.
  - `undefined == 0` is `false`, because `undefined` is left as it is, and it is really not equal to `0`. 😄

The best practice is **NEVER to use relational comparisons with `null` or `undefined`**, but using unsafe equality comparisons with them is safe:

I prefer to use `if (value == null)` instead of `if (value === null || value === undefined)`, because it's more concise and clear.

I prefer to use `if (value == null)` instead of `if (value)`, because it's more secure.

### Advanced Working with String

#### Accessing Character

You can access characters in a string by index, just like accessing elements in an array in other languages:

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

#### Tagged Template Literal

JavaScript supports
[tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates),
which allows you to create custom string processing functions:

```js
function tag(strings, ...exprs) {
  // Array of string literals
  console.log(strings) // -> [ 'Hello, ', ' in ', '!' ]
  // Array of interpolated values
  console.log(exprs) // -> [ 'Alice', 'Wonderland' ]
  // Return the processed string
  return strings.reduce((acc, str, i) => acc + str + (exprs[i] ?? ''), '')
}

const name = 'Alice'
const location = 'Wonderland'

console.log(tag`Hello, ${name} in ${location}!`) // -> 'Hello, Alice in Wonderland!'
```

Based on this, `@antfu/utils` provides a useful function called `unindent`, which can help us clear indent while we writing multiple-line string templates:

```js
import { unindent } from '@antfu/utils'

const general = `
  function test(x) {
    return x * x
  }
`
console.log(general)
/**
 * ->
 * ->   function test(x) {
 * ->     return x * x
 * ->   }
 * ->
 */

const unindented = unindent`
  function test(x) {
    return x * x
  }
`
console.log(unindented)
/**
 * -> function test(x) {
 * ->   return x * x
 * -> }
 */
```

#### Local Compare

`str.localeCompare(otherString[, locales[, options]])` method can be used to compare two strings in a locale-aware manner instead of unicode order:

```js
const str1 = 'ä'
const str2 = 'z'
console.log(str1 > str2 ? 1 : -1) // -> 1 (in Unicode, 'ä' comes after 'z')
console.log(str1.localeCompare(str2)) // -> -1 (in German, 'ä' comes before 'z')
```

This is helpful when you want to sort strings in a specific language.

### Advanced Working with Array

#### Accessing Element

The same as [`string`](#accessing-character).

#### Array Length Property

Contrary to your intuition, `length` property of an array is writable. If you increase it manually, nothing interesting will happen. But if you decrease it manually, the array will be truncated. **The process is irreversible**:

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.length) // -> 5

arr.length = 3
console.log(arr) // -> [1, 2, 3]
```

So, the most simple and safe way to clear an array is to set its `length` property to `0`. 😏

#### In-place Array Methods vs. Non-mutating Array Methods

Arrays have two kinds of methods: in-place methods and non-mutating methods. In-place methods modify the original array, while non-mutating methods return a new array without modifying the original one.

In-place methods include:

| Method          | Description                                    |
| --------------- | ---------------------------------------------- |
| `arr.push()`    | Add elements to the end                        |
| `arr.pop()`     | Remove the element from the end                |
| `arr.unshift()` | Add elements to the beginning                  |
| `arr.shift()`   | Remove the element from the beginning          |
| `arr.splice()`  | [Add, remove or replace elements](#arr-splice) |
| `arr.sort()`    | Sort the array                                 |
| `arr.reverse()` | Reverse the array                              |
| ...             | ...                                            |

Non-mutating methods include:

| Method             | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `arr.toSpliced()`  | No-mutating version of `arr.splice()`                                                        |
| `arr.toSorted()`   | No-mutating version of `arr.sort()`                                                          |
| `arr.toReversed()` | No-mutating version of `arr.reverse()`                                                       |
| `arr.filter()`     | Create a new array with all elements that pass the test implemented by the provided function |
| `arr.map()`        | Create a new array with the results of calling a function on                                 |
| `arr.reduce()`     | Apply a function against an accumulator and each element to reduce it to a single value      |
| `arr.flat()`       | Flatten nested arrays                                                                        |
| `arr.flatMap()`    | Map each element and flatten the result                                                      |
| `arr.concat()`     | Merge arrays                                                                                 |
| `arr.slice()`      | Extract a section of an array and return a new array                                         |
| ...                | ...                                                                                          |

#### `arr.splice()`

`arr.splice(start[, deleteCount, item1, ..., itemN])` method can be used to add, remove or replace elements in an array just in place.

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

#### Array-like Object vs. Iterable Object

An array-like `object` is an object that has:

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

An iterable `object` is an object that implements the iterable protocol, which means it has a `Symbol.iterator` method that returns an iterator (an object with a `next()` method):

```js
const iterable = {
  items: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        if (index < this.items.length)
          return { value: this.items[index++], done: false }
        else
          return { value: undefined, done: true }
      },
    }
  },
}
```

So an array-like object is not necessarily iterable, and an iterable object is not necessarily array-like too.

### Advanced Working with Map and Set

#### `WeakMap` and `WeakSet`

`WeakMap` and `WeakSet` are similar to `Map` and `Set`, but they only accept **objects** or **non-registered symbols** as keys (for `WeakMap`) or values (for `WeakSet`), and they does not create strong references to their keys (for `WeakMap`) or values (for `WeakSet`).

That is, an object's presence as a key in a `WeakMap` or as a value in a `WeakSet` will not prevent that object from being garbage collected. Once that object is garbage collected, its entry in the `WeakMap` or `WeakSet` will become candidates for garbage collection as well (if they aren't strongly referred to elsewhere).

However, they does not allow observing the liveness of their keys (for `WeakMap`) or values (for `WeakSet`), because of this, they do not have methods to get their size, such as `size` property; Also the methods to iterate over their elements, such as `keys()`, `values()`, `entries()`, or `forEach()`.

They are designed to be used in scenarios where you want to **associate data with an object/store an object** without preventing that object from being garbage collected. Use `WeakMap` as an example:

```js
const loggedInUsers = [
  { name: 'Alice' },
  { name: 'Bob' },
]
const userViewsMap = new WeakMap()

/**
 * When the user views a page, we can record the number of views in the
 * `WeakMap`.
 *
 * @param {object} user - The user object in the loggedInUsers array
 * @returns {void}
 */
function viewPage(user) {
  const views = userViewsMap.get(user) ?? 0
  userViewsMap.set(user, views + 1)
  console.log(`${user.name} has viewed this page ${views + 1} times`)
}

/**
 * When the user logs out, we can remove the user object from the
 * `loggedInUsers` array, and if there are no other references to the user
 * object, it will be garbage collected, along with its entry in the `WeakMap`.
 *
 * @param {object} user - The user object in the loggedInUsers array
 * @returns {void}
 */
function userLogout(user) {
  const index = loggedInUsers.indexOf(user)
  if (index !== -1) {
    loggedInUsers.splice(index, 1)
  }
}
```

### Advanced Working with Object

#### Property Flag (So-called Property Descriptor)

For [data properties](#accessor-property), besides a value, have three special attributes (so-called "flags"):

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
  `enumerable` – if `true`, the property shows up during enumeration of the properties of the object, otherwise it’s hidden.
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
  > We can change `writable: true` to `false` for a non-configurable property, thus preventing its value modification (to add another layer of protection). Not the other way around though.

  </details>

For [accessor properties](#accessor-property), they don't have `writable` flag, but instead have `get` and `set` functions:

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
> The best practice to define a read-only property in object literal is to use `getters` without `setters` instead of `writable: false`, because it's more convenient:
>
> ```js
> const obj = {
>   /**
>    * This is still accessible, it's prefix `_` is just a appointment to
>    * developers that this property should not be accessed directly.
>    *
>    * The best way to define a read-only property is to use private class
>    * field.
>    */
>   _name: 'John',
>   get name() {
>     return this._name
>   }
> }
> ```

#### Shallow Clone Property with Descriptor

When we shallow clone an object with `Object.assign` or spread syntax `{ ...obj}`, only enumerable properties are copied, and the property descriptors are not preserved (all property descriptors will be `true` in the new object).

We can use `Object.getOwnPropertyDescriptors` to get all properties with their descriptors, and then use `Object.defineProperties` to clone them to a new object:

```js
const user = {}
Object.defineProperty(user, 'name', {
  value: 'John',
  writable: false,
  enumerable: false,
  configurable: false,
})

const clonedUser = Object.defineProperties(
  {},
  Object.getOwnPropertyDescriptors(user)
)

const descriptor = Object.getOwnPropertyDescriptor(clonedUser, 'name')
console.log(JSON.stringify(descriptor, null, 2))
/* -> {
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
} */
```

#### Limiting Access to Object

Property descriptors work at the level of individual properties.

There are also methods that limit access to the whole object:

- `Object.preventExtensions(obj)` – prevents adding new properties to the object.
- `Object.seal(obj)` – prevents adding/removing properties. Sets `configurable: false` for all existing properties.
- `Object.freeze(obj)` – prevents adding/removing/changing properties. Sets `configurable: false` and `writable: false` for all existing properties.

And also there are tests for them:

- `Object.isExtensible(obj)` – returns `false` if adding new properties is prevented.
- `Object.isSealed(obj)` – returns `true` if adding/removing properties is prevented.
- `Object.isFrozen(obj)` – returns `true` if adding/removing/changing properties is prevented.

These methods are rarely used in practice, but good to know.

#### Prototype, Inheritance

Like other OOP languages, there also the concept of inheritance in JavaScript.

The difference is JavaScript uses **prototype** to express inheritance.

Every object has a hidden property `[[prototype]]` (which can be accessed by `__proto__` accessor property, or `Object.getPrototypeOf` & `Object.setPrototypeOf` method) finally referencing to `Object.prototype` (the top-level prototype for every object).

> [!Note]
>
> `[[prototype]]` is internal and hidden property targetting to the prototype of an object; `__proto__` is an accessor property (with getter/setter) that exposes `[[prototype]]` to the user.
>
> They have the same result, but they are quite different things.
>
> For modern JavaScript development, we shouldn't use `__proto__` to get or set the prototype of an object, they are in the Annex B of the ECMAScript specification, which means they are only for web browser compatibility.
>
> We can use the following standard methods to work with prototypes:
>
> - `Object.getPrototypeOf(obj)`: Get the prototype of `obj`.
> - `Object.setPrototypeOf(obj, proto)`: Set the prototype of `obj` to `proto`.
> - `Object.create(proto, [descriptors])`: Create a new object with the specified prototype (and property descriptors).
>
> Specially, for objects created by constructor functions, there is a convenient way to set their prototype, which will be covered in the [`prototype` property of a constructor function](#prototype-property-of-a-constructor-function) section.

When we try to **get (only get)** a property of an object, the JavaScript engine will:

1. Look for the property in the object itself.
2. If not found, look for the property in the `[[prototype]]` of the object.
3. If not found, look for the property in the `[[prototype]]` of the `[[prototype]]`, and so on until the final `[[prototype]]` reaches `null`.
4. If still not found, return `undefined`.

Through this way, an object can "inherit" properties from its prototype, and the prototype can also inherit properties from its prototype, and so on.

> [!Note]
>
> Prototype can be only an object or `null`, set it to other types are not allowed and will be ignored.

### Advanced Working with Function

#### `prototype` Property of a Constructor Function

We know that constructor functions can be used to create objects:

```js
function User(name) {
  this.name = name
}
const user = new User('John')
console.log(user.name) // -> 'John'
```

So is there any convenient way to set the prototype of the objects created by a constructor function? Yes!

JavaScript uses **a regular property named `prototype`** of a constructor function to determine the prototype of the objects created by it:

```js
function User(name) {
  this.name = name
}
User.prototype.sayHi = function () {
  console.log(`Hi, I'm ${this.name}`)
}

const user = new User('John')
user.sayHi() // -> Hi, I'm John
```

Actually, all functions (not only constructor functions, but also any function declaration, function expression, except arrow function) have the default `prototype` property even if we don't supply it.

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
> If we manually replace `Func.prototype` to another object, the `constructor` property may be lost, so we shouldn't rely on it:
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

#### Create Inheritance Chain with Constructor Functions

Based on the `prototype` property of a constructor function, now we can create an inheritance chain **on instances** with constructor functions:

```js
function User(name) {
  this.name = name
}
User.prototype.sayHi = function () {
  console.log(`Hi, I'm ${this.name}`)
}

function Admin(name) {
  // Call the parent constructor to initialize the properties
  User.call(this, name)
}
// Set the prototype of Admin.prototype to User.prototype
Object.setPrototypeOf(Admin.prototype, User.prototype)
Admin.prototype.runAdminTask = function () {
  console.log(`Admin ${this.name} is running admin task`)
}

const admin = new Admin('Alice')
admin.sayHi() // -> Hi, I'm Alice
admin.runAdminTask() // -> Admin Alice is running admin task
```

If you want to create an inheritance chain on the constructor functions too, you can set the prototype of the child constructor function to the parent constructor function:

```js
function User(name) {
  this.name = name
}
User.logType = function () {
  console.log('I am a user constructor')
}
User.prototype.sayHi = function () {
  console.log(`Hi, I'm ${this.name}`)
}

function Admin(name) {
  User.call(this, name)
}
Object.setPrototypeOf(Admin.prototype, User.prototype)
Object.setPrototypeOf(Admin, User) // Set the prototype of Admin to User

User.logType() // -> I am a user constructor
Admin.logType() // -> I am a user constructor (inherited from User)
```

This works like [static member inheritance in class](#static-member).

As you can see, these are a bit cumbersome, and that's why we have [`class`](#class) syntax in JavaScript.

#### `prototype` Property for Built-in Constructor Function

The `prototype` property is widely used by the core of JavaScript itself. All built-in constructor functions use it.

For built-in constructor function `Object()`, there is `Object.prototype` which is the prototype of all objects (Unless you manually change their prototype). That’s why we say that "everything inherits from objects" in JavaScript.

Other built-in constructor functions such as `Array`, `Date`, `Function` and others also keep methods in prototypes, we can access them through `Array.prototype`, `Date.prototype`, `Function.prototype` and so on.

> [!Caution]
>
> These built-in prototypes can be modified, but change anything of them is a bad idea, may break the built-in behaviors, and lead to hard-to-debug errors.

#### Closure

Closure is a function that remembers its outer variables (called **outer lexical environment**) and can access them even after the outer function has finished executing.

In JavaScript, every function has a hidden property `[[Environment]]`, which is a reference to the lexical environment where the function was created (there is only one exception, it uses global lexical environment which is to be covered in [outer lexical environment of `new Function` syntax](#outer-lexical-environment-of-new-function-syntax)), so we can say that all functions are closures in JavaScript.

See https://javascript.info/closure for the theory and implementation details of closure in JavaScript.

#### Garbage Collection with Closure

Usually, a lexical environment is removed from memory with all the variables after the function call finishes. That’s because there are no references to it. As any JavaScript object, it’s only kept in memory while it’s reachable.

However, if there’s a nested function that is still reachable after the end of a function, then it has `[[Environment]]` property that references the lexical environment, so the lexical environment is still reachable even after the function call finishes.

This is the mainly usecase of closure: **To keep the outer variables alive after the function call finishes, and avoid any outer access to them.**

> [!Note]
>
> An important side effect in V8 engine (Chrome, Edge, Opera...) is that such variable will be optimized while debugging:
>
> <!-- eslint-disable no-debugger -->
>
> ```js
> function f() {
>   const value = Math.random()
>
>   function g() {
>     // In console, after you typing `console.log(value)`,
>     // you will get `No such variable`!
>     debugger
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

#### `new Function` Syntax

There’s one more way to create a function. It’s rarely used, and not recommended (because it use `eval` under the hood), but it's still good to know.

<!-- eslint-disable no-new-func -->

```js
// new Function ([arg1, arg2, ...argN], functionBody)
const sum = new Function('a', 'b', 'return a + b')
console.log(sum(1, 2)) // -> 3
```

The last argument of `new Function` is the function body, and the previous arguments are the names for the function parameters.

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
> But it's **really really really dangerous**, because the function body may contain malicious code, and it will be executed directly. So, never do this unless you really know what you are doing and you can trust the source of the function body.

#### Outer Lexical Environment of `new Function` Syntax

Usually, a function remembers the lexical environment where it was created. But when a function is created with `new Function`, it always uses the global lexical environment as `[[Environment]]`. So it can’t access outer variables, only global ones.

What if it could access outer variables?

The problem is that before JavaScript is published to production, we may compressed the source code using a minifier, a special program that shrinks code by removing extra comments, spaces and what’s important: renames local variables into shorter ones. So if `new Function` had access to outer variables, it would be unable to find them after minification:

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

## Class

Actually, `class` in JavaScript is just a kind of constructor function with better syntax and convenient features.

With `class`, you can define the structure of creating objects more like object literal syntax, for instance:

```js
// Constructor function
// Use `this` to assign properties
function User1(name) {
  this.name = name
}
// It's too cumbersome to add methods to the prototype of
// a constructor function
User1.prototype.sayHi = function () {
  console.log(`Hello, ${this.name}!`)
}
console.log(typeof User1) // -> 'function'

// Class
class User2 {
  // More like the object literal syntax, without `,` as property separator
  name = 'John'
  sayHi() {
    console.log(`Hello, ${this.name}!`)
  }
}
console.log(typeof User2) // -> 'function', too
```

What `class User { ... }` does is:

1. Create a function named `User`, that becomes the result of the class declaration. The function code is taken from the `constructor` method (assumed empty if we don’t write such method).
2. Store class methods, such as `sayHi`, in `User.prototype`.
3. ...Something extra.

So class `User2` defined in the example above is functionality equivalent to constructor function `User1` (Not totally equivalent).

> [!Note]
>
> What extra things does `class` do are:
>
> 1. A function created by `class` will be labelled by a special internal property `[[IsClassConstructor]]: true`, JavaScript checks for this property in a variety of places:
>
>    ```js
>    class User {}
>
>    User() // Error: Class constructor User cannot be invoked without 'new'
>    ```
>
>    Also, a string representation of a class constructor in most JavaScript engines will start with the "class...":
>
>    ```js
>    class User {}
>
>    console.log(User.toString()) // -> class User { ... }
>    ```
>
> 2. Instance methods are non-enumerable by default, a class definition will set enumerable flag to `false` for all methods in the `prototype` property.
> 3. `class` always use strict mode, all code inside the class is in strict mode. (Yeah, we said this before 👍)

### Class Expression

Just like `function`, `class` also has expressions, and they can be passed around, returned, assigned, etc.

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

Similar to [named function expression](#named-function-expression), class expressions may have a name, and it's visible inside the class only.

### Getter/Setter and Dynamic Property Name

With the similar syntax to literal objects, `class` also has [getters/setters](#accessor-property) and [dynamic property name](#dynamic-computed-property-name).

Example for getter/setter:

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

Example for dynamic property name:

```js
const methodPrefix = 'say'
class User {
  [`${methodPrefix}Hi`]() {
    console.log('Hello')
  }
}

new User().sayHi() // -> Hello
```

### Class Field

Class fields is a new feature added in ECMAScript 2022, which is a syntax that allows us to add properties to instance more like object literal syntax.

Previously, our classes only had methods, and properties were usually added in the constructor, like how we do in constructor function:

```js
class User {
  constructor() {
    // [!code highlight:1]
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
  // [!code highlight:1]
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
  // [!code highlight:1]
  name = prompt('Name, please?', 'John')
}

const user = new User()
console.log(user.name) // -> John
```

> [!Note]
>
> If you want to create a property that is read-only in `class`, you can use a [private class](#private-and-protected-member) field with a getter without a setter:
>
> ```js
> class User {
>   #name = 'John' // Private class field
>   get name() {
>     return this.#name
>   }
> }
> ```
>
> If you want to create a property that is not enumerable or configurable in `class`, you still need to use `Object.defineProperty` in the constructor:
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
>
> Of course, for some properties should get values from constructor parameters, they still need to be assigned in the constructor:
>
> ```js
> class User {
>   constructor(name) {
>     this.name = name
>   }
> }
> ```

### Class Inheritance

Class inheritance also builds on top of prototypal inheritance, the principle is the same as [how we create inheritance chain with constructor functions](#create-inheritance-chain-with-constructor-functions), but with better syntax and convenient features.

Class inheritance uses `extends` keyword to do that:

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

We can see that `extends` keyword is equivalent to `Object.setPrototypeOf(Dog.prototype, Animal.prototype)`.

So that's how class inheritance works in JavaScript (static inheritance will be explained [later](#static-members)).

For the example above, if we want to access `dog.move()`, JavaScript engine will:

1. Look for `move` in `dog` itself (not founded).
2. Look for `move` in `dog.[[prototype]]`, which is `Dog.prototype` (not founded).
3. Look for `move` in `Dog.prototype.[[prototype]]`, which is `Animal.prototype` (founded).

> [!Note]
>
> Because the theory of `extends`, `class` allows to extend not just a class, but any expression evaluated to an object.
>
> For instance, a function call that generates a class expression (a kind of constructor function, also object) can be used as the right-hand side of `extends`:
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
> That may be useful for advanced programming patterns when we use functions to generate classes depending on many conditions and can inherit from them.

### Overriding Class Field

For overriding class field, we can simply declare a field with the same name in the child class:

```js
class Animal {
  name = 'animal'
}

class Rabbit extends Animal {
  name = 'rabbit'
}
```

But there’s a tricky behavior when we access an overridden field in parent constructor, quite different from most other programming languages.

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

What’s interesting is that in both cases: `new Animal()` and `new Rabbit()`, log `animal`.

**In other words, the parent constructor always uses its own field value, not the overridden one.**

The reason is the field initialization order. The class field is initialized:

- For the base class, before constructor call.
- For the derived class, immediately after `super()` call in constructor, but before the rest of the constructor code.

In our case, calling `new Rabbit()` will call the `Animal` constructor first, and at that moment, the name field is initialized with the value of `animal`, and the overridden in `Rabbit` is not yet applied.

Luckily, this behavior only reveals itself if an overridden field is used in the parent constructor.

The best practice is to avoid to override the class field, if you want to change the value of a field inside the parent, you may pass it as a parameter to the parent constructor, and assign it in the parent constructor:

<!-- eslint-disable no-useless-constructor -->

```js
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Rabbit extends Animal {
  constructor(name) {
    super(name) // Pass the name to the parent constructor
  }
}
```

### Overriding Method

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

This behaves the same as overriding a method with constructor function inheritance (Of course, we have not talked about this before).

> [!Note]
>
> The `override` keyword is a TypeScript feature, it's not a JavaScript feature.

If we want to call the parent method from the child method, classes provide "super" keyword for that, this is one **quite different feature** from constructor function inheritance:

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

> [!Note]
>
> For constructor function inheritance, we have to call the parent constructor with `ParentConstructor.call(this, ...)`, and parent function methods with `ParentConstructor.prototype.method.call(this, ...)`, which is quite cumbersome:
>
> ```js
> function Animal(name) {
>   this.name = name
> }
> Animal.prototype.move = function () {
>   console.log(`${this.name} moves.`)
> }
>
> function Dog(name) {
>   // Call the parent constructor to initialize the properties
>   Animal.call(this, name)
> }
> Object.setPrototypeOf(Dog.prototype, Animal.prototype)
> Dog.prototype.move = function () {
>   // Call the parent method `move`
>   Animal.prototype.move.call(this)
>   console.log(`${this.name} runs.`) // Override
> }
>
> const dog = new Dog('Rex')
> dog.move()
> /**
>  * -> Rex moves.
>  * -> Rex runs.
>  */
> ```

### Derived Constructor

According to the [specification](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation), if a class extends another class and has no constructor, then the following "empty" **derived constructor** is generated:

<!-- eslint-disable no-useless-constructor -->

```js
class Rabbit extends Animal {
  // [!code highlight:3]
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

Whoops! We’ve got an error, the runtime complains the missing of new object. We just missed to call `super(...)` in the child constructor. But why?

In JavaScript, there’s a distinction between a constructor function of an inheriting class (so-called "derived constructor") and other functions. A derived constructor has a special internal property `[[ConstructorKind]]:"derived"`. That’s a special internal label.

That label affects its behavior with `new`.

- When a regular constructor function is executed with `new`, it creates an empty object and assigns it to this.
- But when a derived constructor runs, it doesn’t do this. It expects the parent constructor to do this job.

So a **derived constructor must call super** in order to execute its parent (base) constructor to create the new object which is referenced by `this`.

### Super: Internals, `[[HomeObject]]`

It’s about the internal mechanisms behind inheritance and `super`.

First to say, from all that we’ve learned till now, it’s impossible for super to work at all!

Yeah, indeed, let’s ask ourselves, how it should technically work? When an object method runs, it gets that object as `this`. If we call `super.method()` then, the engine needs to get the `method()` from the prototype of `this`, and **binding it with that `this`**.

The task may seem simple, but it isn’t. Get the `method()` from `this` is easy, we can use `Object.getPrototypeOf(this).method`, but the problem is happens because `this` in the whole call chain is always that object, when we have a long inheritance chain, it will cause an infinite loop.

Let’s demonstrate the problem. Without classes, using plain objects for the sake of simplicity.

In the example below, we only have a short inheritance chain, and everything works well:

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

At the line `(*)`, `this` is `rabbit`, and we take `eat` from the prototype (`animal`) and call it in the context of `rabbit`.

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

1. Inside `longEar.eat()`, `this` is `longEar`, the line `(**)` calls `rabbit.eat()` with the context of `longEar`.
2. Then in the line `(*)` of `rabbit.eat`, `this` is still `longEar`, because this method is called with the context of `longEar`, so `Object.getPrototypeOf(this).eat` is still `rabbit.eat`!
3. ...So `rabbit.eat` calls itself in the endless loop, because it can’t ascend any further.

To solve the problem, we need another property on each instance method to track which object it belongs to, that is the internal property `[[HomeObject]]`, it always references the object where the method is defined. Then `super` uses it to resolve the parent prototype and its methods.

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
    // For this method, [[HomeObject]] === animal (implicitly)
    console.log(`${this.name} eats.`)
  }
}

const rabbit = {
  __proto__: animal,
  name: 'Rabbit',
  eat() {
    // For this method, [[HomeObject]] === rabbit (implicitly)
    super.eat() // Just like: `Object.getPrototypeOf([[HomeObject]]).eat.call(this)`
  }
}

const longEar = {
  __proto__: rabbit,
  name: 'Long Ear',
  eat() {
    // For this method, [[HomeObject]] === longEar (implicitly)
    super.eat() // Just like: `Object.getPrototypeOf([[HomeObject]]).eat.call(this)`
  }
}

// Works correctly again!
longEar.eat() // -> Long Ear eats.
```

> [!Caution]
>
> As we’ve known before, generally functions are "free", not bound to objects in JavaScript. So they can be copied between objects and called with another `this`:
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
> The very existence of `[[HomeObject]]` violates that principle, because methods remember their `objects.[[HomeObject]]` can’t be changed, so this bond is forever.
>
> The only place in the language where `[[HomeObject]]` is used is `super`. So, if a method does not use `super`, then we can still consider it "free" and copy between objects. But with `super` things may go wrong.
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
>     // Totally equivalent to
>     // `Object.getPrototypeOf(animal).sayHi.call(this)`
>     super.sayHi()
>   }
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
>   /**
>    * Totally equivalent to:
>    * sayHi() {
>    *   rabbit.__proto__.sayHi.call(this)
>    * }
>    */
>   sayHi: rabbit.sayHi
> }
>
> tree.sayHi() // -> I'm an animal (?!)
> ```

### Static Member

Static methods are belong to class, not objects:

```js
class Article {
  static publisher = 'Ilya Kantor'

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
console.log(article.date) // -> current date

console.log(article.publisher) // -> undefined
article.createTodays() // Error: `article.createTodays` is not a function
```

Because static members are just **like properties of the constructor function** under the hood, it's more like:

```js
function Article(title, date) {
  this.title = title
  this.date = date
}
Article.publisher = 'Ilya Kantor'
Article.createTodays = function () {
  // Remember, this = Article
  return new this('Today\'s digest', new Date())
}
```

`publisher` and `createTodays` does not exist in `Article.prototype`, so objects created by `new Article` can’t access it.

And static members are also inherited **by default**.

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

You can see that, `extends` not only does `Object.setPrototypeOf(Dog.prototype, Animal.prototype)`, but also `Object.setPrototypeOf(Dog, Animal)`, so that static members of `Animal` are inherited by `Dog`.

Some times we don't want properties of a class constructor to be inherited by another class constructor. For example, many JavaScript built-ins are only inherit non-static members from each other.

- Both `Array.prototype` and `Date.prototype` inherit from `Object.prototype`
- But `Array` and `Date` do not inherit from `Object` directly

In this case, we may fallback to use constructor function inheritance to avoid this default behavior, or just manually set the prototype of the child constructor function to `null`:

```js
// Using constructor function inheritance
function User(name) {
  this.name = name
}
User.staticMethod = function () {
  console.log('I am a static method')
}

function Admin(name) {
  User.call(this, name)
}
Object.setPrototypeOf(Admin.prototype, User.prototype)

// Manually set the prototype of Admin to `null`
class UserToo {
  constructor(name) {
    this.name = name
  }

  static staticMethod() {
    console.log('I am a static method')
  }
}

class AdminToo extends UserToo {
  static staticMethod() {
    console.log('I am a static method')
  }
}
Object.setPrototypeOf(AdminToo, null)
```

### Private and Protected Member

In JavaScript, there is also the concept of property visibility.

We can use naming conventions (prefixing with an underscore "\_") to define **protected members**.

```js
class CoffeeMachine {
  _waterAmount = 0 // Protected field

  constructor(power) {
    this._power = power
  }

  set waterAmount(value) {
    this._waterAmount = value
  }

  get waterAmount() {
    return this._waterAmount
  }

  _getPower() { // Protected method
    return this._power
  }
}

// create the coffee machine
const coffeeMachine = new CoffeeMachine(100)
// add water
coffeeMachine.waterAmount = 10
```

The same as protected methods and properties, **private methods** and properties are using naming conventions (prefixing with a hash "#"), which is included in ECMAScript 2022.

The same as other OOP languages, protected members can be inherited, but private ones cannot.

The only special thing is that private ones can not be accessed from `this[variable]`, for security reason:

```js
class User {
  #name = 'John'

  sayHi() {
    const fieldName = '#name'
    console.log(`Hello, ${this[fieldName]}`) // This is not allowed
  }
}
```

### Check Class of Instance

As we all know, we can use `typeof` operator to check the type of a variable (Alright, we have not mentioned this before, but now you know, right? 🥰):

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

## Error Handling

### `try...catch...finally`

Like other languages, JavaScript uses `try...catch...finally` statement to handle runtime errors.

`try` statement contains code that may throw an error, `catch` statement contains code to handle the error, and `finally` statement is optional, and always executed after `try` and `catch`, regardless of the outcome.

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

2. If you don't want to handle the error, but want to be sure that processes that we started are finalized, you can omit the `catch` block:

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

### Custom Error

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

1. We should call `super(message)` in the constructor to pass the error message to the parent `Error` class.
2. We use `this.constructor.name` to set the `name` property of the error, so that it reflects the actual class name. (Of course, you should not to replace the default `prototype` property of the class, we mentioned this [before](#prototype-property-of-a-constructor-function)).
3. We can change the constructor to accept any parameters we need and generate the message inside.

## Promises, Async/Await

### Callbacks vs. Promises

In the past, JavaScript used callbacks to implement asynchronous programming, but it leads to "callback hell" and makes code hard to read.

```js
function loadScript(src, onfulfilled, onrejected) {
  const script = document.createElement('script')
  script.src = src
  script.onload = () => onfulfilled(script)
  script.onerror = () => onrejected(new Error(`Failed to load script: ${src}`))
  document.head.append(script)
}

// [!code highlight:25]
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

By using `Promise`, we can flatten the nested callbacks structure we had before to chain the promises, making code more readable:

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

// [!code highlight:25]
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

### What is Promise?

A promise has a constructor that takes a function called "executor", with two parameter functions: `resolve` and `reject`.

When we call `resolve` or `reject`, the state of the promise changes:

- `pending`: initial state, meaning that the operation is still ongoing.
- `fulfilled`: After we call `resolve` in the executor, promise turns to this state, meaning that the operation completed successfully.
- `rejected`: After we call `reject` or got an error in the executor, promise turns to this state, meaning that the operation failed.

> [!Note]
>
> We can say that a promise is `settled` if it is either `fulfilled` or `rejected`.

### `then`, `catch` and `finally`

Promise has two methods `then` and `catch` which can be used to spread the result to the next promise.

`then` method accepts two callback functions:

- `onfulfilled`: The function to call when the promise is `fulfilled`.
- `onrejected`: The function to call when the promise is `rejected`.

And `catch` method is a shorthand for `.then(null, onrejected)`.

Like `try...catch...finally`, `Promise` also has a `finally` method, which is called when the promise is either `fulfilled` or `rejected`. It can be called before or after `then` or `catch` methods.

```js
new Promise((resolve, reject) => {
  /* do something that takes time, and then call resolve or maybe reject */
})
  // runs when the promise is settled, doesn't matter successfully or not
  .finally(() => stopLoadingIndicator())
  // so the loading indicator is always stopped before we go on
  .then(result => showResult(result), err => showError(err))
```

> [!Note]
>
> `then`, `catch` and `finally` methods always return **a promise-like object** (an object with a `then` method) with a returned value.
>
> Promise-like object allows us to integrate custom promise-like objects with promise chains. E.g. [@antfu/eslint-flat-config-utils](https://github.com/antfu/eslint-flat-config-utils/blob/main/src/composer.ts#L87).
>
> The returned value is determined by the state of the previous promise:
>
> - For `then`:
>   - If the previous promise is `fulfilled`, the returned value is the result of the `onfulfilled` function.
>   - If the previous promise is `rejected`, the returned value is the result of the `onrejected` function.
> - For `catch`:
>   - If the previous promise is `rejected`, the returned value is the result of the `onrejected` function.
>   - If the previous promise is `fulfilled`, the returned value is the same as the return of previous promise.
> - For `finally`:
>   - The returned value is the same as the return of previous promise.
>
> If the returned value isn't a promise-like object, it will be wrapped in a promise resolved with that value:
>
> `return 1` -> `Promise.resolve(1)`

### Promises Chaining

We can call `then` method both **standalone** or **chained**, they are quite different.

```js
// This call three times on the same promise
const standalone = new Promise((resolve, reject) => { // sp0
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
const chained = new Promise((resolve, reject) => { // cp0
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

For standalone promises, each `then` is independent, they all get the same result of the original promise `sp0`.

```txt
new Promise => 1 (sp0)
    |
    +-------------------+-------------------+
    |                   |                   |
    then => 2 (sp1)     then => 2 (sp2)     then => 2 (sp3)
```

For chained promises, each `then` is dependent on the previous one, they all get the result of their previous promise.

```txt
new Promise => 1 (cp0)
    |
    +- then => new Promise => 1 2 (cp1)
                   |
                   +- then => new Promise => 2 4 (cp2)
                                  |
                                  +- then => new Promise => 4 8 (cp3)
```

In practice we rarely call `then` multiple times for one promise, but chaining is used much more often.

### Promise API

#### `Promise.all`

If we want to run multiple asynchronous operations in parallel and wait until all of them are completed, we can use `Promise.all`.

It accepts an iterable (usually an array) of promises, and returns a new promise that is fulfilled when **all** the input promises are fulfilled, or rejected when **any** of the input promises is rejected.

```js
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000)) // 3
]).then(console.log) // 1,2,3 when promises are ready: each promise contributes an array member
```

Please note that the order of the resulting array members is the same as in its source promises.

> [!Note]
>
> If one promise rejects, `Promise.all` immediately rejects, completely forgetting about the other ones in the list. Their results are ignored.
>
> If you want each promise to be executed regardless of the others, you should use `Promise.allSettled` instead.

#### `Promise.allSettled`

In ECMAScript 2020, `Promise.allSettled` was added to the language.

Differently from `Promise.all`, it waits until all input promises are settled, regardless of whether they are fulfilled or rejected. Each result will wrapped in an object with `status` and `value` or `reason` properties, depending on the outcome of the promise.

This is useful when we want to know the result of all operations, without failing fast on the first rejection.

For example, migration from `Promise.all` to `Promise.allSettled`:

```js
// Before
const [res1, res2, res3] = await Promise.all([
  fetch('/api/data1').then(res => res.json()),
  fetch('/api/data2').then(res => res.json()),
  fetch('/api/data3').then(res => res.json())
])
console.log(res1, res2, res3)

// After
const [res4, res5, res6] = await Promise.allSettled([
  fetch('/api/data1').then(res => res.json()),
  fetch('/api/data2').then(res => res.json()),
  fetch('/api/data3').then(res => res.json())
])
console.log(res4.value, res5.value, res6.value)
```

#### `Promise.race`

As it's name suggests, `Promise.race` returns a promise that **settles** as soon as one of the input promises settles, with the same value or reason.

#### `Promise.any`

As it's name suggests, `Promise.any` returns a promise that **fulfills** as soon as one of the input promises fulfills, with the value of the fulfilled promise.

If all input promises are rejected, it rejects with an `AggregateError`, a new error type that groups multiple errors together.

### Microtasks

The callbacks of promise methods `then`/`catch`/`finally` are always asynchronous.

Even when a promise is immediately resolved, the callbacks of its `then`/`catch`/`finally` methods are still executed after the synchronous code.

Here’s a demo:

```js
const promise = Promise.resolve()

promise.then(() => console.log('promise done!'))

console.log('code finished') // This console.log shows first
```

If you run it, you see code finished first, and then promise done!

Why did the `then` trigger afterwards? What’s going on?

That's because Node.js is single-threaded, it's asynchronous is powered by the **event loop**. All asynchronous tasks are put into a queue called **microtask queue**. Only when one synchronous code block is finished, the event loop checks the microtask queue for tasks to execute.

In the case above, when `promise.then` is called, we are just putting the callback into the microtask queue, they are not executed yet. After `console.log('code finished')` is executed, the synchronous code block is finished, then the event loop checks the microtask queue, and executes the callback.

#### Microtasks Queue

Let's see a more detailed explanation about that.

Asynchronous tasks need proper management. For that, the ECMA standard specifies an internal queue PromiseJobs, more often referred to as the "microtask queue" (V8 term).

As stated in the [specification](https://tc39.github.io/ecma262/#sec-jobs-and-job-queues):

- The queue is first-in-first-out: tasks enqueued first are run first.
- Execution of a task is initiated only when nothing else is running.

Or, to put it more simply, when a promise is ready, the callbacks of its `then`/`catch`/`finally` methods are put into the queue, they are not executed yet. When the JavaScript engine becomes free from the current code, it takes a task from the queue and executes it.

In the example above, "code finished" is the synchronous code block, that’s why it shows first.

**What if the order matters for us? How can we make code finished appear after promise done?**

Easy, just put the code into the queue with `then`:

```js
Promise.resolve()
  .then(() => console.log('promise done!'))
  .then(() => console.log('code finished'))
```

`then`, `catch` and `finally` methods themselves are synchronous, so they can impact the order of the callbacks entered into the microtask queue.

#### Unhandled Rejections

If you create a promise that doesn't have a callback to handle the rejection, it will cause an unhandled rejection.

For example:

<!-- eslint-disable no-new -->

```js
new Promise((resolve, reject) => {
  reject(new Error('Unhandled rejection'))
})
```

Now we can see exactly how JavaScript finds out that there was an unhandled rejection:

**An "unhandled rejection" occurs when a promise error is not handled at the end of the microtask queue.**

### Async/Await

Async function means a function that always returns a promise. Other values are wrapped in a resolved promise automatically.

```js
async function f() {
  return 1 // Same as: return Promise.resolve(1)
}
f().then(console.log) // -> 1
```

The keyword `await` is only allowed inside async functions, it further flattens the promise chain:

Before `await`:

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

// [!code highlight:25]
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

After `await`:

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

// [!code highlight:9]
try {
  await loadScript('/my/script.js')
  await loadScript('/my/script2.js')
  await loadScript('/my/script3.js')
  // ...continue after all scripts are loaded
}
catch (error) {
  console.error(error)
}
```

It's a better way to write promise-based code, making it look like synchronous.

> [!Note]
>
> Top level `await` can only be used in `ES Module`. For `CommonJS`, you need to wrap the code into an async IIFE:
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
> Like promise.then, await allows us to use promise-like objects.

## Generators, Advanced Iteration

### Generators

Regular functions return only one, single value (or nothing).

Generators can return ("yield") multiple values, one after another, on-demand. They work great with iterables, allowing to create data streams with ease.

```js
function* generateSequence() {
  yield 1
  yield 2
  return 3
}
```

Generator functions are declared with `function*` syntax.

When called, they don’t run the function body right away. Instead, they return a special object called "generator object" to manage the execution.

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

The main method of a generator is `next()`. When called, it runs the execution until the nearest `yield [value]` statement (`value` can be omitted, then it’s `undefined`). Then the function execution pauses, and the yielded value is returned to the outer code.

The result of next() is always an object with two properties:

- `value`: the yielded value
- `done`: `true` if the function has finished, `false` otherwise

As you probably already guessed looking at the next() method, generators are iterable.

We can loop over their values using for..of:

```js
function* generateSequence() {
  yield 1
  yield 2
  // [!code highlight:1]
  return 3
}

const generator = generateSequence()

// [!code highlight:3]
for (const value of generator) {
  console.log(value) // -> 1, then 2
}
```

Looks a lot nicer than calling `next().value`.

But please note: The example above shows 1, then 2, and that’s all. **It doesn’t show 3!**

It’s because `for..of` iteration ignores the last value, when `done: true`. So, if we want all results to be shown by `for..of`, we must return them with `yield` instead of `return`:

```js
function* generateSequence() {
  yield 1
  yield 2
  // [!code highlight:1]
  yield 3
}

const generator = generateSequence()

// [!code highlight:3]
for (const value of generator) {
  console.log(value) // => 1, then 2, then 3
}
```

Actually, `return` is rarely used and optional, be cause we know function without explicit `return` returns `undefined` by default.

### Generator Composition

Generator composition is a special feature of generators that allows to transparently "embed" generators in each other:

```js
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i
}

function* generatePasswordCodes() {
  // [!code highlight:3]
  // `yield*` delegates the execution to another generator.
  // 0, 1, 2, 3, ..., 9
  yield* generateSequence(48, 57)

  // A, B, C, D, ..., Z
  yield* generateSequence(65, 90)

  // a, b, c, d, ..., z
  yield* generateSequence(97, 122)
}

let str = ''

for (const code of generatePasswordCodes()) {
  str += String.fromCharCode(code)
}

console.log(str) // -> 0..9A..Za..z
```

The `yield*` directive delegates the execution to another generator. This term means that `yield* gen` iterates over the generator `gen` and transparently forwards its yields outside. As if the values were yielded by the outer generator.

### `yield` is a Two-Way Street

`yield` is a two-way street: It not only returns the result to the outside, but also can pass the value inside the generator.

The result of `yield` expression is the `value` passed to the next `next(value)` call:

```js
function* gen() {
  // [!code highlight:3]
  // The value of `yield` is the value passed to the second `next(value)` call.
  const ask1 = yield '2 + 2 = ?'
  console.log(ask1) // -> 4

  const ask2 = yield '3 * 3 = ?'
  console.log(ask2) // -> 9
}

const generator = gen()

// [!code highlight:1]
console.log(generator.next().value) // -> "2 + 2 = ?"

// [!code highlight:1]
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
    // [!code highlight:1]
    console.log('The execution does not reach here, because the exception is thrown above')
  }
  catch (e) {
    console.error(e) // shows the error
  }
}

const generator = gen()

const question = generator.next().value

// [!code highlight:1]
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
// [!code highlight:2]
g.return('foo') // { value: "foo", done: true }
g.next() // { value: undefined, done: true }
```

It's only useful when we want to stop the generator from outside, before it naturally finishes.

But it's good to know that it exists.

### Async Generators and Iteration

For most practical applications, when we’d like to make an object that asynchronously generates a sequence of values, we can use an asynchronous generator.

The syntax is simple: prepend `function*` with `async`, that makes the generator asynchronous. When using it, we need to use `for await...of` loop to iterate over its values.

```js
// [!code highlight:1]
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    // Wow, can use await!
    await new Promise(resolve => setTimeout(resolve, 1000))

    yield i
  }
}

const generator = generateSequence(1, 5)
// [!code highlight:1]
for await (const value of generator) {
  console.log(value) // 1, then 2, then 3, then 4, then 5 (with delay between)
}
```

As the generator is asynchronous, we can use `await` inside it, rely on promises, perform network requests and so on.

Asynchronous iteration allow us to iterate over data that comes asynchronously, on-demand. Like, for instance, when we download something chunk-by-chunk over a network. And asynchronous generators make it even more convenient:

```js
const range = {
  from: 1,
  to: 5,

  /**
   * Return an asyncIterator-like object:
   */
  [Symbol.asyncIterator]() {
    return {
      current: this.from,
      last: this.to,

      async next() {
        // Note: we can use "await" inside the async next:
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (this.current <= this.last)
          return { done: false, value: this.current++ }
        else
          return { done: true }
      }
    }
  }
}

for await (const value of range) {
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
