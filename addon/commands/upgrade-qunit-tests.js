'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:upgrade-qunit-tests',
  description: 'Fix QUnit tests to match 2.0 syntax.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'tests';
    watson.transformQUnitTest(path);
  }
};
