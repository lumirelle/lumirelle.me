---
title: HTML Advanced Grammar Manual
date: 2026-01-28T11:46+08:00
update: 2026-08-19T18:21+08:00
lang: en
duration: 29min
type: manual
group: Web
order: 6
---

[[toc]]

## Introduction

**HTML (HyperText Markup Language)** is the standard markup language for creating web pages. It consists of:

- **Doctypes**: Declarations that specify the HTML version being used, placed at the beginning of the document.
- **Tags**: Writting in HTML source file, used to represent corresponding elements.
- **Attributes**: Specified within the opening tag, define the characteristics of element that tag represents.
- **DOM**: An **API** to represents and interacts with HTML documents.
- **Elements**: Interactive instance for tags, a part of DOM API.
- **Properties**: Properties of elements that can be accessed and manipulated through DOM API, some of properties are [initialized by or even synchronized with attributes](#synchronization-between-attributes-and-properties).
- **Content**: The text contained within an element.
- **External Resources**: Files outside the current HTML document. They are referenced via elements / attributes. Common types include CSS stylesheets, JavaScript files, images, fonts, icons, and media files.

## Doctypes

**Doctypes** are used to specify **the version of HTML** being used in the document. Since HTML 5 was introduced in 2014, there is no reason for us to use older versions (like HTML 4.01, XHTML 1.1, etc.).

- **HTML 5 (Modern and recommended)**:

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

## Tags

### Common Tags

#### Container Tags

- `<div>`: A container tag which just make content on its own line:

  ```html
  <div>123</div><div>123</div>
  ```

  ::: preview
  <div>123</div><div>123</div>
  :::

- `<span>`: A container tag without any function:

  ```html
  <span>123</span><span>123</span>
  ```

  ::: preview
  <span>123</span><span>123</span>
  :::

- `<ul>` + `<li>`: An unordered list and list item container tags, better than `<div>` to express the relationship between items and their container:

  ```html
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  ```

  ::: preview
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  :::

- `<ol>` + `<li>`: An ordered list and list item container tags, better than `<div>` to express the relationship between items and their container, but seldom used in practice than `<ul>`:

  ```html
  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
  </ol>
  ```

  ::: preview
  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
  </ol>
  :::

There are some sematic tags new introduced in HTML 5:

- `<header>`: A container tag which represents introductory content of the **whole document** or **a section**, may contain some heading elements but also a logo, a search form, an author name, and other elements:

  ```html
  <!-- Header of the whole document -->
  <!-- Direct child of `<body>` -->
  <header>
    <a href="#">Cute Puppies Express!</a>
  </header>

  <article>
    <!-- Header of the article -->
    <!-- Direct child of `<article>` -->
    <header>
      <h1>Beagles</h1>
      <time>08.12.2014</time>
    </header>
    <p>
      ...
    </p>
  </article>
  ```

  ::: preview
  <header>
    <a href="#">Cute Puppies Express!</a>
  </header>

  <article>
    <header>
      <h1>Beagles</h1>
      <time>08.12.2014</time>
    </header>
    <p>
      ...
    </p>
  </article>
  :::

- `<main>`: A container tag which represents the dominant content of the **whole document**.

  The content of a `<main>` element should be unique, content that is repeated across different documents or document sections such as headers, sidebars, footers, etc. shouldn't be included:

  ```html
  <header>Gecko facts</header>
  <!-- Dominant content of the whole document -->
  <!-- Direct child of `<body>` -->
  <main>
    <p>
      Geckos are a group of usually small, usually nocturnal lizards. They are
      found on every continent except Antarctica.
    </p>
    <p>
      Many species of gecko have adhesive toe pads which enable them to climb
      walls and even windows.
    </p>
  </main>
  ```

  ::: preview
  <header>Gecko facts</header>
  <main>
    <p>
      Geckos are a group of usually small, usually nocturnal lizards. They are
      found on every continent except Antarctica.
    </p>
    <p>
      Many species of gecko have adhesive toe pads which enable them to climb
      walls and even windows.
    </p>
  </main>
  :::

- `<aside>`: A container tag which represents indirectly related content against then main content:

  ```html
  <header>Gecko facts</header>
  <div style="display: flex; gap: 16px">
    <!-- Aside of whole `<main>` content -->
    <aside style="min-width: 20%">
      <nav>
        <ul>
          <li>...</li>
          <li>...</li>
          <li>...</li>
        </ul>
      </nav>
    </aside>

    <main>
      <p>
        Geckos are a group of usually small, usually nocturnal lizards. They are
        found on every continent except Antarctica.
      </p>
      <!-- Aside of the a part of `<main>` content -->
      <aside style="float: right">
        <p>
          <a href="https://en.wikipedia.org/wiki/Gecko">Wiki</a> of Gecko.
        </p>
      </aside>
      <p>
        Many species of gecko have adhesive toe pads which enable them to climb
        walls and even windows.
      </p>
    </main>
  </div>
  ```

  ::: preview
    <header>Gecko facts</header>
  <div style="display: flex; gap: 16px">
    <!-- Aside of whole `<main>` content -->
    <aside style="min-width: 20%">
      <nav>
        <ul>
          <li>...</li>
          <li>...</li>
          <li>...</li>
        </ul>
      </nav>
    </aside>

    <main>
      <p>
        Geckos are a group of usually small, usually nocturnal lizards. They are
        found on every continent except Antarctica.
      </p>
      <!-- Aside of the a part of `<main>` content -->
      <aside style="float: right">
        <p>
          <a href="https://en.wikipedia.org/wiki/Gecko">Wiki</a> of Gecko.
        </p>
      </aside>
      <p>
        Many species of gecko have adhesive toe pads which enable them to climb
        walls and even windows.
      </p>
    </main>
  </div>
  :::

- `<footer>`: A container tag which represents a footer of the **whole document** or **a section**, typically contains information about the author, copyright or links related:

  ```html
  <header>Wizard</header>

  <article>
    <header>How to be a wizard</header>
    <ol>
      <li>Grow a long, majestic beard.</li>
      <li>Wear a tall, pointed hat.</li>
      <li>Have I mentioned the beard?</li>
    </ol>
    <!-- Footer of the article -->
    <footer>
      <p>— Gandalf</p>
    </footer>
  </article>

  <!-- Footer of the whole document -->
  <footer>
    <p>© 2018 Gandalf www.example.com</p>
  </footer>
  ```

  ::: preview
  <header>Wizard</header>

  <article>
    <header>How to be a wizard</header>
    <ol>
      <li>Grow a long, majestic beard.</li>
      <li>Wear a tall, pointed hat.</li>
      <li>Have I mentioned the beard?</li>
    </ol>
    <footer>
      <p>— Gandalf</p>
    </footer>
  </article>

  <footer>
    <p>© 2018 Gandalf www.example.com</p>
  </footer>
  :::

- `<nav>`: A container tag which represents a section of a page whose purpose is to provide navigation links.

  It's not necessary for all links to be contained in a `<nav>` element. `<nav>` is intended only for **a major block of navigation links**; typically the `<footer>` element often has a list of links that don't need to be in a `<nav>` element.

  A document may have several `<nav>` elements, for example, one for **site navigation** and one for **intra-page navigation**.

  ```html
  <nav>
    <ol>
      <li><a href="#">Bikes</a></li>
      <li><a href="#">BMX</a></li>
      <li>Jump Bike 3000</li>
    </ol>
  </nav>

  <h1>Jump Bike 3000</h1>
  <p>
    This BMX bike is a solid step into the pro world. It looks as legit as it
    rides and is built to polish your skills.
  </p>
  ```

  ::: preview
  <nav>
    <ol>
      <li><a href="#">Bikes</a></li>
      <li><a href="#">BMX</a></li>
      <li>Jump Bike 3000</li>
    </ol>
  </nav>

  <!-- eslint-disable-next-line markdown/no-multiple-h1 -->
  <h1>Jump Bike 3000</h1>
  <p>
    This BMX bike is a solid step into the pro world. It looks as legit as it
    rides and is built to polish your skills.
  </p>
  :::

- `<article>`: A container tag which represents a **self-contained composition** in a document, page, application, or site, which is intended to be independently distributable or reusable:

  ```html
  <article>
    <h1>Weather forecast for Seattle</h1>
    <article>
      <h2>03 March 2018</h2>
      <p>Rain.</p>
    </article>
    <article>
      <h2>04 March 2018</h2>
      <p>Periods of rain.</p>
    </article>
    <article>
      <h2>05 March 2018</h2>
      <p>Heavy rain.</p>
    </article>
  </article>
  ```

  ::: preview
  <article>
    <!-- eslint-disable-next-line markdown/no-multiple-h1 -->
    <h1>Weather forecast for Seattle</h1>
    <article>
      <h2>03 March 2018</h2>
      <p>Rain.</p>
    </article>
    <article>
      <h2>04 March 2018</h2>
      <p>Periods of rain.</p>
    </article>
    <article>
      <h2>05 March 2018</h2>
      <p>Heavy rain.</p>
    </article>
  </article>
  :::

- `<section>`: A container tag which represents a **generic section (part)** of a document. Sections should always have a heading, with very few exceptions:

  ```html
  <h1>Choosing an Apple</h1>
  <section>
    <h2>Introduction</h2>
    <p>
      This document provides a guide to help with the important task of choosing
      the correct Apple.
    </p>
  </section>

  <section>
    <h2>Criteria</h2>
    <p>
      There are many different criteria to be considered when choosing an Apple —
      size, color, firmness, sweetness, tartness...
    </p>
  </section>
  ```

  ::: preview
  <!-- eslint-disable-next-line markdown/no-multiple-h1 -->
  <h1>Choosing an Apple</h1>
  <section>
    <h2>Introduction</h2>
    <p>
      This document provides a guide to help with the important task of choosing
      the correct Apple.
    </p>
  </section>

  <section>
    <h2>Criteria</h2>
    <p>
      There are many different criteria to be considered when choosing an Apple —
      size, color, firmness, sweetness, tartness...
    </p>
  </section>
  :::

#### Text Tags

- `<h1>` ~ `<h6>`: Head layout text tags which also make on its own line with some default margin.

  `<h1>` is the most important and `<h6>` is the least important:

  ```html
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
  ```

  ::: preview
  <!-- eslint-disable-next-line markdown/no-multiple-h1 -->
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
  :::

- `<p>`: A paragraph layout text tag which also make content on its own line with some default margin:

  ```html
  <p>This is a paragraph.</p><p>This is another paragraph.</p>
  ```

  ::: preview
  <p>This is a paragraph.</p><p>This is another paragraph.</p>
  :::

- `<hr>`: A layout text tag which creates a horizontal divider line:

  ```html
  <p>P1</p>
  <hr>
  <p>P2</p>
  ```

  ::: preview
  <p>P1</p>
  <hr>
  <p>P2</p>
  :::

- `<br>`: A layout text tag which creates a line break:

  ```html
  <p>
    O'er all the hilltops<br />
    Is quiet now,<br />
    In all the treetops<br />
    Hearest thou<br />
    Hardly a breath;<br />
    The birds are asleep in the trees:<br />
    Wait, soon like these<br />
    Thou too shalt rest.
  </p>
  ```

  ::: preview
  <p>
    O'er all the hilltops<br />
    Is quiet now,<br />
    In all the treetops<br />
    Hearest thou<br />
    Hardly a breath;<br />
    The birds are asleep in the trees:<br />
    Wait, soon like these<br />
    Thou too shalt rest.
  </p>
  :::

- `<pre>`: A preformatted layout text tag which preserves the original format of text:

  ```html
  <pre>
               S
               A
              LUT
               M
              O N
              D  E
              DONT
            JE SUIS
            LA  LAN
            G U E  É
           L O Q U E N
          TE      QUESA
         B  O  U  C  H  E
        O        P A R I S
       T I R E   ET   TIRERA
      T O U             JOURS
     AUX                  A  L
   LEM                      ANDS   - Apollinaire
  </pre>
  ```

  ::: preview
  <pre>
               S
               A
              LUT
               M
              O N
              D  E
              DONT
            JE SUIS
            LA  LAN
            G U E  É
           L O Q U E N
          TE      QUESA
         B  O  U  C  H  E
        O        P A R I S
       T I R E   ET   TIRERA
      T O U             JOURS
     AUX                  A  L
   LEM                      ANDS   - Apollinaire
  </pre>
  :::

- `<a>`: A anchor functional text tag which creates hyperlink / anchor point:

  ```html
  <a href="https://www.example.com">This is a link</a>
  ```

  ::: preview
  <a href="https://www.example.com">This is a link</a>
  :::

- `<cite>` & `<q>` & `<blockquote>`: References functional text tags, which is used to reference **the title of a creative work**, **a short inline quotation** & **an extended quotation** respectively:

  ```html
  <figure>
    <blockquote>
      <p>
        It was a bright cold day in April, and the clocks were striking thirteen.
      </p>
    </blockquote>
    <figcaption>
      First sentence in
      <cite
        ><a href="http://www.george-orwell.org/1984/0.html"
          >Nineteen Eighty-Four</a
        ></cite
      >
      by George Orwell (Part 1, Chapter 1).
    </figcaption>
  </figure>

  <hr>

  <p>
    When Dave asks HAL to open the pod bay door, HAL answers:
    <q
      cite="https://www.imdb.com/title/tt0062622/quotes/?item=qt0396921&ref_=ext_shr_lnk">
      I'm sorry, Dave. I'm afraid I can't do that.
    </q>
  </p>

  <hr>

  <div>
    <blockquote cite="https://www.huxley.net/bnw/four.html">
      <p>
        Words can be like X-rays, if you use them properly—they'll go through
        anything. You read and you're pierced.
      </p>
    </blockquote>
    <p>—Aldous Huxley, <cite>Brave New World</cite></p>
  </div>
  ```

  ::: preview
  <figure>
    <blockquote>
      <p>
        It was a bright cold day in April, and the clocks were striking thirteen.
      </p>
    </blockquote>
    <figcaption>
      First sentence in
      <cite
        ><a href="http://www.george-orwell.org/1984/0.html"
          >Nineteen Eighty-Four</a
        ></cite
      >
      by George Orwell (Part 1, Chapter 1).
    </figcaption>
  </figure>

  <hr>

  <p>
    When Dave asks HAL to open the pod bay door, HAL answers:
    <q
      cite="https://www.imdb.com/title/tt0062622/quotes/?item=qt0396921&ref_=ext_shr_lnk">
      I'm sorry, Dave. I'm afraid I can't do that.
    </q>
  </p>

  <hr>

  <div>
    <blockquote cite="https://www.huxley.net/bnw/four.html">
      <p>
        Words can be like X-rays, if you use them properly—they'll go through
        anything. You read and you're pierced.
      </p>
    </blockquote>
    <p>—Aldous Huxley, <cite>Brave New World</cite></p>
  </div>
  :::

- `<strong>`: A embellishment text tag makes text strong & bold, better than `<b>` in semantics:

  ```html
  <strong>This text is important.</strong>
  ```

  ::: preview
  <strong>This text is important.</strong>
  :::

- `<em>`: A embellishment text tag makes text emphasis & italic, better than `<i>` in semantics:

  ```html
  <em>This text is emphasized.</em>
  ```

  ::: preview
  <em>This text is emphasized.</em>
  :::

- `<small>`: A embellishment text tag makes text a side comment & small:

  ```html
  <p>
    MDN Web Docs is a learning platform for Web technologies and the software that
    powers the Web.
  </p>

  <hr />

  <p>
    <small>The content is licensed under a Creative Commons Attribution-ShareAlike 2.5 Generic License.</small>
  </p>
  ```

  ::: preview
  <p>
    MDN Web Docs is a learning platform for Web technologies and the software that
    powers the Web.
  </p>

  <hr />

  <p>
    <small>The content is licensed under a Creative Commons Attribution-ShareAlike 2.5 Generic License.</small>
  </p>
  :::

- `<u>`: A embellishment text tag marks the text is unarticulated with underline:

  ```html
  Please <u>pay attention</u>!
  ```

  ::: preview
  Please <u>pay attention</u>!
  :::

- `<s>`: A embellishment text tag marks the text is outdated with strikethrough:

  ```html
  Price: <s>$100</s> $69!
  ```

  ::: preview
  Price: <s>$100</s> $69!
  :::

- `<ins>`: A embellishment text tag marks the text is newly inserted with underline:

  ```html
  <ins datetime="2026-08-19">New inserted item!</ins>
  ```

  ::: preview
  <ins datetime="2026-08-19">New inserted item!</ins>
  :::

- `<del>`: A embellishment text tag marks the text is newly deleted with strikethrough:

  ```html
  <del datetime="2026-08-19">Deleted outdated item!</del>
  ```

  ::: preview
  <del datetime="2026-08-19">Deleted outdated item!</del>
  :::

- `<time>`: A embellishment text tag adds machine-readable format date to improve search engines results or custom features:

  ```html
  <p>
    The Cure will be celebrating their 40th anniversary on
    <time datetime="2018-07-07">July 7</time> in London's Hyde Park.
  </p>

  <p>
    The concert starts at <time datetime="20:00">20:00</time> and you'll be able
    to enjoy the band for at least <time datetime="PT2H30M">2h 30m</time>.
  </p>
  ```

  ::: preview
  <p>
    The Cure will be celebrating their 40th anniversary on
    <time datetime="2018-07-07">July 7</time> in London's Hyde Park.
  </p>

  <p>
    The concert starts at <time datetime="20:00">20:00</time> and you'll be able
    to enjoy the band for at least <time datetime="PT2H30M">2h 30m</time>.
  </p>
  :::

- `<code>`: A embellishment text tag marks that the text is code snippest:

  ```html
  <p>
    The <code>push()</code> method adds one or more elements to the end of an
    array and returns the new length of the array.
  </p>
  ```

  ::: preview
  <p>
    The <code>push()</code> method adds one or more elements to the end of an
    array and returns the new length of the array.
  </p>
  :::


- `<address>`: A embellishment text tag indicates that the enclosed HTML provides contact information for a person or people, or for an organization:

  ```html
  <p>Contact the author of this page:</p>

  <address>
    <a href="mailto:jim@example.com">jim@example.com</a><br />
    <a href="tel:+14155550132">+1 (415) 555‑0132</a>
  </address>
  ```

  ::: preview
  <p>Contact the author of this page:</p>

  <address>
    <a href="mailto:jim@example.com">jim@example.com</a><br />
    <a href="tel:+14155550132">+1 (415) 555‑0132</a>
  </address>
  :::

- `<sub>` & `<sup>`: A embellishment text tag makes text as **subscript** & **superscript** respectively:

  ```html
  H<sub>2</sub>O / 2<sup>2</sup> = 4
  ```

  ::: preview
  H<sub>2</sub>O / 2<sup>2</sup> = 4
  :::

- `<ruby>` + `<rt>`: Embellishment text tags add pronunciation to text:

  ```html
  <ruby>漢<rt>Kan</rt>字<rt>ji</rt></ruby>, <ruby>明日<rt>Ashita</rt></ruby>
  ```

  ::: preview
  <ruby>漢<rt>Kan</rt>字<rt>ji</rt></ruby>, <ruby>明日<rt>Ashita</rt></ruby>
  :::

- `<dft>` & `<abbr>`: Embellishment text tags mark the text as **a term** & **an abbreviation** respectively:

  ```html
  <p>
    You can use <abbr>CSS</abbr> (Cascading Style Sheets) to style your
    <abbr>HTML</abbr> (HyperText Markup Language). Using style sheets, you can
    keep your <abbr>CSS</abbr> presentation layer and <abbr>HTML</abbr> content
    layer separate. This is called "separation of concerns."
  </p>
  ```

  ::: preview
  <p>
    You can use <abbr>CSS</abbr> (Cascading Style Sheets) to style your
    <abbr>HTML</abbr> (HyperText Markup Language). Using style sheets, you can
    keep your <abbr>CSS</abbr> presentation layer and <abbr>HTML</abbr> content
    layer separate. This is called "separation of concerns."
  </p>
  :::


#### Form & Control Tags

- `<form>`: A form tag, which is used to collect user input and submit it to a server:

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

  ::: preview body > :not(:first-child) { margin-top: 1rem }
  <form action="/submit" method="post">
    <div>
      <input type="text" name="username">
    </div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
  :::

- `<input>`: An input tag, which is used to create a interactive control for a field of `<form>` to accept data from the user, so it often be placed inside a `<form>` tag.

  `<input>` tag has many different types, such as `text`, `password`, `checkbox`, `radio`, etc, you can refer to [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Tags/input#input_types) for more details.

  `<input>` uses `name` attribute to specify the form field name:

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
    <input type="checkbox"name="remember" value="day"> Remember me at least for a day
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

  ::: preview body > :not(:first-child) { margin-top: 1rem }
  <div>
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
  :::

- `<textarea>`: A textarea tag, which is used to create a multi-line text input control, it often be placed inside a `<form>` tag too.

  `<textarea>` has attributes like `rows` and `cols` to specify the visible size of the textarea:

  ```html
  <div>
    <textarea rows="4" cols="30"></textarea>
  </div>
  ```

  ::: preview
  <div>
    <textarea rows="4" cols="30"></textarea>
  </div>
  :::

- `<select>` + `<optgroup>` + `<option>`: Select and option tags, which are used to create a drop-down list, they often be placed inside a `<form>` tag too.

  `<select>` can have `multiple` attribute to allow multiple selections, and each `<option>` can have `value` attribute to specify the value of the option:

  ```html
  <div>
    <select>
      <optgroup label="Theropods">
        <option>Tyrannosaurus</option>
        <option>Velociraptor</option>
        <option>Deinonychus</option>
      </optgroup>
      <optgroup label="Sauropods">
        <option>Diplodocus</option>
        <option>Saltasaurus</option>
        <option>Apatosaurus</option>
      </optgroup>
    </select>
  </div>
  ```

  ::: preview
  <div>
    <select>
      <optgroup label="Theropods">
        <option>Tyrannosaurus</option>
        <option>Velociraptor</option>
        <option>Deinonychus</option>
      </optgroup>
      <optgroup label="Sauropods">
        <option>Diplodocus</option>
        <option>Saltasaurus</option>
        <option>Apatosaurus</option>
      </optgroup>
    </select>
  </div>
  :::

- `<label>`: A label tag, which is used to define a label for an `<input>` tag, it often be placed inside a `<form>` tag too.

  `<label>` can be associated with an `<input>` tag through `for` attribute, and the value of `for` attribute should be the same as the `id` of the `<input>` tag:

  > [!Note]
  >
  > You can place the `<label>` tag before or after the `<input>` tag, but it's **not recommended to wrap the `<input>` tag with `<label>` tag**, because it will make the structure of the form more complex and less readable.

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

  ::: preview body > :not(:first-child) { margin-top: 1rem }
  <div>
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
  :::

- `<button>`: A button tag, which is used to create clickable buttons. It has three types: `submit`, `reset`, and `button`.

  `submit` type will trigger form submission, `reset` type will reset the form to its initial state, these two types are often be placed inside a `<form>` tag too, while `button` type has no default behavior, so it can be used anywhere:

  > [!Caution]
  >
  > The default type of `<button>` tag is `submit`, please never forget to explicitly set `type="button"` for `<button>` tag if you don't want it to trigger form submission!

  > [!Note]
  >
  > `<input>` tag has corresponding type as button, such as `<input type="submit">`, but `<button>` tag supports inner content, so it's more customized and recommended than `<input type="submit">`.

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

  ::: preview body > :not(:first-child) { margin-top: 1rem }
  <div>
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
  :::

#### Resource Tags

- `<script>` & `<noscript>`: Script resource tags, which is used to **embed or reference JavaScript code** & **display fallback content when the browser disabled or does not support JavaScript** in the HTML document respectively.

  [Modern browsers](https://caniuse.com/es6-module) support ESM (ECMAScript Modules) in `<script>` tag, so you can use `type="module"` attribute to enable module mode, and use `import` statement to import other modules.

  Code

  ```html
  <!-- Embedding JavaScript code -->
  <script>
    console.log('Hello, World!');
  </script>

  <!-- Referencing external JavaScript file -->
  <script src="script.js"></script>

  <!-- Using ESM in script tag -->
  <script type="module">
    import { myFunction } from './module.js';
    myFunction();
  </script>
  ```

- `<style>`: A style resource tag, which is used to embed CSS styles in the HTML document.

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

- `<link>`: A link resource tag, which is used to reference external resources, such as CSS files, icons, etc.

  `rel` attribute is used to specify the relationship between the current document and the linked resource, you can refer to [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel).

  Code

  ```html
  <!-- Referencing external CSS file -->
  <link rel="stylesheet" href="styles.css">

  <!-- Referencing favicon -->
  <link rel="icon" href="favicon.ico">
  ```

- `<img>` & `<picture>` & `<source>` & `<video>` & `<track>` & `<audio>`: Media resource tags:

  ```html
  <img
  class="fit-picture"
  src="https://developer.mozilla.org/shared-assets/images/examples/grapefruit-slice.jpg"
  alt="Grapefruit slice atop a pile of other slices" />

  <picture>
    <source
      srcset="https://developer.mozilla.org/shared-assets/images/examples/surfer.jpg"
      media="(orientation: portrait)" />
    <img src="https://developer.mozilla.org/shared-assets/images/examples/painted-hand.jpg" alt="" />
  </picture>

  <video controls width="250">
    <source src="https://developer.mozilla.org/shared-assets/videos/flower.webm" type="video/webm" />
    <source src="https://developer.mozilla.org/shared-assets/videos/flower.mp4" type="video/mp4" />
    Download the
    <a href="https://developer.mozilla.org/shared-assets/videos/flower.webm">WEBM</a>
    or
    <a href="https://developer.mozilla.org/shared-assets/videos/flower.mp4">MP4</a>
    video.
  </video>

  <audio controls src="https://developer.mozilla.org/shared-assets/audio/t-rex-roar.mp3"></audio>
  ```

  ::: preview
  <img
  src="https://developer.mozilla.org/shared-assets/images/examples/grapefruit-slice.jpg"
  alt="Grapefruit slice atop a pile of other slices" />

  <picture>
    <source
      srcset="https://developer.mozilla.org/shared-assets/images/examples/surfer.jpg"
      media="(orientation: portrait)" />
    <img src="https://developer.mozilla.org/shared-assets/images/examples/painted-hand.jpg" alt="" />
  </picture>

  <video controls width="250">
    <source src="https://developer.mozilla.org/shared-assets/videos/flower.webm" type="video/webm" />
    <source src="https://developer.mozilla.org/shared-assets/videos/flower.mp4" type="video/mp4" />
    Download the
    <a href="https://developer.mozilla.org/shared-assets/videos/flower.webm">WEBM</a>
    or
    <a href="https://developer.mozilla.org/shared-assets/videos/flower.mp4">MP4</a>
    video.
  </video>

  <audio controls src="https://developer.mozilla.org/shared-assets/audio/t-rex-roar.mp3"></audio>
  :::

### Void Tags & Non-void Tags

In HTML, there are two types of tags: [**void tags**](https://developer.mozilla.org/en-US/docs/Glossary/Void_tag) and **non-void tags**.

Void tags have only a start tag and do not have an end tag, they cannot contain any content, for example:

```html
<img src="image.jpg">
<input type="text">
<br>
<hr>
```

Non-void tags have both a start tag and an end tag, they can contain content, for example:

```html
<div>This is a div tag.</div>
<p>This is a paragraph tag.</p>
<a href="https://www.example.com">This is a link tag.</a>
```

> [!Caution]
>
> There is no concept of **"self-closing tag"** in HTML, if you write a "self-closing tag" like `<img src="image.jpg" />`, what the browser does is just simply ignore the `/` character, and treat it as `<img src="image.jpg">`.

## Elements

**Elements** are instances of **tags**: We write tags in HTML document, and the browser will parse them into elements.

## Attributes vs. Properties

In HTML, the most common confusion is between attributes and properties.

### Attributes

We know tags will be used to create elements when browsers parse the HTML document, so the **attributes** of the tags will be used to **control the characteristics of the elements**, for example:

```html
<input type="text" value="Hello">
```

In this example, browsers will create an **text** `<input>` element with **default value** "Hello".

When the attributes change, the characteristics of the element will also change, for example:

```html
<div><input id="myInput" type="text" value="Hello"></div>
<button onclick="document.querySelector('#myInput').setAttribute('type', document.querySelector('#myInput').getAttribute('type') === 'text'?'password' : 'text')">
  Toggle Type
</button>
```

::: preview body { display: flex; flex-direction: column; gap: 0.5rem }
<div><input id="myInput" type="text" value="Hello"></div>
<button onclick="document.querySelector('#myInput').setAttribute('type', document.querySelector('#myInput').getAttribute('type') === 'text'?'password' : 'text')">
  Toggle Type
</button>
:::

### Properties

**Properties** are **the characteristics of the element** we mentioned before.

They are **IDL (Interface Definition Language) attributes**, which are meant to be used by programming languages, so we can access them through DOM API, for example:

```javascript
const inputElement = document.querySelector('input')
console.log(inputElement.value) // Accessing the 'value' property
```

### Synchronization Between Attributes and Properties

By default, when an HTML element is created, the attributes are always used to **initialize the corresponding (not necessary with the same name)** properties.

For a same name example, the `src` attribute initializes the `src` property of the `<img>` element:

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

For different name examples:

The `class` attribute corresponds to the `className` property:

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

After initialization, the **synchronization between attributes and properties is not guaranteed**, it depends on following rules:

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
    5.  When it encounters **a [external resource](#resource-tags) referred by `<link>` tag**, it will entrust network process to download the resource, and never pause the parsing;

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
