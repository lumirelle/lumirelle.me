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

> [!Note]
>
> This manual hypothesizes that you have already read
> [JavaScript Advanced Grammar Manual](js-advanced-grammar-manual).

TypeScript is a superset of JavaScript that adds static typing to the language.

It's the main purpose of TypeScript, remember it and that will help you a lot.

## Types for JavaScript Basic Data Types

TypeScript has the following 8 types to express corresponding JavaScript basic
data types:

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

## Types for JavaScript Built-In Prototypes

> [!Note]
>
> If you don't know what is `prototype`, please read
> [JavaScript Advanced Grammar Manual](js-advanced-grammar-manual#prototypes-inheritance)
> for more details.

TypeScript also has some types to express corresponding JavaScript built-in
prototypes:

| Category            | JavaScript Built-In Prototype | TypeScript Type |
| ------------------- | ----------------------------- | --------------- |
| Primitive Wrapper   | `String.prototype`            | `String`        |
| /                   | `Number.prototype`            | `Number`        |
| /                   | `BigInt.prototype`            | `BigInt`        |
| /                   | `Boolean.prototype`           | `Boolean`       |
| /                   | `Symbol.prototype`            | `Symbol`        |
| Top Level Prototype | `Object.prototype`            | `Object`        |
| Data Structure      | `Array.prototype`             | `Array`         |
| /                   | `Map.prototype`               | `Map`           |
| /                   | `Set.prototype`               | `Set`           |
| /                   | `Function.prototype`          | `Function`      |
| /                   | `Date.prototype`              | `Date`          |
| /                   | `RegExp.prototype`            | `RegExp`        |
| Error               | `Error.prototype`             | `Error`         |
| Promise             | `Promise.prototype`           | `Promise`       |
| ...                 | ...                           | ...             |

> [!Note]
>
> As primitive wrapper objects are not meant to **be used directly** in
> JavaScript, because they are only designed to be used internally by the
> JavaScript engine to **support calling methods on primitive values**, and may
> cause unexpected behavior:
>
> <!-- eslint-disable no-new-wrappers, unicorn/new-for-builtins -->
>
> ```ts
> if (new Boolean(false)) {
>   console.log('Boolean(false) is truthy') // This will be logged!
> }
> else {
>   console.log('Boolean(false) is falsy')
> }
>
> if (false) {
>   console.log('false is truthy')
> }
> else {
>   console.log('false is falsy') // This will be logged!
> }
> ```
>
> There is nothing different in TypeScript: The corresponding types of wrapper
> objects for primitivesare not meant to **be used directly too**. They are
> used for similar purpose:
> **provide type support for methods on primitive values**.
>
> ```ts
> const str: string = 'hello'
> /**
>  * A value of type `string` is automatically "inherited" from the wrapper type
>  * `String`, so that you can get the definition of methods on it.
>  */
> console.log(str.toUpperCase())
> ```

At the end, let's take a look at the type definition of `String` in TypeScript,
to learn more about them:

<!-- eslint-disable no-var, vars-on-top -->

```ts
// @file: node_modules/typescript/lib/lib.es5.d.ts

// ...

/**
 * The type definition of string wrapper object, also the type of global
 * `String.prototype`.
 */
interface String {
  // ... Members of `String.prototype`

  readonly [index: number]: string

  // ...
}

/**
 * The type definition of string wrapper constructor, also the global `String`.
 */
interface StringConstructor {
  /**
   * So `new String('hello')` will return `String` type.
   */
  new (value?: any): String
  /**
   * And, `String('hello')` will return primitive `string` type.
   */
  (value?: any): string
  /**
   * `String.prototype` is the prototype of string wrapper object, it's
   * `String` type.
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

## Object

We know that everything except primitive values is object in JavaScript, so it's
important to know how to define an object type in TypeScript.

Instead of using `object` type directly, you can use `{}` syntax to define an
more clear object type, we call it **object type literal**:

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

## Array and Tuple

In TypeScript, we use the **`Array`** type (we mentioned it in
[built-in prototypes](#types-for-javascript-built-in-prototypes) section before)
or **`[]` (array type literal)** to define array types,
and they are the same:

```ts
const arr1: Array<string> = ['a', 'b', 'c']
// or
const arr2: string[] = ['a', 'b', 'c']
```

And tuple is a special array type that is used to describe an array with
**fixed length and element types**, we can create it by using
**tuple type literal**:

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

## Function

In TypeScript, there are two ways to define function types, corresponding to the
two ways to define functions in JavaScript: **function declaration** and
**function expression**.

Just like other languages with static typing, the syntax is nothing special:

```ts
function fd(a: number, b: number): number {
  return a + b
}
const fe: (a: number, b: number) => number = (a, b) => a + b
```

Function declaration integrates types into the function declaration itself, and
function expression uses **function type literal** to define the type.

Like array, function is also a kind of object in JavaScript, so you can do like
this without any problem:

```ts
const fn: object = (a: number, b: number) => a + b
```

## Union and Intersection

As we all know, JavaScript is a dynamic typing language, so one variable can be
assigned to different types of values at different times. and when we try to get
the value of the variable, the value can only be one of the types at one time.

As the smart designer of TypeScript,in order to support this behavior, you
invented the **union** and **intersection** types.

Union likes "or", it standard for **a type that satisfies any one of the types** in
it. You can use **`|` operator (union operator)** to create a union type:

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
const a: never = 1
const b: never = 'hello'
// ...
```

And, there is also a type called **"any"**, it accepts any types:

```ts [twoslash]
const a: any = 1
const b: any = 'hello'
// ...
```

Intersection likes "and", it standard for **a type that satisfies all the types** in
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

## Custom Types/Interfaces

You may already notice that, we can use `type` keyword to define a custom type:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts
type NumberOrString = number | string
type CustomObject = {
  a: number
  b: string
  c: boolean
}
```

And `interface` is a better way to define a custom object type literal:

```ts
interface CustomObject {
  a: number
  b: string
  c: boolean
}
```

Then use them in your code:

```ts [twoslash]
// @errors: 2322
type NumberOrString = number | string
// ---cut---
let numOrString: NumberOrString = 1
numOrString = 'hello'
numOrString = true
```

These two are very important things in TypeScript, through them, you can create
your own utility types, for better type development, like:

```ts
type Nullable<T> = T | null | undefined

// Before:
const a1: number | null | undefined = 1

// After:
const a2: Nullable<number> = 1
```

## Built-in Utility Types

See [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)
for more details.

## `keyof` Operator

The `keyof` operator is used to get the union of all the keys of an object type:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type ObjectType = {
  a: number
  b: string
  c: boolean
}
type ObjectKeys = keyof ObjectType & {}
//    ^?
```

## Type Challenges

Now, please try to complete the [Type Challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md).
