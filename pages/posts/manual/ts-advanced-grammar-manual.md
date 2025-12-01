---
title: TypeScript Advanced Grammar Manual
date: 2025-11-18T17:16+08:00
update: 2025-11-25T10:30+08:00
lang: en
duration: 28min
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
```

And, there is also a type called **"any"**, it accepts any types:

```ts
const a: any = 1
const b: any = 'hello'
```

**unknown** is a type that is more strict than `any`, it accepts any types, but
you can't do anything with it, you need to check the type first:

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

### Type Narrowing

When you want to implement some logic based on the union types, you need to
narrow the type first, then implement the type-specific logic.

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

- ...and some other checks with conditional statements can help TypeScript to
  infer the type of the variable

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
- Using
  [type assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) (Not recommended)

### Type Guards

As the most important thing in TypeScript, type guards are a way to check the
type of a variable at runtime.

For example:

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

A function with return type of `x is Type` is a type guard function, it can be
used to narrow the type of the variable.

## Object Types

### Object Type Literal

We know that everything except primitive values is object in JavaScript, so it's
important to know how to define an object type in TypeScript.

Instead of using `object` type directly, you can use `{}` syntax to define an
more clear object type, we call it **object type literal**:

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

Sometimes you don’t know all the names of a type’s properties ahead of time, but
you do know the shape of the values.

In those cases you can use an index signature to describe the types of possible
values, for example:

```ts [twoslash]
// `number` index signature
interface NumberObject {
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
interface StringObject {
  [index: string]: string
}
const s: StringObject = {
  a: 'a',
  b: 'b',
  c: 'c',
}
```

## Interface Types

Interface is a better way to define a custom
[object type literal](#object-type-literal), which are more intuitive and easier
to understand.

`type` vs. `interface`:

- Extending: Both can be extended, but interfaces support
  [declaration merging](#declaration-merging).
- Unions/Intersections: Only type aliases support union and intersection types.
- Implements: Classes can implement either.
- Recommendation: Use interface for objects, type for everything else.

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

> [!Note]
>
> Sometimes, when you want to accept some class constructor function that
> produces an instance of a class which derives from some interface/abstract class, you
> should use **constructor signature** to define the type:
>
> ❌ Use the type directly:
>
> ```ts [twoslash]
> // @errors: 2391 2351
> interface Animal {
>   makeSound: () => void
> }
> function greetAnimal(constructor: Animal) {
>   const instance = new constructor()
>   instance.makeSound()
> }
> ```
>
> ✔️ Use the constructor signature:
>
> ```ts [twoslash]
> interface Animal {
>   makeSound: () => void
> }
> function greetAnimal(constructor: new (...args: any[]) => Animal) {
>   const instance = new constructor()
>   instance.makeSound()
> }
> ```

## Array and Tuple Types

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
const tuple1: [number, number] = [0.5, 7.8]
// You can also provide the names of the elements, for better information
const tuple2: [x: number, y: number] = [0.5, 7.8]
```

That's all about them. So let's talk about something digressive. 😏

As we all know, array is a kind of object in JavaScript, and there is also a
term called "array-like object" to describe an object that has a `length`
property and indexed elements:

```ts
interface ArrayLike {
  [index: number]: any
  length: number
}
```

So that, you can even assign a array value to a variable with the `object` or `ArrayLike` type
directly:

```ts
const arr1: object = ['a', 'b', 'c']
const arr2: ArrayLike = ['a', 'b', 'c']
```

Nothing magic!

## Function Types

In TypeScript, there are two ways to define function types:
**function declaration** and **function type literal**.

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

Like array, function is also a kind of object in JavaScript, and there is also a
term called "function like object" to describe an object that can be called:

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

So that we can assign a function to a variable with `object` or function-like
type directly:

- Function Like:

  ```ts [twoslash]
  // @errors: 7009
  interface SymbolConstructor {
    (description?: string | number): symbol
  }
  const SymbolConstructor: SymbolConstructor = function (
    description?: string | number
  ): symbol {
    return Symbol(description)
  }

  const symbol1 = SymbolConstructor('symbol')
  //    ^?
  // ...

  const symbol2 = new SymbolConstructor('symbol')
  ```

- Constructor Like:

  ```ts [twoslash]
  // @errors: 2348
  interface DateConstructor {
    new (value: string | number | Date): Date
  }
  const DateConstructor: DateConstructor = function (
    value: string | number | Date
  ): Date {
    return new Date(value)
  } as any
  const date1 = DateConstructor('2025-11-24')

  const date2 = new DateConstructor('2025-11-24')
  //    ^?
  // ...
  ```

- Both Constructor and Function Like:

  <!-- eslint-disable no-var, no-new-wrappers, ts/no-wrapper-object-types, unicorn/new-for-builtins -->

