"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var jsAscii = function (exports) {
  'use strict';
  /**
   * Created by Flynn Buckingham (https://github.com/flynnham) on 21/05/17.
   */

  function convertAscii(inputString) {
    var compressThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    var parsedLines = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = inputString.split(/(?:\r\n|\r|\n)/g)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var line = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = line.split(/(\s+)/)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var part = _step2.value;

            if (!part.replace(/\s/g, '').length) {
              // check if the node is empty (including whitespace)
              // only push if has more than one space
              if (part.length > 0) parsedLines.push(part.length);
            } else {
              // add the part
              parsedLines.push(part);
            }
          } // add breakline

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

        parsedLines.push(0);
      } // remove last 0 (breakline) from the output

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

    parsedLines.pop();
    var heavy = JSON.stringify(parsedLines).replace(/,\d+,0,/g, ',0,'); // removes tailing whitespace (ex: [,,100,0,,,] removes 100)

    var compressor = new RegExp("(.)\\1{".concat(compressThreshold, "}"), 'g');
    var compressed = heavy // array replace
    .replace(compressor, function (match) {
      return "\",[".concat(match.length, ",\"").concat(match[0], "\"]\"");
    }) // broken array fix
    .replace(/\"\]\"/g, '"],"') // empty string removal
    .replace(/\,\"\"\,/g, ',');
    return {
      heavy: JSON.parse(heavy),
      compressed: JSON.parse(compressed)
    };
  }
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

  var generateClassAttribute = function generateClassAttribute(colorClass, code) {
    return typeof colorClass[code] === 'string' ? " class=\"".concat(colorClass[code], "\"") : '';
  };

  var generateColorAttribute = function generateColorAttribute(styles, code) {
    return typeof styles[code] === 'string' ? " styles=\"color:".concat(styles[code], "\"") : '';
  };

  var renderToHTML = buildAsciiRenderer({
    breakline: '<br>',
    prepareScope: function prepareScope(options, colorCodes) {
      var styles = {};
      var colorClass = {};

      if (typeof options.singleColor === 'string') {
        // set as single color
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = colorCodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var code = _step3.value;
            styles[code] = options.singleColor;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        var customStyles = options.styles || {};
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = colorCodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _code = _step4.value;
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
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
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

  var renderToTTY = buildAsciiRenderer({
    prepareScope: function prepareScope(options, colorCodes) {
      var customStyles = options.styles || {};
      var styles = {};
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = colorCodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var code = _step5.value;
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
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return {
        styles: styles
      };
    },
    render: function render(code, value, _ref2) {
      var styles = _ref2.styles;
      return "".concat(segment(styles[code])).concat(value);
    }
  });
  var source = {
    convert: convertAscii,
    buildRenderer: buildAsciiRenderer,
    renderToHTML: renderToHTML,
    renderToTTY: renderToTTY
  };
  exports.convert = convertAscii;
  exports.buildRenderer = buildAsciiRenderer;
  exports.renderToHTML = renderToHTML;
  exports.renderToTTY = renderToTTY;
  exports.default = source;
  return exports;
}({});

