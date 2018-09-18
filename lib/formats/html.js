
import buildAsciiRenderer from '../renderer';

const generateClassAttribute = (colorClass, code) => (
	typeof colorClass[code] === 'string' ? ` class="${colorClass[code]}"` : '')

const generateColorAttribute = (styles, code) => (
	typeof styles[code] === 'string' ? ` styles="color:${styles[code]}"` : '')

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

export default renderToHTML;
