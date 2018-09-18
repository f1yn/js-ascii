var jsAscii = (function (exports) {
	'use strict';

	/**
	 * Created by Flynn Buckingham (https://github.com/flynnham) on 21/05/17.
	 */

	function convertAscii(inputString, compressThreshold = 3) {
		const parsedLines = [];

		for (const line of inputString.split(/(?:\r\n|\r|\n)/g)) {
			for (const part of line.split(/(\s+)/)) {
				if (!part.replace(/\s/g, '').length) {
					// check if the node is empty (including whitespace)
					// only push if has more than one space
					if (part.length > 0) parsedLines.push(part.length);
				} else {
					// add the part
					parsedLines.push(part);
				}
			}

			// add breakline
			parsedLines.push(0);
		}
	 	// remove last 0 (breakline) from the output
		parsedLines.pop();

		const heavy = JSON.stringify(parsedLines)
			.replace(/,\d+,0,/g, ',0,'); // removes tailing whitespace (ex: [,,100,0,,,] removes 100)

		const compressor = new RegExp(`(.)\\1{${compressThreshold}}`, 'g');

		const compressed = heavy
			// array replace
			.replace(compressor, match => `",[${match.length},"${match[0]}"]"`)
			// broken array fix
			.replace(/\"\]\"/g, '"],"')
			// empty string removal
			.replace(/\,\"\"\,/g, ',');

		return {
			heavy,
			compressed,
		};
	}

	/**
	 * Created by Flynn Buckingham (https://github.com/flynnham) on 21/05/17.
	 *
	 * A simple renderer for converting Ascii data (as to be implemented on https://swlinux.org)
	 */

	/**
	 * Extracts an array of color code integers from the provided jsAscii datatype
	 * @param  {Array} jsAsciiArray The js ascii datatype
	 * @return {Number[]} Array of detected color codes within the jsAscii format
	 */
	function extractColorCodes(jsAsciiArray) {
		const string = JSON.stringify(jsAsciiArray);
		const regexp = /\$\{c(\d+)\}/g;
		const matches = {};

		let match = null;

		while ((match = regexp.exec(string)) !== null) {
			if (!matches[match[1]]) matches[match[1]] = true;
		}

		return Object.keys(matches).map(v => parseInt(v, 10));
	}

	/**
	 * Converts a jsAscii formatted array to it's serialized String value
	 * @param  {Array} asciiData the jsAscii format
	 * @param  {String} [breakline='\n'] the default line break used
	 * @param  {String} [fill=null] if specified, the first character will be used
	 *   to populate any existant non-whitespace
	 * @return {String} The serialzied string value
	 */
	function serializeAsciiData(asciiData, breakline = '\n', fill = null) {
		const chunks = [];

		let index = 0;
		let node = null;

		const fillChar = (typeof fill === 'string' && fill.length) ? fill[0] : null;

		const handleString = fillChar ?
			// replace all non-code substrings with the fill character
			node => node.replace(/(\${c\d+})|./g, (_, codes) =>
				(codes ? codes : fillChar)
			) :
			// direct passthrough of node value
			node => node;

		const handleArray = fillChar ?
			// repeat fill character for duplicates
			node => fillChar.repeat(node[0]) :
			// repeat specific character
			node => node[1].repeat(node[0]);

		do {
			node = asciiData[index];

			switch (typeof node) {
				case 'string':
					chunks.push(handleString(node));
					break;
				case 'number':
					// if the node is simply 0, treat it as a breakline,
					// otherwise treat it as whitespace
					chunks.push((node > 0) ? ' '.repeat(node) : breakline);
					break;
				case "object":
					if (typeof node.length === 'number') {
						// repeat renderBlock (if it is set) or repeat the array defined value
						chunks.push(handleArray(node));
					} else {
						console.warn('invalid render syntax, ignoring');
					}
					break;
				default:
					// because why not
					break;

			}
		} while (++index < asciiData.length);

		return chunks.join('');
	}

	/**
	 * Builds a jsAscii renderer with the specified scope parameters
	 * @param  {Object} parameters The default parameters to use when building
	 * @param  {String} parameters.breakline The breakline seperator to use
	 *   when serializing. Will throw if not provided
	 * @param  {Function} parameters.render Called on each detected
	 *   colorized block. Return value represents a portion of the render.
	 * @param  {Function} parameters.prepareScope A execution callback (before rendering)
	 *   that allows the specification of extra scope to pass into each render.
	 * @return {Function} Rendering function that when called will attempt to
	 *   serialize and render the provided jsAscii data
	 *
	 * @example see ./formats for examples of defining custom renderers
	 */
	function buildAsciiRenderer(parameters) {
		if (!parameters || typeof parameters !== 'object') {
			throw new TypeError(`You must specify valid parameters as an object`);
		}

		// TODO: validate build props
		const { breakline, prepareScope, render } = parameters;

		return function generateString(asciiData, options = {}) {
			const colorCodes = extractColorCodes(asciiData);
			const renderScope = prepareScope(options, colorCodes);

			// change rendering if style.block is set (only use first char)
			const renderBlock = (typeof options.block === "string") ? options.block[0] : null;

			// split into pairs at color values (first value is blank)
			const splitOutput = serializeAsciiData(asciiData, breakline, renderBlock)
				.split(/(\$\{c\d+\})/g);

			let output = '';
			let index = 0;
			let code = '';

			// start iteration (skipping the first empty item)
			while (++index != splitOutput.length) {
				// only process odd indexes (simulate array chunking)
				if (index % 2 == 0) continue;

				code = splitOutput[index].match(/\$\{c(\d+)\}/)[1];

				output += render(code, splitOutput[index + 1], renderScope);
			}

			return output;
		}
	}

	const generateClassAttribute = (colorClass, code) => (
		typeof colorClass[code] === 'string' ? ` class="${colorClass[code]}"` : '');

	const generateColorAttribute = (styles, code) => (
		typeof styles[code] === 'string' ? ` styles="color:${styles[code]}"` : '');

	const renderToHTML = buildAsciiRenderer({
		breakline: '<br>',
		prepareScope(options, colorCodes) {
			const styles = {};
			const colorClass = {};

			if (typeof options.singleColor === 'string') {
				// set as single color
				for (const code of colorCodes) {
					styles[code] = options.singleColor;
				}
			} else {
				const customStyles = options.styles || {};

				for (const code of colorCodes) {
					const style = customStyles[code];

					if (typeof style === 'string') {
						if (style[0] === '.') {
							// it' a class -> add to the class-storage
							colorClass[code] = style.substring(1); // remove dot
						} else {
							// its' just a string- assume it's a color
							styles[code] = style;
						}
					} else {
						styles[code] = '#000';
					}
				}
			}

			return { styles, colorClass };
		},
		render(code, value, { styles, colorClass }) {
			return `<span${
			generateClassAttribute(colorClass, code)}${
			generateColorAttribute(styles, code)}>${value}</span>`;
		}
	});

	const colors = {
		default: 39,
		blink: 5,
		black: 30,
		red: 31,
		green: 32,
		yellow: 33,
		blue: 34,
		magenta: 35,
		cyan: 36,
		lGrey: 37,
		dGrey: 90,
		lRed: 91,
		lGreen: 92,
		lYellow: 93,
		lBlue: 94,
		lMagenta: 95,
		lCyan: 96,
		white: 97
	};

	/**
	 * Generate color segment piece from code
	 * @param  {String || Number} code The code to use in the color segment
	 * @return {String} The created color segment
	 */
	const segment = code => `\x1b[${code}m`;

	const renderToTTY = buildAsciiRenderer({
		prepareScope(options, colorCodes) {
			const customStyles = options.styles || {};

			const styles = {};

			for (const code of colorCodes) {
				const custom = customStyles[code];

				switch (typeof custom) {
					case 'string':
						if (colors[custom]) styles[code] = colors[custom];
						else styles[code] = colors.default;
						break;
					case 'number':
						styles[code] = custom;
						break;
					default:
						styles[code] = colors.default;
				}
			}

			return { styles };
		},
		render(code, value, { styles }) {
			return `${segment(styles[code])}${value}`;
		}
	});

	var source = {
		convert: convertAscii,
		buildRenderer: buildAsciiRenderer,
		renderToHTML,
		renderToTTY,
	};

	exports.convert = convertAscii;
	exports.buildRenderer = buildAsciiRenderer;
	exports.renderToHTML = renderToHTML;
	exports.renderToTTY = renderToTTY;
	exports.default = source;

	return exports;

}({}));
