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
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(options) {
    watson.transformQUnitTest(options.testsPath, options.dryRun);
    watson.transformPrototypeExtensions(options.appPath, options.dryRun);
    watson.transformEmberDataModelLookups(options.appPath, options.dryRun);
    watson.transformEmberDataAsyncFalseRelationships(options.appPath, options.dryRun);
    watson.transformResourceRouterMapping(options.routerPath, options.dryRun);
    watson.transformMethodify(options.appPath, options.dryRun);
    watson.findOverloadedCPs(options.appPath, options.dryRun).outputSummary(options.output);
    watson.transformTestToUseDestroyApp(options.acceptancePath, options.dryRun);
    watson.replaceNeedsWithInjection(options.controllersPath, options.dryRun);
    watson.removeEmberDataIsNewSerializerAPI(options.appPath, options.dryRun);
  }
};
