'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'upgrade-qunit-tests',
  description: 'Fix QUnit tests to match 2.0 syntax.',
  works: 'insideProject',

  run: function(commandOptions, rawArgs) {
    watson.transformQUnitTest('tests');
  }
};
