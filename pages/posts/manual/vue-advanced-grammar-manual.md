---
title: Vue Advanced Grammar Manual
date: 2026-01-28T11:47+08:00
update: 2026-01-28T11:47+08:00
lang: en
duration: na
type: note
---

[[toc]]

> [!Note]
>
> This manual expects you have basic knowledge of Vue.js.
>
> This manual are mainly talking about Vue 3.x, Vue 2.x will only be mentioned when comparing the differences.
>
> What's more, the `Vue 2.x` we mentioned here means the latest version of Vue 2.x, but without any Vue 3.x backport features. For example, the Composition API. Because those backport features let Vue 2.x can behave just like Vue 3.x in many aspects, we consider them as a variant of Vue 3.x versions.

## Introduction to Vue.js

Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable, which means you can use as much or as little of Vue.js as you need.

The key features of Vue.js include:

- Progressive: Vue.js applications only take over a root element from the existing HTML page, all the APIs are exposed from the global `Vue` variable or the default export of the `vue` package, with less invasion to the existing codebase.
- Component-based architecture: Vue.js allows you to create reusable components that can be composed to build complex user interfaces.
- Declarative rendering: Vue.js uses a template syntax to build component content that allows you to declaratively render data to the DOM.
- Reactivity system: Vue.js has a powerful reactivity system that automatically updates the DOM when the underlying data changes.
- Ecosystem: Vue.js has a rich ecosystem of libraries and tools that can help you build applications more efficiently.
- Performance: Vue.js use a virtual DOM and optimized rendering algorithms to ensure high performance. In the future, Vue.js will also support "Vapor Mode" for static content to further improve performance.
- ...

> [!Note]
>
> Memorize and understand these feature introductions can help you know what Vue.js is, what it can do, and **how it works**.

## Create Vue Application in a Native Way

Why we say Vue.js is a progressive framework? This point can be fond in the way of creating a Vue application.

Just imagine that, one day, you want to use Vue.js to implement the future requests for your existing native HTML + JavaScript + CSS project, how to do that? How could we create a Vue application in a native way?

1. First step, include Vue.js library in the new page:

_src/new-page.html_

```html
<html>
  <head>
    <!-- ... -->
    // [!code highlight:1]
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

2. Second step, create a Vue application with the root component and let Vue take over the `#app` element. In the future, it will manage all the content inside that element for you base on the reactive data and the component logic:

_src/new-page.html_

```html
<html>
  <head>
    <!-- ... -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
    // [!code highlight:26]
    <!-- The root element for the Vue application -->
    <div id="app"></div>
    <!-- Create and mount the Vue application -->
    <script>
      const { createApp, ref, defineComponent } = Vue

      // Define the root component
      const rootComponent = defineComponent({
        setup() {
          const message = ref('Hello, Vue!')
          return {
            message,
          }
        },
        template: `
        <div>
          {{ message }}
          <button @click="message = 'You clicked the button!'">
            Click Me
          </button>
        </div>
      `,
      })

      createApp(rootComponent).mount('#app')
    </script>
  </body>
</html>
```

3. (Optional) Third step, if you want to use other components, you can define them in a separate JavaScript file and use them in the template of root component:

_src/OtherComponent.js_

```js
// Use IIFE to avoid polluting the global namespace
const OtherComponent = (() => {
  const { defineComponent, ref } = Vue
  return defineComponent({
    setup() {
      const count = ref(0)
      function increment() {
        count.value++
      }
      return {
        count,
        increment,
      }
    },
    template: `
      <div>
        <p>Count: {{ count }}</p>
        <button @click="increment">
          Increment
        </button>
      </div>
    `,
  })
})()
```

_src/new-page.html_

```html
<html>
  <head>
    <!-- ... -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script src="./OtherComponent.js"></script>
    <script>
      const { createApp, ref, defineComponent } = Vue

      const rootComponent = defineComponent({
        setup() {
          const message = ref('Hello, Vue!')
          return {
            message,
          }
        },
        template: `
        <div>
          {{ message }}
          <button @click="message = 'You clicked the button!'">
            Click Me
          </button>
          // [!code highlight:1]
          <OtherComponent />
        </div>
      `,
      })

      const app = createApp(rootComponent)

      // [!code highlight:2]
      // Register the other component globally
      app.component('OtherComponent', OtherComponent)

      app.mount('#app')
    </script>
  </body>
</html>
```

These few steps show us the key usage of Vue.js:

- Choose a root element, create a Vue application on that element with a root Vue component, this forms a single-page application (SPA). Vue will manage all the content inside that element based on the template, reactive data and other logic of that root component.
- A bunch of Vue components can be used by that root component, they composed to build the whole application together.
- All things we do in Vue.js are targeting the DOM rendering, reactive data management and other component logic.

## Vue Component

You may already know that components looks like the most basic building blocks in Vue.js applications: The Vue application are built on top of these components.

So what is a Vue component?

In fact, a Vue component is just a special kind of JavaScript object, which contains some Vue specific options and logic to describe how that component should behave. Vue will use these information to create and manage the corresponding DOM elements.

In the real applications, components are usually structured in a tree-like way, just like the DOM tree.

> [!Note]
>
> Vue components can also works together with the Web Components.

### Defining a Component

You may already know how to define a basic Vue component in JavaScript object syntax:

