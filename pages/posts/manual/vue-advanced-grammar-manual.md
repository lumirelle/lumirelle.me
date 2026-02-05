---
title: Vue Advanced Grammar Manual
date: 2026-01-28T11:47+08:00
update: 2026-02-05T15:23+08:00
lang: en
duration: 66min
type: note
---

[[toc]]

> [!Note]
>
> This manual expects you have basic knowledge of Vue.js. If you see some use cases you are not familiar with, don't worry, just skip them first and the following chapters will explain them one by one.
>
> This manual are mainly talking about Vue 3.x, Vue 2.x will only be mentioned when comparing the differences.
>
> What's more, the `Vue 2.x` we mentioned here means the latest version of Vue 2.x, but without any Vue 3.x backport features. For example, the Composition API. Because those backport features let Vue 2.x can behave just like Vue 3.x in many aspects, we consider them as a variant of Vue 3.x versions.

## Introduction to Vue.js

Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable, which means you can use as much or as little of Vue.js as you need.

The key features of Vue.js include:

- Progressive: Vue.js applications only take over a root element from the existing HTML page, all the APIs are exposed from the global `Vue` variable or the default export of the `vue` package, with less invasion to the existing codebase.
- Component-based architecture: Vue.js allows you to create reusable components that can be composed to build complex user interfaces.
- Declarative rendering: Vue.js uses its own template grammar to build component content that allows you to declaratively render data to the DOM.
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

2. Second step, use `createApp` to create a Vue application with the root component and let Vue take over the `#app` element. In the future, it will manage all the content inside that element for you base on the reactive data and the component logic.

   The root component was created by `defineComponent`, with reactive data created by `ref`. We will explain these APIs in the corresponding chapters later.

   _src/new-page.html_

   ```html
   <html>
     <head>
       <!-- ... -->
       <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
     </head>
     <body>
       // [!code highlight:27]
       <!-- The root element for the Vue application -->
       <div id="app"></div>
       <!-- Create and mount the Vue application -->
       <script>
         const { createApp, ref, defineComponent } = Vue

         // Define the root component
         const rootComponent = defineComponent({
           setup() {
             // Create reactive data
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
   // Define a global variable `OtherComponent` to hold the component
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

You may already know how to define a basic JavaScript object Vue component in the browser environment:

```js
const { defineComponent } = Vue

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

`defineComponent` is a helper function provided by Vue to define a component, it only provides the type support and returns the same object we passed in.

But when we are using build steps (like Vite, Webpack, etc. with Vue SFC Compiler), the most common way to define a Vue component is defining it in a single file with `.vue` extension, called Single File Component (SFC).

There are two different syntax to define Vue SFC, and looks more different than JavaScript object component, but the underlying logic is the same -- They will be compiled to the corresponding JavaScript object component by Vue SFC Compiler.

> [!Note]
>
> Of course, these code below will executed in the standlone JavaScript runtime like Node.js or Bun with ESM support, so we can use `import` and `export` syntax there instead of `Vue` global variable.
>
> What's more, the real compiled output is more complex than this, for example, the `template` option will be futher compiled to a render function, etc. But anyway, to shows the core principles of SFC, this is enough. To learn about the real compiled output, you can try [Vue SFC Playground](https://sfc.vuejs.org/) and choose the "JS" output tab.

<table><tbody><tr><td width="500px" valign="top">

The general syntax looks similar to JavaScript object component:

_src/ComponentSFC.vue_

```vue
<script>
// [!code highlight:14]
import { ref } from 'vue'

export default {
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
// [!code highlight:2]
// The import statement will be hoisted
import { ref } from 'vue'

const __sfc__ = {
  setup() {
    // [!code highlight:8]
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
    // [!code highlight:6]
    <div>
      <p>Count: {{ count }}</p>
      <button @click="increment">
        Increment
      </button>
    </div>
  `,
}
export default __sfc__
```

</td></tr></tbody></table>

<table><tbody><tr><td width="500px" valign="top">

While the `<script setup>` syntax looks like a grammar sugar for some convenience:

_src/ComponentSFCScriptSetup.vue_

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
// [!code highlight:2]
// The import statement will be hoisted
import { ref } from 'vue'

const __sfc__ = {
  setup() {
    // [!code highlight:15]
    const count = ref(0)
    function increment() {
      count.value++
    }
    // The return statement will
    // be generated automatically
    return {
      // The defined symbols in <script setup>
      // will be returned automatically here
      count,
      increment,
      // Notice that, the imported symbols will
      // be returned here automatically too
      ref,
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
}
export default __sfc__
```

</td></tr></tbody></table>

You can see that: JavaScript object component and SFC component are equivalent, they just have different syntax.

> [!Note]
>
> For simplicity, we will use SFC syntax in the following examples, unless otherwise specified.
>
> Especially, general SFC syntax has few differences with JavaScript object component, so we only talk about the general SFC syntax in the following chapters, and you should know JavaScript object component is also applicable in the same way.

### Composition API vs. Options API

Until now, we are always using Vue composition API to define components: use a composed `setup()` function to complete all component setup logic.

There is still another API which is widely used in Vue 2.x: Options API.

For better comparison, we use JavaScript object component to show the differences between these two APIs:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentCompositionAPI.js_

```js
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  // [!code highlight:23]
  setup() {
    // data
    const count = ref(0)

    // methods
    function increment() {
      count.value++
    }

    // computed properties
    const doubleCount = computed(() => count.value * 2)

    // watchers
    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    // return the bindings
    return {
      count,
      increment,
      doubleCount,
    }
  },
  template: `
    <div>
      <!-- ... -->
    </div>
  `,
})
```

</td><td width="500px" valign="top">

_src/ComponentOptionsAPI.js_

```js
import { defineComponent } from 'vue'

export default defineComponent({
  // [!code highlight:24]
  // data
  data() {
    return {
      count: 0,
    }
  },
  // methods
  methods: {
    increment() {
      this.count++
    },
  },
  // computed properties
  computed: {
    doubleCount() {
      return this.count * 2
    },
  },
  // watchers
  watch: {
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    },
  },
  template: `
    <div>
      <!-- ... -->
    </div>
  `,
})
```

</td></tr></tbody></table>

In a word:

- The composition API allows us to compose all the component setup logic in one `setup` function, we use standlone API functions like `ref`, `computed`, and `watch` to create reactive data, computed properties, and watchers
- The options API separates these logic into different component object options like `data`, `methods`, `computed`, and `watch`, Vue will automatically process these options and create the corresponding reactive data, methods, computed properties, and watchers

> [!Note]
>
> Composition API is more flexible and meaningful, it's recommended to use by Vue team. So we will mainly use composition API in this manual, unless otherwise specified.

> [!Note]
>
> As you can see, `<script setup>` syntax is only compatible with composition API as it uses `setup()` function under the hood, it cannot be used with options API.

### Composables

<!-- TODO(Lumirelle): -->

### Register a Component

We already know how to register a component globally in the Vue application instance:

```js
const app = createApp(rootComponent)

// [!code highlight:2]
// Register the other component globally
app.component('OtherComponent', OtherComponent)

app.mount('#app')
```

After that, any component in that Vue application can use `OtherComponent` without any other extra steps.

