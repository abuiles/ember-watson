'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:replace-needs-with-injection',
  description: 'Replace needs with controller injection.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] || 'app/controllers';
    watson.replaceNeedsWithInjection(path, commandOptions.dryRun);
  }
};
