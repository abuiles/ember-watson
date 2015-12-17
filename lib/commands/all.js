'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:all',
  description: 'Performs all available Watson commands on a project.',
  works: 'insideProject',
  availableOptions: [
    { name: 'app-path', type: String, description: 'Path to app directory.', default: 'app' },
    { name: 'tests-path', type: String, description: 'Path to tests directory.', default: 'tests' },
    { name: 'router-path', type: String, description: 'Path to router file.', default: 'app/router.js' },
    { name: 'output', type: String, description: 'Output format: pretty or json.', default: 'pretty' },
    { name: 'acceptance-path', type: String, description: 'Path to acceptance tests directory.', default: 'tests/acceptance' },
    { name: 'controllers-path', type: String, description: 'Path to controllers directory.', default: 'app/controllers' },
  ],
  run: function(options) {
    watson.transformQUnitTest(options.testsPath);
    watson.transformPrototypeExtensions(options.appPath);
    watson.transformEmberDataModelLookups(options.appPath);
    watson.transformEmberDataAsyncFalseRelationships(options.appPath);
    watson.transformResourceRouterMapping(options.routerPath);
    watson.transformMethodify(options.appPath);
    watson.findOverloadedCPs(options.appPath).outputSummary(options.output);
    watson.transformTestToUseDestroyApp(options.acceptancePath);
    watson.replaceNeedsWithInjection(options.controllersPath);
  }
};
