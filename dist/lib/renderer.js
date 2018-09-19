"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeAsciiData = serializeAsciiData;
exports.buildAsciiRenderer = buildAsciiRenderer;
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  var string = JSON.stringify(jsAsciiArray);
  var regexp = /\$\{c(\d+)\}/g;
  var matches = {};
  var match = null;

  while ((match = regexp.exec(string)) !== null) {
    if (!matches[match[1]]) matches[match[1]] = true;
  }

  return Object.keys(matches).map(function (v) {
    return parseInt(v, 10);
  });
}
/**
 * A replacement for native non-standard String.repeat
 * @param  {String} string the string to repeat
 * @param  {Number} [times=1] The number of times to repeat the provided string
 * @return {String} The repeated string
 */


function repeatString(string) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var buffer = '';
  var i = times;

  while (times--) {
    buffer += string;
  }

  return buffer;
}
/**
 * Converts a jsAscii formatted array to it's serialized String value
 * @param  {Array} asciiData the jsAscii format
 * @param  {String} [breakline='\n'] the default line break used
 * @param  {String} [fill=null] if specified, the first character will be used
 *   to populate any existant non-whitespace
 * @return {String} The serialzied string value
 */


function serializeAsciiData(asciiData) {
  var breakline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\n';
  var fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var chunks = [];
  var index = 0;
  var node = null;
  var fillChar = typeof fill === 'string' && fill.length ? fill[0] : null;
  var handleString = fillChar ? // replace all non-code substrings with the fill character
  function (node) {
    return node.replace(/(\${c\d+})|./g, function (_, codes) {
      return codes ? codes : fillChar;
    });
  } : // direct passthrough of node value
  function (node) {
    return node;
  };
  var handleArray = fillChar ? // repeat fill character for duplicates
  function (node) {
    return fillChar.repeat(node[0]);
  } : // repeat specific character
  function (node) {
    return node[1].repeat(node[0]);
  };

  do {
    node = asciiData[index];

    switch (_typeof(node)) {
      case 'string':
        chunks.push(handleString(node));
        break;

      case 'number':
        // if the node is simply 0, treat it as a breakline,
        // otherwise treat it as whitespace
        chunks.push(node > 0 ? repeatString(' ', node) : breakline);
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
  if (!parameters || _typeof(parameters) !== 'object') {
    throw new TypeError("You must specify valid parameters as an object");
  } // TODO: validate build props


  var breakline = parameters.breakline,
      prepareScope = parameters.prepareScope,
      render = parameters.render;
  return function generateString(asciiData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var colorCodes = extractColorCodes(asciiData);
    var renderScope = prepareScope(options, colorCodes); // change rendering if style.block is set (only use first char)

    var renderBlock = typeof options.block === "string" ? options.block[0] : null; // split into pairs at color values (first value is blank)

    var splitOutput = serializeAsciiData(asciiData, breakline, renderBlock).split(/(\$\{c\d+\})/g);
    var output = '';
    var index = 0;
    var code = ''; // start iteration (skipping the first empty item)

    while (++index != splitOutput.length) {
      // only process odd indexes (simulate array chunking)
      if (index % 2 == 0) continue;
      code = splitOutput[index].match(/\$\{c(\d+)\}/)[1];
      output += render(code, splitOutput[index + 1], renderScope);
    }

    return output;
  };
}

var _default = buildAsciiRenderer;
exports.default = _default;