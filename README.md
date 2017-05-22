# js-ascii

js-ascii is a small JavaScript utility for rendering ascii art in the browser. It takes ascii art following the format of neofetch's ascii art,
and converts it into a processable array.

(this project is from a larger project that I am working on <- a merge is expected)

The rendering engine can be used to render the Arrays into a valid html, with full color support (any valid CSS compliant color value).

## How to use
### Node.js
I have included a basic implementation that allows for importing both `porter.js` (the utility for porting neofetch asciiart), and `render.js` (the utility for rendering the processed art in a client-side environment).

This implementation is intended for embedded compiling with Webpack, but you can implement it any way you see fit.

Import them as you would with any Node.js module:

```javascript
    // ES6 style (for babel compiled environments)
    import asciiPorter from '{path-to-file}/porter';
    import asciiRender from '{path-to-file}/render';

    // Node.js require
    var asciiPOrter = require('{path-to-file}/porter')  // porter can be used in live Node Environment
    // render cannot be effectivly used in a Node.js environment, but it can still be compiled this way into a live one
```

I also included a dumb little command line utility.

### Client-side
I have made these scripts using Ecmascript5 standards, so it should effectively be able to be used in most current desktop browsers.
Include these scripts at the top of your webpage in the header file:

```html
<head>
    <!-- your header code -->
    <script src="{path-to-file}/porter.js"> <!-- processes raw art on-demand -->
    <script src="{path-to-file}/render.js"> <!--  renders processed art in the browser -->
</head>
```

### Universal syntax:

`asciiPort` only takes a single parameter, which is a string containing the ascii artwork. It returns an object Array.

```javascript
   // sample output array:
   ["1${c1}hello world", 0, 16, "hello", [4, "a"]]
```

The values are processed from left to right, and each item in the array is evaluated for the following criteria:

   1. Is it an interger? If it has a value of zero, treat it as a breakline, else - treat it as a number of whitespaces
   2. Is it a string? If so, search the string for any template strings `${c1,c2,c3,..c9}` and colorize them.
   3. Is it an sub Array? Treat the first value as the number of repeats, and the first character of the second value string
   as the string to be repeated.

Assuming this check takes place, the resulting HTML after loading an valid Array into `asciiRender.js` (as it's first parameter):

```html
   1<span style="color:{your custom-defined-color}"><br>                helloaaaa</span>
```

`asciiRender` also takes an additional `style` argument, which allows modifying the output of the ascii render;

```json5
    {
        c1...9: '{string}', // colorcode/class setting
            // ^- If the string starts with '.' the rest of the string is parsed as a class name (useful for animations/transitions)
            // ^-  otherwise will attempt to parse it as any css valid color (e.g. #rgb #rrggbb rgb() rgba() hsv()) - whatever the client-side browser supports
        single: '{string}', // overides all color values, using only one css valid color
        block: '{string}' // replaces all input chraracters (except whitespace) with the first chracter of the specified string
    }
```

`asciiRender(true)` will return an Array with a list of Numbers representing valid color code numbers.

## Utilities
Because of the amount of overhead my current project has, I've had to create a couple tools to help automate the process so I can develop at a faster pace. These tools include a Node.js CLI Utility, and a clinet-side utility for creating/editing art.

### Command line utility
The command line utility can be called using Node.js from the terminal using the following syntax:
```bash
    # only takes a single argument: a path to a UTF8 file containing raw neofetch-like Ascii art
    node ./{path_to_directory} ./{path_to_utf8_input_file}
```

The aforementioned command-line utility will output both a regular output array as plaintext, as well as a refactored (compressed) version (containing repeat character removal).

### ASCII ART Editor
I have also included a simple, single-page HTML app that loads both `porter.js` and `render.js`, which I have been using for editing and porting art to my project. There are various sections for inputting plain text, and various inputs for colors.

At the bottom of the page, both of the compiled outputs will be updated as the input field changes (or when a page click occurs). Other useful functionality is shown within the editor itself.