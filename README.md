sass-colorpicker
================

This simple tool can be used to preview changes to colors in your Sass in the browser.

## Requirements
Sass >=3.3

## Browsers
Only tested in Chrome-dev. Might work elsewhere.

## How to use

1. Define your colors in Sass in a map named ``$colourscheme``. For example:
``
$colorscheme: (
    white: #fff,
    black: #000
);
``
2. Import the sass-colorscheme file in your project using ``@import "sass-colorpicker";`` Make sure it's imported after defining your colorscheme.
3. Use the colors in your colorscheme using the``colorscheme()``-function. For example:
``
body {
    background-color: colorscheme(black);
}
``
4. Include the javascript-file in your HTML. ``<script src="sass-colorpicker.js"></script>``
5. Open your page in the browser. Press ``c`` to open the colorpicker.

## Known issues
- Gradients are not supported.
- Don't use ``--`` in your colornames. 