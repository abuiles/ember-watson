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
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app';
    watson.transformPrototypeExtensions(path);
  }
};
