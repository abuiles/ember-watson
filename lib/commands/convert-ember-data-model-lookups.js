'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:convert-ember-data-model-lookups',
  description: 'Convert ember data model lookups to use a dasherized string',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app';
    watson.transformEmberDataModelLookups(path, commandOptions.dryRun);
  }
};
