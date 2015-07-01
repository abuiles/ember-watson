'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:convert-resource-router-mapping',
  description: 'Convert the resource router mapping to use the route mapping with the new resetNamespace option',
  works: 'insideProject',
  anonymousOptions: [
    '<routerPath>'
  ],
  run: function(commandOptions, rawArgs) {
    var path = rawArgs[0] ||  'app/router.js';
    watson.transformResourceRouterMapping(path);
  }
};
