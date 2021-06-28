---
title: Using the defer Keyword
excerpt: Making the code more cleaner using this not so well known keyword!
image: using-defer.jpg
isFeatured: true
date: "2021-05-28"
---

## Why?

So, you are developing a dynamic website. Gonna have to link the JavaScript file in HTML sometime or the other. Now, where do we link it?

It's better to link the JS file near the body end tag since HTML is parsed from top to bottom and if you are making DOM manipulations, placing the **script** tag inside **head** tag will break the code.

### Do not Do This

```html
<html>
  <head>
    <script type="text/javascript" src="test.js"></script>
  </head>

  <body>
    ...
  </body>
</html>
```

### Do this Instead

```html
<html>
  <head>
    ...
  </head>

  <body>
    ...
    <script type="text/javascript" src="test.js"></script>
  </body>
</html>
```

But writing it this way can make the code really messy as the script tag inside the body tag serves no purpose except linking. Wouldn't it be great if there were a way to use it in the **head** tag ?

## Solution

This is where the *defer* keyword comes in handy. We can now write the code like this:

```html
<html>
  <head>
    <script type="text/javascript" src="test.js" defer></script>
  </head>

  <body>
      ...
  </body>
</html>
```

**defer** makes sure that the script will be downloaded and executed only once the rest of the document has finished rendering!

Voila! All the *script* tags are in a single place now making the code more clean!

Of course in the end it is your personal preference where you want to place the tag but I strongly recommend using the **defer** keyword.

#### You can also look into the **async** keyword which serves a similar purpose [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)