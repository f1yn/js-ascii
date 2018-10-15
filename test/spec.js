
const path = require('path');
const fs = require('fs');

const jsa = require('../dist');
const testAscii = fs.readFileSync(path.resolve('./test/ascii.txt'), 'utf-8');

let formats = {};
let parsedFormats = {};

describe('converter', () => {
	it('converts ascii-art to raw memory', () => {
		for (const [name, output] of Object.entries(jsa.convert(testAscii))) {
			parsedFormats[name] = output;
		}
	});
});

describe('renderer', () => {
	it('renders html', () => {
		const heavy = jsa.renderToHTML(parsedFormats.heavy);
		const compressed = jsa.renderToHTML(parsedFormats.compressed);
		console.log(heavy, compressed);
	});

	it('renders console', () => {
		const styles = {
			1: 'lGrey',
			2: 'red',
		}
		const heavy = jsa.renderToTTY(parsedFormats.heavy, { styles });
		const compressed = jsa.renderToTTY(parsedFormats.compressed, { styles });
		console.log(heavy, compressed);
	});
});
