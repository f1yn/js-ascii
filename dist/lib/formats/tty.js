"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _renderer = _interopRequireDefault(require("../renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var colors = {
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

var segment = function segment(code) {
  return "\x1B[".concat(code, "m");
};

var renderToTTY = (0, _renderer.default)({
  prepareScope: function prepareScope(options, colorCodes) {
    var customStyles = options.styles || {};
    var styles = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = colorCodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var code = _step.value;
        var custom = customStyles[code];

        switch (_typeof(custom)) {
          case 'string':
            if (colors[custom]) styles[code] = colors[custom];else styles[code] = colors.default;
            break;

          case 'number':
            styles[code] = custom;
            break;

          default:
            styles[code] = colors.default;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return {
      styles: styles
    };
  },
  render: function render(code, value, _ref) {
    var styles = _ref.styles;
    return "".concat(segment(styles[code])).concat(value);
  }
});
var _default = renderToTTY;
exports.default = _default;