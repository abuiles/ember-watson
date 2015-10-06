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
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] || 'app/controllers';
    watson.replaceNeedsWithInjection(path);
  }
};
