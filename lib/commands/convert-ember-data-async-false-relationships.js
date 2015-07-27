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
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app';
    watson.transformEmberDataAsyncFalseRelationships(path);
  }
};
