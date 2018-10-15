"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "convert", {
  enumerable: true,
  get: function get() {
    return _porter.default;
  }
});
Object.defineProperty(exports, "buildRenderer", {
  enumerable: true,
  get: function get() {
    return _renderer.default;
  }
});
Object.defineProperty(exports, "renderToHTML", {
  enumerable: true,
  get: function get() {
    return _html.default;
  }
});
Object.defineProperty(exports, "renderToTTY", {
  enumerable: true,
  get: function get() {
    return _tty.default;
  }
});
exports.default = void 0;

var _porter = _interopRequireDefault(require("./lib/porter"));

var _renderer = _interopRequireDefault(require("./lib/renderer"));

var _html = _interopRequireDefault(require("./lib/formats/html"));

var _tty = _interopRequireDefault(require("./lib/formats/tty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  convert: _porter.default,
  buildRenderer: _renderer.default,
  renderToHTML: _html.default,
  renderToTTY: _tty.default
};
exports.default = _default;

if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
  window.jsAscii = exports;
}

