"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var _default = convertAscii;
exports.default = _default;