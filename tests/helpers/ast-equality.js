// Based on Stefan Penner's
// https://github.com/stefanpenner/esprima-ast-equality
// only replacing esprima by recast.

function EqualityError(message, actual, expected) {
  this.message = message;
  this.actual = actual;
  this.expected = expected;
  this.showDiff = true;
  Error.captureStackTrace(this, module.exports);
}

EqualityError.prototype = Object.create(Error.prototype);
EqualityError.prototype.name = 'EqualityError';
EqualityError.prototype.constructor = EqualityError;

var assert = require('assert');
var recast = require('recast');

module.exports = function(actual, expected, message) {
  var parsedActual   = recast.parse(actual);
  var parsedExpected = recast.parse(expected);

  var seemEqual = JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);

  if (!seemEqual) {
    throw new EqualityError(message || "AST equality failed",
      parsedActual,
      parsedExpected
    );
  }
};
