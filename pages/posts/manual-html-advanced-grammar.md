---
title: HTML Advanced Grammar Manual
date: 2026-01-28T11:46+08:00
update: 2026-06-25T14:14+08:00
lang: en
duration: 17min
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
- **External Resources**: External files that can be linked to an HTML document, such as CSS stylesheets, images, JavaScript files, etc.

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

For better consistency, we **use the term "element" to refer both the tag and the element**, except when we need to distinguish them.

### Common Elements

#### Container Elements

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

- `<ul>` + `<li>`: An unordered list and list item elements, better than `<div>` to express the relationship between items and their container;

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

- `<ol>` + `<li>`: An ordered list and list item elements, better than `<div>` to express the relationship between items and their container, but seldom used in practice than `<ul>`;

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

#### Text Elements

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

- `<p>`: A paragraph element, which will make content exclusive line and add some margin;

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

- `<a>`: An anchor element, which is used to create hyperlinks or anchor points;

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

- `<strong>`: A strong importance element, which will make text bold, better than `<b>` in semantics;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <strong>This text is important.</strong>
  ```

  </th><th flex-1 valign="top">

  Preview

  <strong>This text is important.</strong>

  </th></tr>

  </tbody></table>

- `<em>`: An emphasis element, which will make text italic, better than `<i>` in semantics;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <em>This text is emphasized.</em>
  ```

  </th><th flex-1 valign="top">

  Preview

  <em>This text is emphasized.</em>

  </th></tr>

  </tbody></table>

- `<del>`: A deleted text element, which will make text with strikethrough, better than `<s>` or explicitly set CSS style `text-decoration: line-through` in semantics;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <del>This text is deleted.</del>
  ```

  </th><th flex-1 valign="top">

  Preview

  <del>This text is deleted.</del>

  </th></tr>

  </tbody></table>

#### Form & Control Elements

- `<form>`: A form element, which is used to collect user input and submit it to a server;

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <form action="/submit" method="post">
    <div>
      <input type="text" name="username">
    </div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
  ```

  </th><th flex-1 valign="top">

  Preview

  <form space-y-4 action="/submit" method="post">
    <div>
      <input type="text" name="username">
    </div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>

  </th></tr>

  </tbody></table>

- `<input>`: An input element, which is used to create interactive controls for `<form>` fields to accept data from the user, so it often be placed inside a `<form>` element.

  `<input>` has many types, such as `text`, `password`, `checkbox`, `radio`, etc, you can refer to [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types) for more details.

  `<input>` uses `name` attribute to specify the form field name.

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <!-- Frequently Used Input Types -->
  <div>
    <input type="text" placeholder="Enter your name">
  </div>
  <div>
    <input type="number" min="0" max="100">
  </div>
  <div>
    <input type="password" placeholder="Enter your password">
  </div>
  <div>
    <input type="date">
  </div>
  <div>
    <input type="datetime-local">
  </div>
  <div>
    <input type="checkbox" name="remember" value="day"> Remember me at least for a day
  </div>
  <div>
    <input type="checkbox" name="remember" value="week"> Remember me at least for a week
  </div>
  <div>
    <input type="radio" name="gender" value="male"> Male
  </div>
  <div>
    <input type="radio" name="gender" value="female"> Female
  </div>
  <div>
    <input type="color">
  </div>
  <div>
    <input type="file">
  </div>
  <div>
    <input type="range" min="0" max="100">
  </div>
  <div>
    <input type="search">
  </div>
  ```

  </th><th flex-1 valign="top">

  Preview

  <div space-y-4>
    <div>
      <input type="text" placeholder="Enter your name">
    </div>
    <div>
      <input type="number" min="0" max="100">
    </div>
    <div>
      <input type="password" placeholder="Enter your password">
    </div>
    <div>
      <input type="date">
    </div>
    <div>
      <input type="datetime-local">
    </div>
    <div>
      <input type="checkbox" name="remember" value="day"> Remember me at least for a day
    </div>
    <div>
      <input type="checkbox" name="remember" value="week"> Remember me at least for a week
    </div>
    <div>
      <input type="radio" name="gender" value="male"> Male
    </div>
    <div>
      <input type="radio" name="gender" value="female"> Female
    </div>
    <div>
      <input type="color">
    </div>
    <div>
      <input type="file">
    </div>
    <div>
      <input type="range" min="0" max="100">
    </div>
    <div>
      <input type="search">
    </div>
  </div>

  </th></tr>

  </tbody></table>

- `<textarea>`: A textarea element, which is used to create a multi-line text input control, it often be placed inside a `<form>` element too.

  `<textarea>` has attributes like `rows` and `cols` to specify the visible size of the textarea.

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <div>
    <textarea rows="4" cols="50"></textarea>
  </div>
  ```

  </th><th flex-1 valign="top">

  Preview

  <div>
    <textarea rows="4" cols="50"></textarea>
  </div>

  </th></tr>

  </tbody></table>

