'use strict';

var Watson = require('../../index');

module.exports = {
  name: 'watson:remove-ember-data-is-new-serializer-api',
  description: 'Removes `isNewSerializerAPI` from serialiers',
  works: ['insideProject'],
  anonymousOptions: [
    '<path>'
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] || 'app';
  }
};
