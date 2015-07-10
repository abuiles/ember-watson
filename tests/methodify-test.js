'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');

describe('convert methods to ES6 syntax', function() {
  var baseDir = './tests/fixtures/methodify';
  var watson;

  beforeEach(function() {
    watson = new Watson();
  });

  it('converts to ES6 method syntax', function() {
    var source = fs.readFileSync(baseDir + '/object-old.js');
    var newSource = watson._transformMethodify(source);
    var expectedNewSource = fs.readFileSync(baseDir + '/object-new.js');

    astEquality(newSource, expectedNewSource);
  });
});