- `<select>` + `<option>`: A select element and option element, which are used to create a drop-down list, they often be placed inside a `<form>` element too.

  `<select>` can have `multiple` attribute to allow multiple selections, and each `<option>` can have `value` attribute to specify the value of the option.

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <div>
    <select name="fruits">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  </div>
  ```

  </th><th flex-1 valign="top">

  Preview

  <div>
    <select name="fruits">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  </div>

  </th></tr>

  </tbody></table>

- `<label>`: A label element, which is used to define a label for an `<input>` element, it often be placed inside a `<form>` element too.

  `<label>` can be associated with an `<input>` element through `for` attribute, and the value of `for` attribute should be the same as the `id` of the `<input>` element.

  > [!Note]
  >
  > You can place the `<label>` element before or after the `<input>` element, but it's **not recommended to wrap the `<input>` element with `<label>` element**, because it will make the structure of the form more complex and less readable.

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <div>
    <!-- `<label>` before `<input>` -->
    <label for="username1">Username:</label>
    <input id="username1" type="text" name="username">
  </div>
  <div>
    <!-- `<input>` before `<label>` -->
    <input id="username2" type="text" name="username">
    <label for="username2">Username:</label>
  </div>
  <div>
    <!-- NOT RECOMMENDED -->
    <label>
      Username:
      <input type="text" name="username">
    </label>
  </div>
  ```

  </th><th flex-1 valign="top">

  Preview

  <div space-y-4>
    <div>
      <!-- `<label>` before `<input>` -->
      <label for="username1">Username:</label>
      <input id="username1" type="text" name="username">
    </div>
    <div>
      <!-- `<input>` before `<label>` -->
      <input id="username2" type="text" name="username">
      <label for="username2">Username:</label>
    </div>
    <div>
      <!-- NOT RECOMMENDED -->
      <label>
        Username:
        <input type="text" name="username">
      </label>
    </div>
  </div>

  </th></tr>

  </tbody></table>

- `<button>`: A button element, which is used to create clickable buttons. It has three types: `submit`, `reset`, and `button`.

  `submit` type will trigger form submission, `reset` type will reset the form to its initial state, these two types are often be placed inside a `<form>` element too, while `button` type has no default behavior, so it can be used anywhere.

  > [!Caution]
  >
  > The default type of `<button>` element is `submit`, please never forget to explicitly set `type="button"` for `<button>` element if you don't want it to trigger form submission!

  > [!Note]
  >
  > `<input>` element has corresponding type as button, such as `<input type="submit">`, but `<button>` element supports inner content, so it's more flexible and recommended to use.

  <table><tbody>

  <tr flex gap-4><th flex-1 valign="top">

  Code

  ```html
  <div>
    <button type="submit">Submit</button>
  </div>
  <div>
    <button type="reset">Reset</button>
  </div>
  <div>
    <button type="button" onclick="alert('Button clicked!')">Click Me</button>
  </div>
  ```

  </th><th flex-1 valign="top">

  Preview

  <div space-y-4>
    <div>
      <button type="submit">Submit</button>
    </div>
    <div>
      <button type="reset">Reset</button>
    </div>
    <div>
      <button type="button" onclick="alert('Button clicked!')">Click Me</button>
    </div>
  </div>

  </th></tr>

  </tbody></table>

#### Script & Style & External Resource Elements <a name="script-style-external-resource-elements"></a>