> [!Note]
>
> Private components who are not intended to be reused globally are not recommended to register globally. The only reason is to avoid manually maintaining the large global registration list with too many one-time-use components, this costs more and saves less.
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
> │   │   ├── components/
> │   │   │   ├── Header.vue
> │   │   │
> │   │   ├── index.vue
> │   │
> │   ├── dashboard/
> │   │   ├── components/
> │   │   │   ├── Header.vue
> │   │   │
> │   │   ├── profile/
> │   │   │   ├── components/
> │   │   │   │   ├── Header.vue
> │   │   │   │
> │   │   │   ├── index.vue
> │   │   │
> │   │   ├── settings/
> │   │   │   ├── components/
> │   │   │   │   ├── Header.vue
> │   │   │   │
> │   │   │   ├── index.vue
> │   │   │
> │   │   ├── index.vue
> │   │
> │   ├── about/
> │   │   ├── components/
> │   │   │   ├── Header.vue
> │   │   │
> │   │   ├── index.vue
> ```
>
> And a better way is:
>
> ```txt
> src/
> ├── components/
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
> │   ├── home/
> │   │   ├── index.vue
> │   │
> │   ├── dashboard/
> │   │   ├── profile/
> │   │   │   ├── index.vue
> │   │   │
> │   │   ├── settings/
> │   │       ├── index.vue
> │   │
> │   ├── about/
> │   │   ├── index.vue
> ```

### Using a Component Locally

Instead of registering a component globally, we can also use it locally in another component.

In general SFC syntax with composition API, the way to use components locally is importing them and returning them from the `setup` function, then we correctly reference them in the `<template>` block (Yes, the same as JavaScript object component):

<table><tbody><tr><td width="500px" valign="top">

_src/ParentComponentWithCompositionAPI.vue_

```vue
<script>
// [!code highlight:2]
import ChildComponentJS from './ChildComponent.js'
import ChildComponentVue from './ChildComponent.vue'

export default {
  setup() {
    // [!code highlight:4]
    return {
      ChildComponentJS,
      ChildComponentVue,
    }
  },
}
</script>

<template>
  <div>
    <h1>Parent Component</h1>
    // [!code highlight:2]
    <ChildComponentJS />
    <ChildComponentVue />
  </div>
</template>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
// [!code highlight:2]
import ChildComponentJS from './ChildComponent.js'
import ChildComponentVue from './ChildComponent.vue'

const __sfc__ = {
  setup() {
    // [!code highlight:4]
    return {
      ChildComponentJS,
      ChildComponentVue,
    }
  },
  template: `
    <div>
      <h1>Parent Component</h1>
      // [!code highlight:2]
      <ChildComponentJS />
      <ChildComponentVue />
    </div>
  `,
}
export default __sfc__
```

</td></tr></tbody></table>

Specially, **everything imported inside `<script setup>` will be returned automatically**. So if you are using `<script setup>`, you don't need to manually return the imported components from the `setup` function:

<table><tbody><tr><td width="500px" valign="top">

_src/ParentComponentWithScriptSetup.vue_

```vue
<script setup>
// [!code highlight:2]
import ChildComponentJS from './ChildComponent.js'
import ChildComponentVue from './ChildComponent.vue'
</script>

<template>
  <div>
    <h1>Parent Component</h1>
    // [!code highlight:2]
    <ChildComponentJS />
    <ChildComponentVue />
  </div>
</template>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
// [!code highlight:2]
import ChildComponentJS from './ChildComponent.js'
import ChildComponentVue from './ChildComponent.vue'

const __sfc__ = {
  setup() {
    // [!code highlight:5]
    // Automatically generated return statement, by SFC compiler
    return {
      ChildComponentJS,
      ChildComponentVue,
    }
  },
  template: `
    <div>
      <h1>Parent Component</h1>
      // [!code highlight:2]
      <ChildComponentJS />
      <ChildComponentVue />
    </div>
  `,
}
export default __sfc__
```

</td></tr></tbody></table>

For option API components, we use the `components` option to register local components:

<table><tbody><tr><td width="500px" valign="top">

_src/ParentComponentWithOptionsAPI.vue_

```vue
<script>
export default {
  // [!code highlight:4]
  components: {
    ChildComponentJS,
    ChildComponentVue,
  },
}
</script>

<template>
  <div>
    <h1>Parent Component</h1>
    // [!code highlight:2]
    <ChildComponentJS />
    <ChildComponentVue />
  </div>
</template>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
// [!code highlight:2]
import ChildComponentJS from './ChildComponent.js'
import ChildComponentVue from './ChildComponent.vue'