```js
// `defineComponent` is a helper function to provide better type inference
// in TypeScript, it has no logical difference with using a plain JavaScript
// object.
const MyComponent = defineComponent({
  setup() {
    // ...
  },
  template: `
    <div>
      <!-- ... -->
    </div>
  `,
  // ...
})
```

But when we are using build steps (like Vite, Webpack, etc. with Vue SFC Compiler), the most common way to define a Vue component is defining it in a single file with `.vue` extension, called Single File Component (SFC). The syntax looks more different, but the underlying logic is the same:

They will be compiled to the same JavaScript object syntax by Vue SFC Compiler.

> [!Note]
>
> Of course, these code will executed in the standlone JavaScript runtime like Node.js or Bun with ESM support, so we can use `import` and `export` syntax there without worrying about browser compatibility.

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentSFC.vue_

```vue
<script setup>
// [!code highlight:6]
import { ref } from 'vue'

const count = ref(0)
function increment() {
  count.value++
}
</script>

<template>
  // [!code highlight:6]
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">
      Increment
    </button>
  </div>
</template>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

<!-- eslint-skip-->

```js
import { defineComponent } from 'vue'
// [!code highlight:1]
import { ref } from 'vue'

export default defineComponent({
  setup() {
    // [!code highlight:11]
    const count = ref(0)
    function increment() {
      count.value++
    }
    return {
      // Notice that, the imported symbols will
      // be returned here automatically
      ref,
      count,
      increment,
    }
  },
  template: `
    // [!code highlight:6]
    <div>
      <p>Count: {{ count }}</p>
      <button @click="increment">
        Increment
      </button>
    </div>
  `,
})
```

</td></tr></tbody></table>

These two kinds of component definitions are equivalent.

> [!Note]
>
> For simplicity, we will use SFC syntax in the following examples, unless otherwise specified.

### Using a Component

You can use a component inside another component by importing it and referencing it in the template, just like what we did before:

_src/ParentComponent.vue_

```vue
<script setup>
import ChildComponentJS from './ChildComponent.js'
import ChildComponentVue from './ChildComponent.vue'
</script>

<template>
  <div>
    <h1>Parent Component</h1>
    <ChildComponentJS />
    <ChildComponentVue />
  </div>
</template>
```

> [!Note]
>
> When you use a component, you can use either PascalCase or kebab-case for its name in the template. For example, `<ChildComponent />` and `<child-component />` are both valid for `ChildComponent`.
>
> It's recommended to use PascalCase in common cases for better readability, and kebab-case in in-DOM templates for better compatibility with HTML behavior (HTML is case-insensitive). (BTW, until now, I haven't met any real case using in-DOM templates...)

### Register a Component

We already know how to register a component globally in the Vue application instance:

```js
const app = createApp(rootComponent)

// Register the other component globally
app.component('OtherComponent', OtherComponent)

app.mount('#app')
```

After that, any component in that Vue application can use `OtherComponent` without importing it manually.

We may talk about how to use components locally later.

> [!Note]
>
> Private components who are not intended to be reused globally are not recommended to register globally. The only reason is to avoid manually maintaining the large global registration list with many one-time-use components, this costs more and saves less.
>
> But when you are using frameworks like Nuxt.js, all components in the `components/` directory are automatically registered globally. In this case, you can still use auto-importing features, and use folder structure to organize both public and private components.
>
> For example, you can create a `module-xxx/` sub-directory to store private components for "module xxx", when you use them, you can simply add the corresponding prefix to their names.
>
> Some people like to hold these private components in a sub-directory named `components/` inside each module directory, like `pages/home/components/`. I don't like this way, it makes the project structure complex and hard to navigate. A simple example in this case is:
>
> ```txt
> src/
> ├── pages/
> │   ├── home/
> │   │   ├── components/ Components for Home page
> │   │       ├── Header.vue
> │   │
> │   ├── dashboard/
> │   │   ├── components/ Components for Dashboard page
> │   │   │   ├── Header.vue
> │   │   │
> │   │   ├── profile/
> │   │   │   ├── components/ Components for Profile page
> │   │   │       ├── Header.vue
> │   │   │
> │   │   ├── settings/
> │   │       ├── components/ Components for Settings page
> │   │           ├── Header.vue
> │   │
> │   ├── about/
> │   │   ├── components/ Components for About page
> │   │       ├── Header.vue
> ```
>
> And a better way is:
>
> ```txt
> src/
> ├── components/ Public reusable components
> │   ├── home/
> │   │   ├── Header.vue
> │   │
> │   ├── dashboard/
> │   │   ├── profile/
> │   │   │   ├── Header.vue
> │   │   │
> │   │   ├── settings/
> │   │   │   ├── Header.vue
> │   │   │
> │   │   ├── Header.vue
> │   │
> │   ├── about/
> │       ├── Header.vue
> │
> ├── pages/
> │   ├── home/index.vue
> │   │
> │   ├── dashboard/
> │   │   ├── profile/index.vue
> │   │   │
> │   │   ├── settings/index.vue
> │   │
> │   ├── about/index.vue
> ```

### Two Ways to Define Props

We already know we can define props for a component by macro `defineProps` in Vue 3 or option `props` in Vue 2.:

_src/Vue3Component.vue_

```vue
<script setup>
defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
  },
})
</script>
```

_src/Vue2Component.vue_

```js
export default {
  props: {
    title: String,
    count: {
      type: Number,
      default: 0,
    },
  },
}
```

These two example will both create two props called `title` and `count`. `title` is an optional string prop, and `count` is an optional number prop with a default value of `0`. Vue will [validate the types of these props in runtime (development mode)](#props-and-events-with-validation). They are the same way in different syntax.

A better way to define props is using TypeScript interfaces, Vue will generate the equivalent prop validation automatically:

```vue
<script setup lang="ts">
interface Props {
  title: string // required
  count?: number
}
defineProps<Props>()
</script>
```

This way is more concise and meaningful: use right tools to do right things, use TypeScript to do type checking!

Something you should notice is that TypeScript interfaces syntax has some limitations:

- You can only use one way to define props in one component, either using object syntax or using TypeScript interfaces syntax.
- Before Vue 3.3, the common way to assign default values to the props defined with TypeScript interfaces is using another macro helper called `withDefaults`:

  ```vue
  <script setup lang="ts">
  interface Props {
    title: string // required
    count?: number
  }
  const props = withDefaults(
    defineProps<Props>(),
    {
      count: 0,
    }
  )
  </script>
  ```

  This may look a bit annoying.

- After Vue 3.3, you can use destructuring assignment with default values, **without lossing reactivity**:

  ```vue
  <script setup lang="ts">
  interface Props {
    title: string // required
    count?: number
  }
  const {
    count = 0
  } = defineProps<Props>()
  console.log(count)
  </script>
  ```

  // ...

### Props and Events with Validation

The validation of props and events are documentation for that component, it's important for users to understand how to use that component correctly.

To validate props & events in Vue components, we can use the `defineProps` and `defineEmits` compiler macros.

```vue
<script setup>
defineProps({
  // A required string prop, the TypeScript type is `string`
  title: {
    type: String,
    required: true,
  },
  // An optional string prop, the TypeScript type is `string | undefined`
  description: String,
  // An optional boolean prop, the TypeScript type is `boolean`
  isActive: Boolean,
  // An optional number prop with a default value, the TypeScript type is `number`
  count: {
    type: Number,
    default: 0,
  },
  // An optional prop with custom validator, the TypeScript type is `string | undefined`
  status: {
    type: String,
    validator: (value) => {
      return ['active', 'inactive', 'pending'].includes(value)
    },
  },
})

