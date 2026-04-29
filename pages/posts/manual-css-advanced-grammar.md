---
title: CSS Advanced Grammar Manual
date: 2026-04-26T20:56+08:00
update: 2026-04-26T20:56+08:00
lang: en
duration: 0min
type: manual
---

[[toc]]

## Introduction

CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of a document written in HTML or XML. The core concepts of CSS are:

- **Selectors**: Used to select the elements to which the styles will be applied;
- **Properties & Values (with Units)**: Used to specify the styles to be applied to the selected elements;
- **Layers & Specificity**: Used to determine which styles will be applied when there are conflicting styles.
- **Variables**: Used to store values that can be reused throughout the stylesheet;
- **Functions**: Used to perform calculations or manipulate values in the stylesheet;
- **Media Queries**: Used to apply styles based on the characteristics of the device or viewport.

The common uses of CSS are:

- **Layouts**: Used to control the layout of the elements on the page, such as normal flow, flexbox and grid;

## Selectors

### How Browser Match Nested Selectors?

When the browser matches nested selectors, it starts **from the rightmost** selector and **moves leftwards**. For example, for the selector `.parent .child`, the browser will first look for elements with the class `child`, and then check if they have a parent element with the class `parent`. **This has better performance than starting from the leftmost selector**.

## Properties & Values

### Display

The `display` property is used to control whether an element is **treated as a block or inline box** and **the layout used for its children**, it supports both the legacy **single-value syntax** and new [**multiple-value syntax**](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Multi-keyword_syntax).

> [!Note]
> Currently you gain no benefit from using the multiple-value versions, as there is a direct mapping for each multi-keyword version to a legacy version, as demonstrated in the table above.
>
> What's more, the multiple-value versions still has [limited browser compatibility](https://caniuse.com/mdn-css_properties_display_multi-keyword_values).

The full acceptable & **useful** & **widely supported** values for the `display` property are as follows:

