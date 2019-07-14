# js-ascii

[![Build Status](https://travis-ci.org/flynnham/js-ascii.svg?branch=master)](https://travis-ci.org/flynnham/js-ascii)
[![npm](https://img.shields.io/npm/v/js-ascii.svg)](https://www.npmjs.com/package/js-ascii)
[![dependencies Status](https://david-dm.org/flynnham/js-ascii/status.svg)](https://david-dm.org/flynnham/js-ascii)
[![devDependencies Status](https://david-dm.org/flynnham/js-ascii/dev-status.svg)](https://david-dm.org/flynnham/js-ascii?type=dev)

(jsAscii) is a JavaScript utility library for serializing and rendering ASCII
art in the browser. It takes ASCII art following the format of neofetch's
ascii art, and converts it into a processable array.

The rendering engine can be used to render the arrays into various serialized
formats, including HTML and most consoles. The library additionally allows
the specification of custom output formats via an internal API.

## Installing

### via npm
```bash
npm i -S js-ascii
```

## How to use

### Node.js

Require the jsAscii module and use the api as demonstrated below:

```js
const jsAscii = require('js-ascii');

// converts raw string art to a raw JavaScript array implementation
const formattedArt = jsAscii.convert("${c1}Hello ${c2}World");

const colorizedHTML = jsAcii.renderToHTML(formattedArt, {
	// any valid CSS color
	styles: {
		1: 'red',
		2: '#00f',
	},
});
// outputs: <span style="color:red">Hello </span><span style="color:#00f">World</span>

const colorizedConsole = jsAcii.renderToTTY(formattedArt, {
	// specific console color cold (Number) or
	// string name
	styles: {
		1: 'red',
		2: 'blue',
	}
});
// outputs: Hello World
// (colorized version logo for STDOUT/console)

```

### Browser

If using a bundling utility, you can include the module the same way you would include
the Node.js api. Otherwise, concatenated dist files can also be loaded in.

#### Pre-transpiled import (ES5)

If you are using browser modules (or not using babel), an ES5 friendly version
can be included like so:

```js
// standard import
import jsAscii from 'js-ascii';
import { convert, renderToHTML } from 'js-ascii';

// named imports (for improved tree shaking)
import convert from 'js-ascii/dist/lib/convert';
import renderToHTML from 'js-ascii/dist/lib/formats/html';

// full dist IFFE (for environments without bundlers)
import 'js-acii/dist/client';
```

#### Non-transpiled (ES2015+)

If you are using your own post-process transpiler, you can include the full
non-transpiled implementation like so:

```js
// standard import
import jsAscii from 'js-ascii/source';
import { convert, renderToHTML } from 'js-ascii/source';

// named imports (for improved tree shaking)
import convert from 'js-ascii/lib/convert';
import renderToHTML from 'js-ascii/lib/formats/html';

// full dist IFFE (for environments without bundlers)
import 'js-acii/dist/condensed';
```

### API documentation
Coming soon (refer to included inline `/lib` documentation)

### ASCII ART Editor
A simple single-page HTML application has also been included in `/editor` direactory
of this repository.

At the bottom of the page, both of the compiled outputs will be updated as the input
field changes (or when a page click occurs). Other useful functionality is shown
within the editor itself.