defineEmits({
  // An event without payload
  close: null,
  // An event with a string payload, and returns a boolean to indicate whether the event is handled
  submit: (data: string) => boolean,
})
```

A better way is to use TypeScript interfaces to define the props, Vue will generate the equivalent prop validation automatically:

<!-- eslint-skip-->

```vue
<script setup lang="ts">
interface Props {
  title: string // required
  description?: string
  isActive?: boolean
  count?: number
  status?: 'active' | 'inactive' | 'pending' // Vue will generate the equivalent validator automatically
}
const { count = 0 } = defineProps<Props>()

// Legacy syntax
defineEmits<{
  close: void
  submit: (data: string) => boolean
}>()
// Vue 3.3+, a shorter syntax
defineEmits<{
  close: void
  submit: [data: string] // Named tuple syntax
}>()
</script>
```

All the validation are available in development mode only. In production mode, the compiler will omit all extra information to the simplest form for less bundle size. The example above will be compiled to:

```js
defineProps(['title', 'description', 'isActive', 'count', 'status'])
defineEmits(['close', 'submit'])
```

### CSS Modules

## Template Grammar

Vue.js uses a template syntax that is similar to HTML, but with additional features for directives, data binding, and more.

### Directives

See all Vue Directives in the [official documentation](https://vuejs.org/api/built-in-directives.html).

#### `v-for` Directive

To render a list of items from, you can use `v-for` directive in the following syntax:

<!-- eslint-skip-->

```vue
<script setup>
import { ref } from 'vue'

const array = ref(['A', 'B', 'C'])
const object = ref({ key1: 'value1', key2: 'value2' })
</script>

<template>
  <div>
    <!-- 1..10 -->
    <div v-for="n in 10" />

    <!-- Iterate over an array -->
    <div v-for="item in array" />
    <div v-for="(item, index) in array" />
    <!-- Iterate over an object -->
    <div v-for="(value, key) in object" />
    <div v-for="(value, key, index) in object" />
  </div>
</template>
```

By default, `v-for` uses the strategy of "in-place patch" when updating the elements, for example:

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])
</script>

<template>
  <div>
    <div v-for="(item, index) in items">
      {{ item }}
    </div>
    <!-- This will update all of the elements -->
    <!-- The first: A -> X -->
    <!-- The second: B -> A -->
    <!-- The third: C -> B -->
    <!-- A new element created: C -->
    <button @click="items.unshift('X')">
      Add X at the beginning
    </button>
  </div>
</template>
```

To avoid this, you should provide a unique `key` attribute for each item, so that Vue can track each element properly, which may help to improve performance and avoid unnecessary re-renders:

```vue
<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])
</script>

<template>
  <div>
    <div v-for="item in items" :key="item">
      {{ item }}
    </div>
    <!-- This will only create a new element for X -->
    <!-- Then sort the existing elements -->
    <button @click="items.unshift('X')">
      Add X at the beginning
    </button>
  </div>
</template>
```

#### `v-on` Directive

The `v-on` directive is used to listen to DOM events and execute some JavaScript when they are triggered. You can use it in the following ways:

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const eventName = ref('click')
function handleClick() {
  console.log('Button clicked!')
}
function handleTouch() {
  console.log('Button touched!')
}
function handleEvent() {
  console.log(`Event ${eventName.value} triggered!`)
}
</script>

