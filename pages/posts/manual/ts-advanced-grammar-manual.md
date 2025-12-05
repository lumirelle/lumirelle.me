---
title: TypeScript Advanced Grammar Manual
date: 2025-11-18T17:16+08:00
update: 2025-12-05T10:02+08:00
lang: en
duration: 36min
type: blog+note
---

[[toc]]

## Introduction

> [!Note]
>
> This manual hypothesizes that you have already read [JavaScript Advanced Grammar Manual](js-advanced-grammar-manual).

TypeScript is a superset of JavaScript that adds static typing to the language.

So adding type support for JavaScript and improving development experience are the main purposes of TypeScript, remember that will help you a lot.

## Types for JavaScript Basic Data Types

TypeScript has the following 8 types to express corresponding JavaScript basic data types:

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

### Type Literal

For `const` variables, TypeScript provides more exact data types (except for `symbol`): Using the value itself as the type, we call it **type literal**.

For example:

```ts [twoslash]
const a = 'hello'
//    ^?
// ...

const b = 1
//    ^?
// ...

const c = 1n
//    ^?
// ...

const d = true
//    ^?
// ...

const e = {
  a: 1,
  b: 'hello',
  c: true,
  d: () => {
    console.log('hello')
  },
  e() {
    console.log('hello')
  },
} as const
console.log(e)
//          ^?
// ...

// ...

// ...

// ...

// ...
```

> [!Note]
>
> You may notice that for objects, you should manually append `as const` to the object literal.
>
> This is because, in JavaScript, a `const` variable just means it cannot be reassigned with other values, but does not mean it's value cannot be mutated, especially for objects.
>
> So TypeScript lets you use `as const` to decide whether the object value is immutable or mutable, just like `Object.freeze` and `Object.seal`, but compile-time only, with more compatibility.
>
> (Array, tuple, function are the same, because they are objects under the hood 🙂)

And you can also use them as types explicitly:

<!-- eslint-disable ts/prefer-as-const -->

```ts [twoslash]
const a: 'hello' = 'hello'
//    ^?
// ...

const b: 1 = 1
//    ^?
// ...

const c: 1n = 1n
//    ^?
// ...

const d: true = true
//    ^?
// ...

const e: { a: 1, b: 'hello', c: true } = { a: 1, b: 'hello', c: true }
//    ^?
// ...

// ...

// ...

// ...

// Or more loosely:
const f: { a: number, b: string, c: boolean } = { a: 1, b: 'hello', c: true }
//    ^?
// ...

// ...

// ...

// ...
```

