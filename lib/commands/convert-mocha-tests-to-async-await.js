'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:convert-mocha-tests-to-async-await',
  description: 'Convert mocha tests to use async/await',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'tests';
    watson.transformMochaToAsync(path, commandOptions.dryRun);
  }
};