<template>
  <div>
    <!-- Event handler function -->
    <button v-on:click="handleClick">Click me</button>
    <!-- Inline handler -->
    <button v-on:click="count += 1">Click me</button>
    <!-- Dynamic event -->
    <button v-on:[eventName]="handleEvent">Click me</button>
    <!-- Object syntax, listen multiple events at once -->
    <!-- Useful to reduce the repetition of `v-on` -->
    <button v-on="{ click: handleClick, touch: handleTouch }">Click me</button>

    <!-- Shorthand syntax -->
    <button @click="handleClick">Click me</button>
    <button @click="count += 1">Click me</button>
    <button @[eventName]="handleEvent">Click me</button>
    </button @="{ click: handleClick, touch: handleTouch }">Click me</button>
  </div>
</template>
```

It supports many event modifiers:

- `.stop` - calls `event.stopPropagation()`
- `.prevent` - calls `event.preventDefault()`
- `.capture` - adds the event listener in capture mode
- `.self` - only triggers if the event target is the element itself
- `.once` - the event will be triggered at most once
- `.passive` - indicates that the function will never call `preventDefault()`
- `.left` - listens for the left mouse button click
- `.middle` - listens for the middle mouse button click
- `.right` - listens for the right mouse button click
- `.{key}` - listens for specific keyboard keys (See [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/UI_Events/Keyboard_event_key_values) and [Vue documentation](https://vuejs.org/guide/essentials/event-handling.html#key-modifiers) for more details. Notice, the key name should transform to kebab-case).

#### `v-bind` Directive

The `v-bind` directive is used to bind HTML attributes to data in the Vue instance. When the data changes, the attributes will be updated accordingly.

This is a single-way binding from data to the attribute, which means changes to the attribute in the DOM will not affect the data in the Vue instance.

You can use it in the following ways:

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const imageUrl = ref('https://example.com/image.png')
const imageAlt = ref('Example Image')
const attrName = ref('src')
const attrValue = ref('customValue')
const src = ref('https://example.com/image.png')
</script>

<template>
  <div>
    <!-- Bind an attribute to a data property -->
    <img v-bind:src="imageUrl" />
    <!-- Dynamic attribute name -->
    <img v-bind:[attrName]="attrValue" />
    <!-- Object syntax, bind multiple attributes at once -->
    <!-- Useful to reduce the repetition of `v-bind` -->
    <img v-bind="{ src: imageUrl, alt: imageAlt }" />

    <!-- Shorthand syntax -->
    <img :src="imageUrl" />
    <img :[attrName]="attrValue" />
    <img :="{ src: imageUrl, alt: imageAlt }" />

    <!-- shorthand without value if the attribute name and the variable name are the same, from Vue 3.4+ -->
    <img :src />
  </div>
</template>
```

When using with web components, we may need to use `.attr` abd `.prop` modifiers to ensure the correct binding behavior:

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const value = ref('someValue')
</script>

<template>
  <div>
    <!-- Bind as an attribute -->
    <my-component v-bind:custom-attr.attr="value" />
    <!-- Bind as a property -->
    <my-component v-bind:custom-prop.prop="value" />
  </div>
</template>
```

Too learn about the difference between attributes and properties, please refer to [HTML manual](/posts/manual/html-advanced-grammar-manual#attributes-vs-properties).

#### `v-model` Directive

The `v-model` directive is used for two-way data binding between form input elements / components and the Vue instance data.

It can only be used on:

- `<input>`
- `<select>`
- `<textarea>`
- Components

It accpets different modifiers to customize its behavior:

- `.lazy`: Updates the data on `change` event instead of `input` event
- `.number`: Converts the input value to a number before updating the data
- `.trim`: Trims whitespace from the input value before updating the data

> [!Note]
>
> If you are using `v-model`, the default value set by the `value`, `checked`, or `selected` attributes will be ignored. Instead, you should set the initial value directly in the Vue instance data.

> [!Warning]
>
> When you define a model value in a component, you shouldn't to set the default value, it may cause the out of synchronization between the data in parent component and the model value in child component.
>
> For example, in the case below, `value` in the parent component is `undefined`, while the model value in child component is `1`:
>
> _src/parent.vue_
>
> ```vue
> <script setup>
> import { ref } from 'vue'
> import ChildComponent from './ChildComponent.vue'
>
> const value = ref()
> </script>
>
> <template>
>   <ChildComponent v-model="value" />
> </template>
> ```
>
> _src/ChildComponent.vue_
>
> ```vue
> <script setup>
> import { defineModel } from 'vue'
>
> // defineModel requires Vue 3.4+
> const model = defineModel({ default: 1 })
> </script>
>
> <template>
>   <input v-model="model" type="number">
> </template>
> ```

See more details in the [forms input binding](https://vuejs.org/guide/essentials/forms) and [component v-model](https://vuejs.org/guide/components/v-model) documentation.

### Data Binding

#### Text Interpolation vs. Attribute Binding

In Vue.js, templates support text interpolation using double curly braces `{{ }}`. This allows you to bind data from the Vue instance to the HTML.

```vue
<script setup>
import { ref } from 'vue'

const msg = ref('Hello, Vue!')
</script>

<template>
  <span>Message: {{ msg }}</span>
