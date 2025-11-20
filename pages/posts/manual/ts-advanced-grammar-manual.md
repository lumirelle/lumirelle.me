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

These wrappers are not meant to **be used directly**, like using `new
String('hello')` in your code, they are used internally by the JavaScript engine
to **provide methods on primitive values**.

And there is nothing different in TypeScript: There are some types with the
PascalCase name pattern to express the wrapper types of primitives, and they are
not meant to **be used directly too**. They are used for similar purpose:
**provide type support for methods on primitive values**.

> [!Caution]
>
> Below are just examples on how to get the wrapper types of primitives, you
> should not use them in your code like that.

- `String`
  <!-- eslint-disable ts/no-wrapper-object-types, no-new-wrappers, unicorn/new-for-builtins -->
  ```ts
  const str: String = new String('hello')
  ```
- `Number`
  <!-- eslint-disable ts/no-wrapper-object-types, no-new-wrappers, unicorn/new-for-builtins -->
  ```ts
  const num: Number = new Number(1)
  ```
- `BigInt`:
  <!-- eslint-disable ts/no-wrapper-object-types, no-new-wrappers, unicorn/new-for-builtins -->
  ```ts
  const big: BigInt = new BigInt(1)
  ```
- `Boolean`:
  <!-- eslint-disable ts/no-wrapper-object-types, no-new-wrappers, unicorn/new-for-builtins -->
  ```ts
  const bool: Boolean = new Boolean(true)
  ```
- `Symbol`:
  <!-- eslint-disable ts/no-wrapper-object-types, no-new-wrappers, unicorn/new-for-builtins -->
  ```ts
  const sym: Symbol = new Symbol('sym')
  ```
- `Object`:
  <!-- eslint-disable ts/no-wrapper-object-types, no-new-wrappers, unicorn/new-for-builtins -->
  ```ts
  const obj: Object = new Object({})
  ```

Something interesting is that you can assign a wrapper object to a variable with
the primitive type directly:

<!-- eslint-disable no-new-wrappers, unicorn/new-for-builtins -->

```ts
const str: string = new String('hello')
const num: number = new Number(1)
const big: bigint = new BigInt(1)
const bool: boolean = new Boolean(true)
const sym: symbol = new Symbol('sym')
const obj: object = new Object({})
```

What? You are just assigning a object value to primitive type variable? 😨

Actually, the reason is very simple: Calling methods on primitive values is a
very common operation and a recommended behavior in JavaScript, as the designer
of TypeScript, you want to provide a type that supports this behavior for
compatibility, the only thing you can do is let `number` "inherit" from
`Number`.

Yes, `number` is inheriting from `Number` in technically, so you know what will
happen.

So, there is nothing strange at all, right? 🤣

At the end, let's take a look at the type definition of `String` in TypeScript:

<!-- eslint-disable no-var, vars-on-top -->

```ts
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
 *
 * @example
 *   // The `String` here is actually the `StringConstructor`
 *   String.fromCharCode(97)
 */
declare var String: StringConstructor
```

### Advanced Types

#### Array and Tuple

In TypeScript, we use the `Array` or `<type>[]` to define array types,
and they are the same:

```ts
const arr: Array<string> = ['a', 'b', 'c']
const arr: string[] = ['a', 'b', 'c']
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

#### Union

As we all know, JavaScript is a dynamic typing language, so one variable can be
assigned to different types of values at different times.

Just like the thing you done before, to support this behavior, you invented a
type called "union", it uses the `|` operator to join multiple types:

```ts
const a: number | string = 1
a = 'hello'
a = 5
a = true // Error: Type 'boolean' is not assignable to type 'number | string'
```

The role of union is just like it's name, a union of types, so that the variable
can be assigned to a value with any of the types in the union.

Union type in TypeScript has the same meaning as the mathematical union, so,
naturally, there is also a type to express the "empty union", called "never", it
refuses any type:

```ts
const b: never = 1 // Error: Type 'number' is not assignable to type 'never'
const c: never = 'hello' // Error: Type 'string' is not assignable to type 'never'
// ...
```

Notice that, we are talking about the union of
**the accaptable types of the variable**, not the actual value type it holds.
They are different concepts:

- If the union is about the accaptable types:
  - The variable can be assigned to a value with any of the types in the union.
  - But when we try to get the value type, it can only be one of the types in
    the union at one time.
- If the union is about the actual value types:
  - The variable should always be assigned to a value which satisfies all the types in the union.
  - When we try to get the accaptable types, it can satisfies any of the types in the union.

#### Intersection

We have union in TypeScript, so we also have intersection in TypeScript, it uses
the `&` operator to join multiple types:

```ts
const d: { a: number, b: string } & { a: number, c: boolean } = { a: 1, b: 'hello', c: true }
console.log(d.a) // -> 1
console.log(d.b) // -> 'hello'
console.log(d.c) // -> true
```

Intersection type in TypeScript has the same meaning as the mathematical intersection, so, naturally, there is also a type to express the "empty intersection", called "never", it accepts any type:

## Type Challenges

Now, please try to complete the [Type Challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md).
