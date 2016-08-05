'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:find-overloaded-cps',
  description: 'This lists all the places that will trigger the "Using the same function as getter and setter" deprecation.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  availableOptions: [
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app';
    var reportFormat = commandOptions.json ? 'json' : 'pretty';
    watson.findOverloadedCPs(path, commandOptions.dryRun).outputSummary(reportFormat);
  }
};