const __sfc__ = {
  // [!code highlight:4]
  components: {
    ChildComponentJS,
    ChildComponentVue,
  },
  template: `
    <div>
      <h1>Parent Component</h1>
      // [!code highlight:2]
      <ChildComponentJS />
      <ChildComponentVue />
    </div>
  `,
}
export default __sfc__
```

</td></tr></tbody></table>

> [!Note]
>
> When you use a component, you can use either PascalCase or kebab-case for its name in the template. For example, `<ChildComponent />` and `<child-component />` are both valid for `ChildComponent`.
>
> It's recommended to use PascalCase in common cases for better readability, and kebab-case in in-DOM templates for better compatibility with HTML behavior (HTML is case-insensitive).
>
> BTW, until now, I haven't met any real case using in-DOM templates...

### Five Elements of a Component

Let's now look at the details of defining a Vue component.

There are five main elements in a Vue component:

- Props: The input data passed from parent components to child components.

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

- Events: The custom events emitted from child components to parent components.

  ```vue
  <script setup>
  defineEmits({
    close: null,
    submit: (data) => {
      if (typeof data === 'string') {
        return true
      }
      return false
    },
  })
  </script>
  ```

- Exposed public API: The public API of the component, which can be accessed by parent components via component instance/template refs.

  ```vue
  <script setup>
  import { defineExpose, ref } from 'vue'

  const count = ref(0)
  function increment() {
    count.value++
  }

  defineExpose({
    increment,
  })
  </script>
  ```

- Data & State: The internal reactive data and state of the component, with related methods to manipulate them.

  ```vue
  <script setup>
  import { ref } from 'vue'

  const count = ref(0)
  function increment() {
    count.value++
  }
  </script>
  ```

- Template: The HTML-like structure that defines the component's UI.

  ```vue
  <template>
    <div>
      <p>{{ title }}</p>
      <p>Count: {{ count }}</p>
      <button @click="increment">
        Increment
      </button>
      <button @click="$emit('close')">
        Close
      </button>
    </div>
  </template>
  ```

These five elements work together to define the behavior and appearance of a Vue component.

In this chapter, we will focus on the first three elements: Props, Events, and Exposed public API.

Data & state management will be covered in the [reactivity system](#reactivity-system) chapter, and template syntax will be covered in the [template grammar](#template-grammar) chapter.

### Two Ways to Define Props

We can define props by the `props` option of Vue components whatever composition API or options API:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithPropsOptions.vue_

```vue
<script>
export default {
  // [!code highlight:9]
  props: {
    title: { // required
      type: String,
      required: true,
    },
    count: { // optional
      type: Number,
      default: 0,
    },
  },
}
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
const __sfc__ = {
  // [!code highlight:9]
  props: {
    title: { // required
      type: String,
      required: true,
    },
    count: { // optional
      type: Number,
      default: 0,
    },
  },
}
export default __sfc__
```

</td></tr></tbody></table>

But when we using `<script setup>`, we cannot access the options of Vue components at all! How to deal with this case? Fortunately, Vue provides a macro helper called `defineProps`:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithPropsMacro.vue_

```vue
<script setup>
// [!code highlight:9]
defineProps({
  title: { // required
    type: String,
    required: true,
  },
  count: { // optional
    type: Number,
    default: 0,
  },
})
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
const __sfc__ = {
  // [!code highlight:9]
  props: {
    title: { // required
      type: String,
      required: true,
    },
    count: { // optional
      type: Number,
      default: 0,
    },
  },
}
export default __sfc__
```

</td></tr></tbody></table>

You can see that, **macros** in `<script setup>` syntax are just a workaround to configure the corresponding options of Vue components, they will be compiled to the equivalent options automatically. There are also other macros like `defineEmits`, which is corresponding to the `emits` option of Vue components...

These two example will both create two props called `title` and `count`. `title` is an optional string prop, and `count` is an optional number prop with a default value of `0`. Vue will [validate the types of these props in runtime (development mode)](#props-and-events-with-validation).

They are the same way in different syntax: They both define props by values.

Another and better way to define props is using TypeScript types, Vue will compile them to the equivalent `props` option automatically:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithTypedPropsMacro.vue_

```vue
<script setup lang="ts">
// [!code highlight:8]
interface Props {
  title: string // required
  count?: number // optional
}
const {
  title,
  count = 0 // Default value is `0`
} = defineProps<Props>()
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
const __sfc__ = {
  // [!code highlight:11]
  props: {
    title: { // required
      type: String,
      required: true,
    },
    count: { // optional
      type: Number,
      required: false,
      default: 0,
    },
  },
}
export default __sfc__
```

</td></tr></tbody></table>

This way is more concise and meaningful: use right tools to do right things, use TypeScript to do type checking!

Something you should notice is that there are some limitations:

- You can only use one way to define props in one component, either using values syntax or using TypeScript types syntax.
- Before Vue 3.3, the only way to assign default values to the props with types syntax is using another macro helper called `withDefaults`:

  <table><tbody><tr><td width="500px" valign="top">

  _src/ComponentV3.3-.vue_

  ```vue
  <script setup lang="ts">
  // [!code highlight:11]
  interface Props { // #0
    title: string
    count?: number
  }
  const props = withDefaults( // #1
    defineProps<Props>(),
    {
      count: 0,
    }
  )
  console.log(props.count) // #2
  </script>
  ```

  </td><td width="500px" valign="top">

  _Corresponding Compiler Output_

  ```js
  const __sfc__ = {
    // [!code highlight:19]
    props: { // #0
      title: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    setup(__props) {
      const props = __props // #1
      console.log(props.count) // #2
      // Automatically generated return statement
      return {
        props,
      }
    },
  }
  export default __sfc__
  ```

  </td></tr></tbody></table>

  This may look a bit annoying.

- After Vue 3.3, you can use destructuring assignment with default values, this is actually a grammar sugar, so you don't need to worry about [losing the reactivity of these props](#track-trigger-during-the-access-of-object-properties):

  <table><tbody><tr><td width="500px" valign="top">

  _src/ComponentV3.3+.vue_

  ```vue
  <script setup lang="ts">
  // [!code highlight:8]
  interface Props { // #0
    title: string
    count?: number
  }
  const { // #1
    count = 0
  } = defineProps<Props>()
  console.log(count) // #2
  </script>
  ```

  </td><td width="500px" valign="top">

  _Corresponding Compiler Output_

  ```js
  const __sfc__ = {
    // [!code highlight:14]
    props: { // #0
      title: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    setup(__props) {
      console.log(__props.count) // #2
      return { }
    },
  }
  export default __sfc__
  ```

  </td></tr></tbody></table>

  You can see, the destructuring statement (#1) is removed directly, every usage of the symbol `count` destructured from props is replaced with `__props.count`.

  This has better readability, fit well with the way we assign default values in JavaScript and generate less boilerplate code.

### Two Ways to Define Emits (Events)

Emits are similar to props, it support both values syntax and types syntax:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithEmitsMacro.vue_

```vue
<script setup>
// [!code highlight:1]
defineEmits(['submit'])
</script>
```

_src/ComponentWithEmitsOption.vue_

```vue
<script>
export default {
  // [!code highlight:1]
  emits: ['submit'],
}
</script>
```

_src/ComponentWithTypedEmitsMacro.vue_

```vue
<script setup lang="ts">
// [!code highlight:8]
interface Emits {
  (e: 'submit', message: string): void
}
// Or, Vue 3.3+ a shorter syntax:
interface Emits {
  submit: [message: string]
}
defineEmits<Emits>()
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
const __sfc__ = {
  // [!code highlight:1]
  emits: ['submit'],
}
export default __sfc__
```

</td></tr></tbody></table>

### Props and Emits with Validation

The validation of props and emits are a kind of documentations for that component, it's important for users to understand how to use that component correctly.

<table><tbody><tr><td width="500px" valign="top">

When we use values syntax, we can provide more detailed validation rules for props and emits **in runtime (development mode)** like this:

```vue
<script setup>
// [!code highlight:49]
defineProps({
  // A required string prop
  title: {
    type: String,
    required: true,
  },
  // An optional string prop
  description: String,
  // An optional string prop too
  note: {
    type: String,
    required: false,
  },
  // An optional number prop with a default value
  count: {
    type: Number,
    default: 9,
  },
  // An optional string prop with default value
  // and only allow specific values
  status: {
    type: String,
    default: 'active',
    // Use validator function to limit the allowed values
    validator: (value) => {
      return [
        'active',
        'inactive',
        'pending'
      ].includes(value)
    },
  },
})

defineEmits({
  // An emit event without payload
  close: (...args) => {
    if (args === undefined)
      return true
    return false
  },
  // An emit event with a string payload, and returns
  // a boolean to indicate whether the event is handled
  submit: (payload) => {
    if (typeof payload === 'string')
      return true
    return false
  },
})
</script>
```

A better way is to use TypeScript types to limit the props and emits, so that we no longer need to write extra configs. All the validation logic will done by TypeScript LSP and compiler **in compile-time**:

<!-- eslint-skip-->

```vue
<script setup lang="ts">
// [!code highlight:18]
interface Props {
  title: string
  description?: string
  note?: string
  count?: number
  // Use union type to limit the allowed values
  status?: 'active' | 'inactive' | 'pending'
}
const {
  count = 9,
  status = 'active',
} = defineProps<Props>()

interface Emits {
  close: []
  submit: [payload: string]
}
defineEmits<Emits>()
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
const __sfc__ = {
  // [!code highlight:48]
  props: {
    // A required string prop
    title: {
      type: String,
      required: true,
    },
    // An optional string prop
    description: String,
    // An optional string prop too
    note: {
      type: String,
      required: false,
    },
    // An optional number prop with a default value
    count: {
      type: Number,
      default: 9,
    },
    // An optional string prop with default value
    // and only allow specific values
    status: {
      type: String,
      default: 'active',
      validator: (value) => {
        return [
          'active',
          'inactive',
          'pending'
        ].includes(value)
      },
    },
  },

  emits: {
    // An emit event without payload
    close: (...args) => {
      if (args === undefined)
        return true
      return false
    },
    // An emit event with a string payload, and returns
    // a boolean to indicate whether the event is handled
    submit: (payload) => {
      if (typeof payload === 'string')
        return true
      return false
    },
  },
}
export default __sfc__
```

_Corresponding Compiler Output (TypeScript Types)_

```js
const __sfc__ = {
  // [!code highlight:25]
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
    count: {
      type: Number,
      required: false,
      default: 9,
    },
    status: {
      type: String,
      required: false,
      default: 'active',
    },
  },
  emits: ['close', 'submit'],
}
export default __sfc__
```

</td></tr></tbody></table>

All the validation are available in development mode only. In production mode, the compiler will omit all extra information to the simplest form for less bundle size. The example above will be compiled to:

```js
const __sfc__ = {
  props: {
    title: {},
    description: {},
    note: {},
    count: {
      default: 9,
    },
    status: {
      default: 'active',
    },
  },
  emits: ['close', 'submit'],
}
```

### Model Value Binding

From Vue 3.4, it's recommended to use `defineModel` macro to define model value binding for a `<script setup>` SFC.

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithModel.vue_

```vue
<script setup lang="ts">
// [!code highlight:2]
// Define a model value binding called `modelValue`
const modelValue = defineModel<string>({ required: true })
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

<!-- eslint-skip -->

```js
// [!code highlight:1]
import { useModel as _useModel } from 'vue'

const __sfc__ = {
  // [!code highlight:14]
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    modelModifiers: {}
  },
  emits: ['update:modelValue'],
  setup() {
    const modelValue = _useModel(__props, 'modelValue')
    return {
      modelValue,
    }
  },
}
```

</td></tr></tbody></table>

But for users who are still using earlier versions, you may need manually define the `modelValue` prop and `update:modelValue` event, then use `useModel` helper function to create the model value binding:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithModel.vue_

```vue
<script setup lang="ts">
// [!code highlight:9]
import { useModel } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const modelValue = useModel(props, 'modelValue')
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

<!-- eslint-skip -->

```js
// [!code highlight:1]
import { useModel } from 'vue'

const __sfc__ = {
  // [!code highlight:15]
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    const props = __props
    const modelValue = useModel(props, 'modelValue')
    return {
      props,
      modelValue,
    }
  },
}
```

</td></tr></tbody></table>

As you can see, so-called "v-model" binding is just a syntax sugar for passing a `modelValue` prop and listening to `update:modelValue` event.

> [!Note]
>
> For general SFC syntax, you can refers to the _Corresponding Compiler Output_ section above, they are the same.

> [!Warning]
>
> Be careful with setting default values for `modelValue`, see [`v-model` directive](#v-model-directive) for more details.

### Exposing Public API

Sometimes, we may need to expose some methods or properties to a child component instance, so that the parent component can call these methods or access these properties directly.

We can use `defineExpose` macro to define the public API of a component:

<table><tbody><tr><td width="500px" valign="top">

_src/ComponentWithExpose.vue_

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
function increment() {
  count.value++
}
// [!code highlight:3]
defineExpose({
  increment,
})
</script>
```

