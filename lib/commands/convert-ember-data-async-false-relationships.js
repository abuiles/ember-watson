'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:convert-ember-data-async-false-relationships',
  description: 'Include explicit async false option to relationships implicitly being synced',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app';
    watson.transformEmberDataAsyncFalseRelationships(path, commandOptions.dryRun);
  }
};
