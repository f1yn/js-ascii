
import buildAsciiRenderer from '../renderer';

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

export default renderToTTY;
