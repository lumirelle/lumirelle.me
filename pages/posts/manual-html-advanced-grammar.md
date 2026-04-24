---
title: HTML Advanced Grammar Manual
date: 2026-01-28T11:46+08:00
update: 2026-04-25T01:21+08:00
lang: en
duration: 5min
type: manual
---

[[toc]]

## Introduction

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It consists of:

- **Doctypes**: Declarations that specify the HTML version being used, placed at the beginning of the document.
- **Elements**: The building blocks of HTML, represented by **tags** (e.g., `<div>`, `<p>`, `<a>`).
- **Attributes**: Define the characteristics of an HTML element, specified within the opening tag.
- **Properties**: Properties of HTML elements that can be accessed and manipulated through JavaScript, some of properties are [synchronized with attributes, but not all](#synchronization-between-attributes-and-properties).
- **Content**: The text contained within an HTML element.
- **Scripts and Styles**: Embedded or linked JavaScript and CSS code that adds interactivity and styling to the web page.

## Doctypes

**Doctypes** are used to specify **the version of HTML** being used in the document. Since HTML 5 was introduced in 2014, there is no reason for us to use older versions (like HTML 4.01, XHTML 1.1, etc.).

- HTML 5 (Modern and recommended):

  ```html
  <!DOCTYPE html>
  ```

- HTML 4.01:

  ```html
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
  ```

- XHTML 1.1:

  ```html
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  ```

> [!Note]
>
> Thoughs the doctype declaration is not case-sensitive, it's still recommended to use uppercase for the `DOCTYPE` keyword, it's a kind of agreed convention in the ecosystem.

## Elements

**Elements** are represented by **tags**: We write tags in HTML document, and the browser will parse them into elements. You can think of **elements as instances**, and **tags as their definitions**.

### Common Tags

Container tags:

- `<div>`: A container element which only make content exclusive line;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <div>123</div><div>123</div>
  ```

  </th><th flex-1 valign="top">

  Preview

  <div>123</div><div>123</div>

  </th></tr>

  </tbody></table>


- `<span>`: A container element without any function, the content will still be inline;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <span>123</span><span>123</span>
  ```

  </th><th flex-1 valign="top">

  Preview

  <span>123</span><span>123</span>

  </th></tr>

  </tbody></table>

- `<ul>` + `<li>`: Unordered list and list item elements, better than `<div>` to express the relationship between items and their container;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  ```

  </th><th flex-1 valign="top">

  Preview

  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>

  </th></tr>

  </tbody></table>

- `<ol>` + `<li>`: Ordered list and list item elements, better than `<div>` to express the relationship between items and their container, but seldom used in practice than `<ul>`;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
  </ol>
  ```

  </th><th flex-1 valign="top">

  Preview

  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
  </ol>

  </th></tr>

  </tbody></table>

Text tags:

- `<h1>` ~ `<h6>`: Heading elements, where `<h1>` is the most important and `<h6>` is the least important;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
  ```

  </th><th flex-1 valign="top">

  Preview

  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>

  </th></tr>

  </tbody></table>

- `<p>`: Paragraph element, which will make content exclusive line and add some margin;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <p>This is a paragraph.</p><p>This is another paragraph.</p>
  ```

  </th><th flex-1 valign="top">

  Preview

  <p>This is a paragraph.</p><p>This is another paragraph.</p>

  </th></tr>

  </tbody></table>

- `<a>`: Anchor element, which is used to create hyperlinks or anchor points;

   <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <a href="https://www.example.com">This is a link</a>
  ```

  </th><th flex-1 valign="top">

  Preview

  <a href="https://www.example.com">This is a link</a>

  </th></tr>

  </tbody></table>

## Attributes vs. Properties

In HTML, the most common confusion is between attributes and properties.

### Attributes

We know tags will be parsed into elements when browsers render the HTML document, and the attributes of the tags will be used to control the characteristics of the elements, for example:

```html
<input type="text" value="Hello" />
```

In this example, browsers will create an text `<input>` element with default value "Hello".

When the attributes change, the characteristics of the element will also change, so browsers will update the element when attributes are updated, for example:

<table><tbody>

<tr flex flex-col><th valign="top">

Code

```html
<input id="myInput" type="text" value="Hello" />
<button onclick="document.querySelector('#myInput').setAttribute('type',Math.random()>0.5?'password':'text')">
  Change Type
</button>
```

</th><th valign="top">

Preview

<input id="myInput" type="text" value="Hello" />
<button onclick="document.querySelector('#myInput').setAttribute('type',Math.random()>0.5?'password':'text')">
  Change Type
</button>

</th></tr>

</tbody></table>

### Properties

Properties are actually **IDL (Interface Definition Language) attributes**, which are meant to be used by programming languages, and we can access them through JavaScript DOM API, for example:

```javascript
const inputElement = document.querySelector('input')
console.log(inputElement.value) // Accessing the 'value' property
```

### Synchronization Between Attributes and Properties

By default, when an HTML element is created, the attributes are used to initialize the **corresponding (not necessary with the same name)** properties, for example:

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

In this example, the `src` attribute initializes the `src` property of the `<img>` element.

After initialization, the synchronization between attributes and properties is not guaranteed, and it depends on the specific attribute/property pair:

- Only **standard attributes** will synchronize with properties. **Custom attributes** will not.

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

- Some attributes are synchronize with properties **with different names**.

  For example, the `class` attribute corresponds to the `className` property in JavaScript:

  ```html
  <div id="myDiv" class="my-class"></div>
  <script>
    const divElement = document.querySelector('#myDiv')
    console.log(divElement.getAttribute('class')) // -> my-class
    console.log(divElement.className) // -> my-class
  </script>
  ```

  The `value` attribute of an `<input>` element corresponds to the `defaultValue` property, and the `defaultValue` property only applies to `value` property when the first time element has been initialized (or reset?):

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
