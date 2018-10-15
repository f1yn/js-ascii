"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _renderer = _interopRequireDefault(require("../renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateClassAttribute = function generateClassAttribute(colorClass, code) {
  return typeof colorClass[code] === 'string' ? " class=\"".concat(colorClass[code], "\"") : '';
};

var generateColorAttribute = function generateColorAttribute(styles, code) {
  return typeof styles[code] === 'string' ? " style=\"color:".concat(styles[code], "\"") : '';
};

var renderToHTML = (0, _renderer.default)({
  breakline: '<br>',
  prepareScope: function prepareScope(options, colorCodes) {
    var styles = {};
    var colorClass = {};

    if (typeof options.singleColor === 'string') {
      // set as single color
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = colorCodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var code = _step.value;
          styles[code] = options.singleColor;
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
    } else {
      var customStyles = options.styles || {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = colorCodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _code = _step2.value;
          var style = customStyles[_code];

          if (typeof style === 'string') {
            if (style[0] === '.') {
              // it' a class -> add to the class-storage
              colorClass[_code] = style.substring(1); // remove dot
            } else {
              // its' just a string- assume it's a color
              styles[_code] = style;
            }
          } else {
            styles[_code] = '#000';
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    return {
      styles: styles,
      colorClass: colorClass
    };
  },
  render: function render(code, value, _ref) {
    var styles = _ref.styles,
        colorClass = _ref.colorClass;
    return "<span".concat(generateClassAttribute(colorClass, code)).concat(generateColorAttribute(styles, code), ">").concat(value, "</span>");
  }
});
var _default = renderToHTML;
exports.default = _default;