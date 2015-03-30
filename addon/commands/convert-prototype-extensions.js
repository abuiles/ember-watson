'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'convert-prototype-extensions',
  description: 'Convert computed properties and observers to not use prototype extensions.',
  works: 'insideProject',
  availableOptions: [
    {
      name: 'app-path',
      type: String,
      default: 'app'
    }
  ],

  run: function(commandOptions, rawArgs) {
    watson.transformPrototypeExtensions(commandOptions.appPath);
  }
};
