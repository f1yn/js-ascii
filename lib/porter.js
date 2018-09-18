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

export default convertAscii;
