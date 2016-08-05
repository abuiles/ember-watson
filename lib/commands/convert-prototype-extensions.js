'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:convert-prototype-extensions',
  description: 'Convert computed properties and observers to not use prototype extensions.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app';
    watson.transformPrototypeExtensions(path, commandOptions.dryRun);
  }
};
