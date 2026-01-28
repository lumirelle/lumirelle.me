---
title: HTML Advanced Grammar Manual
date: 2026-01-28T11:46+08:00
update: 2026-01-28T11:46+08:00
lang: en
duration: na
type: note
---

[[toc]]

## Attributes vs. Properties

In HTML, the most common confusion is between attributes and properties.

### Attributes

Attributes are actually **content attributes**, which are defined in the HTML content directly, for example:

```html
<input type="text" value="Hello" />
```

In this example, `type` and `value` are attributes of the `<input>` element.

### Properties

Properties are actually **IDL (Interface Definition Language) attributes**, which are meant to be used by programming languages, and we can access them through JavaScript DOM API, for example:

```javascript
const inputElement = document.querySelector('input')
console.log(inputElement.value) // Accessing the 'value' property
```

### Synchronization between Attributes and Properties

By default, when an HTML element is created, the attributes are used to initialize the corresponding properties, for example:

```html
<img id="myImage" src="image.jpg" />
<script>
  const imageElement = document.querySelector('img')
  console.log(imageElement.getAttribute('src')) // -> image.jpg
  console.log(imageElement.src) // -> image.jpg

  // Updating the 'src' property, both attribute and property will be changed
  imageElement.src = 'new-image.jpg'
  console.log(imageElement.getAttribute('src')) // -> new-image.jpg
  console.log(imageElement.src) // -> new-image.jpg
</script>
```

In this example, the `src` attribute initializes the `src` property of the `<img>` element, and updating the property will also update the attribute.

But there are some notices and exceptions:

- Only standard attributes will synchronize with properties. Custom attributes will not.

  ```html
  <div id="myDiv" custom-attr="customValue"></div>
  <script>
    const divElement = document.querySelector('#myDiv')
    console.log(divElement.getAttribute('custom-attr')) // -> customValue
    console.log(divElement.customAttr) // -> undefined

    // Updating the custom attribute
    divElement.customAttr = 'newValue'
    console.log(divElement.getAttribute('custom-attr')) // -> customValue
    console.log(divElement.customAttr) // -> newValue
  </script>
  ```

- Some attributes are synchronize with properties with different names.

  For example, the `class` attribute corresponds to the `className` property in JavaScript:

  ```html
  <div id="myDiv" class="my-class"></div>
  <script>
    const divElement = document.querySelector('#myDiv')
    console.log(divElement.getAttribute('class')) // -> my-class
    console.log(divElement.className) // -> my-class
  </script>
  ```

  The `value` attribute of an `<input>` element corresponds to the `defaultValue` property, and only applies to `value` property when the first time element has been initialized:

  ```html
  <input id="myInput" type="text" value="Initial Value" />
  <script>
    const inputElement = document.querySelector('#myInput')
    console.log(inputElement.getAttribute('value')) // -> Initial Value
    console.log(inputElement.defaultValue) // -> Initial Value
    console.log(inputElement.value) // -> Initial Value

    // Updating the 'value' property
    inputElement.value = 'Changed Value'
    console.log(inputElement.getAttribute('value')) // -> Initial Value
    console.log(inputElement.defaultValue) // -> Initial Value
    console.log(inputElement.value) // -> Changed Value

    // Updating the 'defaultValue' property
    inputElement.defaultValue = 'New Default Value'
    console.log(inputElement.getAttribute('value')) // -> New Default Value
    console.log(inputElement.defaultValue) // -> New Default Value
    console.log(inputElement.value) // -> Changed Value
  </script>
  ```

- Attributes prefixed with `data-` will synchronize with the sub-property of `dataset` property.

  ```html
  <div id="myDiv" data-info="someData"></div>
  <script>
    const divElement = document.querySelector('#myDiv')
    console.log(divElement.dataset.info) // -> someData
  </script>
  ```
