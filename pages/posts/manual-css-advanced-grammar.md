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
- **Properties**: Used to specify the styles to be applied to the selected elements;
- **Values (with Units)**: Used to specify the values of the properties;
- **Layers & Specificity**: Used to determine which styles will be applied when there are conflicting styles.
- **Variables**: Used to store values that can be reused throughout the stylesheet;
- **Functions**: Used to perform calculations or manipulate values in the stylesheet;
- **Media Queries**: Used to apply styles based on the characteristics of the device or viewport.

## Selectors

### How Browser Match Nested Selectors?

When the browser matches nested selectors, it starts **from the rightmost** selector and **moves leftwards**. For example, for the selector `.parent .child`, the browser will first look for elements with the class `child`, and then check if they have a parent element with the class `parent`. **This has better performance than starting from the leftmost selector**.

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
