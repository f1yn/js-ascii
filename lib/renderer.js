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
export function serializeAsciiData(asciiData, breakline = '\n', fill = null) {
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
export function buildAsciiRenderer(parameters) {
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

export default buildAsciiRenderer;