</td><td width="500px" valign="top">

_Corresponding Compiler Output_

```js
const __sfc__ = {
  // [!code highlight:1]
  setup(_, { expose: __expose }) {
    const count = ref(0)
    function increment() {
      count.value++
    }

    // [!code highlight:3]
    __expose({
      increment,
    })

    return {
      count,
      increment,
      ref
    }
  },
}
export default __sfc__
```

</td></tr></tbody></table>

And use them in the parent component via [template refs](#template-refs):

_src/ParentComponent.vue_

```vue
<script setup>
import { ref } from 'vue'
import ComponentWithExpose from './ComponentWithExpose.vue'

// [!code highlight:2]
// `useTemplateRef` requires Vue 3.5+
const componentRef = useTemplateRef('component')
function handleClick() {
  // [!code highlight:1]
  componentRef.value.increment()
}
</script>

<template>
  <div>
    // [!code highlight:1]
    <ComponentWithExpose ref="componentRef" />
    <button @click="handleClick">
      Increment from Parent
    </button>
  </div>
</template>
```

> [!Note]
>
> For general SFC syntax with composition API, you can refers to the _Corresponding Compiler Output_ section above, they are the same, while everything is exposed by default in options API components...

### Slots

Slots are a way to pass content from parent components to child components, they are similar to props, but instead of passing data, we pass template content.

_src/ComponentWithSlots.vue_

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <button @click="count++">
      Increment
    </button>
    // [!code highlight:11]
    <!-- 1. We define a slot by `<slot>` element, -->
    <!-- inside are its default content -->
    <!-- 2. We can even bind data to the slot, -->
    <!-- all binding data will be available in the object -->
    <!-- which is returned from `v-slot` directive -->
    <!-- 3. Slot without name attribute are named to "default" by default -->
    <slot :count="count">
      <p>The count is: {{ count }}</p>
    </slot>
    <!-- Named slots -->
    <slot name="footer">
      <p>This is the default footer content.</p>
    </slot>
  </div>
</template>
```

With slots, you can create custom content:

_src/ParentComponent.vue_

```vue
<script setup>
import ComponentWithSlots from './ComponentWithSlots.vue'
</script>

<template>
  <ComponentWithSlots>
    // [!code highlight:8]
    <!-- 1. Use `v-slot` or its shorthand `#` to specify slot name -->
    <!-- 2. We can also destructure the slot bindings from the object -->
    <!-- which is returned from `v-slot` directive -->
    <template #default="{ count }">
      <p>Custom count content: {{ count }}</p>
    </template>
    <template #footer>
      <p>Custom footer content.</p>
    </template>
  </ComponentWithSlots>
</template>
```

See more details about `v-slot` directive [there](#v-slot-directive).

### Dynamic Components

In some special cases, we may need to render different components dynamically.

Of course, we can use conditional rendering directives like [`v-if`/`v-else-if`/`v-else`](#v-if-directive) or [`v-show`](#v-show-directive) to achieve this. But the reason to use dynamic components is the same to use switch case statements instead of multiple if-else statements in programming: better readability and maintainability.

Use `v-if`/`v-else-if`/`v-else`:

```vue
<script setup>
import { ref } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'
import ComponentC from './ComponentC.vue'

const currentTabIndex = ref(0)
</script>

<template>
  <div>
    // [!code highlight:4]
    <!-- Complex DOM structure -->
    <ComponentA v-if="currentTabIndex === 0" />
    <ComponentB v-else-if="currentTabIndex === 1" />
    <ComponentC v-else />
  </div>
</template>
```

Use `component` element with `is` attribute to render dynamic components:

```vue
<script setup>
import { computed, ref } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'
import ComponentC from './ComponentC.vue'

const currentTabIndex = ref(0)
const tabs = [
  ComponentA,
  ComponentB,
  ComponentC,
]
</script>

<template>
  // [!code highlight:2]
  <!-- Clear DOM structure -->
  <component :is="tabs[currentTabIndex]" />
</template>
```

### Async Components

<!-- TODO(Lumirelle): -->

### Component Total Usage

After learning all the above elements, now we can create a complete Vue component with props, events, slots, and model value binding:

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Define props
interface Props {
  title: string
  count?: number
}
const { count = 0 } = defineProps<Props>()

defineEmits<Emits>()
// Define emits
interface Emits {
  close: []
  submit: [message: string]
}
// Define model value binding
const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <p>Model Value: {{ modelValue }}</p>
    <button @click="$emit('submit', 'Hello from component!')">
      Submit
    </button>
    <button @click="$emit('close')">
      Close
    </button>
    <slot :count="count">
      <p>The count is: {{ count }}</p>
    </slot>
  </div>
</template>
```

How could we use this component? You know, globally register or use it locally! We use locally in this example:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import MyComponent from './MyComponent.vue'

const model = ref('Initial Model Value')
</script>

<template>
  <MyComponent
    v-model="model"
    title="My Component Title"
    :count="5"
    @submit="(message) => { console.log(message) }"
    @close="() => { console.log('Component closed') }"
  >
    <template #default="{ count }">
      <p>Custom count content: {{ count }}</p>
    </template>
  </MyComponent>
</template>
```

You may see many things here:

- `ref` function is used to create a reactive data, it's belong to [Vue's reactivity system](#reactivity-system)
- Some special attributes starting with `v-`, these are called [**directives**](#directives). `:` and `@` are shorthand syntax for `v-bind` and `v-on` directives respectively
- ...

Don't worry, just take your time to understand them one by one!

### Built-in Components

<!-- TODO(Lumirelle): -->

## Reactivity System

> [!Note]
>
> Vue team separated the reactivity system implementation into a standalone package called [`@vue/reactivity`](https://www.npmjs.com/package/@vue/reactivity). You can use it standalone without Vue.js!

The most important feature of Vue.js is its low invasive reactivity system, it manages data and states inside Vue components. So what does "reactivity" mean?

A classical example of reactivity is the formula of Excel spreadsheet: For the cell `C1` with formula `= A1 + B1`, when you change the value of cell `A1` or `B1`, the value of the cell will be updated automatically.

By this feature, we can separate the data and the logic of calculation, and only focus on the data itself. The program will take care of the rest.

### Implementing Reactivity in JavaScript

The key points of reactivity are:

- Sources of data (Cells `A1` and `B1`)
- Target of data (Cell `C1`)
- The relationship between them (Formula `C1 = A1 + B1`)
- Every time when the source data changes, the target data should be updated automatically according to the relationship.

How could we achieve this in JavaScript? First, we need some variables `C1`, `A1` and `B1`, with a update function to explain the relationship between them:

```js
let C1

function update() {
  C1 = A1 + B1
}
```

And then we need to define some terms:

- We call the update on target data `C1` made by this `update()` function as a **side effect**, because this changes the state outside of the `update` function.

  > [!Note]
  >
  > The opposite is a function that only returns a value without changing the external state. For example:
  >
  > ```js
  > function add(a, b) {
  >   return a + b
  > }
  > ```

- The source variables `A1` and `B1` are **dependencies** of the `update()` function, because the value of them are used to make that side effect.
- This side effect can be called a **subscriber** of those dependencies. When any of the dependencies change, the subscriber should be notified to update.

Then we need a magic function called `effect()`, it receive a update function, and should complete the following tasks:

```js
effect(update)
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
  > // [!code highlight:1]
  > const original = { A1: 1, B1: 2 }
  >
  > export default {
  >   data() {
  >     return {
  >       // [!code highlight:1]
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
  >       // [!code highlight:1]
  >       {{ state === original }} <!-- -> true -->
  >     </div>
  >     // [!code highlight:2]
  >     <!-- Will trigger watcher -->
  >     <button @click="state.A1 += 1">
  >       Increment A1 from State
  >     </button>
  >     // [!code highlight:2]
  >     <!-- Will also trigger watcher -->
  >     <button @click="original.A1 += 1">
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
  > // [!code highlight:2]
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
  >       // [!code highlight:1]
  >       {{ state === original }} <!-- -> false -->
  >     </div>
  >     // [!code highlight:2]
  >     <!-- Will trigger reactivity -->
  >     <button @click="state.A1 += 1">
  >       Increment A1 from State
  >     </button>
  >     // [!code highlight:2]
  >     <!-- Will NOT trigger reactivity -->
  >     <button @click="original.A1 += 1">
  >       Increment A1 from Original
  >     </button>
  >   </div>
  > </template>
  > ```

With these two methods, every time we access a property of a reactive object, the `track()` function will be called, and every time we change a property of a reactive object, the `trigger()` function will be called. 🥰 The only thing we should do is creating reactive data by them:

```js
// Vue 2.x
const state1 = {}
for (const key in state1) {
  defineReactive(state1, key)
}

// Vue 3.x
const state2 = reactive({})
```

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

// This will create a new variable `a`, and assign the current value
// of `o1.a` to it, it's not a reference to `o1.a`, so it will
// lose the reactivity.
const { a } = o1
console.log(a) // -> 0.9197939216391986
console.log(a) // -> 0.9197939216391986
```

```js
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

// This will create a new variable `b`, and assign the current value
// of `o2.b` to it, it's not a reference to `o2.b`, so it will
// lose the reactivity.
const { b } = o2
console.log(b) // -> 0.966970116437479
console.log(b) // -> 0.966970116437479
```

The same to pass the property instead of the whole object to a function, this will also lose the reactivity:

```js
function printValue(value) { // This will create a new variable `value`...
  console.log(value)
  value = 1
  console.log(value)
}
printValue(o2.b) // -> 0.123456789, 1
printValue(o2.b) // -> 0.987654321, 1
```

The best practice is to **always pass the whole reactive object around**.

### Record Subscribers and Notify Them

The next task is registering side effect subscribers during `track()` calls, and notifying them during `trigger()` calls.

Let's sort out the whole process:

1. Now we can create some reactive objects using `defineReactive()` or `reactive()`, when their properties are accessed, it will call `track()` function or `trigger()` function accordingly
2. When calling `effect(update)`, it's expected to call the update function once, accesses the reactive properties and results the related `track()` calls

Question, who are the active side effect during these `track()` calls? Yes, it's the `update()` function.

Figure these out, we know we can use a global variable `activeEffect` to store the currently active side effect.

And we also need a class `ReactiveEffect` to wrap the side effect function running, update the `activeEffect` before running and clear it after running:

```js
// This will be set to the currently active side effect before `update()` call,
// also before `track()` calls inside the execution context
// Then reset to null after the execution of `update()` function.
let activeEffect = null

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }

  run() {
    activeEffect = this
    this.fn()
    activeEffect = null
  }
}

function effect(update) {
  const e = new ReactiveEffect(update)
  e.run()
}
```

> [!Note]
>
> Effect is the core members of Vue's reactivity system, every thing we can do when reactive data changes is based on effect re-execution.
>
> For example, `v-if` directive pack DOM element creation/removal logic in an effect, so when the reactive condition changes, the effect will be re-executed to update the DOM structure accordingly...

Then, the `track()` function:

```js
function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

We stored all subscribers in a global `WeakMap<target, Map<key, Set<effect>>>` structure, `getSubscribersForProperty()` function will find the correct `Set<effect>` for that target reactive object and property key, creating them if necessary. They are simple data structure operations, so we won't go into details here.

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

// Create effect, set the `activeEffect` correctly,
// then call `update()` once, then trigger `track()` calls,
// then store this effect as a subscriber.
effect(update) // -> C1 updated: 3

// Trigger `trigger()` calls when property values are changed,
// find all of the related subscribers (effects),
// trigger the re-execution of all related effects (synchronously),
// then call `update()` again.
state.A1 = 3 // -> C1 updated: 5
state.B1 = 4 // -> C1 updated: 7
```

Don't forget to handle the case of nested objects. We can make `reactive()` function a deep reactive by calling itself when a property is object (Of course, lazily):

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      const value = target[key]
      // [!code highlight:4]
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
> This is how `reactive()` and `effect()` functions works in `@vue/reactivity` package.
>
> If you don't want to make a deep reactive, you can use `shallowReactive()` function, which only makes the top-level properties reactive. This is useful to improve performance.

> [!Note]
>
> Our simple implementation of reactivity system does not handle some edge cases, like circular references, array methods, [watcher stop](#watcher-stop), etc. The real implementation in Vue.js is more complex and robust.

### Reactive Principle Summary

In Vue.js, the track and trigger behaviors are **passive**, and attached to the access of reactive object (created by `reactive()` or `ref()`) properties. This means you don't need to track something actively, instead, just **create some reactive data as sources**.

```js
import { reactive } from '@vue/reactivity'

// Create a reactive object as the source
const source = reactive({
  name: 'Alice',
  age: 25,
})
```

When you need something to do when the reactive data changes, just **create an effect**, and put the logic inside the effect function. Vue will automatically record the dependencies and re-execute the effect when any of the dependencies change.

```js
import { effect } from '@vue/reactivity'

// Create an effect to do something when the source changes
effect(() => {
  console.log(`Name: ${source.name}, Age: ${source.age}`)
})
```

Watchers, computed properties, template directives, etc. are all built on top of this simple principle.

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

For object values, `ref()` still wraps them in this way, but also makes them reactive deeply by `reactive()`.

> [!Note]
>
> This is how `ref()` function works in `@vue/reactivity` package, and there is also a `shallowRef()` function which only makes the top-level property reactive.

> [!Note]
>
> Our simple implementation of `ref()` does not handle some edge cases too...

### Unpack

For better usability, Vue.js provides an automatic unpacking feature for `ref()` values in some cases:

- In templates, when you use a `ref()` value, Vue will automatically unpack it for you, so you can use it directly without accessing the `value` property.

  This only happens to the top-level `ref()` values.

  <!-- eslint-skip -->

  ```vue
  <script setup>
  import { ref } from '@vue/reactivity'

  // [!code highlight:2]
  const topLevelRef = ref(1)
  const nestedRef = { inner: ref(2) }
  </script>

  <template>
    // [!code highlight:2]
    <!-- topLevelRef is automatically unpacked -->
    <div v-text="topLevelRef" /> <!-- -> 1 -->

    // [!code highlight:2]
    <!-- nestedRef.inner is NOT automatically unpacked -->
    <div v-text="nestedRef.inner.value" /> <!-- -> 2 -->
  </template>
  ```

- In text interpolations, when the evaluated JavaScript expression results in a `ref()` value, Vue will automatically unpack it.

  <!-- eslint-skip -->

  ```vue
  <script setup>
  import { ref } from '@vue/reactivity'

  // [!code highlight:2]
  const topLevelRef = ref(1)
  const nestedRef = { inner: ref(2) }
  </script>

  <template>
    // [!code highlight:2]
    <!-- topLevelRef is automatically unpacked -->
    <div>{{ topLevelRef }}</div> <!-- -> 1 -->

    // [!code highlight:2]
    <!-- nestedRef.inner is automatically unpacked -->
    <div>{{ nestedRef.inner }}</div> <!-- -> 2 -->
  </template>
  ```

- In `reactive()` objects, when a property is a `ref()` value, Vue will automatically unpack it.

  This only happens when deep reactivity.

  <!-- eslint-skip -->

  ```vue
  <script setup>
  import { reactive, ref } from '@vue/reactivity'

  // [!code highlight:4]
  const refValue = ref(1)
  const state = reactive({
    a: refValue,
  })
  </script>

  <template>
    // [!code highlight:2]
    <!-- state.a is automatically unpacked -->
    <div>{{ state.a }}</div> <!-- -> 1 -->
  </template>
  ```

- The special case is when a `ref()` value is accessed as a element of `reactive()` maps and sets, the unpacking does NOT happen.

  <!-- eslint-skip -->

  ```vue
  <script setup>
  import { reactive, ref } from '@vue/reactivity'

  // [!code highlight:2]
  const refValue = ref(1)
  const state = reactive([refValue])
  </script>

  <template>
    // [!code highlight:2]
    <!-- state.[0] is NOT automatically unpacked -->
    <div>{{ state[0].value }}</div> <!-- -> 1 -->
  </template>
  ```

Notice that, unpack does not means removing the `ref()` wrapper, it's just a extra layer of convenience for users.

### Watchers and Computed Properties

With reactive data (`reactive()` and `ref()`) and effects (`ReactiveEffect`), we can build more powerful APIs on top of them, like watchers and computed properties.

```js
import { reactive, watch } from '@vue/reactivity'

const state = reactive({
  A1: 1,
  B1: 2,
})

watch(
  () => [state.A1, state.B1],
  () => {
    console.log('A1 or B1 updated:', state.A1, state.B1)
  },
  { immediate: true }
)

const C1 = computed(() => state.A1 + state.B1)
```

You can refer to the [source of `watch()` function](https://github.com/vuejs/core/blob/main/packages/reactivity/src/watch.ts#L120) and [source of `computed()` function](https://github.com/vuejs/core/blob/main/packages/reactivity/src/computed.ts#L198) for more details.

### High-Level Reactive APIs

> [!Note]
>
> These high-level APIs are implemented in the Vue core, bundled with Vue.js.

Vue.js provides more high-level APIs built on top of the reactivity system and Vue.js itself, to make it easier to use:

- [Support cleanup](#watcher-cleanup)
- [Support stop](#watcher-stop), bound the watcher lifecycle to component instance lifecycle
- [Update trigger timing control](#watcher-trigger-timing)
- Better error handling
- ...

#### Watchers

`watch()` in `vue` is a high-level version of `watch()` in `@vue/reactivity`:

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

`watchEffect()` is a variant which watches the effect itself, without specifying the source explicitly:

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

#### Watcher Cleanup

When using `watch()` or `watchEffect()`, sometimes when the source is changed, we may need to do some cleanup work to cancel the previous side effect execution. This is also not implemented in the low-level reactive APIs.

We can use the 3th argument for `watch()` callback function, or the 1st argument for `watchEffect()` function to register a cleanup function:

```js
import { watch, watchEffect } from 'vue'

watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // Clean up logic
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // Clean up logic
  })
})
```

From Vue 3.5+, there is a new API `onWatcherCleanup()`, it has more limitations, so for my opinion, it's better to use the above method.

#### Watcher Trigger Timing

When a reactive dependency is changed, both the Vue component template re-rendering and the watcher callback execution are triggered.

The high-level reactive APIs provide options to control the timing of watcher callback execution.

By default, the watcher callback is executed **after the parent component re-rendering** and **before the re-rendering of the component it belongs to**, but you can change this behavior by setting the `flush` option to one of the following values:

- `pre` (default): The watcher callback is executed before the component it belongs to re-rendering.
  ```js
  watch(source, callback, { flush: 'pre' })
  ```
- `post`: The watcher callback is executed after the component it belongs to re-rendering.
  ```js
  watch(source, callback, { flush: 'post' })
  ```
- `sync`: The watcher callback is executed synchronously immediately after the dependency is changed, before any component re-rendering.
  ```js
  watch(source, callback, { flush: 'sync' })
  ```
  > [!Warning]
  >
  > Like DOM updates, watchers are also batched by default to improve performance, except sync watchers.
  >
  > We should avoid using sync watchers on the source which may change frequently.

#### Watcher Stop

The low-level reactive APIs do not provide a simple way to stop a watcher. If a watcher is no longer needed, it may cause memory leak if we don't stop it.

Things is different in high-level reactive APIs. By default, watchers created by `watch()` and `watchEffect()` are bound to the host component instance, and will be destroyed automatically when the component is unmounted.

The exception is async watchers:

```js
import { watchEffect } from 'vue'

setTimeout(() => {
  // This watcher will NOT be destroyed automatically,
  // may cause memory leak !!!
  watchEffect(() => {
    // ...
  })
}, 1000)
```

In this case, you need to stop the watcher manually by the returned stop function:

```js
import { watchEffect } from 'vue'

setTimeout(() => {
  const stop = watchEffect(() => {
    // ...
  })

  // ...

  // Stop the watcher when it's no longer needed
  stop()
}, 1000)
```

It's not recommended to use async watchers, you'd better find a way to avoid them first, instead of stopping them manually.

#### Computed Properties

`computed()` in `vue` is also a high-level version of `computed()` in `@vue/reactivity`:

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

## Template Grammar

Vue.js uses a template syntax that is similar to HTML, but with additional features for directives, data binding, and more.

We already saw some examples of template syntax in previous sections, now let's take a closer look at the template grammar details.

### Directives

Directives are special attributes that start with `v-`, they provide special reactive behavior to the DOM elements, which means reactive data can update the DOM structure and attributes dynamically with these directives.

You may already know, they are built on top of the [reactivity system](#reactivity-system) we discussed before.

The syntax of a directive is:

```txt
directive-name:parameter.modifier="value"
```

See all Vue Directives in the [official documentation](https://vuejs.org/api/built-in-directives.html).

#### `v-if` Directive

| Parameter | Modifier | Value                           |
| --------- | -------- | ------------------------------- |
| N/A       | N/A      | A JavaScript boolean expression |

The `v-if` directive is used to conditionally render elements based on a boolean expression. If the expression evaluates to `true`, the element will be rendered; otherwise, it will not be included in the DOM.

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <div>
    // [!code highlight:6]
    <div v-if="isVisible">
      This element is visible.
    </div>
    <div v-else>
      This element is hidden.
    </div>
    <button @click="isVisible = !isVisible">
      Toggle Visibility
    </button>
  </div>
</template>
```

Like JavaScript `if` statements, you can use `v-else-if` directive to chain multiple conditions:

```vue
<script setup>
import { ref } from 'vue'

const status = ref('active')
</script>

<template>
  <div>
    // [!code highlight:9]
    <div v-if="status === 'active'">
      Status is active.
    </div>
    <div v-else-if="status === 'inactive'">
      Status is inactive.
    </div>
    <div v-else>
      Status is pending.
    </div>
    <button @click="status = 'active'">
      Set Active
    </button>
    <button @click="status = 'inactive'">
      Set Inactive
    </button>
    <button @click="status = 'pending'">
      Set Pending
    </button>
  </div>
</template>
```

#### `v-show` Directive

| Parameter | Modifier | Value                           |
| --------- | -------- | ------------------------------- |
| N/A       | N/A      | A JavaScript boolean expression |

Unlike `v-if`, the `v-show` directive always renders the element in the DOM, but toggles its visibility using CSS `display` property. It can only apply to a single element.

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <div>
    // [!code highlight:6]
    <div v-show="isVisible">
      This element is visible.
    </div>
    <button @click="isVisible = !isVisible">
      Toggle Visibility
    </button>
  </div>
</template>
```

#### `v-for` Directive

| Parameter | Modifier | Value                                                      |
| --------- | -------- | ---------------------------------------------------------- |
| N/A       | N/A      | A special expression similar to JavaScript `for...in` loop |

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
    // [!code highlight:9]
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

Different from JavaScript `for...in` loop, `v-for` directive iterates over both objects and arrays. It also use `()` to destructure multiple values instead `[]` array destructuring in JavaScript.

By default, `v-for` uses the strategy of "in-place patch" when updating the elements, for example:

<!-- eslint-skip -->

```vue
<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])
</script>

<template>
  <div>
    // [!code highlight:11]
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
    // [!code highlight:11]
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

#### `v-bind` Directive

| Parameter        | Modifier | Value        |
| ---------------- | -------- | ------------ |
| Target attribute | N/A      | Target value |

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
    // [!code highlight:15]
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
    // [!code highlight:4]
    <!-- Bind as an attribute -->
    <my-component v-bind:custom-attr.attr="value" />
    <!-- Bind as a property -->
    <my-component v-bind:custom-prop.prop="value" />
  </div>
</template>
```

Too learn about the difference between attributes and properties, please refer to [HTML manual](/posts/manual/html-advanced-grammar-manual#attributes-vs-properties).

#### `v-on` Directive

| Parameter    | Modifier                  | Value         |
| ------------ | ------------------------- | ------------- |
| Target event | See the explanation below | Event handler |

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
    // [!code highlight:15]
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

#### `v-model` Directive

| Parameter        | Modifier                  | Value         |
| ---------------- | ------------------------- | ------------- |
| Target attribute | See the explanation below | Reactive data |

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
> Default values for props are expected behavior, but not for model values.
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
> const value = ref() // -> undefined
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
> const model = defineModel({ default: 1 }) // -> 1
> </script>
>
> <template>
>   <input v-model="model" type="number">
> </template>
> ```

See more details in the [model value binding](#model-value-binding), [forms input binding](https://vuejs.org/guide/essentials/forms) and [component v-model](https://vuejs.org/guide/components/v-model) documentation.

#### `v-slot` Directive

| Parameter        | Modifier | Value         |
| ---------------- | -------- | ------------- |
| Target slot name | N/A      | Slot bindings |

The `v-slot` directive is used to pass content to slots in components:

<!-- eslint-skip -->

```vue
<script setup>
import ChildComponent from './ChildComponent.vue'
</script>

<template>
  <ChildComponent>
    // [!code highlight:9]
    <template v-slot:header>
      <h1>This is the header slot content.</h1>
    </template>
    <template v-slot:default>
      <p>This is the default slot content.</p>
    </template>
    <template v-slot:footer>
      <footer>This is the footer slot content.</footer>
    </template>
  </ChildComponent>

  <!-- Shorthand syntax -->
  <ChildComponent>
    // [!code highlight:9]
    <template #header>
      <h1>This is the header slot content.</h1>
    </template>
    <template #default>
      <p>This is the default slot content.</p>
    </template>
    <template #footer>
      <footer>This is the footer slot content.</footer>
    </template>
  </ChildComponent>
</template>
```

The binding data on slots in child components can be accessed in the returned object of `v-slot` directive:

<!-- eslint-skip -->

```vue
<script setup>
import ChildComponent from './ChildComponent.vue'
</script>

<template>
  <ChildComponent>
    // [!code highlight:9]
    <template v-slot:default="slotProps">
      <p>Message from child: {{ slotProps.message }}</p>
    </template>
  </ChildComponent>

  <!-- Shorthand syntax -->
  <ChildComponent>
    // [!code highlight:9]
    <template #default="slotProps">
      <p>Message from child: {{ slotProps.message }}</p>
    </template>
  </ChildComponent>

  <!-- Destructuring syntax -->
  <ChildComponent>
    // [!code highlight:9]
    <template #default="{ message }">
      <p>Message from child: {{ message }}</p>
    </template>
  </ChildComponent>
</template>
```

#### Custom Directives

<!-- TODO(Lumirelle): -->

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
  <!-- shorthand without value if the attribute name -->
  <!-- and the variable name are the same, from Vue 3.4+ -->
  <div :id />
</template>
```

> [!Note]
>
> We know HTML elements are themselves, so the binding attributes will attach to them directly. But for Vue components who will be transformed into the real HTML elements, the behavior is different:
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

### Template Refs

Although Vue.js handle most of the DOM manipulations for us, sometimes we may still need to access the raw DOM elements directly.

We can use template refs to get the DOM elements in Vue applications.

After Vue 3.5+ with composition API, better type support is provided by a new API `useTemplateRef()`:

```vue
<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import SubComponent from './SubComponent.vue'

// [!code highlight:3]
// Specify the ref names directly
const myDivRef = useTemplateRef('myDiv')
const mySubComponentRef = useTemplateRef('mySubComponent')

onMounted(() => {
  console.log('myDiv element:', myDivRef.value)
  console.log('mySubComponent instance:', mySubComponentRef.value)
})
</script>

<template>
  // [!code highlight:1]
  <div ref="myDiv">
    This is my div element.
  </div>
  // [!code highlight:1]
  <SubComponent ref="mySubComponent">
    This is my sub component.
  </SubComponent>
</template>
```

Before Vue 3.5 with composition API:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SubComponent from './SubComponent.vue'

// [!code highlight:2]
const myDivRef = ref<HTMLDivElement>()
const mySubComponentRef = ref<InstanceType<typeof SubComponent>>()

onMounted(() => {
  console.log('myDiv element:', myDivRef.value)
  console.log('mySubComponent instance:', mySubComponentRef.value)
})
</script>

<template>
  // [!code highlight:3]
  <!-- Must use the same name for the ref attribute -->
  <!-- and the ref variable -->
  <div ref="myDivRef">
    This is my div element.
  </div>
  // [!code highlight:1]
  <SubComponent ref="mySubComponentRef">
    This is my sub component.
  </SubComponent>
</template>
```

For options API components, we can use `this.$refs` to access the template refs:

```vue
<script>
import SubComponent from './SubComponent.vue'

export default {
  components: {
    SubComponent,
  },
  mounted() {
    // [!code highlight:2]
    console.log('myDiv element:', this.$refs.myDiv)
    console.log('mySubComponent instance:', this.$refs.mySubComponent)
  },
}
</script>

<template>
  // [!code highlight:1]
  <div ref="myDiv">
    This is my div element.
  </div>
  // [!code highlight:1]
  <SubComponent ref="mySubComponent">
    This is my sub component.
  </SubComponent>
</template>
```

For DOM elements, the ref value will be the raw DOM element. For Vue components, the ref value will be the component instance.

> [!Note]
>
> For options API components, you can easily access all of the component data and methods from the component instance. But for composition API components, you can only access the public properties and methods exposed by `expose()` function from the component instance.
>
> See more details in the [exposing public API](#exposing-public-api) section.

> [!Note]
>
> For `v-for` loops, the ref value will be an array of DOM elements or component instances.
>
> ```vue
> <script setup lang="ts">
> import { ref } from 'vue'
>
> const items = ref([
>   { id: 1, name: 'Item 1' },
>   { id: 2, name: 'Item 2' },
>   { id: 3, name: 'Item 3' },
> ])
> const itemsRef = useTemplateRef('itemsRef')
> </script>
>
> <template>
>   <div>
>     <div v-for="item in items" :key="item.id" :ref="itemsRef">
>       {{ item.name }}
>     </div>
>     {{ Array.isArray(itemsRef.value) }} <!-- -> true -->
>   </div>
> </template>
> ```

### Differences With Browser DOM

The grammar of Vue.js component templates are not exactly the same as normal browser DOM, there are some differences we should know **if you use browser DOM to produce the component templates**:

- In HTML, there is no real self-closing tags:

  > If a trailing / (slash) character is present in the start tag of an HTML element, HTML parsers ignore that slash character. -- [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Void_element#self-closing_tags)

  So, `<div />Hello!` is a invalid HTML, and browsers will treat it as `<div>Hello!`, and render as `<div>Hello!</div>`, with inferred closing tag.

  For [void elements](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) like `<input>`, the trailing slash is also ignored by browsers. That's to say, `<input id="my-input" />` is just equivalent to `<input id="my-input">` in HTML.

  <table><tbody><tr><td width="500px" valign="top">

  _Source_

  <!-- eslint-skip -->

  ```html
  <div>
    <div />Hello!
    <input id="my-input" />
  </div>
  ```

  </td><td width="500px" valign="top">

  _Rendered HTML_

  <!-- eslint-skip -->

  ```html
  <div>
    <div>Hello!</div>
    <input id="my-input">
  </div>
  ```

  </td></tr></tbody></table>

  Vue.js templates are not the same, they support self-closing tags for all elements, including non-void elements:

  <table><tbody><tr><td width="500px" valign="top">

  _Source_

  <!-- eslint-skip -->

  ```vue
  <template>
    <div>
      <div />Hello!
      <input id="my-input" />
    </div>
  </template>
  ```

  </td><td width="500px" valign="top">

  _Rendered HTML_

  <!-- eslint-skip -->

  ```html
  <div>
    <div></div>
    Hello!
    <input id="my-input">
  </div>
  ```

  </td></tr></tbody></table>

## Compatibility

As a modern front-end framework, Vue.js aims to provide better compatibility for different browsers and environments.

### Style Vendor Prefixing

When you using `v-bind` to bind styles, Vue will automatically add vendor prefixes to the styles for better browser compatibility.

This is a runtime behavior. If the current browser does not support that style attribute, Vue will add all of the available vendor prefixes to it.

## Vue Plugins

<!-- TODO(Lumirelle):  -->
