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
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] || 'tests/acceptance';
    watson.transformTestToUseDestroyApp(path);
  }
};
