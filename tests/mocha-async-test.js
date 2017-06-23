'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');

describe('Mocha async transformation', function() {
  var baseDir = './tests/fixtures/convert-mocha-tests-to-async-await';
  var watson;

  beforeEach(function() {
    watson = new Watson();
  });

  it('transforms async acceptance test using `done()` callback', function() {
    var source            = fs.readFileSync(baseDir + '/old-acceptance-test-with-done.js');
    var newSource         = watson._transformMochaToAsync(source);
    var expectedNewSource = fs.readFileSync(baseDir + '/new-acceptance-test-with-done.js');

    astEquality(newSource, expectedNewSource);
  });

  it('transforms async acceptance test without `done()`', function() {
    var source            = fs.readFileSync(baseDir + '/old-acceptance-test-without-done.js');
    var newSource         = watson._transformMochaToAsync(source);
    var expectedNewSource = fs.readFileSync(baseDir + '/new-acceptance-test-without-done.js');

    astEquality(newSource, expectedNewSource);
  });

  it('transforms async acceptance test nested `andThen`s', function() {
    var source            = fs.readFileSync(baseDir + '/old-acceptance-test-with-nested-andthen.js');
    var newSource         = watson._transformMochaToAsync(source);
    var expectedNewSource = fs.readFileSync(baseDir + '/new-acceptance-test-with-nested-andthen.js');

    astEquality(newSource, expectedNewSource);
  });

  it('leaves synchronous tests as-is', function() {
    var source            = fs.readFileSync(baseDir + '/acceptance-test-synchronous.js');
    var newSource         = watson._transformMochaToAsync(source);
    var expectedNewSource = fs.readFileSync(baseDir + '/acceptance-test-synchronous.js');

    astEquality(newSource, expectedNewSource);
  });

  it('leaves `done` callback as-is when used outside of `andThen`', function() {
    var source            = fs.readFileSync(baseDir + '/old-acceptance-test-with-callback.js');
    var newSource         = watson._transformMochaToAsync(source);
    var expectedNewSource = fs.readFileSync(baseDir + '/new-acceptance-test-with-callback.js');

    astEquality(newSource, expectedNewSource);
  });
});
