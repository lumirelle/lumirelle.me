---
title: TypeScript Advanced Grammar Manual
date: 2025-11-18T17:16+08:00
update: 2026-02-26T12:36+08:00
lang: en
duration: 35min
type: note
---

[[toc]]

## Introduction

> [!Note]
>
> This manual hypothesizes that you have already read [JavaScript Advanced Grammar Manual](js-advanced-grammar-manual).

TypeScript is a superset of JavaScript that adds static typing to the language.

So adding type support for JavaScript and improving development experience are the main purposes of TypeScript, remember that will help you a lot.

For my own opinion, we should use TypeScript instead raw JavaScript as much as possible, it's a kind of documentation for our codebase, which also improves much the readability and maintainability, helps us to catch errors early.

## Types for Data Type

In TypeScript world, we can use JavaScript data types to define a TypeScript type.

### Primitive

> [!Note]
>
> In the following examples, you can see how we set a type to the variable:
>
> ```
> (const|let|var) <variable_name>: <type> [= <value>]
> ```

TypeScript has the following types to express corresponding JavaScript primitive types:

- `string`:
  ```ts
  const str: string = 'hello'
  ```
- `number`:
  ```ts
  const num: number = 1
  ```
- `bigint`:
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
- `null`:
  ```ts
  const n: null = null
  ```
- `undefined`:
  ```ts
  const u: undefined = undefined
  ```

### Object

In JavaScript, everything except primitive values is object, so TypeScript has a type called `object` to express all non-primitive types:

```ts [twoslash]
const obj: object = {
  //  ^?
  a: 1,
  b: 'hello',
  c: true,
}

const arr: object = [1, 2, 3]
//    ^?

const func: object = function () {
  //  ^?
  console.log('hello')
}
```

## Type Literal

We can also use JavaScript value literals to define a TypeScript type, we call it **type literal**.

<!-- eslint-disable ts/prefer-as-const-->

```ts
const value: 'hello' = 'hello'
```

