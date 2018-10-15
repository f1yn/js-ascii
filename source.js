import convert from './lib/porter';
import buildRenderer from './lib/renderer';
import renderToHTML from './lib/formats/html';
import renderToTTY from './lib/formats/tty';

export { convert };
export { buildRenderer };
export { renderToHTML }
export { renderToTTY }

export default {
	convert,
	buildRenderer,
	renderToHTML,
	renderToTTY,
};

if (typeof window === 'object' && typeof exports === 'object') {
	window.jsAscii = exports;
}