  ```ts [twoslash]
  interface NumberConstructor {
    <T extends number>(value: T): T
    new<T extends number>(value: T): Number
  }
  // We declare this constructor function with type `NumberConstructor`
  const NumberConstructor: NumberConstructor = function <T extends number>(
    value: T
  ): number | Number {
    if (new.target) {
      return new Number(value)
    }
    else {
      return value
    }
    // We cannot create a function that satisfies `NumberConstructor` type
    // directly, so we use `as any` to bypass the type check.
  } as any

  const number1 = NumberConstructor(1)
  //    ^?
  // ...

  const number2 = new NumberConstructor(1)
  //    ^?
  // ...
  ```

### Function Overloading

Function overloading is a way to define multiple function signatures for the
same function, the only thing you need to do is to define the function
signatures together, and put the implementation after them:

```ts [twoslash]
function fn(x: number, y: number): number
function fn(xy: string): number
function fn(x: string | number, y: number = 0): number {
  if (typeof x === 'string') {
    return +x
  }
  else {
    return x + y
  }
}
```

Notice that, the overload function signatures should compatible with the
implementation, or you will get an error:

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

## String Template Literal Type

String template literal types build on string literal, and have the ability to
expand into many strings via unions:

```ts [twoslash]
type World = 'World'
type Name = 'Alice' | 'Bob'
type Greeting = `Hello ${World}, ${Name}!`
//   ^?
// ...
```

## Generic Types

Just like other OOP languages with generics, TypeScript has generic types to
create reusable types, and their usage is similar.

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

In TypeScript, you can define the type of class members, like fields,
constructor parameters, method parameters, method return:

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
> Generic parameters should placed [in the class declaration](#generic-classes),
> while the return type of constructor is implicit to the class itself.

### Readonly Fields

Like object types, you can use `readonly` keyword to define a readonly field in
class:

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

TypeScript add three visibility modifiers to class members: `public`,
`protected` and `private`:

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

Classes, much like interfaces, can be generic, and the generic parameters can
only be used in **instance scope**:

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

Just like other OOP languages, TypeScript has `interface` and `implements`
keywords (We mentioned them [before](#interface-types)).

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

> [!Note]
>
> Sometimes, when you want to accept some class constructor function that
> produces an instance of a class which derives from some interface/abstract class, you
> should use **constructor signature** to define the type:
>
> ❌ Use the type directly:
>
> ```ts [twoslash]
> // @errors: 2391 2351
> abstract class Mammal {
>   abstract makeSound(): void
> }
> function greetMammal(constructor: Mammal) {
>   const instance = new constructor()
>   instance.makeSound()
> }
> ```
>
> ✔️ Use the constructor signature:
>
> ```ts [twoslash]
> abstract class Mammal {
>   abstract makeSound(): void
> }
> function greetMammal(constructor: new (...args: any[]) => Mammal) {
>   const instance = new constructor()
>   instance.makeSound()
> }
> ```

## Decorators

Decorators provide a way to add both annotations and a meta-programming syntax
for class declarations and members (Like annotations in Java).

To enable experimental support for decorators, you must enable the
`experimentalDecorators` compiler option (typescript@^5.0.0):

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

A Decorator is a special function that can be attached to a
**class declaration**, **method**, **accessor**, **property**, or **parameter**.

Decorators use the form `@expression`, where `expression` must evaluate to a
function that will be called at runtime with information about the decorated
declaration.

For example:

```ts
function logClass(constructor: new (...args: any[]) => any) {
  console.log(`Class ${constructor.name} was defined at ${new Date().toISOString()}`)
}

@logClass
class UserService {
  getUsers() {
    return ['Alice', 'Bob', 'Charlie']
  }
}

// When the code is loaded, the `logClass` function will be called with the
// `UserService` class constructor
```

### Decorator Factories

A decorator factory is a function that returns a decorator.

```ts
function logMethod(message: string) {
  return function (constructor: new (...args: any[]) => any) { // [!code highlight:3]
    console.log(message)
  }
}

@logMethod('Method getUsers was called')
class UserService {
  getUsers() {
    return ['Alice', 'Bob', 'Charlie']
  }
}
```

### Class Decorators

The class decorator is applied to the constructor of the class and can be used
to observe, modify, or replace a class definition.

```ts
// [!code highlight:4]
function sealed(constructor: new (...args: any[]) => any) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
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

// [!code highlight:1]
BugReport.prototype.newMethod = function () {}
```

### Method Decorators

The method decorator is applied to the property descriptor for the method, and
can be used to observe, modify, or replace a method definition.

```ts
// [!code highlight:11]
function measureTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    const start = performance.now()
    const result = originalMethod.apply(this, args)
    const end = performance.now()
    console.info(`${propertyKey} executed in ${(end - start).toFixed(2)}ms`)
    return result
  }
  return descriptor
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
processor.processData([1, 2, 3, 4, 5])
```

### Property Decorators

The property decorator is applied to the property of the class, and can be used
to observe, modify, or replace a property definition.

We can use metadata to record information about the property, as in the
following example:

```ts
import 'reflect-metadata'

// [!code highlight:7]
const formatMetadataKey = Symbol('format')
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString)
}
function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey)
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
    const formatString = getFormat(this, 'greeting')
    return formatString.replace('%s', this.greeting)
  }
}
```

### Constructor/Method Parameter Decorators

The parameter decorator is applied to the function for a class constructor or
method declaration.

```ts
import 'reflect-metadata'

// [!code highlight:33]
const requiredMetadataKey = Symbol('required')
function required(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  const requiredParameters: number[]
    = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) ?? []
  requiredParameters.push(parameterIndex)
  Reflect.defineMetadata(
    requiredMetadataKey,
    requiredParameters,
    target,
    propertyKey
  )
}
function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
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
```

### Metadata

Some examples use the `reflect-metadata` library which adds a polyfill for an
experimental metadata API. This library is not yet part of the ECMAScript
(JavaScript) standard. However, once decorators are officially adopted as part
of the ECMAScript standard, these extensions will be proposed for adoption.

Before that, you need to install this library via npm:

```sh
npm i reflect-metadata --save
```

## JSDoc

See [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) or [W3Schools](https://www.w3schools.com/typescript/typescript_jsdoc.php) for more examples.

## Custom Types

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

Then use them in your code:

```ts [twoslash]
// @errors: 2322
type NumberOrString = number | string
// ---cut---
let numOrString: NumberOrString = 1
numOrString = 'hello'
numOrString = true
```

This is very important in TypeScript, through it, you can create your own
utility types, for better type development, like:

```ts
type Nullable<T> = T | null | undefined

// Before:
const a1: number | null | undefined = 1

// After:
const a2: Nullable<number> = 1
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

### `typeof` Operator

The `typeof` operator is used to get the type of a variable:

```ts [twoslash]
const a: number = 1
type A = typeof a
//   ^?
// ...
```

TypeScript intentionally limits the sorts of expressions you can use typeof on.
Specifically, it’s only legal to use typeof on identifiers, but not expressions:

<!-- eslint-skip -->

```ts [twoslash]
// @errors: 1005
// Meant to use = ReturnType<typeof alert>
let shouldContinue: typeof alert("Are you sure you want to continue?");
```

### Indexed Access Types

We can use an indexed access type to look up a specific property on another
type:

<!-- eslint-disable ts/consistent-type-definitions -->

```ts [twoslash]
type Person = { age: number, name: string, alive: boolean }
type Age = Person['age']
//   ^?
// ...
```

The indexing type is itself a type, so we can use unions, keyof, or other types
entirely:

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

The syntax is:

```
SomeType extends OtherType ? TrueType : FalseType
```

#### Distributive Conditional Types

When conditional types act on a generic type, they become distributive when
given a union type. For example, take the following:

```ts
type ToArray<Type> = Type extends any ? Type[] : never
```

If we plug a union type into ToArray, then the conditional type will be applied
to each member of that union.

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
                    = ToArray<string> | ToArray<number>
                    = (string extends any ? string[] : never)
                      | (number extends any ? number[] : never)
                    = string[] | number[]
```

If you want to avoid this behavior, you can use tuple type to wrap the type, it
does not change the result but makes it non-distributive:

```ts [twoslash]
type ToArray<Type> = [Type] extends [any] ? Type[] : never

type StrArrOrNumArr = ToArray<string | number>
//   ^?
// ...
```

### Mapped Types

Mapped types are a way to create new types by transforming properties of
existing types.

For example below, we use
[**dynamic property names**](/posts/manual/js-advanced-grammar-manual#dynamic-computed-property-names)
to get the names of the properties of the existing type, use indexed access type to get the type
of the property.

```ts
type MappedType<T> = {
  [Key in keyof T]: T[Key]
}
```

#### Mapping Modifiers

There are two additional modifiers which can be applied during mapping:
`readonly` and `?` which affect mutability and optionality respectively.

```ts
type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}

type Readonly<T> = {
  readonly [Key in keyof T]: T[Key]
}

type Optional<T> = {
  [Key in keyof T]?: T[Key]
}

type Required<T> = {
  [Key in keyof T]-?: T[Key]
}
```

#### Key Remapping via `as`

In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an `as`
clause in a mapped type.

You can leverage features like **template literal types** to create new property
names from prior ones:

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

You can filter out keys by producing never via a conditional type:

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

You can map over arbitrary unions, not just unions of
`string | number | symbol`, but unions of any type:

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

### Declaration Merging

Declaration merging is a powerful TypeScript feature that allows you to combine
multiple declarations with the same name into a single definition.

> [!Note]
>
> Excessive declaration merging can increase compilation time and impact IDE
> performance.

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

  Useful when overload an existing function.

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

  **Dangerous**, use inheritance instead.

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

  Useful when you want to add some extra exported members to an existing
  namespace, often be used with other declarations merging.

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

## Built-in Utility Types

See [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)
for more details.

## Type Challenges

Now, please try to complete the [Type Challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md).
