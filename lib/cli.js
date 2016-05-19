'use strict';

var program = require('commander');
var Watson = require('./watson');
var watson = new Watson();
var version = require('../package.json').version;
var supportedCommands = ['upgrade-qunit-tests', 'convert-prototype-extensions',
                      'convert-prototype-extensions', 'convert-ember-data-model-lookups',
                      'convert-ember-data-async-false-relationships', 'convert-resource-router-mapping',
                      'methodify', 'find-overloaded-cps', 'use-destroy-app-helper'
                    ];

var isSupportedCommands = function(command) {

  for (var i = 0; i < supportedCommands.length; i++) {
    if (command === supportedCommands[i]) {
      return true;
    }
  }

  return false;
};

program
  .version(version);

program
  .arguments('<cmd>')
  .action(function(cmd) {
    if (!isSupportedCommands(cmd)) {
      console.error('The command is not supported, Use the below supported commands');
      program.outputHelp();
      process.exit(1);
    }
  });

program
  .command('upgrade-qunit-tests [testsPath]')
  .description('Fix QUnit tests to match 2.0 syntax. testsPath defaults to tests/')
  .action(function(testsPath) {
    testsPath = testsPath || 'tests';
    watson.transformQUnitTest(testsPath);
  });

program
  .command('convert-prototype-extensions [appPath]')
  .description('Convert computed properties and observers to not use prototype extensions. appPath defaults to app/')
  .action(function(appPath) {
    appPath = appPath || 'app';
    watson.transformPrototypeExtensions(appPath);
  });

program
  .command('convert-ember-data-model-lookups [appPath]')
  .description('convert Ember Data model lookups to use a dasherized string')
  .action(function(appPath) {
    appPath = appPath || 'app';
    watson.transformEmberDataModelLookups(appPath);
  });

program
  .command('convert-ember-data-async-false-relationships [appPath]')
  .description('convert Ember Data relationship with implicit async: false to explicit option')
  .action(function(appPath) {
    appPath = appPath || 'app';
    watson.transformEmberDataAsyncFalseRelationships(appPath);
  });

program
  .command('convert-resource-router-mapping [routerPath]')
  .description('convert the resource router mapping to use the route mapping with the new resetNamespace option')
  .action(function(routerPath) {
    routerPath = routerPath || 'app/router.js';
    watson.transformResourceRouterMapping(routerPath);
  });

program
  .command('methodify [path]')
  .description('Convert methods to new ES6 syntax')
  .action(function(path) {
    path = path || 'app';
    watson.transformMethodify(path);
  });

program
  .command('find-overloaded-cps [path]')
  .option('-j, --json', 'Output in JSON instead of pretty print.')
  .description('This lists all the places that will trigger the "Using the same function as getter and setter" deprecation.')
  .action(function(path, options) {
    path = path || 'app';
    watson.findOverloadedCPs(path).outputSummary(options.json ? 'json' : 'pretty');
  });

program
  .command('use-destroy-app-helper [path]')
  .description('Use destroy-app helper after acceptance tests.')
  .action(function(path) {
    path = path || 'tests/acceptance';
    watson.transformTestToUseDestroyApp(path);
  });

program
  .command('replace-needs-with-injection [path]')
  .description('Replace needs with controller injection.')
  .action(function(path) {
    path = path || 'app/controllers';
    watson.replaceNeedsWithInjection(path);
  });

program
  .command('remove-ember-data-is-new-serializer-api [path]')
  .description('Remove `isNewSerializerAPI` in Ember Data serializers.')
  .action(function(path) {
    path = path || 'app/serializers';
    watson.removeEmberDataIsNewSerializerAPI(path);
  });

program
  .command('all')
  .option('--tests-path [path]', 'Path to tests directory.', 'tests')
  .option('--app-path [path]', 'Path to app directory.', 'app')
  .option('--router-path [path]', 'Path to router file.', 'app/router.js')
  .option('--acceptance-path [path]', 'Path to acceptance tests directory.', 'tests/acceptance')
  .option('--controllers-path [path]', 'Path to controllers directory.', 'app/controllers')
  .option('--serializers-path [path]', 'Path to serializers directory.', 'app/serializers')
  .option('--output [format]', 'Output format: pretty or json.', 'pretty')
  .description('Run all commands.')
  .action(function(options) {
    watson.transformQUnitTest(options.testsPath);
    watson.transformPrototypeExtensions(options.appPath);
    watson.transformEmberDataModelLookups(options.appPath);
    watson.transformEmberDataAsyncFalseRelationships(options.appPath);
    watson.transformResourceRouterMapping(options.routerPath);
    watson.transformMethodify(options.appPath);
    watson.findOverloadedCPs(options.appPath).outputSummary(options.output);
    watson.transformTestToUseDestroyApp(options.acceptancePath);
    watson.replaceNeedsWithInjection(options.controllersPath);
    watson.removeEmberDataIsNewSerializerAPI(options.serializersPath);
  });

module.exports = function init(args) {
  program.parse(args);
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};
