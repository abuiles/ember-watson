'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:use-destroy-app-helper',
  description: 'Use destroy-app helper after acceptance tests.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] || 'tests/acceptance';
    watson.transformTestToUseDestroyApp(path, commandOptions.dryRun);
  }
};