</template>
```

But this cannot work in attributes, because double curly braces are not valid in HTML attributes. Instead, Vue provides the `v-bind` directive (or its shorthand `:`) to bind attributes to data.

```vue
<script setup>
import { ref } from 'vue'

const id = ref('my-element')
</script>

<template>
  <!-- Using v-bind directive -->
  <div :id="id" />
  <!-- or using shorthand -->
  <div :id="id" />
  <!-- shorthand without value if the attribute name and the variable name are the same, from Vue 3.4+ -->
  <div :id />
</template>
```

> [!Note]
>
> We know HTML elements are themselves, so the binding attributes will attach to them directly. But for Vue components who will be transformed into a bunch of HTML elements, the behavior is different:
>
> - For single-root element Vue components, the binding attributes will attach to the root element.
> - For multi-root element Vue components, the binding attributes will not attach to any element, instead, you should use a special global variable `$attrs` to access them inside the component, and bind them to the desired element manually.

#### JavaScript Expressions

You can use JavaScript expressions inside the double curly braces for text interpolation and in the `v-bind` directive for attribute binding, just like:

```vue
<script setup>
import { ref } from 'vue'

const a = ref(5)
const b = ref(10)
const imageUrl = ref('https://example.com/image.png')
</script>

<template>
  <div>
    <span>Sum: {{ a + b }}</span>
    <img :src="`${imageUrl}?size=large`">
  </div>
</template>
```

> [!Caution]
>
> That expressions will be recalled on each re-render (even there is no data change), so avoid using heavy expressions or function calls in templates, especially inside `v-for` loops:
>
> ```vue
> <script setup>
> const items = [/* some data */]
>
> function heavyComputation(item) {
>   // some heavy computation
>   return item.value * 2 // example
> }
> </script>
>
> <template>
>   <div>
>     <!-- Avoid this -->
>     <div v-for="(item, index) in items" :key="index">
>       <!-- This will call heavyComputation on each re-render -->
>       {{ heavyComputation(item) }}
>     </div>
>   </div>
> </template>
> ```
>
> Instead, consider using computed properties to handle complex logic.
>
> ```vue
> <script setup>
> const items = [/* some data */]
>
> function heavyComputation(item) {
>   // some heavy computation
>   return item.value * 2 // example
> }
>
> const computedItems = computed(() => {
>   return items.map((item) => {
>     return heavyComputation(item)
>   })
> })
> </script>
>
> <template>
>   <div>
>     <div v-for="(item, index) in items" :key="index">
>       {{ computedItems[index] }}
>     </div>
>   </div>
> </template>
> ```

#### Class and Style Bindings

Vue.js provides special features for binding classes and styles to elements.

- We cannot use both literals and bindings for general attributes, except for `class` and `style`, and they will be merged together.

  _src/general-attribute.vue_

  <!-- eslint-skip -->

  ```vue
  <template>
    <!-- Throw: An object literal cannot have multiple properties with the same name. -->
    <div id="static-id" :id="dynamicId" />
  </template>
  ```

  _src/index.vue_

  <!-- eslint-skip -->

  ```vue
  <template>
    <div
      class="static-class"
      :class="['dynamic-class-value', 'another-class']"
    ></div>
  </template>
  ```

  _dist/index.html_

  ```html
  <div class="static-class dynamic-class-value another-class"></div>
  ```

- They support literal, string, array, object syntax, and JavaScript expression for bindings.
  - For classes:
    - For string values, they will be treated as a normal class string, be concatenated with others with spaces.
    - For object values, the keys are treated as class names, the values will be converted to booleans and indicating whether to include that class name or not.
    - For array values, each item will be treated as a class name, and finally concatenated with others with spaces.
    - For nested values, they will be processed first.
    - ...You can also use any JavaScript expression which evaluates to the above types.
  - For styles:
    - For string values, they will be treated as a normal CSS string, be concatenated with others with semicolons.
    - For object values, the keys are CSS property names, the values are the corresponding CSS values, [except array values](#style-bindings-vendor-prefixes).
    - For array values, each item will be treated as a CSS string and finally concatenated with others with semicolons.
    - For nested values, they will be processed first.
    - ...You can also use any JavaScript expression which evaluates to the above types, too.

  _src/index.vue_

  <!-- eslint-skip -->

  ```vue
  <template>
    <div>
      <div
        id="example-string"
        class="static-class"
        :class="'dynamic-class-value another-class'"
        style="color: blue; font-size: 12px"
        :style="'background-color: yellow; margin: 5px'"
      ></div>

      <div
        id="example-object"
        class="static-class"
        :class="{ 'dynamic-class-value': true, 'another-class': true, 'unused-class': false }"
        style="color: blue; font-size: 12px"
        :style="{ 'background-color': 'yellow', margin: '5px' }"
      ></div>

      <div
        id="example-array"
        class="static-class"
        :class="['dynamic-class-value', 'another-class']"
        style="color: blue; font-size: 12px"
        :style="['background-color: yellow', 'margin: 5px']"
      ></div>

      <div
        id="example-nested"
        class="static-class"
        :class="['dynamic-class-value', 'another-class', { 'unused-class': false }]"
        style="color: blue; font-size: 12px"
        :style="['background-color: yellow', { margin: '5px' }]"
      ></div>

      <div
        id="example-expression"
        class="static-class"
        :class="[ 1 === 1 ? 'dynamic-class-value' : '', 'another-class' ]"
        style="color: blue; font-size: 12px"
        :style="[ 'background-color: yellow', { ['mar' + 'gin']: `${4 + 1}px` } ]"
      ></div>
    </div>
  </template>
  ```

  _dist/index.html_

  ```html
  <div>
    <div
      id="example-string"
      class="static-class dynamic-class-value another-class"
      style="color: blue; font-size: 12px; background-color: yellow; margin: 5px"
    ></div>

    <div
      id="example-object"
      class="static-class dynamic-class-value another-class"
      style="color: blue; font-size: 12px; background-color: yellow; margin: 5px"
    ></div>

    <div
      id="example-array"
      class="static-class dynamic-class-value another-class"
      style="color: blue; font-size: 12px; background-color: yellow; margin: 5px"
    ></div>

    <div
      id="example-nested"
      class="static-class dynamic-class-value another-class"
      style="color: blue; font-size: 12px; background-color: yellow; margin: 5px"
    ></div>

    <div
      id="example-expression"
      class="static-class dynamic-class-value another-class"
      style="color: blue; font-size: 12px; background-color: yellow; margin: 5px"
    ></div>
  </div>
  ```

- <a id="style-bindings-vendor-prefixes"></a>By default, Vue will [automatically add vendor prefixes to binding styles at runtime](#style-vendor-prefixing).

  But sometimes, the feature of specify vendor prefixes is necessary, so there is a special syntax to support it, that is binding a object with array values for styles:

  _src/index.vue_

  ```vue
  <template>
    <div
      id="example-vendor-prefixes"
      :style="{
        display: [
          '-webkit-box', '-ms-flexbox', 'flex',
        ],
      }"
    />
  </template>
  ```

  Notice, the arrays only apply the last value that the browser supports, so the order of values in the array matters.

  In the latest browsers, the runtime element may be:

  _yoursite.com/index_

  ```html
  <div id="example-vendor-prefixes" style="display: flex"></div>
  ```

  In the older webkit browsers, the runtime element may be:

  _yoursite.com/index_

  ```html
  <div id="example-vendor-prefixes" style="display: -webkit-box"></div>
  ```

## Reactivity System

### What is Reactivity?

The most important feature of Vue.js is its low invasive reactivity system, and what does "reactivity" mean?

A classical example of reactivity is the formula of Excel spreadsheet: For the cell `C1` with formula `= A1 + B1`, when you change the value of cell `A1` or `B1`, the value of the cell will be updated automatically.

By this feature, we can separate the data and the logic of calculation, and only focus on the data itself. The program will take care of the rest.

### Implementing Reactivity in JavaScript

How could we achieve this in JavaScript? First, for calculating/recalculating the value of `C1`, we need a update function. This function explains the relationship between `C1`, `A1` and `B1`, every time we call it, the value of `C1` will be updated:

```js
let C1

