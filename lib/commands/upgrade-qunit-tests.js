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
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'tests';
    watson.transformQUnitTest(path, commandOptions.dryRun);
  }
};
