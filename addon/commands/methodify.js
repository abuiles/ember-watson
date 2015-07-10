'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:methodify',
  description: 'Convert methods to new ES6 syntax.',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs || 'app';
    watson.transformMethodify(path);
  }
};