| Short (Single) Value | Full (Multiple) Value | Description |
| --- | --- | --- |
| `none` | / | The element will be removed from the document |
| `content` | / | The element will be replaced by it's content |
| `block` | `block flow` | The element will be displayed as a **block-level [block container](https://drafts.csswg.org/css-display/#block-container)**, aka [**block box**](https://drafts.csswg.org/css-display/#block-box) |
| `flow-root` | `block flow-root` | The element will be displayed as a **block-level [block container](https://drafts.csswg.org/css-display/#block-container)**, aka [**block box**](https://drafts.csswg.org/css-display/#block-box), and establish a new **BFC (Block Formatting Context)** |
| `inline` | `inline flow` | The element will be displayed as an [**inline inline box**](https://drafts.csswg.org/css-display/#inline-box) |
| `inline-block` | `inline flow-root` | The element will be displayed as an **inline-level [block container](https://drafts.csswg.org/css-display/#block-container)**, aka **inline block** |
| `flex` | `block flex` | The element will be displayed as a **block-level [flex container](https://drafts.csswg.org/css-flexbox-1/#flex-container)** |
| `inline-flex` | `inline flex` | The element will be displayed as an **inline-level [flex container](https://drafts.csswg.org/css-flexbox-1/#flex-container)** |
| `grid` | `block grid` | The element will be displayed as a **block-level [grid container](https://drafts.csswg.org/css-grid-2/#grid-container)** |
| `inline-grid` | `inline grid` | The element will be displayed as an **inline-level [grid container](https://drafts.csswg.org/css-grid-2/#grid-container)** |
| ~~`table`~~ | ~~`block table`~~ | ~~The element will be displayed as a **block-level [table container](https://drafts.csswg.org/css-tables-3/#table-wrapper-box)**.~~ In practice, we'd better use `flex` or `grid` instead of `table`. |
| ~~`inline-table`~~ | ~~`inline table`~~ | ~~The element will be displayed as an **inline-level [table container](https://drafts.csswg.org/css-tables-3/#table-wrapper-box)**.~~ In practice, we'd better use `flex` or `grid` instead of `table`. |

The multiple values list above can be separated into below categories:

- Outside: These keywords specify the element's outer display type;
  - `block`
  - `inline`

  > [!Note]
  > When a display property is specified with **only an outer value** (e.g., `display: block` or `display: inline`), the inner value defaults to `flow` (e.g., `display: block flow` and `display: inline flow`).

  > [!Note]
  > When use single-value syntax as a

- Inside: These keywords specify the element's inner display type, which defines the type of formatting context that its contents are laid out in (assuming it is a non-replaced element);
  - `flow`
  - `flow-root`
  - `flex`
  - `grid`
  - `table`

  > [!Note]
  > When a display property is specified with only an inner value (e.g., `display: flex` or `display: grid`), the outer value defaults to block (e.g., `display: block flex` and `display: block grid`).

- Box: These values define whether an element generates display boxes at all.
  - `none`
  - `contents`

Please refer to [layouts section](#layouts) for more details about the uses.

## Layers & Specificity

Layers & Specificity are the core features of CSS that allow multiple styles to be applied to the same element, and determine which styles will be applied when there are conflicting styles.

When two conflicting styles **are in different layers**, they will be applied according to the following order:

1. **Unlayered styles** first;

    ```css
    /* Layered style */
    @layer example-layer {
      .example {
        color: blue;
      }
    }

    /* Unlayered style WIN 🏆 */
    .example {
      color: red;
    }
    ```

2. **Layered styles** follow the order of declaration, the earlier declared layer will have higher precedence than the later declared layer;

    _src/assets/explicitly-declared-layers.css_

    ```css
    /* Layers Declaration */
    @layer example-layer1, example-layer2;

    /* Layered style */
    @layer example-layer2 {
      .example {
        color: blue;
      }
    }

    /* Layered style declared earlier WIN 🏆 */
    @layer example-layer1 {
      .example {
        color: red;
      }
    }
    ```

    _src/assets/implicitly-declared-layers.css_

    ```css
    /* Layered style declared earlier WIN 🏆 */
    @layer example-layer1 {
      .example {
        color: red;
      }
    }

    /* Layered style */
    @layer example-layer2 {
      .example {
        color: blue;
      }
    }
    ```

Only if these two styles are **in the same layer**, they will be applied according to the specificity of their selectors. The **more specific selector** will have **higher precedence** and will be applied, and the specificity of each type of selector is calculated as follows:

| Selector Type | Specificity Value (256-base, questionable) |
| --- | --- |
| Inline styles | 1000 |
| ID selectors | 100 |
| Class selectors, attribute selectors, pseudo-classes | 10 |
| Type selectors, pseudo-elements | 1 |
| Universal selector, combinators, negation pseudo-class | 0 |

When two conflicting styles are **in the same layer and have the same specificity**, the one **declared later** will be applied.

## Layouts

### Flex

Flex layout is a **one-dimensional** layout, helps us to arrange items in a row or column.

It has two main components: **flex container** and **flex items**. The flex container is the parent element that has `display: flex` or `display: inline-flex`, and the flex items are the child elements of the flex container.

#### Flex Container

Flex container has two axes: the **main axis** and the **cross axis**.

<a name="flex-direction"></a> The main axis is defined by the `flex-direction` property, and the cross axis is perpendicular to the main axis.

_flex-direction: row, default, main axis is in horizontal direction_

<div m-auto flex justify-center items-center w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div absolute left-50% transform -translate-x-50% top-0 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Cross Axis</div>
  <div absolute top-50% transform -translate-y-50% left-0 right-0 h-1 bg-emerald>Main Axis</div>
</div>

_flex-direction: column, main axis is in vertical direction_

<div m-auto flex flex-col justify-center items-center w-100 h-100 bg-blue relative>
  <div absolute top-50% transform -translate-y-50% left-0 right-0 h-1 bg-violet>Cross Axis</div>
  <div absolute left-50% transform -translate-x-50% top-0 bottom-0 w-1 bg-emerald style="writing-mode: vertical-lr;">Main Axis</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
</div>

<a name="flex-wrap"></a> By default, the flex items will be laid out in a single line, and they will overflow the flex container if there are too many items. To allow the flex items to wrap onto **multiple lines**, we can use the `flex-wrap` property.

_flex-wrap: nowrap_

<div m-auto flex gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>5</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>6</div>
</div>

_flex-wrap: wrap, allow flex items to wrap onto multiple lines_

<div m-auto flex flex-wrap gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>5</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>6</div>
</div>

Why we say flex layout is a one-dimensional layout? Because flex items in flex layout are **only have their own sub cross axis**, but **shared one main axis**, although they are laid out in multiple lines:

<div m-auto flex flex-wrap gap-4 w-100 h-100 bg-blue relative>
  <div absolute left-50% transform -translate-x-50% top-0 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Cross Axis</div>
  <div absolute top-50% transform -translate-y-50% left-0 right-0 h-1 bg-emerald>Main Axis</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div absolute left-12.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div absolute left-41.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div absolute left-70.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div w-30 h-25 p-4 shrink-0 bg-red>4</div>
  <div absolute left-15 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div w-30 h-25 p-4 shrink-0 bg-red>5</div>
  <div absolute left-49 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div w-30 h-25 p-4 shrink-0 bg-red>6</div>
  <div absolute left-83 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
</div>

<a name="flex-content-alignment"></a> To control the alignment of **the content (treat all items as a whole, surrounded by the white border)** along the **main axis**, we can use the **`justify-content` property**, and for **cross axis**, we can use the **`align-content` property**.

_justify-content: start, default_

<div flex gap-4>

<div m-auto flex flex-wrap justify-start gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute top-50% transform -translate-y-50% left-0 right-0 h-1 bg-emerald>Main Axis</div>
  <div absolute top-0 bottom-0 left-0 right-15 border border-4 border-white></div>
  <div absolute top-50% transform -translate-y-50% left-1 right-16 h-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
</div>

<div m-auto flex flex-wrap justify-start gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute top-50% transform -translate-y-50% left-1 right-0 h-1 bg-emerald>Main Axis</div>
  <div absolute top-0 bottom-0 left-0 right-15 border border-4 border-white></div>
  <div absolute top-50% transform -translate-y-50% left-1 right-16 h-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>5</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>6</div>
</div>

</div>

_justify-content: center_

<div flex gap-4>

<div m-auto flex flex-wrap justify-center gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute top-50% transform -translate-y-50% left-0 right-0 h-1 bg-emerald>Main Axis</div>
  <div absolute top-0 bottom-0 left-7.5 right-7.5 border border-4 border-white></div>
  <div absolute top-50% transform -translate-y-50% left-8.5 right-8.5 h-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
</div>

<div m-auto flex flex-wrap justify-center gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute top-50% transform -translate-y-50% left-0 right-0 h-1 bg-emerald>Main Axis</div>
  <div absolute top-0 bottom-0 left-7.5 right-7.5 border border-4 border-white></div>
  <div absolute top-50% transform -translate-y-50% left-8.5 right-8.5 h-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>5</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>6</div>
</div>

</div>

_align-content: stretch, default_

<div flex gap-4>

<div m-auto flex flex-wrap content-stretch gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute left-50% transform -translate-x-50% top-1 bottom-1 w-1 bg-emerald style="writing-mode: vertical-lr;">Cross Axis</div>
  <div absolute top-0 bottom-0 left-0 right-15 border border-4 border-white></div>
  <div absolute left-50% transform -translate-x-50% top-1 bottom-1 w-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
</div>

<div m-auto flex flex-wrap content-stretch gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute left-50% transform -translate-x-50% top-1 bottom-1 w-1 bg-emerald style="writing-mode: vertical-lr;">Cross Axis</div>
  <div absolute top-0 bottom-0 left-0 right-15 border border-4 border-white></div>
  <div absolute left-50% transform -translate-x-50% top-1 bottom-1 w-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>5</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>6</div>
</div>

</div>

_align-content: center_

<div flex gap-4>

<div m-auto flex flex-wrap content-center gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute left-50% transform -translate-x-50% top-0 bottom-0 w-1 bg-emerald style="writing-mode: vertical-lr;">Cross Axis</div>
  <div absolute top-36.5 left-0 right-15 h-27 border border-4 border-white></div>
  <div absolute left-50% transform -translate-x-50% top-37.5 bottom-37.5 w-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
</div>

<div m-auto flex flex-wrap content-center gap-4 w-100 h-100 p-1 bg-blue relative>
  <div absolute left-50% transform -translate-x-50% top-0 bottom-0 w-1 bg-emerald style="writing-mode: vertical-lr;">Cross Axis</div>
  <div absolute top-22 left-0 right-15 h-56 border border-4 border-white></div>
  <div absolute left-50% transform -translate-x-50% top-23 bottom-23 w-1 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>5</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>6</div>
</div>

</div>

<a name="flex-items-alignment"></a> To control the alignment of **items** along **sub cross axis**, we can use the **`align-items` property** for the main axis.

> [!Note]
> Because flex items have no sub main axis, `justify-items` property has no effect on them.

_align-items: center_

<div m-auto flex flex-wrap items-center gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 shrink-0 bg-red>1</div>
  <div absolute left-12.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-12.5 transform -translate-x-50% top-11.5 w-1 h-25 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div absolute left-41.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-41.5 transform -translate-x-50% top-11.5 w-1 h-25 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div absolute left-70.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-70.5 transform -translate-x-50% top-11.5 w-1 h-25 bg-orange></div>
  <div w-30 h-25 p-4 shrink-0 bg-red>4</div>
  <div absolute left-15 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-15 transform -translate-x-50% top-63.5 w-1 h-25 bg-orange></div>
  <div w-30 h-25 p-4 shrink-0 bg-red>5</div>
  <div absolute left-49 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-49 transform -translate-x-50% top-63.5 w-1 h-25 bg-orange></div>
  <div w-30 h-25 p-4 shrink-0 bg-red>6</div>
  <div absolute left-83 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-83 transform -translate-x-50% top-63.5 w-1 h-25 bg-orange></div>
</div>

#### Flex Items

<a name="flex-item-alignment"></a> There is also a property can control individual alignment of specific flex item, which is `align-self` property, and it will override the `align-items` property defined in the parent container.

> [!Note]
> Because flex items have no sub main axis, `justify-self` property has no effect on them.

_align-items: center_

<div m-auto flex flex-wrap items-center gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 shrink-0 self-end bg-red>1</div>
  <div absolute left-12.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-12.5 transform -translate-x-50% bottom-52 w-1 h-25 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div absolute left-41.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-41.5 transform -translate-x-50% top-11.5 w-1 h-25 bg-orange></div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div absolute left-70.5 transform -translate-x-50% top-0 bottom-52 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-70.5 transform -translate-x-50% top-11.5 w-1 h-25 bg-orange></div>
  <div w-30 h-25 p-4 shrink-0 bg-red>4</div>
  <div absolute left-15 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-15 transform -translate-x-50% top-63.5 w-1 h-25 bg-orange></div>
  <div w-30 h-25 p-4 shrink-0 bg-red>5</div>
  <div absolute left-49 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-49 transform -translate-x-50% top-63.5 w-1 h-25 bg-orange></div>
  <div w-30 h-25 p-4 shrink-0 bg-red>6</div>
  <div absolute left-83 transform -translate-x-50% top-52 bottom-0 w-1 bg-violet style="writing-mode: vertical-lr;">Sub Cross Axis</div>
  <div absolute left-83 transform -translate-x-50% top-63.5 w-1 h-25 bg-orange></div>
</div>

<a name="flex-item-sizing"></a> There are also some properties can control the sizing of flex items, such as `flex-grow`, `flex-shrink` and `flex-basis` properties, and they will override the default sizing behavior of flex items.

_flex-grow: 1_

<div m-auto flex flex-wrap gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 grow-1 shrink-0 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
</div>

_flex-shrink: 1_

<div m-auto flex gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 shrink-1 bg-red>1</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>2</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>3</div>
  <div w-25 h-25 p-4 shrink-0 bg-red>4</div>
</div>

_flex-basis: 12.5rem, will override the default sizing_

<div m-auto flex gap-4 w-100 h-100 bg-blue relative>
  <div w-25 h-25 p-4 basis-50 shrink-0 bg-red>w-25 ❌; basis-50 ✔️</div>
</div>

### Grid