When we use a JavaScript `const` variable, TypeScript knows it will never be changed, so it can infer the type of the variable to be the literal type of its value:

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
}
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
> You may notice that for objects, the type of properties are not inferred as literal.
>
> This is because, in JavaScript, a `const` variable just means itself cannot be reassigned with other values. For objects, the variable only stores the reference to them, so `const` means the reference inside that variable cannot be changed, but the object itself can still be modified.
>
> You can see, **"TypeScript is a superset of JavaScript that adds static typing to the language"**. All of the behaviors of type should compatible with JavaScript.
>
> To solve this, TypeScript provides `as const` to mark whether the object properties is immutable or mutable, just like [`Object.freeze`](manual-js-advanced-grammar#limiting-access-to-object), but compile-time only, without runtime changes (with more compatibility).
>
> (Array, [tuple](#advanced-working-with-array-and-tuple-type), function are the same, because they are objects under the hood 🙂)

The most commonly used type literals are **string**, **object**, **array** and **function**.

### String Type Literal

String type literal are usually used to express multiple states which cannot expressed by boolean.

For example, to express the state of a traffic light, we should use `string` type literal:

```ts
const trafficLight: 'red' | 'yellow' | 'green' = 'red'
```

You can see we use `|` to join multiple string type literals together, which is called [union](#union-and-intersection-types), string type literal are often used with them, and we will explain it in detail later.

We can even use string template in string type literal, to express more complex string types, it's also widely used in TypeScript:

```ts [twoslash]
type World = 'World'
type Name = 'Alice' | 'Bob'
type Greeting = `Hello ${World}, ${Name}!`
//   ^?
// ...
```

### Object Type Literal

As you imagine, **object type literal** uses [JavaScript object literal syntax](manual-js-advanced-grammar#object) `{ ... }`, without "," as separator:

<!-- eslint-disable ts/method-signature-style -->

```ts
// [!code highlight:7]
const obj: { // <- This is object type literal, no comma here
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

### Array Type Literal / Tuple Type

As you imagine, **array type literal** simply uses [JavaScript array literal syntax](manual-js-advanced-grammar#array) `[ ... ]`:

```ts
const arr: [1, 2, 3] = [1, 2, 3]
```

It has another name called **tuple type** -- An array with limited length and element types.

### Function Type Literal

**Function type literal** uses a syntax similar to arrow functions:

```ts
// [!code highlight:1]
type Func = (a: number, b: number) => number
const func: Func = function (a, b) {
  return a + b
}
```

If the type starts with `new` keyword, it means this function can only be called with `new` keyword:

<!-- eslint-disable no-new-wrappers,ts/no-wrapper-object-types,unicorn/new-for-builtins -->

```ts
type ConstructorFunc = new (a: number, b: number) => Number
const constructorFunc: ConstructorFunc = function (a, b) {
  return new Number(a + b)
}
```

## Union and Intersection Types

As we all know, JavaScript is a dynamic typing language, so one variable is allowed to be assigned to different types of values at different times. As the side effect, when we try to get the value of that variable, the value may be any one of those types too, so we need to check them before using it.

In order to support this behavior, we need **union** and **intersection** types.

### Union Type

Union likes "or", it means **any one of the given types is accepted**. You can use **`|` operator (union operator)** to create it:

```ts [twoslash]
// @errors: 2322
/**
 * `number` or `string` is accepted by variable `a`, but `boolean` not.
 */
let a: number | string = 1
a = 'hello'
a = 5
a = true

/**
 * We need to check the type of `a` before using it, because it may be `number` or `string`.
 */
if (typeof a === 'number') {
  a.toFixed(2)
}
else if (typeof a === 'string') {
  a.toUpperCase()
}
```

Naturally, there is also a type called **"never"**, it means an empty union, which accepts no types:

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

**unknown** is a type that is more strict than `any`, it accepts any types, but forces you to check the type before using it:

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

### Intersection Type

Intersection likes "and", it means **only the type who satisfies all of the given types is accepted**. You can use **`&` operator (intersect operator)** to create it:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
// @errors: 2322
/**
 * `number & string` means a type who satisfies both `number` and `string`
 * is accepted, which is `never`, because there is no type that can satisfy
 * two different primitive types at the same time.
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

We already know, to handle the side effect of dynamic typing under the hood, we need to check the type of variables before using them, one of the common ways is **type narrowing**:

- Conditional statements with `typeof` operator

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

- Conditional statements with `in` operator

  <!-- eslint-disable ts/consistent-type-definitions -->

  ```ts [twoslash]
  type BasicConfig = {
    name?: string
    rules?: Record<string, any>
  }
  /**
   * Only `OverrideConfig` has `files` property
   */
  type OverrideConfig = BasicConfig & {
    files: string[]
  }
  /**
   * Only `Config` has `override` property
   */
  type Config = BasicConfig & {
    override?: OverrideConfig[]
  }

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

- Conditional statements with `instanceof` operator

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

- Conditional statements with some other checks that can help TypeScript to infer the type

  <!-- eslint-disable ts/consistent-type-definitions -->

  ```ts [twoslash]
  /**
   * `Circle` has a `kind` property with string type literal `'circle'`'
   */
  type Circle = {
    kind: 'circle'
    radius: number
  }
  /**
   * `Square` has a `kind` property with string type literal `'square'`'
   */
  type Square = {
    kind: 'square'
    sideLength: number
  }
  type Shape = Circle | Square

  function getArea(shape: Shape) {
    // By checking `kind` property, TypeScript can infer which type `shape` is.
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

- Re-assigning the variable

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

- Using [type guard functions](#type-guard-function)
- Using [type assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) (Not recommended)

### Type Guard Function

Type guard function is a function with conditional statements and some checks that can help TypeScript infer the type of a variable, the return value is a boolean express whether the variable is a specific type.

The return type of type guard function should use a special syntax called **type predicate** `parameterName is Type`:

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

Nothing special in type guard functions, it's just a kind of encapsulation, which can make the type checking logic reusable and more readable.

## Advanced Working with Object Type

### Readonly Property

As we know, we can use `as const` to mark the object as immutable without runtime changes (than `Object.freeze`), this also works on the specific property, but they are different:

```ts [twoslash]
// @errors: 2540 2322
const obj1 = {
  //  ^?
  a: 1,
  b: 'hello',
  c: true,
} as const

// ...

obj1.a = 2

const obj2 = {
  //  ^?
  a: 1 as const,
  b: 'hello',
  c: true,
}

// ...

obj2.a = 2
```

You can see, use `as const` on the entire object will infer the types of properties as literal from their values, also **marks these properties as `readonly`**, which means these properties are not re-assignable, while use `as const` on a specific property not.

`readonly` is a keyword which can only be used in object type literal or [class](#readonly-field). As your imagine, we'd better to use `readonly` keyword with object type literal instead `as const` assertion to mark a specific property immutable:

```ts [twoslash]
// @errors: 2540
const obj: {
  //  ^?
  readonly a: 1
} = {
  a: 1,
}

// ...

obj.a = 2
```

### Optional Property

By default, all properties in object type literal are required, which means they must be provided when creating an object of that type:

```ts [twoslash]
// @errors: 2741
const obj: {
  a: number
} = {
  // We must provide `a` property, because it's required
}
```

To create optional properties, we can use `?` keyword which is expected to be placed right after the property name:

```ts [twoslash]
const obj: {
  a?: number
} = {
  // We can omit `a` property, because it's optional
}
```

### Index Signature

> [!Note]
>
> There is a TypeScript built-in utility type called [`Record`](#built-in-utility-types) which is similar to this syntax, but it supports union type for keys, while this syntax not.
>
> It's recommended to always use `Record` instead of index signature, but you still need to know this syntax.

Sometimes you don’t know all the actually names of a object type literal properties ahead of time, but you do know the shape of these names.

In those cases you can use an index signature to describe these properties:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
// @errors: 2353 1337 7006
type NumberObject = {
  // We give these property names of type `NumberObject` a collective
  // name "index", and we tell TypeScript these names must be `number` type
  [index: number]: string
}
const n1: NumberObject = {
  0: 'a',
  1: 'b',
  2: 'c',
}
// Of course, array is also satisfy this limitation
const n2: NumberObject = [
  'a',
  'b',
  'c',
]
const n3: NumberObject = {
  a: 'a',
  b: 'b',
  c: 'c',
}
```

### Indexed Access on Object Type

See [here](#indexed-access-type).

### Types for JavaScript Built-in Objects

TypeScript has corresponding types to express the JavaScript built-in objects, and they share the same name.

As some objects who are constructor functions can be called with or without `new` keyword with different return types, while others may can only be called without `new` keyword, TypeScript also compatible with these behaviors.

Let's take a look at the built-in type definition of `String` in TypeScript for example:

<!-- eslint-disable no-var, vars-on-top, ts/method-signature-style -->

```ts
// @file: node_modules/typescript/lib/lib.es5.d.ts

// ...

interface String {
  toString(): string
  charAt(pos: number): string

  // ...

  readonly [index: number]: string
}

interface StringConstructor {
  new (value?: any): String
  (value?: any): string

  readonly prototype: String

  // ...
}

declare var String: StringConstructor

// ...
```

## Advanced Working with Array and Tuple Type

### Indexed Access on Array and Tuple Type

See [here](#indexed-access-type).

## Advanced Working with Function Type

In JavaScript, there are three ways to define function: function declaration, function expression and arrow function, and they are all supported in TypeScript with type annotations.

The syntax of typing function declarations looks like other static typing languages:

```ts
// We set parameter types to paramaters themselves, set return type to function.
function fd(a: number, b: number): number {
  return a + b
}
```

For function expression and arrow function, we use [function type literal](#function-type-literal).

### Function Overload

As we know, JavaScript has no function overload, because it's a dynamic typing language, but TypeScript fills this gap.

Function overload let us can know clearly what the arguments and return type a function can accept and return.

To overload a function in TypeScript, the only thing you need to do is to define compatible overload function signatures before the implementation signature:

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

> [!Note]
>
> If any overload signature exists, the implementation signature will be hidden for the user. So TypeScript tell you `fn` in the above example only has two overloads.

What does mean "compatible"? Just look at the below example, the second overload return a `string`, which is not compatible with the implementation: the implementation only allows return `number`.

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

## Interface Type

Interface type is a way to create a named and sharable object type literal, with some [additional features](#additional-feature-for-interface-type), such as [declaration merging](#declaration-merging).

```ts
interface MyInterface {
  a: number
  b: string
  c: boolean
}
```

### Additional Feature for Interface Type

- Extending: Interfaces support [declaration merging](#declaration-merging), which means you can declare an interface with the same name multiple times, and TypeScript will merge them into a single interface.

  ```ts [twoslash]
  // Multiple declarations is allowed, and they will be merged into one.
  interface Animal {
    name: string
  }
  interface Animal {
    walk: () => void
  }

  type Test1 = Animal['name']
  //   ^?

  // ...

  type Test2 = Animal['walk']
  //   ^?

  // ...
  ```

  It also works between interface and class.

  <!-- eslint-disable ts/no-unsafe-declaration-merging -->

  ```ts [twoslash]
  // Declaration merging also works between interface and class
  interface Animal {
    name: string
    walk: () => void
  }
  class Animal {
    /* Empty implementation */
  }

  const animal = new Animal()
  // -> undefined, because it actually not be implemented in `Animal`
  console.log(animal.name)
  //                 ^?

  // ...

  // -> undefined, because it actually not be implemented in `Animal` too
  console.log(animal.walk)
  //                 ^?

  // ...
  ```

  > [!Caution]
  >
  > Use declaration merging between interface and class is not recommended, like the above example, the property `name` is not optional, and in `string` type, but you actually get `undefined`, which is confusing and error-prone.
  >
  > What's worse, we know this is caused by the missing implementation, but there is no way to ensure the merged declarations are implemented, so we should use `implements` keyword instead.

- Implements: Classes can implement interface types. This can solve the problem of missing implementation in declaration merging between interface and class, and also make the code more readable and maintainable.

  ```ts [twoslash]
  // @errors: 2420
  // Class implementing interface type
  interface Interface {
    a: number
    b: string
    c: boolean
    d: () => void
    e: () => void
    f?: number
  }
  class Class implements Interface {
    a: number = 1
    b: string = 'hello'
    c: boolean = true
    d = () => {
      console.log('hello')
    }
  }
  ```

## Advanced Working with Class

TypeScript has some additional features on JavaScript class other than type annotations.

### Readonly Field

Like object types, you can use `readonly` keyword to define a readonly field in class:

```ts [twoslash]
// @errors: 2540
class Person {
  readonly FLAG = 'person'
}

const person: Person = new Person()
person.FLAG = 'human'
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

  Different from other OOP languages, TypeScript allow cross-instance `private` access:

  ```ts [twoslash]
  class A {
    private x = 10

    public sameAs(other: A) {
      // No error while accessing `x` of `other`
      return other.x === this.x
    }
  }
  ```

### Abstract Class

Just like other OOP languages, TypeScript has `interface` and `implements` keywords (We mentioned them [before](#interface-type)).

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

The behavior of abstract class is simply following the OOP principle.

## Generic Type

TypeScript also has generic types to create reusable types, and their usage is similar to other OOP languages with generics.

Generic types are build with **generic parameter** which is surrounded by `<>`, it can be used on types, interfaces, classes and functions:

```ts
// Types
type MyArray<T> = T[]
const a: MyArray<number> = [1, 2, 3]
const b: MyArray<string> = ['a', 'b', 'c']

// Interfaces
interface MyInterface<T> {
  value: T
}
const c: MyInterface<number> = { value: 1 }

// Classes
class MyClass<T> {
  value: T
  constructor(value: T) {
    this.value = value
  }
}
const d: MyClass<number> = new MyClass(1)

// Functions
function add<T>(a: T, b: T): T {
  return a + b
}
```

As you can see, the generic parameters are always **placed right after the symbol name (type name, interface name, class name or function name)**, and they can be used in the type annotations of the members of them.

> [!Note]
>
> For generic class, the generic parameters are only available in the instance scope.

## Decorator

Decorator in is a special function that can be called on **classes**, **class members**, or other JavaScript syntax forms during definition (like annotations in Java).

Now that both [Decorators](https://github.com/tc39/proposal-decorators) and [Decorator Metadata](https://github.com/tc39/proposal-decorator-metadata) have achieved Stage 3 within TC39, you can use them in TypeScript without any configuration.

[Parameter Decorator](https://github.com/tc39/proposal-class-method-parameter-decorators) is still in Stage 1, hope it will be supported in the future.

### Decorator Definition

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

### Using Decorator

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

### Decorator Factory

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

### Class Decorator

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

### Class Method Decorator

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

### Class Field Decorator

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

### Class Getter/Setter Decorator

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

#### Class Auto Accessor Decorator

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

### Class Constructor/Method Parameter Decorator (Out of Support)

> [!Caution]
>
> As [Decorators](https://github.com/tc39/proposal-decorators) has removed the parameter decorator support while archiving Stage 3 within TC39, and new solution [Parameter Decorators](https://github.com/tc39/proposal-class-method-parameter-decorators) is still in Stage 1.
>
> So this section still using [the old Decorators in Stage 2](https://github.com/tc39/proposal-decorators-previous), and it's **incompatible** with new decorators, you'd better not using it in your real codebase.
>
> To run this example, you need:
>
> - Install `reflect-metadata` package:
>
>   ```sh
>   npm i reflect-metadata --save
>   ```
>
> - Enable `experimentalDecorators` in `tsconfig.json` to use the old decorators:
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

Before this, you already know a lot of different types in TypeScript, now you will learn how to manipulate them.

### Type Alias

You may already notice that, we can use `type` keyword to define a custom type (create a type alias), with union, intersection, mapped types and so on:

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

> [!Note]
>
> To get the union of all values of an object type, you can combine `keyof` and [indexed access type](#indexed-access-type), like `ObjectType[keyof ObjectType]`.

### Indexed Access Type

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

So we can even use `number` type to get all elements of an array/tuple, because all of the keys of elements in an array/tuple are captured by `number` type:

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

### Conditional Type

Conditional types let you can make decisions based on the type of the input, it often used with generic types:

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

#### Distributive Conditional Type

When the generic parameter is given a union type, it will be distributed. This is a prescribed special behavior.

For example, take the following:

```ts
type ToArray<Type> = Type extends any ? Type[] : never
```

If we plug a union type into `ToArray`, then the conditional type will be applied to each member of that union.

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
                    // directly, when `Type` is given as `string | number`,
                    // TypeScript will expands the entire type to
                    // `ToArray<string> | ToArray<number>` before
                    // destructuring `ToArray`.
                    = ToArray<string> | ToArray<number>
                    = (string extends any ? string[] : never)
                      | (number extends any ? number[] : never)
                    = string[] | number[]
```

If you want to avoid this behavior, you can use tuple type to wrap the generic parameter and the comparasion type, this does not change the result but makes it non-distributive:

```ts [twoslash]
type ToArray<Type> = [Type] extends [any] ? Type[] : never

type StrArrOrNumArr = ToArray<string | number>
//   ^?
// ...
```

This is because:

<!-- eslint-skip -->

```ts
type StrArrOrNumArr = ToArray<string | number>
                    // Now, TypeScript knows `Type` in `ToArray` is in a
                    // tuple, not used directly, so it will not expand it.
                    = [string | number] extends [any] ? (string | number)[] : never
                    = (string | number)[]
```

### Mapped Type

Mapped type is a way to create a new object type by transforming properties of existing object types, it based on object type, [**dynamic property names**](manual-js-advanced-grammar#dynamic-computed-property-names), [union type](#union-type) and `in` operator (to interator a union type), and also support [conditional types](#conditional-type).

For example below, we use dynamic property names with `Key in Union` to iterate through the union of keys of the existing object type `T`, and use indexed access type `T[Key]` to get the value type of that property:

```ts
type MappedType<T> = {
  [Key in keyof T]: T[Key]
}
```

Of course, we can iterate any arbitrary union type, and set the property value to any type we want:

```ts
type MappedType<T> = {
  [Key in 'a' | 'b' | 'c']: number
}
```

#### Mapping Modifier

Of course, the mapped type is built on top of object type, so there are two familiar modifiers which can be applied during mapping: `readonly` and `?`.

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

#### Mapping with `as` Operator

In TypeScript 4.1 and onwards, you can mapping with an `as` clause in a mapped type, it can be used to change/filter the property keys.

For example, you can leverage features like string template literal types to transform to new property keys from prior ones:

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

A example of advanced usage:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type EventConfig<Events extends { kind: string }> = {
  // `Events` is a union type, we can iterate it,
  // then pick the `kind` property of each element,
  // using `as` operator
  [E in Events as E['kind']]: (event: E) => void;
}

type SquareEvent = { kind: 'square', x: number, y: number }
type CircleEvent = { kind: 'circle', radius: number }

type Config = EventConfig<SquareEvent | CircleEvent>
//   ^?

// ...

// ...

// ...
```

### `satisfies` Operator

The `satisfies` operator is a type assertion that allows you to check if a type is satisfied another type **without change it's original type**.

This is very useful when we need to check the type of an immutable object, but we don't want to lose its literal type.

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
  // We still have the type suggestion/check for the `routes` object.
} as const satisfies Routes

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

**This is commonly used in libraries to extend the existing types, but not in standalone module development.**

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
  function fn(x: number): number
  function fn(x: string): string
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
  > This is not recommended, we already explained this [before](#additional-feature-for-interface-type).

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

```

```