The most commonly used type literals are [string](#string-template-literal-type) and [object](#object-type-literal).

## Types for JavaScript Built-In Prototypes

> [!Note]
>
> If you don't know what is `prototype`, please read [JavaScript Advanced Grammar Manual](js-advanced-grammar-manual#prototypes-inheritance) for more details.

TypeScript also has some types to express corresponding JavaScript built-in prototypes:

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
> As primitive prototypes are only designed to **be used internally** by the JavaScript engine to **support calling methods on primitive values**, it may cause unexpected behavior:
>
> <!-- eslint-disable no-new-wrappers, unicorn/new-for-builtins -->
>
> ```ts
> // Objects are truthy, although it's a wrapper object for `false` // [!code highlight:4]
> if (new Boolean(false)) {
>   console.log('new Boolean(false) is truthy') // This will be logged!
> }
> else {
>   console.log('new Boolean(false) is falsy')
> }
>
> // Of course, `false` is falsy // [!code highlight:1]
> if (false) {
>   console.log('false is truthy')
> }
> else { // [!code highlight:3]
>   console.log('false is falsy') // This will be logged!
> }
> ```
>
> There is nothing different in TypeScript: The corresponding types of primitive prototypes are designed to **be used internally** too, in order to **provide type support for methods on primitive values**.
>
> <!-- eslint-disable no-new-wrappers, unicorn/new-for-builtins, ts/no-wrapper-object-types -->
>
> ```ts [twoslash]
> // The primitive type `string` contains all the members of `String.prototype`
> // internally, so you can call methods on it.
> const str1: string = 'hello'
> //    ^?
> // ..
>
> console.log(str1.toUpperCase())
> //               ^?
>
> // ...
>
> // ⚠️ No errors, but you must not do like this!
> const str2: String = 'hello'
> const str3: String = new String('hello')
> ```

At the end, let's take a look at the type definition of `String` in TypeScript, to learn more about them:

<!-- eslint-disable no-var, vars-on-top, ts/method-signature-style -->

```ts
// @file: node_modules/typescript/lib/lib.es5.d.ts

// ...

/**
 * The type definition of prototype of all string values.
 */
interface String {
  toString(): string
  charAt(pos: number): string

  // ...

  readonly [index: number]: string

  // ...
}

/**
 * The type definition of `String` constructor.
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
declare var String: StringConstructor

// ...
```

## Union and Intersection

As we all know, JavaScript is a dynamic typing language, so one variable can be assigned to different types of values at different times. and when we try to get the value of the variable, the value can only be one of the types at one time.

As the smart designer of TypeScript,in order to support this behavior, you invented the **union** and **intersection** types.

Union likes "or", it standard for **a type that satisfies any one of the types** in it. You can use **`|` operator (union operator)** to create a union type:

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
```

And, there is also a type called **"any"**, it accepts any types:

```ts
const a: any = 1
const b: any = 'hello'
```

**unknown** is a type that is more strict than `any`, it accepts any types, but you can't do anything with it, you need to confirm the real type first:

```ts [twoslash]
// @errors: 18046
const a: unknown = 1

a.toFixed(2)

if (typeof a === 'number') {
  a.toFixed(2)
}
else if (typeof a === 'string') {
  a.toUpperCase()
}
```

Intersection likes "and", it standard for **a type that satisfies all the types** in it. You can use **`&` operator (intersect operator)** to create a intersection type:

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

### Type Narrowing

When you want to implement some type-specific logic, you need to narrow the type first.

For type narrowing, we can use:

- `typeof` operator with conditional statements

  ```ts [twoslash]
  function plus1(a: number | string): number {
    if (typeof a === 'number') {
      // In this case, `a` is narrowed to `number` type
      return a + 1
      //     ^?
    }
    else {
      // In this case, `a` is narrowed to `string` type
      return Number(a) + 1
      //            ^?
    }
  }
  ```

- `in` operator with conditional statements

  <!-- eslint-disable ts/consistent-type-definitions -->

  ```ts [twoslash]
  type BasicConfig = {
    name?: string
    rules?: Record<string, any>
  }
  type OverrideConfig = BasicConfig & {
    files: string[]
  }
  type Config = BasicConfig & {
    override?: OverrideConfig[]
  }

  /**
   * This function is used to transform `OverrideConfig` to `Config` type.
   */
  function fn(a: Config | OverrideConfig): Config {
    if ('files' in a) {
      return { override: [a] }
      //                  ^?
    }
    else {
      return a
      //     ^?
    }
  }
  ```

- `instanceof` operator with conditional statements

  ```ts [twoslash]
  function fn(a: Date | string) {
    if (a instanceof Date) {
      return a.toISOString()
      //     ^?
    }
    else {
      return a
      //     ^?
    }
  }
  ```

- ...and some other checks with conditional statements can help TypeScript to infer the type of the variable

  <!-- eslint-disable ts/consistent-type-definitions -->

  ```ts [twoslash]
  type Circle = {
    kind: 'circle'
    radius: number
  }
  type Square = {
    kind: 'square'
    sideLength: number
  }
  type Shape = Circle | Square

  function getArea(shape: Shape) {
    switch (shape.kind) {
      case 'circle':
        return Math.PI * shape.radius ** 2
        //               ^?
        // ...
      case 'square':
        return shape.sideLength ** 2
        //     ^?
        // ...
      default: {
        const _exhaustiveCheck: never = shape
        //                              ^?
        return _exhaustiveCheck
      }
    }
  }
  ```

- Re-assigning the variable to a different type

  ```ts [twoslash]
  function fn(a: number | string) {
    a = 1
    console.log(a)
    //          ^?

    a = 'hello'
    console.log(a)
    //          ^?
  }
  ```

- Using [type guard functions](#type-guards)
- Using [type assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) (Not recommended)

### Type Guards

Type guards are the way to check the type of a variable at runtime.

A function with return type of `x is Type` is a type guard function, it can be used to narrow the type of the variable. You can use it like how you use `typeof` keyword,for example:

```ts [twoslash]
function isNumber(a: any): a is number {
  return typeof a === 'number'
}

const a: any = 1
if (isNumber(a)) {
  console.log(a)
  //          ^?
}
else {
  console.log(a)
  //          ^?
}
```

## String Template Literal Type

String template literal types build on string literal, and have the ability to expand into many strings via unions:

```ts [twoslash]
type World = 'World'
type Name = 'Alice' | 'Bob'
type Greeting = `Hello ${World}, ${Name}!`
//   ^?
// ...
```

## Object Types

### Object Type Literal

We know that everything except primitive values is object in JavaScript, so it's important to know how to define an object type in TypeScript.

Instead of using `object` type directly, you can use `{ ... }` syntax to define a more exact object type, we call it **object type literal**:

<!-- eslint-disable ts/method-signature-style -->

```ts
const obj: {
  a: number
  b: string
  c: boolean
  d: () => void
  e(): void
} = {
  a: 1,
  b: 'hello',
  c: true,
  d: () => {
    console.log('hello')
  },
  e() {
    console.log('hello')
  },
}
```

### Readonly & Optional Properties

You can use `readonly` keyword to define a readonly property:

```ts [twoslash]
// @errors: 2540
const obj: {
  readonly a: number
} = {
  a: 1,
}

obj.a = 2
```

And you can use `?` keyword to define an optional property:

```ts [twoslash]
const obj: {
  a?: number
} = {}
```

### Index Signature

Sometimes you don’t know all the names of a type’s properties ahead of time, but you do know the shape of the values.

In those cases you can use an index signature to describe the types of possible values, for example:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
// `number` index signature
type NumberObject = {
  [index: number]: string
}
const n1: NumberObject = {
  0: 'a',
  1: 'b',
  2: 'c',
}
const n2: NumberObject = [
  'a',
  'b',
  'c',
]

// `string` index signature
type StringObject = {
  [index: string]: string
}
const s: StringObject = {
  a: 'a',
  b: 'b',
  c: 'c',
}
```

## Interface Types

If you need a reusable object type, you must define it with name by `type` or `interface` keyword.

<!-- eslint-disable ts/consistent-type-definitions -->

```ts
type MyObject = {
  a: number
  b: string
  c: boolean
}

interface MyInterface {
  a: number
  b: string
  c: boolean
}
```

### `type` vs. `interface`

Interface is a better way to define a custom [object type literal](#object-type-literal), which are more intuitive and more powerful:

- Extending: Both can be extended, but interfaces support [declaration merging](#declaration-merging).
- Unions/Intersections: Only type aliases support union and intersection types.
- Implements: Classes can implement either.
- Recommendation: Use interface for objects (except for the need of using union/intersection), type for everything else.

<!-- eslint-disable ts/consistent-type-definitions, ts/method-signature-style -->

```ts [twoslash]
type MyObject1 = {
  a: number
  b: string
  c: boolean
  d: () => void
  e(): void
}
class MyClass implements MyObject1 {
  a: number = 1
  b: string = 'hello'
  c: boolean = true
  d = () => {
    console.log('hello')
  }

  e() {
    console.log('hello')
  }
}

interface MyObject2 {
  a: number
  b: string
  c: boolean
  d: () => void
  e(): void
}
class MyClass2 implements MyObject2 {
  a: number = 1
  b: string = 'hello'
  c: boolean = true
  d = () => {
    console.log('hello')
  }

  e() {
    console.log('hello')
  }
}
```

## Array and Tuple Types

In TypeScript, we use the **`Array`** type (we mentioned it in [built-in prototypes](#types-for-javascript-built-in-prototypes) section before) or **`[]` (array type literal)** to define array types, and they are the same:

```ts
const arr1: Array<string> = ['a', 'b', 'c']
// or
const arr2: string[] = ['a', 'b', 'c']
```

And tuple is a special array type that is used to describe an array with **fixed length and element types**, we can create it by using **`[ ... ]` (tuple type literal)**:

```ts
const tuple1: [number, number] = [0.5, 7.8]
// You can also provide the names of the elements, for better information
const tuple2: [x: number, y: number] = [0.5, 7.8]
```

So we can imagine that, a constant array is a tuple, because it's length and element types are fixed:

```ts [twoslash]
const constArr = [1, 2, 3] as const
//    ^?
// ...
```

That's all about them. So let's talk about something digressive. 😏

As we all know, array is a kind of object in JavaScript, and there is also a term called "array-like object" to describe an object that has a `length` property and indexed elements:

```ts
interface ArrayLike {
  [index: number]: any
  length: number
}
```

So that, you can even assign a array value to a variable with the `object` or `ArrayLike` type directly:

```ts
const arr1: object = ['a', 'b', 'c']
const arr2: ArrayLike = ['a', 'b', 'c']
```

Nothing magic!

## Function Types

In TypeScript, there are two ways to define function types: **`function fn( ... ) { ... }` (function declaration)** and **`( ... ) => ...` (function type literal)**, corresponding to the function declaration and function expression in JavaScript.

And the syntax is nothing special:

```ts
// Function Declaration, integrates types into the function declaration itself
function fd(a: number, b: number): number {
  return a + b
}

// Function Type Literal
const fe: (a: number, b: number) => number = function (a, b) {
  return a + b
}
const fa: (a: number, b: number) => number = (a, b) => a + b
```

Like array, function is also a kind of object in JavaScript, and there is also a term called "function like object" to describe an object that can be called:

```ts
interface FunctionLike {
  (...args: any[]): any
}
interface ConstructorFunctionLike {
  new (...args: any[]): any
}
interface BothConstructorAndFunctionLike {
  (...args: any[]): any
  new (...args: any[]): any
}
```

So that we can assign a function to a variable with `object` or function-like type directly:

- Object:

```ts [twoslash]
const obj: object = function () {
  console.log('hello')
}
```

- Function Like:

  ```ts [twoslash]
  // @errors: 7009
  interface FunctionLike {
    (description?: string | number): symbol
  }
  const FunctionLike: FunctionLike = function (
    description?: string | number
  ): symbol {
    return Symbol(description)
  }

  const symbol1 = FunctionLike('symbol')
  //    ^?
  // ...

  // You cannot call `new` on a function-like object
  const symbol2 = new FunctionLike('symbol')
  ```

- Constructor Like:

  ```ts [twoslash]
  // @errors: 2348
  interface ConstructorLike {
    new (value: string | number | Date): Date
  }
  const ConstructorLike: ConstructorLike = function (
    value: string | number | Date
  ): Date {
    return new Date(value)
  } as any

  // You cannot call without `new` on a constructor-like object
  const date1 = ConstructorLike('2025-11-24')

  const date2 = new ConstructorLike('2025-11-24')
  //    ^?
  // ...
  ```

- Both Function and Constructor Like:

  <!-- eslint-disable no-var, no-new-wrappers, ts/no-wrapper-object-types, unicorn/new-for-builtins -->

  ```ts [twoslash]
  interface BothLike {
    <T extends number>(value: T): T
    new<T extends number>(value: T): Number
  }
  // We declare this constructor function with type `BothLike`
  const BothLike: BothLike = function <T extends number>(
    value: T
  ): number | Number {
    if (new.target) {
      return new Number(value)
    }
    else {
      return value
    }
    // We cannot create a function that satisfies `BothLike` type
    // directly, so we use `as any` to bypass the type check.
  } as any

  const number1 = BothLike(1)
  //    ^?
  // ...

  const number2 = new BothLike(1)
  //    ^?
  // ...
  ```

### Function Overload

Function overload is a way to define multiple function signatures for the same function, the only thing you need to do is to define the function signatures together, and put the implementation after them.

The signature of implementation function will not be used in the type system, it's used for implementation only, that means you can only see two definitions of `fn` in the example below:

```ts [twoslash]
function fn(x: number, y: number): number // -> Overload 1
function fn(xy: string): number // -> Overload 2
function fn(x: string | number, y: number = 0): number { // -> Implementation
  if (typeof x === 'string') {
    return +x
  }
  else {
    return x + y
  }
}

// One signature with one overload, totally two definitions.
console.log(fn)
//          ^?

// ...
```

Notice that, the overload function signatures should compatible with the implementation, or you will get an error:

```ts [twoslash]
// @errors: 2394
function fn(x: number, y: number): number
// The return type of this overload is not compatible
function fn(xy: string): string
function fn(x: string | number, y: number = 0): number {
  if (typeof x === 'string') {
    return +x
  }
  else {
    return x + y
  }
}
```

## Generic Types

Just like other OOP languages with generics, TypeScript has generic types to create reusable types, and their usage is similar.

For example:

```ts
type MyArray<T> = T[]

const a: NyArray<number> = [1, 2, 3]
const b: NyArray<string> = ['a', 'b', 'c']

function add<T>(a: T, b: T): T {
  return a + b
}
```

## Class Types

TypeScript has some additional features on JavaScript's classes.

### Member Types

In TypeScript, you can define the type of class members, like fields, constructor parameters, method parameters, method return:

```ts
class Person {
  name: string // Field type

  constructor(name: string) { // Constructor parameter type
    this.name = name
  }

  sayHello(msg: string): void { // Method parameters and return type
    console.log(`Hello, ${this.name}! ${msg}`)
  }
}

const person: Person = new Person('Alice')
person.sayHello('Nice to meet you!')
```

> [!Note]
>
> Constructor can not have generic parameters and return type:
>
> Generic parameters should placed [in the class declaration](#generic-classes), while the return type of constructor is implicit to the class itself.

### Readonly Fields

Like object types, you can use `readonly` keyword to define a readonly field in class:

```ts [twoslash]
// @errors: 2540
class Person {
  readonly name: string

  constructor(name: string) {
    this.name = name
  }
}

const person: Person = new Person('Alice')
person.name = 'Bob'
```

### Member Visibility

TypeScript add three visibility modifiers to class members: `public`, `protected` and `private`:

```ts
class Person {
  public name: string
  protected age: number
  private gender: string

  constructor(name: string, age: number, gender: string) {
    this.name = name
    this.age = age
    this.gender = gender
  }
}
```

- `public`: The default visibility, can be accessed anywhere.
- `protected`: Can be accessed within the class and its subclasses.
- `private`: Can be accessed only within the class.

  > [!Note]
  >
  > There is a special case, TypeScript allow cross-instance `private` access:
  >
  > ```ts [twoslash]
  > class A {
  >   private x = 10
  >
  >   public sameAs(other: A) {
  >     // No error while accessing `x` of `other`
  >     return other.x === this.x
  >   }
  > }
  > ```

### Generic Classes

Classes, much like interfaces, can be generic, and the generic parameters can only be used in **instance scope**:

```ts [twoslash]
// @errors: 2302
class MyClass<T> {
  static defaultValue: T
  private value: T
  constructor(value: T) {
    this.value = value
  }
}
```

### Abstract Classes

Just like other OOP languages, TypeScript has `interface` and `implements` keywords (We mentioned them [before](#interface-types)).

There is also a `abstract` keyword to define an abstract class:

```ts
abstract class Animal {
  abstract makeSound(): void
}
class Dog extends Animal {
  makeSound() {
    console.log('woof')
  }
}
```

## Decorators

Decorator in is a special function that can be called on **classes**, **class elements**, or **other JavaScript syntax forms** during definition (Like annotations in Java).

Now that both [Decorators](https://github.com/tc39/proposal-decorators) and [Decorator Metadata](https://github.com/tc39/proposal-decorator-metadata) have achieved Stage 3 within TC39, you can use them in TypeScript without any configuration.

[Parameter Decorator](https://github.com/tc39/proposal-class-method-parameter-decorators) is still in Stage 1, hope it will be supported in the future.

### Decorator Definitions

Using TypeScript interfaces for brevity and clarity, this is the general shape of the API:

```ts
type Decorator = (value: Input, context: {
  kind: string
  name: string | symbol
  access: {
    get?: () => unknown
    set?: (value: unknown) => void
  }
  private?: boolean
  static?: boolean
  metadata: Record<string | number | symbol, unknown>
  addInitializer: (initializer: () => void) => void
}) => Output | void
```

The `Input` is determind by the target of the decorator, and if a decorator returns a value, it means replace the original `Input` on target with the returned one.

For example, for class decorator, the `Input` is the class constructor:

```ts
// Using `Constructor<T = void>` type from `@antfu/utils` for more concise
// code, is the same as `new<T = void>(...args: any[]) => T`.
import type { Constructor } from '@antfu/utils'

function logClass(constructor: Constructor) {
  console.log(`Class ${constructor.name} was defined at ${new Date().toISOString()}`)
}
```

For context, TypeScript already has types to support them. See the showing examples below for more details.

### Using Decorators

Decorators use the form `@expression`, where `expression` must evaluate to a function that will be called at runtime with information about the decorated declaration.

For example:

```ts
import type { Constructor } from '@antfu/utils'

function logClass(constructor: Constructor, { kind }: ClassDecoratorContext) {
  if (kind !== 'class')
    return
  console.log(`Class ${constructor.name} was defined at ${new Date().toISOString()}`)
}

// When the code is loaded, the `logClass` function will be called with the
// `UserService` class constructor
// -> Class UserService was defined at 2025-12-04T04:03:55.667Z // [!code highlight:2]
@logClass
class UserService {
  getUsers() {
    return ['Alice', 'Bob', 'Charlie']
  }
}
```

### Decorator Factories

A decorator factory is a function that returns a decorator, you can call it with arguments to create a decorator with different configurations:

```ts
function logClass(message: string) {
  return function (constructor: Constructor, { kind }: ClassDecoratorContext) { // [!code highlight:6]
    if (kind !== 'class')
      return
    console.log(message)
    console.log(`Class ${constructor.name} was defined at ${new Date().toISOString()}`)
  }
}

@logClass('Class UserService was defined!') // [!code highlight:5]
/**
 * -> Class UserService was defined!
 *    Class UserService was defined at 2025-12-04T04:03:55.667Z
 */
class UserService {
  getUsers() {
    return ['Alice', 'Bob', 'Charlie']
  }
}
```

### Class Decorators

The class decorator is applied to the class constructor.

When the class constructor definition is loaded, the decorator will be called with the constructor and the decorator context.

```ts
// [!code highlight:14]
function sealed(constructor: Constructor, { kind, name }: ClassDecoratorContext) {
  if (kind !== 'class')
    return

  // You cannot seal the class constructor, or you will break the behavior
  // of decorators, e.g.:
  // Object.seal(constructor)
  // -> TypeError: Cannot add property Symbol(Symbol.metadata), object is not extensible

  // You can only seal the prototype of the class constructor:
  Object.seal(constructor.prototype)

  console.log(name)
}

// [!code highlight:1]
@sealed
class BugReport {
  type = 'report'
  title: string

  constructor(t: string) {
    this.title = t
  }
}

// [!code highlight:2]
BugReport.prototype.newMethod = function () {}
// -> BugReport
// -> TypeError: Cannot add property newMethod, object is not extensible
```

### Class Method Decorators

When the class method definition is loaded, the decorator will be called with the method and the decorator context.

```ts
// [!code highlight:15]
function measureTime(
  method: (...args: any[]) => any,
  { kind, name }: ClassMethodDecoratorContext
) {
  if (kind !== 'method')
    return
  return function (...args: any[]) {
    const start = performance.now()
    // @ts-expect-error Missing type support
    const result = method.call(this, args)
    const end = performance.now()
    console.info(`${String(name)} executed in ${(end - start).toFixed(2)}ms`)
    return result
  }
}

class DataProcessor {
  // [!code highlight:1]
  @measureTime
  processData(data: number[]): number[] {
    for (let i = 0; i < 100000000; i++) { /* processing */ }
    return data.map(x => x * 2)
  }
}

// [!code highlight:2]
const processor = new DataProcessor()
processor.processData([1, 2, 3, 4, 5]) // -> processData executed in 24.53ms
```

### Class Field Decorators

When the class field definition is loaded, the decorator will be called with `undefined` and the decorator context.

We can use metadata to record information about the field, as in the following example:

```ts
// Runtime polyfill for environment that does not support metadata API
(Symbol as { metadata: symbol }).metadata ??= Symbol('Symbol.metadata')

// [!code highlight:7]
function format(formatString: string) {
  return function (_: undefined, { kind, metadata }: ClassFieldDecoratorContext) {
    if (kind !== 'field')
      return
    metadata.format = formatString
  }
}

class Greeter {
  // [!code highlight:1]
  @format('Hello, %s')
  greeting: string

  constructor(message: string) {
    this.greeting = message
  }

  greet() {
    // [!code highlight:1]
    const formatString = Greeter[Symbol.metadata]?.format as string ?? ''
    return formatString.replace('%s', this.greeting)
  }
}

const greeter = new Greeter('world!') // [!code highlight:3]
console.log(greeter.greet()) // -> Hello, world!
console.log(greeter.greeting) // -> world!
```

### Class Getter/Setter Decorators

When the class getter/setter definition is loaded, the decorator will be called with the getter/setter and the decorator context.

<!-- eslint-disable accessor-pairs -->

```ts
function logged<T extends (...args: any[]) => any>(
  method: T, { kind, name }: ClassGetterDecoratorContext): T
function logged<T extends (...args: any[]) => any>(
  method: T, { kind, name }: ClassSetterDecoratorContext): T
function logged<T extends (...args: any[]) => any>(
  method: T,
  { kind, name }: ClassGetterDecoratorContext | ClassSetterDecoratorContext
) {
  if (kind !== 'getter' && kind !== 'setter')
    return
  return function (...args: any[]) {
    console.log(`Starting ${String(name)} with arguments ${args.join(', ')}`)
    const ret = method.call(this, ...args)
    console.log(`Ending ${String(name)}`)
    return ret
  }
}

class C {
  @logged
  set x(arg: number) {}
}

new C().x = 1
// -> Starting x with arguments 1
//    Ending x
```

#### Class Auto Accessor Decorators

Auto-Accessors is part of [Grouped and Auto-Accessors](https://github.com/tc39/proposal-grouped-and-auto-accessors) proposal in Stage 1 within TC39, it allows you to define a class field with a grouped accessor without explicitly defining the getter and setter.

```ts
class C {
  accessor x = 1
}
```

This is the same as:

```ts
class C {
  #__x = 1
  get x() {
    return this.#__x
  }

  set x(value) {
    this.#__x = value
  }
}
```

Decorators are also supported.

```ts
function logged<T, V>(
  value: ClassAccessorDecoratorTarget<T, V>,
  { name }: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<T, V> {
  const { get, set } = value
  return {
    init(initialValue) {
      console.log(`Initializing ${String(name)} with value ${initialValue}`)
      return initialValue
    },
    get() {
      console.log(`Getting ${String(name)}`)
      return get.call(this)
    },
    set(val) {
      console.log(`Setting ${String(name)} to ${val}`)
      return set.call(this, val)
    },
  }
}

class C {
  @logged accessor x = 1
}

const c = new C() // -> Initializing x with value 1
c.x // -> Getting x
c.x = 123 // -> Setting x to 123
```

### Class Constructor/Method Parameter Decorators

> [!Caution]
>
> As [Decorators](https://github.com/tc39/proposal-decorators) has removed the parameter decorator support while archiving Stage 3 within TC39, and new solution [Parameter Decorators](https://github.com/tc39/proposal-class-method-parameter-decorators) is still in Stage 1.
>
> As a workaround, this is still the implementation using [the old Decorators in Stage 2](https://github.com/tc39/proposal-decorators-previous), and it's **incompatible** with new decorators.
>
> To run this example, you need:
>
> - Install `reflect-metadata` package:
>
>   ```sh
>   npm i reflect-metadata --save
>   ```
>
> - Enable `experimentalDecorators` in `tsconfig.json`:
>
>   ```json
>   {
>     "compilerOptions": {
>       "experimentalDecorators": true
>     }
>   }
>   ```
>
> Hope there will be a better solution in the future. (These decorators are quite important for parameter validation and dependency injection! 😭)

The parameter decorator is applied to the function for a class constructor or method declaration.

```ts
import 'reflect-metadata'

// [!code highlight:33]
const requiredMetadataKey = Symbol('required')
function required(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const requiredParameters: number[]
    = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) ?? []
  requiredParameters.push(parameterIndex)
  Reflect.defineMetadata(
    requiredMetadataKey,
    requiredParameters,
    target,
    propertyKey,
  )
}
function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
) {
  const method = descriptor.value!
  descriptor.value = function () {
    const requiredParameters: number[]
      = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName) ?? []
    for (const parameterIndex of requiredParameters) {
      if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
        throw new Error('Missing required argument.')
      }
    }
    return method.apply(this, arguments)
  }
}

class BugReport {
  type = 'report'
  title: string

  constructor(t: string) {
    this.title = t
  }

  // [!code highlight:2]
  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`
    }
    else {
      return this.title
    }
  }
}

// [!code highlight:14]
const bugReport = new BugReport('A bug flew into the system!')
console.log(bugReport.print(true))
/**
 * -> type: report
 *    title: A bug flew into the system!
 */
console.log(bugReport.print(false))
/**
 * -> A bug flew into the system!
 */
console.log(bugReport.print(undefined))
/**
 * -> Error: Missing required argument.
 */
```

## Types Manipulation

Welcome! You are now reading the most import part of TypeScript.

Before this, you already know the a lot of the features of different types in TypeScript, now you will learn how to manipulate them.

### Type Alias

You may already notice that, we can use `type` keyword to define a custom type (create a type alias):

<!-- eslint-disable ts/consistent-type-definitions -->

```ts
type NumberOrString = number | string
type CustomObject = {
  a: number
  b: string
  c: boolean
}
type CustomFunction = (a: number, b: string) => boolean
// ...
```

Then use them in your code:

```ts [twoslash]
// @errors: 2322
type NumberOrString = number | string
// ---cut---
let numOrString: NumberOrString = 1
numOrString = 'hello'
numOrString = true
// ...
```

Through it, you can create complex and reusable types, for better type development.

### `typeof` Operator

Sometimes, especially when you are facing a really complex type, you doesn't want to construct that type manually, and that type is not exported, the only way to get the type is to use `typeof` operator:

```vue
<script setup lang="ts">
const xxxRef = ref<typeof ComponentXxx>()
</script>

<template>
  <ComponentXxx ref="xxxRef" />
</template>
```

Additionally, TypeScript intentionally limits the sorts of expressions you can use typeof on: It’s only legal to use `typeof` on **identifiers**, but not **expressions**:

<!-- eslint-skip -->

```ts [twoslash]
// @errors: 1005
// Instead, you should use `ReturnType<typeof alert>`.
let shouldContinue: typeof alert("Are you sure you want to continue?");
```

### `keyof` Operator

The `keyof` operator is used to get **the union of all the keys of an object type**:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type ObjectType = {
  a: number
  b: string
  c: boolean
}
type ObjectKeys = keyof ObjectType & {}
//   ^?
// ...
```

### Indexed Access Types

We can use an indexed access type to look up a specific property on object type (Don't forget, array, tuple, and function are also object types 😄):

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type Person = { age: number, name: string, alive: boolean }
type Age = Person['age']
//   ^?
// ...

type Persons = Person[]
type PersonsCount = Persons['length']
//   ^?
// ...
```

The index itself is a type, so we can use unions, keyof, or other types entirely:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type Person = { age: number, name: string, alive: boolean }
// ---cut-before---
type I1 = Person['age' | 'name']
//   ^?
// ...

type I2 = Person[keyof Person]
//   ^?
// ...

type AliveOrName = 'alive' | 'name'
type I3 = Person[AliveOrName]
//   ^?
// ...
```

So we can use even `number` type to get all elements of an array/tuple:

```ts [twoslash]
const MyArray = [
  { name: 'Alice', age: 15 },
  { name: 'Bob', age: 23 },
  { name: 'Eve', age: 38 },
]

type Person = typeof MyArray[number]
//   ^?

// ...

// ...

// ...

type Age = typeof MyArray[number]['age']
//   ^?
// ...
```

Recall what array-like object is? Yes, an object with index signature from `number` to its elements, plus some array-specific properties like `length`.

```ts
interface Array<T> {
  [index: number]: T
  length: number
  // ...
}
```

What's more, what `number` is? It's just a union type of all numbers!

So `Array[number]` and `Tuple[number]` will naturally return the union of all element types!

```ts [twoslash]
const arr = [1, 2, 3]
//    ^?
// ...

type ArrayElements = typeof arr[number]
//   ^?
// ...

// A constant array is a tuple, because it's length and element types are
// fixed.
const tuple = [1, 2, 3] as const
//    ^?
// ...

type TupleElements = typeof tuple[number]
//   ^?
// ...
```

### Conditional Types

Conditional types let you can make decisions based on the type of the input:

```ts [twoslash]
type IsString<T> = T extends string ? true : false

type A = IsString<string>
//   ^?

// ...

type B = IsString<number>
//   ^?
// ...
```

The syntax is quite simple:

```ts
type ConditionalType = SomeType extends OtherType ? TrueType : FalseType
```

#### Distributive Conditional Types

When conditional types act on a generic type, they become distributive when given a union type. For example, take the following:

```ts
type ToArray<Type> = Type extends any ? Type[] : never
```

If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.

```ts [twoslash]
type ToArray<Type> = Type extends any ? Type[] : never

type StrArrOrNumArr = ToArray<string | number>
//   ^?
// ...
```

This is because:

<!-- eslint-skip -->

```ts
type StrArrOrNumArr = ToArray<string | number>
                    // TypeScript will read the definition of `ToArray`
                    // first, so it knows `Type` in `ToArray` is used
                    // lonely, then it expands `ToArray<string | number>` to
                    // `ToArray<string> | ToArray<number>` directly before
                    // destructuring `ToArray`.
                    = ToArray<string> | ToArray<number>
                    = (string extends any ? string[] : never)
                      | (number extends any ? number[] : never)
                    = string[] | number[]
```

If you want to avoid this behavior, you can use tuple type to wrap the type, it does not change the result but makes it non-distributive:

```ts [twoslash]
type ToArray<Type> = [Type] extends [any] ? Type[] : never

type StrArrOrNumArr = ToArray<string | number>
//   ^?
// ...
```

Now:

<!-- eslint-skip -->

```ts
type StrArrOrNumArr = ToArray<string | number>
                    // Now, TypeScript knows `Type` in `ToArray` is in a
                    // tuple, so it will not expand it.
                    = [string | number] extends [any] ? (string | number)[] : never
                    = (string | number)[]
```

### Mapped Types

Mapped types are a way to create new types by transforming properties of existing types, it based on indexed access types and `keyof` operator, and also support conditional types.

For example below, we use [**dynamic property names**](/posts/manual/js-advanced-grammar-manual#dynamic-computed-property-names) with `Key in Union` to iterate through the property keys of the existing type, and use indexed access type to get the value type of that property:

```ts
type MappedType<T> = {
  [Key in keyof T]: T[Key]
}
```

#### Mapping Modifiers

There are two additional modifiers which can be applied during mapping: `readonly` and `?` which affect mutability and optionality respectively.

```ts
type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key] // [!code highlight:1]
}

type Readonly<T> = {
  readonly [Key in keyof T]: T[Key] // [!code highlight:1]
}

type Optional<T> = {
  [Key in keyof T]?: T[Key] // [!code highlight:1]
}

type Required<T> = {
  [Key in keyof T]-?: T[Key] // [!code highlight:1]
}
```

#### Mapping with `as`

In TypeScript 4.1 and onwards, you can mapping with an `as` clause in a mapped type, it can be used to change the property keys.

For example, you can leverage features like string template literal types to create new property keys from prior ones:

```ts [twoslash]
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
}

interface Person {
  name: string
  age: number
  location: string
}

type LazyPerson = Getters<Person>
//   ^?

// ...

// ...

// ...

// ...
```

You can even filter out keys by producing `never` via a conditional type:

```ts [twoslash]
// Remove the 'kind' property
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property]
  //                         ^?
}

interface Circle {
  kind: 'circle'
  radius: number
}

type KindlessCircle = RemoveKindField<Circle>
//   ^?

// ...

// ...

// ...
```

Of course, now you can iterate over arbitrary unions, not just unions of `string | number | symbol`, but unions of any type, and then use `as` to let the property key back to `string | number | symbol`:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E['kind']]: (event: E) => void;
  //    ^?
}

type SquareEvent = { kind: 'square', x: number, y: number }
type CircleEvent = { kind: 'circle', radius: number }

type Config = EventConfig<SquareEvent | CircleEvent>
//   ^?

// ...

// ...
```

### `satisfies` operator

The `satisfies` operator is a type assertion that allows you to check if a type is satisfied another type without change it's original type.

This is very useful.

For an example without `satisfies` operator:

```ts [twoslash]
interface Route { path: string, children?: Routes }
type Routes = Record<string, Route>

const routes: Routes = {
  AUTH: {
    path: '/auth',
  },
}

console.log(routes)
//          ^?
// ...

// No type error, but it's actually not exists in the `routes` object.
console.log(routes.NOT_FOUND)
//                 ^?
// ...
```

With `satisfies` operator:

```ts [twoslash]
// @errors: 2339
interface Route { path: string, children?: Routes }
type Routes = Record<string, Route>
// ---cut---
const routes = {
  AUTH: {
    path: '/auth',
  },
} as const satisfies Routes // We still have the type suggestion/check for the `routes` object.

console.log(routes)
//          ^?
// ...

// ...

// ...

// ...

// And now, TypeScript knows it's not exists in the `routes` object.
console.log(routes.NOT_FOUND)
//                 ^?
// ...
```

### Declaration Merging

Declaration merging is a powerful TypeScript feature that allows you to combine multiple declarations with the same name into a single definition.

This is commonly used in libraries to extend the existing types, but not in standalone module development.

> [!Note]
>
> Excessive declaration merging can increase compilation time and impact IDE performance.

- Interface merging

  Useful when you want to add some extra members to an existing interface.

  ```ts [twoslash]
  interface A {
    x: number
  }
  interface A {
    y: number
  }

  type keyOfA = keyof A & {}
  //   ^?
  // ...
  ```

- Function overloads merging

  Yes, this is also a kind of declaration merging, you already know it.

  ```ts [twoslash]
  // @errors: 2769
  // Function overloads
  function fn(x: number): number
  function fn(x: string): string
  // Implementation that handles all overloads, it's not a overload itself
  function fn(x: number | string): number | string {
    return x
  }

  console.log(fn('hello')) // "HELLO"
  console.log(fn(10)) // 20
  // `true` is not accepted
  console.log(fn(true)) // false
  ```

- Enum merging

  Useful when you want to add some extra members to an existing enum.

  ```ts [twoslash]
  enum A {
    x = 1
  }
  enum A {
    y = 2
  }

  console.log(A.x) // -> 1
  //            ^?
  // ...

  console.log(A.y) // -> 2
  //            ^?
  // ...
  ```

- Class and interface merging

  > [!Caution]
  >
  > This is a dangerous behavior, for example:
  >
  > Hypothesize you have a type `Form` in global scope and you don't know it's existence:
  >
  > ```ts
  > interface Form {
  >   name: string
  > }
  > ```
  >
  > And you create a class `Form` in your new module:
  >
  > ```ts
  > class Form {
  >   id: string
  > }
  > ```
  >
  > When you use `Form` class, you will get in trouble: Why there is always a type suggestion to `name` property? I do not define it at all! 🤨
  >
  > ```ts
  > const form = new Form()
  > console.log(form.name) // -> undefined
  > ```
  >
  > So, just please using `extends` keyword instead. 🙂

  <!-- eslint-disable ts/no-unsafe-declaration-merging -->

  ```ts [twoslash]
  interface A {
    x: number
  }
  class A {
    y: number = 0
  }

  type keyOfA = keyof A & {}
  //   ^?
  // ...

  const instanceOfA = new A()
  console.log(instanceOfA.x) // -> undefined
  //                      ^?
  // ...

  console.log(instanceOfA.y) // -> 0
  //                      ^?
  // ...
  ```

- Namespace merging

  Useful when you want to add some extra exported members to an existing namespace, often be used with other declarations merging.

  ```ts [twoslash]
  namespace A {
    export interface X {
      x: number
    }
  }
  namespace A {
    export interface Y {
      y: number
    }
  }

  type keyOfX = keyof A.X & {}
  //   ^?
  // ...

  type keyOfY = keyof A.Y & {}
  //   ^?
  // ...
  ```

### Built-in Utility Types

TypeScript provides some useful built-in utility types to help you with common tasks.

See [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html) for more details.

## JSDoc

So is there any way to type the JavaScript code?

Yes, JSDoc can do this!

```js
/**
 * @param {number} a
 *   The first number
 * @param {number} b
 *   The second number
 * @returns {number}
 *   The sum of a and b
 */
function add(a, b) {
  return a + b
}
```

See [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) or [W3Schools](https://www.w3schools.com/typescript/typescript_jsdoc.php) for more usage cases.

## Type Challenges

Now, you are a successful TypeScript developer, congratulations! 🎉

Please try to complete the [Type Challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) to test your skills.

Good luck! 😊
