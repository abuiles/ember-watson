'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:methodify',
  description: 'Convert methods to new ES6 syntax.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] || 'app';
    watson.transformMethodify(path, commandOptions.dryRun);
  }
};