function update() {
  C1 = A1 + B1
}
```

And then we need to define some terms:

- This `update()` function will create a **side effect** (Set the value of variable `C1` outside of the function to `A1 + B1`), because it will change the state of program.

  > [!Note]
  >
  > The opposite is a function that only returns a value without changing the external state.
  >
  > For example:
  >
  > ```js
  > function add(a, b) {
  >   return a + b
  > }
  > ```

- The variables `A1` and `B1` are **dependencies** of the `update()` function, because the value of them are used to execute that side effect.
- This side effect made by function `update()` can be called a **subscriber** of those dependencies. When any of the dependencies change, the subscriber should be notified to re-execute.

Then we need a magic function called `whenDepsChange()`, it receive a update function, and should complete the following tasks:

```js
whenDepsChange(update)
```

- Call the `update()` function once to create the first side effect
- Track a variable when it's accessed. For example, when we execute `A1 + B1`, it should know both `A1` and `B1` are accessed
- When a variable is accessed during creating a side effect, it should register that side effect as a subscriber of that variable. For example, when `A1` and `B1` are accessed during the execution of `update()`, it should register `update()` as a subscriber of both `A1` and `B1`
- Track the changes of a variable, when the variable is changed, should notify all of its subscriber. For example, when we assign a new value to `A1` or `B1`, it should know that the variable has changed, and "notify" `update()` function to re-execute

Call the function once and create the side effect is easily, but how could we track/trigger when a variable is accessed?

### Track/Trigger during the Access of Object Properties

For the variable access, there is no way in native JavaScript, for example:

```js
let v = 1
let o = { p: 2 }

