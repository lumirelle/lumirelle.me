---
title: TypeScript Advanced Grammar Manual
date: 2025-11-18T17:16+08:00
update: 2025-11-18T17:16+08:00
lang: en
duration: 0min
type: blog+note
---

[[toc]]

## Introduction

TypeScript is a superset of JavaScript that adds static typing to the language.

It's the main purpose of TypeScript, remember it and that will help you a lot.

## Types in TypeScript

### Types for JavaScript Data Types

TypeScript has the following 8 types to express corresponding JavaScript data
types:

- `string`:
  ```ts
  const str: string = 'hello'
  ```
- `number`:
  ```ts
  const num: number = 1
  ```
- `bigint` (ECMAScript 2020+):
  ```ts
  const big: bigint = 1n
  ```
- `boolean`:
  ```ts
  const bool: boolean = true
  ```
- `symbol`:
  ```ts
  const sym: symbol = Symbol('sym')
  ```
- `object`:
  ```ts
  const obj: object = {}
  ```
- `null`:
  ```ts
  const n: null = null
  ```
- `undefined`:
  ```ts
  const u: undefined = undefined
  ```

And they can be categorized as following:

| Category  | Types                                             |
| --------- | ------------------------------------------------- |
| Primitive | `string`, `number`, `bigint`, `boolean`, `symbol` |
| Object    | `object`                                          |
| Null      | `null`                                            |
| Undefined | `undefined`                                       |

### Wrapper Types for Primitives

And as we all know, in JavaScript, when you call a method on a variable which
stores a primitive value, the engine will automatically create a wrapper
object for it temporarily, so that you can call methods on it:

```ts
const str: string = 'hello'
/**
 * At that moment, `'hello'` is automatically wrapped like `new String('hello')`
 * temporarily, so that you can call methods on it.
 */
console.log(str.toUpperCase())
```

These wrappers are not meant to **be used directly**, they are object under the
hood, and are designed to be used internally by the JavaScript engine to
**provide methods on primitive values**.

And there is nothing different in TypeScript: There are some types with the
PascalCase name pattern to express the wrapper types of primitives, and they are
not meant to **be used directly too**. They are used for similar purpose:
**provide type support for methods on primitive values**.

- `String`
  <!-- eslint-disable ts/no-wrapper-object-types -->
  ```ts
  const strProto: String = String.prototype
  ```
- `Number`
  <!-- eslint-disable ts/no-wrapper-object-types -->
  ```ts
  const numProto: Number = Number.prototype
  ```
- `BigInt`:
  <!-- eslint-disable ts/no-wrapper-object-types -->
  ```ts
  const bigProto: BigInt = BigInt.prototype
  ```
- `Boolean`:
  <!-- eslint-disable ts/no-wrapper-object-types -->
  ```ts
  const boolProto: Boolean = Boolean.prototype
  ```
- `Symbol`:
  <!-- eslint-disable ts/no-wrapper-object-types -->
  ```ts
  const symProto: Symbol = Symbol.prototype
  ```
- `Object`:
  <!-- eslint-disable ts/no-wrapper-object-types -->
  ```ts
  const objProto: Object = Object.prototype
  ```

At the end, let's take a look at the type definition of `String` in TypeScript,
to learn more about the wrapper types:

<!-- eslint-disable no-var, vars-on-top -->

```ts
// @file: node_modules/typescript/lib/lib.es5.d.ts

// ...

/**
 * The type definition of `String` wrapper object
 */
interface String {
  // ... Members of `String` wrapper object

  readonly [index: number]: string
}

/**
 * The type definition of the constructor of `String` wrapper object.
 */
interface StringConstructor {
  /**
   * So `new String('hello')` will return `String`...
   */
  new (value?: any): String
  /**
   * And, `String('hello')` will return primitive `string`,
   * and now you know it inherits from `String` under the hood...
   */
  (value?: any): string
  /**
   * The prototype of `StringConstructor` is `String` too...
   */
  readonly prototype: String

  // ...
}

/**
 * The type definition of global `String` we used everyday.
 */
declare var String: StringConstructor

// ...
```

### Advanced Types

#### More Clear Object Types

Instead of using `object` type, you can use `{}` syntax to define an more clear
object type:

```ts
const obj: {
  a: number
  b: string
  c: boolean
} = {
  a: 1,
  b: 'hello',
  c: true,
}
```

#### Array and Tuple

In TypeScript, we use the `Array` or `<type>[]` to define array types,
and they are the same:

```ts
const arr1: Array<string> = ['a', 'b', 'c']
// or
const arr2: string[] = ['a', 'b', 'c']
```

And tuple is a special array type that is used to describe an array with a
**fixed length and element types**:

```ts
const tuple: [string, number, boolean] = ['a', 1, true]
```

That's all about them. So let's talk about something digressive. 😏

As we all know, array is a kind of object in JavaScript, and there is also a
term called "array-like object" to describe an object that has a `length`
property and indexed elements:

```ts
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}
```

So that, you can even assign a array value to a variable with the `object` type
directly:

```ts
const arr: object = ['a', 'b', 'c']
```

Nothing magic!

#### Function

In TypeScript, there are two ways to define function types, corresponding to the
two ways to define functions in JavaScript: function declaration and function
expression.

Just like other languages with static typing, the syntax is nothing special:

```ts
function fd(a: number, b: number): number {
  return a + b
}
const fe: (a: number, b: number) => number = (a, b) => a + b
```

Like array, function is also a kind of object in JavaScript (Actually,
everything except primitive values is object in JavaScript, that's sounds like
Java and some of other OOP languages, right? 😏), so you can do like this
without any problem:

```ts
const fn: object = (a: number, b: number) => a + b
```

#### Union and Intersection

As we all know, JavaScript is a dynamic typing language, so one variable can be
assigned to different types of values at different times. and when we try to get
the value of the variable, the value can only be one of the types at one time.

Just like the thing you done before, to support this behavior, you invented the
**union** and **intersection**.

Union sounds like "or", it means a type that satisfies any one of the types in
it. You can use **`|` operator** to create a union type:

```ts [twoslash]
// @errors: 2322

/**
 * `number | string` means `number` or `string`
 */
let a: number | string = 1
a = 'hello'
a = 5
a = true

/**
 * When we try to get the value of the variable,
 * the value maybe `number` or `string`,
 * so we need to use `typeof` to check the type of the value.
 */
if (typeof a === 'number') {
  a.toFixed(2)
}
else if (typeof a === 'string') {
  a.toUpperCase()
}
```

Naturally, there is also a type called **"never"**, it accepts no types:

```ts [twoslash]
// @errors: 2322

const b: never = 1
const c: never = 'hello'
// ...
```

Intersection sounds like "and", it means a type that satisfies all the types in
it. You can use **`&` operator (intersect operator)** to create a intersection
type:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
// @errors: 2322

/**
 * `number & string` means a type that satisfies both `number` and `string`,
 * which is `never`, because there is no type that can satisfy two different
 * primitive types at the same time.
 */
let d: number & string = 1
d = 1
d = 'hello'
d = true

/**
 * In this case, the type satisfies both `Type1` and `Type2`
 * is `{ a: number, b: string, c: boolean }`.
 */
type Type1 = {
  a: number
  b: string
}
type Type2 = {
  a: number
  c: boolean
}
const a: Type1 & Type2 = {
  a: 1,
  b: 'hello',
  c: true
}
a.a = 2
a.b = 'world'
a.c = false
```

## Type Challenges

Now, please try to complete the [Type Challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md).
