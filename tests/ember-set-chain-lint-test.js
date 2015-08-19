'use strict';

var fs     = require('fs');
var assert = require('assert');
var Watson = require('../index.js');

describe('ember set chaining lint', function() {
  var watson;

  function readFixture(path) {
    var base = './tests/fixtures/ember-set-chain/';
    return fs.readFileSync(base + path, { encoding: 'utf8' });
  }

  beforeEach(function() {
    watson = new Watson();
  });

  it('reports `set` chaining', function() {
    var source = readFixture('basic.js');
    var expectedOutput = readFixture('basic.out');
    var actualOutput = watson._lintEmberSetChain(source).join('\n');
    assert.equal(actualOutput, expectedOutput);
  });

  it('reports multiline `set` chaining', function() {
    var source = readFixture('multiline.js');
    var expectedOutput = readFixture('multiline.out');
    var actualOutput = watson._lintEmberSetChain(source).join('\n');
    assert.equal(actualOutput, expectedOutput);
  });
});