v = v + 1 // Cannot track/trigger during this access
o = { x: 3 } // Cannot track/trigger during this access
```

But it's possible to track/trigger **the access of object properties**. All the reactivity systems in Vue.js are based on this feature.

There are two ways to achieve this:

- Property getters and setters (Vue 2.x)

  ```js
  // Pseudocode
  function defineReactive(obj, key) {
    Object.defineProperty(obj, key, {
      get() {
        track(key)
        return obj[key]
      },
      set(newValue) {
        obj[key] = newValue
        trigger(key)
      },
    })
  }

  // Usage
  const obj = { A1: 1, B1: 2 }
  for (const key in obj) {
    defineReactive(obj, key)
  }
  ```

  > [!Note]
  >
  > Because of the limitation of `Object.defineProperty`, Vue 2.x cannot detect the addition or deletion of properties on an object, so we have to use `Vue.set()` and `Vue.delete()` methods as a workaround.

  > [!Note]
  >
  > Because of all the operations are done on the original object, the reactive object is equal to the original object in Vue 2.x:
  >
  > ```vue
  > <script>
  > const original = { A1: 1, B1: 2 }
  >
  > export default {
  >   data() {
  >     return {
  >       state: original,
  >     }
  >   },
  >   watch: {
  >     state() {
  >       console.log('state is accessed!')
  >     },
  >   },
  > }
  > </script>
  >
  > <template>
  >   <div>
  >     <div>
  >       {{ state === original }} <!-- -> true -->
  >     </div>
  >     <button @click="state.A1 += 1">
  >       <!-- Will trigger watcher -->
  >       Increment A1 from State
  >     </button>
  >     <button @click="original.A1 += 1">
  >       <!-- Will also trigger watcher -->
  >       Increment A1 from Original
  >     </button>
  >   </div>
  > </template>
  > ```

- Proxies (Vue 3.x)

  ```js
  // pseudocode
  function reactive(obj) {
    return new Proxy(obj, {
      get(target, key) {
        track(key)
        return target[key]
      },
      set(target, key, newValue) {
        target[key] = newValue
        trigger(key)
      },
    })
  }
  ```

  > [!Note]
  >
  > With `Proxy`, Vue 3.x can detect the addition or deletion of properties on an object automatically.

  > [!Note]
  >
  > Also caused by `Proxy`, the reactive object is no longer equal to the original object:
  >
  > ```vue
  > <script setup>
  > import { reactive, watch } from 'vue'
  >
  > const original = { A1: 1, B1: 2 }
  > const state = reactive(original)
  >
  > watch(
  >   () => state,
  >   () => {
  >     console.log('state is accessed!')
  >   }
  > )
  > </script>
  >
  > <template>
  >   <div>
  >     <div>
  >       {{ state === original }} <!-- -> false -->
  >     </div>
  >     <button @click="state.A1 += 1">
  >       <!-- Will trigger reactivity -->
  >       Increment A1 from State
  >     </button>
  >     <button @click="original.A1 += 1">
  >       <!-- Will NOT trigger reactivity -->
  >       Increment A1 from Original
  >     </button>
  >   </div>
  > </template>
  > ```

Now, when every time we access a property of a reactive object, the `track()` function will be called, and every time we change a property of a reactive object, the `trigger()` function will be called. 🥰

Of course, these are not always perfect: **When you destructure an object, the prop will lose its reactivity on both these two methods.**

Actually, this is an expected behavior.

This is because in JavaScript, object destructuring will create a brand new variable with the value of that property at that time:

```js
// getters/setters example
const o1 = {}
Object.defineProperty(o1, 'a', {
  get() {
    return Math.random()
  },
})
console.log(o1.a) // -> 0.741153576187379
console.log(o1.a) // -> 0.6843026237047399

const { a } = o1
console.log(a) // -> 0.9197939216391986
console.log(a) // -> 0.9197939216391986

// Proxy example
const o2 = new Proxy(
  {},
  {
    get(target, key) {
      return Math.random()
    },
  }
)

console.log(o2.b) // -> 0.7079086265731991
console.log(o2.b) // -> 0.9142686661376764

const { b } = o2
console.log(b) // -> 0.966970116437479
console.log(b) // -> 0.966970116437479
```

The same to pass the property instead of the whole object to a function, this will also lose the reactivity.

### Record Subscribers and Notify Them

The next task is registering side effect subscribers during `track()` calls, and notifying them during `trigger()` calls.

Let's sort out the whole process:

1. Now we can create some reactive objects, when their properties are accessed, it will call `track()` function or `trigger()` function accordingly.
2. When calling the update function by `whenDepsChange(update)`, it's expected to call the update function once, so this will result the related `track()` calls
3. Who are the active side effect during this `track()` calls? Yes, it's the `update()` function itself.

Figure these out, we know we can use a global variable `activeEffect` to store the currently active side effect.

Let's implement `whenDepsChange()` function first:

```js
let activeEffect

function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

> [!Note]
>
> You may see that we use a wrapper function `effect()` instead of using `update()` function directly, this is because when the side effect function is called by `trigger()` calls on the background instead of `whenDepsChange`, we still need to ensure the `activeEffect` is set to that side effect correctly.

Then, implement `track()` function:

```js
// This is set to the currently active side effect before every `track()` calls,
// because `track()` function are only called during the execution
// of `update()` function.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

We stored all subscribers in a global `WeakMap<target, Map<key, Set<effect>>>` structure, `getSubscribersForProperty()` function will find the correct `Set<effect>` for that target object and key, creating them if necessary. They are simple data structure operations, so we won't go into details here.

Finally, implement `trigger()` function. Inside `trigger()` function, we will find all of the subscribers of that variable, and re-execute them:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach(effect => effect())
}
```

Now, we have a basic reactivity system with objects:

```js
const state = reactive({
  A1: 1,
  B1: 2,
  C1: undefined,
})
function update() {
  state.C1 = state.A1 + state.B1
  console.log('C1 updated:', state.C1)
}

// Create `effect()` wrapper function, set the `activeEffect` correctly,
// then call `update()` once, then trigger `track()` calls,
// then store this `effect()` function as one of the subscribers.
whenDepsChange(update) // -> C1 updated: 3

// Trigger `trigger()` calls when properties are changed,
// find all of the related subscribers (effects),
// trigger the re-execution of all related `effect()` functions (synchronously).
//
// For each `effect()` function call, set the `activeEffect` correctly,
// then call `update()` again.
state.A1 = 3 // -> C1 updated: 5
state.B1 = 4 // -> C1 updated: 7
```