- `<script>`: A script element, which is used to embed or reference JavaScript code in the HTML document.

  [Modern browsers](https://caniuse.com/es6-module) support ESM (ECMAScript Modules) in `<script>` element, so you can use `type="module"` attribute to enable module mode, and use `import` statement to import other modules.

  Code

  ```html
  <!-- Embedding JavaScript code -->
  <script>
    console.log('Hello, World!');
  </script>

  <!-- Referencing external JavaScript file -->
  <script src="script.js"></script>

  <!-- Using ESM in script element -->
  <script type="module">
    import { myFunction } from './module.js';
    myFunction();
  </script>
  ```

- `<style>`: A style element, which is used to embed CSS styles in the HTML document.

  Code

  ```html
  <style>
    body {
      background-color: lightblue;
    }
    h1 {
      color: white;
      text-align: center;
    }
  </style>
  ```

- `<link>`: A link element, which is used to reference external resources, such as CSS files, icons, etc.

  `rel` attribute is used to specify the relationship between the current document and the linked resource, you can refer to [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel).

  Code

  ```html
  <!-- Referencing external CSS file -->
  <link rel="stylesheet" href="styles.css">

  <!-- Referencing favicon -->
  <link rel="icon" href="favicon.ico">
  ```

### Void Elements & Non-Void Elements

In HTML, there are two types of elements: [**void elements**](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) and **non-void elements**.

Void elements have only a start tag and do not have an end tag, they cannot contain any content, for example:

```html
<img src="image.jpg">
<input type="text">
<br>
<hr>
```

Non-void elements have both a start tag and an end tag, they can contain content, for example:

```html
<div>This is a div element.</div>
<p>This is a paragraph element.</p>
<a href="https://www.example.com">This is a link element.</a>
```

> [!Caution]
>
> There is no concept of **"self-closing tag"** in HTML, if you write a "self-closing tag" like `<img src="image.jpg" />`, what the browser does is just simply ignore the `/` character, and treat it as `<img src="image.jpg">`.

## Attributes vs. Properties

In HTML, the most common confusion is between attributes and properties.

### Attributes

We know tags will be parsed into elements when browsers render the HTML document, and the attributes of the tags will be used to control the characteristics of the elements, for example:

```html
<input type="text" value="Hello">
```

In this example, browsers will create an text `<input>` element with default value "Hello".

When the attributes change, the characteristics of the element will also change, so browsers will update the element when attributes are updated, for example:

<table><tbody>

<tr flex flex-col><th valign="top">

Code

```html
<input id="myInput" type="text" value="Hello">
<button onclick="document.querySelector('#myInput').setAttribute('type',Math.random()>0.5?'password':'text')">
  Change Type
</button>
```

</th><th valign="top">

Preview

<input id="myInput" type="text" value="Hello">
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
<img id="myImage" src="image.jpg">
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
  <input id="myInput" type="text" value="Initial Value">
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


## How Browsers Render HTML?

### The Process of Rendering HTML

1.  After user entered URL in browser and start navigation, the browser process will notify the network process to request HTML document from the server.
2.  While receiving the HTML content from the network process, the browser process will entrust renderer process to **steaming parse** the HTML content **segment-by-segment and incrementally**;
3.  When renderer process parses the HTML, it will parse the HTML content from top to bottom:
    1.  It will maintain two trees: **DOM (Document Object Model) tree** and **CSSOM (CSS Object Model) tree**;
    2.  When it encounters **a normal HTML tag** while parsing HTML, it will create a corresponding DOM element based on the tag and attributes, and insert the element into the DOM tree;
    3.  When it encounters **a synchronous inlined `<script>` tag** while parsing HTML, it will pause the parsing and start to execute the JavaScript code, and then resume parsing after the script execution is completed. Because JavaScript can modify the DOM tree & CSSOM tree, should be executed directly.

        For **a synchronous remote `<script src="...">` tag**, it will entrust network process to download the file, and pause the parsing until the external JavaScript file is both downloaded and executed (unless it's dynamically inserted by JavaScript code, then it will be treated as asynchronous script);

        For **a asynchronous `<script src="..." async>` tag**, it will no longer pause the parsing while downloading, but pause the parsing and executing the script as soon as it's downloaded;

        For **a defer `<script src="..." defer>` tag**, it will not pause the parsing while downloading too, and only be executed after the parsing is completed (but before the `DOMContentLoaded` event is fired);

        For **a module `<script type="module" src="...">` tag**, it will behave like a defer script by default.
    4.  When it encounters **a inlined `<style>` tag** while parsing HTML, it will change to parse all the CSS content into CSSOM one time and in place.
    5.  When it encounters **a [external resource](#script-style-external-resource-elements) referred by `<link>` tag**, it will entrust network process to download the resource, and never pause the parsing;

        If the external resource is a CSS file `<link rel="stylesheet" href="...">`, it will change to parse CSS into CSSOM (CSS Object Model) after the CSS file is downloaded.
    6.  When there is no more render-blocking tasks: No not downloaded `<link rel="stylesheet">` tags, or downloaded but not parsed `<link rel="stylesheet">` tags, it will conjunct them into a **render tree**, and then **calculate the layout**, **paint the page** and **composite the layers**.

        The first painting was so-called **First Contentful Paint (FCP)**. After that, if there are any changes in the DOM tree or CSSOM tree, the browser will do **redraw and reflow**.
4.  After the whole HTML parsed (also, **all deferred scripts are downloaded and executed**), the browser process will fire `DOMContentLoaded` event, then fire `load` event after all the resources are loaded, and display the page to users.

### Why Browser Build Two Separate Trees for DOM and CSSOM?

Why browsers build two separate trees for DOM and CSSOM, conjunct them later, instead of building a single tree that combines both DOM and CSSOM?

1. They have different structures, DOM tree is a parent-child tree, while CSSOM tree is more like a flat list. If you build them together, that means you may need to maintain many copies of CSS styles for different DOM elements.
2. What's worse, if you do not build them separately, it will be hard to reuse information when the browser wants to redraw and reflow the page. For example, if we build a single tree, how can we deal with the situation when there are some additional elements with the same selector with the previous parsed CSS styles? Parse them again? What a waste of performance.

### Performance of Rendering HTML

What affects the performance of rendering HTML?

1. **The size of the HTML document**: The larger the HTML document, the **more time it takes todownload**;
2. **The number / complexity of DOM elements**: The more / more complex DOM elements, the **more time it takes to parse** HTML (create and insert elements into the DOM tree);
3. **The number / complexity of synchronous `<script>` tags**: Each synchronous `<script>` tag will **pause the parsing** and (**download if it's remote**) execute the JavaScript code, which can significantly affect the performance of parsing HTML, especially if the JavaScript code is large or complex;
4. **The number / complexity of external `<link rel="stylesheet">` tags**: Each external CSS file will **pause the parsing** and (**download**) parse the CSS code into CSSOM tree, which can significantly affect the performance of parsing HTML, especially if the CSS code is large or complex;
5. **The number / complexity of CSS rules**: The task of parsing CSS is also done by the rendering process. The more / more complex CSS rules, the **more time it takes on rendering process** (to parse them into CSSOM tree), the more time it takes to conjunct DOM tree and CSSOM tree, and the more time the whole parsing process takes.
6. **The number / size of other external resources**: Although external resources will not pause the parsing, they still **take the download time and download bandwidth**, which can affect the performance of download HTML document, remote scripts and CSS files, and the performance of parsing HTML indirectly.

What's the best practice?

1. [**14 KiB rule**](https://medium.com/@techworldthink/the-14-kb-rule-optimizing-the-critical-rendering-path-for-faster-websites-cd6d9e93b186): Keep the HTML document under 14 KiB;
2. **Keep everything as simple as possible**:
   1. Reduce the usage of unnecessary wrapper elements, such as `<div>` and `<span>`;
   2. Reduce the usage of `<script>`, remove if unused, `async` if possible, `defer` if it can be async but still depends on the DOM tree;
   3. Reduce the usage of `<link rel="stylesheet">`, remove if unused, `media` if possible, and combine them into a single file if possible (increase the stability when downloading);
   4. Reduce the usage of CSS rules, remove if unused, and keep them as simple as possible **(please try atomic CSS framework!!!)**;
   5. Reduce the usage of external resources, remove if unused, apply compression and caching if possible.
3. ...