Don't forget to handle the case of nested objects. We can make `reactive()` function a deep reactive by calling itself when a property is object:

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      const value = target[key]
      // If the property is an object, make it reactive too
      if (typeof value === 'object' && value !== null) {
        return reactive(value)
      }
      return value
    },
    set(target, key, newValue) {
      target[key] = newValue
      trigger(target, key)
    },
  })
}
```

> [!Note]
>
> If you don't want to make a deep reactive, you can use `shallowReactive()` function, which only makes the top-level properties reactive.
>
> This is useful to improve performance when you know that nested objects won't change.

### Reactive Primitives

We know primitives has no properties, so is there no way to make primitive values reactive?

Yes, but we can use a workaround: wrap the primitive value in an object, and make that object reactive: Setting a single property `value` to hold the primitive value, and track the access of that property.

No need of `Proxy`, `getters/setters` are enough, because `ref()` is only expected to keep reactive when users accessing `value` property, not adding/deleting properties.

```js
function ref(value) {
  const refObject = {
    __value: value,
    get value() {
      track(refObject, 'value')
      // If the property is an object, make it reactive too
      if (typeof refObject.__value === 'object' && refObject.__value !== null) {
        return reactive(refObject.__value)
      }
      return refObject.__value
    },
    set value(newValue) {
      refObject.__value = newValue
      trigger(refObject, 'value')
    },
  }
}
```

For object values, `ref()` still wraps them in this way, but also makes them reactive by `reactive()`.

### Computed Properties

Both `reactive()` and `ref()` create reactive values from normal values, but sometimes we need to create a reactive value which is derived from other reactive values, and they cannot handle this case well:

```vue
<script setup>
import { ref } from 'vue'

const a = ref(1)
const b = ref(2)
// Below is NOT work,
// because these accesses are not during a side effect execution,
// the reactivity system cannot track the dependencies of `c`
const c = ref(a.value + b.value)

// The same as `reactive()` ...
// ...
</script>
```

Computed properties are designed for handling this case, its implementation looks like a wrapper of the usage of our simple reactivity system:

```js
function computed(getter) {
  const state = ref()
  function update() {
    state.value = getter()
  }
  whenDepsChange(update)
  return {
    get value() {
      return state.value
    },
  }
}
```

Of course, the real implementation is much more complicated than that, there will be many edge case checking and optimizations, but the usage is still simple:

```js
import { computed, reactive } from 'vue'

const state = reactive({
  A1: 1,
  B1: 2,
})
const C1 = computed(() => state.A1 + state.B1)

console.log('C1 initial:', C1.value) // -> C1 initial: 3
state.A1 = 3
console.log('C1 after A1 changed:', C1.value) // -> C1 after A1 changed: 5
state.B1 = 4
console.log('C1 after B1 changed:', C1.value) // -> C1 after B1 changed: 7
```

### Watchers

The reactivity system we implemented before is similar to one API in Vue.js called `watchEffect()`, and we can rewrite the previous example by it:

```js
import { reactive, watchEffect } from 'vue'

const state = reactive({
  A1: 1,
  B1: 2,
  C1: undefined,
})
function update() {
  state.C1 = state.A1 + state.B1
  console.log('C1 updated:', state.C1)
}

watchEffect(
  update,
  { immediate: true }
) // -> C1 updated: 3
state.A1 = 3 // -> C1 updated: 5
state.B1 = 4 // -> C1 updated: 7
```

`watch()` is a custom version of `watchEffect()`, which allows you to specify the dependencies explicitly:

```js
import { reactive, watch } from 'vue'

const state = reactive({
  A1: 1,
  B1: 2,
  C1: undefined,
})
function update() {
  state.C1 = state.A1 + state.B1
  console.log('C1 updated:', state.C1)
}
watch(
  () => [state.A1, state.B1],
  update,
  { immediate: true }
) // -> C1 updated: 3
state.A1 = 3 // -> C1 updated: 5
state.B1 = 4 // -> C1 updated: 7
```

### Debug Reactive

We can use `onRenderTracked` and `onRenderTriggered` hooks to debug the reactivity system in Vue components.

<!-- eslint-skip -->

```vue
<script setup>
import { onRenderTracked, onRenderTriggered, ref } from 'vue'

const count = ref(0)
onRenderTracked((e) => {
  debugger
})
onRenderTriggered((e) => {
  debugger
})
</script>
```

For `computed()` and `watch()`, you can use `onTrack` and `onTrigger` options to debug them:

<!-- eslint-skip -->

```vue
<script setup>
import { computed } from 'vue'

const count = ref(0)
const doubleCount = computed(
  () => count.value * 2,
  {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    },
  }
)

watch(
  () => count.value,
  () => {
    // ...
  },
  {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    },
  }
)

watchEffect(
  () => {
    // ...
  },
  {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    },
  }
)
</script>
```

### Reactivity Extra

See more details in the [Vue Reactivity System documentation](https://vuejs.org/guide/extras/reactivity-in-depth#integration-with-external-state-systems).

## Compatibility

### Style Vendor Prefixing

When you using `v-bind` to bind styles, Vue will automatically add vendor prefixes to the styles for better browser compatibility.

This is a runtime behavior. If the current browser does not support that style attribute, Vue will add all of the available vendor prefixes to it.

```

```
